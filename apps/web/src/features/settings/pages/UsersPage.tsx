import { UserCog } from 'lucide-react';
import { PlaceholderPage } from '@/components/ui';

export default function UsersPage() {
  return (
    <PlaceholderPage
      title="Utilisateurs"
      description="Gestion des utilisateurs et permissions."
      icon={UserCog}
    />
  );
}
