const LINKS = [
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'The problem' },
  { id: 'solution', label: 'The solution' },
  { id: 'tech', label: 'The tech' },
  { id: 'pricing', label: 'Pricing' },
] as const;

export default function BlogCaseStudyAnchorNav() {
  return (
    <nav
      className="sticky top-0 z-20 rounded-b-3xl border-t border-slate-200/90 bg-white/95 px-3 py-3 shadow-[0_4px_20px_-8px_rgba(5,25,55,0.12)] backdrop-blur-md sm:px-5"
      aria-label="On this page"
    >
      <ul className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-1 gap-y-2 sm:justify-between sm:gap-x-2">
        {LINKS.map(({ id, label }, i) => (
          <li key={id} className="flex items-center">
            {i > 0 ? <span className="mr-1 hidden text-slate-300 sm:inline" aria-hidden>|</span> : null}
            <a
              href={`#${id}`}
              className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#051937] transition hover:bg-slate-100 sm:px-3 sm:text-xs"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
