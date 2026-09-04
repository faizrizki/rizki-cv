/**
 * Kompresi gambar di BROWSER sebelum di-upload.
 * Alasannya: storage Supabase free tier terbatas (1 GB), jadi thumbnail
 * di-resize + di-encode ulang ke WebP sampai ukurannya kecil.
 *
 * Hasil tipikal: foto 4 MB dari HP -> ~60-120 KB WebP 1200px.
 */

export type CompressOptions = {
  /** Sisi terpanjang maksimum dalam piksel. */
  maxSize?: number;
  /** Target ukuran file akhir dalam byte. */
  targetBytes?: number;
  /** Kualitas awal (0-1), diturunkan bertahap kalau masih kegedean. */
  quality?: number;
};

export type CompressResult = {
  file: File;
  width: number;
  height: number;
  originalBytes: number;
  bytes: number;
};

const DEFAULTS: Required<CompressOptions> = {
  maxSize: 1200,
  targetBytes: 180 * 1024,
  quality: 0.82,
};

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

async function loadBitmap(file: File): Promise<{ width: number; height: number; draw: CanvasImageSource; close: () => void }> {
  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(file);
    return {
      width: bitmap.width,
      height: bitmap.height,
      draw: bitmap,
      close: () => bitmap.close(),
    };
  }
  // Fallback untuk browser tua: pakai <img> + object URL.
  const url = URL.createObjectURL(file);
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Gambar tidak bisa dibaca.'));
    el.src = url;
  });
  return {
    width: img.naturalWidth,
    height: img.naturalHeight,
    draw: img,
    close: () => URL.revokeObjectURL(url),
  };
}

/** Cek sekali apakah browser bisa meng-encode WebP. */
function supportsWebp(): boolean {
  const c = document.createElement('canvas');
  c.width = 1;
  c.height = 1;
  return c.toDataURL('image/webp').startsWith('data:image/webp');
}

export async function compressImage(file: File, options: CompressOptions = {}): Promise<CompressResult> {
  const { maxSize, targetBytes, quality } = { ...DEFAULTS, ...options };

  if (!file.type.startsWith('image/')) {
    throw new Error('File yang dipilih bukan gambar.');
  }

  const source = await loadBitmap(file);
  try {
    const scale = Math.min(1, maxSize / Math.max(source.width, source.height));
    const width = Math.max(1, Math.round(source.width * scale));
    const height = Math.max(1, Math.round(source.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas tidak tersedia di browser ini.');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(source.draw, 0, 0, width, height);

    const mime = supportsWebp() ? 'image/webp' : 'image/jpeg';
    const ext = mime === 'image/webp' ? 'webp' : 'jpg';

    // Turunkan kualitas bertahap sampai di bawah target.
    let blob: Blob | null = null;
    for (const q of [quality, 0.7, 0.6, 0.5, 0.4]) {
      blob = await canvasToBlob(canvas, mime, q);
      if (blob && blob.size <= targetBytes) break;
    }
    if (!blob) throw new Error('Gagal mengompres gambar.');

    const base = (file.name.replace(/\.[^.]+$/, '') || 'thumbnail')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'thumbnail';

    return {
      file: new File([blob], `${base}.${ext}`, { type: mime }),
      width,
      height,
      originalBytes: file.size,
      bytes: blob.size,
    };
  } finally {
    source.close();
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
