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

/** Single blog card: image, title, snippet, Read More. */
export default function BlogCard({ title, snippet, imageSrc, imageAlt, href }: BlogCardProps) {
  return (
    <article
      className="flex-shrink-0 w-[280px] sm:w-[320px] rounded-xl overflow-hidden shadow-md bg-[var(--landing-bg)] border border-gray-200"
      style={{ scrollSnapAlign: 'start' }}
    >
      <div className="relative h-40 w-full bg-gray-200">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="320px"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
          aria-hidden
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{snippet}</p>
        <Link
          href={href}
          className="text-gray-900 font-medium text-sm hover:underline"
        >
          Read More
        </Link>
      </div>
    </article>
  );
}
