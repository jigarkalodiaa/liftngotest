'use client';

import Link from 'next/link';
import { LucideIcon, MessageCircle, ArrowRight } from 'lucide-react';

export interface SeoPageHeroProps {
  badge: string;
  badgeIcon: LucideIcon;
  title: string;
  subtitle?: string;
  description: string;
  highlightText?: string;
  primaryCta: {
    href: string;
    label: string;
    icon?: LucideIcon;
    external?: boolean;
  };
  secondaryCta?: {
    href: string;
    label: string;
  };
  gradient?: string;
}

export default function SeoPageHero({
  badge,
  badgeIcon: BadgeIcon,
  title,
  subtitle,
  description,
  highlightText,
  primaryCta,
  secondaryCta,
  gradient = 'from-purple-600 to-indigo-700',
}: SeoPageHeroProps) {
  const PrimaryIcon = primaryCta.icon || MessageCircle;

  return (
    <section className={`bg-gradient-to-br ${gradient} text-white`}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold">
            <BadgeIcon className="h-4 w-4" />
            {badge}
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            {title}
            {subtitle && <span className="block text-white/90">{subtitle}</span>}
          </h1>
          <p className="mt-6 text-lg text-white/90 sm:text-xl">
            {description}
            {highlightText && (
              <strong className="text-yellow-300"> {highlightText}</strong>
            )}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={primaryCta.href}
              target={primaryCta.external ? '_blank' : undefined}
              rel={primaryCta.external ? 'noopener noreferrer' : undefined}
              className="inline-flex h-14 items-center gap-3 rounded-full bg-green-500 px-8 text-lg font-bold text-white shadow-lg transition-all hover:bg-green-600"
            >
              <PrimaryIcon className="h-5 w-5" />
              {primaryCta.label}
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="inline-flex h-14 items-center gap-2 rounded-full bg-white px-8 text-lg font-semibold text-purple-700 shadow-lg transition-all hover:bg-purple-50"
              >
                {secondaryCta.label}
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
