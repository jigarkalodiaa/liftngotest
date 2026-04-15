'use client';

import { useCallback, useState } from 'react';
import { usePathname } from 'next/navigation';
import { trackChatToggle } from '@/lib/analytics';
import ChatWindow from './ChatWindow';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = useCallback(() => {
    trackChatToggle('close');
    setOpen(false);
  }, []);
  if (pathname === '/noida/coconut') return null;

  return (
    <div className="fixed right-4 z-[100] flex flex-col items-end gap-3 bottom-[calc(env(safe-area-inset-bottom)+5rem)] sm:right-6 sm:bottom-[calc(env(safe-area-inset-bottom)+5.5rem)]">
      {open ? <ChatWindow onClose={close} /> : null}
      <button
        type="button"
        onClick={() =>
          setOpen((v) => {
            const next = !v;
            trackChatToggle(next ? 'open' : 'close');
            return next;
          })
        }
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg ring-2 ring-white/80 transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 sm:h-16 sm:w-16"
        aria-expanded={open}
        aria-controls="liftngo-chat-panel"
        aria-label={open ? 'Close chat' : 'Open chat with Liftngo'}
      >
        {open ? (
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
