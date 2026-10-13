import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { calculateShippingRates } from '@/lib/shipping';
import { getProducts } from '@/lib/catalog';
import { db, isDatabaseConfigured } from '@/lib/db';

/**
 * Membuat tagihan Mayar.
 * KEAMANAN: harga produk & ongkir TIDAK dipercaya dari browser. Browser hanya mengirim
 * productId + quantity + courierCode; server mengambil harga dari katalog dan menghitung
 * ulang ongkir sendiri, sehingga harga tidak bisa dimanipulasi lewat DevTools.
 */

const FREE_SHIPPING_MIN = 150000;
const MAX_QTY_PER_ITEM = 50;

interface IncomingItem {
  productId?: string;
  quantity?: number;
  product?: { id?: string }; // kompatibilitas format lama
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function normalizeWhatsapp(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 9 || digits.length > 15) return null;
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('62')) return digits;
  if (digits.startsWith('8')) return `62${digits}`;
  return null;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return badRequest('Permintaan tidak valid.');
  }

  // ---- 1. Validasi data pembeli ----
  const customer = (body.customer || {}) as Record<string, unknown>;
  const fullName = String(customer.fullName || '').trim().slice(0, 100);
  const email = String(customer.email || '').trim().slice(0, 150);
  const whatsapp = normalizeWhatsapp(String(customer.whatsapp || ''));

  if (fullName.length < 2) return badRequest('Nama lengkap wajib diisi.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return badRequest('Format email tidak valid.');
  if (!whatsapp) return badRequest('Nomor WhatsApp tidak valid.');

  // ---- 2. Ambil harga dari katalog server ----
  const rawItems = Array.isArray(body.items) ? (body.items as IncomingItem[]) : [];
  if (rawItems.length === 0 || rawItems.length > 30) return badRequest('Keranjang kosong atau tidak valid.');

  const catalog = await getProducts();
  const lines: { id: string; title: string; price: number; qty: number; weight: number; physical: boolean }[] = [];
  for (const it of rawItems) {
    const productId = String(it.productId || it.product?.id || '');
    const qty = Number(it.quantity);
    const product = catalog.find((p) => p.id === productId);
    if (!product) return badRequest('Ada produk yang tidak tersedia di katalog. Muat ulang halaman lalu coba lagi.');
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY_PER_ITEM) return badRequest('Jumlah produk tidak valid.');
    const physical = product.type !== 'DIGITAL_EBOOK';
    if (physical && typeof product.stock === 'number' && qty > product.stock) {
      return badRequest(`Stok "${product.title}" tidak mencukupi.`);
    }
    lines.push({
      id: product.id,
      title: product.title,
      price: product.price,
      qty,
      weight: product.weightGrams || 400,
      physical,
    });
  }

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const hasPhysical = lines.some((l) => l.physical);

  // ---- 3. Hitung ulang ongkir di server ----
  let shippingCost = 0;
  let courierLabel = '';
  if (hasPhysical) {
    const addressDetail = String(customer.addressDetail || '').trim();
    if (addressDetail.length < 5) return badRequest('Alamat lengkap wajib diisi untuk produk fisik.');

    const courierCode = String(body.courierCode || (customer.courier as { courierCode?: string })?.courierCode || '');
    const weightGrams = lines.filter((l) => l.physical).reduce((s, l) => s + l.weight * l.qty, 0);
    const shipping = await calculateShippingRates({
      destinationProvince: String(customer.province || ''),
      destinationCity: String(customer.city || ''),
      destinationDistrict: String(customer.subdistrict || ''),
      weightGrams,
    });
    const rate = shipping.rates.find((r) => r.courierCode === courierCode);
    if (!rate) return badRequest('Layanan ekspedisi tidak valid. Silakan pilih ulang kurir.');

    courierLabel = `${rate.courierName} (${rate.service})`;
    shippingCost = subtotal >= FREE_SHIPPING_MIN ? 0 : rate.cost;
  }

  const grandTotal = subtotal + shippingCost;
  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://toko.zaidly.com';

  if (!isDatabaseConfigured())
    return NextResponse.json({ error: 'Penyimpanan pesanan belum dikonfigurasi.' }, { status: 503 });

  // Khusus produk gratis (total Rp 0) seperti ebook digital / printable freebie:
  // Tidak perlu tagihan payment gateway Mayar. Langsung set status PAID dan siap diunduh!
  if (grandTotal === 0) {
    try {
      await db.insert('orders', {
        id: orderId,
        email: email.toLowerCase(),
        whatsapp,
        customer: { ...customer, fullName, email, whatsapp },
        items: lines,
        subtotal: 0,
        shipping_cost: 0,
        total: 0,
        status: 'PAID',
        paid_at: new Date().toISOString(),
      });
    } catch (insertErr) {
      console.error('Failed to insert free order:', insertErr);
      return NextResponse.json(
        { error: 'Gagal memproses pesanan gratis di database. Pastikan migrasi batas constraint (total >= 0) sudah dijalankan di Supabase SQL Editor.' },
        { status: 500 }
      );
    }

    const redirectUrl = `${appUrl}/lacak?order=${orderId}&email=${encodeURIComponent(email)}`;
    return NextResponse.json({
      orderId,
      invoiceId: `FREE-${orderId}`,
      paymentUrl: redirectUrl,
      isFree: true,
      subtotal: 0,
      shippingCost: 0,
      grandTotal: 0,
    });
  }

  // ---- 4. Fail closed: produksi maupun development tidak pernah membuat status lunas palsu ----
  const apiKey = process.env.MAYAR_API_KEY;
  const apiUrl = process.env.MAYAR_API_URL || 'https://api.mayar.id/hl/v1';

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_mayar'))
    return NextResponse.json({ error: 'Pembayaran belum dikonfigurasi.' }, { status: 503 });

  await db.insert('orders', {
    id: orderId, email: email.toLowerCase(), whatsapp, customer: { ...customer, fullName, email, whatsapp },
    items: lines, subtotal, shipping_cost: shippingCost, total: grandTotal, status: 'PENDING',
  });

  // ---- 5. Buat tagihan Mayar dengan angka hasil hitungan server ----
  const mayarItems = lines.map((l) => ({
    description: l.title.slice(0, 50),
    quantity: l.qty,
    rate: l.price,
  }));
  if (shippingCost > 0) {
    mayarItems.push({ description: `Ongkir ${courierLabel}`.slice(0, 50), quantity: 1, rate: shippingCost });
  }

  try {
    const invoicePath = apiUrl.includes('/v2') ? '/invoices/create' : '/invoice/create';
    const response = await fetch(`${apiUrl}${invoicePath}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fullName,
        email,
        mobile: whatsapp,
        redirectUrl: `${appUrl}/lacak?order=${orderId}`,
        description: `Pembayaran Pesanan #${orderId} - toko.zaidly.com`,
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        items: mayarItems,
        extraData: { order_id: orderId, customer_whatsapp: whatsapp },
      }),
      signal: AbortSignal.timeout(15000),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data?.data?.link) {
      console.error('Mayar API Error:', response.status, data);
      return NextResponse.json(
        { error: 'Gagal membuat tagihan pembayaran. Silakan coba beberapa saat lagi.' },
        { status: 502 }
      );
    }

    await db.update('orders', `id=eq.${encodeURIComponent(orderId)}`, {
      mayar_invoice_id: data.data.id,
      mayar_transaction_id: data.data.transactionId || null,
      payment_url: data.data.link,
      updated_at: new Date().toISOString(),
    });
    return NextResponse.json({
      orderId,
      invoiceId: data.data.id,
      paymentUrl: data.data.link,
      subtotal,
      shippingCost,
      grandTotal,
    });
  } catch (error) {
    console.error('Error saat menghubungi Mayar:', error);
    return NextResponse.json(
      { error: 'Server pembayaran tidak merespons. Silakan coba lagi.' },
      { status: 502 }
    );
  }
}
