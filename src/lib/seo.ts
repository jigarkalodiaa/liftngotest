import { Metadata } from "next";
import {
  SITE_URL,
  SITE_NAME,
  SEO_KEYWORDS,
  OG_IMAGE_PATH,
  absoluteShareImageUrl,
} from "@/lib/site";

interface PageSEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  /** When `noIndex` is true: if also true, sets `robots.follow` to false (e.g. login). */
  nofollow?: boolean;
  /**
   * Use `{ absolute: title }` so the root layout `title.template` does not append the site name twice
   * (e.g. when `title` already includes the brand).
   */
  useAbsoluteTitle?: boolean;
  keywords?: string[];
}

export function generatePageMetadata({
  title,
  description,
  path = "",
  image = OG_IMAGE_PATH,
  noIndex = false,
  nofollow = false,
  useAbsoluteTitle = false,
  keywords = [],
}: PageSEOProps): Metadata {
  const url = `${SITE_URL}${path}`;
  const imageUrl = absoluteShareImageUrl(image);

  return {
    title: useAbsoluteTitle ? { absolute: title } : title,
    description,
    keywords: keywords.length > 0 ? keywords : SEO_KEYWORDS,
    alternates: {
      canonical: url,
      languages: {
        "en-IN": url,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_IN",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: !nofollow }
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
  keywords = [],
  noIndex = false,
  nofollow = false,
  useAbsoluteTitle = false,
}: PageSEOProps & {
  publishedTime: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
}): Metadata {
  const baseMetadata = generatePageMetadata({
    title,
    description,
    path,
    image,
    noIndex,
    nofollow,
    useAbsoluteTitle,
    keywords,
  });

  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      type: "article",
      publishedTime,
      modifiedTime,
      authors,
      tags,
    },
  };
}
