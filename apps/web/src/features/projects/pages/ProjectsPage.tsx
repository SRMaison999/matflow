import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Plus,
  Search,
  Download,
  MoreHorizontal,
  Calendar,
  Users,
  DollarSign,
  Clock,
  CheckCircle2,
  MapPin,
  Building2,
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

const MOCK_PROJECTS = [
  { id: '1', number: 'PRJ-2024-0045', name: 'Festival Montreux', client: 'Montreux Jazz', status: 'active', manager: 'Marie Dupont', startDate: '2024-01-15', endDate: '2024-01-17', budget: 125000, venue: 'Auditorium Stravinski' },
  { id: '2', number: 'PRJ-2024-0044', name: 'Conference EPFL', client: 'EPFL', status: 'active', manager: 'Jean Martin', startDate: '2024-01-16', endDate: '2024-01-16', budget: 32000, venue: 'SwissTech Convention Center' },
  { id: '3', number: 'PRJ-2024-0043', name: 'Mariage Dupont', client: 'Famille Dupont', status: 'planning', manager: 'Sophie Laurent', startDate: '2024-01-18', endDate: '2024-01-19', budget: 45000, venue: 'Chateau de Chillon' },
  { id: '4', number: 'PRJ-2024-0042', name: 'Salon Auto Geneve', client: 'Palexpo SA', status: 'active', manager: 'Pierre Bernard', startDate: '2024-01-10', endDate: '2024-01-20', budget: 450000, venue: 'Palexpo' },
  { id: '5', number: 'PRJ-2024-0041', name: 'Gala UBS', client: 'UBS SA', status: 'completed', manager: 'Marie Dupont', startDate: '2024-01-08', endDate: '2024-01-09', budget: 85000, venue: 'Hotel President Wilson' },
  { id: '6', number: 'PRJ-2024-0040', name: 'Concert Paleo', client: 'Paleo Festival', status: 'completed', manager: 'Jean Martin', startDate: '2024-01-05', endDate: '2024-01-07', budget: 280000, venue: 'Plaine de l\'Asse' },
];

const STATUS_CONFIG: Record<string, { variant: 'default' | 'success' | 'warning' | 'info'; label: string }> = {
  planning: { variant: 'default', label: 'Planification' },
  active: { variant: 'info', label: 'Actif' },
  completed: { variant: 'success', label: 'Termine' },
  cancelled: { variant: 'warning', label: 'Annule' },
};

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredProjects = MOCK_PROJECTS.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || project.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: MOCK_PROJECTS.length,
    active: MOCK_PROJECTS.filter(p => p.status === 'active').length,
    planning: MOCK_PROJECTS.filter(p => p.status === 'planning').length,
    totalBudget: MOCK_PROJECTS.reduce((acc, p) => acc + p.budget, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projets</h1>
          <p className="text-muted-foreground">Gestion des projets evenementiels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="mr-2 h-4 w-4" />Exporter</Button>
          <Button onClick={() => setShowNewModal(true)}><Plus className="mr-2 h-4 w-4" />Nouveau projet</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2"><FolderKanban className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm text-muted-foreground">Total projets</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2"><CheckCircle2 className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold">{stats.active}</p><p className="text-sm text-muted-foreground">Actifs</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2"><Clock className="h-5 w-5 text-yellow-600" /></div>
            <div><p className="text-2xl font-bold">{stats.planning}</p><p className="text-sm text-muted-foreground">En planification</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2"><DollarSign className="h-5 w-5 text-purple-600" /></div>
            <div><p className="text-2xl font-bold">{(stats.totalBudget / 1000).toFixed(0)}k</p><p className="text-sm text-muted-foreground">Budget total CHF</p></div>
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
            <option value="">Tous les managers</option>
            <option value="marie">Marie Dupont</option>
            <option value="jean">Jean Martin</option>
            <option value="sophie">Sophie Laurent</option>
          </Select>
        </div>
      </Card>

      {/* Projects List */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Projet</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Periode</TableHead>
              <TableHead>Lieu</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id} className="hover:bg-muted/50">
                <TableCell>
                  <div>
                    <Link to={`/projects/${project.id}`} className="font-medium hover:text-primary">{project.name}</Link>
                    <p className="text-sm text-muted-foreground">{project.number}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {project.client}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground">
                      {project.manager.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span>{project.manager}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{new Date(project.startDate).toLocaleDateString('fr-CH')}</p>
                    <p className="text-muted-foreground">{new Date(project.endDate).toLocaleDateString('fr-CH')}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {project.venue}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(project.status)}</TableCell>
                <TableCell className="text-right font-medium">{project.budget.toLocaleString()} CHF</TableCell>
                <TableCell><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* New Project Modal */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Nouveau projet" size="lg">
        <div className="space-y-4">
          <FormField label="Nom du projet" required><Input placeholder="Ex: Festival Montreux 2024" /></FormField>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Client" required>
              <Select>
                <option value="">Selectionner...</option>
                <option value="1">Montreux Jazz</option>
                <option value="2">EPFL</option>
                <option value="new">+ Nouveau client</option>
              </Select>
            </FormField>
            <FormField label="Chef de projet">
              <Select>
                <option value="">Selectionner...</option>
                <option value="marie">Marie Dupont</option>
                <option value="jean">Jean Martin</option>
              </Select>
            </FormField>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Date de debut" required><Input type="date" /></FormField>
            <FormField label="Date de fin" required><Input type="date" /></FormField>
          </div>
          <FormField label="Lieu"><Input placeholder="Ex: Auditorium Stravinski, Montreux" /></FormField>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Budget estime"><Input type="number" placeholder="0" /></FormField>
            <FormField label="Devise">
              <Select><option value="CHF">CHF</option><option value="EUR">EUR</option></Select>
            </FormField>
          </div>
          <FormField label="Description">
            <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={3} placeholder="Description du projet..." />
          </FormField>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowNewModal(false)}>Annuler</Button>
            <Button>Creer le projet</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
