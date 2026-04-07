import Link from 'next/link';
import type { BlogBodyBlock, BlogInlineSegment } from '@/types/blog';

function Inline({ segments }: { segments: BlogInlineSegment[] }) {
  return (
    <>
      {segments.map((seg, i) =>
        typeof seg === 'string' ? (
          <span key={i}>{seg}</span>
        ) : (
          <Link
            key={i}
            href={seg.href}
            className="font-medium text-[var(--color-primary)] underline decoration-[var(--color-primary)]/30 underline-offset-2 hover:decoration-[var(--color-primary)]"
          >
            {seg.text}
          </Link>
        ),
      )}
    </>
  );
}

type BlogPostBodyProps = {
  blocks: BlogBodyBlock[];
  /** Match `/noida` dashboard: tighter type, card lists, section headers. */
  variant?: 'article' | 'noida-dashboard' | 'case-study';
};

export default function BlogPostBody({ blocks, variant = 'article' }: BlogPostBodyProps) {
  const isNoida = variant === 'noida-dashboard';
  const isCaseStudy = variant === 'case-study';

  return (
    <div
      className={
        isNoida ? 'max-w-none space-y-1' : isCaseStudy ? 'max-w-none space-y-1 text-slate-800' : 'prose prose-gray max-w-none'
      }
    >
      {blocks.map((block, i) => {
        if (block.type === 'p') {
          return (
            <p
              key={i}
              className={
                isNoida
                  ? 'mb-4 rounded-2xl bg-white/90 p-4 text-sm leading-relaxed text-slate-700 shadow-sm ring-1 ring-stone-200/70 sm:text-[15px]'
                  : isCaseStudy
                    ? 'mb-5 text-sm leading-relaxed text-slate-700 sm:text-[15px]'
                    : 'mb-5 text-base leading-relaxed text-gray-700 sm:text-lg'
              }
            >
              <Inline segments={block.segments} />
            </p>
          );
        }
        if (block.type === 'h2') {
          return (
            <h2
              key={i}
              className={
                isNoida
                  ? 'mb-2 mt-8 scroll-mt-24 px-0.5 text-sm font-semibold tracking-tight text-stone-800 first:mt-2 md:text-base lg:text-lg'
                  : isCaseStudy
                    ? 'mb-3 mt-12 scroll-mt-24 text-xl font-bold tracking-tight text-[#051937] first:mt-8 sm:text-2xl'
                    : 'mb-4 mt-10 scroll-mt-24 text-xl font-bold text-gray-900 sm:text-2xl'
              }
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === 'h3') {
          return (
            <h3
              key={i}
              className={
                isNoida
                  ? 'mb-2 mt-6 scroll-mt-24 px-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:text-sm'
                  : isCaseStudy
                    ? 'mb-2 mt-8 scroll-mt-24 text-lg font-semibold text-[#051937] sm:text-xl'
                    : 'mb-3 mt-8 scroll-mt-24 text-lg font-semibold text-gray-900 sm:text-xl'
              }
            >
              {block.text}
            </h3>
          );
        }
        if (block.type === 'ul') {
          return (
            <ul
              key={i}
              className={
                isNoida
                  ? 'mb-5 space-y-2.5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200/70 sm:p-5'
                  : isCaseStudy
                    ? 'mb-6 list-disc space-y-2 pl-5 text-sm text-slate-700 sm:pl-6 sm:text-[15px]'
                    : 'mb-6 list-disc space-y-2 pl-5 text-base text-gray-700 sm:pl-6 sm:text-lg'
              }
            >
              {block.items.map((item) => (
                <li
                  key={item}
                  className={
                    isNoida
                      ? 'flex gap-2.5 text-sm leading-relaxed text-slate-700 sm:text-[15px]'
                      : 'leading-relaxed'
                  }
                >
                  {isNoida ? (
                    <>
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-primary)]" aria-hidden />
                      <span>{item}</span>
                    </>
                  ) : (
                    item
                  )}
                </li>
              ))}
            </ul>
          );
        }
        return null;
      })}
    </div>
  );
}
