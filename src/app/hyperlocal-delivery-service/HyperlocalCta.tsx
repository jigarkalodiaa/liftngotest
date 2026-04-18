import Link from 'next/link';
import { MessageCircle, Phone } from 'lucide-react';
import { SUPPORT_PHONE } from '@/config/env';

interface HyperlocalCtaProps {
  whatsappLink: string;
  whatsappNumber: string;
}

export default function HyperlocalCta({ whatsappLink, whatsappNumber }: HyperlocalCtaProps) {
  return (
    <section className="bg-purple-600">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Need Something Delivered in 15 Minutes?
        </h2>
        <p className="mt-4 text-lg text-white/90">
          WhatsApp us your pickup and drop location. A driver will be there before you know it.
        </p>
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
          {SUPPORT_PHONE && (
            <a
              href={`tel:+${whatsappNumber}`}
              className="inline-flex h-14 items-center gap-2 rounded-full bg-white px-8 text-lg font-semibold text-purple-700 shadow-lg transition-all hover:bg-purple-50"
            >
              <Phone className="h-5 w-5" />
              Call Now
            </a>
          )}
        </div>
        <p className="mt-6 text-sm text-white/70">
          +91 85805 84898 • Available 24/7 in Khatu
        </p>
      </div>
    </section>
  );
}
