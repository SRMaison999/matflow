import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  CalendarDays,
  List,
} from 'lucide-react';
import {
  Button,
  Input,
  Card,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Modal,
  Select,
  FormField,
} from '@/components/ui';

const MOCK_RESERVATIONS = [
  { id: '1', number: 'RES-2024-0289', project: 'Festival Montreux', client: 'Montreux Jazz', status: 'confirmed', startDate: '2024-01-15', endDate: '2024-01-17', items: 45, total: 12500 },
  { id: '2', number: 'RES-2024-0288', project: 'Conference EPFL', client: 'EPFL', status: 'preparing', startDate: '2024-01-16', endDate: '2024-01-16', items: 23, total: 3200 },
  { id: '3', number: 'RES-2024-0287', project: 'Mariage Dupont', client: 'Famille Dupont', status: 'draft', startDate: '2024-01-18', endDate: '2024-01-19', items: 67, total: 8900 },
  { id: '4', number: 'RES-2024-0286', project: 'Salon Auto Geneve', client: 'Palexpo SA', status: 'dispatched', startDate: '2024-01-10', endDate: '2024-01-20', items: 134, total: 45000 },
  { id: '5', number: 'RES-2024-0285', project: 'Gala UBS', client: 'UBS SA', status: 'returning', startDate: '2024-01-08', endDate: '2024-01-09', items: 56, total: 15600 },
  { id: '6', number: 'RES-2024-0284', project: 'Concert Paleo', client: 'Paleo Festival', status: 'completed', startDate: '2024-01-05', endDate: '2024-01-07', items: 89, total: 28000 },
  { id: '7', number: 'RES-2024-0283', project: 'Forum RH', client: 'HR Swiss', status: 'pending', startDate: '2024-01-22', endDate: '2024-01-23', items: 34, total: 5600 },
  { id: '8', number: 'RES-2024-0282', project: 'Seminaire Nestle', client: 'Nestle SA', status: 'confirmed', startDate: '2024-01-25', endDate: '2024-01-26', items: 28, total: 4200 },
];

const STATUS_CONFIG: Record<string, { variant: 'default' | 'success' | 'warning' | 'info' | 'destructive'; label: string; icon: any }> = {
  draft: { variant: 'default', label: 'Brouillon', icon: Edit },
  pending: { variant: 'warning', label: 'En attente', icon: Clock },
  confirmed: { variant: 'info', label: 'Confirmee', icon: CheckCircle2 },
  preparing: { variant: 'warning', label: 'En preparation', icon: Clock },
  ready: { variant: 'success', label: 'Prete', icon: CheckCircle2 },
  dispatched: { variant: 'info', label: 'Expediee', icon: Truck },
  in_use: { variant: 'info', label: 'En cours', icon: Calendar },
  returning: { variant: 'warning', label: 'En retour', icon: RotateCcw },
  completed: { variant: 'success', label: 'Terminee', icon: CheckCircle2 },
  cancelled: { variant: 'destructive', label: 'Annulee', icon: AlertCircle },
};

export default function ReservationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showNewModal, setShowNewModal] = useState(false);

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredReservations = MOCK_RESERVATIONS.filter((res) => {
    const matchesSearch = res.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || res.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: MOCK_RESERVATIONS.length,
    pending: MOCK_RESERVATIONS.filter(r => ['draft', 'pending'].includes(r.status)).length,
    active: MOCK_RESERVATIONS.filter(r => ['confirmed', 'preparing', 'ready', 'dispatched', 'in_use'].includes(r.status)).length,
    completed: MOCK_RESERVATIONS.filter(r => r.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reservations</h1>
          <p className="text-muted-foreground">Gerez vos reservations de materiel</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="mr-2 h-4 w-4" />Exporter</Button>
          <Button onClick={() => setShowNewModal(true)}><Plus className="mr-2 h-4 w-4" />Nouvelle reservation</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2"><Calendar className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm text-muted-foreground">Total</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2"><Clock className="h-5 w-5 text-yellow-600" /></div>
            <div><p className="text-2xl font-bold">{stats.pending}</p><p className="text-sm text-muted-foreground">En attente</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2"><Truck className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold">{stats.active}</p><p className="text-sm text-muted-foreground">Actives</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-2"><CheckCircle2 className="h-5 w-5 text-gray-600" /></div>
            <div><p className="text-2xl font-bold">{stats.completed}</p><p className="text-sm text-muted-foreground">Terminees</p></div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
            <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-48">
              <option value="">Tous les statuts</option>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </Select>
            <Select className="w-48">
              <option value="">Toutes les periodes</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}><List className="h-4 w-4" /></Button>
            <Button variant={viewMode === 'calendar' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('calendar')}><CalendarDays className="h-4 w-4" /></Button>
          </div>
        </div>
      </Card>

      {/* List View */}
      {viewMode === 'list' && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reservation</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead className="text-center">Articles</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.map((res) => (
                <TableRow key={res.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <Link to={`/reservations/${res.id}`} className="font-medium hover:text-primary">{res.number}</Link>
                      <p className="text-sm text-muted-foreground">{res.project}</p>
                    </div>
                  </TableCell>
                  <TableCell>{res.client}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{new Date(res.startDate).toLocaleDateString('fr-CH')}</p>
                      <p className="text-muted-foreground">{new Date(res.endDate).toLocaleDateString('fr-CH')}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{res.items}</TableCell>
                  <TableCell>{getStatusBadge(res.status)}</TableCell>
                  <TableCell className="text-right font-medium">{res.total.toLocaleString()} CHF</TableCell>
                  <TableCell><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <Card className="p-6">
          <div className="text-center text-muted-foreground py-12">
            <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Vue calendrier</p>
            <p className="text-sm">Affichage des reservations sur un calendrier interactif</p>
          </div>
        </Card>
      )}

      {/* New Reservation Modal */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Nouvelle reservation" size="lg">
        <div className="space-y-4">
          <FormField label="Projet" required>
            <Select>
              <option value="">Selectionner un projet...</option>
              <option value="1">Festival Montreux</option>
              <option value="2">Conference EPFL</option>
              <option value="3">Nouveau projet...</option>
            </Select>
          </FormField>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Date de debut" required><Input type="date" /></FormField>
            <FormField label="Date de fin" required><Input type="date" /></FormField>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Date d'enlevement"><Input type="datetime-local" /></FormField>
            <FormField label="Date de retour"><Input type="datetime-local" /></FormField>
          </div>
          <FormField label="Notes">
            <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={3} placeholder="Notes internes..." />
          </FormField>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowNewModal(false)}>Annuler</Button>
            <Button>Creer et ajouter articles</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
