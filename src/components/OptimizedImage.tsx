import NextImage, { type ImageProps } from 'next/image';

function shouldBypassNextOptimizer(src: ImageProps['src']): boolean {
  if (typeof src !== 'string') return false;
  return (
    src.startsWith('https://images.unsplash.com') ||
    src.startsWith('https://media.unsplash.com') ||
    src.startsWith('https://plus.unsplash.com') ||
    src.startsWith('https://picsum.photos')
  );
}

/**
 * Drop-in `next/image` replacement: for Unsplash / Picsum URLs, sets `unoptimized` so the
 * browser loads imgix directly. Avoids `/_next/image?url=…` 404s on hosts where the optimizer
 * cannot reach outbound CDNs or crawlers cache stale optimizer responses.
 */
export default function OptimizedImage(props: ImageProps) {
  const bypass = shouldBypassNextOptimizer(props.src);
  return <NextImage {...props} unoptimized={bypass || props.unoptimized} />;
}
