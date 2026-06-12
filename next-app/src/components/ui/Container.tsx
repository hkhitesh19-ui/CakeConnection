// ============================================
// Container Component — Cake Connection
// ============================================

import type { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/utils';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  as?: 'div' | 'section' | 'main' | 'article';
}

const sizeStyles: Record<string, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[1400px]',
  full: 'max-w-full',
};

export function Container({
  children,
  size = 'xl',
  className,
  as: Component = 'div',
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        'w-full mx-auto px-4 sm:px-6 lg:px-8',
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
