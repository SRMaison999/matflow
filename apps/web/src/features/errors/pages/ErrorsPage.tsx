import { AlertTriangle } from 'lucide-react';
import { PlaceholderPage } from '@/components/ui';

export default function ErrorsPage() {
  return (
    <PlaceholderPage
      title="Erreurs"
      description="Journal des erreurs systeme."
      icon={AlertTriangle}
    />
  );
}
