import { Metadata } from 'next';

const BASE_URL = 'https://yourdomain.com';
const SITE_NAME = 'Next.js SEO App';

interface PageSEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
}

export function generatePageMetadata({
  title,
  description,
  path = '',
  image = '/og-image.jpg',
  noIndex = false,
  keywords = [],
}: PageSEOProps): Metadata {
  const url = `${BASE_URL}${path}`;
  const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function generateArticleMetadata({
  title,
  description,
  path,
  image,
  publishedTime,
  modifiedTime,
  authors,
  tags,
}: PageSEOProps & {
  publishedTime: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
}): Metadata {
  const baseMetadata = generatePageMetadata({ title, description, path, image });

  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors,
      tags,
    },
  };
}
