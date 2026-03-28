'use client';

import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import { ROUTES } from '@/lib/constants';

type KhatuScreenShellProps = {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  backHref?: string;
};

export default function KhatuScreenShell({ title, eyebrow, children, backHref = ROUTES.DASHBOARD }: KhatuScreenShellProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--khatu-cream)] pb-28">
      <div className="mx-auto max-w-xl px-4 pt-4 sm:max-w-2xl">
        <PageHeader
          title={title}
          onBack={() => router.push(backHref)}
          titleClassName="text-[1.05rem] font-semibold leading-snug text-[var(--khatu-stone)] sm:text-xl"
        />
        {eyebrow ? (
          <p className="-mt-1 mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--khatu-saffron)]">
            {eyebrow}
          </p>
        ) : (
          <div className="h-1" />
        )}
        {children}
      </div>
    </div>
  );
}
