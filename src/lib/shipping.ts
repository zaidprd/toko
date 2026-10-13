/**
 * Kalkulasi ongkir sisi server (dipakai oleh /api/shipping/cost DAN /api/payment/create-invoice
 * agar total tagihan selalu dihitung ulang di server, bukan dipercaya dari browser).
 *
 * CATATAN AUDIT (T2): pemetaan destinationId di bawah masih berbasis zona kata kunci, BUKAN
 * district_id resmi KiriminAja, dan fallback memakai tarif zona perkiraan. Ganti dengan pencarian
 * kecamatan KiriminAja yang sebenarnya sebelum go-live penuh.
 */

export const STORE_ORIGIN = {
  address: process.env.STORE_ORIGIN_ADDRESS || 'Kebon Jeruk, Jakarta Barat',
  district: process.env.STORE_ORIGIN_DISTRICT || 'Kebon Jeruk',
  city: process.env.STORE_ORIGIN_CITY || 'Jakarta Barat',
  province: process.env.STORE_ORIGIN_PROVINCE || 'DKI Jakarta',
  postalCode: process.env.STORE_ORIGIN_POSTAL_CODE || '11550',
};

export interface ShippingRate {
  courierCode: string;
  courierName: string;
  service: string;
  etd: string;
  cost: number;
}

export interface ShippingQuery {
  destinationProvince?: string;
  destinationCity?: string;
  destinationDistrict?: string;
  weightGrams?: number;
}

export interface ShippingResult {
  source: 'KIRIMINAJA_API_LIVE' | 'ESTIMASI_ZONA';
  destinationId: number;
  weightGrams: number;
  rates: ShippingRate[];
}

function resolveDestinationId(destStr: string): number {
  if (/sumatera|aceh|medan|mandailing|riau|lampung|padang|palembang|jambi|bengkulu|bangka/.test(destStr)) return 2000;
  if (/kalimantan|pontianak|banjarmasin|samarinda|balikpapan/.test(destStr)) return 2500;
  if (/sulawesi|makassar|manado|palu|kendari|gorontalo/.test(destStr)) return 3000;
  if (/bali|nusa tenggara|denpasar|mataram|kupang/.test(destStr)) return 3500;
  if (/papua|maluku|ambon|jayapura/.test(destStr)) return 4000;
  if (/jawa timur|surabaya|malang|sidoarjo/.test(destStr)) return 1600;
  if (/jawa tengah|yogyakarta|semarang|solo|sleman/.test(destStr)) return 1400;
  if (/jawa barat|banten|bandung|bogor|tangerang|bekasi|depok|serang/.test(destStr)) return 1200;
  return 5783;
}

async function fetchKiriminAjaRates(destinationId: number, weightGrams: number): Promise<ShippingRate[]> {
  const apiKey = process.env.KIRIMINAJA_API_KEY;
  const baseUrl = process.env.KIRIMINAJA_BASE_URL || 'https://tdev.kiriminaja.com';
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_kiriminaja')) return [];

  try {
    const res = await fetch(`${baseUrl}/api/mitra/v6.1/shipping_price`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        origin: 5783, // District ID Kebon Jeruk, Jakarta Barat
        destination: destinationId,
        weight: weightGrams,
        insurance: 0,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];

    const apiData = await res.json();
    if (!apiData.status || !Array.isArray(apiData.results)) return [];

    const courierMap: Record<string, string> = {
      sicepat: 'SiCepat Ekspres',
      ninja: 'Ninja Express',
      jne: 'JNE Express',
      jnt: 'J&T Express',
      anteraja: 'AnterAja',
      sap: 'SAP Express',
    };

    const seen = new Set<string>();
    const rates: ShippingRate[] = [];
    for (const r of apiData.results) {
      const cKey = String(r.service || '').toLowerCase();
      const sType = String(r.service_type || 'REG').toUpperCase();
      if (/GOKIL|CARGO|TRUCKING|JTR/.test(sType)) continue;
      const cost = Number(r.cost);
      if (!Number.isFinite(cost) || cost <= 0) continue;

      const dedupeKey = `${cKey}_${sType}`;
      if (!seen.has(dedupeKey) && ['sicepat', 'jnt', 'jne', 'ninja'].includes(cKey)) {
        seen.add(dedupeKey);
        rates.push({
          courierCode: dedupeKey.toUpperCase(),
          courierName: courierMap[cKey] || r.service,
          service: sType,
          etd: r.etd ? `${r.etd} Hari` : '-',
          cost,
        });
      }
    }
    return rates;
  } catch (err) {
    console.warn('KiriminAja API gagal, memakai estimasi zona:', err);
    return [];
  }
}

function estimateZoneRates(dest: string, weightGrams: number): ShippingRate[] {
  const weightKg = Math.max(1, Math.ceil(weightGrams / 1000));
  let jnt = 12000, sicepat = 13000, jne = 14000, etd = '2-3 Hari';

  if (/jakarta|tangerang|depok|bekasi|bogor/.test(dest)) {
    jnt = 9000; sicepat = 10000; jne = 10000; etd = '1 Hari';
  } else if (/jawa barat|banten|bandung|cirebon|serang/.test(dest)) {
    jnt = 11000; sicepat = 12000; jne = 12000; etd = '1-2 Hari';
  } else if (/jawa tengah|semarang|solo|yogyakarta|sleman/.test(dest)) {
    jnt = 15000; sicepat = 16000; jne = 17000; etd = '2-3 Hari';
  } else if (/jawa timur|surabaya|malang/.test(dest)) {
    jnt = 17000; sicepat = 18000; jne = 19000; etd = '2-3 Hari';
  } else if (/sumatera|medan|padang|lampung|palembang/.test(dest)) {
    jnt = 26000; sicepat = 28000; jne = 29000; etd = '3-4 Hari';
  } else if (/bali|kalimantan|sulawesi/.test(dest)) {
    jnt = 32000; sicepat = 34000; jne = 36000; etd = '3-5 Hari';
  }

  return [
    { courierCode: 'JNT', courierName: 'J&T Express', service: 'EZ (Reguler)', etd, cost: jnt * weightKg },
    { courierCode: 'SICEPAT', courierName: 'SiCepat Ekspres', service: 'REG (Reguler)', etd, cost: sicepat * weightKg },
    { courierCode: 'JNE', courierName: 'JNE Express', service: 'REG (Reguler)', etd, cost: jne * weightKg },
  ];
}

export async function calculateShippingRates(q: ShippingQuery): Promise<ShippingResult> {
  const weightGrams = Math.min(50000, Math.max(100, Math.round(Number(q.weightGrams) || 1000)));
  const destStr = `${q.destinationProvince || ''} ${q.destinationCity || ''} ${q.destinationDistrict || ''}`.toLowerCase();
  const destinationId = resolveDestinationId(destStr);

  const live = await fetchKiriminAjaRates(destinationId, weightGrams);
  if (live.length > 0) {
    return { source: 'KIRIMINAJA_API_LIVE', destinationId, weightGrams, rates: live };
  }
  return { source: 'ESTIMASI_ZONA', destinationId, weightGrams, rates: estimateZoneRates(destStr, weightGrams) };
}
