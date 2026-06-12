// ============================================
// Button Component — Cake Connection
// ============================================

import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  animated?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-rose text-white hover:bg-brand-rose-dark shadow-lg hover:shadow-brand-rose/30',
  secondary:
    'bg-surface-secondary text-text-primary hover:bg-surface-tertiary border border-border-secondary',
  outline:
    'border-2 border-brand-rose text-brand-rose hover:bg-brand-rose hover:text-white',
  ghost:
    'text-text-secondary hover:text-text-primary hover:bg-surface-glass-light',
  danger:
    'bg-brand-red text-white hover:bg-brand-red-dark',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
  xl: 'px-10 py-4 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      animated = true,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 focus-ring cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

    const buttonContent = (
      <>
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </>
    );

    const combinedClassName = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && 'w-full',
      className
    );

    if (animated && !disabled && !isLoading) {
      return (
        <motion.button
          ref={ref}
          className={combinedClassName}
          disabled={disabled || isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          {...(props as HTMLMotionProps<'button'>)}
        >
          {buttonContent}
        </motion.button>
      );
    }

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || isLoading}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = 'Button';
