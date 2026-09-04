'use client';

import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#journey', label: 'Journey' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav({ initials }: { initials: string }) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);

      // Section yang sedang dilihat = yang paling dekat dengan sepertiga atas layar.
      let current = '';
      for (const link of LINKS) {
        const el = document.querySelector(link.href);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) {
          current = link.href;
        }
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 border-b border-white/5"
      style={{ background: 'rgba(2,6,23,0.8)', backdropFilter: 'blur(20px)' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#hero" className="text-xl font-bold text-gradient">
          {initials}
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-active={active === link.href}
              className="nav-link text-sm text-slate-400 transition-colors duration-300 hover:text-white data-[active=true]:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a href="#contact" className="hidden md:inline-flex btn-primary !px-5 !py-2.5">
            Hire Me
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            className="text-slate-400 transition-colors hover:text-white md:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="space-y-3 border-t border-white/5 px-6 py-4 md:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-sm text-slate-400 hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="block text-sm font-semibold text-indigo-400"
          >
            Hire Me
          </a>
        </div>
      )}

      <div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </nav>
  );
}
