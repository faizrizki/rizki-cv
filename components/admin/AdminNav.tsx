'use client';

import { ExternalLink, FolderKanban, LogOut, Mail, UserCog } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: 'Projects', icon: FolderKanban },
  { href: '/admin/profile', label: 'Profil', icon: UserCog },
  { href: '/admin/messages', label: 'Pesan', icon: Mail },
];

export default function AdminNav({ unread }: { unread: number }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/5"
      style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(20px)' }}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-4">
        <Link href="/admin" className="text-lg font-bold text-gradient">
          MR. CMS
        </Link>

        <nav className="flex flex-1 flex-wrap items-center gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? 'bg-indigo-500/15 text-indigo-300'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
                {link.href === '/admin/messages' && unread > 0 && (
                  <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-xs text-rose-300">
                    {unread}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">Lihat Situs</span>
          </a>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
