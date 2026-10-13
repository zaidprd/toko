import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db, isDatabaseConfigured } from '@/lib/db';

const equal = (a: string, b: string) => crypto.timingSafeEqual(
  crypto.createHash('sha256').update(a).digest(), crypto.createHash('sha256').update(b).digest());

export async function POST(req: Request) {
  const secret = process.env.KIRIMINAJA_WEBHOOK_SECRET?.trim();
  if (!secret || !isDatabaseConfigured()) return NextResponse.json({ error: 'Unavailable' }, { status: 503 });
  const raw = await req.text();
  const supplied = req.headers.get('x-signature') || req.headers.get('x-webhook-secret') || new URL(req.url).searchParams.get('token') || '';
  const hmac = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  if (!supplied || (!equal(supplied.replace(/^sha256=/, ''), hmac) && !equal(supplied, secret)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = JSON.parse(raw);
  const orderId = String(payload.order_id || payload.orderId || '');
  if (!orderId || !payload.status) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  await db.update('orders', `id=eq.${encodeURIComponent(orderId)}&status=eq.PAID`, {
    shipment: { awb: payload.awb || null, status: String(payload.status), courier: payload.courier || null, updatedAt: new Date().toISOString() },
    updated_at: new Date().toISOString(),
  });
  return NextResponse.json({ status: 'success' });
}

export async function GET() { return NextResponse.json({ status: 'ready' }); }
