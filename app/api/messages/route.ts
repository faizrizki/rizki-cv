import { asString, fail, guard, ok, withErrors } from '@/lib/api';
import { adminClient } from '@/lib/supabase';

export const runtime = 'nodejs';

/** Publik: kirim pesan dari form kontak. */
const POST = withErrors(async (request: Request) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail('Request tidak valid.');
  }

  const name = asString(body.name, 120);
  const email = asString(body.email, 200);
  const text = asString(body.body, 4000);

  if (!name || !email || !text) return fail('Nama, email, dan pesan wajib diisi.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Format email tidak valid.');

  const { error } = await adminClient().from('messages').insert({
    name,
    email,
    subject: asString(body.subject, 200),
    body: text,
  });

  if (error) return fail('Pesan gagal disimpan. Coba lagi nanti.', 500);
  return ok();
});

/** Admin: daftar pesan masuk. */
const GET = withErrors(async () => {
  const denied = await guard();
  if (denied) return denied;

  const { data, error } = await adminClient()
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) return fail(error.message, 500);
  return ok({ messages: data });
});

export { POST, GET };
