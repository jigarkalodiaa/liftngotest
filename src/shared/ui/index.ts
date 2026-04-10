/**
 * Shared UI Components
 * 
 * Usage:
 * import { Button, Skeleton, EmptyState } from '@/shared/ui';
 */

// Loading states
export { LoadingState, Spinner, ButtonSpinner, PageLoading } from './LoadingState';

// Skeleton loaders
export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonButton } from './Skeleton';

// Empty states
export { EmptyState, NoDataState, NoResultsState } from './EmptyState';

// Error states
export { ErrorState, InlineError } from './ErrorState';

// Re-export existing UI components
export { default as Button } from '@/components/ui/Button';
export { default as Card } from '@/components/ui/Card';
export { default as Modal } from '@/components/ui/Modal';
export { default as Badge } from '@/components/ui/Badge';
export { default as IconButton } from '@/components/ui/IconButton';
export { default as BottomSheet } from '@/components/ui/BottomSheet';
export { default as PageContainer } from '@/components/ui/PageContainer';
export { default as PageHeader } from '@/components/ui/PageHeader';
export { default as SectionHeader } from '@/components/ui/SectionHeader';
