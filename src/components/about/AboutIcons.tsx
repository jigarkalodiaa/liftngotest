/** Inline SVG icons for About page — logistics / B2B vocabulary */

export function IconSenders({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M3 21h18" strokeLinecap="round" />
      <path d="M5 21V8l4-4h6l4 4v13" strokeLinejoin="round" />
      <path d="M9 21v-6h6v6" strokeLinejoin="round" />
      <path d="M9 12h6" strokeLinecap="round" />
    </svg>
  );
}

export function IconReceive({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 3v9l3-3m-3 3-3-3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 21h14a2 2 0 0 0 2-2v-6H3v6a2 2 0 0 0 2 2Z" strokeLinejoin="round" />
    </svg>
  );
}

export function IconService({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconRoute({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <path d="M8 16.5c3-2 5-6 8.5-8" strokeLinecap="round" />
    </svg>
  );
}

export function IconShield({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 3 5 6v6c0 5 3.5 8 7 9 3.5-1 7-4 7-9V6l-7-3Z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconInvoice({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M7 3h10l3 3v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
      <path d="M7 8h10M7 12h6M7 16h8" strokeLinecap="round" />
    </svg>
  );
}

export function IconLayers({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="m12 3 9 4.5L12 12 3 7.5 12 3Z" strokeLinejoin="round" />
      <path d="m3 12 9 4.5L21 12" strokeLinejoin="round" />
      <path d="m3 16.5 9 4.5 9-4.5" strokeLinejoin="round" />
    </svg>
  );
}

export function IconHeadset({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M5 16v-2a7 7 0 0 1 14 0v2" />
      <rect x="3" y="14" width="4" height="6" rx="1" />
      <rect x="17" y="14" width="4" height="6" rx="1" />
    </svg>
  );
}
