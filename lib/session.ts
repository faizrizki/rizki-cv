import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from './auth';

/** Baca cookie sesi dari request saat ini (server-side only). */
export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}
