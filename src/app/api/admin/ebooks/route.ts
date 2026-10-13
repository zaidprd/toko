import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireAdmin } from '@/lib/adminAuth';
import { db } from '@/lib/db';
import { safePdfName, signedR2Url } from '@/lib/r2';

const MAX_PDF = 50 * 1024 * 1024; // 50 MB

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const contentType = req.headers.get('content-type') || '';

  // Mode 1: Upload via FormData (Server-Side Proxy ke Cloudflare R2 - BEBAS CORS 100%)
  if (contentType.includes('multipart/form-data')) {
    try {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const productId = String(formData.get('productId') || '').trim();
      const mayarDeliveryUrl = String(formData.get('mayarDeliveryUrl') || '').trim();

      if (!productId) {
        return NextResponse.json({ error: 'Product ID wajib diisi.' }, { status: 400 });
      }
      if (!file || !(file instanceof Blob)) {
        return NextResponse.json({ error: 'Berkas PDF tidak ditemukan.' }, { status: 400 });
      }

      const fileName = safePdfName(file.name || 'ebook.pdf');
      const size = file.size;

      if (size < 1 || size > MAX_PDF) {
        return NextResponse.json({ error: 'Ukuran PDF tidak boleh lebih dari 50 MB.' }, { status: 400 });
      }

      const objectKey = `ebooks/${productId}/${crypto.randomUUID()}-${fileName}`;
      const putUrl = signedR2Url('PUT', objectKey, 900);

      // Upload langsung dari Server Node.js ke Cloudflare R2 (Bypass browser CORS check)
      const buffer = Buffer.from(await file.arrayBuffer());
      const r2Res = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/pdf',
        },
        body: buffer,
      });

      if (!r2Res.ok) {
        console.error('R2 upload failed:', r2Res.status, await r2Res.text().catch(() => ''));
        return NextResponse.json({ error: 'Gagal mengunggah berkas ebook.' }, { status: 502 });
      }

      // Simpan metadata ke tabel Supabase `ebook_files`
      await db.insert('ebook_files', {
        product_id: productId,
        object_key: objectKey,
        file_name: fileName,
        size_bytes: size,
        mayar_delivery_url: mayarDeliveryUrl || null,
        updated_at: new Date().toISOString(),
      }, 'product_id');

      return NextResponse.json({
        success: true,
        objectKey,
        fileName,
        size,
      });
    } catch (err: any) {
      console.error('Upload handler error:', err);
      return NextResponse.json({ error: err.message || 'Gagal memproses upload file.' }, { status: 500 });
    }
  }

  // Mode 2: Presigned URL generator (opsional untuk direct PUT browser jika CORS R2 sudah diizinkan)
  const body = await req.json().catch(() => ({}));
  const productId = String(body.productId || '');
  const fileName = safePdfName(String(body.fileName || 'ebook.pdf'));
  const size = Number(body.size);

  if (!productId || !Number.isSafeInteger(size) || size < 1 || size > MAX_PDF) {
    return NextResponse.json({ error: 'PDF tidak valid atau lebih dari 50 MB.' }, { status: 400 });
  }

  const objectKey = `ebooks/${productId}/${crypto.randomUUID()}-${fileName}`;
  return NextResponse.json({ objectKey, uploadUrl: signedR2Url('PUT', objectKey, 900) });
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  if (!body.productId || !String(body.objectKey).startsWith(`ebooks/${body.productId}/`)) {
    return NextResponse.json({ error: 'Metadata file tidak valid.' }, { status: 400 });
  }

  await db.insert('ebook_files', {
    product_id: body.productId,
    object_key: body.objectKey,
    file_name: safePdfName(String(body.fileName)),
    size_bytes: Number(body.size),
    mayar_delivery_url: body.mayarDeliveryUrl || null,
    updated_at: new Date().toISOString(),
  }, 'product_id');

  return NextResponse.json({ success: true });
}
