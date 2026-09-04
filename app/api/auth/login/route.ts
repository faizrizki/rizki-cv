import { NextResponse } from 'next/server';
import { SESSION_COOKIE, checkPassword, createSessionToken } from '@/lib/auth';
import { fail } from '@/lib/api';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return fail('Request tidak valid.');
  }

  if (!process.env.ADMIN_PASSWORD || !process.env.AUTH_SECRET) {
    return fail('Server belum dikonfigurasi: set ADMIN_PASSWORD dan AUTH_SECRET.', 500);
  }

  if (!checkPassword(password)) {
    // Sedikit jeda supaya brute force lebih mahal.
    await new Promise((r) => setTimeout(r, 600));
    return fail('Password salah.', 401);
  }

  const { value, maxAge } = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE,
    value,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  });
  return response;
}
