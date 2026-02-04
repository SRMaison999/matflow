import { useState } from 'react';
import {
  UserCog,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  ShieldAlert,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Key,
  Trash2,
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
  Checkbox,
} from '@/components/ui';

const MOCK_USERS = [
  { id: '1', name: 'Jean Martin', email: 'jean.martin@matflow.ch', phone: '+41 79 123 45 67', role: 'admin', status: 'active', lastLogin: '2024-01-15 14:32', createdAt: '2023-01-15', branch: 'Geneve' },
  { id: '2', name: 'Marie Dupont', email: 'marie.dupont@matflow.ch', phone: '+41 79 234 56 78', role: 'manager', status: 'active', lastLogin: '2024-01-15 09:15', createdAt: '2023-03-20', branch: 'Lausanne' },
  { id: '3', name: 'Pierre Bernard', email: 'pierre.bernard@matflow.ch', phone: '+41 79 345 67 89', role: 'technician', status: 'active', lastLogin: '2024-01-14 16:45', createdAt: '2023-06-10', branch: 'Geneve' },
  { id: '4', name: 'Sophie Laurent', email: 'sophie.laurent@matflow.ch', phone: '+41 79 456 78 90', role: 'technician', status: 'active', lastLogin: '2024-01-15 11:20', createdAt: '2023-08-05', branch: 'Lausanne' },
  { id: '5', name: 'Lucas Favre', email: 'lucas.favre@matflow.ch', phone: '+41 79 567 89 01', role: 'viewer', status: 'inactive', lastLogin: '2023-12-20 10:00', createdAt: '2023-09-15', branch: 'Zurich' },
  { id: '6', name: 'Emma Rochat', email: 'emma.rochat@matflow.ch', phone: '+41 79 678 90 12', role: 'manager', status: 'active', lastLogin: '2024-01-15 08:30', createdAt: '2023-11-01', branch: 'Zurich' },
];

const ROLE_CONFIG: Record<string, { variant: 'default' | 'success' | 'warning' | 'destructive' | 'info'; label: string; icon: typeof Shield }> = {
  admin: { variant: 'destructive', label: 'Administrateur', icon: ShieldAlert },
  manager: { variant: 'warning', label: 'Manager', icon: ShieldCheck },
  technician: { variant: 'info', label: 'Technicien', icon: Shield },
  viewer: { variant: 'default', label: 'Lecture seule', icon: Shield },
};

const PERMISSIONS = [
  { key: 'articles', label: 'Articles', description: 'Gestion du catalogue d\'articles' },
  { key: 'reservations', label: 'Reservations', description: 'Creer et modifier des reservations' },
  { key: 'projects', label: 'Projets', description: 'Gestion des projets' },
  { key: 'picking', label: 'Picking', description: 'Preparation des commandes' },
  { key: 'returns', label: 'Retours', description: 'Controle des retours' },
  { key: 'stock', label: 'Stock', description: 'Gestion du stock' },
  { key: 'maintenance', label: 'Maintenance', description: 'Taches de maintenance' },
  { key: 'billing', label: 'Facturation', description: 'Devis et factures' },
  { key: 'clients', label: 'Clients', description: 'Gestion des clients' },
  { key: 'settings', label: 'Parametres', description: 'Configuration systeme' },
  { key: 'users', label: 'Utilisateurs', description: 'Gestion des utilisateurs' },
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const stats = {
    total: MOCK_USERS.length,
    active: MOCK_USERS.filter(u => u.status === 'active').length,
    admins: MOCK_USERS.filter(u => u.role === 'admin').length,
    managers: MOCK_USERS.filter(u => u.role === 'manager').length,
  };

  const filteredUsers = MOCK_USERS.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !selectedRole || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    const config = ROLE_CONFIG[role] || { variant: 'default', label: role };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Utilisateurs</h1>
          <p className="text-muted-foreground">Gestion des utilisateurs et permissions</p>
        </div>
        <Button onClick={() => setShowNewModal(true)}><Plus className="mr-2 h-4 w-4" />Nouvel utilisateur</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2"><UserCog className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm text-muted-foreground">Total utilisateurs</p></div>
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
            <div className="rounded-lg bg-red-100 p-2"><ShieldAlert className="h-5 w-5 text-red-600" /></div>
            <div><p className="text-2xl font-bold">{stats.admins}</p><p className="text-sm text-muted-foreground">Administrateurs</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2"><ShieldCheck className="h-5 w-5 text-orange-600" /></div>
            <div><p className="text-2xl font-bold">{stats.managers}</p><p className="text-sm text-muted-foreground">Managers</p></div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
          <Select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="w-48">
            <option value="">Tous les roles</option>
            {Object.entries(ROLE_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </Select>
          <Select className="w-48">
            <option value="">Toutes les branches</option>
            <option value="geneve">Geneve</option>
            <option value="lausanne">Lausanne</option>
            <option value="zurich">Zurich</option>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Branche</TableHead>
              <TableHead>Derniere connexion</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className={user.status === 'inactive' ? 'opacity-60' : ''}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-sm text-primary-foreground">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">Depuis {new Date(user.createdAt).toLocaleDateString('fr-CH')}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm flex items-center gap-1"><Mail className="h-3 w-3" />{user.email}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{user.phone}</p>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{user.branch}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {user.lastLogin}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'success' : 'default'}>
                    {user.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" title="Permissions" onClick={() => setShowPermissionsModal(true)}>
                      <Key className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Plus"><MoreHorizontal className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* New User Modal */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Nouvel utilisateur" size="lg">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Prenom" required><Input placeholder="Prenom" /></FormField>
            <FormField label="Nom" required><Input placeholder="Nom" /></FormField>
          </div>
          <FormField label="Email" required><Input type="email" placeholder="email@matflow.ch" /></FormField>
          <FormField label="Telephone"><Input placeholder="+41 79 XXX XX XX" /></FormField>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Role" required>
              <Select>
                <option value="">Selectionner un role...</option>
                {Object.entries(ROLE_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </Select>
            </FormField>
            <FormField label="Branche" required>
              <Select>
                <option value="">Selectionner une branche...</option>
                <option value="geneve">Geneve</option>
                <option value="lausanne">Lausanne</option>
                <option value="zurich">Zurich</option>
              </Select>
            </FormField>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Un email d'invitation sera envoye a l'utilisateur avec un lien pour definir son mot de passe.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowNewModal(false)}>Annuler</Button>
            <Button>Envoyer l'invitation</Button>
          </div>
        </div>
      </Modal>

      {/* Permissions Modal */}
      <Modal isOpen={showPermissionsModal} onClose={() => setShowPermissionsModal(false)} title="Permissions utilisateur" size="lg">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-sm text-primary-foreground">JM</div>
              <div>
                <p className="font-medium">Jean Martin</p>
                <p className="text-sm text-muted-foreground">jean.martin@matflow.ch</p>
              </div>
            </div>
            {getRoleBadge('admin')}
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Permissions</h4>
            <div className="border rounded-lg divide-y">
              {PERMISSIONS.map((perm) => (
                <div key={perm.key} className="flex items-center justify-between p-3">
                  <div>
                    <p className="font-medium">{perm.label}</p>
                    <p className="text-sm text-muted-foreground">{perm.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox defaultChecked />
                      Lecture
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox defaultChecked />
                      Ecriture
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox />
                      Suppression
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowPermissionsModal(false)}>Annuler</Button>
            <Button>Enregistrer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
