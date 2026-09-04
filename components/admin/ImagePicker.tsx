'use client';

import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { compressImage, formatBytes } from '@/lib/compress';

export type PickedImage = { url: string; path: string };

/**
 * Pilih gambar -> dikompres di browser (resize 1200px + WebP) -> langsung
 * di-upload ke Supabase Storage. Yang disimpan ke form hanya URL + path-nya.
 */
export default function ImagePicker({
  value,
  onChange,
  folder = 'projects',
  label = 'Thumbnail',
  aspect = 'aspect-video',
  maxSize = 1200,
}: {
  value: PickedImage | null;
  onChange: (next: PickedImage | null) => void;
  folder?: 'projects' | 'profile';
  label?: string;
  aspect?: string;
  maxSize?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setBusy(true);
    setError('');
    setInfo('');

    try {
      const compressed = await compressImage(file, { maxSize });

      const form = new FormData();
      form.append('file', compressed.file);
      form.append('folder', folder);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Upload gagal.');

      // Gambar lama tidak dipakai lagi -> hapus supaya storage tetap lega.
      if (value?.path) {
        await fetch(`/api/upload?path=${encodeURIComponent(value.path)}`, { method: 'DELETE' });
      }

      onChange({ url: json.url, path: json.path });
      setInfo(
        `${formatBytes(compressed.originalBytes)} -> ${formatBytes(compressed.bytes)} ` +
          `(${compressed.width}x${compressed.height} px)`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memproses gambar.');
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove() {
    const path = value?.path;
    onChange(null);
    setInfo('');
    if (path) {
      await fetch(`/api/upload?path=${encodeURIComponent(path)}`, { method: 'DELETE' });
    }
  }

  return (
    <div>
      <span className="field-label">{label}</span>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className={`relative ${aspect} w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900 sm:w-56`}
        >
          {value?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.url} alt="Preview thumbnail" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-600">
              <ImagePlus className="h-8 w-8" />
            </div>
          )}
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="btn-ghost !py-2.5"
            >
              <ImagePlus className="h-4 w-4" />
              {value?.url ? 'Ganti Gambar' : 'Pilih Gambar'}
            </button>
            {value?.url && (
              <button type="button" disabled={busy} onClick={handleRemove} className="btn-danger">
                <Trash2 className="h-4 w-4" />
                Hapus
              </button>
            )}
          </div>

          <p className="text-xs leading-relaxed text-slate-500">
            Gambar otomatis di-resize maksimal {maxSize} px dan diubah ke WebP sebelum di-upload, jadi
            hemat kuota storage Supabase. Format: JPG, PNG, atau WebP.
          </p>

          {info && <p className="text-xs text-emerald-400">Terkompres: {info}</p>}
          {error && <p className="text-xs text-rose-400">{error}</p>}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
