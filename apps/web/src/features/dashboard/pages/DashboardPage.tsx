// =====================================================
// MatFlow - Dashboard Page
// =====================================================

import { Package, Calendar, Wrench, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const stats = [
    {
      label: 'Articles',
      value: '1,234',
      icon: Package,
      description: '98 en location',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Réservations actives',
      value: '23',
      icon: Calendar,
      description: '5 à préparer',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Maintenances',
      value: '8',
      icon: Wrench,
      description: '3 en retard',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Alertes',
      value: '12',
      icon: AlertTriangle,
      description: '4 critiques',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Bonjour, {user?.displayName?.split(' ')[0]} !
        </h1>
        <p className="text-muted-foreground">
          Voici un aperçu de votre activité aujourd'hui
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent activity */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Activité récente</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Action {i}</p>
                  <p className="text-xs text-muted-foreground">Il y a {i}h</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">À venir</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                  {i + 10}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Événement {i}</p>
                  <p className="text-xs text-muted-foreground">Dans {i} jours</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
