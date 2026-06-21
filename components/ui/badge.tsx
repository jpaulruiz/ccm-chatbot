import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'secondary' | 'outline';

const variants: Record<Variant, string> = {
  default: 'border-transparent bg-primary text-primary-foreground',
  secondary: 'border-transparent bg-secondary text-secondary-foreground',
  outline: 'text-foreground',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium capitalize',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
