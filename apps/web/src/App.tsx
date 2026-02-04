import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { useAuthStore } from '@/store/authStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

// Lazy load pages
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'));

const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const ArticlesPage = lazy(() => import('@/features/articles/pages/ArticlesPage'));
const ArticleDetailPage = lazy(() => import('@/features/articles/pages/ArticleDetailPage'));
const CategoriesPage = lazy(() => import('@/features/categories/pages/CategoriesPage'));
const StockPage = lazy(() => import('@/features/stock/pages/StockPage'));
const LocationsPage = lazy(() => import('@/features/stock/pages/LocationsPage'));
const ReservationsPage = lazy(() => import('@/features/reservations/pages/ReservationsPage'));
const ReservationDetailPage = lazy(() => import('@/features/reservations/pages/ReservationDetailPage'));
const ProjectsPage = lazy(() => import('@/features/projects/pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('@/features/projects/pages/ProjectDetailPage'));
const KitsPage = lazy(() => import('@/features/kits/pages/KitsPage'));
const CasesPage = lazy(() => import('@/features/cases/pages/CasesPage'));
const PickingPage = lazy(() => import('@/features/operations/pages/PickingPage'));
const ReturnsPage = lazy(() => import('@/features/operations/pages/ReturnsPage'));
const MaintenancePage = lazy(() => import('@/features/maintenance/pages/MaintenancePage'));
const QuotesPage = lazy(() => import('@/features/billing/pages/QuotesPage'));
const InvoicesPage = lazy(() => import('@/features/billing/pages/InvoicesPage'));
const ClientsPage = lazy(() => import('@/features/billing/pages/ClientsPage'));
const NotificationsPage = lazy(() => import('@/features/notifications/pages/NotificationsPage'));
const BranchesPage = lazy(() => import('@/features/branches/pages/BranchesPage'));
const DocumentsPage = lazy(() => import('@/features/documents/pages/DocumentsPage'));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'));
const UsersPage = lazy(() => import('@/features/settings/pages/UsersPage'));
const NotFoundPage = lazy(() => import('@/features/errors/pages/NotFoundPage'));

export function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Articles */}
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />
          <Route path="/categories" element={<CategoriesPage />} />

          {/* Stock */}
          <Route path="/stock" element={<StockPage />} />
          <Route path="/locations" element={<LocationsPage />} />

          {/* Reservations & Projects */}
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/reservations/:id" element={<ReservationDetailPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />

          {/* Kits & Cases */}
          <Route path="/kits" element={<KitsPage />} />
          <Route path="/cases" element={<CasesPage />} />

          {/* Operations */}
          <Route path="/picking" element={<PickingPage />} />
          <Route path="/returns" element={<ReturnsPage />} />

          {/* Maintenance */}
          <Route path="/maintenance" element={<MaintenancePage />} />

          {/* Billing */}
          <Route path="/quotes" element={<QuotesPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/clients" element={<ClientsPage />} />

          {/* Other */}
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/branches" element={<BranchesPage />} />
          <Route path="/documents" element={<DocumentsPage />} />

          {/* Settings */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/users" element={<UsersPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
