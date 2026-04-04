/** Lightweight trust signals — no fabricated names; roles describe customer types. */
const ITEMS = [
  {
    quote: 'Finally one booking flow for cartons—no more ten phone calls to find a tempo in Khatu.',
    role: 'Retail shop owner · Rajasthan',
  },
  {
    quote: 'Upfront fare before the vehicle moves makes it easier to justify delivery to our finance team.',
    role: 'Wholesale distributor · NCR',
  },
  {
    quote: 'Same-day runs for kitchen supplies during peak season—drivers understand cargo, not ratings.',
    role: 'Restaurant operations · Hyperlocal',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="page-section bg-[var(--landing-bg)]" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="testimonials-heading" className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
          Why businesses trust Liftngo
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-gray-600">
          Representative feedback patterns from B2B and high-frequency shippers (anonymised roles).
        </p>
        <ul className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-3 sm:gap-6">
          {ITEMS.map((item) => (
            <li
              key={item.quote}
              className="rounded-2xl border border-gray-100 bg-white page-card shadow-sm"
            >
              <blockquote className="text-sm leading-relaxed text-gray-700 sm:text-base">&ldquo;{item.quote}&rdquo;</blockquote>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">{item.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
