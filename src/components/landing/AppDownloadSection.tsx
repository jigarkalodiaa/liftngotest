'use client';

import Link from 'next/link';
import Image from 'next/image';

/** Section: "Download our apk" – card with title, two app options (icon + label): Customer App (orange), Driver App (dark blue). */
export default function AppDownloadSection() {
  return (
    <section
      id="download"
      className="w-full py-12 lg:py-16 bg-[var(--landing-bg)]"
      aria-labelledby="download-heading"
    >
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col items-center">
        <div
          className="w-full max-w-[334px] rounded-xl border p-6 sm:p-8 flex flex-col items-center gap-8 min-h-[279px]"
          style={{
            borderWidth: '1px',
            borderColor: 'var(--landing-primary)',
            backgroundColor: 'rgba(255, 247, 242, 0.45)',
            backdropFilter: 'blur(35px)',
            WebkitBackdropFilter: 'blur(35px)',
            boxShadow: '0 75px 50px -40px rgba(235, 193, 193, 0.75)',
          }}
        >
          <h2 id="download-heading" className="text-xl sm:text-2xl font-semibold text-gray-900 text-center">
            Download our apk
          </h2>

          <div className="grid grid-cols-2 gap-8 sm:gap-12 w-full max-w-sm">
            <Link
              href="/#download"
              className="flex flex-col items-center gap-3 hover:opacity-90 transition-opacity group"
              aria-label="Download Customer App"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-[var(--landing-orange)] flex items-center justify-center p-3 shadow-sm group-hover:shadow-md transition-shadow">
                <Image
                  src="/logo.png"
                  alt="LiftnGo Customer App"
                  width={80}
                  height={48}
                  className="w-full h-auto object-contain max-h-12 sm:max-h-14 brightness-0 invert"
                />
              </div>
              <span className="text-gray-900 font-medium text-sm sm:text-base text-center">
                Customer App
              </span>
            </Link>

            <Link
              href="/#download"
              className="flex flex-col items-center gap-3 hover:opacity-90 transition-opacity group"
              aria-label="Download Driver App"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-[var(--color-primary)] flex items-center justify-center p-3 shadow-sm group-hover:shadow-md transition-shadow">
                <Image
                  src="/logo.png"
                  alt="LiftnGo Driver App"
                  width={80}
                  height={48}
                  className="w-full h-auto object-contain max-h-12 sm:max-h-14 brightness-0 invert"
                />
              </div>
              <span className="text-gray-900 font-medium text-sm sm:text-base text-center">
                Driver App
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
