import { publicClient } from './supabase';
import {
  FALLBACK_PROFILE,
  type Education,
  type Experience,
  type Profile,
  type Project,
  type SkillGroup,
} from './types';

export type SiteData = {
  profile: Profile;
  skills: SkillGroup[];
  experiences: Experience[];
  educations: Education[];
  projects: Project[];
  /** false kalau env Supabase belum diset / query gagal -> landing tetap render. */
  connected: boolean;
};

export async function getSiteData(): Promise<SiteData> {
  const empty: SiteData = {
    profile: FALLBACK_PROFILE,
    skills: [],
    experiences: [],
    educations: [],
    projects: [],
    connected: false,
  };

  const supabase = publicClient();
  if (!supabase) return empty;

  try {
    const [profile, skills, experiences, educations, projects] = await Promise.all([
      supabase.from('profile').select('*').eq('id', 1).maybeSingle(),
      supabase.from('skills').select('*').order('sort_order', { ascending: true }),
      supabase.from('experiences').select('*').order('sort_order', { ascending: true }),
      supabase.from('educations').select('*').order('sort_order', { ascending: true }),
      supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false }),
    ]);

    if (profile.error) throw profile.error;

    return {
      profile: (profile.data as Profile) ?? FALLBACK_PROFILE,
      skills: (skills.data as SkillGroup[]) ?? [],
      experiences: (experiences.data as Experience[]) ?? [],
      educations: (educations.data as Education[]) ?? [],
      projects: (projects.data as Project[]) ?? [],
      connected: true,
    };
  } catch (err) {
    console.error('[getSiteData] gagal membaca Supabase:', err);
    return empty;
  }
}
