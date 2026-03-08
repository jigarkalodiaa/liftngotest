'use client';

import Image from 'next/image';

interface ContentWithImageProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
}

/** Reusable block: image + title + description (e.g. "Everything you crave, We will delivered."). */
export default function ContentWithImage({ imageSrc, imageAlt, title, description }: ContentWithImageProps) {
  return (
    <section className="py-8 lg:py-12 bg-[var(--landing-bg)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
          <div className="relative h-56 sm:h-64 lg:h-72 w-full">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
          <div className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
