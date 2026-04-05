import { notFound } from 'next/navigation';
import Image from '@/components/OptimizedImage';
import Link from 'next/link';
import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd from '@/components/JsonLd';
import BlogPostBody from '@/components/blog/BlogPostBody';
import BlogNoidaCaseStudyShell from '@/components/blog/BlogNoidaCaseStudyShell';
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
import { BREADCRUMB_HOME, BREADCRUMB_BLOG } from '@/lib/breadcrumbsNav';
import { getSupportTelHref, getWhatsAppUrl } from '@/lib/whatsapp';

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
  const noidaCaseStudy = post.featuredSurface === 'noida-case-study';
  const whatsappHref = getWhatsAppUrl('Hi Liftngo — I read your Noida B2B logistics article and want to discuss packs / routes.');

  const authorLabel = post.author
    ? `${post.author.name} · ${SITE_NAME}`
    : `${SITE_NAME} Team | Logistics`;

  return (
    <ContentLayout
      breadcrumbs={[
        BREADCRUMB_HOME,
        BREADCRUMB_BLOG,
        { name: post.title, path: `/blog/${post.slug}` },
      ]}
    >
      <JsonLd data={buildBlogPostingJsonLd(post, pageUrl)} />
      <main className={noidaCaseStudy ? 'min-h-0 flex-1 bg-[#fdfbf4]' : 'flex-1'}>
        <article
          className={
            noidaCaseStudy
              ? 'noida-case-study-surface mx-auto max-w-6xl px-4 pb-14 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-10 lg:pb-20'
              : 'mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16'
          }
        >
          {noidaCaseStudy ? (
            <>
              <BlogNoidaCaseStudyShell
                title={post.title}
                description={post.description}
                minutes={minutes}
                authorLabel={authorLabel}
                whatsappHref={whatsappHref}
                authorAvatarSrc={post.featuredImage}
                expertTelHref={getSupportTelHref()}
              />
              <div className="mt-14 border-t border-slate-200/80 pt-14">
                <BlogPostBody blocks={post.body} variant="case-study" />
              </div>
            </>
          ) : (
            <>
              <header className="mb-8">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-[2.5rem]">
                  {post.title}
                </h1>
                <p className="mt-3 text-lg leading-relaxed text-gray-600">{post.description}</p>
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
                          <Link
                            href={post.author.url}
                            className="text-[var(--color-primary)] hover:underline"
                          >
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

              <BlogPostBody blocks={post.body} variant="article" />
            </>
          )}

          <div className="mt-12">
            <BlogPostCta />
          </div>

          <RelatedBlogs
            posts={related}
            {...(noidaCaseStudy
              ? {
                  heading: 'More case studies in Noida',
                  description:
                    'Related guides on Noida lanes, GST, subscription economics, and scaling dispatch without losing control.',
                }
              : {})}
          />
        </article>
      </main>
    </ContentLayout>
  );
}
