import { NextResponse } from 'next/server';
import { getProducts, saveProduct } from '@/lib/catalog';
import { db, isDatabaseConfigured } from '@/lib/db';
import { requireAdmin } from '@/lib/adminAuth';
import type { Product } from '@/types';

export async function GET() {
  return NextResponse.json({ products: await getProducts(), persistent: isDatabaseConfigured() });
}
export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isDatabaseConfigured()) return NextResponse.json({ error: 'Database belum dikonfigurasi.' }, { status: 503 });
  const product = (await req.json()) as Product;
  if (!product?.id || !product?.slug || !product?.title || !Number.isInteger(product.price) || product.price < 1000)
    return NextResponse.json({ error: 'Data produk tidak valid.' }, { status: 400 });
  await saveProduct(product);
  return NextResponse.json({ product });
}
export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID wajib diisi.' }, { status: 400 });
  await db.remove('products', `id=eq.${encodeURIComponent(id)}`);
  return NextResponse.json({ success: true });
}
