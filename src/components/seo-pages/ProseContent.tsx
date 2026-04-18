import { ReactNode } from 'react';

export interface ProseContentProps {
  children: ReactNode;
  bgColor?: string;
}

export default function ProseContent({ children, bgColor = 'bg-white' }: ProseContentProps) {
  return (
    <section className={bgColor}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-lg mx-auto max-w-4xl">{children}</div>
      </div>
    </section>
  );
}
