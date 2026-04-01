import ContentLayout from '@/components/layout/ContentLayout';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME, SEO_KEYWORDS } from '@/lib/site';
import { getPostsForListing } from '@/lib/blog';
import BlogListingCard from '@/components/blog/BlogListingCard';
import { BREADCRUMB_HOME, BREADCRUMB_BLOG } from '@/lib/breadcrumbsNav';

export const metadata = generatePageMetadata({
  title: `Logistics Blog | B2B & Last-Mile Insights — ${SITE_NAME}`,
  description: `Expert articles on logistics in Khatu, B2B logistics India, EV cargo delivery, last-mile optimization, hyperlocal transport, and cost-saving strategies. Book Liftngo when you are ready to move goods.`,
  path: '/blog',
  keywords: [
    'logistics blog India',
    'B2B logistics India',
    'last mile delivery blog',
    'EV cargo delivery',
    'hyperlocal logistics',
    'logistics in Khatu',
    ...SEO_KEYWORDS.slice(0, 6),
  ],
});

export default function BlogPage() {
  const posts = getPostsForListing();
  let priorityUsed = false;

  return (
    <ContentLayout breadcrumbs={[BREADCRUMB_HOME, BREADCRUMB_BLOG]}>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <header className="mb-12 max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Liftngo logistics blog
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Practical guides for B2B shippers: hyperlocal transport,{' '}
              <Link href="/logistics-khatu" className="font-medium text-[var(--color-primary)] hover:underline">
                logistics in Khatu
              </Link>
              , EV cargo, last-mile optimization, and{' '}
              <Link href="/book-delivery" className="font-medium text-[var(--color-primary)] hover:underline">
                booking goods transport
              </Link>{' '}
              with Liftngo.
            </p>
          </header>

          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const usePriority = !priorityUsed && post.featured;
              if (usePriority) priorityUsed = true;
              return (
                <li key={post.slug}>
                  <BlogListingCard post={post} priorityImage={usePriority} />
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </ContentLayout>
  );
}
