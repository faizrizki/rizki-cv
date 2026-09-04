import { Github, Linkedin, Mail } from 'lucide-react';
import type { Profile } from '@/lib/types';

export default function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-white/5 px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} {profile.name}. Built with Next.js &amp; Supabase.
        </p>
        <div className="flex items-center gap-4">
          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-slate-500 transition-colors hover:text-indigo-400"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {profile.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-slate-500 transition-colors hover:text-indigo-400"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="text-slate-500 transition-colors hover:text-indigo-400"
            >
              <Mail className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
