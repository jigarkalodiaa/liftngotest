import TrackedLink from '@/components/TrackedLink';

/** Inline CTA — tracked when GA is configured. */
export default function BlogPostCta() {
  return (
    <aside
      className="rounded-2xl border border-[var(--color-primary)]/20 bg-gradient-to-br from-[var(--color-primary)]/5 to-white px-6 py-8 text-center sm:px-10"
      aria-labelledby="blog-cta-heading"
    >
      <h2 id="blog-cta-heading" className="text-xl font-bold text-gray-900 sm:text-2xl">
        Ready to move goods with Liftngo?
      </h2>
      <p className="mt-2 text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
        Book hyperlocal B2B transport with upfront estimates—walk through four-wheel cargo, including EV-friendly lanes where
        they fit.
      </p>
      <TrackedLink
        href="/book-delivery"
        trackAs="book_now_click"
        trackSource="blog_post_cta"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:opacity-90"
      >
        Book Liftngo
      </TrackedLink>
    </aside>
  );
}
