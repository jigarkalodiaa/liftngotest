import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface HeadingProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  center?: boolean;
}

const sizeClasses = {
  sm: 'text-lg font-bold',
  md: 'text-xl font-bold',
  lg: 'text-2xl font-bold sm:text-3xl',
  xl: 'text-3xl font-black sm:text-4xl',
  '2xl': 'text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl',
};

export function Heading({
  children,
  as: Tag = 'h2',
  size = 'lg',
  className,
  center = false,
}: HeadingProps) {
  return (
    <Tag className={cn(sizeClasses[size], center && 'text-center', 'text-gray-900', className)}>
      {children}
    </Tag>
  );
}
