import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd from '@/components/JsonLd';
import BlogPostBody from '@/components/blog/BlogPostBody';
import BlogPostCta from '@/components/blog/BlogPostCta';
import RelatedBlogs from '@/components/blog/RelatedBlogs';
import {
  getAllBlogSlugs,
  getPostBySlug,
  getRelatedPosts,
  estimateReadingMinutes,
} from '@/lib/blog';
import { generateArticleMetadata } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { buildBlogPostingJsonLd } from '@/lib/structuredData/blogPosting';
import { buildBreadcrumbJsonLd } from '@/lib/structuredData/homepageGraph';

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const path = `/blog/${post.slug}`;

  return generateArticleMetadata({
    title: `${post.title} | ${SITE_NAME} Blog`,
    description: post.description,
    path,
    image: post.featuredImage,
    publishedTime: post.publishedAt,
    modifiedTime: post.modifiedAt,
    authors: post.author ? [post.author.name] : [SITE_NAME],
    tags: post.keywords,
    keywords: post.keywords,
  });
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const pageUrl = `${SITE_URL}/blog/${post.slug}`;
  const minutes = estimateReadingMinutes(post);
  const related = getRelatedPosts(slug, 3);

  return (
    <ContentLayout>
      <JsonLd data={buildBlogPostingJsonLd(post, pageUrl)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-[var(--color-primary)]">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/blog" className="hover:text-[var(--color-primary)]">
                  Blog
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="line-clamp-1 font-medium text-gray-900 max-w-[12rem] sm:max-w-xs">{post.title}</li>
            </ol>
          </nav>

          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-[2.5rem] leading-tight">
              {post.title}
            </h1>
            <p className="mt-3 text-lg text-gray-600 leading-relaxed">{post.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
              <time dateTime={post.publishedAt}>
                Published{' '}
                {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span aria-hidden>·</span>
              <span>{minutes} min read</span>
              {post.author && (
                <>
                  <span aria-hidden>·</span>
                  <span>
                    By{' '}
                    {post.author.url ? (
                      <Link href={post.author.url} className="text-[var(--color-primary)] hover:underline">
                        {post.author.name}
                      </Link>
                    ) : (
                      post.author.name
                    )}
                  </span>
                </>
              )}
            </div>
          </header>

          <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
            <Image
              src={post.featuredImage}
              alt={post.featuredImageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
              priority
            />
          </div>

          <BlogPostBody blocks={post.body} />

          <div className="mt-12">
            <BlogPostCta />
          </div>

          <RelatedBlogs posts={related} />
        </article>
      </main>
    </ContentLayout>
  );
}
