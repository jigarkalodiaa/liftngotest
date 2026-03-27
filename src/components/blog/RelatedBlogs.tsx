import BlogListingCard from '@/components/blog/BlogListingCard';
import type { BlogPost } from '@/types/blog';

export default function RelatedBlogs({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-gray-200 pt-12" aria-labelledby="related-blogs-heading">
      <h2 id="related-blogs-heading" className="text-2xl font-bold text-gray-900 sm:text-3xl mb-2">
        Related articles
      </h2>
      <p className="text-gray-600 mb-8 max-w-2xl text-sm sm:text-base">
        More on B2B logistics, last-mile delivery, and hyperlocal transport—plus links to our services and booking flow.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogListingCard key={post.slug} post={post} compact />
        ))}
      </div>
    </section>
  );
}
