import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim();

  if (!q || q.length < 3) {
    return NextResponse.json({ success: false, results: [] });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://kodepos.vercel.app/search?q=${encodeURIComponent(q)}`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data.data && Array.isArray(data.data)) {
        const results = data.data.slice(0, 8).map((item: any) => ({
          postalCode: String(item.code),
          village: item.village || '',
          district: item.district || '',
          regency: item.regency || '',
          province: item.province || '',
        }));

        return NextResponse.json({
          success: true,
          results,
        });
      }
    }
  } catch (err) {
    console.warn('Postal code lookup error:', err);
  }

  return NextResponse.json({ success: false, results: [] });
}
