import { useState } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  MoreHorizontal,
  Package,
  User,
  Filter,
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
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui';

const MOCK_TASKS = [
  { id: '1', number: 'MNT-2024-0089', article: 'Lyre Spot LED 150W', code: 'LYR-SPT-045', type: 'corrective', priority: 'high', status: 'in_progress', assignee: 'Pierre Bernard', description: 'Moteur pan defaillant', createdAt: '2024-01-14', dueDate: '2024-01-16' },
  { id: '2', number: 'MNT-2024-0088', article: 'Console numerique 32ch', code: 'CON-NUM-002', type: 'preventive', priority: 'medium', status: 'pending', assignee: 'Jean Martin', description: 'Revision annuelle', createdAt: '2024-01-13', dueDate: '2024-01-20' },
  { id: '3', number: 'MNT-2024-0087', article: 'Videoprojecteur 10000lm', code: 'VID-PRO-003', type: 'corrective', priority: 'urgent', status: 'pending', assignee: null, description: 'Lampe a remplacer', createdAt: '2024-01-15', dueDate: '2024-01-15' },
  { id: '4', number: 'MNT-2024-0086', article: 'PAR LED RGBW', code: 'PAR-LED-012', type: 'repair', priority: 'low', status: 'completed', assignee: 'Sophie Laurent', description: 'Connecteur DMX desserre', createdAt: '2024-01-10', dueDate: '2024-01-12' },
  { id: '5', number: 'MNT-2024-0085', article: 'Enceinte Active 15"', code: 'ENC-ACT-008', type: 'preventive', priority: 'medium', status: 'completed', assignee: 'Pierre Bernard', description: 'Nettoyage et verification', createdAt: '2024-01-08', dueDate: '2024-01-10' },
];

const MOCK_SCHEDULE = [
  { id: '1', article: 'Console numerique 32ch', code: 'CON-NUM-001', lastMaintenance: '2023-07-15', nextMaintenance: '2024-01-15', interval: 180, status: 'overdue' },
  { id: '2', article: 'Videoprojecteur 10000lm', code: 'VID-PRO-001', lastMaintenance: '2023-10-20', nextMaintenance: '2024-01-20', interval: 90, status: 'due_soon' },
  { id: '3', article: 'Lyre Spot LED 150W', code: 'LYR-SPT-001', lastMaintenance: '2023-12-01', nextMaintenance: '2024-03-01', interval: 90, status: 'ok' },
  { id: '4', article: 'PAR LED RGBW', code: 'PAR-LED-001', lastMaintenance: '2023-11-15', nextMaintenance: '2024-05-15', interval: 180, status: 'ok' },
];

const STATUS_CONFIG: Record<string, { variant: 'default' | 'success' | 'warning' | 'info' | 'destructive'; label: string }> = {
  pending: { variant: 'default', label: 'En attente' },
  in_progress: { variant: 'warning', label: 'En cours' },
  completed: { variant: 'success', label: 'Termine' },
  cancelled: { variant: 'destructive', label: 'Annule' },
};

const PRIORITY_CONFIG: Record<string, { variant: 'default' | 'success' | 'warning' | 'destructive'; label: string }> = {
  low: { variant: 'default', label: 'Basse' },
  medium: { variant: 'warning', label: 'Moyenne' },
  high: { variant: 'destructive', label: 'Haute' },
  urgent: { variant: 'destructive', label: 'Urgente' },
};

const TYPE_CONFIG: Record<string, string> = {
  preventive: 'Preventive',
  corrective: 'Corrective',
  repair: 'Reparation',
};

export default function MaintenancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [activeTab, setActiveTab] = useState('tasks');
  const [showNewModal, setShowNewModal] = useState(false);

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const config = PRIORITY_CONFIG[priority] || { variant: 'default', label: priority };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getScheduleStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'success' | 'warning' | 'destructive'; label: string }> = {
      ok: { variant: 'success', label: 'OK' },
      due_soon: { variant: 'warning', label: 'Bientot' },
      overdue: { variant: 'destructive', label: 'En retard' },
    };
    const { variant, label } = config[status] || { variant: 'success', label: status };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const stats = {
    pending: MOCK_TASKS.filter(t => t.status === 'pending').length,
    inProgress: MOCK_TASKS.filter(t => t.status === 'in_progress').length,
    urgent: MOCK_TASKS.filter(t => t.priority === 'urgent' && t.status !== 'completed').length,
    overdue: MOCK_SCHEDULE.filter(s => s.status === 'overdue').length,
  };

  const filteredTasks = MOCK_TASKS.filter(task => {
    const matchesSearch = task.article.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || task.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Maintenance</h1>
          <p className="text-muted-foreground">Gestion des taches de maintenance</p>
        </div>
        <Button onClick={() => setShowNewModal(true)}><Plus className="mr-2 h-4 w-4" />Nouvelle tache</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-2"><Clock className="h-5 w-5 text-gray-600" /></div>
            <div><p className="text-2xl font-bold">{stats.pending}</p><p className="text-sm text-muted-foreground">En attente</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2"><Wrench className="h-5 w-5 text-yellow-600" /></div>
            <div><p className="text-2xl font-bold">{stats.inProgress}</p><p className="text-sm text-muted-foreground">En cours</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2"><AlertTriangle className="h-5 w-5 text-red-600" /></div>
            <div><p className="text-2xl font-bold">{stats.urgent}</p><p className="text-sm text-muted-foreground">Urgentes</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2"><Calendar className="h-5 w-5 text-orange-600" /></div>
            <div><p className="text-2xl font-bold">{stats.overdue}</p><p className="text-sm text-muted-foreground">Planifiees en retard</p></div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tasks">Taches ({MOCK_TASKS.length})</TabsTrigger>
          <TabsTrigger value="schedule">Planning preventif</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <Card className="p-4">
            <div className="flex gap-4">
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
                <option value="">Toutes priorites</option>
                <option value="urgent">Urgente</option>
                <option value="high">Haute</option>
                <option value="medium">Moyenne</option>
                <option value="low">Basse</option>
              </Select>
            </div>
          </Card>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tache</TableHead>
                  <TableHead>Article</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priorite</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Echeance</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id} className={task.priority === 'urgent' ? 'bg-red-50' : ''}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{task.number}</p>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{task.article}</p>
                          <p className="text-sm text-muted-foreground">{task.code}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{TYPE_CONFIG[task.type] || task.type}</TableCell>
                    <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                    <TableCell>
                      {task.assignee ? (
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground">
                            {task.assignee.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span>{task.assignee}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Non assigne</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-600' : ''}>
                        {new Date(task.dueDate).toLocaleDateString('fr-CH')}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                    <TableCell><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <div className="p-4 border-b">
              <h3 className="font-semibold">Planning de maintenance preventive</h3>
              <p className="text-sm text-muted-foreground">Articles necessitant une maintenance reguliere</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead>Derniere maintenance</TableHead>
                  <TableHead>Prochaine maintenance</TableHead>
                  <TableHead>Intervalle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_SCHEDULE.map((item) => (
                  <TableRow key={item.id} className={item.status === 'overdue' ? 'bg-red-50' : ''}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{item.article}</p>
                          <p className="text-sm text-muted-foreground">{item.code}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(item.lastMaintenance).toLocaleDateString('fr-CH')}</TableCell>
                    <TableCell className={item.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                      {new Date(item.nextMaintenance).toLocaleDateString('fr-CH')}
                    </TableCell>
                    <TableCell>{item.interval} jours</TableCell>
                    <TableCell>{getScheduleStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Planifier</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Task Modal */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Nouvelle tache de maintenance" size="lg">
        <div className="space-y-4">
          <FormField label="Article" required>
            <Select>
              <option value="">Selectionner un article...</option>
              <option value="1">LYR-SPT-045 - Lyre Spot LED 150W</option>
              <option value="2">CON-NUM-002 - Console numerique 32ch</option>
              <option value="3">VID-PRO-003 - Videoprojecteur 10000lm</option>
            </Select>
          </FormField>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Type" required>
              <Select>
                <option value="preventive">Preventive</option>
                <option value="corrective">Corrective</option>
                <option value="repair">Reparation</option>
              </Select>
            </FormField>
            <FormField label="Priorite" required>
              <Select>
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
                <option value="urgent">Urgente</option>
              </Select>
            </FormField>
          </div>
          <FormField label="Description" required>
            <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={3} placeholder="Description du probleme ou de l'intervention..." />
          </FormField>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Technicien">
              <Select>
                <option value="">Non assigne</option>
                <option value="pierre">Pierre Bernard</option>
                <option value="jean">Jean Martin</option>
                <option value="sophie">Sophie Laurent</option>
              </Select>
            </FormField>
            <FormField label="Echeance"><Input type="date" /></FormField>
          </div>
          <FormField label="Cout estime"><Input type="number" placeholder="0.00" /></FormField>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowNewModal(false)}>Annuler</Button>
            <Button>Creer la tache</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
