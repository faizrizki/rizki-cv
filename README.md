# Portofolio Muhammad Rizki

Website profil pribadi + CMS ringan. Admin bisa menambah, mengedit, mengurutkan,
dan menghapus project langsung dari browser, termasuk upload thumbnail yang
otomatis dikompres supaya kuota Supabase hemat.

- **Stack:** Next.js 15 (App Router) - TypeScript - Tailwind CSS - Supabase (PostgreSQL + Storage)
- **Deploy:** Vercel (push -> deploy)
- **Landing page:** `/`
- **CMS admin:** `/admin`

---

## 1. Setup Supabase (satu query, sekali jalan)

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor -> New query**.
3. Buka file `supabase/schema.sql`, **Ctrl+A -> Ctrl+C**, paste ke SQL Editor, klik **Run**.

Satu query itu sekaligus membuat:

| Yang dibuat | Isi |
|---|---|
| Tabel | `profile`, `skills`, `experiences`, `educations`, `projects`, `messages` |
| Keamanan | RLS aktif: publik hanya bisa `SELECT`, semua tulis lewat server |
| Storage | Bucket publik `project-images`, limit 512 KB/file |
| Seed | Data profil, skill, pendidikan, pengalaman, dan 3 project dari CV |

Script-nya idempotent, aman dijalankan ulang tanpa bikin data dobel.

Ambil kredensialnya di **Project Settings -> API**:
- `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` -> `SUPABASE_SERVICE_ROLE_KEY` (rahasia, server saja)

## 2. Jalankan di lokal

```bash
cp .env.example .env.local   # lalu isi nilainya
npm install
npm run dev
```

Buka http://localhost:3000 dan http://localhost:3000/admin

Untuk `AUTH_SECRET`, buat string acak:

```bash
openssl rand -hex 32
```

## 3. Deploy ke Vercel

```bash
git add -A
git commit -m "Portofolio Rizki: landing page + CMS"
git push
```

1. Di [vercel.com](https://vercel.com) -> **Add New Project** -> import repo ini.
2. Framework terdeteksi otomatis sebagai Next.js, biarkan setelannya default.
3. Isi **Environment Variables** dengan 6 nilai dari `.env.example` (`CRON_SECRET` boleh dikosongkan).
4. **Deploy**. Push berikutnya ke `main` otomatis ter-deploy.

## 4. Cara pakai CMS

Login di `/admin` pakai `ADMIN_PASSWORD`. Sesi bertahan 12 jam.

| Halaman | Fungsi |
|---|---|
| `/admin` | Tambah/edit/hapus project, atur urutan, tandai *Featured* |
| `/admin/profile` | Nama, role, tagline, bio, foto, kontak, badge *Open to Work* |
| `/admin/messages` | Pesan dari form kontak landing page |

Isi form project: **judul**, **deskripsi**, **link demo**, **link repository**,
**kategori**, **periode**, **tech stack** (dipisah koma), dan **thumbnail**.

### Kompresi gambar

Thumbnail diproses di browser sebelum di-upload:

1. Sisi terpanjang di-resize ke maksimal **1200 px** (foto profil: 800 px).
2. Di-encode ulang ke **WebP**, kualitas diturunkan bertahap sampai file **di bawah ~180 KB**.
3. Baru dikirim ke Supabase Storage; server menolak file di atas 512 KB.

Efeknya foto 4 MB dari HP biasanya jadi ~80-120 KB. Gambar lama otomatis
dihapus dari storage saat diganti atau saat project dihapus, jadi tidak ada
file nyangkut yang memakan kuota.

## 5. Keep-alive Supabase

Project Supabase gratis di-pause kalau tidak menerima request selama beberapa
hari. Supaya web tidak tiba-tiba mati saat dilihat recruiter, ada cron harian:

- `vercel.json` mendaftarkan Vercel Cron ke `/api/keep-alive`, jalan tiap hari
  pukul **03:00 UTC (10:00 WIB)**.
- Endpoint-nya menembak satu query paling murah (`count` di tabel `profile`),
  cukup untuk dihitung sebagai aktivitas.
- Isi env `CRON_SECRET` dengan string acak (`openssl rand -hex 16`). Vercel
  otomatis mengirimkannya sebagai header `Authorization: Bearer ...` saat cron
  jalan, jadi endpoint-nya tidak bisa dipicu orang lain. Kalau dibiarkan
  kosong, endpoint tetap jalan tapi terbuka untuk umum.

Cek manual setelah deploy:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://<domain>/api/keep-alive
```

Balasannya `{"ok":true,"pinged_at":...,"duration_ms":...}`. Riwayat jalannya
bisa dilihat di Vercel → project → **Cron Jobs**.

Catatan: Vercel Hobby membatasi cron jadi sekali sehari, dan itu sudah cukup.

## 6. Kenapa web-nya ringan

Beberapa keputusan sengaja diambil supaya scroll tetap mulus, terutama di HP:

- **Tidak ada canvas partikel.** Versi awal menggambar titik + garis penghubung
  tiap frame — 70 titik berarti 2.415 pengecekan pasangan per frame. Diganti pola
  grid CSS dan dua orb radial-gradient: satu kali paint, nol kerja per-frame.
- **Nol `backdrop-filter`.** Sebelumnya 25 kartu memakai `blur(12px)`, yang
  memaksa browser me-render ulang area di belakang setiap kartu saat scroll.
  Di atas latar gelap, `rgba()` biasa terlihat nyaris sama.
- **Animasi hanya `transform` dan `opacity`**, dua properti yang ditangani
  compositor tanpa memicu layout atau paint ulang.
- **Shimmer teks gradient cuma di judul hero.** Animasi `background-position`
  memicu repaint terus-menerus, jadi tidak dipakai di 10 tempat.
- **Listener scroll di-throttle `requestAnimationFrame`**, elemen section
  di-cache sekali, dan state hanya di-set kalau nilainya benar-benar berubah.
- **`transition: all` dihapus** dan diganti daftar properti yang eksplisit.
- Gambar di-`loading="lazy"` dan sudah dikompres jadi WebP di sisi browser.

## 7. Catatan keamanan

- `SUPABASE_SERVICE_ROLE_KEY` hanya dipakai di route handler (server). Tidak pernah dikirim ke browser.
- RLS aktif di semua tabel; anon key hanya bisa membaca. Tabel `messages` tidak punya policy sama sekali, jadi tidak bisa dibaca publik.
- Login admin: password tunggal ditukar cookie `httpOnly` yang ditandatangani HMAC-SHA256 (`AUTH_SECRET`), diperiksa di middleware dan di tiap route handler.

## 8. Struktur

```
app/
  page.tsx                  landing page (SSR dari Supabase, revalidate 60s)
  admin/login/              halaman login
  admin/(panel)/            CMS: projects, profile, messages
  api/                      auth, projects, upload, profile, messages, keep-alive
components/                 section landing page + komponen admin
lib/                        supabase client, auth, kompresi gambar, tipe data
supabase/schema.sql         satu query: skema + RLS + storage + seed
vercel.json                 jadwal cron keep-alive
```
