import { useState } from 'react';
import {
  MapPin,
  Plus,
  Search,
  Warehouse,
  Package,
  Edit2,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import {
  Button,
  Input,
  Card,
  Badge,
  Modal,
  Select,
  FormField,
} from '@/components/ui';

interface Location {
  id: string;
  name: string;
  code: string;
  type: 'zone' | 'rack' | 'shelf' | 'bin';
  capacity: number;
  used: number;
  articlesCount: number;
  children?: Location[];
}

const MOCK_LOCATIONS: Location[] = [
  {
    id: '1',
    name: 'Zone A - Eclairage',
    code: 'A',
    type: 'zone',
    capacity: 500,
    used: 342,
    articlesCount: 245,
    children: [
      {
        id: '1-1', name: 'Rack 1', code: 'A-R1', type: 'rack', capacity: 100, used: 85, articlesCount: 48,
        children: [
          { id: '1-1-1', name: 'Etagere 1', code: 'A-R1-E1', type: 'shelf', capacity: 25, used: 22, articlesCount: 12 },
          { id: '1-1-2', name: 'Etagere 2', code: 'A-R1-E2', type: 'shelf', capacity: 25, used: 20, articlesCount: 15 },
          { id: '1-1-3', name: 'Etagere 3', code: 'A-R1-E3', type: 'shelf', capacity: 25, used: 23, articlesCount: 11 },
          { id: '1-1-4', name: 'Etagere 4', code: 'A-R1-E4', type: 'shelf', capacity: 25, used: 20, articlesCount: 10 },
        ]
      },
      { id: '1-2', name: 'Rack 2', code: 'A-R2', type: 'rack', capacity: 100, used: 78, articlesCount: 52 },
      { id: '1-3', name: 'Rack 3', code: 'A-R3', type: 'rack', capacity: 100, used: 92, articlesCount: 65 },
      { id: '1-4', name: 'Sol', code: 'A-SOL', type: 'bin', capacity: 200, used: 87, articlesCount: 80 },
    ],
  },
  {
    id: '2',
    name: 'Zone B - Son',
    code: 'B',
    type: 'zone',
    capacity: 400,
    used: 312,
    articlesCount: 312,
    children: [
      { id: '2-1', name: 'Rack 1', code: 'B-R1', type: 'rack', capacity: 80, used: 72, articlesCount: 45 },
      { id: '2-2', name: 'Rack 2', code: 'B-R2', type: 'rack', capacity: 80, used: 65, articlesCount: 38 },
      { id: '2-3', name: 'Rack 3', code: 'B-R3', type: 'rack', capacity: 80, used: 78, articlesCount: 52 },
      { id: '2-4', name: 'Sol', code: 'B-SOL', type: 'bin', capacity: 160, used: 97, articlesCount: 177 },
    ],
  },
  {
    id: '3',
    name: 'Zone C - Video',
    code: 'C',
    type: 'zone',
    capacity: 200,
    used: 156,
    articlesCount: 89,
  },
  {
    id: '4',
    name: 'Zone D - Cablage',
    code: 'D',
    type: 'zone',
    capacity: 300,
    used: 245,
    articlesCount: 428,
  },
  {
    id: '5',
    name: 'Zone E - Structure',
    code: 'E',
    type: 'zone',
    capacity: 600,
    used: 420,
    articlesCount: 156,
  },
];

const TYPE_CONFIG: Record<string, { label: string; icon: typeof Warehouse }> = {
  zone: { label: 'Zone', icon: Warehouse },
  rack: { label: 'Rack', icon: Package },
  shelf: { label: 'Etagere', icon: Package },
  bin: { label: 'Emplacement', icon: MapPin },
};

export default function LocationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [expandedLocations, setExpandedLocations] = useState<Set<string>>(new Set(['1']));

  const toggleLocation = (id: string) => {
    const newExpanded = new Set(expandedLocations);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedLocations(newExpanded);
  };

  const totalCapacity = MOCK_LOCATIONS.reduce((acc, loc) => acc + loc.capacity, 0);
  const totalUsed = MOCK_LOCATIONS.reduce((acc, loc) => acc + loc.used, 0);
  const usagePercentage = Math.round((totalUsed / totalCapacity) * 100);

  const getUsageColor = (used: number, capacity: number) => {
    const percentage = (used / capacity) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const renderLocation = (location: Location, level: number = 0) => {
    const hasChildren = location.children && location.children.length > 0;
    const isExpanded = expandedLocations.has(location.id);
    const usagePercent = Math.round((location.used / location.capacity) * 100);

    return (
      <div key={location.id}>
        <div
          className={`flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg ${level > 0 ? 'ml-6' : ''}`}
        >
          <div className="flex items-center gap-3">
            {hasChildren ? (
              <button onClick={() => toggleLocation(location.id)} className="p-1 hover:bg-gray-100 rounded">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            ) : (
              <div className="w-6" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{location.name}</span>
                <Badge variant="outline" className="text-xs">{location.code}</Badge>
                <span className="text-xs text-muted-foreground">{TYPE_CONFIG[location.type]?.label}</span>
              </div>
              <p className="text-sm text-muted-foreground">{location.articlesCount} articles</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>{location.used}/{location.capacity}</span>
                <span className={usagePercent >= 90 ? 'text-red-600' : ''}>{usagePercent}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${getUsageColor(location.used, location.capacity)}`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon"><Edit2 className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="border-l-2 border-gray-100 ml-4">
            {location.children!.map(child => renderLocation(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Emplacements</h1>
          <p className="text-muted-foreground">Gestion des emplacements de stockage</p>
        </div>
        <Button onClick={() => setShowNewModal(true)}><Plus className="mr-2 h-4 w-4" />Nouvel emplacement</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2"><Warehouse className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{MOCK_LOCATIONS.length}</p><p className="text-sm text-muted-foreground">Zones</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2"><Package className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold">{totalCapacity}</p><p className="text-sm text-muted-foreground">Capacite totale</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${usagePercentage >= 80 ? 'bg-orange-100' : 'bg-purple-100'}`}>
              <MapPin className={`h-5 w-5 ${usagePercentage >= 80 ? 'text-orange-600' : 'text-purple-600'}`} />
            </div>
            <div><p className="text-2xl font-bold">{usagePercentage}%</p><p className="text-sm text-muted-foreground">Taux occupation</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2"><AlertTriangle className="h-5 w-5 text-red-600" /></div>
            <div><p className="text-2xl font-bold">2</p><p className="text-sm text-muted-foreground">Zones pleines</p></div>
          </div>
        </Card>
      </div>

      {/* Overall capacity bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Capacite globale</span>
          <span className="text-sm text-muted-foreground">{totalUsed} / {totalCapacity} emplacements utilises</span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${getUsageColor(totalUsed, totalCapacity)}`}
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
      </Card>

      {/* Search */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher un emplacement..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
          <Select className="w-48">
            <option value="">Tous types</option>
            {Object.entries(TYPE_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </Select>
          <Button variant="outline" onClick={() => setExpandedLocations(new Set(MOCK_LOCATIONS.map(l => l.id)))}>
            Tout deployer
          </Button>
          <Button variant="outline" onClick={() => setExpandedLocations(new Set())}>
            Tout replier
          </Button>
        </div>
      </Card>

      {/* Locations Tree */}
      <Card className="p-4">
        <div className="space-y-1">
          {MOCK_LOCATIONS.map(location => renderLocation(location))}
        </div>
      </Card>

      {/* New Location Modal */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Nouvel emplacement">
        <div className="space-y-4">
          <FormField label="Emplacement parent">
            <Select>
              <option value="">Aucun (zone principale)</option>
              {MOCK_LOCATIONS.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </Select>
          </FormField>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Code" required>
              <Input placeholder="A-R1-E1" />
            </FormField>
            <FormField label="Type" required>
              <Select>
                {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </Select>
            </FormField>
          </div>
          <FormField label="Nom" required>
            <Input placeholder="Nom de l'emplacement" />
          </FormField>
          <FormField label="Capacite" required>
            <Input type="number" placeholder="Nombre d'articles max" />
          </FormField>
          <FormField label="Notes">
            <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={2} placeholder="Notes ou remarques..." />
          </FormField>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowNewModal(false)}>Annuler</Button>
            <Button>Creer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
