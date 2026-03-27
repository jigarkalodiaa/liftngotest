import type { BlogPost } from '@/types/blog';
import { SITE_NAME, SITE_URL, LOGO_URL } from '@/lib/site';

export function buildBlogPostingJsonLd(post: BlogPost, pageUrl: string) {
  const imageUrl = post.featuredImage.startsWith('http')
    ? post.featuredImage
    : `${SITE_URL}${post.featuredImage}`;

  const author =
    post.author ?
      {
        '@type': 'Person',
        name: post.author.name,
        ...(post.author.url ? { url: post.author.url } : {}),
      }
    : {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      };

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${pageUrl}#article`,
    headline: post.title,
    description: post.description,
    image: [{ '@type': 'ImageObject', url: imageUrl }],
    datePublished: post.publishedAt,
    dateModified: post.modifiedAt ?? post.publishedAt,
    author,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    url: pageUrl,
    articleSection: 'Logistics',
    keywords: post.keywords.join(', '),
    inLanguage: 'en-IN',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
