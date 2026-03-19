'use client';

import { BlogCard } from '@/components/landing';

const BLOG_POSTS = [
  {
    title: 'How LiftnGo Makes Local Logistics Faster and Easier',
    snippet: "In today's fast-moving world, sending goods from one place...",
    imageSrc: '/dashboard/hero-delivery.png',
    imageAlt: 'Logistics and delivery',
    href: '/blog',
  },
  {
    title: '5 Situations Where Lift Can Save Your Day',
    snippet: 'There are many everyday situations where transporting goods...',
    imageSrc: '/icons/quickrides.png',
    imageAlt: 'Track rides on the app',
    href: '/blog',
  },
  {
    title: 'Why Last-Mile Delivery Matters for Your Business',
    snippet: 'Efficient last-mile delivery can transform customer experience...',
    imageSrc: '/icons/fooddelivery.png',
    imageAlt: 'Last-mile delivery',
    href: '/blog',
  },
];

/** Section: "Blogs" – radial gradient background, horizontal sliding carousel of cards. */
export default function BlogSection() {
  return (
    <section
      id="blogs"
      className="py-12 lg:py-16"
      aria-labelledby="blogs-heading"
      style={{
        background: 'radial-gradient(ellipse at center, #FFF7EE 0%, #FFF6ED 100%)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10">
        <h2 id="blogs-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
          Blogs
        </h2>

        {/* Mobile: horizontal carousel; desktop: centered grid, equal-height cards */}
        <div
          className="scrollbar-hide flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible overflow-y-hidden scroll-smooth pb-2 md:pb-0"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {BLOG_POSTS.map((post) => (
            <BlogCard key={post.title} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
}
