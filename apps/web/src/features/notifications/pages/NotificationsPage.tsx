import { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Package,
  Calendar,
  Wrench,
  DollarSign,
  Clock,
  Trash2,
  Check,
  Filter,
  Settings,
} from 'lucide-react';
import {
  Button,
  Card,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Select,
  Checkbox,
} from '@/components/ui';

const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'critical', category: 'stock', title: 'Stock critique', message: 'Cable XLR 10m - Seulement 5 unites disponibles (minimum: 20)', time: 'Il y a 10 min', read: false, link: '/articles/6' },
  { id: '2', type: 'warning', category: 'maintenance', title: 'Maintenance requise', message: 'Lyre Spot #LSP-045 necessite une maintenance preventive', time: 'Il y a 1h', read: false, link: '/maintenance' },
  { id: '3', type: 'warning', category: 'reservation', title: 'Retour en retard', message: 'RES-2024-0234 - Retour prevu hier, materiel non rentre', time: 'Il y a 2h', read: false, link: '/reservations/234' },
  { id: '4', type: 'info', category: 'project', title: 'Nouveau projet', message: 'Seminaire Nestle a ete cree par Marie Dupont', time: 'Il y a 3h', read: true, link: '/projects/8' },
  { id: '5', type: 'success', category: 'billing', title: 'Paiement recu', message: 'Facture FAC-2024-0089 payee - 15\'000 CHF', time: 'Il y a 5h', read: true, link: '/invoices/89' },
  { id: '6', type: 'info', category: 'reservation', title: 'Reservation confirmee', message: 'RES-2024-0289 confirmee pour Festival Montreux', time: 'Il y a 6h', read: true, link: '/reservations/289' },
  { id: '7', type: 'warning', category: 'stock', title: 'Stock bas', message: 'Structure Alu 3m - 8 disponibles sur 40', time: 'Hier', read: true, link: '/articles/7' },
  { id: '8', type: 'info', category: 'maintenance', title: 'Maintenance terminee', message: 'Console numerique 32ch - Maintenance completee', time: 'Hier', read: true, link: '/maintenance' },
  { id: '9', type: 'critical', category: 'billing', title: 'Facture en retard', message: 'FAC-2024-0078 - Echeance depassee de 15 jours', time: 'Il y a 2 jours', read: true, link: '/invoices/78' },
  { id: '10', type: 'success', category: 'reservation', title: 'Retour complete', message: 'RET-2024-0088 - Tout le materiel rentre sans incident', time: 'Il y a 3 jours', read: true, link: '/returns/88' },
];

const NOTIFICATION_TYPES = {
  critical: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-100' },
  warning: { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-100' },
  success: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100' },
};

const CATEGORY_ICONS = {
  stock: Package,
  maintenance: Wrench,
  reservation: Calendar,
  billing: DollarSign,
  project: Clock,
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [selectedCategory, setSelectedCategory] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread' && n.read) return false;
    if (selectedCategory && n.category !== selectedCategory) return false;
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const stats = {
    critical: notifications.filter(n => n.type === 'critical' && !n.read).length,
    warning: notifications.filter(n => n.type === 'warning' && !n.read).length,
    total: notifications.filter(n => !n.read).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Centre de notifications et alertes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <Check className="mr-2 h-4 w-4" />Tout marquer comme lu
          </Button>
          <Button variant="outline"><Settings className="mr-2 h-4 w-4" />Preferences</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2"><Bell className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm text-muted-foreground">Non lues</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2"><AlertTriangle className="h-5 w-5 text-red-600" /></div>
            <div><p className="text-2xl font-bold">{stats.critical}</p><p className="text-sm text-muted-foreground">Critiques</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2"><AlertCircle className="h-5 w-5 text-yellow-600" /></div>
            <div><p className="text-2xl font-bold">{stats.warning}</p><p className="text-sm text-muted-foreground">Avertissements</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-2"><Bell className="h-5 w-5 text-gray-600" /></div>
            <div><p className="text-2xl font-bold">{notifications.length}</p><p className="text-sm text-muted-foreground">Total</p></div>
          </div>
        </Card>
      </div>

      {/* Filters & Tabs */}
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Toutes ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Non lues ({unreadCount})</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-48">
          <option value="">Toutes categories</option>
          <option value="stock">Stock</option>
          <option value="maintenance">Maintenance</option>
          <option value="reservation">Reservations</option>
          <option value="billing">Facturation</option>
          <option value="project">Projets</option>
        </Select>
      </div>

      {/* Notifications List */}
      <Card>
        <div className="divide-y">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune notification</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const TypeIcon = NOTIFICATION_TYPES[notification.type as keyof typeof NOTIFICATION_TYPES]?.icon || Info;
              const typeConfig = NOTIFICATION_TYPES[notification.type as keyof typeof NOTIFICATION_TYPES] || NOTIFICATION_TYPES.info;
              const CategoryIcon = CATEGORY_ICONS[notification.category as keyof typeof CATEGORY_ICONS] || Bell;

              return (
                <div
                  key={notification.id}
                  className={`p-4 flex items-start gap-4 hover:bg-muted/50 cursor-pointer ${!notification.read ? 'bg-blue-50/50' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className={`rounded-lg p-2 ${typeConfig.bg}`}>
                    <TypeIcon className={`h-5 w-5 ${typeConfig.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-medium ${!notification.read ? '' : 'text-muted-foreground'}`}>{notification.title}</p>
                      {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><CategoryIcon className="h-3 w-3" />{notification.category}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{notification.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <div className="p-4 border-b font-semibold">Preferences de notification</div>
        <div className="p-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm font-medium">Notifications par email</p>
              <div className="space-y-2">
                <Checkbox label="Alertes critiques (stock, retards)" defaultChecked />
                <Checkbox label="Nouvelles reservations" defaultChecked />
                <Checkbox label="Paiements recus" />
                <Checkbox label="Maintenances planifiees" />
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium">Notifications push</p>
              <div className="space-y-2">
                <Checkbox label="Alertes critiques" defaultChecked />
                <Checkbox label="Rappels de taches" defaultChecked />
                <Checkbox label="Mises a jour de projets" />
              </div>
            </div>
          </div>
          <div className="pt-4 border-t">
            <Button>Enregistrer les preferences</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
