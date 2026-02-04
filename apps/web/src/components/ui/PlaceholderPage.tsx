import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
}

export function PlaceholderPage({
  title,
  description = 'Cette fonctionnalité est en cours de développement.',
  icon: Icon,
  actions,
}: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      {Icon && (
        <div className="p-4 rounded-full bg-muted">
          <Icon className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground max-w-md">{description}</p>
      </div>
      {actions && <div className="flex gap-2 mt-4">{actions}</div>}
    </div>
  );
}
