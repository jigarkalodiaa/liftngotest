import Link from 'next/link';
import { MessageCircle, Phone } from 'lucide-react';
import { SeoPageCta } from '../types';
import { Container } from '@/components/ui';

interface SeoCtaProps {
  cta: SeoPageCta;
  whatsappLink: string;
  phoneNumber: string;
}

export function SeoCta({ cta, whatsappLink, phoneNumber }: SeoCtaProps) {
  return (
    <section className={cta.bgColor}>
      <Container size="md" className="py-16 text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{cta.title}</h2>
        <p className="mt-4 text-lg text-white/90">{cta.description}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center gap-3 rounded-full bg-green-500 px-8 text-lg font-bold text-white shadow-lg transition-all hover:bg-green-600"
          >
            <MessageCircle className="h-5 w-5" />
            Book on WhatsApp
          </Link>
          {phoneNumber && (
            <a
              href={`tel:+${phoneNumber}`}
              className="inline-flex h-14 items-center gap-2 rounded-full bg-white px-8 text-lg font-semibold text-gray-900 shadow-lg transition-all hover:bg-gray-50"
            >
              <Phone className="h-5 w-5" />
              Call Now
            </a>
          )}
        </div>
        {cta.footerText && (
          <p className="mt-6 text-sm text-white/70">{cta.footerText}</p>
        )}
      </Container>
    </section>
  );
}
