import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

export interface InternalLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface InternalLinksSectionProps {
  title?: string;
  links: InternalLink[];
  bgColor?: string;
}

export default function InternalLinksSection({
  title = 'Explore More Services',
  links,
  bgColor = 'bg-gray-50',
}: InternalLinksSectionProps) {
  return (
    <section className={bgColor}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-center text-xl font-bold text-gray-900">{title}</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:shadow-md"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
