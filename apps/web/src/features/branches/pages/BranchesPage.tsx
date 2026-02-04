import { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Users,
  Package,
  Clock,
  Settings,
} from 'lucide-react';
import {
  Button,
  Card,
  Badge,
  Modal,
  Input,
  Select,
  FormField,
} from '@/components/ui';

const MOCK_BRANCHES = [
  {
    id: '1',
    name: 'Lausanne (Siege)',
    code: 'LAU',
    type: 'headquarters',
    address: 'Route de Berne 46, 1010 Lausanne',
    phone: '+41 21 123 45 67',
    email: 'lausanne@matflow.ch',
    manager: 'Marie Dupont',
    employees: 12,
    articles: 1856,
    status: 'active',
    openingHours: 'Lun-Ven 07:00-18:00',
  },
  {
    id: '2',
    name: 'Geneve',
    code: 'GVA',
    type: 'branch',
    address: 'Rue du Rhone 14, 1204 Geneve',
    phone: '+41 22 234 56 78',
    email: 'geneve@matflow.ch',
    manager: 'Jean Martin',
    employees: 8,
    articles: 1245,
    status: 'active',
    openingHours: 'Lun-Ven 08:00-17:00',
  },
  {
    id: '3',
    name: 'Zurich',
    code: 'ZRH',
    type: 'branch',
    address: 'Bahnhofstrasse 21, 8001 Zurich',
    phone: '+41 44 345 67 89',
    email: 'zurich@matflow.ch',
    manager: 'Peter Schmid',
    employees: 6,
    articles: 876,
    status: 'active',
    openingHours: 'Lun-Ven 08:00-17:00',
  },
  {
    id: '4',
    name: 'Berne',
    code: 'BRN',
    type: 'warehouse',
    address: 'Industriestrasse 5, 3052 Zollikofen',
    phone: '+41 31 456 78 90',
    email: 'berne@matflow.ch',
    manager: 'Sophie Laurent',
    employees: 4,
    articles: 654,
    status: 'active',
    openingHours: 'Lun-Ven 07:00-16:00',
  },
];

const TYPE_CONFIG: Record<string, { variant: 'default' | 'success' | 'info'; label: string }> = {
  headquarters: { variant: 'success', label: 'Siege' },
  branch: { variant: 'info', label: 'Filiale' },
  warehouse: { variant: 'default', label: 'Entrepot' },
};

export default function BranchesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<typeof MOCK_BRANCHES[0] | null>(null);

  const filteredBranches = MOCK_BRANCHES.filter(branch =>
    branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEmployees = MOCK_BRANCHES.reduce((acc, b) => acc + b.employees, 0);
  const totalArticles = MOCK_BRANCHES.reduce((acc, b) => acc + b.articles, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Filiales</h1>
          <p className="text-muted-foreground">Gestion des filiales et entrepots</p>
        </div>
        <Button onClick={() => setShowNewModal(true)}><Plus className="mr-2 h-4 w-4" />Nouvelle filiale</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2"><Building2 className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{MOCK_BRANCHES.length}</p><p className="text-sm text-muted-foreground">Filiales</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2"><Users className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold">{totalEmployees}</p><p className="text-sm text-muted-foreground">Employes</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2"><Package className="h-5 w-5 text-purple-600" /></div>
            <div><p className="text-2xl font-bold">{totalArticles.toLocaleString()}</p><p className="text-sm text-muted-foreground">Articles</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2"><MapPin className="h-5 w-5 text-orange-600" /></div>
            <div><p className="text-2xl font-bold">4</p><p className="text-sm text-muted-foreground">Cantons</p></div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher une filiale..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
      </Card>

      {/* Branches Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredBranches.map((branch) => {
          const typeConfig = TYPE_CONFIG[branch.type] || TYPE_CONFIG.branch;
          return (
            <Card key={branch.id} className="overflow-hidden">
              <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
                    {branch.code}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{branch.name}</h3>
                      <Badge variant={typeConfig.variant}>{typeConfig.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{branch.manager}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setSelectedBranch(branch)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><Settings className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{branch.address}</p>
                  <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{branch.phone}</p>
                  <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" />{branch.email}</p>
                  <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" />{branch.openingHours}</p>
                </div>
                <div className="pt-4 border-t grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{branch.employees}</p>
                    <p className="text-xs text-muted-foreground">Employes</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{branch.articles.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Articles</p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* New Branch Modal */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Nouvelle filiale" size="lg">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Nom de la filiale" required><Input placeholder="Ex: Lausanne" /></FormField>
            <FormField label="Code" required><Input placeholder="Ex: LAU" maxLength={3} /></FormField>
          </div>
          <FormField label="Type" required>
            <Select>
              <option value="">Selectionner...</option>
              <option value="headquarters">Siege</option>
              <option value="branch">Filiale</option>
              <option value="warehouse">Entrepot</option>
            </Select>
          </FormField>
          <FormField label="Adresse" required><Input placeholder="Rue et numero, code postal, ville" /></FormField>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Telephone"><Input placeholder="+41 21 123 45 67" /></FormField>
            <FormField label="Email"><Input type="email" placeholder="filiale@matflow.ch" /></FormField>
          </div>
          <FormField label="Responsable">
            <Select>
              <option value="">Selectionner...</option>
              <option value="1">Marie Dupont</option>
              <option value="2">Jean Martin</option>
            </Select>
          </FormField>
          <FormField label="Horaires d'ouverture"><Input placeholder="Lun-Ven 08:00-17:00" /></FormField>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowNewModal(false)}>Annuler</Button>
            <Button>Creer</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Branch Modal */}
      <Modal isOpen={!!selectedBranch} onClose={() => setSelectedBranch(null)} title={`Modifier ${selectedBranch?.name}`} size="lg">
        {selectedBranch && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Nom de la filiale" required><Input defaultValue={selectedBranch.name} /></FormField>
              <FormField label="Code" required><Input defaultValue={selectedBranch.code} maxLength={3} /></FormField>
            </div>
            <FormField label="Type" required>
              <Select defaultValue={selectedBranch.type}>
                <option value="headquarters">Siege</option>
                <option value="branch">Filiale</option>
                <option value="warehouse">Entrepot</option>
              </Select>
            </FormField>
            <FormField label="Adresse" required><Input defaultValue={selectedBranch.address} /></FormField>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Telephone"><Input defaultValue={selectedBranch.phone} /></FormField>
              <FormField label="Email"><Input type="email" defaultValue={selectedBranch.email} /></FormField>
            </div>
            <FormField label="Responsable"><Input defaultValue={selectedBranch.manager} /></FormField>
            <FormField label="Horaires d'ouverture"><Input defaultValue={selectedBranch.openingHours} /></FormField>
            <div className="flex justify-between pt-4 border-t">
              <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Supprimer</Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedBranch(null)}>Annuler</Button>
                <Button>Enregistrer</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
