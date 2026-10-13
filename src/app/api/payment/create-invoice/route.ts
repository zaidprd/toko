import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, customer, items, shippingCost, grandTotal } = body;

    const apiKey = process.env.MAYAR_API_KEY;
    const apiUrl = process.env.MAYAR_API_URL || 'https://api.mayar.id/hl/v1';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://toko.zaidly.com';

    // Jika API Key belum diatur, beri tahu frontend untuk menggunakan mode simulasi
    if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_mayar')) {
      return NextResponse.json({
        isSimulation: true,
        message: 'Menggunakan mode simulator interaktif (MAYAR_API_KEY belum diisi).',
        orderId,
        paymentUrl: null,
      });
    }

    // Format item untuk API Mayar.id
    const mayarItems = items.map((item: any) => ({
      description: item.product.title.slice(0, 50),
      quantity: item.quantity,
      rate: item.product.price,
    }));

    if (shippingCost && shippingCost > 0) {
      mayarItems.push({
        description: `Ongkir ${customer.courier?.courierName || 'Ekspedisi'} (${customer.courier?.service || 'Reguler'})`,
        quantity: 1,
        rate: shippingCost,
      });
    }

    // Format tanggal kedaluwarsa (24 jam dari sekarang)
    const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Panggil Endpoint Resmi Mayar: POST https://api.mayar.id/hl/v1/invoice/create
    const response = await fetch(`${apiUrl}/invoice/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: customer.fullName,
        email: customer.email,
        mobile: customer.whatsapp.startsWith('0')
          ? `62${customer.whatsapp.slice(1)}`
          : customer.whatsapp,
        redirectUrl: `${appUrl}/lacak?order=${orderId}`,
        description: `Pembayaran Pesanan #${orderId} - toko.zaidly.com`,
        expiredAt,
        items: mayarItems,
        extraData: {
          order_id: orderId,
          customer_whatsapp: customer.whatsapp,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Mayar API Error:', data);
      return NextResponse.json(
        { error: data.messages || 'Gagal membuat tagihan invoice Mayar', data },
        { status: response.status }
      );
    }

    // Kembalikan URL pembayaran resmi Mayar (data.data.link)
    return NextResponse.json({
      isSimulation: false,
      orderId,
      invoiceId: data.data?.id,
      paymentUrl: data.data?.link,
    });
  } catch (error: any) {
    console.error('Error saat menghubungi Mayar:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
