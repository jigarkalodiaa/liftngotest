import { NextResponse } from 'next/server';
import { z } from 'zod';
import { appendMessage, getOrCreateSession, patchSession } from '@/lib/sessionService';
import { buildSystemPrompt, getChatCompletion, parseAssistantReply } from '@/lib/aiService';
import { saveChatLog, saveLead } from '@/lib/excelService';
import type { ChatApiResponse } from '@/types/chat';

export const maxDuration = 60;

const bodySchema = z.object({
  message: z.string().min(1).max(8000),
  session_id: z.string().min(8).max(200),
});

const BOOK_PATH = process.env.NEXT_PUBLIC_CHAT_BOOKING_PATH?.trim() || '/book-delivery';

const LEAD_PATTERN =
  /\b(book|booking|price|prices|quote|quot|transport|hire|hiring|cargo|deliver|delivery|b2b)\b/i;

function detectLeadIntent(text: string): boolean {
  return LEAD_PATTERN.test(text);
}

function extractPhone(text: string): string | null {
  const m = text.match(/(?:\+91[\s-]*)?(\d{10})\b/);
  return m ? m[1] : null;
}

function extractNameHint(text: string): string {
  let t = text.trim().replace(/(?:\+91[\s-]*)?\d{10}/g, ' ');
  const words = t.split(/\s+/).filter(Boolean).slice(0, 8);
  const name = words.join(' ').trim();
  return name.length > 1 ? name.slice(0, 120) : 'Website chat';
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY?.trim()) {
    const payload: ChatApiResponse = {
      reply: 'Chat is temporarily unavailable. Please use the Contact page to reach our team.',
      action: null,
    };
    return NextResponse.json(payload, { status: 503 });
  }

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

  const { message, session_id } = parsed.data;

  let session = getOrCreateSession(session_id);
  if (detectLeadIntent(message) && !session.leadSaved) {
    patchSession(session_id, { awaitingLeadDetails: true });
  }
  session = getOrCreateSession(session_id);
  const history = [...session.messages];

  let leadBoost = '';
  if (session.awaitingLeadDetails && !session.leadSaved) {
    leadBoost =
      '\n\n[Note: User showed booking, pricing, or transport interest. If name and 10-digit India mobile are not yet provided, ask in one short message. When they give a mobile number, acknowledge and confirm the team may follow up.]';
  }

  const systemPrompt = buildSystemPrompt(BOOK_PATH) + leadBoost;

  let rawReply: string;
  try {
    rawReply = await getChatCompletion(systemPrompt, history, message);
  } catch {
    rawReply = 'Something went wrong. Please try again.';
  }

  const { reply, redirectPath } = parseAssistantReply(rawReply);

  appendMessage(session_id, 'user', message);
  appendMessage(session_id, 'assistant', reply);

  const latest = getOrCreateSession(session_id);
  if (latest.awaitingLeadDetails && !latest.leadSaved) {
    const phone = extractPhone(message);
    if (phone) {
      const name = extractNameHint(message);
      await saveLead({
        name,
        phone,
        query: message.slice(0, 500),
        source: 'chatbot',
      });
      patchSession(session_id, { leadSaved: true, awaitingLeadDetails: false });
    }
  }

  void saveChatLog({
    session_id,
    user_message: message.slice(0, 2000),
    bot_response: reply.slice(0, 4000),
  });

  let action: ChatApiResponse['action'] = null;
  if (redirectPath) {
    const url = redirectPath.startsWith('/') ? redirectPath : `/${redirectPath}`;
    action = { type: 'redirect', url };
  }

  const payload: ChatApiResponse = { reply, action };
  return NextResponse.json(payload);
}
