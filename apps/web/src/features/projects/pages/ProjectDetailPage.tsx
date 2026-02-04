import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FolderKanban,
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Building2,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  FileText,
  Package,
  Truck,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import {
  Button,
  Card,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Modal,
  Input,
  Select,
  FormField,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui';

const MOCK_PROJECT = {
  id: '1',
  number: 'PRJ-2024-0045',
  name: 'Festival Montreux',
  status: 'active',
  client: {
    id: '1',
    name: 'Montreux Jazz',
    contact: 'Jean-Pierre Muller',
    email: 'jp.muller@montreuxjazz.com',
    phone: '+41 21 966 44 44',
  },
  manager: {
    id: '1',
    name: 'Marie Dupont',
    email: 'marie.dupont@matflow.ch',
  },
  dates: {
    start: '2024-01-15',
    end: '2024-01-17',
  },
  venue: 'Auditorium Stravinski, Montreux',
  budget: 125000,
  spent: 78500,
  description: 'Installation complete son et lumiere pour le festival de jazz de Montreux. 3 scenes, 2500 spectateurs attendus.',
  createdAt: '2023-12-01',
  team: [
    { id: '1', name: 'Marie Dupont', role: 'Chef de projet' },
    { id: '2', name: 'Jean Martin', role: 'Technicien son' },
    { id: '3', name: 'Pierre Bernard', role: 'Technicien lumiere' },
    { id: '4', name: 'Sophie Laurent', role: 'Logistique' },
  ],
};

const MOCK_RESERVATIONS = [
  { id: '1', number: 'RES-2024-0289', status: 'confirmed', items: 45, total: 12500, dates: '15-17 Jan' },
  { id: '2', number: 'RES-2024-0290', status: 'pending', items: 23, total: 4500, dates: '15-17 Jan' },
];

const MOCK_QUOTES = [
  { id: '1', number: 'DEV-2024-0167', status: 'accepted', total: 15000, date: '2024-01-02' },
  { id: '2', number: 'DEV-2024-0168', status: 'sent', total: 8500, date: '2024-01-08' },
];

const MOCK_INVOICES = [
  { id: '1', number: 'FAC-2024-0089', status: 'paid', total: 15000, date: '2024-01-10' },
];

const MOCK_TASKS = [
  { id: '1', task: 'Confirmer disponibilite materiel', assignee: 'Marie D.', dueDate: '2024-01-10', status: 'completed' },
  { id: '2', task: 'Preparer le picking', assignee: 'Jean M.', dueDate: '2024-01-13', status: 'in_progress' },
  { id: '3', task: 'Verification technique', assignee: 'Pierre B.', dueDate: '2024-01-14', status: 'pending' },
  { id: '4', task: 'Transport vers le site', assignee: 'Sophie L.', dueDate: '2024-01-14', status: 'pending' },
  { id: '5', task: 'Installation sur site', assignee: 'Equipe', dueDate: '2024-01-14', status: 'pending' },
];

const STATUS_CONFIG: Record<string, { variant: 'default' | 'success' | 'warning' | 'info'; label: string }> = {
  planning: { variant: 'default', label: 'Planification' },
  active: { variant: 'info', label: 'Actif' },
  completed: { variant: 'success', label: 'Termine' },
  cancelled: { variant: 'warning', label: 'Annule' },
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const project = MOCK_PROJECT;
  const statusConfig = STATUS_CONFIG[project.status] || STATUS_CONFIG.planning;
  const budgetUsed = (project.spent / project.budget) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link to="/projects">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
            </div>
            <div className="flex items-center gap-4 mt-1 text-muted-foreground">
              <span className="flex items-center gap-1"><FolderKanban className="h-4 w-4" />{project.number}</span>
              <span className="flex items-center gap-1"><Building2 className="h-4 w-4" />{project.client.name}</span>
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />
                {new Date(project.dates.start).toLocaleDateString('fr-CH')} - {new Date(project.dates.end).toLocaleDateString('fr-CH')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowEditModal(true)}><Edit className="mr-2 h-4 w-4" />Modifier</Button>
          <Button><Plus className="mr-2 h-4 w-4" />Nouvelle reservation</Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2"><Calendar className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{MOCK_RESERVATIONS.length}</p><p className="text-sm text-muted-foreground">Reservations</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2"><DollarSign className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold">{(project.spent / 1000).toFixed(0)}k CHF</p><p className="text-sm text-muted-foreground">Depense</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2"><Users className="h-5 w-5 text-purple-600" /></div>
            <div><p className="text-2xl font-bold">{project.team.length}</p><p className="text-sm text-muted-foreground">Membres</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2"><CheckCircle2 className="h-5 w-5 text-orange-600" /></div>
            <div><p className="text-2xl font-bold">{MOCK_TASKS.filter(t => t.status === 'completed').length}/{MOCK_TASKS.length}</p><p className="text-sm text-muted-foreground">Taches</p></div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="reservations">Reservations</TabsTrigger>
              <TabsTrigger value="tasks">Taches</TabsTrigger>
              <TabsTrigger value="billing">Facturation</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <div className="p-4 border-b font-semibold">Description</div>
                <div className="p-4">
                  <p className="text-sm">{project.description}</p>
                </div>
              </Card>

              <Card>
                <div className="p-4 border-b font-semibold">Budget</div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Utilise: {project.spent.toLocaleString()} CHF</span>
                    <span>Budget: {project.budget.toLocaleString()} CHF</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${budgetUsed > 90 ? 'bg-red-500' : budgetUsed > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${budgetUsed}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{budgetUsed.toFixed(0)}% du budget utilise - Reste: {(project.budget - project.spent).toLocaleString()} CHF</p>
                </div>
              </Card>

              <Card>
                <div className="p-4 border-b font-semibold">Lieu</div>
                <div className="p-4">
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{project.venue}</p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="reservations">
              <Card>
                <div className="p-4 border-b flex items-center justify-between">
                  <span className="font-semibold">Reservations du projet</span>
                  <Button size="sm"><Plus className="mr-2 h-4 w-4" />Nouvelle</Button>
                </div>
                <div className="divide-y">
                  {MOCK_RESERVATIONS.map((res) => (
                    <div key={res.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <Link to={`/reservations/${res.id}`} className="font-medium hover:text-primary">{res.number}</Link>
                          <p className="text-sm text-muted-foreground">{res.items} articles - {res.dates}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{res.total.toLocaleString()} CHF</span>
                        <Badge variant={res.status === 'confirmed' ? 'success' : 'warning'}>
                          {res.status === 'confirmed' ? 'Confirmee' : 'En attente'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="tasks">
              <Card>
                <div className="p-4 border-b flex items-center justify-between">
                  <span className="font-semibold">Taches du projet</span>
                  <Button size="sm" onClick={() => setShowTaskModal(true)}><Plus className="mr-2 h-4 w-4" />Ajouter</Button>
                </div>
                <div className="divide-y">
                  {MOCK_TASKS.map((task) => (
                    <div key={task.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          task.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-muted-foreground'
                        }`}>
                          {task.status === 'completed' && <CheckCircle2 className="h-3 w-3 text-white" />}
                        </div>
                        <div>
                          <p className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>{task.task}</p>
                          <p className="text-sm text-muted-foreground">{task.assignee} - Echeance: {new Date(task.dueDate).toLocaleDateString('fr-CH')}</p>
                        </div>
                      </div>
                      <Badge variant={task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'warning' : 'default'}>
                        {task.status === 'completed' ? 'Termine' : task.status === 'in_progress' ? 'En cours' : 'A faire'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-4">
              <Card>
                <div className="p-4 border-b font-semibold">Devis</div>
                <div className="divide-y">
                  {MOCK_QUOTES.map((quote) => (
                    <div key={quote.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Link to={`/quotes/${quote.id}`} className="font-medium hover:text-primary">{quote.number}</Link>
                          <p className="text-sm text-muted-foreground">{new Date(quote.date).toLocaleDateString('fr-CH')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{quote.total.toLocaleString()} CHF</span>
                        <Badge variant={quote.status === 'accepted' ? 'success' : 'info'}>
                          {quote.status === 'accepted' ? 'Accepte' : 'Envoye'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <div className="p-4 border-b font-semibold">Factures</div>
                <div className="divide-y">
                  {MOCK_INVOICES.map((invoice) => (
                    <div key={invoice.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Link to={`/invoices/${invoice.id}`} className="font-medium hover:text-primary">{invoice.number}</Link>
                          <p className="text-sm text-muted-foreground">{new Date(invoice.date).toLocaleDateString('fr-CH')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{invoice.total.toLocaleString()} CHF</span>
                        <Badge variant="success">Payee</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client */}
          <Card>
            <div className="p-4 border-b font-semibold">Client</div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                  {project.client.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <p className="font-medium">{project.client.name}</p>
                  <p className="text-sm text-muted-foreground">{project.client.contact}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" />{project.client.email}</p>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{project.client.phone}</p>
              </div>
            </div>
          </Card>

          {/* Team */}
          <Card>
            <div className="p-4 border-b font-semibold">Equipe</div>
            <div className="divide-y">
              {project.team.map((member) => (
                <div key={member.id} className="p-3 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-primary-foreground">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <div className="p-4 border-b font-semibold">Timeline</div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Projet cree</p>
                  <p className="text-xs text-muted-foreground">{new Date(project.createdAt).toLocaleDateString('fr-CH')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Debut evenement</p>
                  <p className="text-xs text-muted-foreground">{new Date(project.dates.start).toLocaleDateString('fr-CH')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Fin evenement</p>
                  <p className="text-xs text-muted-foreground">{new Date(project.dates.end).toLocaleDateString('fr-CH')}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Task Modal */}
      <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} title="Nouvelle tache">
        <div className="space-y-4">
          <FormField label="Description de la tache" required>
            <Input placeholder="Ex: Preparer le picking" />
          </FormField>
          <FormField label="Assigne a">
            <Select>
              <option value="">Selectionner...</option>
              {project.team.map((member) => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Date d'echeance">
            <Input type="date" />
          </FormField>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowTaskModal(false)}>Annuler</Button>
            <Button>Creer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
