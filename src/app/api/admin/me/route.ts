import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, getAdminConfig, verifySignedToken } from '@/lib/adminAuth';

export async function GET() {
  const config = getAdminConfig();
  if (!config) {
    return NextResponse.json({ authenticated: false, configured: false });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const payload = verifySignedToken(token, config.jwtSecret);

  if (!payload) {
    return NextResponse.json({ authenticated: false, configured: true });
  }

  return NextResponse.json({
    authenticated: true,
    configured: true,
    user: { email: payload.email, role: payload.role },
  });
}
