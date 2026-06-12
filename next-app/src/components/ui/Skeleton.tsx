// ============================================
// Skeleton Loader Component — Cake Connection
// ============================================

import { cn } from '@/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const variantStyles: Record<string, string> = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-xl',
  };

  return (
    <div
      className={cn('skeleton', variantStyles[variant], className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

/**
 * Product Card Skeleton
 */
export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-surface-secondary">
      <Skeleton className="w-full aspect-square" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Grid of Product Card Skeletons
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
