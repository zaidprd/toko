import { NextResponse } from 'next/server';
import { db, isDatabaseConfigured } from '@/lib/db';
import { signedR2Url } from '@/lib/r2';

export async function POST(req: Request) {
  if (!isDatabaseConfigured()) return NextResponse.json({ error: 'Pelacakan belum dikonfigurasi.' }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  const orderId = String(body.orderId || '').trim().slice(0, 50);
  const email = String(body.email || '').trim().toLowerCase().slice(0, 150);
  if (!/^ORD-[A-Z0-9-]+$/.test(orderId) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: 'Nomor pesanan atau email tidak valid.' }, { status: 400 });
  const rows = await db.list<any>('orders', `select=id,status,total,items,shipment,paid_at,created_at&id=eq.${encodeURIComponent(orderId)}&email=eq.${encodeURIComponent(email)}&limit=1`);
  const order = rows[0];
  if (!order) return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
  const downloads: { productId: string; fileName: string; url: string; expiresInMinutes: number }[] = [];
  if (order.status === 'PAID') {
    const productIds = (order.items as any[]).map((item) => item.id).filter(Boolean);
    if (productIds.length) {
      const files = await db.list<any>('ebook_files', `select=product_id,object_key,file_name&product_id=in.(${productIds.map((id) => `"${encodeURIComponent(id)}"`).join(',')})`);
      for (const file of files) downloads.push({ productId: file.product_id, fileName: file.file_name, url: signedR2Url('GET', file.object_key, 600), expiresInMinutes: 10 });
    }
  }
  return NextResponse.json({ order: { id: order.id, status: order.status, total: order.total, paidAt: order.paid_at, createdAt: order.created_at, shipment: order.shipment, downloads } });
}
