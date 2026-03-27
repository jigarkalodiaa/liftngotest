'use client';

import { trackWhatsAppClick } from '@/lib/analytics';
import { getWhatsAppUrl } from '@/lib/whatsapp';

type Props = {
  /** GA4 `source` param */
  trackSource: string;
  prefillMessage?: string;
  className?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
};

/**
 * Opens WhatsApp when number is configured; otherwise renders nothing (avoid dead buttons).
 */
export default function WhatsAppButton({
  trackSource,
  prefillMessage,
  className = '',
  children,
  variant = 'primary',
}: Props) {
  const href = getWhatsAppUrl(prefillMessage);
  if (!href) return null;

  const base =
    variant === 'primary' ?
      'inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-sm hover:opacity-95'
    : 'inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] bg-white px-5 py-3 text-sm font-bold text-[#128C7E] hover:bg-[#25D366]/5';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${className}`}
      onClick={() => trackWhatsAppClick(trackSource)}
    >
      {children}
    </a>
  );
}
