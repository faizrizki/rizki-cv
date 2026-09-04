'use client';

import { Loader2, Save, X } from 'lucide-react';
import { useState } from 'react';
import ImagePicker, { type PickedImage } from './ImagePicker';
import type { Project } from '@/lib/types';

const CATEGORIES = ['Web App', 'Mobile App', 'Website', 'API / Backend', 'UI/UX', 'Lainnya'];

export type ProjectDraft = {
  title: string;
  description: string;
  url: string;
  repo_url: string;
  tech: string;
  category: string;
  project_date: string;
  featured: boolean;
  image: PickedImage | null;
};

function toDraft(project?: Project | null): ProjectDraft {
  return {
    title: project?.title ?? '',
    description: project?.description ?? '',
    url: project?.url ?? '',
    repo_url: project?.repo_url ?? '',
    tech: project?.tech.join(', ') ?? '',
    category: project?.category ?? CATEGORIES[0],
    project_date: project?.project_date ?? '',
    featured: project?.featured ?? false,
    image: project?.thumbnail_url
      ? { url: project.thumbnail_url, path: project.thumbnail_path }
      : null,
  };
}

export default function ProjectForm({
  project,
  onCancel,
  onSaved,
}: {
  project?: Project | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState<ProjectDraft>(() => toDraft(project));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const editing = Boolean(project);

  function set<K extends keyof ProjectDraft>(key: K, value: ProjectDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.title.trim()) {
      setError('Judul project wajib diisi.');
      return;
    }

    setBusy(true);
    setError('');

    const payload = {
      title: draft.title,
      description: draft.description,
      url: draft.url,
      repo_url: draft.repo_url,
      tech: draft.tech,
      category: draft.category,
      project_date: draft.project_date,
      featured: draft.featured,
      thumbnail_url: draft.image?.url ?? '',
      thumbnail_path: draft.image?.path ?? '',
    };

    try {
      const res = await fetch(editing ? `/api/projects/${project!.id}` : '/api/projects', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Gagal menyimpan project.');
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan project.');
      setBusy(false);
    }
  }

  /** Batal: gambar yang sudah ke-upload tapi belum tersimpan ikut dibuang. */
  async function handleCancel() {
    const path = draft.image?.path;
    const wasSaved = project?.thumbnail_path;
    if (path && path !== wasSaved) {
      await fetch(`/api/upload?path=${encodeURIComponent(path)}`, { method: 'DELETE' });
    }
    onCancel();
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card no-lift mb-8 rounded-2xl p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold">{editing ? 'Edit Project' : 'Tambah Project Baru'}</h2>
        <button
          type="button"
          onClick={handleCancel}
          aria-label="Tutup form"
          className="text-slate-500 transition-colors hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="field-label" htmlFor="p-title">
            Judul Project *
          </label>
          <input
            id="p-title"
            value={draft.title}
            onChange={(e) => set('title', e.target.value)}
            maxLength={160}
            className="field"
            placeholder="Project Management Tool"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="p-desc">
            Deskripsi
          </label>
          <textarea
            id="p-desc"
            value={draft.description}
            onChange={(e) => set('description', e.target.value)}
            rows={4}
            maxLength={2000}
            className="field resize-y"
            placeholder="Ceritakan singkat: masalah apa yang dipecahkan dan apa yang kamu kerjakan."
          />
          <p className="mt-1 text-xs text-slate-500">{draft.description.length}/2000 karakter</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="p-url">
              Link Demo
            </label>
            <input
              id="p-url"
              type="url"
              value={draft.url}
              onChange={(e) => set('url', e.target.value)}
              className="field"
              placeholder="https://project.vercel.app"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="p-repo">
              Link Repository
            </label>
            <input
              id="p-repo"
              type="url"
              value={draft.repo_url}
              onChange={(e) => set('repo_url', e.target.value)}
              className="field"
              placeholder="https://github.com/user/repo"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="field-label" htmlFor="p-cat">
              Kategori
            </label>
            <select
              id="p-cat"
              value={draft.category}
              onChange={(e) => set('category', e.target.value)}
              className="field"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-slate-900">
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="p-date">
              Periode
            </label>
            <input
              id="p-date"
              value={draft.project_date}
              onChange={(e) => set('project_date', e.target.value)}
              maxLength={60}
              className="field"
              placeholder="Jan 2025 - Mar 2025"
            />
          </div>
          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-3 pb-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => set('featured', e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 accent-indigo-500"
              />
              Tandai Featured
            </label>
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="p-tech">
            Tech Stack
          </label>
          <input
            id="p-tech"
            value={draft.tech}
            onChange={(e) => set('tech', e.target.value)}
            className="field"
            placeholder="React.js, Supabase, Tailwind"
          />
          <p className="mt-1 text-xs text-slate-500">Pisahkan dengan koma. Maksimal 12 item.</p>
        </div>

        <ImagePicker value={draft.image} onChange={(image) => set('image', image)} />

        {error && (
          <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3 border-t border-white/5 pt-5">
          <button type="submit" disabled={busy} className="btn-primary">
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> {editing ? 'Simpan Perubahan' : 'Simpan Project'}
              </>
            )}
          </button>
          <button type="button" onClick={handleCancel} disabled={busy} className="btn-ghost">
            Batal
          </button>
        </div>
      </div>
    </form>
  );
}
