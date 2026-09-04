'use client';

import { KeyRound, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Login gagal.');

      router.replace(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal.');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card no-lift w-full max-w-sm rounded-2xl p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
          <KeyRound className="h-5 w-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-lg font-bold">Admin Panel</h1>
          <p className="text-xs text-slate-500">Masuk untuk mengelola project</p>
        </div>
      </div>

      <label className="field-label" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        type="password"
        autoFocus
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="field"
        placeholder="••••••••"
      />

      {error && (
        <p className="mt-4 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </p>
      )}

      <button type="submit" disabled={busy || !password} className="btn-primary mt-6 w-full">
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Memeriksa...
          </>
        ) : (
          'Masuk'
        )}
      </button>

      <a href="/" className="mt-4 block text-center text-xs text-slate-500 hover:text-slate-300">
        &larr; Kembali ke landing page
      </a>
    </form>
  );
}
