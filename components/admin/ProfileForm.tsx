'use client';

import { CheckCircle2, Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ImagePicker, { type PickedImage } from './ImagePicker';
import { pathFromPublicUrl } from '@/lib/storage-path';
import type { Profile } from '@/lib/types';

export default function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();

  const [form, setForm] = useState({
    ...profile,
    typing_words: profile.typing_words.join(', '),
  });
  const [photo, setPhoto] = useState<PickedImage | null>(
    profile.photo_url
      ? { url: profile.photo_url, path: pathFromPublicUrl(profile.photo_url) }
      : null
  );
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, photo_url: photo?.url ?? '' }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Gagal menyimpan profil.');

      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan profil.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8">
        <h1 className="text-2xl font-black">
          Edit <span className="text-gradient">Profil</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Data ini yang tampil di hero, section About, dan kontak.
        </p>
      </div>

      <div className="space-y-6">
        <section className="glass-card no-lift rounded-2xl p-6 sm:p-8">
          <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-indigo-400">Identitas</h2>
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="f-name">
                  Nama *
                </label>
                <input
                  id="f-name"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  className="field"
                />
              </div>
              <div>
                <label className="field-label" htmlFor="f-role">
                  Role
                </label>
                <input
                  id="f-role"
                  value={form.role}
                  onChange={(e) => set('role', e.target.value)}
                  className="field"
                  placeholder="Software Engineer"
                />
              </div>
            </div>

            <div>
              <label className="field-label" htmlFor="f-words">
                Kata Berganti di Hero
              </label>
              <input
                id="f-words"
                value={form.typing_words}
                onChange={(e) => set('typing_words', e.target.value)}
                className="field"
                placeholder="Software Engineer, Web Developer, Fresh Graduate"
              />
              <p className="mt-1 text-xs text-slate-500">Pisahkan dengan koma.</p>
            </div>

            <div>
              <label className="field-label" htmlFor="f-tagline">
                Tagline
              </label>
              <textarea
                id="f-tagline"
                value={form.tagline}
                onChange={(e) => set('tagline', e.target.value)}
                rows={2}
                className="field resize-y"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="f-bio">
                Bio / About
              </label>
              <textarea
                id="f-bio"
                value={form.bio}
                onChange={(e) => set('bio', e.target.value)}
                rows={6}
                className="field resize-y"
              />
            </div>

            <ImagePicker
              value={photo}
              onChange={(next) => {
                setPhoto(next);
                setSaved(false);
              }}
              folder="profile"
              label="Foto Profil"
              aspect="aspect-square"
              maxSize={800}
            />
          </div>
        </section>

        <section className="glass-card no-lift rounded-2xl p-6 sm:p-8">
          <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-indigo-400">Kontak</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="f-email">
                Email
              </label>
              <input
                id="f-email"
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className="field"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="f-phone">
                Telepon
              </label>
              <input
                id="f-phone"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                className="field"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="f-loc">
                Lokasi
              </label>
              <input
                id="f-loc"
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                className="field"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="f-cv">
                Link CV
              </label>
              <input
                id="f-cv"
                value={form.cv_url}
                onChange={(e) => set('cv_url', e.target.value)}
                className="field"
                placeholder="/cv-muhammad-rizki.pdf"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="f-li">
                LinkedIn
              </label>
              <input
                id="f-li"
                type="url"
                value={form.linkedin_url}
                onChange={(e) => set('linkedin_url', e.target.value)}
                className="field"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="f-gh">
                GitHub
              </label>
              <input
                id="f-gh"
                type="url"
                value={form.github_url}
                onChange={(e) => set('github_url', e.target.value)}
                className="field"
              />
            </div>
          </div>
        </section>

        <section className="glass-card no-lift rounded-2xl p-6 sm:p-8">
          <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-indigo-400">
            Statistik &amp; Status
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="field-label" htmlFor="f-sp">
                Jumlah Project
              </label>
              <input
                id="f-sp"
                type="number"
                min={0}
                value={form.stat_projects}
                onChange={(e) => set('stat_projects', Number(e.target.value))}
                className="field"
              />
              <p className="mt-1 text-xs text-slate-500">Dipakai kalau daftar project masih kosong.</p>
            </div>
            <div>
              <label className="field-label" htmlFor="f-sy">
                Tahun Belajar
              </label>
              <input
                id="f-sy"
                type="number"
                min={0}
                value={form.stat_years_study}
                onChange={(e) => set('stat_years_study', Number(e.target.value))}
                className="field"
              />
            </div>
            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-3 pb-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={form.available_for_work}
                  onChange={(e) => set('available_for_work', e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 accent-indigo-500"
                />
                Tampilkan badge &ldquo;Open to Work&rdquo;
              </label>
            </div>
          </div>
        </section>

        {error && (
          <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </p>
        )}

        <div className="flex items-center gap-4">
          <button type="submit" disabled={busy} className="btn-primary">
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Simpan Profil
              </>
            )}
          </button>
          {saved && (
            <span className="inline-flex items-center gap-2 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> Tersimpan
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
