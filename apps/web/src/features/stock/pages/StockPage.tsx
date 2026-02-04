import { useState } from 'react';
import {
  Warehouse,
  Search,
  Download,
  Upload,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Package,
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  MoreHorizontal,
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
  Select,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui';

const MOCK_STOCK = [
  { id: '1', code: 'PAR-LED-001', name: 'PAR LED RGBW 18x10W', category: 'Eclairage', location: 'Zone A - Rack 1', total: 24, available: 18, reserved: 4, inUse: 2, minStock: 5 },
  { id: '2', code: 'LYR-SPT-002', name: 'Lyre Spot LED 150W', category: 'Eclairage', location: 'Zone A - Rack 2', total: 12, available: 4, reserved: 6, inUse: 2, minStock: 3 },
  { id: '3', code: 'ENC-ACT-001', name: 'Enceinte Active 15"', category: 'Son', location: 'Zone B - Rack 1', total: 16, available: 12, reserved: 2, inUse: 2, minStock: 4 },
  { id: '4', code: 'CON-NUM-001', name: 'Console numerique 32ch', category: 'Son', location: 'Zone B - Rack 3', total: 2, available: 1, reserved: 1, inUse: 0, minStock: 1 },
  { id: '5', code: 'VID-PRO-001', name: 'Videoprojecteur 10000lm', category: 'Video', location: 'Zone C - Rack 1', total: 4, available: 3, reserved: 1, inUse: 0, minStock: 2 },
  { id: '6', code: 'CAB-XLR-10M', name: 'Cable XLR 10m', category: 'Cablage', location: 'Zone D - Bac 1', total: 100, available: 67, reserved: 20, inUse: 13, minStock: 20 },
  { id: '7', code: 'TRU-ALU-001', name: 'Structure Alu 3m', category: 'Structure', location: 'Zone E - Sol', total: 40, available: 8, reserved: 20, inUse: 12, minStock: 10 },
];

const MOCK_MOVEMENTS = [
  { id: '1', date: '2024-01-15 14:32', type: 'out', article: 'PAR LED RGBW', quantity: 12, reference: 'RES-2024-0289', user: 'Jean Martin' },
  { id: '2', date: '2024-01-15 14:15', type: 'out', article: 'Cable XLR 10m', quantity: 20, reference: 'RES-2024-0289', user: 'Jean Martin' },
  { id: '3', date: '2024-01-15 11:45', type: 'in', article: 'Lyre Spot LED', quantity: 8, reference: 'RET-2024-0088', user: 'Marie Dupont' },
  { id: '4', date: '2024-01-15 10:20', type: 'transfer', article: 'Enceinte Active', quantity: 4, reference: 'TRF-2024-0012', user: 'Pierre Bernard' },
  { id: '5', date: '2024-01-14 16:50', type: 'in', article: 'Structure Alu 3m', quantity: 12, reference: 'RET-2024-0087', user: 'Sophie Laurent' },
  { id: '6', date: '2024-01-14 15:30', type: 'adjustment', article: 'Cable XLR 10m', quantity: -3, reference: 'INV-2024-0005', user: 'Admin' },
];

export default function StockPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalArticles: MOCK_STOCK.reduce((acc, s) => acc + s.total, 0),
    available: MOCK_STOCK.reduce((acc, s) => acc + s.available, 0),
    reserved: MOCK_STOCK.reduce((acc, s) => acc + s.reserved, 0),
    lowStock: MOCK_STOCK.filter(s => s.available <= s.minStock).length,
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'in': return <ArrowDown className="h-4 w-4 text-green-500" />;
      case 'out': return <ArrowUp className="h-4 w-4 text-red-500" />;
      case 'transfer': return <ArrowUpDown className="h-4 w-4 text-blue-500" />;
      default: return <ArrowUpDown className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMovementBadge = (type: string) => {
    const config: Record<string, { variant: 'success' | 'destructive' | 'info' | 'default'; label: string }> = {
      in: { variant: 'success', label: 'Entree' },
      out: { variant: 'destructive', label: 'Sortie' },
      transfer: { variant: 'info', label: 'Transfert' },
      adjustment: { variant: 'default', label: 'Ajustement' },
    };
    const { variant, label } = config[type] || { variant: 'default', label: type };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const filteredStock = MOCK_STOCK.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock</h1>
          <p className="text-muted-foreground">Vue d'ensemble du stock et mouvements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="mr-2 h-4 w-4" />Exporter</Button>
          <Button variant="outline"><Upload className="mr-2 h-4 w-4" />Inventaire</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2"><Package className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{stats.totalArticles}</p><p className="text-sm text-muted-foreground">Total pieces</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2"><TrendingUp className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold">{stats.available}</p><p className="text-sm text-muted-foreground">Disponibles</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2"><TrendingDown className="h-5 w-5 text-orange-600" /></div>
            <div><p className="text-2xl font-bold">{stats.reserved}</p><p className="text-sm text-muted-foreground">Reserves</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2"><AlertTriangle className="h-5 w-5 text-red-600" /></div>
            <div><p className="text-2xl font-bold">{stats.lowStock}</p><p className="text-sm text-muted-foreground">Stock bas</p></div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="movements">Mouvements</TabsTrigger>
          <TabsTrigger value="alerts">Alertes ({stats.lowStock})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
              </div>
              <Select className="w-48">
                <option value="">Toutes categories</option>
                <option value="eclairage">Eclairage</option>
                <option value="son">Son</option>
                <option value="video">Video</option>
              </Select>
              <Select className="w-48">
                <option value="">Tous emplacements</option>
                <option value="zone-a">Zone A</option>
                <option value="zone-b">Zone B</option>
              </Select>
            </div>
          </Card>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead>Categorie</TableHead>
                  <TableHead>Emplacement</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Disponible</TableHead>
                  <TableHead className="text-center">Reserve</TableHead>
                  <TableHead className="text-center">En usage</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStock.map((item) => (
                  <TableRow key={item.id} className={item.available <= item.minStock ? 'bg-red-50' : ''}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.code}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {item.location}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">{item.total}</TableCell>
                    <TableCell className="text-center">
                      <span className={item.available <= item.minStock ? 'text-red-600 font-medium' : 'text-green-600'}>
                        {item.available}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-orange-600">{item.reserved}</TableCell>
                    <TableCell className="text-center text-blue-600">{item.inUse}</TableCell>
                    <TableCell><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Rechercher..." className="pl-9" />
              </div>
              <Select className="w-48">
                <option value="">Tous les types</option>
                <option value="in">Entrees</option>
                <option value="out">Sorties</option>
                <option value="transfer">Transferts</option>
              </Select>
              <Input type="date" className="w-48" />
            </div>
          </Card>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date/Heure</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Article</TableHead>
                  <TableHead className="text-center">Quantite</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Utilisateur</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_MOVEMENTS.map((mov) => (
                  <TableRow key={mov.id}>
                    <TableCell className="text-muted-foreground">{mov.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getMovementIcon(mov.type)}
                        {getMovementBadge(mov.type)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{mov.article}</TableCell>
                    <TableCell className="text-center">
                      <span className={mov.type === 'in' ? 'text-green-600' : mov.type === 'out' ? 'text-red-600' : ''}>
                        {mov.type === 'in' ? '+' : mov.type === 'out' ? '-' : ''}{Math.abs(mov.quantity)}
                      </span>
                    </TableCell>
                    <TableCell><Badge variant="outline">{mov.reference}</Badge></TableCell>
                    <TableCell>{mov.user}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <div className="p-4 border-b bg-red-50">
              <h3 className="font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Articles en stock bas
              </h3>
            </div>
            <div className="divide-y">
              {MOCK_STOCK.filter(s => s.available <= s.minStock).map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.code} - {item.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">{item.available} dispo</p>
                    <p className="text-sm text-muted-foreground">Min: {item.minStock}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
