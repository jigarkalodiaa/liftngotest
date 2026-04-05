'use client';

import { ChevronDown, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

export type CaseStudyFaqItem = { question: string; answer: string };

type Props = {
  items: readonly CaseStudyFaqItem[];
  /** Kicker above heading */
  className?: string;
  toggleStyle?: 'chevron' | 'plus';
};

export default function BlogCaseStudyFaq({ items, className = '', toggleStyle = 'chevron' }: Props) {
  const [open, setOpen] = useState<number>(0);

  return (
    <section className={`${className}`} aria-labelledby="case-study-faq-heading">
      <h2 id="case-study-faq-heading" className="text-center text-xl font-bold tracking-tight text-[#051937] sm:text-2xl md:text-3xl">
        Frequently Asked Questions
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-slate-600 sm:text-base">
        Straight answers for Noida B2B teams — same policies as the live product.
      </p>
      <div className="mx-auto mt-8 max-w-3xl space-y-3">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={item.question}
              className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-900/[0.03]"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-start justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-slate-50/80 sm:px-5 sm:py-4"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold text-[#051937] sm:text-base">{item.question}</span>
                {toggleStyle === 'plus' ? (
                  isOpen ? (
                    <Minus className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" aria-hidden />
                  ) : (
                    <Plus className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" aria-hidden />
                  )
                ) : (
                  <ChevronDown
                    className={`mt-0.5 h-5 w-5 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                )}
              </button>
              {isOpen ? (
                <div className="border-t border-slate-100 px-4 pb-4 pt-0 sm:px-5">
                  <p className="pt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{item.answer}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
