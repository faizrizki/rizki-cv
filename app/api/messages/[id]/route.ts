import { fail, guard, ok, withErrors } from '@/lib/api';
import { adminClient } from '@/lib/supabase';

export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

/** Tandai pesan sudah dibaca / belum. */
const PATCH = withErrors(async (request: Request, { params }: Params) => {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail('Request tidak valid.');
  }

  const { error } = await adminClient()
    .from('messages')
    .update({ is_read: Boolean(body.is_read) })
    .eq('id', id);

  if (error) return fail(error.message, 500);
  return ok();
});

const DELETE = withErrors(async (_request: Request, { params }: Params) => {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await params;
  const { error } = await adminClient().from('messages').delete().eq('id', id);
  if (error) return fail(error.message, 500);
  return ok();
});

export { PATCH, DELETE };
