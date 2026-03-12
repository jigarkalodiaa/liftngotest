'use client';

import { BlogCard } from '@/components/landing';

const BLOG_POSTS = [
  {
    title: 'How Liftngo Makes Your Logistics Faster and Easier',
    snippet: "In today's fast moving world, LiftnGo provides fast and reliable...",
    imageSrc: '/dashboard/hero-delivery.png',
    imageAlt: 'Logistics and delivery',
    href: '/about',
  },
  {
    title: '4 Reasons Why Liftngo Can Save Your Day',
    snippet: 'There are many interesting...',
    imageSrc: '/dashboard/hero-delivery.png',
    imageAlt: 'Planning and solutions',
    href: '/about',
  },
  {
    title: 'Why Last-Mile Delivery Matters for Your Business',
    snippet: 'Efficient last-mile delivery can transform customer experience...',
    imageSrc: '/dashboard/hero-delivery.png',
    imageAlt: 'Last-mile delivery',
    href: '/about',
  },
];

/** Section: "Blogs" – horizontal scrollable catalog of blog cards. */
export default function BlogSection() {
  return (
    <section id="blogs" className="py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Blogs</h2>

        {/* Horizontal scrollable catalog – full-bleed scroll with padding for first/last card */}
        <div className="relative -mx-5 sm:-mx-6 lg:-mx-8">
          <div className="ml-4">
          <div
            className="blog-catalog-scroll flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth px-5 sm:px-6 lg:px-8 pb-2 "
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
        </div>
      </div>
    </section>
  );
}
