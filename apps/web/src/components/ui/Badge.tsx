import { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        success: 'border-transparent bg-green-500 text-white',
        warning: 'border-transparent bg-yellow-500 text-white',
        info: 'border-transparent bg-blue-500 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
    );
  }
);

Badge.displayName = 'Badge';

type StatusVariant = 'success' | 'warning' | 'destructive' | 'info' | 'default';

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

const statusVariantMap: Record<string, StatusVariant> = {
  available: 'success',
  active: 'success',
  completed: 'success',
  confirmed: 'success',
  ready: 'success',
  reserved: 'info',
  pending: 'warning',
  preparing: 'warning',
  in_progress: 'warning',
  draft: 'default',
  in_maintenance: 'warning',
  in_use: 'info',
  in_transit: 'info',
  returning: 'info',
  cancelled: 'destructive',
  out_of_service: 'destructive',
  lost: 'destructive',
  overdue: 'destructive',
};

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const resolvedVariant = variant ?? statusVariantMap[status.toLowerCase()] ?? 'default';
  const displayText = status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Badge variant={resolvedVariant} className={className}>
      {displayText}
    </Badge>
  );
}
