// ============================================
// Badge Component — Cake Connection
// ============================================

import type { ReactNode } from 'react';
import { cn } from '@/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'rose' | 'gold';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: 'bg-surface-tertiary text-text-secondary',
  success: 'bg-green-900/50 text-green-400 border-green-800/50',
  warning: 'bg-yellow-900/50 text-yellow-400 border-yellow-800/50',
  danger: 'bg-red-900/50 text-red-400 border-red-800/50',
  rose: 'bg-brand-rose/15 text-brand-rose border-brand-rose/30',
  gold: 'bg-brand-rose-gold/15 text-brand-rose-gold border-brand-rose-gold/30',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold uppercase tracking-wider rounded-full border',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
