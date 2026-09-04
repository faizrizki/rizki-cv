import MessageList from '@/components/admin/MessageList';
import { adminClient } from '@/lib/supabase';
import type { Message } from '@/lib/types';

export default async function AdminMessagesPage() {
  let messages: Message[] = [];
  let error = '';

  try {
    const { data, error: dbError } = await adminClient()
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (dbError) throw dbError;
    messages = (data as Message[]) ?? [];
  } catch (err) {
    error = err instanceof Error ? err.message : 'Gagal membaca pesan.';
  }

  if (error) {
    return (
      <div className="glass-card no-lift rounded-2xl p-8">
        <h1 className="mb-2 text-lg font-bold text-rose-300">Tidak bisa membaca pesan</h1>
        <p className="text-sm text-slate-400">{error}</p>
      </div>
    );
  }

  return <MessageList initialMessages={messages} />;
}
