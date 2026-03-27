'use client';

import { useState } from 'react';
import type { FaqItem } from '@/data/faq';

interface FaqAccordionListProps {
  items: readonly FaqItem[];
  className?: string;
}

/** Shared FAQ accordion (homepage section + /faq page). */
export default function FaqAccordionList({ items, className = '' }: FaqAccordionListProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className={`w-full space-y-3 ${className}`}>
      {items.map(({ id, question, answer }) => (
        <div key={id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <button
            type="button"
            onClick={() => setOpenId(openId === id ? null : id)}
            className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left font-medium text-gray-900 transition-colors hover:bg-gray-50 sm:px-5"
          >
            <span className="min-w-0 flex-1 break-words pr-2">{question}</span>
            <svg
              className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${openId === id ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openId === id && (
            <div className="border-t border-gray-100 px-4 pb-4 pt-0 text-sm leading-relaxed break-words text-gray-600 sm:px-5">
              {answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
