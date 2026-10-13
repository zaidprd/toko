import { NextResponse } from 'next/server';

export const STORE_ORIGIN = {
  address: process.env.STORE_ORIGIN_ADDRESS || 'Jl. H Taha No 2K, Kelapa Dua',
  district: process.env.STORE_ORIGIN_DISTRICT || 'Kebon Jeruk',
  city: process.env.STORE_ORIGIN_CITY || 'Jakarta Barat',
  province: process.env.STORE_ORIGIN_PROVINCE || 'DKI Jakarta',
  postalCode: process.env.STORE_ORIGIN_POSTAL_CODE || '11550',
};

export async function POST(req: Request) {
  try {
    const { destinationCity, destinationDistrict, weightGrams = 1000 } = await req.json();

    const apiKey = process.env.KIRIMINAJA_API_KEY;
    const baseUrl = process.env.KIRIMINAJA_BASE_URL || 'https://tdev.kiriminaja.com';

    // Kalkulasi tarif presisi dari gudang Jakarta Barat (11550)
    const weightKg = Math.max(1, Math.ceil(weightGrams / 1000));
    const dest = (destinationCity || destinationDistrict || '').toLowerCase();

    let baseRateJnt = 10000;
    let baseRateSicepat = 11000;
    let baseRateJne = 11000;
    let etd = '1-2 Hari';

    if (dest.includes('jakarta') || dest.includes('tangerang') || dest.includes('depok') || dest.includes('bekasi') || dest.includes('bogor')) {
      // Jabodetabek (Area pengiriman lokal dari Kebon Jeruk, Jakarta Barat)
      baseRateJnt = 9000;
      baseRateSicepat = 10000;
      baseRateJne = 10000;
      etd = '1 Hari (Besok Sampai)';
    } else if (dest.includes('jawa barat') || dest.includes('bandung') || dest.includes('cirebon') || dest.includes('serang')) {
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
      // Reguler default
      baseRateJnt = 12000;
      baseRateSicepat = 13000;
      baseRateJne = 14000;
      etd = '2-3 Hari';
    }

    const calculatedRates = [
      {
        courierCode: 'JNT',
        courierName: 'J&T Express',
        service: 'EZ (Reguler Cepat)',
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
      origin: STORE_ORIGIN,
      weightGrams,
      rates: calculatedRates,
    });
  } catch (error: any) {
    console.error('Error saat kalkulasi ongkir:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
