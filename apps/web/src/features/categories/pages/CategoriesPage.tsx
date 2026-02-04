import { useState } from 'react';
import {
  Tags,
  Plus,
  Search,
  FolderTree,
  Edit2,
  Trash2,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  Package,
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

interface Category {
  id: string;
  name: string;
  code: string;
  description: string;
  articlesCount: number;
  color: string;
  children?: Category[];
  expanded?: boolean;
}

const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Eclairage',
    code: 'ECL',
    description: 'Materiel d\'eclairage de scene',
    articlesCount: 245,
    color: '#f59e0b',
    children: [
      { id: '1-1', name: 'Lyres', code: 'ECL-LYR', description: 'Lyres et projecteurs asservis', articlesCount: 48, color: '#f59e0b' },
      { id: '1-2', name: 'PAR', code: 'ECL-PAR', description: 'Projecteurs PAR LED et traditionnels', articlesCount: 86, color: '#f59e0b' },
      { id: '1-3', name: 'Effets', code: 'ECL-EFF', description: 'Machines a fumee, lasers, etc.', articlesCount: 32, color: '#f59e0b' },
      { id: '1-4', name: 'Barres LED', code: 'ECL-BAR', description: 'Barres et rampes LED', articlesCount: 45, color: '#f59e0b' },
    ],
  },
  {
    id: '2',
    name: 'Son',
    code: 'SON',
    description: 'Equipement audio',
    articlesCount: 312,
    color: '#3b82f6',
    children: [
      { id: '2-1', name: 'Enceintes', code: 'SON-ENC', description: 'Enceintes actives et passives', articlesCount: 64, color: '#3b82f6' },
      { id: '2-2', name: 'Consoles', code: 'SON-CON', description: 'Consoles de mixage', articlesCount: 12, color: '#3b82f6' },
      { id: '2-3', name: 'Microphones', code: 'SON-MIC', description: 'Microphones filaires et HF', articlesCount: 156, color: '#3b82f6' },
      { id: '2-4', name: 'Amplification', code: 'SON-AMP', description: 'Amplificateurs et processeurs', articlesCount: 28, color: '#3b82f6' },
    ],
  },
  {
    id: '3',
    name: 'Video',
    code: 'VID',
    description: 'Equipement video et projection',
    articlesCount: 89,
    color: '#8b5cf6',
    children: [
      { id: '3-1', name: 'Projecteurs', code: 'VID-PRO', description: 'Videoprojecteurs', articlesCount: 18, color: '#8b5cf6' },
      { id: '3-2', name: 'Ecrans', code: 'VID-ECR', description: 'Ecrans et toiles de projection', articlesCount: 24, color: '#8b5cf6' },
      { id: '3-3', name: 'LED Walls', code: 'VID-LED', description: 'Murs LED et dalles', articlesCount: 32, color: '#8b5cf6' },
    ],
  },
  {
    id: '4',
    name: 'Structure',
    code: 'STR',
    description: 'Structures et rigging',
    articlesCount: 156,
    color: '#10b981',
    children: [
      { id: '4-1', name: 'Truss', code: 'STR-TRS', description: 'Elements de structure alu', articlesCount: 89, color: '#10b981' },
      { id: '4-2', name: 'Pieds', code: 'STR-PIE', description: 'Pieds et supports', articlesCount: 45, color: '#10b981' },
      { id: '4-3', name: 'Rigging', code: 'STR-RIG', description: 'Materiel de levage', articlesCount: 22, color: '#10b981' },
    ],
  },
  {
    id: '5',
    name: 'Cablage',
    code: 'CAB',
    description: 'Cables et connectique',
    articlesCount: 428,
    color: '#6b7280',
  },
];

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['1', '2']));

  const toggleCategory = (id: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCategories(newExpanded);
  };

  const totalArticles = MOCK_CATEGORIES.reduce((acc, cat) => acc + cat.articlesCount, 0);
  const totalCategories = MOCK_CATEGORIES.reduce((acc, cat) => acc + 1 + (cat.children?.length || 0), 0);

  const renderCategory = (category: Category, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);

    return (
      <div key={category.id}>
        <div
          className={`flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg ${level > 0 ? 'ml-6' : ''}`}
        >
          <div className="flex items-center gap-3">
            {hasChildren ? (
              <button onClick={() => toggleCategory(category.id)} className="p-1 hover:bg-gray-100 rounded">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            ) : (
              <div className="w-6" />
            )}
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{category.name}</span>
                <Badge variant="outline" className="text-xs">{category.code}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-sm font-medium">{category.articlesCount}</span>
              <span className="text-sm text-muted-foreground ml-1">articles</span>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon"><Edit2 className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="border-l-2 border-gray-100 ml-4">
            {category.children!.map(child => renderCategory(child, level + 1))}
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
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Gestion des categories d'articles</p>
        </div>
        <Button onClick={() => setShowNewModal(true)}><Plus className="mr-2 h-4 w-4" />Nouvelle categorie</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2"><Tags className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{totalCategories}</p><p className="text-sm text-muted-foreground">Categories</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2"><FolderTree className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold">{MOCK_CATEGORIES.length}</p><p className="text-sm text-muted-foreground">Categories principales</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2"><Package className="h-5 w-5 text-purple-600" /></div>
            <div><p className="text-2xl font-bold">{totalArticles}</p><p className="text-sm text-muted-foreground">Articles classes</p></div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher une categorie..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
          <Button variant="outline" onClick={() => setExpandedCategories(new Set(MOCK_CATEGORIES.map(c => c.id)))}>
            Tout deployer
          </Button>
          <Button variant="outline" onClick={() => setExpandedCategories(new Set())}>
            Tout replier
          </Button>
        </div>
      </Card>

      {/* Categories Tree */}
      <Card className="p-4">
        <div className="space-y-1">
          {MOCK_CATEGORIES.map(category => renderCategory(category))}
        </div>
      </Card>

      {/* New Category Modal */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Nouvelle categorie">
        <div className="space-y-4">
          <FormField label="Categorie parente">
            <Select>
              <option value="">Aucune (categorie principale)</option>
              {MOCK_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </Select>
          </FormField>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Code" required>
              <Input placeholder="ECL-XXX" />
            </FormField>
            <FormField label="Couleur">
              <Input type="color" defaultValue="#3b82f6" />
            </FormField>
          </div>
          <FormField label="Nom" required>
            <Input placeholder="Nom de la categorie" />
          </FormField>
          <FormField label="Description">
            <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={2} placeholder="Description de la categorie..." />
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
