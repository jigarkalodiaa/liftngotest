/**
 * Blog content model — API/CMS-ready: serialize `BlogPost` as JSON from a headless CMS later.
 */

export type BlogInlineSegment = string | { text: string; href: string };

export type BlogBodyBlock =
  | { type: 'p'; segments: BlogInlineSegment[] }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] };

export interface BlogAuthor {
  name: string;
  url?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  /** Meta description + OG description */
  description: string;
  excerpt: string;
  keywords: string[];
  publishedAt: string;
  modifiedAt?: string;
  author?: BlogAuthor;
  /** Unsplash or local path under /public (OG/meta + default hero image) */
  featuredImage: string;
  featuredImageAlt: string;
  /** Special in-article chrome (no default hero image): dashboard replica or SaaS case study layout */
  featuredSurface?: 'noida-dashboard' | 'noida-case-study';
  /** Shown larger on /blog listing */
  featured?: boolean;
  /** Preferred related posts; remainder filled by topic heuristics */
  relatedSlugs?: string[];
  body: BlogBodyBlock[];
  /** Optional override; otherwise derived from word count */
  readingTimeMinutes?: number;
}
