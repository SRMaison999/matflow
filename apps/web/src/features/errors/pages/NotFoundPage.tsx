// =====================================================
// MatFlow - 404 Not Found Page
// =====================================================

import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-muted-foreground/30">404</h1>
        <h2 className="mt-4 text-2xl font-bold">Page non trouvée</h2>
        <p className="mt-2 text-muted-foreground">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button asChild className="mt-6">
          <Link to="/dashboard">
            <Home className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Link>
        </Button>
      </div>
    </div>
  );
}
