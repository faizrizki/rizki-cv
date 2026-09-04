export type Profile = {
  id: number;
  name: string;
  role: string;
  typing_words: string[];
  tagline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  github_url: string;
  photo_url: string;
  cv_url: string;
  available_for_work: boolean;
  stat_projects: number;
  stat_years_study: number;
};

export type SkillGroup = {
  id: number;
  category: string;
  items: string[];
  icon: string;
  sort_order: number;
};

export type Experience = {
  id: number;
  title: string;
  company: string;
  date_range: string;
  description: string;
  tech: string[];
  sort_order: number;
};

export type Education = {
  id: number;
  degree: string;
  institution: string;
  year_range: string;
  note: string;
  sort_order: number;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  url: string;
  repo_url: string;
  thumbnail_url: string;
  thumbnail_path: string;
  tech: string[];
  category: string;
  project_date: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  is_read: boolean;
  created_at: string;
};

/** Nilai default supaya landing page tetap tampil walau DB belum di-seed. */
export const FALLBACK_PROFILE: Profile = {
  id: 1,
  name: 'Muhammad Rizki',
  role: 'Software Engineer',
  typing_words: ['Software Engineer', 'Web Developer', 'Fresh Graduate'],
  tagline: '',
  bio: '',
  email: '',
  phone: '',
  location: 'Bogor, Indonesia',
  linkedin_url: '',
  github_url: '',
  photo_url: '',
  cv_url: '',
  available_for_work: true,
  stat_projects: 0,
  stat_years_study: 0,
};
