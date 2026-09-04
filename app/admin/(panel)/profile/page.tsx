import ProfileForm from '@/components/admin/ProfileForm';
import { adminClient } from '@/lib/supabase';
import { FALLBACK_PROFILE, type Profile } from '@/lib/types';

export default async function AdminProfilePage() {
  let profile: Profile = FALLBACK_PROFILE;
  let error = '';

  try {
    const { data, error: dbError } = await adminClient()
      .from('profile')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (dbError) throw dbError;
    if (data) profile = data as Profile;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Gagal membaca profil.';
  }

  if (error) {
    return (
      <div className="glass-card no-lift rounded-2xl p-8">
        <h1 className="mb-2 text-lg font-bold text-rose-300">Tidak bisa membaca profil</h1>
        <p className="text-sm text-slate-400">{error}</p>
      </div>
    );
  }

  return <ProfileForm profile={profile} />;
}
