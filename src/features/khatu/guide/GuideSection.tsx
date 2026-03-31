import Image from '@/components/OptimizedImage';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

type GuideSectionProps = {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  children: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
};

export default function GuideSection({
  id,
  icon: Icon,
  title,
  subtitle,
  children,
  imageSrc,
  imageAlt = '',
}: GuideSectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-2xl border border-stone-200/90 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--khatu-cream)] ring-1 ring-stone-200/80">
          <Icon className="h-5 w-5 text-[var(--khatu-saffron)]" strokeWidth={1.75} aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-[var(--khatu-stone)]">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-xs text-[var(--khatu-stone-muted)]">{subtitle}</p> : null}
        </div>
      </div>
      {imageSrc ? (
        <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-xl bg-stone-100">
          <Image src={imageSrc} alt={imageAlt} fill className="object-cover" sizes="(max-width:640px) 100vw, 640px" />
        </div>
      ) : null}
      <div className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--khatu-stone-muted)] [&_strong]:text-[var(--khatu-stone)] [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1">
        {children}
      </div>
    </section>
  );
}
