'use client';

import { CheckCircle2, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import type { Profile } from '@/lib/types';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact({ profile }: { profile: Profile }) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setStatus('sending');
    setError('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Pesan gagal dikirim.');

      form.reset();
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Pesan gagal dikirim.');
      setStatus('error');
    }
  }

  const details = [
    profile.email && { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    profile.phone && {
      icon: Phone,
      label: 'Phone',
      value: profile.phone,
      href: `tel:${profile.phone.replace(/\s/g, '')}`,
    },
    profile.location && { icon: MapPin, label: 'Location', value: profile.location, href: '' },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href: string }[];

  return (
    <section id="contact" className="px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Get In Touch" title="Let's Work" accent="Together" />

        <div className="grid gap-6 lg:grid-cols-5">
          <Reveal direction="left" className="space-y-4 lg:col-span-2">
            {details.map((item) => (
              <div key={item.label} className="glass-card flex items-center gap-4 rounded-2xl p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                  <item.icon className="h-5 w-5 text-indigo-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-slate-500">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="block truncate font-medium hover:text-indigo-400">
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-medium">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal direction="right" className="glass-card no-lift rounded-2xl p-8 lg:col-span-3">
            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="mb-4 h-12 w-12 text-emerald-400" />
                <h3 className="text-xl font-bold">Pesan terkirim</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Terima kasih. Saya akan membalas lewat email secepatnya.
                </p>
                <button type="button" onClick={() => setStatus('idle')} className="btn-ghost mt-6">
                  Kirim pesan lagi
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="c-name">
                      Nama
                    </label>
                    <input id="c-name" name="name" required maxLength={120} className="field" placeholder="Nama kamu" />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="c-email">
                      Email
                    </label>
                    <input
                      id="c-email"
                      name="email"
                      type="email"
                      required
                      maxLength={200}
                      className="field"
                      placeholder="email@contoh.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="field-label" htmlFor="c-subject">
                    Subjek
                  </label>
                  <input
                    id="c-subject"
                    name="subject"
                    maxLength={200}
                    className="field"
                    placeholder="Tawaran kerja, kolaborasi, ..."
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="c-body">
                    Pesan
                  </label>
                  <textarea
                    id="c-body"
                    name="body"
                    required
                    rows={5}
                    maxLength={4000}
                    className="field resize-y"
                    placeholder="Tulis pesanmu di sini..."
                  />
                </div>

                {status === 'error' && (
                  <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                    {error}
                  </p>
                )}

                <button type="submit" disabled={status === 'sending'} className="btn-primary w-full !py-4">
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Kirim Pesan
                    </>
                  )}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
