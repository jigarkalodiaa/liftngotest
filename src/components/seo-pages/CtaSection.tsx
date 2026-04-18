import Link from 'next/link';
import { MessageCircle, Phone } from 'lucide-react';

export interface CtaSectionProps {
  title: string;
  description: string;
  whatsappLink: string;
  whatsappLabel?: string;
  phoneNumber?: string;
  phoneLabel?: string;
  footerText?: string;
  bgColor?: string;
  textColor?: string;
}

export default function CtaSection({
  title,
  description,
  whatsappLink,
  whatsappLabel = 'Book on WhatsApp',
  phoneNumber,
  phoneLabel = 'Call Now',
  footerText,
  bgColor = 'bg-purple-600',
  textColor = 'text-purple-700',
}: CtaSectionProps) {
  return (
    <section className={bgColor}>
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
        <p className="mt-4 text-lg text-white/90">{description}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center gap-3 rounded-full bg-green-500 px-8 text-lg font-bold text-white shadow-lg transition-all hover:bg-green-600"
          >
            <MessageCircle className="h-5 w-5" />
            {whatsappLabel}
          </Link>
          {phoneNumber && (
            <a
              href={`tel:+${phoneNumber}`}
              className={`inline-flex h-14 items-center gap-2 rounded-full bg-white px-8 text-lg font-semibold ${textColor} shadow-lg transition-all hover:bg-opacity-90`}
            >
              <Phone className="h-5 w-5" />
              {phoneLabel}
            </a>
          )}
        </div>
        {footerText && <p className="mt-6 text-sm text-white/70">{footerText}</p>}
      </div>
    </section>
  );
}
