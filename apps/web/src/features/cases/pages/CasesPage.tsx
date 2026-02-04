import { useState } from 'react';
import {
  Archive,
  Plus,
  Search,
  Package,
  MapPin,
  MoreHorizontal,
  QrCode,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Truck,
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

const MOCK_CASES = [
  { id: '1', code: 'CASE-001', name: 'Flight Case Lyres x4', type: 'flight_case', capacity: 4, currentItems: 4, location: 'Zone A - Rack 1', status: 'in_stock', lastUsed: '2024-01-10', weight: 85 },
  { id: '2', code: 'CASE-002', name: 'Rack Console 19"', type: 'rack', capacity: 12, currentItems: 10, location: 'Zone B - Sol', status: 'in_stock', lastUsed: '2024-01-12', weight: 45 },
  { id: '3', code: 'CASE-003', name: 'Flight Case PAR x8', type: 'flight_case', capacity: 8, currentItems: 8, location: 'Zone A - Rack 2', status: 'on_project', lastUsed: '2024-01-15', weight: 62, project: 'Concert Paleo' },
  { id: '4', code: 'CASE-004', name: 'Malle Cables XLR', type: 'trunk', capacity: 50, currentItems: 42, location: 'Zone D - Bac 1', status: 'in_stock', lastUsed: '2024-01-08', weight: 35 },
  { id: '5', code: 'CASE-005', name: 'Flight Case Enceintes x2', type: 'flight_case', capacity: 2, currentItems: 2, location: 'Zone B - Rack 4', status: 'maintenance', lastUsed: '2024-01-05', weight: 95 },
  { id: '6', code: 'CASE-006', name: 'Valise Accessoires', type: 'suitcase', capacity: 20, currentItems: 15, location: 'Zone C - Etagere', status: 'in_stock', lastUsed: '2024-01-14', weight: 18 },
  { id: '7', code: 'CASE-007', name: 'Flight Case Video', type: 'flight_case', capacity: 6, currentItems: 0, location: 'Zone C - Rack 1', status: 'empty', lastUsed: '2024-01-02', weight: 55 },
];

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  flight_case: { label: 'Flight Case', color: 'bg-blue-100 text-blue-700' },
  rack: { label: 'Rack', color: 'bg-purple-100 text-purple-700' },
  trunk: { label: 'Malle', color: 'bg-orange-100 text-orange-700' },
  suitcase: { label: 'Valise', color: 'bg-green-100 text-green-700' },
};

const STATUS_CONFIG: Record<string, { variant: 'default' | 'success' | 'warning' | 'destructive' | 'info'; label: string }> = {
  in_stock: { variant: 'success', label: 'En stock' },
  on_project: { variant: 'info', label: 'En projet' },
  maintenance: { variant: 'warning', label: 'Maintenance' },
  empty: { variant: 'default', label: 'Vide' },
};

export default function CasesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);

  const stats = {
    total: MOCK_CASES.length,
    inStock: MOCK_CASES.filter(c => c.status === 'in_stock').length,
    onProject: MOCK_CASES.filter(c => c.status === 'on_project').length,
    totalWeight: MOCK_CASES.reduce((acc, c) => acc + c.weight, 0),
  };

  const filteredCases = MOCK_CASES.filter(caseItem =>
    caseItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caseItem.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Caisses</h1>
          <p className="text-muted-foreground">Gestion des caisses et conteneurs de transport</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><QrCode className="mr-2 h-4 w-4" />Scanner</Button>
          <Button onClick={() => setShowNewModal(true)}><Plus className="mr-2 h-4 w-4" />Nouvelle caisse</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2"><Archive className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm text-muted-foreground">Total caisses</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2"><CheckCircle2 className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold">{stats.inStock}</p><p className="text-sm text-muted-foreground">En stock</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2"><Truck className="h-5 w-5 text-purple-600" /></div>
            <div><p className="text-2xl font-bold">{stats.onProject}</p><p className="text-sm text-muted-foreground">En projet</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2"><Package className="h-5 w-5 text-orange-600" /></div>
            <div><p className="text-2xl font-bold">{stats.totalWeight} kg</p><p className="text-sm text-muted-foreground">Poids total</p></div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher une caisse..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
          <Select className="w-48">
            <option value="">Tous types</option>
            {Object.entries(TYPE_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </Select>
          <Select className="w-48">
            <option value="">Tous statuts</option>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </Select>
          <Select className="w-48">
            <option value="">Tous emplacements</option>
            <option value="zone-a">Zone A</option>
            <option value="zone-b">Zone B</option>
            <option value="zone-c">Zone C</option>
            <option value="zone-d">Zone D</option>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Caisse</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Contenu</TableHead>
              <TableHead>Emplacement</TableHead>
              <TableHead>Poids</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCases.map((caseItem) => (
              <TableRow key={caseItem.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{caseItem.name}</p>
                    <p className="text-sm text-muted-foreground">{caseItem.code}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${TYPE_CONFIG[caseItem.type]?.color || ''}`}>
                    {TYPE_CONFIG[caseItem.type]?.label || caseItem.type}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${caseItem.currentItems === 0 ? 'bg-gray-300' : caseItem.currentItems >= caseItem.capacity ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${(caseItem.currentItems / caseItem.capacity) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">{caseItem.currentItems}/{caseItem.capacity}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="h-3 w-3" />
                    {caseItem.location}
                  </div>
                </TableCell>
                <TableCell>{caseItem.weight} kg</TableCell>
                <TableCell>
                  <div>
                    <Badge variant={STATUS_CONFIG[caseItem.status]?.variant || 'default'}>
                      {STATUS_CONFIG[caseItem.status]?.label || caseItem.status}
                    </Badge>
                    {caseItem.project && (
                      <p className="text-xs text-muted-foreground mt-1">{caseItem.project}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" title="Voir contenu" onClick={() => setShowContentModal(true)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Plus"><MoreHorizontal className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* New Case Modal */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Nouvelle caisse" size="lg">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Code" required><Input placeholder="CASE-XXX" /></FormField>
            <FormField label="Type" required>
              <Select>
                <option value="">Selectionner...</option>
                {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </Select>
            </FormField>
          </div>
          <FormField label="Nom" required>
            <Input placeholder="Nom descriptif de la caisse" />
          </FormField>
          <div className="grid gap-4 md:grid-cols-3">
            <FormField label="Capacite" required>
              <Input type="number" placeholder="0" />
            </FormField>
            <FormField label="Poids a vide (kg)">
              <Input type="number" placeholder="0" />
            </FormField>
            <FormField label="Emplacement">
              <Select>
                <option value="">Selectionner...</option>
                <option value="zone-a">Zone A</option>
                <option value="zone-b">Zone B</option>
                <option value="zone-c">Zone C</option>
                <option value="zone-d">Zone D</option>
              </Select>
            </FormField>
          </div>
          <FormField label="Dimensions (LxlxH cm)">
            <div className="grid grid-cols-3 gap-2">
              <Input type="number" placeholder="Longueur" />
              <Input type="number" placeholder="Largeur" />
              <Input type="number" placeholder="Hauteur" />
            </div>
          </FormField>
          <FormField label="Notes">
            <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={2} placeholder="Notes ou remarques..." />
          </FormField>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowNewModal(false)}>Annuler</Button>
            <Button>Creer la caisse</Button>
          </div>
        </div>
      </Modal>

      {/* Content Modal */}
      <Modal isOpen={showContentModal} onClose={() => setShowContentModal(false)} title="Contenu de la caisse">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Flight Case Lyres x4</p>
              <p className="text-sm text-muted-foreground">CASE-001 - Zone A - Rack 1</p>
            </div>
            <Badge variant="success">4/4</Badge>
          </div>
          <div className="border rounded-lg divide-y">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span>Lyre Spot LED 150W - LYR-SPT-001</span>
              </div>
              <Badge variant="outline">x1</Badge>
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span>Lyre Spot LED 150W - LYR-SPT-002</span>
              </div>
              <Badge variant="outline">x1</Badge>
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span>Lyre Spot LED 150W - LYR-SPT-003</span>
              </div>
              <Badge variant="outline">x1</Badge>
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span>Lyre Spot LED 150W - LYR-SPT-004</span>
              </div>
              <Badge variant="outline">x1</Badge>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowContentModal(false)}>Fermer</Button>
            <Button>Modifier contenu</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
