import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db, isDatabaseConfigured } from '@/lib/db';

function safeEqual(a: string, b: string) {
  const ah = crypto.createHash('sha256').update(a).digest();
  const bh = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ah, bh);
}

export async function POST(req: Request) {
  const secret = process.env.MAYAR_WEBHOOK_SECRET?.trim();
  if (!secret || !isDatabaseConfigured())
    return NextResponse.json({ error: 'Webhook unavailable' }, { status: 503 });

  const rawBody = await req.text();
  const supplied = req.headers.get('x-mayar-signature') || req.headers.get('x-signature') ||
    req.headers.get('x-webhook-secret') || new URL(req.url).searchParams.get('token') || '';
  const hmacHex = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const hmacBase64 = crypto.createHmac('sha256', secret).update(rawBody).digest('base64');
  if (!supplied || (!safeEqual(supplied.replace(/^sha256=/, ''), hmacHex) &&
      !safeEqual(supplied, hmacBase64) && !safeEqual(supplied, secret))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: Record<string, any>;
  try { payload = JSON.parse(rawBody); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const event = String(payload.event || payload.eventName || payload.type || '');
  if (event !== 'payment.received') return NextResponse.json({ status: 'ignored' });

  const data = payload.data || {};
  const orderId = String(data.extraData?.order_id || data.extraData?.orderId || '');
  const invoiceId = String(data.invoiceId || data.invoice?.id || data.id || '');
  const eventId = String(payload.id || data.webhookId || data.transactionId || `${event}:${invoiceId}`);
  const amount = Number(data.amount || data.total || data.transactionAmount);
  if (!orderId || !invoiceId || !eventId || !Number.isSafeInteger(amount) || amount <= 0)
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const duplicate = await db.list<{ event_id: string }>('webhook_events',
    `select=event_id&provider=eq.mayar&event_id=eq.${encodeURIComponent(eventId)}&limit=1`);
  if (duplicate.length) return NextResponse.json({ status: 'duplicate' });

  const orders = await db.list<{ id: string; total: number; status: string; mayar_invoice_id: string }>('orders',
    `select=id,total,status,mayar_invoice_id&id=eq.${encodeURIComponent(orderId)}&limit=1`);
  const order = orders[0];
  if (!order || order.mayar_invoice_id !== invoiceId || Number(order.total) !== amount)
    return NextResponse.json({ error: 'Order verification failed' }, { status: 409 });

  await db.insert('webhook_events', {
    provider: 'mayar', event_id: eventId,
    payload_hash: crypto.createHash('sha256').update(rawBody).digest('hex'),
  });
  if (order.status !== 'PAID') {
    await db.update('orders', `id=eq.${encodeURIComponent(orderId)}&status=eq.PENDING`, {
      status: 'PAID', mayar_transaction_id: data.transactionId || null,
      paid_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    });
  }
  return NextResponse.json({ status: 'success' });
}

export async function GET() {
  return NextResponse.json({ status: 'ready' });
}
