'use client';

/**
 * Below-the-fold motion (optional). Does not use `fetchPriority=high` — avoids competing with LCP.
 */
export default function HeroMotionGifInner() {
  return (
    <div className="mt-6 flex justify-center overflow-x-clip px-1" aria-hidden>
      <div className="relative mx-auto aspect-square w-full max-w-md min-w-0 sm:max-w-lg">
        <img
          src="/images/liftngohero.gif"
          alt=""
          width={512}
          height={512}
          className="h-full w-full max-w-full object-contain object-center opacity-95"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}
