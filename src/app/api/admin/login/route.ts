import { NextResponse } from 'next/server';
import crypto from 'crypto';

function createSignedToken(payload: object, secret: string) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const expectedEmail = process.env.ADMIN_EMAIL || 'ahmadzaid.simetri@gmail.com';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'ZaidlyKids#2026';
    const jwtSecret = process.env.ADMIN_JWT_SECRET || 'zaidly-super-secure-jwt-secret-key-2026-auth-token';

    const isEmailValid = email && email.trim().toLowerCase() === expectedEmail.toLowerCase();
    const isPasswordValid = password && password === expectedPassword;

    if (!isEmailValid || !isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Email atau password admin salah!' },
        { status: 401 }
      );
    }

    const token = createSignedToken(
      {
        email: expectedEmail,
        role: 'ADMIN',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 hari
      },
      jwtSecret
    );

    const response = NextResponse.json({
      success: true,
      message: 'Login admin berhasil.',
      user: { email: expectedEmail, role: 'ADMIN' },
    });

    // Pasang HTTP-Only Cookie yang kebal dari pencurian script frontend / DevTools
    response.cookies.set({
      name: 'zaidly_admin_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
