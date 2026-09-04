/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Thumbnail dari Supabase Storage. Sengaja pakai wildcard statis, bukan
    // hasil parse env: nilai env yang salah format pernah bikin config ini
    // throw dan build Vercel mati sebelum apa pun dikompilasi.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
