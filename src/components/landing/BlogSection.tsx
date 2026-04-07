import BlogCard from './BlogCard';
import { getPostsForHomeSection } from '@/lib/blog';
import Link from 'next/link';

/** Section: "Blogs" — radial gradient background, horizontal sliding carousel of cards. */
export default function BlogSection() {
  const posts = getPostsForHomeSection(3);

  return (
    <section
      id="blogs"
      className="page-section"
      aria-labelledby="blogs-heading"
      style={{
        background: 'radial-gradient(ellipse at center, #FFF7EE 0%, #FFF6ED 100%)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <h2 id="blogs-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 text-center sm:text-left">
            Blogs
          </h2>
          <Link
            href="/blog"
            className="text-center sm:text-right text-sm font-semibold text-[var(--color-primary)] hover:underline"
          >
            View all articles
          </Link>
        </div>

        <div
          className="scrollbar-hide flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible overflow-y-hidden scroll-smooth pb-2 md:pb-0"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {posts.map((post, i) => (
            <BlogCard
              key={post.slug}
              title={post.title}
              snippet={post.excerpt}
              imageSrc={post.featuredImage}
              imageAlt={post.featuredImageAlt}
              href={`/blog/${post.slug}`}
              priority={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
