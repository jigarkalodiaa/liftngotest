import { forwardRef, type HTMLAttributes } from 'react';

const variants = {
  default: 'border border-stone-200/90 bg-white shadow-sm shadow-stone-900/[0.04]',
  elevated: 'border border-stone-200/60 bg-white shadow-md shadow-stone-900/[0.06]',
  ghost: 'border border-transparent bg-stone-50/80',
  khatu: 'border border-amber-200/50 bg-[var(--khatu-ivory)] shadow-md shadow-amber-900/[0.06]',
} as const;

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants;
}

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className = '', variant = 'default', ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`rounded-2xl ${variants[variant]} ${className}`.trim()}
      {...props}
    />
  );
});

export default Card;
