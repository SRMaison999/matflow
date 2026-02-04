import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Calendar,
  Wrench,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  RotateCcw,
  ClipboardList,
  Users,
  BarChart3,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button, Card, Badge } from '@/components/ui';

const MOCK_STATS = [
  {
    label: 'Articles totaux',
    value: '2,847',
    change: '+12%',
    trend: 'up',
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    label: 'Reservations actives',
    value: '47',
    change: '+8%',
    trend: 'up',
    icon: Calendar,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    label: 'En maintenance',
    value: '23',
    change: '-5%',
    trend: 'down',
    icon: Wrench,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    label: 'Alertes',
    value: '8',
    change: '+2',
    trend: 'up',
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
];

const MOCK_PICKINGS = [
  { id: 'PCK-2024-0156', project: 'Festival Montreux', items: 45, status: 'ready', date: '14:00' },
  { id: 'PCK-2024-0157', project: 'Conference EPFL', items: 23, status: 'preparing', date: '15:30' },
  { id: 'PCK-2024-0158', project: 'Mariage Dupont', items: 67, status: 'pending', date: '16:00' },
  { id: 'PCK-2024-0159', project: 'Salon Auto', items: 134, status: 'pending', date: 'Demain' },
];

const MOCK_RETURNS = [
  { id: 'RET-2024-0089', project: 'Gala UBS', items: 56, returned: 54, status: 'in_progress' },
  { id: 'RET-2024-0090', project: 'Concert Paleo', items: 89, returned: 89, status: 'completed' },
  { id: 'RET-2024-0091', project: 'Forum RH', items: 34, returned: 0, status: 'pending' },
];

const MOCK_ALERTS = [
  { type: 'critical', message: 'Stock bas: Cable XLR 10m (5 restants)', time: 'Il y a 10 min' },
  { type: 'warning', message: 'Maintenance requise: Lyre Spot #LSP-045', time: 'Il y a 1h' },
  { type: 'warning', message: 'Retour en retard: RES-2024-0234', time: 'Il y a 2h' },
  { type: 'info', message: 'Nouveau projet cree: Seminaire Nestle', time: 'Il y a 3h' },
];

const MOCK_ACTIVITY = [
  { user: 'Marie D.', action: 'a termine le picking', target: 'PCK-2024-0155', time: 'Il y a 5 min' },
  { user: 'Jean M.', action: 'a cree une reservation', target: 'RES-2024-0289', time: 'Il y a 15 min' },
  { user: 'Pierre B.', action: 'a signale un incident', target: 'ART-0892', time: 'Il y a 30 min' },
  { user: 'Sophie L.', action: 'a valide un devis', target: 'DEV-2024-0167', time: 'Il y a 1h' },
  { user: 'Marc R.', action: 'a complete un retour', target: 'RET-2024-0088', time: 'Il y a 2h' },
];

const MOCK_CALENDAR = [
  { date: '15', month: 'Jan', title: 'Festival Montreux', type: 'departure' },
  { date: '16', month: 'Jan', title: 'Conference EPFL', type: 'departure' },
  { date: '17', month: 'Jan', title: 'Retour Gala UBS', type: 'return' },
  { date: '18', month: 'Jan', title: 'Mariage Dupont', type: 'departure' },
  { date: '20', month: 'Jan', title: 'Salon Auto', type: 'departure' },
];

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'default' | 'info'> = {
      ready: 'success',
      completed: 'success',
      preparing: 'warning',
      in_progress: 'warning',
      pending: 'default',
    };
    const labels: Record<string, string> = {
      ready: 'Pret',
      completed: 'Termine',
      preparing: 'En preparation',
      in_progress: 'En cours',
      pending: 'En attente',
    };
    return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>;
  };

  const getAlertIcon = (type: string) => {
    if (type === 'critical') return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (type === 'warning') return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Bonjour, {user?.firstName || 'Utilisateur'}
          </h1>
          <p className="text-muted-foreground">
            Voici un apercu de votre activite - {new Date().toLocaleDateString('fr-CH', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex gap-2">
          {(['day', 'week', 'month'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period === 'day' ? 'Jour' : period === 'week' ? 'Semaine' : 'Mois'}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {MOCK_STATS.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Link to="/operations/picking">
          <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <ClipboardList className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Nouveau Picking</p>
                <p className="text-xs text-muted-foreground">Preparer une commande</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/operations/returns">
          <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <RotateCcw className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Nouveau Retour</p>
                <p className="text-xs text-muted-foreground">Enregistrer un retour</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/reservations/new">
          <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Nouvelle Reservation</p>
                <p className="text-xs text-muted-foreground">Creer une reservation</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/articles">
          <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-100 p-2">
                <Package className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium">Rechercher Article</p>
                <p className="text-xs text-muted-foreground">Trouver un equipement</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pickings a preparer */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold">Pickings a preparer</h2>
            </div>
            <Link to="/operations/picking">
              <Button variant="ghost" size="sm">
                Voir tout <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="divide-y">
            {MOCK_PICKINGS.map((picking) => (
              <div key={picking.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{picking.project}</p>
                    <p className="text-sm text-muted-foreground">{picking.id} - {picking.items} articles</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">{picking.date}</p>
                  </div>
                  {getStatusBadge(picking.status)}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Calendrier */}
        <Card>
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold">Agenda</h2>
            </div>
            <Link to="/reservations">
              <Button variant="ghost" size="sm">
                Voir tout <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="divide-y">
            {MOCK_CALENDAR.map((event, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-muted/50">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">{event.date}</span>
                  <span className="text-xs text-muted-foreground">{event.month}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.type === 'departure' ? 'Depart' : 'Retour'}
                  </p>
                </div>
                <div className={`h-2 w-2 rounded-full ${event.type === 'departure' ? 'bg-blue-500' : 'bg-green-500'}`} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Retours en cours */}
        <Card>
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold">Retours en cours</h2>
            </div>
            <Link to="/operations/returns">
              <Button variant="ghost" size="sm">
                Voir tout <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="divide-y">
            {MOCK_RETURNS.map((ret) => (
              <div key={ret.id} className="p-4 hover:bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{ret.project}</p>
                  {getStatusBadge(ret.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{ret.id}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${(ret.returned / ret.items) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{ret.returned}/{ret.items}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Alertes */}
        <Card>
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold">Alertes</h2>
              <Badge variant="destructive">{MOCK_ALERTS.length}</Badge>
            </div>
            <Link to="/notifications">
              <Button variant="ghost" size="sm">
                Voir tout <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="divide-y">
            {MOCK_ALERTS.map((alert, i) => (
              <div key={i} className="flex items-start gap-3 p-4 hover:bg-muted/50">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Activite recente */}
        <Card>
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold">Activite recente</h2>
            </div>
          </div>
          <div className="divide-y">
            {MOCK_ACTIVITY.map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-4 hover:bg-muted/50">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{' '}
                    {activity.action}{' '}
                    <span className="font-medium text-primary">{activity.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
