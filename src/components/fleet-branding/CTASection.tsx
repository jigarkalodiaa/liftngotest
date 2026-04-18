'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calculator } from 'lucide-react';
import { LOGO_PATH } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { PRIMARY, ACCENT } from './constants';

interface CTASectionProps {
  whatsappContactSalesHref: string;
}

export function CTASection({ whatsappContactSalesHref }: CTASectionProps) {
  return (
    <>
      {/* FINAL CTA - Premium Band */}
      <section className="bg-gray-50">
        <div className="px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24">
          <div
            className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl px-6 py-12 sm:rounded-3xl sm:px-10 sm:py-16 md:px-16 md:py-20"
            style={{ backgroundColor: PRIMARY }}
          >
            {/* Decorative Elements */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 sm:h-64 sm:w-64" aria-hidden />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-white/5 sm:h-56 sm:w-56" aria-hidden />

            <div className="relative z-[1] mx-auto max-w-2xl text-center">
              <h2 className="text-xl font-black leading-tight tracking-tight text-white sm:text-2xl md:text-3xl lg:text-4xl">
                Your Brand Deserves
                <span className="block">To Move With The City</span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm text-white/75 sm:mt-6 sm:text-base">
                Join retailers, restaurants, and suppliers building visibility on every delivery.
              </p>
              
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
                <Link
                  href={whatsappContactSalesHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold shadow-lg transition hover:bg-gray-50 sm:h-14 sm:w-auto sm:rounded-full sm:px-8 sm:text-[15px]"
                  style={{ color: PRIMARY }}
                >
                  Start Branding Today
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
                <p className="flex items-center gap-2 text-xs font-medium text-white/80 sm:text-sm">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} aria-hidden />
                  WhatsApp · +91 85805 84898
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-link CTA */}
      <section className="border-t border-gray-100 bg-white">
        <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-sm font-semibold text-gray-700">Need to estimate delivery costs?</p>
            <Link
              href={ROUTES.FARE_CALCULATOR}
              className="mt-3 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110"
              style={{ backgroundColor: ACCENT }}
            >
              <Calculator className="h-4 w-4" />
              Try Fare Calculator
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* PREMIUM FOOTER */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <Image
                src={LOGO_PATH}
                alt="Liftngo"
                width={100}
                height={28}
                className="h-7 w-auto object-contain sm:h-8"
              />
              <div className="border-l border-gray-200 pl-3">
                <p className="text-sm font-bold text-gray-900 sm:text-base">
                  <span style={{ color: PRIMARY }}>Fleet Branding</span>
                </p>
                <p className="text-[10px] text-gray-500 sm:text-xs">City-Scale Advertising</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-400 sm:gap-x-6 sm:text-sm">
              <span>Delhi NCR</span>
              <span className="hidden sm:inline">·</span>
              <span>Khatu</span>
              <span className="hidden sm:inline">·</span>
              <span>Growing Routes</span>
            </div>
            
            <p className="text-[10px] text-gray-400 sm:text-xs">
              © {new Date().getFullYear()} Liftngo
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
