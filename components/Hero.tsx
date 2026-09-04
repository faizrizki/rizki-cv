import { ArrowRight, Download } from 'lucide-react';
import Typing from './Typing';
import type { Profile } from '@/lib/types';

export default function Hero({ profile }: { profile: Profile }) {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20"
    >
      {/* Latar: pola grid + dua orb gradient. Semuanya CSS, tidak ada canvas
          atau loop animasi JavaScript yang jalan saat halaman di-scroll. */}
      <div className="grid-backdrop" />
      <div className="orb orb-indigo -left-[10%] top-[8%] h-[520px] w-[520px]" />
      <div className="orb orb-cyan -right-[10%] top-[45%] h-[420px] w-[420px] [animation-delay:-12s]" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {profile.available_for_work && (
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Open to Work
          </div>
        )}

        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-slate-500 md:text-base">
          Hello, I&apos;m {profile.name}
        </p>

        <h1 className="mb-6 text-5xl font-black leading-none tracking-tight md:text-7xl lg:text-8xl">
          <span className="text-gradient text-gradient-live">{profile.role}</span>
          <br />
          <span className="text-white">
            <Typing words={profile.typing_words} />
          </span>
        </h1>

        {profile.tagline && (
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
            {profile.tagline}
          </p>
        )}

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href="#projects" className="btn-primary group !px-8 !py-4">
            View My Work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          {profile.cv_url && (
            <a href={profile.cv_url} target="_blank" rel="noreferrer" className="btn-ghost !px-8 !py-4">
              <Download className="h-4 w-4" />
              Download CV
            </a>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-slate-500 md:flex">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="flex h-8 w-5 justify-center rounded-full border border-slate-600 pt-1.5">
          <div className="h-2 w-1 animate-bounce rounded-full bg-slate-500" />
        </div>
      </div>
    </section>
  );
}
