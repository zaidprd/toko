import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  SESSION_MAX_AGE_SEC,
  getAdminConfig,
  safeEqual,
  createSignedToken,
  getClientIp,
  isRateLimited,
  recordFailedAttempt,
  clearAttempts,
} from '@/lib/adminAuth';

export async function POST(req: Request) {
  const config = getAdminConfig();
  if (!config) {
    // Fail-closed: tanpa env yang valid, tidak ada yang bisa login
    console.error('ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_JWT_SECRET belum diatur dengan benar di environment.');
    return NextResponse.json(
      { success: false, message: 'Login admin belum dikonfigurasi di server. Hubungi pemilik toko.' },
      { status: 503 }
    );
  }

  const ip = getClientIp(req);
  const limit = isRateLimited(ip);
  if (limit.limited) {
    return NextResponse.json(
      {
        success: false,
        message: `Terlalu banyak percobaan login. Coba lagi dalam ${Math.ceil(limit.retryAfterSec / 60)} menit.`,
      },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } }
    );
  }

  let email = '';
  let password = '';
  try {
    const body = await req.json();
    email = typeof body.email === 'string' ? body.email : '';
    password = typeof body.password === 'string' ? body.password : '';
  } catch {
    return NextResponse.json({ success: false, message: 'Permintaan tidak valid.' }, { status: 400 });
  }

  const isEmailValid = safeEqual(email.trim().toLowerCase(), config.email.toLowerCase());
  const isPasswordValid = safeEqual(password, config.password);

  if (!isEmailValid || !isPasswordValid) {
    recordFailedAttempt(ip);
    return NextResponse.json(
      { success: false, message: 'Email atau password admin salah!' },
      { status: 401 }
    );
  }

  clearAttempts(ip);
  const now = Math.floor(Date.now() / 1000);
  const token = createSignedToken(
    { email: config.email, role: 'ADMIN', iat: now, exp: now + SESSION_MAX_AGE_SEC },
    config.jwtSecret
  );

  const response = NextResponse.json({
    success: true,
    message: 'Login admin berhasil.',
    user: { email: config.email, role: 'ADMIN' },
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_MAX_AGE_SEC,
  });

  return response;
}
