import { MapPin } from 'lucide-react';
import { PlaceholderPage } from '@/components/ui';

export default function LocationsPage() {
  return (
    <PlaceholderPage
      title="Emplacements"
      description="Gestion des emplacements de stockage."
      icon={MapPin}
    />
  );
}
