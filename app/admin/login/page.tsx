import type { Metadata } from 'next';
import LoginForm from '@/components/admin/LoginForm';

export const metadata: Metadata = { title: 'Login — Admin', robots: { index: false } };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  // Hanya izinkan redirect ke path internal.
  const target = next && next.startsWith('/admin') ? next : '/admin';

  return (
    <main className="gradient-bg flex min-h-screen items-center justify-center px-6">
      <LoginForm next={target} />
    </main>
  );
}
