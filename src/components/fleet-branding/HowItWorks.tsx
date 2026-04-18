'use client';

import { Zap, CheckCircle } from 'lucide-react';
import { PRIMARY, ACCENT, PROCESS_STEPS } from './constants';

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-gray-50">
      <div className="px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider sm:px-4 sm:py-2 sm:text-[11px]" style={{ borderColor: `${ACCENT}30`, color: ACCENT }}>
              <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Simple Process
            </span>
            <h2 className="mt-4 text-2xl font-black leading-tight tracking-tight text-gray-900 sm:mt-6 sm:text-3xl md:text-4xl">
              From Brief to Road
              <span className="block" style={{ color: PRIMARY }}>In Just Days</span>
            </h2>
          </div>

          {/* Steps Grid - Symmetric */}
          <div className="relative mt-10 sm:mt-12 lg:mt-16">
            {/* Connection Line - Desktop only */}
            <div className="pointer-events-none absolute left-[10%] right-[10%] top-10 hidden h-px lg:block" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}30, ${ACCENT}30, transparent)` }} />
            
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {PROCESS_STEPS.map((step, index) => (
                <div 
                  key={step.n} 
                  className="feature-card relative flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm hover:shadow-lg sm:p-6"
                  style={{ borderTopWidth: '3px', borderTopColor: ACCENT }}
                >
                  {index === PROCESS_STEPS.length - 1 && (
                    <div className="absolute -top-2.5 right-3 flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold text-white" style={{ backgroundColor: '#10B981' }}>
                      <CheckCircle className="h-3 w-3" />
                      Final
                    </div>
                  )}
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-base font-black text-white shadow-md sm:h-14 sm:w-14 sm:text-lg"
                    style={{ backgroundColor: ACCENT }}
                  >
                    {step.n}
                  </div>
                  <h3 className="mt-4 text-base font-bold text-gray-900 sm:text-lg">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
