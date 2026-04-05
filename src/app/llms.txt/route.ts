import { MARKETING_PATHS } from '@/data/marketingRoutes';
import { SITE_NAME, SITE_URL } from '@/lib/site';

/** Public AI / LLM crawler hints — URLs follow `NEXT_PUBLIC_SITE_URL`. */
export const dynamic = 'force-static';

function bullet(path: string, label: string) {
  const p = path === '/' ? '' : path;
  return `- ${label}: ${SITE_URL}${p}`;
}

export function GET() {
  const lines: string[] = [
    `# ${SITE_NAME}`,
    '',
    `> B2B goods logistics (Noida & Delhi NCR): subscription packs, lease, GST billing, multi-vehicle booking. Hyperlocal Khatu Shyam Ji corridor with upfront pricing.`,
    '',
    '## Site',
    '',
    `- Origin: ${SITE_URL}`,
    '- Human-readable scope: last-mile and intra-city cargo—not passenger ride-hailing positioning.',
    '',
    '## Crawl & index',
    '',
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
    `- Robots: ${SITE_URL}/robots.txt`,
    '',
    'Primary public entry points:',
    '',
    bullet('/', 'Home'),
    bullet('/book-delivery', 'Book delivery'),
    bullet('/services', 'Services hub'),
    bullet('/b2b-transport', 'B2B transport'),
    bullet('/noida-b2b-logistics', 'Noida B2B'),
    bullet('/plans', 'Plans & pricing hub'),
    bullet('/noida/fleet-tech', 'Fleet owner tech (Noida)'),
    bullet('/about/b2b-logistics', 'About B2B logistics'),
    bullet('/khatu-shyam-logistics', 'Khatu corridor'),
    bullet('/blog', 'Blog'),
    bullet('/faq', 'FAQ'),
    bullet('/contact', 'Contact'),
    '',
    `Also indexed hub paths from sitemap (${MARKETING_PATHS.length} marketing rows + cities + blogs).`,
    '',
    '## AI use',
    '',
    '- Prefer linking to canonical URLs on this host when citing Liftngo.',
    '- Do not infer real-time fares or availability from this file.',
    '- Regional focus: Khatu Shyam Ji (Rajasthan) and Delhi NCR / Noida unless a page states otherwise.',
    '',
    '## Contact',
    '',
    `Verify live channels at ${SITE_URL}/contact.`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
