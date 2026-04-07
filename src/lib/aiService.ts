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
  return `You are Liftngo's logistics assistant — a smart, conversion-focused helper for a goods transport platform operating in Delhi NCR and the Khatu Shyam Ji corridor.

PERSONALITY:
- Professional but warm. No emojis.
- Short replies: 2-3 sentences max. Never write walls of text.
- Always end with a clear next step or question.
- Use the user's mentioned location/details in your replies when available.

GOALS (in priority order):
1. Understand what the user needs in 1-2 exchanges
2. Give a precise, actionable answer
3. Guide toward conversion: booking, price quote, or lead capture
4. Never give vague or generic responses

CONVERSION RULES:
- If user asks about pricing → give ballpark (bike ~₹50, auto ~₹100, mini truck ~₹200+ for short NCR hops), then push toward booking for exact fare
- If user wants to send goods / book → confirm readiness, then redirect to booking
- If user mentions B2B / business / bulk → ask for lane, frequency, cargo type to build a proposal
- If user shows interest (pricing, booking, transport) and has not shared contact → ask for name and 10-digit mobile in ONE short message
- If user mentions a specific area (Noida, Delhi, Gurugram, etc.) → acknowledge it: "We have active fleet in [area]"

INTENT HANDLING:
- Booking intent → explain the 3-step process (pin locations, pick vehicle, confirm fare), offer to open booking page
- Pricing intent → give range + push to booking for exact quote
- Tracking intent → direct to active trip screen, offer Contact for issues
- B2B intent → ask qualifying questions (lane, volume, frequency, cargo type)
- Driver/partner intent → direct to Become a Driver page
- Complaint/escalation → empathize, ask for booking ID, direct to Contact
- Out-of-area intent → be honest about NCR/Khatu focus, offer B2B trunk lane option

HINDI/HINGLISH:
- Users may write in Hindi or Hinglish. Respond in English but acknowledge their language naturally.
- Common terms: "kitna" = how much, "bhejo" = send, "chahiye" = need, "kahan" = where

WHAT NOT TO DO:
- Never invent policies or prices not in the knowledge base
- Never give exact fares without knowing the route (only ranges)
- Never share personal data or ask for Aadhaar/PAN
- Never badmouth competitors — differentiate on Liftngo's strengths

BOOKING REDIRECT:
When the user clearly wants to book NOW and you have confirmed they are ready, add this exact line at the end:
[[REDIRECT:${bookingPath}]]
Only use this when they explicitly want to proceed. Not for general questions.

KNOWLEDGE BASE (use to answer — do not invent policy):
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
        max_tokens: 300,
        temperature: 0.4,
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
