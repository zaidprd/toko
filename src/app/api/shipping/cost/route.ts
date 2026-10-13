import { NextResponse } from 'next/server';
import { calculateShippingRates, STORE_ORIGIN } from '@/lib/shipping';

export async function POST(req: Request) {
  try {
    const { destinationProvince, destinationCity, destinationDistrict, weightGrams } = await req.json();
    const result = await calculateShippingRates({
      destinationProvince,
      destinationCity,
      destinationDistrict,
      weightGrams,
    });

    return NextResponse.json({
      success: true,
      source: result.source,
      origin: STORE_ORIGIN,
      destinationId: result.destinationId,
      weightGrams: result.weightGrams,
      rates: result.rates,
    });
  } catch (error) {
    console.error('Error saat kalkulasi ongkir:', error);
    return NextResponse.json({ success: false, error: 'Gagal menghitung ongkir.' }, { status: 500 });
  }
}
