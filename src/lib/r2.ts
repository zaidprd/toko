import 'server-only';
import crypto from 'crypto';

function config() {
  const account = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const accessKey = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  if (!account || !accessKey || !secretKey || !bucket) throw new Error('R2 belum dikonfigurasi.');
  return { accessKey, secretKey, bucket, host: `${account}.r2.cloudflarestorage.com` };
}
const sha = (value: string | Buffer) => crypto.createHash('sha256').update(value).digest('hex');
const hmac = (key: string | Buffer, value: string) => crypto.createHmac('sha256', key).update(value).digest();
const enc = (value: string) => encodeURIComponent(value).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

export function signedR2Url(method: 'GET' | 'PUT', objectKey: string, expires = 900) {
  const { accessKey, secretKey, bucket, host } = config();
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const date = amzDate.slice(0, 8);
  const scope = `${date}/auto/s3/aws4_request`;
  const path = `/${enc(bucket)}/${objectKey.split('/').map(enc).join('/')}`;
  const params: Record<string, string> = {
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256', 'X-Amz-Credential': `${accessKey}/${scope}`,
    'X-Amz-Date': amzDate, 'X-Amz-Expires': String(expires), 'X-Amz-SignedHeaders': 'host',
  };
  const query = Object.keys(params).sort().map((k) => `${enc(k)}=${enc(params[k])}`).join('&');
  const canonical = `${method}\n${path}\n${query}\nhost:${host}\n\nhost\nUNSIGNED-PAYLOAD`;
  const toSign = `AWS4-HMAC-SHA256\n${amzDate}\n${scope}\n${sha(canonical)}`;
  const signingKey = hmac(hmac(hmac(hmac(`AWS4${secretKey}`, date), 'auto'), 's3'), 'aws4_request');
  const signature = crypto.createHmac('sha256', signingKey).update(toSign).digest('hex');
  return `https://${host}${path}?${query}&X-Amz-Signature=${signature}`;
}

export function safePdfName(name: string) {
  const normalized = name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-');
  return normalized.toLowerCase().endsWith('.pdf') ? normalized : `${normalized}.pdf`;
}
