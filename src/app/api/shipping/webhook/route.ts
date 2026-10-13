import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log('KiriminAja Webhook Payload Diterima:', JSON.stringify(payload, null, 2));

    // KiriminAja mengirim update tracking status resi (e.g. PICKUP, ON_PROCESS, DELIVERED)
    const { order_id, awb, status } = payload;
    console.log(`📦 Update Resi KiriminAja: Pesanan #${order_id} - Resi ${awb} status: ${status}`);

    return NextResponse.json({
      status: true,
      message: 'Webhook tracking KiriminAja berhasil diterima',
    });
  } catch (error: any) {
    console.error('Error saat memproses webhook KiriminAja:', error);
    return NextResponse.json(
      { status: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: 'https://toko.zaidly.com/api/shipping/webhook',
    message: 'Endpoint Webhook KiriminAja toko.zaidly.com siap menerima status ekspedisi.',
  });
}
