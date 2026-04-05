import Image from '@/components/OptimizedImage';
import Link from 'next/link';
import type { BlogPost } from '@/types/blog';
import { estimateReadingMinutes } from '@/lib/blog';

type Props = {
  post: BlogPost;
  /** First card on listing can opt into LCP priority */
  priorityImage?: boolean;
  compact?: boolean;
};

function ListingThumb({
  post,
  href,
  priorityImage,
  className,
}: {
  post: BlogPost;
  href: string;
  priorityImage: boolean;
  /** Full-card top vs compact left column */
  className: string;
}) {
  if (post.featuredSurface === 'noida-dashboard' || post.featuredSurface === 'noida-case-study') {
    return (
      <Link
        href={href}
        aria-label={post.title}
        className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-700/35 bg-slate-900 text-2xl shadow-inner transition group-hover:opacity-95 sm:text-3xl ${className}`}
        style={{
          background:
            'radial-gradient(ellipse at top left, rgba(99,102,241,0.2), transparent 55%), radial-gradient(ellipse at bottom right, rgba(139,92,246,0.1), transparent 50%), #0f172a',
        }}
      >
        <span aria-hidden>🚚</span>
      </Link>
    );
  }
  return (
    <Link href={href} className={`relative block shrink-0 overflow-hidden rounded-xl ${className}`}>
      <Image
        src={post.featuredImage}
        alt={post.featuredImageAlt}
        fill
        className="object-cover transition-transform group-hover:scale-[1.03]"
        sizes={className.includes('w-28') ? '128px' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        loading={priorityImage ? 'eager' : 'lazy'}
        priority={priorityImage}
      />
    </Link>
  );
}

export default function BlogListingCard({ post, priorityImage = false, compact = false }: Props) {
  const minutes = estimateReadingMinutes(post);
  const href = `/blog/${post.slug}`;

  if (compact) {
    return (
      <article className="group flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        <ListingThumb post={post} href={href} priorityImage={priorityImage} className="h-24 w-28 sm:h-28 sm:w-32" />
        <div className="min-w-0 flex flex-1 flex-col justify-center">
          <time dateTime={post.publishedAt} className="text-xs text-gray-500">
            {new Date(post.publishedAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
            {' · '}
            {minutes} min read
          </time>
          <h3 className="mt-1 font-semibold text-gray-900 line-clamp-2 group-hover:text-[var(--color-primary)]">
            <Link href={href}>{post.title}</Link>
          </h3>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md ${
        post.featured ? 'border-[var(--color-primary)]/40 ring-2 ring-[var(--color-primary)]/15' : 'border-gray-100'
      }`}
    >
      <div className="relative w-full">
        <ListingThumb post={post} href={href} priorityImage={priorityImage} className="aspect-[16/10] w-full bg-gray-100" />
        {post.featured ? (
          <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-white shadow">
            Featured
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <time dateTime={post.publishedAt} className="text-sm text-gray-500">
          {new Date(post.publishedAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          {' · '}
          {minutes} min read
        </time>
        <h2 className="mt-2 text-lg font-bold text-gray-900 sm:text-xl leading-snug">
          <Link href={href} className="hover:text-[var(--color-primary)] transition-colors">
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 flex-1 text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3">{post.excerpt}</p>
        <Link
          href={href}
          className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Read more
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
