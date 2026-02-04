import { KeyRound } from 'lucide-react';
import { PlaceholderPage } from '@/components/ui';

export default function ResetPasswordPage() {
  return (
    <PlaceholderPage
      title="Reinitialiser le mot de passe"
      description="Definissez votre nouveau mot de passe."
      icon={KeyRound}
    />
  );
}
