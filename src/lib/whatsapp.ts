/**
 * WhatsApp deep links for CTAs. Prefer `NEXT_PUBLIC_WHATSAPP_NUMBER`, else `NEXT_PUBLIC_SUPPORT_PHONE`.
 * Store digits only or +91… in env; never commit private numbers in repo defaults.
 */

function digitsForWaMe(): string | null {
  const raw =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) ||
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPPORT_PHONE) ||
    '';
  const d = raw.replace(/\D/g, '');
  if (d.length >= 12 && d.startsWith('91')) return d;
  if (d.length === 11 && d.startsWith('91')) return d;
  if (d.length === 10) return `91${d}`;
  if (d.length > 10) return d.slice(-12); // last 12 if messy
  return null;
}

export function getWhatsAppUrl(prefillMessage?: string): string | null {
  const phone = digitsForWaMe();
  if (!phone) return null;
  const base = `https://wa.me/${phone}`;
  if (!prefillMessage?.trim()) return base;
  return `${base}?text=${encodeURIComponent(prefillMessage.trim())}`;
}

/** `tel:` link for expert CTAs when `NEXT_PUBLIC_SUPPORT_PHONE` or `NEXT_PUBLIC_WHATSAPP_NUMBER` is set. */
export function getSupportTelHref(): string | null {
  const raw =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPPORT_PHONE) ||
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) ||
    '';
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const d = trimmed.replace(/\D/g, '');
  if (d.length === 10) return `tel:+91${d}`;
  if (d.length >= 11 && d.startsWith('91')) return `tel:+${d}`;
  if (trimmed.startsWith('+')) return `tel:${trimmed.replace(/\s/g, '')}`;
  if (d.length >= 8) return `tel:+${d}`;
  return null;
}
