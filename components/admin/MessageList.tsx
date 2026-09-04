'use client';

import { Loader2, Mail, MailOpen, Reply, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Message } from '@/lib/types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MessageList({ initialMessages }: { initialMessages: Message[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function toggleRead(message: Message) {
    setBusyId(message.id);
    await fetch(`/api/messages/${message.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_read: !message.is_read }),
    });
    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...m, is_read: !m.is_read } : m))
    );
    setBusyId(null);
    router.refresh();
  }

  async function remove(message: Message) {
    if (!confirm(`Hapus pesan dari ${message.name}?`)) return;
    setBusyId(message.id);
    await fetch(`/api/messages/${message.id}`, { method: 'DELETE' });
    setMessages((prev) => prev.filter((m) => m.id !== message.id));
    setBusyId(null);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black">
          Pesan <span className="text-gradient">Masuk</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {messages.length} pesan, {messages.filter((m) => !m.is_read).length} belum dibaca.
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="glass-card no-lift rounded-2xl p-12 text-center">
          <Mail className="mx-auto mb-4 h-10 w-10 text-slate-600" />
          <p className="text-slate-400">Belum ada pesan yang masuk.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {messages.map((message) => (
            <li
              key={message.id}
              className={`glass-card no-lift rounded-2xl p-6 ${
                message.is_read ? '' : 'border-indigo-500/25'
              }`}
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{message.name}</h3>
                    {!message.is_read && (
                      <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300">
                        Baru
                      </span>
                    )}
                  </div>
                  <a
                    href={`mailto:${message.email}`}
                    className="text-sm text-slate-400 hover:text-indigo-400"
                  >
                    {message.email}
                  </a>
                </div>
                <span className="text-xs text-slate-500">{formatDate(message.created_at)}</span>
              </div>

              {message.subject && (
                <p className="mb-2 text-sm font-semibold text-slate-300">{message.subject}</p>
              )}
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-400">
                {message.body}
              </p>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-white/5 pt-4">
                <a
                  href={`mailto:${message.email}?subject=${encodeURIComponent(
                    message.subject ? `Re: ${message.subject}` : 'Re: pesan dari portofolio'
                  )}`}
                  className="btn-ghost !px-3 !py-2 !text-xs"
                >
                  <Reply className="h-3.5 w-3.5" />
                  Balas
                </a>
                <button
                  type="button"
                  disabled={busyId === message.id}
                  onClick={() => toggleRead(message)}
                  className="btn-ghost !px-3 !py-2 !text-xs"
                >
                  {busyId === message.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : message.is_read ? (
                    <Mail className="h-3.5 w-3.5" />
                  ) : (
                    <MailOpen className="h-3.5 w-3.5" />
                  )}
                  {message.is_read ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}
                </button>
                <button
                  type="button"
                  disabled={busyId === message.id}
                  onClick={() => remove(message)}
                  className="btn-danger !px-3 !py-2 !text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
