'use client';

import Link from 'next/link';

/** Section: "Download our apk" – white card, thin purple border, Customer App (orange) + Driver App (blue). */
export default function AppDownloadSection() {
  return (
    <section id="download" className="w-full py-12 lg:py-16 bg-[var(--landing-bg)]">
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col items-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
          Download our apk
        </h2>
        <div className="w-full max-w-md rounded-2xl border-2 border-indigo-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/about"
              className="flex items-center justify-center rounded-xl py-4 px-6 font-semibold text-white bg-[var(--landing-orange)] hover:opacity-90 transition-opacity"
            >
              Customer App
            </Link>
            <Link
              href="/about"
              className="flex items-center justify-center rounded-xl py-4 px-6 font-semibold text-white bg-[var(--color-primary)] hover:opacity-90 transition-opacity"
            >
              Driver App
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
