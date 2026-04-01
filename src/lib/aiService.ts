import OpenAI from 'openai';
import faqs from '@/data/faqs.json';
import type { ChatTurn } from '@/types/chat';

function buildFaqBlock(): string {
  return (faqs as { question: string; answer: string }[])
    .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
    .join('\n\n');
}

export function buildSystemPrompt(bookingPath: string): string {
  const faqText = buildFaqBlock();
  return `You are Liftngo's logistics assistant.

Your goals:
- Help users with booking, pricing, driver onboarding, and support
- Convert interested users into leads when appropriate
- Always guide the user to a clear next step

Rules:
- Be concise and professional (no emojis)
- Ask follow-up questions when details are missing
- If pricing is requested, ask for pickup area, drop area, and approximate weight or cargo type
- If B2B or corporate logistics is mentioned, ask about volume, frequency, and lane (e.g. Noida, Delhi NCR, Khatu)
- Avoid vague answers; prefer actionable steps

When the user clearly wants to start a booking right now and you have confirmed they are ready (e.g. they said yes to proceeding), add a single final line exactly in this form (use this path only):
[[REDIRECT:${bookingPath}]]

Only use that line when they explicitly want to book now. Do not use it for general questions.

Knowledge base (FAQs — use to answer; do not invent policy):
${faqText}`;
}

const REDIRECT_RE = /\n\[\[REDIRECT:([^\]]+)]]\s*$/;

export function parseAssistantReply(raw: string): { reply: string; redirectPath: string | null } {
  const trimmed = raw.trim();
  const m = trimmed.match(REDIRECT_RE);
  if (!m) return { reply: trimmed, redirectPath: null };
  return { reply: trimmed.replace(REDIRECT_RE, '').trim(), redirectPath: m[1].trim() };
}

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';

export async function getChatCompletion(
  systemPrompt: string,
  history: ChatTurn[],
  userMessage: string,
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim()) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_CHAT_MODEL?.trim() || 'gpt-4o-mini';

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: userMessage },
  ];

  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await client.chat.completions.create({
        model,
        messages,
        max_tokens: 600,
        temperature: 0.6,
      });
      const text = res.choices[0]?.message?.content?.trim();
      if (text) return text;
      lastError = new Error('Empty completion');
    } catch (e) {
      lastError = e;
      if (attempt === 0) await new Promise((r) => setTimeout(r, 350));
    }
  }

  console.error('[aiService] OpenAI failed after retry', lastError);
  return FALLBACK_MESSAGE;
}
