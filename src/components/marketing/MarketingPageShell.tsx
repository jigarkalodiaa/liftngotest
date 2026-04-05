import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';

export type MarketingShellCrumb = { label: string; href?: string };

type NavLink = { href: string; label: string };

type Props = {
  badge: string;
  title: ReactNode;
  /** Primary hero paragraph (one short block for SERP alignment). */
  lead: string;
  chips?: readonly string[];
  /** e.g. Book · FAQ · Contact */
  links?: readonly NavLink[];
  /** Home is usually first with href `/` */
  crumbs?: readonly MarketingShellCrumb[];
  /** Optional right column on large screens (e.g. hero image). */
  heroAside?: ReactNode;
  /** Primary CTAs below chips/links (e.g. Book + Contact row). */
  heroActions?: ReactNode;
  children: ReactNode;
};

/**
 * Premium marketing hero + lifted content area (matches /contact and /plans).
 */
export default function MarketingPageShell({
  badge,
  title,
  lead,
  chips = [],
  links = [],
  crumbs = [],
  heroAside,
  heroActions,
  children,
}: Props) {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e1f4b] via-[#2C2D5B] to-[#151632] pb-16 pt-6 text-white sm:pb-20 sm:pt-8">
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[var(--color-primary)]/20 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {crumbs.length > 0 ? (
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-white/55 sm:text-xs">
                {crumbs.map((c, i) => (
                  <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
                    {i > 0 ? (
                      <span className="text-white/35" aria-hidden>
                        /
                      </span>
                    ) : null}
                    {c.href ? (
                      <Link href={c.href} className="transition-colors hover:text-white">
                        {c.label}
                      </Link>
                    ) : (
                      <span className="text-white/90">{c.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          <div
            className={`flex flex-col gap-10 ${heroAside ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:items-center lg:gap-12' : ''}`}
          >
            <div className="min-w-0">
              <p className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/85 ring-1 ring-white/15 backdrop-blur-sm sm:text-[11px]">
                {badge}
              </p>
              <h1 className="mt-4 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.65rem] lg:leading-[1.1]">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">{lead}</p>
              {chips.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {chips.map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-white/88 backdrop-blur-sm sm:text-[11px]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400/90" strokeWidth={2} aria-hidden />
                      {label}
                    </span>
                  ))}
                </div>
              ) : null}
              {links.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="inline-flex min-h-10 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15 sm:text-sm"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              ) : null}
              {heroActions ? <div className="mt-8 min-w-0">{heroActions}</div> : null}
            </div>
            {heroAside ? <div className="relative mx-auto w-full max-w-md shrink-0 lg:mx-0 lg:max-w-none">{heroAside}</div> : null}
          </div>
        </div>
      </section>

      <div className="bg-[#f6f5f2]">
        <div className="relative z-10 mx-auto -mt-8 max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">{children}</div>
      </div>
    </>
  );
}
