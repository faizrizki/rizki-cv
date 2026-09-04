/**
 * Login admin sederhana: satu password (env ADMIN_PASSWORD) ditukar dengan
 * cookie httpOnly yang ditandatangani HMAC-SHA256 (env AUTH_SECRET).
 * Pakai Web Crypto supaya jalan di Node runtime maupun Edge middleware.
 */

export const SESSION_COOKIE = 'rizki_admin';
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 jam

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error('Env AUTH_SECRET belum diset (minimal 16 karakter).');
  }
  return s;
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return toHex(mac);
}

/** Perbandingan konstan-waktu supaya tidak bocor lewat timing. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(): Promise<{ value: string; maxAge: number }> {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `admin.${expires}`;
  return {
    value: `${payload}.${await sign(payload)}`,
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  };
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [subject, expiresRaw, mac] = parts;
  if (subject !== 'admin') return false;

  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;

  try {
    return safeEqual(mac, await sign(`${subject}.${expiresRaw}`));
  } catch {
    return false;
  }
}

export function checkPassword(input: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof input !== 'string') return false;
  return safeEqual(input, expected);
}
