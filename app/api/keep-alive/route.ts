import { fail, ok, withErrors } from '@/lib/api';
import { adminClient, publicClient } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Penjaga supaya project Supabase gratis tidak di-pause.
 * Supabase menidurkan project free tier setelah beberapa hari tanpa request,
 * jadi Vercel Cron memanggil endpoint ini sekali sehari (lihat vercel.json)
 * dan endpoint ini menembak satu query paling murah ke database.
 *
 * Kalau env CRON_SECRET diisi, Vercel otomatis mengirim header
 * `Authorization: Bearer <CRON_SECRET>` dan request tanpa header itu ditolak.
 */
const GET = withErrors(async (request: Request) => {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const header = request.headers.get('authorization');
    if (header !== `Bearer ${secret}`) return fail('Tidak berwenang.', 401);
  }

  // Anon key sudah cukup: tabel profile boleh dibaca publik lewat RLS.
  const supabase = publicClient() ?? adminClient();

  const started = Date.now();
  const { error, count } = await supabase
    .from('profile')
    .select('id', { count: 'exact', head: true });

  if (error) return fail(`Ping database gagal: ${error.message}`, 502);

  return ok({
    ok: true,
    pinged_at: new Date().toISOString(),
    duration_ms: Date.now() - started,
    rows: count ?? 0,
  });
});

export { GET };
