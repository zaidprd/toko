import crypto from 'crypto';
import { cookies } from 'next/headers';

/**
 * Autentikasi admin sisi server.
 * Tidak ada nilai cadangan (fallback): jika ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_JWT_SECRET
 * belum diisi di environment (Vercel), login admin otomatis DITOLAK (fail-closed).
 */

export const ADMIN_COOKIE_NAME = 'zaidly_admin_session';
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24; // 1 hari

export interface AdminConfig {
  email: string;
  password: string;
  jwtSecret: string;
}

export function getAdminConfig(): AdminConfig | null {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.ADMIN_JWT_SECRET;

  if (!email || !password || !jwtSecret) return null;
  // Tolak nilai contoh dari .env.example dan secret yang terlalu pendek
  if (password.startsWith('your_') || jwtSecret.startsWith('your_')) return null;
  if (jwtSecret.length < 32) return null;

  return { email, password, jwtSecret };
}

/** Perbandingan string anti timing-attack */
export function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function createSignedToken(payload: Record<string, unknown>, secret: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export interface AdminSession {
  email: string;
  role: 'ADMIN';
  iat: number;
  exp: number;
}

export function verifySignedToken(token: string | undefined, secret: string): AdminSession | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  if (!safeEqual(expectedSig, signature)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8')) as AdminSession;
    if (payload.role !== 'ADMIN') return null;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Pembatas percobaan login sederhana (per IP, di memori instance server).
 * Catatan: di Vercel tiap instance punya memori sendiri, jadi ini mengurangi brute-force
 * tapi bukan pengganti rate limit terpusat (mis. Upstash/Vercel Firewall).
 */
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 menit
const attempts = new Map<string, { count: number; firstAt: number }>();

export function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

export function isRateLimited(ip: string): { limited: boolean; retryAfterSec: number } {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.firstAt > WINDOW_MS) return { limited: false, retryAfterSec: 0 };
  if (rec.count >= MAX_ATTEMPTS) {
    return { limited: true, retryAfterSec: Math.ceil((rec.firstAt + WINDOW_MS - now) / 1000) };
  }
  return { limited: false, retryAfterSec: 0 };
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.firstAt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAt: now });
  } else {
    rec.count += 1;
  }
}

export function clearAttempts(ip: string): void {
  attempts.delete(ip);
}

export async function requireAdmin(): Promise<AdminSession | null> {
  const config = getAdminConfig();
  if (!config) return null;
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  return verifySignedToken(token, config.jwtSecret);
}
