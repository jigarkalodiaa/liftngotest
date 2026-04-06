import { Metadata } from "next";
import { normalizeCanonicalPath } from "@/lib/canonicalPath";
import {
  SITE_URL,
  SITE_NAME,
  SEO_KEYWORDS,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  absoluteShareImageUrl,
} from "@/lib/site";

/**
 * Final `<title>` length target (~60 chars) — avoids Semrush / SERP “title too long” warnings.
 * With root `title.template` (`%s | ${SITE_NAME}`), only the segment before ` | ` is clamped.
 */
const SERP_TITLE_MAX_CHARS = 58;
const TITLE_TEMPLATE_SUFFIX = ` | ${SITE_NAME}`;

function ellipsizeSeoTitle(raw: string, maxLen: number): string {
  const t = raw.trim();
  if (t.length <= maxLen) return t;
  const budget = Math.max(1, maxLen - 1);
  const slice = t.slice(0, budget);
  const lastSpace = slice.lastIndexOf(" ");
  const base = lastSpace > 16 ? slice.slice(0, lastSpace).trimEnd() : slice.trimEnd();
  return `${base}…`;
}

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

/**
 * Root layout uses `title.template: "%s | Liftngo"`. Titles passed here often already end with
 * `| Liftngo` or `| LiftnGo`, which produced duplicate SERP titles (e.g. "| LiftnGo | Liftngo").
 * Strip trailing brand segment(s), longest suffix first.
 */
function stripTrailingBrandForTitleTemplate(raw: string): string {
  let t = raw.trim();
  const suffixes = [
    ` | ${SITE_NAME} Blog`,
    ` | ${SITE_NAME}`,
    " | Liftngo",
    " | LiftnGo",
    ` — ${SITE_NAME}`,
    " — Liftngo",
    " — LiftnGo",
  ];
  let changed = true;
  while (changed) {
    changed = false;
    for (const s of suffixes) {
      if (t.endsWith(s)) {
        t = t.slice(0, -s.length).trimEnd();
        changed = true;
      }
    }
  }
  return t;
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
  const canonicalPath = normalizeCanonicalPath(path ?? "");
  const url = `${SITE_URL}${canonicalPath}`;
  const imageUrl = absoluteShareImageUrl(image);
  const ogW = image === OG_IMAGE_PATH ? OG_IMAGE_WIDTH : 1200;
  const ogH = image === OG_IMAGE_PATH ? OG_IMAGE_HEIGHT : 630;

  const stripped = stripTrailingBrandForTitleTemplate(title);
  const titleForTemplate = useAbsoluteTitle
    ? ellipsizeSeoTitle(stripped, SERP_TITLE_MAX_CHARS)
    : ellipsizeSeoTitle(stripped, SERP_TITLE_MAX_CHARS - TITLE_TEMPLATE_SUFFIX.length);
  const resolvedTitle = useAbsoluteTitle
    ? titleForTemplate
    : `${titleForTemplate}${TITLE_TEMPLATE_SUFFIX}`;

  return {
    title: useAbsoluteTitle ? { absolute: titleForTemplate } : titleForTemplate,
    description,
    keywords: keywords.length > 0 ? keywords : SEO_KEYWORDS,
    alternates: {
      canonical: url,
      languages: {
        "en-IN": url,
      },
    },
    openGraph: {
      title: resolvedTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_IN",
      images: [
        {
          url: imageUrl,
          width: ogW,
          height: ogH,
          alt: resolvedTitle,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: !nofollow }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true },
        },
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
