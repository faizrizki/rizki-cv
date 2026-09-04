import { revalidatePath } from 'next/cache';
import { asString, asTechArray, asUrl, fail, guard, ok, withErrors } from '@/lib/api';
import { adminClient } from '@/lib/supabase';

export const runtime = 'nodejs';

const PATCH = withErrors(async (request: Request) => {
  const denied = await guard();
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail('Request tidak valid.');
  }

  const patch = {
    name: asString(body.name, 120),
    role: asString(body.role, 120),
    typing_words: asTechArray(body.typing_words),
    tagline: asString(body.tagline, 400),
    bio: asString(body.bio, 3000),
    email: asString(body.email, 200),
    phone: asString(body.phone, 40),
    location: asString(body.location, 120),
    linkedin_url: asUrl(body.linkedin_url),
    github_url: asUrl(body.github_url),
    photo_url: asString(body.photo_url, 600),
    cv_url: asString(body.cv_url, 600),
    available_for_work: Boolean(body.available_for_work),
    stat_projects: Number(body.stat_projects) || 0,
    stat_years_study: Number(body.stat_years_study) || 0,
  };

  if (!patch.name) return fail('Nama wajib diisi.');

  const { data, error } = await adminClient()
    .from('profile')
    .update(patch)
    .eq('id', 1)
    .select()
    .single();

  if (error) return fail(error.message, 500);

  revalidatePath('/');
  return ok({ profile: data });
});

export { PATCH };
