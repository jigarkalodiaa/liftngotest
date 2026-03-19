'use client';

import Image from 'next/image';
import Link from 'next/link';

export interface BlogCardProps {
  title: string;
  snippet: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
}

/** Single blog card: image top, dark blue overlay with title, snippet, Read More + arrow. Equal height on desktop; Read More aligned at bottom. */
export default function BlogCard({ title, snippet, imageSrc, imageAlt, href }: BlogCardProps) {
  return (
    <article
      className="w-[212px] md:w-full h-[268px] md:h-full md:min-h-[300px] flex-shrink-0 md:flex-shrink rounded-[12px] overflow-hidden bg-white relative border border-gray-200/80"
      style={{
        boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
        scrollSnapAlign: 'start',
      }}
    >
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 212px, 33vw"
        />
        <div
          className="absolute inset-x-0 bottom-0 left-0 right-0 pt-12 px-3 pb-3 flex flex-col min-h-[55%]"
          style={{
            background: 'linear-gradient(to top, #1A1D3A 0%, #1A1D3A 70%, transparent 100%)',
          }}
        >
          <h3 className="font-bold text-white text-sm leading-tight line-clamp-2 mb-1 flex-shrink-0">
            {title}
          </h3>
          <p className="text-white/90 text-xs leading-snug line-clamp-2 mb-3 flex-1 min-h-[2.5rem]">
            {snippet}
          </p>
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-white font-medium text-xs hover:opacity-90 transition-opacity mt-auto flex-shrink-0"
          >
            Read More
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
