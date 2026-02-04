import { FolderKanban } from 'lucide-react';
import { PlaceholderPage } from '@/components/ui';

export default function ProjectsPage() {
  return (
    <PlaceholderPage
      title="Projets"
      description="Gestion des projets evenementiels."
      icon={FolderKanban}
    />
  );
}
