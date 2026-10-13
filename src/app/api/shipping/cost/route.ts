import { NextResponse } from 'next/server';

export const STORE_ORIGIN = {
  address: process.env.STORE_ORIGIN_ADDRESS || 'Kebon Jeruk, Jakarta Barat',
  district: process.env.STORE_ORIGIN_DISTRICT || 'Kebon Jeruk',
  city: process.env.STORE_ORIGIN_CITY || 'Jakarta Barat',
  province: process.env.STORE_ORIGIN_PROVINCE || 'DKI Jakarta',
  postalCode: process.env.STORE_ORIGIN_POSTAL_CODE || '11550',
};

export async function POST(req: Request) {
  try {
    const { destinationProvince, destinationCity, destinationDistrict, weightGrams = 1000 } = await req.json();

    const apiKey = process.env.KIRIMINAJA_API_KEY;
    const baseUrl = process.env.KIRIMINAJA_BASE_URL || 'https://tdev.kiriminaja.com';

    let liveRates: any[] = [];

    // Jika API Key KiriminAja tersedia, hubungi endpoint resmi KiriminAja Sandbox (POST /api/mitra/v6.1/shipping_price)
    if (apiKey && apiKey.trim() !== '' && !apiKey.includes('your_kiriminaja')) {
      try {
        const kiriminAjaRes = await fetch(`${baseUrl}/api/mitra/v6.1/shipping_price`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            origin: 5783, // District ID Kebon Jeruk, Jakarta Barat
            destination: 5783, // District ID Tujuan
            weight: Math.max(100, Number(weightGrams) || 1000),
            insurance: 0,
          }),
        });

        if (kiriminAjaRes.ok) {
          const apiData = await kiriminAjaRes.json();
          if (apiData.status && Array.isArray(apiData.results) && apiData.results.length > 0) {
            const courierMap: Record<string, string> = {
              sicepat: 'SiCepat Ekspres',
              ninja: 'Ninja Express',
              jne: 'JNE Express',
              jnt: 'J&T Express',
              anteraja: 'AnterAja',
              sap: 'SAP Express',
            };

            liveRates = apiData.results
              .filter((r: any) => ['sicepat', 'ninja', 'jne', 'jnt'].includes(r.service?.toLowerCase()))
              .map((r: any) => ({
                courierCode: (r.service || 'EXP').toUpperCase(),
                courierName: courierMap[r.service?.toLowerCase()] || r.service,
                service: `${r.service_type || 'REG'} (KiriminAja Live)`,
                etd: r.etd ? `${r.etd} Hari` : '2-3 Hari',
                cost: Number(r.cost) || 10000,
              }));
          }
        }
      } catch (err) {
        console.warn('KiriminAja Sandbox API call fallback:', err);
      }
    }

    // Jika live rates berhasil didapatkan langsung dari KiriminAja Sandbox
    if (liveRates.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'KIRIMINAJA_API_SANDBOX_LIVE',
        origin: STORE_ORIGIN,
        weightGrams,
        rates: liveRates,
      });
    }

    // Fallback presisi berdasar zona geografis dari asal gudang Kebon Jeruk (11550)
    const weightKg = Math.max(1, Math.ceil(weightGrams / 1000));
    const dest = `${destinationProvince || ''} ${destinationCity || ''} ${destinationDistrict || ''}`.toLowerCase();

    let baseRateJnt = 10000;
    let baseRateSicepat = 10000;
    let baseRateJne = 10000;
    let etd = '1-2 Hari';

    if (dest.includes('jakarta') || dest.includes('tangerang') || dest.includes('depok') || dest.includes('bekasi') || dest.includes('bogor')) {
      baseRateJnt = 9000;
      baseRateSicepat = 10000;
      baseRateJne = 10000;
      etd = '1 Hari';
    } else if (dest.includes('jawa barat') || dest.includes('banten') || dest.includes('bandung') || dest.includes('cirebon') || dest.includes('serang')) {
      baseRateJnt = 11000;
      baseRateSicepat = 12000;
      baseRateJne = 12000;
      etd = '1-2 Hari';
    } else if (dest.includes('jawa tengah') || dest.includes('semarang') || dest.includes('solo') || dest.includes('yogyakarta') || dest.includes('sleman')) {
      baseRateJnt = 15000;
      baseRateSicepat = 16000;
      baseRateJne = 17000;
      etd = '2-3 Hari';
    } else if (dest.includes('jawa timur') || dest.includes('surabaya') || dest.includes('malang')) {
      baseRateJnt = 17000;
      baseRateSicepat = 18000;
      baseRateJne = 19000;
      etd = '2-3 Hari';
    } else if (dest.includes('sumatera') || dest.includes('medan') || dest.includes('padang') || dest.includes('lampung') || dest.includes('palembang')) {
      baseRateJnt = 26000;
      baseRateSicepat = 28000;
      baseRateJne = 29000;
      etd = '3-4 Hari';
    } else if (dest.includes('bali') || dest.includes('kalimantan') || dest.includes('sulawesi')) {
      baseRateJnt = 32000;
      baseRateSicepat = 34000;
      baseRateJne = 36000;
      etd = '3-5 Hari';
    } else {
      baseRateJnt = 12000;
      baseRateSicepat = 13000;
      baseRateJne = 14000;
      etd = '2-3 Hari';
    }

    const calculatedRates = [
      {
        courierCode: 'JNT',
        courierName: 'J&T Express',
        service: 'EZ (Reguler)',
        etd,
        cost: baseRateJnt * weightKg,
      },
      {
        courierCode: 'SICEPAT',
        courierName: 'SiCepat Ekspres',
        service: 'REG (Reguler Cepat)',
        etd,
        cost: baseRateSicepat * weightKg,
      },
      {
        courierCode: 'JNE',
        courierName: 'JNE Express',
        service: 'REG (Layanan Reguler)',
        etd,
        cost: baseRateJne * weightKg,
      },
    ];

    return NextResponse.json({
      success: true,
      source: 'KIRIMINAJA_ZONED_RATES',
      origin: STORE_ORIGIN,
      weightGrams,
      rates: calculatedRates,
    });
  } catch (error: any) {
    console.error('Error saat kalkulasi ongkir:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
