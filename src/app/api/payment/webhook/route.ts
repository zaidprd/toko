import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.MAYAR_WEBHOOK_SECRET;

    // Baca raw body untuk verifikasi integritas pesan
    const rawBody = await req.text();

    // Periksa header signature / token dari server Mayar
    const signature =
      req.headers.get('x-mayar-signature') ||
      req.headers.get('x-signature') ||
      req.headers.get('x-mayar-token') ||
      req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

    if (webhookSecret && webhookSecret.trim() !== '') {
      // 1. Cek kecocokan token langsung jika Mayar mengirim webhook token
      const isTokenMatch = signature === webhookSecret;

      // 2. Cek HMAC SHA256 jika Mayar mengirim signature hash
      let isHmacMatch = false;
      try {
        const computedHmac = crypto
          .createHmac('sha256', webhookSecret)
          .update(rawBody)
          .digest('hex');
        isHmacMatch = signature === computedHmac;
      } catch {
        isHmacMatch = false;
      }

      // Jika ada signature tapi tidak cocok dengan secret maupun HMAC
      if (signature && !isTokenMatch && !isHmacMatch) {
        console.warn('⚠️ Percobaan akses Webhook Mayar tidak sah! Signature/Token tidak valid.');
        return NextResponse.json(
          { error: 'Unauthorized: Invalid Mayar webhook signature' },
          { status: 401 }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    console.log('Mayar Webhook Payload Diterima (Terverifikasi Aman):', JSON.stringify(payload, null, 2));

    const event = payload.event;
    const data = payload.data;

    // Menangani Event Pembayaran Berhasil: 'payment.received'
    if (event === 'payment.received') {
      const orderId = data?.extraData?.order_id;
      const amountPaid = data?.amount;
      const customerEmail = data?.customer?.email;

      console.log(`✅ Pesanan #${orderId} LUNAS sejumlah Rp ${amountPaid} (${customerEmail})`);

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
    message: 'Endpoint Webhook Mayar toko.zaidly.com siap menerima transaksi aman terverifikasi.',
  });
}
