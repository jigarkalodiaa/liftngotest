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
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <h2 id="blogs-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-left">
          Blogs
        </h2>

        {/* Horizontal sliding carousel – scroll-snap, partial next card visible */}
        <div
          className="scrollbar-hide flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth pb-2 px-5 sm:px-6 lg:px-8"
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
