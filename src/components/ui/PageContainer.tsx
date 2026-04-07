import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  /**
   * Wrap children in `.page-stack` (flex column, gap-4 / gap-6).
   * Set `false` when a sibling is `position: fixed` or layout must stay flat.
   */
  stack?: boolean;
}

/** Max-width container for app screens — mobile-first padding, wide desktop column. */
export default function PageContainer({ children, className = '', stack = true }: PageContainerProps) {
  return (
    <div className={`mx-auto w-full min-w-0 max-w-6xl px-4 md:px-6 lg:px-8 ${className}`}>
      {stack ? <div className="page-stack">{children}</div> : children}
    </div>
  );
}
