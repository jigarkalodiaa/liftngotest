import { NextResponse } from 'next/server';
import { z } from 'zod';
import { hasSheetsBackend, persistChatLog } from '@/lib/sheetsBridge';

const bodySchema = z.object({
  session_id: z.string().min(8).max(200),
  user_message: z.string().min(1).max(8000),
  bot_response: z.string().min(1).max(8000),
});

/** Appends one row to ChatLogs via Apps Script or service account. */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  if (!hasSheetsBackend()) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    await persistChatLog(parsed.data);
  } catch (e) {
    console.error('[api/chat/log]', e);
    return NextResponse.json({ error: 'Failed to save log' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
