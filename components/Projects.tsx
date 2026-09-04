'use client';

import { ExternalLink, Github, ImageIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import type { Project } from '@/lib/types';

export default function Projects({ projects }: { projects: Project[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) if (p.category) set.add(p.category);
    return Array.from(set);
  }, [projects]);

  const [filter, setFilter] = useState('all');
  const visible = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Selected Work" title="Featured" accent="Projects" />

        {categories.length > 1 && (
          <Reveal className="mb-12 flex flex-wrap items-center justify-center gap-3">
            {[{ key: 'all', label: 'All Projects' }, ...categories.map((c) => ({ key: c, label: c }))].map(
              (tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilter(tab.key)}
                  data-active={filter === tab.key}
                  className="filter-tab rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-slate-400 hover:border-white/20 hover:text-white"
                >
                  {tab.label}
                </button>
              )
            )}
          </Reveal>
        )}

        {visible.length === 0 ? (
          <p className="py-12 text-center text-slate-500">Project akan segera ditambahkan.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {visible.map((project, i) => (
              <Reveal
                key={project.id}
                direction="scale"
                delay={i * 60}
                as="article"
                className="group glass-card no-lift overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  {project.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/10 to-cyan-500/10">
                      <ImageIcon className="h-12 w-12 text-indigo-400/30" />
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {project.category && (
                    <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-indigo-600/90 px-3 py-1 text-xs text-white">
                      {project.category}
                    </span>
                  )}
                  {project.featured && (
                    <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-amber-400/30 bg-amber-400/15 px-3 py-1 text-xs text-amber-300">
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold transition-colors duration-300 group-hover:text-indigo-400">
                      {project.title}
                    </h3>
                    {project.project_date && (
                      <span className="shrink-0 pt-1 text-xs text-slate-500">{project.project_date}</span>
                    )}
                  </div>

                  {project.description && (
                    <p className="mb-4 text-sm leading-relaxed text-slate-400">{project.description}</p>
                  )}

                  {project.tech.length > 0 && (
                    <div className="mb-5 flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-indigo-500/10 bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {(project.url || project.repo_url) && (
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 font-semibold text-indigo-400 hover:text-indigo-300"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Live Demo
                        </a>
                      )}
                      {project.repo_url && (
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-slate-400 hover:text-white"
                        >
                          <Github className="h-4 w-4" />
                          Source
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
