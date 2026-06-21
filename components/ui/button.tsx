import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive';
type Size = 'default' | 'sm' | 'icon';

const variants: Record<Variant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  outline: 'border border-input bg-background text-foreground hover:bg-accent',
  ghost: 'text-foreground hover:bg-accent',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
};

const sizes: Record<Size, string> = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 rounded-md px-3 text-sm',
  icon: 'size-9',
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild, children, ...props }, ref) => {
    const classes = cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0',
      variants[variant],
      sizes[size],
      className,
    );
    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
      });
    }
    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
