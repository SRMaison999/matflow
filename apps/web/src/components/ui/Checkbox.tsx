import { forwardRef, InputHTMLAttributes, useId } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, ...props }, ref) => {
    const id = useId();

    return (
      <div className="flex items-start space-x-3">
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            className={cn(
              'peer h-4 w-4 shrink-0 rounded border border-input',
              'ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'checked:bg-primary checked:border-primary',
              error && 'border-destructive',
              className
            )}
            {...props}
          />
          <Check
            className={cn(
              'absolute h-3 w-3 left-0.5 top-0.5 text-primary-foreground pointer-events-none',
              'opacity-0 peer-checked:opacity-100'
            )}
          />
        </div>
        {(label || description) && (
          <div className="grid gap-1 leading-none">
            {label && (
              <label htmlFor={id} className="text-sm font-medium cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, ...props }, ref) => {
    const id = useId();

    return (
      <div className="flex items-center justify-between">
        {(label || description) && (
          <div className="space-y-0.5">
            {label && (
              <label htmlFor={id} className="text-sm font-medium cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        <label className="relative inline-flex cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              'w-11 h-6 bg-input rounded-full peer',
              'peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2',
              'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
              'after:content-[""] after:absolute after:top-0.5 after:left-0.5',
              'after:bg-background after:rounded-full after:h-5 after:w-5',
              'after:transition-transform peer-checked:after:translate-x-5',
              className
            )}
          />
        </label>
      </div>
    );
  }
);

Switch.displayName = 'Switch';
