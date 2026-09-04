export const STORAGE_BUCKET_NAME = 'project-images';

/**
 * Ambil path relatif di dalam bucket dari public URL Supabase Storage.
 * ".../storage/v1/object/public/project-images/profile/abc.webp" -> "profile/abc.webp"
 * Balikannya '' kalau URL-nya bukan file dari bucket kita.
 */
export function pathFromPublicUrl(url: string): string {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET_NAME}/`;
  const index = url.indexOf(marker);
  if (index === -1) return '';
  return decodeURIComponent(url.slice(index + marker.length).split('?')[0]);
}
