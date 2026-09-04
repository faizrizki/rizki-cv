import { Briefcase, Calendar, GraduationCap } from 'lucide-react';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import type { Education, Experience } from '@/lib/types';

export default function Journey({
  experiences,
  educations,
}: {
  experiences: Experience[];
  educations: Education[];
}) {
  if (!experiences.length && !educations.length) return null;

  return (
    <section id="journey" className="px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Career Path" title="My" accent="Journey" />

        <div className="mx-auto max-w-3xl">
          <div className="relative space-y-8 pl-14">
            <div className="timeline-line" />

            {experiences.map((exp) => (
              <Reveal key={exp.id} direction="right" className="timeline-item relative">
                <div className="timeline-dot" />
                <div className="glass-card no-lift rounded-2xl p-8">
                  <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-indigo-400" />
                        <h3 className="text-xl font-bold">{exp.title}</h3>
                      </div>
                      <p className="font-medium text-indigo-400">{exp.company}</p>
                    </div>
                    <span className="mt-2 flex shrink-0 items-center gap-2 text-sm text-slate-500 sm:mt-0">
                      <Calendar className="h-4 w-4" />
                      {exp.date_range}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mb-4 text-sm leading-relaxed text-slate-400">{exp.description}</p>
                  )}
                  {exp.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/5 bg-white/5 px-3 py-1 text-xs text-slate-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}

            {educations.length > 0 && (
              <Reveal direction="right" className="timeline-item relative">
                <div className="timeline-dot" style={{ borderColor: '#8b5cf6' }} />
                <div className="glass-card no-lift rounded-2xl p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                      <GraduationCap className="h-5 w-5 text-violet-400" />
                    </div>
                    <h3 className="text-lg font-bold">Education</h3>
                  </div>
                  <div className="space-y-6">
                    {educations.map((edu, i) => (
                      <div key={edu.id} className={i > 0 ? 'border-t border-white/5 pt-6' : ''}>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                          <p className="font-semibold">{edu.degree}</p>
                          <span className="shrink-0 text-sm text-slate-500">{edu.year_range}</span>
                        </div>
                        <p className="text-sm text-slate-400">{edu.institution}</p>
                        {edu.note && <p className="mt-1 text-sm text-slate-500">{edu.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
