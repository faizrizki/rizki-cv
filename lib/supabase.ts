import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Rapikan nilai env: buang spasi/newline sisa copy-paste, tambahkan https://
 * kalau skema-nya lupa ditulis, dan buang garis miring di ujung. Tanpa ini
 * satu typo di dashboard Vercel bisa menggagalkan seluruh build.
 */
function normalizeUrl(raw: string | undefined): string | undefined {
  const value = raw?.trim().replace(/\/+$/, '');
  if (!value) return undefined;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

const url = normalizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

export { STORAGE_BUCKET_NAME as STORAGE_BUCKET } from './storage-path';

/** True kalau env Supabase sudah lengkap. Dipakai supaya build tidak meledak. */
export const supabaseConfigured = Boolean(url && anonKey);

/**
 * Client publik (anon key). Hanya bisa SELECT, sesuai RLS.
 * Dipakai untuk render landing page.
 */
export function publicClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Client admin (service role key). BYPASS RLS - hanya boleh dipakai di
 * server (route handler / server component), JANGAN pernah di client.
 */
export function adminClient(): SupabaseClient {
  if (!url || !serviceKey) {
    throw new Error(
      'Env NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY belum diset.'
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
