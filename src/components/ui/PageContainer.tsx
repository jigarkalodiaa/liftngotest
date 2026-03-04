import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/** Max-width container for app screens; consistent padding and centering. */
export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-[520px] px-4 ${className}`}>
      {children}
    </div>
  );
}
