import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

function verifySignedToken(token: string, secret: string) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  if (expectedSig !== signature) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('zaidly_admin_session')?.value;
  const jwtSecret = process.env.ADMIN_JWT_SECRET || 'zaidly-super-secure-jwt-secret-key-2026-auth-token';

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  const payload = verifySignedToken(token, jwtSecret);
  if (!payload) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    user: { email: payload.email, role: payload.role },
  });
}
