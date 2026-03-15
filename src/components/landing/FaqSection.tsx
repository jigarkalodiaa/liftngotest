'use client';

import { useState } from 'react';
import { FAQ_ITEMS, VISIBLE_FAQ_COUNT } from '@/data/faq';

/** Section: FAQ – collapsible questions, "See More" to expand. */
export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const items = showAll ? FAQ_ITEMS : FAQ_ITEMS.slice(0, VISIBLE_FAQ_COUNT);

  return (
    <section
      id="faq"
      className="w-full py-12 lg:py-16 bg-white"
      aria-labelledby="faq-heading"
    >
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col items-center">
        <h2 id="faq-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
          FAQ
        </h2>
        <div className="w-full max-w-2xl space-y-3">
          {items.map(({ id, question, answer }) => (
            <div
              key={id}
              className="rounded-xl border border-gray-200 bg-white overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenId(openId === id ? null : id)}
                className="w-full flex items-center justify-between gap-4 py-4 px-5 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <span>{question}</span>
                <svg
                  className={`w-5 h-5 flex-shrink-0 text-gray-500 transition-transform ${openId === id ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openId === id && (
                <div className="px-5 pb-4 pt-0 text-gray-600 text-sm border-t border-gray-100">
                  {answer}
                </div>
              )}
            </div>
          ))}
        </div>
        {FAQ_ITEMS.length > VISIBLE_FAQ_COUNT ? (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="mt-6 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {showAll ? 'See Less' : 'See More'}
          </button>
        ) : (
          <button
            type="button"
            className="mt-6 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            See More
          </button>
        )}
      </div>
    </section>
  );
}
