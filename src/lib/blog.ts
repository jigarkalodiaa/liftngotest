import type { BlogPost } from '@/types/blog';
import { BLOG_POSTS } from '@/data/blog-posts';

function wordCountFromPost(post: BlogPost): number {
  let n = 0;
  for (const block of post.body) {
    if (block.type === 'p') {
      for (const seg of block.segments) {
        n += (typeof seg === 'string' ? seg : seg.text).split(/\s+/).filter(Boolean).length;
      }
    } else if (block.type === 'h2' || block.type === 'h3') {
      n += block.text.split(/\s+/).filter(Boolean).length;
    } else if (block.type === 'ul') {
      n += block.items.join(' ').split(/\s+/).filter(Boolean).length;
    }
  }
  return n;
}

export function estimateReadingMinutes(post: BlogPost): number {
  if (post.readingTimeMinutes != null) return post.readingTimeMinutes;
  return Math.max(1, Math.round(wordCountFromPost(post) / 200));
}

export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getPostsForListing(): BlogPost[] {
  const posts = getAllPosts();
  return [...posts].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}

/** First N posts for homepage carousel (featured first). */
export function getPostsForHomeSection(limit = 3): BlogPost[] {
  return getPostsForListing().slice(0, limit);
}

/**
 * Related posts: explicit `relatedSlugs`, then posts sharing keywords, then recent.
 */
export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(slug);
  if (!current) return [];

  const others = BLOG_POSTS.filter((p) => p.slug !== slug);
  const picked = new Set<string>();

  const addBySlug = (s: string) => {
    const p = others.find((x) => x.slug === s);
    if (p && picked.size < limit) {
      picked.add(p.slug);
    }
  };

  current.relatedSlugs?.forEach(addBySlug);

  if (picked.size < limit) {
    const key = new Set(current.keywords.map((k) => k.toLowerCase()));
    const scored = others
      .filter((p) => !picked.has(p.slug))
      .map((p) => ({
        p,
        score: p.keywords.filter((k) => key.has(k.toLowerCase())).length,
      }))
      .sort((a, b) => b.score - a.score);

    for (const { p } of scored) {
      if (picked.size >= limit) break;
      picked.add(p.slug);
    }
  }

  if (picked.size < limit) {
    for (const p of getAllPosts()) {
      if (p.slug === slug || picked.has(p.slug)) continue;
      picked.add(p.slug);
      if (picked.size >= limit) break;
    }
  }

  return [...picked]
    .map((s) => getPostBySlug(s))
    .filter((p): p is BlogPost => Boolean(p));
}
