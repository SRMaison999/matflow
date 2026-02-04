import { useState } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Package,
  MoreHorizontal,
  Copy,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
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

const MOCK_KITS = [
  { id: '1', code: 'KIT-SON-001', name: 'Kit Son Concert 500p', category: 'Son', items: 24, totalValue: 45600, status: 'complete', usageCount: 45, description: 'Configuration complete pour concert jusqu\'a 500 personnes' },
  { id: '2', code: 'KIT-LUM-001', name: 'Kit Eclairage Scene', category: 'Eclairage', items: 36, totalValue: 28400, status: 'complete', usageCount: 62, description: 'Eclairage scene standard avec lyres et PAR' },
  { id: '3', code: 'KIT-VID-001', name: 'Kit Video Conference', category: 'Video', items: 12, totalValue: 52000, status: 'incomplete', usageCount: 18, description: 'Equipement video pour conference corporate' },
  { id: '4', code: 'KIT-DJ-001', name: 'Kit DJ Basique', category: 'Son', items: 8, totalValue: 8500, status: 'complete', usageCount: 89, description: 'Configuration DJ pour petits evenements' },
  { id: '5', code: 'KIT-STR-001', name: 'Kit Structure 6x4m', category: 'Structure', items: 18, totalValue: 12800, status: 'complete', usageCount: 34, description: 'Structure scene 6x4 metres avec toit' },
  { id: '6', code: 'KIT-MAR-001', name: 'Kit Mariage Premium', category: 'Mixte', items: 42, totalValue: 35200, status: 'incomplete', usageCount: 28, description: 'Pack complet son, lumiere et deco pour mariage' },
];

const MOCK_KIT_ITEMS = [
  { id: '1', code: 'PAR-LED-001', name: 'PAR LED RGBW 18x10W', quantity: 12 },
  { id: '2', code: 'LYR-SPT-001', name: 'Lyre Spot LED 150W', quantity: 8 },
  { id: '3', code: 'CON-DMX-001', name: 'Console DMX 24ch', quantity: 1 },
  { id: '4', code: 'CAB-DMX-10M', name: 'Cable DMX 10m', quantity: 10 },
  { id: '5', code: 'PIE-LUM-001', name: 'Pied lumiere 3m', quantity: 4 },
  { id: '6', code: 'ALI-LED-001', name: 'Alimentation LED', quantity: 2 },
];

export default function KitsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedKit, setSelectedKit] = useState<typeof MOCK_KITS[0] | null>(null);

  const stats = {
    total: MOCK_KITS.length,
    complete: MOCK_KITS.filter(k => k.status === 'complete').length,
    totalValue: MOCK_KITS.reduce((acc, k) => acc + k.totalValue, 0),
    avgItems: Math.round(MOCK_KITS.reduce((acc, k) => acc + k.items, 0) / MOCK_KITS.length),
  };

  const filteredKits = MOCK_KITS.filter(kit =>
    kit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kit.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF' }).format(amount);
  };

  const openKitDetail = (kit: typeof MOCK_KITS[0]) => {
    setSelectedKit(kit);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kits</h1>
          <p className="text-muted-foreground">Gestion des kits et assemblages predefinis</p>
        </div>
        <Button onClick={() => setShowNewModal(true)}><Plus className="mr-2 h-4 w-4" />Nouveau kit</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2"><Boxes className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm text-muted-foreground">Total kits</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2"><CheckCircle2 className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold">{stats.complete}</p><p className="text-sm text-muted-foreground">Complets</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2"><Package className="h-5 w-5 text-purple-600" /></div>
            <div><p className="text-2xl font-bold">{stats.avgItems}</p><p className="text-sm text-muted-foreground">Articles/kit moyen</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2"><Boxes className="h-5 w-5 text-orange-600" /></div>
            <div><p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p><p className="text-sm text-muted-foreground">Valeur totale</p></div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher un kit..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
          <Select className="w-48">
            <option value="">Toutes categories</option>
            <option value="son">Son</option>
            <option value="eclairage">Eclairage</option>
            <option value="video">Video</option>
            <option value="structure">Structure</option>
          </Select>
          <Select className="w-48">
            <option value="">Tous statuts</option>
            <option value="complete">Complet</option>
            <option value="incomplete">Incomplet</option>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kit</TableHead>
              <TableHead>Categorie</TableHead>
              <TableHead className="text-center">Articles</TableHead>
              <TableHead className="text-right">Valeur</TableHead>
              <TableHead className="text-center">Utilisations</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredKits.map((kit) => (
              <TableRow key={kit.id} className="cursor-pointer hover:bg-gray-50" onClick={() => openKitDetail(kit)}>
                <TableCell>
                  <div>
                    <p className="font-medium">{kit.name}</p>
                    <p className="text-sm text-muted-foreground">{kit.code}</p>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{kit.category}</Badge></TableCell>
                <TableCell className="text-center">{kit.items}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(kit.totalValue)}</TableCell>
                <TableCell className="text-center">{kit.usageCount}x</TableCell>
                <TableCell>
                  <Badge variant={kit.status === 'complete' ? 'success' : 'warning'}>
                    {kit.status === 'complete' ? 'Complet' : 'Incomplet'}
                  </Badge>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" title="Dupliquer"><Copy className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" title="Plus"><MoreHorizontal className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* New Kit Modal */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Nouveau kit" size="lg">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Code" required><Input placeholder="KIT-XXX-001" /></FormField>
            <FormField label="Categorie" required>
              <Select>
                <option value="">Selectionner...</option>
                <option value="son">Son</option>
                <option value="eclairage">Eclairage</option>
                <option value="video">Video</option>
                <option value="structure">Structure</option>
                <option value="mixte">Mixte</option>
              </Select>
            </FormField>
          </div>
          <FormField label="Nom du kit" required>
            <Input placeholder="Nom descriptif du kit" />
          </FormField>
          <FormField label="Description">
            <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={3} placeholder="Description du kit et son utilisation..." />
          </FormField>
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Articles du kit</h4>
              <Button variant="outline" size="sm"><Plus className="mr-2 h-3 w-3" />Ajouter article</Button>
            </div>
            <p className="text-sm text-muted-foreground">Aucun article ajoute. Utilisez le bouton ci-dessus pour composer le kit.</p>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowNewModal(false)}>Annuler</Button>
            <Button>Creer le kit</Button>
          </div>
        </div>
      </Modal>

      {/* Kit Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={selectedKit?.name || 'Detail du kit'} size="lg">
        {selectedKit && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">{selectedKit.code}</p>
                <p className="text-sm mt-1">{selectedKit.description}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{formatCurrency(selectedKit.totalValue)}</p>
                <Badge variant={selectedKit.status === 'complete' ? 'success' : 'warning'}>
                  {selectedKit.status === 'complete' ? 'Complet' : 'Incomplet'}
                </Badge>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Articles ({MOCK_KIT_ITEMS.length})</h4>
                <Button variant="outline" size="sm"><Edit2 className="mr-2 h-3 w-3" />Modifier</Button>
              </div>
              <div className="border rounded-lg divide-y">
                {MOCK_KIT_ITEMS.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.code}</p>
                      </div>
                    </div>
                    <Badge variant="outline">x{item.quantity}</Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Supprimer</Button>
              <div className="flex gap-2">
                <Button variant="outline"><Copy className="mr-2 h-4 w-4" />Dupliquer</Button>
                <Button>Utiliser dans reservation</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
