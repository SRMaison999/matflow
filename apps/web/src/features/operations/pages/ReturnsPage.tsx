import { useState } from 'react';
import {
  RotateCcw,
  Plus,
  Search,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Calendar,
  Package,
  XCircle,
  AlertCircle,
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

const MOCK_RETURNS = [
  { id: '1', number: 'RET-2024-0089', reservation: 'RES-2024-0285', project: 'Gala UBS', status: 'in_progress', checker: 'Marie Dupont', items: 56, returned: 54, damaged: 1, missing: 1, date: '2024-01-15' },
  { id: '2', number: 'RET-2024-0090', reservation: 'RES-2024-0284', project: 'Concert Paleo', status: 'completed', checker: 'Jean Martin', items: 89, returned: 89, damaged: 0, missing: 0, date: '2024-01-14' },
  { id: '3', number: 'RET-2024-0091', reservation: 'RES-2024-0283', project: 'Forum RH', status: 'pending', checker: null, items: 34, returned: 0, damaged: 0, missing: 0, date: '2024-01-16' },
  { id: '4', number: 'RET-2024-0092', reservation: 'RES-2024-0280', project: 'Expo Art', status: 'completed', checker: 'Pierre Bernard', items: 45, returned: 43, damaged: 2, missing: 0, date: '2024-01-13' },
  { id: '5', number: 'RET-2024-0093', reservation: 'RES-2024-0279', project: 'Lancement Produit', status: 'pending', checker: 'Sophie Laurent', items: 28, returned: 0, damaged: 0, missing: 0, date: '2024-01-17' },
];

const STATUS_CONFIG: Record<string, { variant: 'default' | 'success' | 'warning' | 'info'; label: string }> = {
  pending: { variant: 'default', label: 'En attente' },
  in_progress: { variant: 'warning', label: 'En cours' },
  completed: { variant: 'success', label: 'Termine' },
};

export default function ReturnsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<typeof MOCK_RETURNS[0] | null>(null);

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredReturns = MOCK_RETURNS.filter((ret) => {
    const matchesSearch = ret.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ret.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || ret.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: MOCK_RETURNS.filter(r => r.status === 'pending').length,
    inProgress: MOCK_RETURNS.filter(r => r.status === 'in_progress').length,
    completed: MOCK_RETURNS.filter(r => r.status === 'completed').length,
    issues: MOCK_RETURNS.reduce((acc, r) => acc + r.damaged + r.missing, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Retours</h1>
          <p className="text-muted-foreground">Controle des retours de materiel</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><QrCode className="mr-2 h-4 w-4" />Scanner</Button>
          <Button onClick={() => setShowNewModal(true)}><Plus className="mr-2 h-4 w-4" />Nouveau retour</Button>
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
            <div className="rounded-lg bg-yellow-100 p-2"><RotateCcw className="h-5 w-5 text-yellow-600" /></div>
            <div><p className="text-2xl font-bold">{stats.inProgress}</p><p className="text-sm text-muted-foreground">En cours</p></div>
          </div>
        </Card>
        <Card className="p-4 cursor-pointer hover:bg-accent" onClick={() => setSelectedStatus('completed')}>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2"><CheckCircle2 className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold">{stats.completed}</p><p className="text-sm text-muted-foreground">Termines</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2"><AlertTriangle className="h-5 w-5 text-red-600" /></div>
            <div><p className="text-2xl font-bold">{stats.issues}</p><p className="text-sm text-muted-foreground">Incidents</p></div>
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
        </div>
      </Card>

      {/* Returns List */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Retour</TableHead>
              <TableHead>Projet</TableHead>
              <TableHead>Controleur</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Progression</TableHead>
              <TableHead className="text-center">Incidents</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReturns.map((ret) => (
              <TableRow key={ret.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedReturn(ret)}>
                <TableCell>
                  <div>
                    <p className="font-medium">{ret.number}</p>
                    <p className="text-sm text-muted-foreground">{ret.reservation}</p>
                  </div>
                </TableCell>
                <TableCell>{ret.project}</TableCell>
                <TableCell>
                  {ret.checker ? (
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground">
                        {ret.checker.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span>{ret.checker}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Non assigne</span>
                  )}
                </TableCell>
                <TableCell>{new Date(ret.date).toLocaleDateString('fr-CH')}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 justify-center">
                    <div className="flex-1 h-2 rounded-full bg-muted max-w-24">
                      <div
                        className={`h-2 rounded-full ${ret.returned === ret.items ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${(ret.returned / ret.items) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{ret.returned}/{ret.items}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {(ret.damaged > 0 || ret.missing > 0) ? (
                    <div className="flex items-center justify-center gap-2">
                      {ret.damaged > 0 && <Badge variant="warning">{ret.damaged} endommage</Badge>}
                      {ret.missing > 0 && <Badge variant="destructive">{ret.missing} manquant</Badge>}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(ret.status)}</TableCell>
                <TableCell><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Return Detail Modal */}
      <Modal isOpen={!!selectedReturn} onClose={() => setSelectedReturn(null)} title={`Retour ${selectedReturn?.number}`} size="lg">
        {selectedReturn && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div><p className="text-sm text-muted-foreground">Projet</p><p className="font-medium">{selectedReturn.project}</p></div>
              <div><p className="text-sm text-muted-foreground">Reservation</p><p className="font-medium">{selectedReturn.reservation}</p></div>
              <div><p className="text-sm text-muted-foreground">Statut</p>{getStatusBadge(selectedReturn.status)}</div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-3 text-center">
                <p className="text-2xl font-bold text-green-600">{selectedReturn.returned}</p>
                <p className="text-sm text-muted-foreground">Retournes</p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-2xl font-bold text-yellow-600">{selectedReturn.damaged}</p>
                <p className="text-sm text-muted-foreground">Endommages</p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-2xl font-bold text-red-600">{selectedReturn.missing}</p>
                <p className="text-sm text-muted-foreground">Manquants</p>
              </Card>
            </div>
            <div className="border rounded-lg divide-y">
              <div className="p-3 bg-muted/50 font-medium">Articles a controler</div>
              {[
                { code: 'PAR-LED-001', name: 'PAR LED RGBW', qty: 12, status: 'ok' },
                { code: 'LYR-SPT-002', name: 'Lyre Spot LED', qty: 8, status: 'damaged' },
                { code: 'CAB-XLR-10M', name: 'Cable XLR 10m', qty: 20, status: 'missing' },
              ].map((item, i) => (
                <div key={i} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center"><Package className="h-4 w-4" /></div>
                    <div><p className="font-medium">{item.name}</p><p className="text-sm text-muted-foreground">{item.code}</p></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{item.qty}x</span>
                    {item.status === 'ok' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    {item.status === 'damaged' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                    {item.status === 'missing' && <XCircle className="h-5 w-5 text-red-500" />}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedReturn(null)}>Fermer</Button>
              <div className="flex gap-2">
                {selectedReturn.status === 'pending' && <Button>Demarrer le controle</Button>}
                {selectedReturn.status === 'in_progress' && <Button><CheckCircle2 className="mr-2 h-4 w-4" />Terminer</Button>}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* New Return Modal */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Nouveau retour">
        <div className="space-y-4">
          <FormField label="Reservation" required>
            <Select>
              <option value="">Selectionner...</option>
              <option value="1">RES-2024-0285 - Gala UBS</option>
              <option value="2">RES-2024-0284 - Concert Paleo</option>
            </Select>
          </FormField>
          <FormField label="Controleur">
            <Select>
              <option value="">Non assigne</option>
              <option value="marie">Marie Dupont</option>
              <option value="jean">Jean Martin</option>
            </Select>
          </FormField>
          <FormField label="Date"><Input type="date" /></FormField>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowNewModal(false)}>Annuler</Button>
            <Button>Creer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
