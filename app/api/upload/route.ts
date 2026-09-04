import { fail, guard, ok, withErrors } from '@/lib/api';
import { STORAGE_BUCKET, adminClient } from '@/lib/supabase';

export const runtime = 'nodejs';

const ALLOWED = ['image/webp', 'image/jpeg', 'image/png'];
const MAX_BYTES = 512 * 1024; // sinkron dengan file_size_limit bucket di schema.sql
const FOLDERS = ['projects', 'profile'] as const;

function isManagedPath(path: string): boolean {
  return FOLDERS.some((folder) => path.startsWith(`${folder}/`));
}

const POST = withErrors(async (request: Request) => {
  const denied = await guard();
  if (denied) return denied;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail('Upload tidak valid.');
  }

  const file = form.get('file');
  if (!(file instanceof File)) return fail('File tidak ditemukan.');
  if (!ALLOWED.includes(file.type)) return fail('Format harus WebP, JPEG, atau PNG.');
  if (file.size > MAX_BYTES) {
    return fail('Ukuran gambar masih di atas 512 KB. Coba gambar lain.');
  }

  const requested = String(form.get('folder') ?? 'projects');
  const folder = (FOLDERS as readonly string[]).includes(requested) ? requested : 'projects';

  const ext = file.type === 'image/webp' ? 'webp' : file.type === 'image/png' ? 'png' : 'jpg';
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const supabase = adminClient();
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) return fail(`Upload gagal: ${error.message}`, 500);

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return ok({ url: data.publicUrl, path, bytes: file.size });
});

/** Hapus gambar yang sudah di-upload tapi batal dipakai. */
const DELETE = withErrors(async (request: Request) => {
  const denied = await guard();
  if (denied) return denied;

  const path = new URL(request.url).searchParams.get('path');
  if (!path || !isManagedPath(path)) return fail('Path tidak valid.');

  const { error } = await adminClient().storage.from(STORAGE_BUCKET).remove([path]);
  if (error) return fail(error.message, 500);
  return ok();
});

export { POST, DELETE };
