'use client';

import Image from 'next/image';
import { SITE_NAME, LOGO_PATH } from '@/lib/site';

/**
 * Liftngo brand + app roadmap: native apps coming soon; live product is mobile web today.
 */
export default function AppDownloadSection() {
  return (
    <section
      id="download"
      className="w-full py-12 lg:py-16 bg-[var(--landing-bg)]"
      aria-labelledby="download-heading"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 sm:px-6 lg:px-8 xl:px-10">
        <div
          className="flex w-full max-w-lg flex-col items-center gap-6 rounded-2xl border p-6 sm:p-8 sm:gap-8"
          style={{
            borderWidth: '1px',
            borderColor: 'var(--landing-primary)',
            backgroundColor: 'rgba(255, 247, 242, 0.45)',
            backdropFilter: 'blur(35px)',
            WebkitBackdropFilter: 'blur(35px)',
            boxShadow: '0 75px 50px -40px rgba(235, 193, 193, 0.75)',
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <Image
              src={LOGO_PATH}
              alt={`${SITE_NAME} logo`}
              width={220}
              height={62}
              className="h-9 w-auto object-contain object-center sm:h-11"
            />
            <h2 id="download-heading" className="text-center text-xl font-semibold text-gray-900 sm:text-2xl">
              Liftngo on your phone
            </h2>
          </div>

          <p className="max-w-md text-center text-sm leading-relaxed text-gray-700 sm:text-base">
            <strong className="font-semibold text-gray-900">Coming soon:</strong> native Customer and Driver apps (Play Store
            &amp; App Store).{' '}
            <strong className="font-semibold text-gray-900">Right now</strong> we&apos;re live on{' '}
            <strong className="font-semibold text-[var(--color-primary)]">mobile web only</strong>
            —use Liftngo in your browser on any phone. Stay tuned for downloads.
          </p>

          <div
            className="grid w-full max-w-md grid-cols-1 gap-4 min-[380px]:grid-cols-2 sm:gap-6"
            role="list"
          >
            <div
              role="listitem"
              className="flex flex-col items-center gap-3 rounded-xl border border-gray-200/80 bg-white/80 px-3 py-4 shadow-sm"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-[var(--landing-orange)] p-3 shadow-inner sm:h-28 sm:w-28">
                <div className="flex h-full w-full items-center justify-center rounded-lg bg-white p-2">
                  <Image
                    src={LOGO_PATH}
                    alt=""
                    width={72}
                    height={40}
                    className="h-auto w-full max-h-10 object-contain"
                    aria-hidden
                  />
                </div>
              </div>
              <span className="text-center text-sm font-medium text-gray-900 sm:text-base">Customer app</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
                Coming soon
              </span>
            </div>

            <div
              role="listitem"
              className="flex flex-col items-center gap-3 rounded-xl border border-gray-200/80 bg-white/80 px-3 py-4 shadow-sm"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-[var(--color-primary)] p-3 shadow-inner sm:h-28 sm:w-28">
                <div className="flex h-full w-full items-center justify-center rounded-lg bg-white p-2">
                  <Image
                    src={LOGO_PATH}
                    alt=""
                    width={72}
                    height={40}
                    className="h-auto w-full max-h-10 object-contain"
                    aria-hidden
                  />
                </div>
              </div>
              <span className="text-center text-sm font-medium text-gray-900 sm:text-base">Driver app</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
                Coming soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
