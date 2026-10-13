import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { destinationSubdistrictId, weightGrams } = await req.json();

    const apiKey = process.env.KIRIMINAJA_API_KEY;
    const baseUrl = process.env.KIRIMINAJA_BASE_URL || 'https://tdev.kiriminaja.com';

    // Jika API Key belum terpasang, gunakan data simulasi fallback yang rapi
    if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_kiriminaja')) {
      return NextResponse.json({
        isSimulation: true,
        rates: [
          { courierCode: 'JNT', courierName: 'J&T Express', service: 'EZ (Reguler)', etd: '1-2 Hari', cost: 11000 },
          { courierCode: 'SICEPAT', courierName: 'SiCepat Ekspres', service: 'REG (Reguler Cepat)', etd: '1-2 Hari', cost: 12000 },
          { courierCode: 'JNE', courierName: 'JNE Express', service: 'REG (Reguler)', etd: '2-3 Hari', cost: 13000 },
        ],
      });
    }

    // Panggil Endpoint Cek Ongkir Resmi KiriminAja
    // Origin default dari toko Anda (misal ID Kecamatan Depok, Sleman: 5771 atau ID lokasi Anda)
    const originId = process.env.KIRIMINAJA_ORIGIN_ID || 5771;

    const response = await fetch(`${baseUrl}/api/mitra/v2/shipping_price`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        origin: Number(originId),
        destination: Number(destinationSubdistrictId || 5771),
        weight: Number(weightGrams || 1000),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('KiriminAja Cost Error:', data);
      return NextResponse.json({ isSimulation: true, error: data.message });
    }

    return NextResponse.json({
      isSimulation: false,
      rates: data.data || [],
    });
  } catch (error: any) {
    console.error('Error saat menghubungi KiriminAja:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
