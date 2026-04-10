'use client';

import { memo } from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  animate?: boolean;
}

const roundedClasses = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

function SkeletonComponent({
  className = '',
  width,
  height,
  rounded = 'md',
  animate = true,
}: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`bg-gray-200 ${roundedClasses[rounded]} ${animate ? 'animate-pulse' : ''} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export const Skeleton = memo(SkeletonComponent);

// Preset skeletons for common use cases
export const SkeletonText = memo(function SkeletonText({
  lines = 1,
  className = '',
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={16}
          width={i === lines - 1 && lines > 1 ? '75%' : '100%'}
          rounded="sm"
        />
      ))}
    </div>
  );
});

export const SkeletonAvatar = memo(function SkeletonAvatar({
  size = 40,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return <Skeleton width={size} height={size} rounded="full" className={className} />;
});

export const SkeletonCard = memo(function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-gray-100 bg-white p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <SkeletonAvatar size={48} />
        <div className="flex-1 space-y-2">
          <Skeleton height={20} width="60%" />
          <Skeleton height={16} width="40%" />
        </div>
      </div>
      <div className="mt-4">
        <SkeletonText lines={2} />
      </div>
    </div>
  );
});

export const SkeletonButton = memo(function SkeletonButton({
  width = '100%',
  height = 48,
  className = '',
}: {
  width?: string | number;
  height?: number;
  className?: string;
}) {
  return <Skeleton width={width} height={height} rounded="lg" className={className} />;
});
