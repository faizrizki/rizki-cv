import { Github, GraduationCap, Linkedin, Mail, MapPin, Phone, User } from 'lucide-react';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import type { Education, Profile } from '@/lib/types';

export default function About({
  profile,
  educations,
  projectCount,
}: {
  profile: Profile;
  educations: Education[];
  projectCount: number;
}) {
  const stats = [
    { value: projectCount || profile.stat_projects, label: 'Projects Built' },
    { value: profile.stat_years_study, label: 'Years of Training' },
    { value: educations.length, label: 'Degrees' },
  ];

  return (
    <section id="about" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Who I Am" title="About" accent="Me" />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Kartu profil */}
          <Reveal direction="left" className="glass-card no-lift rounded-2xl p-8 lg:row-span-2">
            <div className="group relative mb-6">
              {profile.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.photo_url}
                  alt={profile.name}
                  className="aspect-square w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20">
                  <User className="h-24 w-24 text-indigo-400/40" />
                </div>
              )}
            </div>

            <h3 className="text-2xl font-bold">{profile.name}</h3>
            <p className="mb-6 font-medium text-indigo-400">{profile.role}</p>

            <ul className="space-y-3 text-sm text-slate-400">
              {profile.location && (
                <li className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
                  {profile.location}
                </li>
              )}
              {profile.email && (
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-slate-500" />
                  <a href={`mailto:${profile.email}`} className="break-all hover:text-white">
                    {profile.email}
                  </a>
                </li>
              )}
              {profile.phone && (
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-slate-500" />
                  <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="hover:text-white">
                    {profile.phone}
                  </a>
                </li>
              )}
            </ul>

            <div className="mt-6 flex gap-3">
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-indigo-500/40 hover:text-indigo-400"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-indigo-500/40 hover:text-indigo-400"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
            </div>
          </Reveal>

          {/* Bio */}
          <Reveal direction="right" className="glass-card no-lift rounded-2xl p-8 lg:col-span-2">
            <h3 className="mb-4 text-xl font-bold">
              Fresh graduate, <span className="text-gradient">bukan pemula</span>
            </h3>
            <p className="leading-relaxed text-slate-400">{profile.bio}</p>
          </Reveal>

          {/* Statistik + pendidikan singkat */}
          <Reveal direction="right" delay={100} className="lg:col-span-2">
            <div className="grid gap-6 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="glass-card rounded-2xl p-6 text-center">
                  <p className="text-4xl font-black text-gradient">{stat.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {educations.length > 0 && (
              <div className="glass-card no-lift mt-6 rounded-2xl p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
                    <GraduationCap className="h-4 w-4 text-violet-400" />
                  </div>
                  <h4 className="font-bold">Education</h4>
                </div>
                <div className="space-y-4">
                  {educations.map((edu, i) => (
                    <div key={edu.id} className={i > 0 ? 'border-t border-white/5 pt-4' : ''}>
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-semibold">{edu.degree}</p>
                        <span className="shrink-0 text-xs text-slate-500">{edu.year_range}</span>
                      </div>
                      <p className="text-sm text-slate-400">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
