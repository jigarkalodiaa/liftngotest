'use client';

import Link from 'next/link';
import { ArrowRight, Award, Eye, TrendingUp, Clock, Target, Users, Zap, AlertTriangle } from 'lucide-react';
import { PRIMARY, ACCENT, BENEFITS, LOSS_ITEMS } from './constants';

const ICON_MAP = {
  Eye,
  TrendingUp,
  Clock,
  Target,
  Users,
  Zap,
} as const;

interface WhyBrandingProps {
  whatsappBrandFleetHref: string;
}

export function WhyBranding({ whatsappBrandFleetHref }: WhyBrandingProps) {
  return (
    <>
      {/* WHY BRANDS CHOOSE LIFTNGO */}
      <section id="why-branding" className="scroll-mt-20 bg-white">
        <div className="px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-6xl">
            {/* Section Header */}
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider sm:px-4 sm:py-2 sm:text-[11px]" style={{ borderColor: `${ACCENT}30`, color: ACCENT }}>
                <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Why Fleet Branding
              </span>
              <h2 className="mt-4 text-2xl font-black leading-tight tracking-tight text-gray-900 sm:mt-6 sm:text-3xl md:text-4xl">
                Why Brands Choose
                <span className="block" style={{ color: PRIMARY }}>Liftngo Fleet</span>
              </h2>
              <p className="mt-3 text-sm text-gray-500 sm:mt-4 sm:text-base md:text-lg">
                Every kilometre without your brand is reach you don&apos;t capture.
              </p>
            </div>

            {/* Benefits Grid - With left accent border */}
            <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
              {BENEFITS.map((benefit, index) => {
                const IconComponent = ICON_MAP[benefit.icon as keyof typeof ICON_MAP];
                const isPopular = index === 0;
                return (
                  <div
                    key={benefit.title}
                    className="feature-card group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg"
                    style={{ borderLeftWidth: '4px', borderLeftColor: ACCENT }}
                  >
                    {isPopular && (
                      <div className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ backgroundColor: `${ACCENT}15`, color: ACCENT }}>
                        Most Impact
                      </div>
                    )}
                    <div className="flex-1 p-5 sm:p-6">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl sm:h-12 sm:w-12" style={{ backgroundColor: `${ACCENT}10` }}>
                        <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: ACCENT }} />
                      </div>
                      
                      <h3 className="mt-4 text-base font-bold text-gray-900 sm:text-lg">{benefit.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-500">{benefit.desc}</p>
                    </div>
                    
                    <div className="flex items-baseline gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">
                      <span className="text-2xl font-black sm:text-3xl" style={{ color: ACCENT }}>{benefit.highlight}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 sm:text-[11px]">{benefit.highlightLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU LOSE - Psychology Trigger */}
      <section className="bg-gray-900">
        <div className="px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-red-400 sm:text-[11px]">
              <AlertTriangle className="h-3.5 w-3.5" />
              Don&apos;t Miss Out
            </div>
            <h2 className="text-xl font-black leading-tight text-white sm:text-2xl md:text-3xl">
              What You Lose
              <span className="block" style={{ color: ACCENT }}>Without Fleet Branding</span>
            </h2>
            
            {/* Loss Grid - With left red accent */}
            <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-3">
              {LOSS_ITEMS.map((item) => {
                const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP];
                return (
                  <div 
                    key={item.title} 
                    className="feature-card flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur hover:bg-white/10 sm:p-6"
                    style={{ borderLeftWidth: '4px', borderLeftColor: '#EF4444' }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
                      <IconComponent className="h-5 w-5 text-red-400" />
                    </div>
                    <h3 className="mt-3 text-base font-bold text-white sm:mt-4 sm:text-lg">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-400">{item.desc}</p>
                  </div>
                );
              })}
            </div>
            
            <Link
              href={whatsappBrandFleetHref}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-btn mt-8 inline-flex h-12 items-center gap-2 rounded-xl px-6 text-sm font-bold text-white sm:mt-10 sm:h-14 sm:rounded-full sm:px-8 sm:text-[15px]"
              style={{ backgroundColor: ACCENT }}
            >
              Don&apos;t Miss Out — Start Branding
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
