import 'server-only';

const baseUrl = process.env.SUPABASE_URL
  ?.replace(/\/$/, '')
  .replace(/\/rest\/v1$/, '');
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isDatabaseConfigured() {
  return Boolean(baseUrl && serviceKey);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!baseUrl || !serviceKey) throw new Error('Database belum dikonfigurasi.');
  const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...init.headers,
    },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Database request gagal (${response.status}).`);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const db = {
  list: <T>(table: string, query = '') => request<T[]>(`${table}?${query}`),
  insert: <T>(table: string, value: unknown, onConflict?: string) =>
    request<T[]>(`${table}${onConflict ? `?on_conflict=${onConflict}` : ''}`, {
      method: 'POST',
      headers: onConflict ? { Prefer: 'resolution=merge-duplicates,return=representation' } : undefined,
      body: JSON.stringify(value),
    }),
  update: <T>(table: string, filter: string, value: unknown) =>
    request<T[]>(`${table}?${filter}`, { method: 'PATCH', body: JSON.stringify(value) }),
  remove: (table: string, filter: string) => request<void>(`${table}?${filter}`, { method: 'DELETE' }),
};

export function eq(value: string) {
  return `eq.${encodeURIComponent(value)}`;
}
