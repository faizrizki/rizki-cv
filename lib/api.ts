import { NextResponse } from 'next/server';
import { isAdmin } from './session';

export function ok(data: unknown = { ok: true }) {
  return NextResponse.json(data);
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Bungkus route handler supaya error tak terduga (mis. env Supabase belum
 * diisi) tetap balik sebagai JSON, bukan HTML 500 kosong.
 */
export function withErrors<H extends (...args: never[]) => Promise<NextResponse>>(handler: H): H {
  return (async (...args: never[]) => {
    try {
      return await handler(...args);
    } catch (err) {
      console.error('[api]', err);
      const message = err instanceof Error ? err.message : '';
      // Pesan konfigurasi boleh ditampilkan; error lain disembunyikan.
      return fail(
        message.startsWith('Env ') ? message : 'Terjadi kesalahan di server. Coba lagi nanti.',
        500
      );
    }
  }) as H;
}

/** Kembalikan response 401 kalau bukan admin, atau null kalau lolos. */
export async function guard(): Promise<NextResponse | null> {
  return (await isAdmin()) ? null : fail('Tidak punya akses. Silakan login ulang.', 401);
}

export function asString(value: unknown, max = 500): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

/** "React, PHP, Supabase" atau ["React"] -> ["React","PHP","Supabase"] */
export function asTechArray(value: unknown): string[] {
  const list = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(',')
      : [];
  return list
    .map((v) => String(v).trim())
    .filter(Boolean)
    .slice(0, 12);
}

/** Terima URL http/https saja; sisanya dianggap kosong. */
export function asUrl(value: unknown): string {
  const raw = asString(value, 500);
  if (!raw) return '';
  try {
    const parsed = new URL(raw);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : '';
  } catch {
    return '';
  }
}
