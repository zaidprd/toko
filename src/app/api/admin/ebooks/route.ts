import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireAdmin } from '@/lib/adminAuth';
import { db } from '@/lib/db';
import { safePdfName, signedR2Url } from '@/lib/r2';

const MAX_PDF = 50 * 1024 * 1024;

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const productId = String(body.productId || '');
  const fileName = safePdfName(String(body.fileName || 'ebook.pdf'));
  const size = Number(body.size);
  if (!productId || !Number.isSafeInteger(size) || size < 1 || size > MAX_PDF || body.type !== 'application/pdf')
    return NextResponse.json({ error: 'PDF tidak valid atau lebih dari 50 MB.' }, { status: 400 });
  const objectKey = `ebooks/${productId}/${crypto.randomUUID()}-${fileName}`;
  return NextResponse.json({ objectKey, uploadUrl: signedR2Url('PUT', objectKey, 900) });
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (!body.productId || !String(body.objectKey).startsWith(`ebooks/${body.productId}/`))
    return NextResponse.json({ error: 'Metadata file tidak valid.' }, { status: 400 });
  await db.insert('ebook_files', {
    product_id: body.productId, object_key: body.objectKey,
    file_name: safePdfName(String(body.fileName)), size_bytes: Number(body.size),
    mayar_delivery_url: body.mayarDeliveryUrl || null,
  }, 'product_id');
  return NextResponse.json({ success: true });
}
