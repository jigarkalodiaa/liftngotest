import Link from 'next/link';
import { SeoPageInternalLink } from '../types';
import { getIcon } from '../utils/iconMap';
import { Section, Heading } from '@/components/ui';

interface SeoInternalLinksProps {
  links: SeoPageInternalLink[];
}

export function SeoInternalLinks({ links }: SeoInternalLinksProps) {
  return (
    <Section bg="gray" padding="sm">
      <Heading as="h2" size="md" center>
        Explore More Services
      </Heading>
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {links.map((link) => {
          const LinkIcon = getIcon(link.icon);
          return (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:shadow-md"
            >
              <LinkIcon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
