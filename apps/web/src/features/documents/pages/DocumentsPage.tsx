import { useState } from 'react';
import {
  FileArchive,
  Plus,
  Search,
  Download,
  Trash2,
  Eye,
  Upload,
  FileText,
  FileImage,
  FileSpreadsheet,
  File,
  Folder,
  FolderOpen,
  MoreHorizontal,
  Filter,
  Grid,
  List,
  Clock,
  User,
  HardDrive,
} from 'lucide-react';
import {
  Button,
  Card,
  Badge,
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

const MOCK_FOLDERS = [
  { id: '1', name: 'Manuels techniques', count: 45, color: 'bg-blue-500' },
  { id: '2', name: 'Fiches produits', count: 128, color: 'bg-green-500' },
  { id: '3', name: 'Contrats clients', count: 67, color: 'bg-purple-500' },
  { id: '4', name: 'Factures', count: 234, color: 'bg-orange-500' },
  { id: '5', name: 'Certificats', count: 23, color: 'bg-red-500' },
  { id: '6', name: 'Photos materiel', count: 89, color: 'bg-yellow-500' },
];

const MOCK_DOCUMENTS = [
  { id: '1', name: 'Manuel Lyre Spot LED 150W.pdf', type: 'pdf', size: '2.4 MB', folder: 'Manuels techniques', uploadedBy: 'Marie Dupont', uploadedAt: '2024-01-10', articleCode: 'LYR-SPT-002' },
  { id: '2', name: 'Fiche technique PAR LED RGBW.pdf', type: 'pdf', size: '856 KB', folder: 'Fiches produits', uploadedBy: 'Jean Martin', uploadedAt: '2024-01-08', articleCode: 'PAR-LED-001' },
  { id: '3', name: 'Contrat location Montreux Jazz.pdf', type: 'pdf', size: '1.2 MB', folder: 'Contrats clients', uploadedBy: 'Sophie Laurent', uploadedAt: '2024-01-05', clientName: 'Montreux Jazz' },
  { id: '4', name: 'FAC-2024-0089.pdf', type: 'pdf', size: '245 KB', folder: 'Factures', uploadedBy: 'Systeme', uploadedAt: '2024-01-10', clientName: 'Montreux Jazz' },
  { id: '5', name: 'Certificat CE Console 32ch.pdf', type: 'pdf', size: '124 KB', folder: 'Certificats', uploadedBy: 'Pierre Bernard', uploadedAt: '2023-12-15', articleCode: 'CON-NUM-001' },
  { id: '6', name: 'Stock Enceintes Active.xlsx', type: 'excel', size: '567 KB', folder: 'Fiches produits', uploadedBy: 'Jean Martin', uploadedAt: '2024-01-12', articleCode: 'ENC-ACT-001' },
  { id: '7', name: 'Photo Structure Alu.jpg', type: 'image', size: '3.2 MB', folder: 'Photos materiel', uploadedBy: 'Pierre Bernard', uploadedAt: '2024-01-09', articleCode: 'TRU-ALU-001' },
  { id: '8', name: 'Inventaire Q4 2023.xlsx', type: 'excel', size: '1.8 MB', folder: 'Fiches produits', uploadedBy: 'Marie Dupont', uploadedAt: '2024-01-02' },
];

const FILE_ICONS: Record<string, { icon: any; color: string }> = {
  pdf: { icon: FileText, color: 'text-red-500' },
  excel: { icon: FileSpreadsheet, color: 'text-green-500' },
  image: { icon: FileImage, color: 'text-blue-500' },
  default: { icon: File, color: 'text-gray-500' },
};

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<typeof MOCK_DOCUMENTS[0] | null>(null);

  const filteredDocuments = MOCK_DOCUMENTS.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = !selectedFolder || doc.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const totalSize = MOCK_DOCUMENTS.reduce((acc, doc) => {
    const size = parseFloat(doc.size);
    const unit = doc.size.includes('MB') ? 1 : 0.001;
    return acc + size * unit;
  }, 0);

  const getFileIcon = (type: string) => {
    const config = FILE_ICONS[type] || FILE_ICONS.default;
    const Icon = config.icon;
    return <Icon className={`h-5 w-5 ${config.color}`} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Gestion des fichiers et documents</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)}><Upload className="mr-2 h-4 w-4" />Importer</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2"><FileArchive className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{MOCK_DOCUMENTS.length}</p><p className="text-sm text-muted-foreground">Documents</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2"><Folder className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold">{MOCK_FOLDERS.length}</p><p className="text-sm text-muted-foreground">Dossiers</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2"><HardDrive className="h-5 w-5 text-purple-600" /></div>
            <div><p className="text-2xl font-bold">{totalSize.toFixed(1)} MB</p><p className="text-sm text-muted-foreground">Espace utilise</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2"><Clock className="h-5 w-5 text-orange-600" /></div>
            <div><p className="text-2xl font-bold">3</p><p className="text-sm text-muted-foreground">Ajouts ce mois</p></div>
          </div>
        </Card>
      </div>

      {/* Folders */}
      <Card>
        <div className="p-4 border-b font-semibold">Dossiers</div>
        <div className="p-4 grid gap-4 md:grid-cols-6">
          {MOCK_FOLDERS.map((folder) => (
            <div
              key={folder.id}
              onClick={() => setSelectedFolder(selectedFolder === folder.name ? '' : folder.name)}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedFolder === folder.name ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
              }`}
            >
              <div className={`h-10 w-10 rounded-lg ${folder.color} flex items-center justify-center mb-3`}>
                {selectedFolder === folder.name ? (
                  <FolderOpen className="h-5 w-5 text-white" />
                ) : (
                  <Folder className="h-5 w-5 text-white" />
                )}
              </div>
              <p className="font-medium text-sm truncate">{folder.name}</p>
              <p className="text-xs text-muted-foreground">{folder.count} fichiers</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Rechercher un document..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
            <Select value={selectedFolder} onChange={(e) => setSelectedFolder(e.target.value)} className="w-48">
              <option value="">Tous les dossiers</option>
              {MOCK_FOLDERS.map((folder) => (
                <option key={folder.id} value={folder.name}>{folder.name}</option>
              ))}
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}><List className="h-4 w-4" /></Button>
            <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}><Grid className="h-4 w-4" /></Button>
          </div>
        </div>
      </Card>

      {/* Documents */}
      <Card>
        {viewMode === 'list' ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Dossier</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Ajoute par</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.type)}
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        {doc.articleCode && <p className="text-xs text-muted-foreground">Article: {doc.articleCode}</p>}
                        {doc.clientName && <p className="text-xs text-muted-foreground">Client: {doc.clientName}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{doc.folder}</Badge></TableCell>
                  <TableCell>{doc.size}</TableCell>
                  <TableCell>{doc.uploadedBy}</TableCell>
                  <TableCell>{new Date(doc.uploadedAt).toLocaleDateString('fr-CH')}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedDocument(doc); setShowPreviewModal(true); }}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-4 grid gap-4 md:grid-cols-4 lg:grid-cols-6">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="p-4 rounded-lg border hover:bg-muted/50 cursor-pointer" onClick={() => { setSelectedDocument(doc); setShowPreviewModal(true); }}>
                <div className="h-16 flex items-center justify-center mb-3">
                  {getFileIcon(doc.type)}
                </div>
                <p className="font-medium text-sm truncate">{doc.name}</p>
                <p className="text-xs text-muted-foreground">{doc.size}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Upload Modal */}
      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title="Importer des documents">
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="font-medium mb-2">Glissez vos fichiers ici</p>
            <p className="text-sm text-muted-foreground mb-4">ou cliquez pour parcourir</p>
            <Button variant="outline">Choisir des fichiers</Button>
          </div>
          <FormField label="Dossier de destination">
            <Select>
              <option value="">Selectionner un dossier...</option>
              {MOCK_FOLDERS.map((folder) => (
                <option key={folder.id} value={folder.id}>{folder.name}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Lier a un article (optionnel)">
            <Input placeholder="Code article (ex: PAR-LED-001)" />
          </FormField>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>Annuler</Button>
            <Button>Importer</Button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal isOpen={showPreviewModal} onClose={() => setShowPreviewModal(false)} title={selectedDocument?.name || ''} size="lg">
        {selectedDocument && (
          <div className="space-y-4">
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                {getFileIcon(selectedDocument.type)}
                <p className="mt-2 text-sm text-muted-foreground">Apercu non disponible</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Taille</p>
                <p className="font-medium">{selectedDocument.size}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Dossier</p>
                <p className="font-medium">{selectedDocument.folder}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Ajoute par</p>
                <p className="font-medium">{selectedDocument.uploadedBy}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-medium">{new Date(selectedDocument.uploadedAt).toLocaleDateString('fr-CH')}</p>
              </div>
              {selectedDocument.articleCode && (
                <div>
                  <p className="text-muted-foreground">Article lie</p>
                  <p className="font-medium">{selectedDocument.articleCode}</p>
                </div>
              )}
              {selectedDocument.clientName && (
                <div>
                  <p className="text-muted-foreground">Client</p>
                  <p className="font-medium">{selectedDocument.clientName}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline"><Download className="mr-2 h-4 w-4" />Telecharger</Button>
              <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Supprimer</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
