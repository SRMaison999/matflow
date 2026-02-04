import { ReactNode, forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';
import { Input, InputProps } from './Input';

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  const id = useId();

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium leading-none">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <div>{children}</div>
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

interface FormInputProps extends InputProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, required, className, ...props }, ref) => {
    const id = useId();

    return (
      <div className={cn('space-y-1.5', className)}>
        <label htmlFor={id} className="text-sm font-medium leading-none">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        <Input ref={ref} id={id} error={error} {...props} />
        {hint && !error && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

interface FormGroupProps {
  children: ReactNode;
  className?: string;
}

export function FormGroup({ children, className }: FormGroupProps) {
  return <div className={cn('space-y-4', className)}>{children}</div>;
}

interface FormRowProps {
  children: ReactNode;
  className?: string;
}

export function FormRow({ children, className }: FormRowProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4', className)}>
      {children}
    </div>
  );
}

interface FormActionsProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export function FormActions({
  children,
  className,
  align = 'right',
}: FormActionsProps) {
  return (
    <div
      className={cn(
        'flex gap-2 pt-4',
        {
          'justify-start': align === 'left',
          'justify-center': align === 'center',
          'justify-end': align === 'right',
        },
        className
      )}
    >
      {children}
    </div>
  );
}
