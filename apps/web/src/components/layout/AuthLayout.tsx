// =====================================================
// MatFlow - Auth Layout
// =====================================================

import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export function AuthLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50">
      <div className="mx-auto w-full max-w-md space-y-6 p-6">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-2xl font-bold text-primary-foreground">
            M
          </div>
          <h1 className="text-2xl font-bold">MatFlow</h1>
          <p className="text-sm text-muted-foreground">
            Gestion de stock circulant pour l'événementiel
          </p>
        </div>

        {/* Auth form */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <Outlet />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} MatFlow. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
