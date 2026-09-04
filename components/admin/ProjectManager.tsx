'use client';

import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Star,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import ProjectForm from './ProjectForm';
import type { Project } from '@/lib/types';

export default function ProjectManager({ initialProjects }: { initialProjects: Project[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [projects, setProjects] = useState(initialProjects);
  const [mode, setMode] = useState<{ kind: 'closed' } | { kind: 'new' } | { kind: 'edit'; project: Project }>({
    kind: 'closed',
  });
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function reload() {
    const res = await fetch('/api/projects');
    if (res.ok) {
      const json = await res.json();
      setProjects(json.projects as Project[]);
    }
    refresh();
  }

  async function patch(id: string, body: Record<string, unknown>) {
    setBusyId(id);
    setError('');
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Gagal memperbarui project.');
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memperbarui project.');
    } finally {
      setBusyId(null);
    }
  }

  async function remove(project: Project) {
    if (!confirm(`Hapus project "${project.title}"? Gambarnya juga ikut terhapus.`)) return;

    setBusyId(project.id);
    setError('');
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Gagal menghapus project.');
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus project.');
    } finally {
      setBusyId(null);
    }
  }

  /** Tukar posisi dengan tetangganya, lalu tulis ulang sort_order 1..n. */
  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;

    const reordered = [...projects];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setProjects(reordered);

    setBusyId(projects[index].id);
    setError('');
    try {
      await Promise.all(
        reordered.map((project, i) =>
          fetch(`/api/projects/${project.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sort_order: i + 1 }),
          })
        )
      );
      await reload();
    } catch {
      setError('Gagal mengubah urutan.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">
            Kelola <span className="text-gradient">Project</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {projects.length} project tampil di landing page.
          </p>
        </div>
        {mode.kind === 'closed' && (
          <button type="button" onClick={() => setMode({ kind: 'new' })} className="btn-primary">
            <Plus className="h-4 w-4" />
            Tambah Project
          </button>
        )}
      </div>

      {mode.kind !== 'closed' && (
        <ProjectForm
          project={mode.kind === 'edit' ? mode.project : null}
          onCancel={() => setMode({ kind: 'closed' })}
          onSaved={async () => {
            setMode({ kind: 'closed' });
            await reload();
          }}
        />
      )}

      {error && (
        <p className="mb-6 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </p>
      )}

      {projects.length === 0 ? (
        <div className="glass-card no-lift rounded-2xl p-12 text-center">
          <ImageIcon className="mx-auto mb-4 h-10 w-10 text-slate-600" />
          <p className="text-slate-400">Belum ada project. Klik &ldquo;Tambah Project&rdquo; untuk mulai.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {projects.map((project, index) => (
            <li key={project.id} className="glass-card no-lift rounded-2xl p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl border border-white/5 bg-slate-900 sm:w-44">
                  {project.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-600">
                      <ImageIcon className="h-7 w-7" />
                    </div>
                  )}
                  {busyId === project.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70">
                      <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{project.title}</h3>
                    {project.featured && (
                      <span className="rounded-full border border-amber-400/30 bg-amber-400/15 px-2 py-0.5 text-xs text-amber-300">
                        Featured
                      </span>
                    )}
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-400">
                      {project.category}
                    </span>
                  </div>

                  {project.project_date && (
                    <p className="mt-1 text-xs text-slate-500">{project.project_date}</p>
                  )}

                  {project.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-slate-400">{project.description}</p>
                  )}

                  {project.tech.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded border border-indigo-500/10 bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {project.url.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap items-start gap-2 sm:flex-col">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={index === 0 || busyId !== null}
                      onClick={() => move(index, -1)}
                      aria-label="Naikkan urutan"
                      className="rounded-lg border border-white/10 p-2 text-slate-400 transition-colors hover:text-white disabled:opacity-30"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === projects.length - 1 || busyId !== null}
                      onClick={() => move(index, 1)}
                      aria-label="Turunkan urutan"
                      className="rounded-lg border border-white/10 p-2 text-slate-400 transition-colors hover:text-white disabled:opacity-30"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={busyId !== null}
                      onClick={() => patch(project.id, { featured: !project.featured })}
                      aria-label="Toggle featured"
                      className={`rounded-lg border border-white/10 p-2 transition-colors hover:text-amber-300 disabled:opacity-30 ${
                        project.featured ? 'text-amber-300' : 'text-slate-400'
                      }`}
                    >
                      <Star className="h-4 w-4" fill={project.featured ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={busyId !== null}
                      onClick={() => {
                        setMode({ kind: 'edit', project });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="btn-ghost !px-3 !py-2 !text-xs"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={busyId !== null}
                      onClick={() => remove(project)}
                      className="btn-danger !px-3 !py-2 !text-xs"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
