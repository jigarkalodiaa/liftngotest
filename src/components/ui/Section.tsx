import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { Container } from './Container';

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  bg?: 'white' | 'gray' | 'primary' | 'gradient';
  padding?: 'sm' | 'md' | 'lg';
  id?: string;
}

const bgClasses = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  primary: 'bg-purple-600 text-white',
  gradient: 'bg-gradient-to-br',
};

const paddingClasses = {
  sm: 'py-8 sm:py-12',
  md: 'py-12 sm:py-16',
  lg: 'py-16 sm:py-20 lg:py-24',
};

export function Section({
  children,
  className,
  containerSize = 'xl',
  bg = 'white',
  padding = 'md',
  id,
}: SectionProps) {
  return (
    <section id={id} className={cn(bgClasses[bg], paddingClasses[padding], className)}>
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}
