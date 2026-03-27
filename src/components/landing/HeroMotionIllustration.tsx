'use client';

import dynamic from 'next/dynamic';

const LazyGif = dynamic(() => import('./HeroMotionGifInner'), {
  ssr: false,
  loading: () => <div className="h-40 w-full max-w-md mx-auto sm:h-48" aria-hidden />,
});

/** Deferred motion asset — keeps GIF off critical path / LCP. */
export default function HeroMotionIllustration() {
  return <LazyGif />;
}
