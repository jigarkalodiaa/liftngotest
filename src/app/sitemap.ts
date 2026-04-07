import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { MARKETING_PATHS } from '@/data/marketingRoutes';
import { SEO_CITIES } from '@/data/seoCities';
import { getAllPosts } from '@/lib/blog';
import { RESTAURANTS_KHATUSHYAM } from '@/data/restaurantsKhatushyam';
import { KHATU_SHOPS } from '@/data/khatuShops';
import { KHATU_HOTELS } from '@/data/khatuHotels';

const SITE = SITE_URL.replace(/\/$/, '');

/** One shared last-mod for bulk static URLs — avoids “every URL updated every second” noise; refreshed on ISR. */
const STATIC_SITEMAP_LASTMOD = new Date();

/**
 * Regenerate periodically so `lastModified` for static rows advances after deploys without per-request churn.
 * Blog rows still use real `publishedAt` / `modifiedAt`.
 */
export const revalidate = 86400;

function entry(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'],
  lastModified: Date = STATIC_SITEMAP_LASTMOD,
): MetadataRoute.Sitemap[0] {
  return {
    url: `${SITE}${path === '/' ? '' : path}`,
    lastModified,
    changeFrequency,
    priority,
  };
}

/**
 * Built from `MARKETING_PATHS` (edit there when adding routes), city SEO slugs, Khatu/restaurant listings,
 * and blog posts — deduped by path, sorted by URL for stable output.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  const out: MetadataRoute.Sitemap = [];

  for (const row of MARKETING_PATHS) {
    const normalized = row.path === '' ? '/' : row.path;
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(entry(normalized === '/' ? '/' : normalized, row.priority, row.changeFrequency));
  }

  for (const city of SEO_CITIES) {
    const path = `/${city.slug}`;
    if (seen.has(path)) continue;
    seen.add(path);
    out.push(entry(path, 0.93, 'weekly'));
  }

  for (const r of RESTAURANTS_KHATUSHYAM) {
    const path = `/find-restaurant/${r.id}`;
    if (seen.has(path)) continue;
    seen.add(path);
    out.push(entry(path, 0.7, 'weekly'));
  }

  for (const shop of KHATU_SHOPS) {
    const path = `/khatu/marketplace/${shop.id}`;
    if (seen.has(path)) continue;
    seen.add(path);
    out.push(entry(path, 0.78, 'weekly'));
  }

  for (const hotel of KHATU_HOTELS) {
    if (!hotel.liftngoVerified) continue;
    const path = `/khatu/hotels/${hotel.id}`;
    if (seen.has(path)) continue;
    seen.add(path);
    out.push(entry(path, 0.76, 'weekly'));
  }

  for (const post of getAllPosts()) {
    const path = `/blog/${post.slug}`;
    if (seen.has(path)) continue;
    seen.add(path);
    out.push({
      url: `${SITE}${path}`,
      lastModified: new Date(post.modifiedAt ?? post.publishedAt),
      changeFrequency: 'monthly',
      priority: post.featured ? 0.72 : 0.66,
    });
  }

  out.sort((a, b) => a.url.localeCompare(b.url));
  return out;
}
