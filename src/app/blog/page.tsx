import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';
import ContentLayout from '@/components/layout/ContentLayout';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: `Company Blog | ${SITE_NAME}`,
  description: `Insights on logistics, last-mile delivery, and how ${SITE_NAME} is building the future of goods transport.`,
  path: '/blog',
  keywords: ['LiftnGo blog', 'logistics blog', 'last mile delivery', 'goods transport'],
});

const POSTS = [
  {
    title: 'How LiftnGo Makes Local Logistics Faster and Easier',
    excerpt: 'In today’s fast-moving world, sending goods from one place to another should be simple. Here’s how we’re making it happen.',
    slug: 'local-logistics-faster-easier',
    date: '2024-03-01',
  },
  {
    title: '5 Situations Where LiftnGo Can Save Your Day',
    excerpt: 'From urgent documents to last-minute inventory, see how businesses use LiftnGo for everyday delivery needs.',
    slug: '5-situations-liftngo-saves-day',
    date: '2024-02-15',
  },
  {
    title: 'Why Last-Mile Delivery Matters for Your Business',
    excerpt: 'Efficient last-mile delivery can transform customer experience and cut costs. Learn what to look for in a partner.',
    slug: 'last-mile-delivery-business',
    date: '2024-02-01',
  },
];

export default function BlogPage() {
  return (
    <ContentLayout>
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Company Blog
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
              Insights on logistics, last-mile delivery, and how we’re building the future of goods transport.
            </p>
          </div>

          <ul className="space-y-6">
            {POSTS.map((post) => (
              <li key={post.slug}>
                <article className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:border-gray-200 transition-colors">
                  <time className="text-sm text-gray-500" dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-2 mb-3">
                    <span className="text-gray-900">{post.title}</span>
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">{post.excerpt}</p>
                  <Link
                    href="/#blogs"
                    className="inline-flex items-center gap-1.5 text-[var(--color-primary)] font-medium hover:underline"
                  >
                    Read more
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </ContentLayout>
  );
}
