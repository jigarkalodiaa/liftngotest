import type { SVGProps } from 'react';

type SvgProps = SVGProps<SVGSVGElement>;

/** Lock SVG box so flex/layout never inflates icons (mobile WebKit). */
function foodListingIconSm(extra?: string): string {
  return [
    'inline-block shrink-0 align-middle h-4 w-4 min-h-4 min-w-4 max-h-4 max-w-4',
    extra ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}

function foodListingIconStep(extra?: string): string {
  return [
    'inline-block shrink-0 align-middle h-5 w-5 min-h-5 min-w-5 max-h-6 max-w-6 sm:h-6 sm:w-6 sm:min-h-6 sm:min-w-6',
    extra ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}

export function IconStar({ className = '', ...props }: SvgProps) {
  return (
    <svg className={foodListingIconSm(className)} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function IconCheck({ className = '', ...props }: SvgProps) {
  return (
    <svg
      className={foodListingIconSm(className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function IconLocation({ className = '', ...props }: SvgProps) {
  return (
    <svg
      className={foodListingIconSm(className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function IconShield({ className = '', ...props }: SvgProps) {
  return (
    <svg
      className={foodListingIconSm(className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function IconClock({ className = '', ...props }: SvgProps) {
  return (
    <svg
      className={foodListingIconSm(className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

export function IconStore({ className = '', ...props }: SvgProps) {
  return (
    <svg
      className={foodListingIconStep(className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 21h18M5 21V8l7-4v17M19 21V8l-5 3M9 8v13" />
      <path d="M9 8h8" />
    </svg>
  );
}

export function IconCartPlus({ className = '', ...props }: SvgProps) {
  return (
    <svg
      className={foodListingIconStep(className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6M12 5v6M9 8h6" />
    </svg>
  );
}

export function IconScooter({ className = '', ...props }: SvgProps) {
  return (
    <svg
      className={foodListingIconStep(className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="5.5" cy="17.5" r="2.5" />
      <circle cx="18.5" cy="17.5" r="2.5" />
      <path d="M15 6a1 1 0 1 0 0-2h-5l-3 6H3v4h3.56a3 3 0 0 0 5.88 0H15" />
      <path d="M12 17h-2" />
    </svg>
  );
}
