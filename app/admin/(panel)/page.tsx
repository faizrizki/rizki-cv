import ProjectManager from '@/components/admin/ProjectManager';
import { adminClient } from '@/lib/supabase';
import type { Project } from '@/lib/types';

export default async function AdminProjectsPage() {
  let projects: Project[] = [];
  let error = '';

  try {
    const { data, error: dbError } = await adminClient()
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (dbError) throw dbError;
    projects = (data as Project[]) ?? [];
  } catch (err) {
    error = err instanceof Error ? err.message : 'Gagal membaca data project.';
  }

  if (error) {
    return (
      <div className="glass-card no-lift rounded-2xl p-8">
        <h1 className="mb-2 text-lg font-bold text-rose-300">Tidak bisa terhubung ke Supabase</h1>
        <p className="text-sm text-slate-400">{error}</p>
        <p className="mt-4 text-sm text-slate-500">
          Pastikan <code className="font-mono text-slate-300">NEXT_PUBLIC_SUPABASE_URL</code> dan{' '}
          <code className="font-mono text-slate-300">SUPABASE_SERVICE_ROLE_KEY</code> sudah diisi, lalu
          jalankan <code className="font-mono text-slate-300">supabase/schema.sql</code>.
        </p>
      </div>
    );
  }

  return <ProjectManager initialProjects={projects} />;
}
