import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log('Mayar Webhook Payload Diterima:', JSON.stringify(payload, null, 2));

    const event = payload.event;
    const data = payload.data;

    // Menangani Event Pembayaran Berhasil: 'payment.received'
    if (event === 'payment.received') {
      const orderId = data?.extraData?.order_id;
      const amountPaid = data?.amount;
      const customerEmail = data?.customer?.email;

      console.log(`✅ Pesanan #${orderId} LUNAS sejumlah Rp ${amountPaid} (${customerEmail})`);

      // Di sini bisa ditambahkan:
      // 1. Update status pesanan di database menjadi 'PAID'
      // 2. Jika ada barang fisik: Panggil API KiriminAja untuk generate AWB resi
      // 3. Jika ada ebook: Kirimkan email/WA tautan unduh instan ke pelanggan

      return NextResponse.json({
        status: 'success',
        message: `Pembayaran pesanan #${orderId} berhasil diproses.`,
      });
    }

    return NextResponse.json({
      status: 'ignored',
      message: `Event '${event}' diabaikan.`,
    });
  } catch (error: any) {
    console.error('Error saat memproses webhook Mayar:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: 'https://toko.zaidly.com/api/payment/webhook',
    message: 'Endpoint Webhook Mayar toko.zaidly.com siap menerima transaksi.',
  });
}
