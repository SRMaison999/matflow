import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PackageCheck,
  Plus,
  Search,
  Download,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  Play,
  Pause,
  QrCode,
  User,
  Calendar,
  Package,
  AlertTriangle,
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

const MOCK_PICKINGS = [
  { id: '1', number: 'PCK-2024-0156', reservation: 'RES-2024-0289', project: 'Festival Montreux', status: 'ready', assignee: 'Jean Martin', items: 45, picked: 45, date: '2024-01-15', time: '14:00' },
  { id: '2', number: 'PCK-2024-0157', reservation: 'RES-2024-0288', project: 'Conference EPFL', status: 'in_progress', assignee: 'Marie Dupont', items: 23, picked: 15, date: '2024-01-15', time: '15:30' },
  { id: '3', number: 'PCK-2024-0158', reservation: 'RES-2024-0287', project: 'Mariage Dupont', status: 'pending', assignee: null, items: 67, picked: 0, date: '2024-01-16', time: '09:00' },
  { id: '4', number: 'PCK-2024-0159', reservation: 'RES-2024-0286', project: 'Salon Auto Geneve', status: 'pending', assignee: 'Pierre Bernard', items: 134, picked: 0, date: '2024-01-16', time: '10:00' },
  { id: '5', number: 'PCK-2024-0160', reservation: 'RES-2024-0283', project: 'Forum RH', status: 'completed', assignee: 'Sophie Laurent', items: 34, picked: 34, date: '2024-01-14', time: '16:00' },
  { id: '6', number: 'PCK-2024-0161', reservation: 'RES-2024-0282', project: 'Seminaire Nestle', status: 'pending', assignee: null, items: 28, picked: 0, date: '2024-01-17', time: '08:00' },
];

const STATUS_CONFIG: Record<string, { variant: 'default' | 'success' | 'warning' | 'info'; label: string }> = {
  pending: { variant: 'default', label: 'En attente' },
  in_progress: { variant: 'warning', label: 'En cours' },
  ready: { variant: 'success', label: 'Pret' },
  completed: { variant: 'info', label: 'Termine' },
};

export default function PickingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedPicking, setSelectedPicking] = useState<typeof MOCK_PICKINGS[0] | null>(null);

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredPickings = MOCK_PICKINGS.filter((picking) => {
    const matchesSearch = picking.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      picking.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || picking.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: MOCK_PICKINGS.filter(p => p.status === 'pending').length,
    inProgress: MOCK_PICKINGS.filter(p => p.status === 'in_progress').length,
    ready: MOCK_PICKINGS.filter(p => p.status === 'ready').length,
    today: MOCK_PICKINGS.filter(p => p.date === '2024-01-15').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Picking</h1>
          <p className="text-muted-foreground">Preparation des commandes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><QrCode className="mr-2 h-4 w-4" />Scanner</Button>
          <Button onClick={() => setShowNewModal(true)}><Plus className="mr-2 h-4 w-4" />Nouveau picking</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 cursor-pointer hover:bg-accent" onClick={() => setSelectedStatus('pending')}>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-2"><Clock className="h-5 w-5 text-gray-600" /></div>
            <div><p className="text-2xl font-bold">{stats.pending}</p><p className="text-sm text-muted-foreground">En attente</p></div>
          </div>
        </Card>
        <Card className="p-4 cursor-pointer hover:bg-accent" onClick={() => setSelectedStatus('in_progress')}>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2"><Play className="h-5 w-5 text-yellow-600" /></div>
            <div><p className="text-2xl font-bold">{stats.inProgress}</p><p className="text-sm text-muted-foreground">En cours</p></div>
          </div>
        </Card>
        <Card className="p-4 cursor-pointer hover:bg-accent" onClick={() => setSelectedStatus('ready')}>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2"><CheckCircle2 className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold">{stats.ready}</p><p className="text-sm text-muted-foreground">Prets</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2"><Calendar className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{stats.today}</p><p className="text-sm text-muted-foreground">Aujourd'hui</p></div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
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
            <option value="">Tous les preparateurs</option>
            <option value="jean">Jean Martin</option>
            <option value="marie">Marie Dupont</option>
            <option value="pierre">Pierre Bernard</option>
          </Select>
        </div>
      </Card>

      {/* Picking List */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Picking</TableHead>
              <TableHead>Projet</TableHead>
              <TableHead>Preparateur</TableHead>
              <TableHead>Date/Heure</TableHead>
              <TableHead className="text-center">Progression</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPickings.map((picking) => (
              <TableRow key={picking.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedPicking(picking)}>
                <TableCell>
                  <div>
                    <p className="font-medium">{picking.number}</p>
                    <p className="text-sm text-muted-foreground">{picking.reservation}</p>
                  </div>
                </TableCell>
                <TableCell>{picking.project}</TableCell>
                <TableCell>
                  {picking.assignee ? (
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground">
                        {picking.assignee.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span>{picking.assignee}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Non assigne</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{new Date(picking.date).toLocaleDateString('fr-CH')}</p>
                    <p className="text-muted-foreground">{picking.time}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-muted max-w-24">
                      <div
                        className={`h-2 rounded-full ${picking.picked === picking.items ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${(picking.picked / picking.items) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{picking.picked}/{picking.items}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(picking.status)}</TableCell>
                <TableCell><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Picking Detail Modal */}
      <Modal isOpen={!!selectedPicking} onClose={() => setSelectedPicking(null)} title={`Picking ${selectedPicking?.number}`} size="lg">
        {selectedPicking && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div><p className="text-sm text-muted-foreground">Projet</p><p className="font-medium">{selectedPicking.project}</p></div>
              <div><p className="text-sm text-muted-foreground">Reservation</p><p className="font-medium">{selectedPicking.reservation}</p></div>
              <div><p className="text-sm text-muted-foreground">Statut</p>{getStatusBadge(selectedPicking.status)}</div>
            </div>
            <div className="border rounded-lg divide-y">
              <div className="p-3 bg-muted/50 font-medium">Articles a preparer</div>
              {[
                { code: 'PAR-LED-001', name: 'PAR LED RGBW', qty: 12, picked: selectedPicking.status !== 'pending' ? 12 : 0 },
                { code: 'LYR-SPT-002', name: 'Lyre Spot LED', qty: 8, picked: selectedPicking.status !== 'pending' ? 8 : 0 },
                { code: 'CAB-XLR-10M', name: 'Cable XLR 10m', qty: 20, picked: selectedPicking.status === 'in_progress' ? 10 : selectedPicking.status !== 'pending' ? 20 : 0 },
              ].map((item, i) => (
                <div key={i} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center"><Package className="h-4 w-4" /></div>
                    <div><p className="font-medium">{item.name}</p><p className="text-sm text-muted-foreground">{item.code}</p></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={item.picked === item.qty ? 'text-green-600' : ''}>{item.picked}/{item.qty}</span>
                    {item.picked === item.qty && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedPicking(null)}>Fermer</Button>
              <div className="flex gap-2">
                {selectedPicking.status === 'pending' && <Button><Play className="mr-2 h-4 w-4" />Demarrer</Button>}
                {selectedPicking.status === 'in_progress' && <Button><CheckCircle2 className="mr-2 h-4 w-4" />Terminer</Button>}
                {selectedPicking.status === 'ready' && <Button variant="outline">Imprimer bon</Button>}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* New Picking Modal */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Nouveau picking">
        <div className="space-y-4">
          <FormField label="Reservation" required>
            <Select>
              <option value="">Selectionner...</option>
              <option value="1">RES-2024-0289 - Festival Montreux</option>
              <option value="2">RES-2024-0288 - Conference EPFL</option>
            </Select>
          </FormField>
          <FormField label="Preparateur">
            <Select>
              <option value="">Non assigne</option>
              <option value="jean">Jean Martin</option>
              <option value="marie">Marie Dupont</option>
            </Select>
          </FormField>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Date"><Input type="date" /></FormField>
            <FormField label="Heure"><Input type="time" /></FormField>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowNewModal(false)}>Annuler</Button>
            <Button>Creer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
