import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  Download,
  Upload,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  QrCode,
  Wrench,
  Grid,
  List,
  SlidersHorizontal,
  ChevronDown,
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
  Checkbox,
  FormField,
} from '@/components/ui';

const MOCK_CATEGORIES = [
  { id: '1', name: 'Eclairage', count: 456 },
  { id: '2', name: 'Son', count: 312 },
  { id: '3', name: 'Video', count: 189 },
  { id: '4', name: 'Structure', count: 234 },
  { id: '5', name: 'Cablage', count: 567 },
];

const MOCK_ARTICLES = [
  { id: '1', code: 'PAR-LED-001', name: 'PAR LED RGBW 18x10W', category: 'Eclairage', status: 'available', location: 'Zone A - Rack 1', quantity: 24, available: 18, price: 25 },
  { id: '2', code: 'LYR-SPT-002', name: 'Lyre Spot LED 150W', category: 'Eclairage', status: 'reserved', location: 'Zone A - Rack 2', quantity: 12, available: 4, price: 75 },
  { id: '3', code: 'ENC-ACT-001', name: 'Enceinte Active 15" 1000W', category: 'Son', status: 'available', location: 'Zone B - Rack 1', quantity: 16, available: 12, price: 50 },
  { id: '4', code: 'CON-NUM-001', name: 'Console numerique 32 canaux', category: 'Son', status: 'in_maintenance', location: 'Zone B - Rack 3', quantity: 2, available: 1, price: 200 },
  { id: '5', code: 'VID-PRO-001', name: 'Videoprojecteur 10000 lumens', category: 'Video', status: 'available', location: 'Zone C - Rack 1', quantity: 4, available: 3, price: 400 },
  { id: '6', code: 'CAB-XLR-10M', name: 'Cable XLR 10m', category: 'Cablage', status: 'available', location: 'Zone D - Bac 1', quantity: 100, available: 67, price: 2 },
  { id: '7', code: 'TRU-ALU-001', name: 'Structure Alu 3m', category: 'Structure', status: 'reserved', location: 'Zone E - Sol', quantity: 40, available: 8, price: 15 },
  { id: '8', code: 'LED-BAR-001', name: 'Barre LED 1m RGBW', category: 'Eclairage', status: 'available', location: 'Zone A - Rack 3', quantity: 30, available: 25, price: 20 },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'available', label: 'Disponible' },
  { value: 'reserved', label: 'Reserve' },
  { value: 'in_use', label: 'En utilisation' },
  { value: 'in_maintenance', label: 'En maintenance' },
];

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'success' | 'warning' | 'info' | 'destructive' | 'default'; label: string }> = {
      available: { variant: 'success', label: 'Disponible' },
      reserved: { variant: 'info', label: 'Reserve' },
      in_use: { variant: 'warning', label: 'En utilisation' },
      in_maintenance: { variant: 'warning', label: 'En maintenance' },
      out_of_service: { variant: 'destructive', label: 'Hors service' },
    };
    const { variant, label } = config[status] || { variant: 'default', label: status };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const filteredArticles = MOCK_ARTICLES.filter((article) => {
    const matchesSearch = article.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || article.category === MOCK_CATEGORIES.find(c => c.id === selectedCategory)?.name;
    const matchesStatus = !selectedStatus || article.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedArticles.length === filteredArticles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(filteredArticles.map(a => a.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedArticles(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Articles</h1>
          <p className="text-muted-foreground">Gerez votre catalogue d'equipements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Upload className="mr-2 h-4 w-4" />Importer</Button>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" />Exporter</Button>
          <Button onClick={() => setShowNewModal(true)}><Plus className="mr-2 h-4 w-4" />Nouvel article</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2"><Package className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">2,847</p><p className="text-sm text-muted-foreground">Articles totaux</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2"><Package className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold">2,156</p><p className="text-sm text-muted-foreground">Disponibles</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2"><Package className="h-5 w-5 text-orange-600" /></div>
            <div><p className="text-2xl font-bold">456</p><p className="text-sm text-muted-foreground">En location</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2"><Wrench className="h-5 w-5 text-red-600" /></div>
            <div><p className="text-2xl font-bold">23</p><p className="text-sm text-muted-foreground">En maintenance</p></div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Rechercher par nom ou code..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
            <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-48">
              {STATUS_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </Select>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="mr-2 h-4 w-4" />Filtres{showFilters && <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant={viewMode === 'table' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('table')}><List className="h-4 w-4" /></Button>
            <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}><Grid className="h-4 w-4" /></Button>
          </div>
        </div>
        {showFilters && (
          <div className="mt-4 pt-4 border-t grid gap-4 md:grid-cols-4">
            <div><label className="text-sm font-medium mb-2 block">Categorie</label>
              <Select value={selectedCategory || ''} onChange={(e) => setSelectedCategory(e.target.value || null)}>
                <option value="">Toutes</option>
                {MOCK_CATEGORIES.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
              </Select>
            </div>
            <div><label className="text-sm font-medium mb-2 block">Emplacement</label>
              <Select><option value="">Tous</option><option value="zone-a">Zone A</option><option value="zone-b">Zone B</option></Select>
            </div>
            <div><label className="text-sm font-medium mb-2 block">Prix/jour</label>
              <div className="flex gap-2"><Input type="number" placeholder="Min" /><Input type="number" placeholder="Max" /></div>
            </div>
            <div><label className="text-sm font-medium mb-2 block">Options</label>
              <div className="flex flex-col gap-2"><Checkbox label="Uniquement disponibles" /><Checkbox label="Maintenance requise" /></div>
            </div>
          </div>
        )}
      </Card>

      {/* Categories Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button variant={!selectedCategory ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCategory(null)}>Tous (2,847)</Button>
        {MOCK_CATEGORIES.map((cat) => (
          <Button key={cat.id} variant={selectedCategory === cat.id ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCategory(cat.id)}>{cat.name} ({cat.count})</Button>
        ))}
      </div>

      {/* Bulk Actions */}
      {selectedArticles.length > 0 && (
        <Card className="p-3 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{selectedArticles.length} article(s) selectionne(s)</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><QrCode className="mr-2 h-4 w-4" />QR</Button>
              <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Exporter</Button>
              <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" />Supprimer</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"><Checkbox checked={selectedArticles.length === filteredArticles.length} onChange={toggleSelectAll} /></TableHead>
                <TableHead>Article</TableHead>
                <TableHead>Categorie</TableHead>
                <TableHead>Emplacement</TableHead>
                <TableHead className="text-center">Disponible</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Prix/jour</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.map((article) => (
                <TableRow key={article.id} className="hover:bg-muted/50">
                  <TableCell><Checkbox checked={selectedArticles.includes(article.id)} onChange={() => toggleSelect(article.id)} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center"><Package className="h-5 w-5 text-muted-foreground" /></div>
                      <div>
                        <Link to={`/articles/${article.id}`} className="font-medium hover:text-primary">{article.name}</Link>
                        <p className="text-sm text-muted-foreground">{article.code}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{article.category}</TableCell>
                  <TableCell className="text-muted-foreground">{article.location}</TableCell>
                  <TableCell className="text-center">
                    <span className={article.available < 5 ? 'text-red-600 font-medium' : ''}>{article.available}</span>
                    <span className="text-muted-foreground">/{article.quantity}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(article.status)}</TableCell>
                  <TableCell className="text-right font-medium">{article.price} CHF</TableCell>
                  <TableCell><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-muted flex items-center justify-center"><Package className="h-12 w-12 text-muted-foreground" /></div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Link to={`/articles/${article.id}`} className="font-medium hover:text-primary">{article.name}</Link>
                    <p className="text-sm text-muted-foreground">{article.code}</p>
                  </div>
                  {getStatusBadge(article.status)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{article.category}</span>
                  <span className="font-medium">{article.price} CHF/jour</span>
                </div>
                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <span className="text-sm">
                    <span className={article.available < 5 ? 'text-red-600 font-medium' : 'text-green-600'}>{article.available}</span>
                    <span className="text-muted-foreground">/{article.quantity} dispo</span>
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Affichage de {filteredArticles.length} sur 2,847 articles</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Precedent</Button>
          <Button variant="outline" size="sm">1</Button>
          <Button variant="default" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">Suivant</Button>
        </div>
      </div>

      {/* New Article Modal */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Nouvel article" size="lg">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Code article" required><Input placeholder="Ex: PAR-LED-001" /></FormField>
            <FormField label="Code-barres"><Input placeholder="Scanner ou saisir" /></FormField>
          </div>
          <FormField label="Nom de l'article" required><Input placeholder="Ex: PAR LED RGBW 18x10W" /></FormField>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Categorie" required>
              <Select><option value="">Selectionner...</option>{MOCK_CATEGORIES.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}</Select>
            </FormField>
            <FormField label="Type">
              <Select><option value="serialized">Serialise</option><option value="batch">Lot</option><option value="consumable">Consommable</option></Select>
            </FormField>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <FormField label="Prix d'achat"><Input type="number" placeholder="0.00" /></FormField>
            <FormField label="Prix location/jour" required><Input type="number" placeholder="0.00" /></FormField>
            <FormField label="Quantite"><Input type="number" placeholder="1" /></FormField>
          </div>
          <FormField label="Description">
            <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={3} placeholder="Description..." />
          </FormField>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowNewModal(false)}>Annuler</Button>
            <Button>Creer l'article</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
