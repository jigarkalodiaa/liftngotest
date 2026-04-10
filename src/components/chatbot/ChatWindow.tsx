'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import MessageBubble from './MessageBubble';
import { ROUTES } from '@/lib/constants';
import { trackWhatsAppClick } from '@/lib/analytics';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { apiClient } from '@/lib/api';
import {
  CHAT_WHATSAPP_PREFILL,
  LEAD_ASK_NAME,
  LEAD_THANK_YOU,
  type ChatState,
  type Message,
  getBotReply,
  typingDelayMs,
} from '@/lib/chatEngine';

const SEND_THROTTLE_MS = 400;
const SESSION_KEY = 'liftngo_chat_session';
/** Show WhatsApp escalation only after this many user-sent messages. */
const WHATSAPP_AFTER_USER_MESSAGES = 10;
const WELCOME_SUGGESTIONS = ['Book a delivery', 'Order food', 'Khatu hotels', 'Track booking'];

type Props = {
  onClose: () => void;
};

export default function ChatWindow({ onClose }: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [leadStep, setLeadStep] = useState<'ask_name' | 'ask_phone' | null>(null);
  const [leadData, setLeadData] = useState<{ name?: string; phone?: string }>({});
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const lastSendAt = useRef(0);
  const sessionIdRef = useRef<string | null>(null);
  const welcomeShownRef = useRef(false);
  const whatsappHref = useMemo(() => getWhatsAppUrl(CHAT_WHATSAPP_PREFILL), []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    sessionIdRef.current = id;
  }, []);

  useEffect(() => {
    if (welcomeShownRef.current) return;
    welcomeShownRef.current = true;
    setMessages([
      {
        role: 'assistant',
        content:
          'Welcome to Liftngo Assistant. I can help you with instant booking, live trip updates, food ordering, and Khatu travel plans. What would you like to do first?',
        suggestionChips: WELCOME_SUGGESTIONS,
      },
    ]);
  }, []);

  const userMessageCount = messages.filter((m) => m.role === 'user').length;
  const showWhatsAppEscalation = userMessageCount >= WHATSAPP_AFTER_USER_MESSAGES;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, pendingRedirectUrl]);

  const processUserMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;
      const now = Date.now();
      if (now - lastSendAt.current < SEND_THROTTLE_MS) return;
      lastSendAt.current = now;

      setPendingRedirectUrl(null);

      const userMsg: Message = { role: 'user', content: trimmed };
      const nextMessages = [...messages, userMsg];

      setMessages(nextMessages);
      setLoading(true);

      const stateForEngine: ChatState = {
        messages: nextMessages,
        leadStep,
        leadData,
      };

      await new Promise((r) => setTimeout(r, typingDelayMs()));

      const result = getBotReply(trimmed, stateForEngine);

      const appendAssistant = (content: string, chips?: string[]) => {
        setMessages((m) => [...m, { role: 'assistant', content, suggestionChips: chips }]);
      };

      const applyLeadResult = () => {
        if (result.nextLeadStep !== undefined) {
          setLeadStep(result.nextLeadStep);
        }
        if (result.leadDataPatch) {
          setLeadData((d) => ({ ...d, ...result.leadDataPatch }));
        }
      };

      const sid = sessionIdRef.current;
      const logTurn = (botText: string) => {
        if (!sid) return;
        void apiClient.post('/api/chat/log', {
          session_id: sid,
          user_message: trimmed.slice(0, 8000),
          bot_response: botText.slice(0, 8000),
        }).catch(() => {});
      };

      const persistLeadRow = (merged: { name?: string; phone?: string }, msgs: Message[]) => {
        const query = msgs
          .filter((m) => m.role === 'user')
          .map((m) => m.content)
          .join(' | ')
          .slice(0, 4000);
        void apiClient.post('/api/leads', {
          name: merged.name ?? '',
          phone: merged.phone ?? '',
          query,
          source: 'chatbot_widget',
        }).catch(() => {});
      };

      try {
        if (result.captureLead) {
          appendAssistant(result.reply);
          await new Promise((r) => setTimeout(r, typingDelayMs()));
          appendAssistant(LEAD_ASK_NAME);
          logTurn(`${result.reply}\n---\n${LEAD_ASK_NAME}`);
          setLeadStep('ask_name');
          return;
        }

        appendAssistant(result.reply, result.suggestedChips);

        const mergedLead = { ...leadData, ...result.leadDataPatch };
        applyLeadResult();

        if (result.reply === LEAD_THANK_YOU && mergedLead.phone) {
          persistLeadRow(mergedLead, nextMessages);
        }

        logTurn(result.reply);

        if (result.action?.type === 'redirect' && result.action.url) {
          setPendingRedirectUrl(result.action.url);
        }
      } finally {
        setLoading(false);
      }
    },
    [messages, leadStep, leadData, loading],
  );

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    await processUserMessage(text);
  }, [input, loading, processUserMessage]);

  const onSuggestionChip = useCallback(
    (label: string) => {
      void processUserMessage(label);
    },
    [processUserMessage],
  );

  const confirmRedirect = useCallback(() => {
    if (!pendingRedirectUrl) return;
    router.push(pendingRedirectUrl);
    setPendingRedirectUrl(null);
    onClose();
  }, [pendingRedirectUrl, router, onClose]);

  const cancelRedirect = useCallback(() => {
    setPendingRedirectUrl(null);
    setMessages((m) => [
      ...m,
      {
        role: 'assistant',
        content:
          'Understood. You can stay here and keep asking questions. After 10 of your messages, Continue on WhatsApp will appear below when available.',
      },
    ]);
  }, []);

  const openQuickRoute = useCallback(
    (href: string) => {
      router.push(href);
      onClose();
    },
    [router, onClose],
  );

  return (
    <div
      id="liftngo-chat-panel"
      className="flex h-[min(28rem,70vh)] w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-2xl shadow-gray-900/10 transition-[opacity,transform] duration-200 ease-out sm:h-[min(32rem,72vh)] sm:w-[min(100vw-2rem,26rem)]"
      role="dialog"
      aria-modal="true"
      aria-label="Liftngo Assistant chat"
    >
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-[var(--color-primary)] px-4 py-3.5 text-white shadow-sm">
        <div>
          <p className="text-sm font-semibold tracking-tight">Liftngo Assistant</p>
          <p className="text-xs text-white/80">Booking and logistics help</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl p-2 text-white/90 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          aria-label="Close chat"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div
        className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-gray-50/95 to-gray-50 px-3 py-3"
        role="log"
        aria-live="polite"
      >
        {messages.map((msg, i) => (
          <MessageBubble
            key={`${msg.role}-${i}`}
            role={msg.role}
            content={msg.content}
            suggestionChips={msg.suggestionChips}
            onSuggestionClick={msg.role === 'assistant' ? onSuggestionChip : undefined}
          />
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-gray-200/90 bg-white px-4 py-3 shadow-sm">
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
              <span className="sr-only">Assistant is typing</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="shrink-0 space-y-2 border-t border-gray-100 bg-white p-3 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.06)]">
        {messages.length <= 2 ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => openQuickRoute(ROUTES.PICKUP_LOCATION)}
              className="rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Book delivery
            </button>
            <button
              type="button"
              onClick={() => openQuickRoute(ROUTES.FIND_RESTAURANT)}
              className="rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Order food
            </button>
            <button
              type="button"
              onClick={() => openQuickRoute(ROUTES.KHATU_HOTELS)}
              className="rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Khatu hotels
            </button>
            <button
              type="button"
              onClick={() => openQuickRoute(ROUTES.HISTORY)}
              className="rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Track booking
            </button>
          </div>
        ) : null}

        {showWhatsAppEscalation ? (
          whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('chatbot_continue_whatsapp')}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--whatsapp-green)] text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--whatsapp-green)] focus-visible:ring-offset-2"
            >
              Continue on WhatsApp
            </a>
          ) : (
            <a
              href={ROUTES.CONTACT}
              className="flex min-h-11 w-full items-center justify-center rounded-2xl border border-gray-200 bg-white text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-gray-50"
            >
              Open Contact
            </a>
          )
        ) : null}

        {pendingRedirectUrl ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-3">
            <p className="mb-2 text-center text-xs font-medium text-gray-800">Open the booking page now?</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={cancelRedirect}
                className="min-h-10 flex-1 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
              >
                No, stay in chat
              </button>
              <button
                type="button"
                onClick={confirmRedirect}
                className="min-h-10 flex-1 rounded-xl bg-[var(--color-primary)] text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Yes, open booking
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void sendMessage();
              }
            }}
            placeholder="Type a message"
            disabled={loading}
            className="min-h-11 flex-1 rounded-2xl border border-gray-200 bg-gray-50/90 px-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition-shadow focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 disabled:opacity-60"
            aria-label="Message"
          />
          <button
            type="button"
            onClick={() => void sendMessage()}
            disabled={loading || !input.trim()}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/25 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-45"
            aria-label="Send message"
          >
            {loading ? (
              <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
