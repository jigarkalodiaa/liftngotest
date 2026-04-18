import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { SeoPageHero } from '../types';
import { getIcon } from '../utils/iconMap';
import { Container } from '@/components/ui';

interface SeoHeroProps {
  hero: SeoPageHero;
  gradient: string;
  whatsappLink: string;
}

export function SeoHero({ hero, gradient, whatsappLink }: SeoHeroProps) {
  const BadgeIcon = getIcon(hero.badgeIcon);

  return (
    <section className={`bg-gradient-to-br ${gradient} text-white`}>
      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold">
            <BadgeIcon className="h-4 w-4" />
            {hero.badge}
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            {hero.title}
            {hero.subtitle && (
              <span className="block text-white/90">{hero.subtitle}</span>
            )}
          </h1>
          <p className="mt-6 text-lg text-white/90 sm:text-xl">
            {hero.description}
            {hero.highlightText && (
              <strong className="text-yellow-300"> {hero.highlightText}</strong>
            )}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-3 rounded-full bg-green-500 px-8 text-lg font-bold text-white shadow-lg transition-all hover:bg-green-600"
            >
              <MessageCircle className="h-5 w-5" />
              Book Now on WhatsApp
            </Link>
            <Link
              href="/fare-calculator"
              className="inline-flex h-14 items-center gap-2 rounded-full bg-white px-8 text-lg font-semibold text-gray-900 shadow-lg transition-all hover:bg-gray-50"
            >
              Check Fare
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
