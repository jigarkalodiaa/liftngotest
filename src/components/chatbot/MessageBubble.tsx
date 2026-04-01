'use client';

import type { ChatRole } from '@/types/chat';

type Props = {
  role: ChatRole;
  content: string;
  suggestionChips?: string[];
  onSuggestionClick?: (text: string) => void;
};

export default function MessageBubble({ role, content, suggestionChips, onSuggestionClick }: Props) {
  const isUser = role === 'user';
  const chips = !isUser && suggestionChips?.length && onSuggestionClick ? suggestionChips : null;

  return (
    <div className={`flex w-full flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`} role="listitem">
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm sm:max-w-[75%] sm:text-[0.9375rem] ${
          isUser
            ? 'bg-[var(--color-primary)] text-white rounded-br-md'
            : 'bg-white text-gray-900 rounded-bl-md border border-gray-200/90'
        }`}
      >
        <span className="sr-only">{isUser ? 'You: ' : 'Assistant: '}</span>
        <p className="whitespace-pre-wrap break-words leading-snug">{content}</p>
      </div>
      {chips ? (
        <div className="flex max-w-[95%] flex-wrap gap-1.5 pl-0.5" role="group" aria-label="Suggested questions">
          {chips.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => onSuggestionClick?.(label)}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-left text-[11px] font-medium text-gray-700 shadow-sm transition-colors hover:border-[var(--color-primary)]/40 hover:bg-gray-50/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30"
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
