import { NextResponse } from 'next/server';
import { db, isDatabaseConfigured } from '@/lib/db';
import { signedR2Url } from '@/lib/r2';

export async function GET(req: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: 'Layanan belum siap.' }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const orderId = String(searchParams.get('orderId') || '').trim();
  const email = String(searchParams.get('email') || '').trim().toLowerCase();
  const productId = String(searchParams.get('productId') || '').trim();

  if (!orderId || !email || !productId) {
    return NextResponse.json({ error: 'Parameter tidak lengkap.' }, { status: 400 });
  }

  const rows = await db.list<any>(
    'orders',
    `select=id,status,items&id=eq.${encodeURIComponent(orderId)}&email=eq.${encodeURIComponent(email)}&limit=1`
  );
  const order = rows[0];
  if (!order || order.status !== 'PAID') {
    return NextResponse.json(
      { error: 'Pesanan belum lunas atau tidak ditemukan.' },
      { status: 403 }
    );
  }

  const hasProduct =
    Array.isArray(order.items) && order.items.some((it: any) => it.id === productId);
  if (!hasProduct) {
    return NextResponse.json(
      { error: 'Produk tidak ditemukan dalam riwayat pesanan ini.' },
      { status: 403 }
    );
  }

  const files = await db.list<any>(
    'ebook_files',
    `select=object_key,file_name&product_id=eq.${encodeURIComponent(productId)}&limit=1`
  );
  const file = files[0];
  if (!file) {
    return NextResponse.json(
      { error: 'Berkas ebook belum disiapkan oleh admin toko.' },
      { status: 404 }
    );
  }

  const directUrl = signedR2Url('GET', file.object_key, 300);
  return NextResponse.redirect(directUrl, { status: 302 });
}
