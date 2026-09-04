import { revalidatePath } from 'next/cache';
import { asString, asTechArray, asUrl, fail, guard, ok, withErrors } from '@/lib/api';
import { adminClient } from '@/lib/supabase';

export const runtime = 'nodejs';

const GET = withErrors(async () => {
  const denied = await guard();
  if (denied) return denied;

  const { data, error } = await adminClient()
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) return fail(error.message, 500);
  return ok({ projects: data });
});

const POST = withErrors(async (request: Request) => {
  const denied = await guard();
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail('Request tidak valid.');
  }

  const title = asString(body.title, 160);
  if (!title) return fail('Judul project wajib diisi.');

  const payload = {
    title,
    description: asString(body.description, 2000),
    url: asUrl(body.url),
    repo_url: asUrl(body.repo_url),
    thumbnail_url: asString(body.thumbnail_url, 600),
    thumbnail_path: asString(body.thumbnail_path, 300),
    tech: asTechArray(body.tech),
    category: asString(body.category, 60) || 'Web App',
    project_date: asString(body.project_date, 60),
    featured: Boolean(body.featured),
    sort_order: Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0,
  };

  const { data, error } = await adminClient().from('projects').insert(payload).select().single();
  if (error) return fail(error.message, 500);

  revalidatePath('/');
  return ok({ project: data });
});

export { GET, POST };
