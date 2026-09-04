import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import { isAdmin } from '@/lib/session';
import { adminClient } from '@/lib/supabase';

export const metadata: Metadata = { title: 'Admin — Muhammad Rizki', robots: { index: false } };

/** Semua halaman panel butuh data segar, jangan di-cache. */
export const dynamic = 'force-dynamic';

async function countUnread(): Promise<number> {
  try {
    const { count } = await adminClient()
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('is_read', false);
    return count ?? 0;
  } catch {
    return 0;
  }
}

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  // Middleware sudah memfilter, ini lapisan kedua kalau matcher berubah.
  if (!(await isAdmin())) redirect('/admin/login');

  return (
    <div className="gradient-bg min-h-screen">
      <AdminNav unread={await countUnread()} />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
