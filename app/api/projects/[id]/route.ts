import { revalidatePath } from 'next/cache';
import { asString, asTechArray, asUrl, fail, guard, ok, withErrors } from '@/lib/api';
import { STORAGE_BUCKET, adminClient } from '@/lib/supabase';

export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

const PATCH = withErrors(async (request: Request, { params }: Params) => {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail('Request tidak valid.');
  }

  const supabase = adminClient();
  const patch: Record<string, unknown> = {};

  if ('title' in body) {
    const title = asString(body.title, 160);
    if (!title) return fail('Judul project wajib diisi.');
    patch.title = title;
  }
  if ('description' in body) patch.description = asString(body.description, 2000);
  if ('url' in body) patch.url = asUrl(body.url);
  if ('repo_url' in body) patch.repo_url = asUrl(body.repo_url);
  if ('tech' in body) patch.tech = asTechArray(body.tech);
  if ('category' in body) patch.category = asString(body.category, 60) || 'Web App';
  if ('project_date' in body) patch.project_date = asString(body.project_date, 60);
  if ('featured' in body) patch.featured = Boolean(body.featured);
  if ('sort_order' in body) {
    patch.sort_order = Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0;
  }

  // Ganti thumbnail: hapus file lama dulu supaya storage tidak menumpuk.
  if ('thumbnail_url' in body) {
    const { data: current } = await supabase
      .from('projects')
      .select('thumbnail_path')
      .eq('id', id)
      .maybeSingle();

    const oldPath = current?.thumbnail_path as string | undefined;
    const newPath = asString(body.thumbnail_path, 300);

    if (oldPath && oldPath !== newPath) {
      await supabase.storage.from(STORAGE_BUCKET).remove([oldPath]);
    }

    patch.thumbnail_url = asString(body.thumbnail_url, 600);
    patch.thumbnail_path = newPath;
  }

  if (Object.keys(patch).length === 0) return fail('Tidak ada perubahan.');

  const { data, error } = await supabase.from('projects').update(patch).eq('id', id).select().single();
  if (error) return fail(error.message, 500);

  revalidatePath('/');
  return ok({ project: data });
});

const DELETE = withErrors(async (_request: Request, { params }: Params) => {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await params;
  const supabase = adminClient();

  const { data: current } = await supabase
    .from('projects')
    .select('thumbnail_path')
    .eq('id', id)
    .maybeSingle();

  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) return fail(error.message, 500);

  // Bersihkan gambar setelah barisnya benar-benar terhapus.
  const path = current?.thumbnail_path as string | undefined;
  if (path) await supabase.storage.from(STORAGE_BUCKET).remove([path]);

  revalidatePath('/');
  return ok();
});

export { PATCH, DELETE };
