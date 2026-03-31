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

export default function BlogListingCard({ post, priorityImage = false, compact = false }: Props) {
  const minutes = estimateReadingMinutes(post);
  const href = `/blog/${post.slug}`;

  if (compact) {
    return (
      <article className="group flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        <Link href={href} className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-32">
          <Image
            src={post.featuredImage}
            alt={post.featuredImageAlt}
            fill
            className="object-cover transition-transform group-hover:scale-[1.03]"
            sizes="128px"
            loading={priorityImage ? 'eager' : 'lazy'}
          />
        </Link>
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
      className={`flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md ${
        post.featured ? 'border-[var(--color-primary)]/40 ring-2 ring-[var(--color-primary)]/15' : 'border-gray-100'
      }`}
    >
      <Link href={href} className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <Image
          src={post.featuredImage}
          alt={post.featuredImageAlt}
          fill
          className="object-cover transition-transform hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading={priorityImage ? 'eager' : 'lazy'}
          priority={priorityImage}
        />
        {post.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-white shadow">
            Featured
          </span>
        )}
      </Link>
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
