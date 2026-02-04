import { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Send,
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
  MoreHorizontal,
  Download,
  Eye,
  Building2,
  Calendar,
  DollarSign,
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

const MOCK_QUOTES = [
  { id: '1', number: 'DEV-2024-0089', client: 'EventPro SA', project: 'Concert Paleo 2024', createdAt: '2024-01-15', validUntil: '2024-02-15', totalHT: 15800, totalTTC: 17016.60, status: 'sent', items: 12 },
  { id: '2', number: 'DEV-2024-0088', client: 'Festival Montreux Jazz', project: 'Scene Stravinski - Son', createdAt: '2024-01-14', validUntil: '2024-02-14', totalHT: 48500, totalTTC: 52282.50, status: 'accepted', items: 24 },
  { id: '3', number: 'DEV-2024-0087', client: 'Palexpo Geneve', project: 'Salon Auto 2024', createdAt: '2024-01-12', validUntil: '2024-02-12', totalHT: 34200, totalTTC: 36877.60, status: 'draft', items: 18 },
  { id: '4', number: 'DEV-2024-0086', client: 'Corporate Events GmbH', project: 'Seminaire UBS', createdAt: '2024-01-10', validUntil: '2024-02-10', totalHT: 8900, totalTTC: 9594.20, status: 'rejected', items: 8 },
  { id: '5', number: 'DEV-2024-0085', client: 'Commune de Nyon', project: 'Fete de la Musique', createdAt: '2024-01-08', validUntil: '2024-02-08', totalHT: 22400, totalTTC: 24147.20, status: 'expired', items: 15 },
  { id: '6', number: 'DEV-2024-0084', client: 'Pierre Muller', project: 'Mariage Muller-Favre', createdAt: '2024-01-05', validUntil: '2024-02-05', totalHT: 4500, totalTTC: 4851.00, status: 'accepted', items: 6 },
];

const STATUS_CONFIG: Record<string, { variant: 'default' | 'success' | 'warning' | 'destructive' | 'info'; label: string; icon: typeof Clock }> = {
  draft: { variant: 'default', label: 'Brouillon', icon: FileText },
  sent: { variant: 'info', label: 'Envoye', icon: Send },
  accepted: { variant: 'success', label: 'Accepte', icon: CheckCircle2 },
  rejected: { variant: 'destructive', label: 'Refuse', icon: XCircle },
  expired: { variant: 'warning', label: 'Expire', icon: Clock },
};

export default function QuotesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  const stats = {
    draft: MOCK_QUOTES.filter(q => q.status === 'draft').length,
    sent: MOCK_QUOTES.filter(q => q.status === 'sent').length,
    accepted: MOCK_QUOTES.filter(q => q.status === 'accepted').length,
    totalValue: MOCK_QUOTES.filter(q => q.status === 'accepted').reduce((acc, q) => acc + q.totalHT, 0),
  };

  const filteredQuotes = MOCK_QUOTES.filter(quote => {
    const matchesSearch = quote.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || quote.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF' }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Devis</h1>
          <p className="text-muted-foreground">Gestion des devis et offres commerciales</p>
        </div>
        <Button onClick={() => setShowNewModal(true)}><Plus className="mr-2 h-4 w-4" />Nouveau devis</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-2"><FileText className="h-5 w-5 text-gray-600" /></div>
            <div><p className="text-2xl font-bold">{stats.draft}</p><p className="text-sm text-muted-foreground">Brouillons</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2"><Send className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{stats.sent}</p><p className="text-sm text-muted-foreground">En attente</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2"><CheckCircle2 className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold">{stats.accepted}</p><p className="text-sm text-muted-foreground">Acceptes</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2"><DollarSign className="h-5 w-5 text-purple-600" /></div>
            <div><p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p><p className="text-sm text-muted-foreground">Valeur acceptee</p></div>
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
          <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-48">
            <option value="">Tous les statuts</option>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </Select>
          <Select className="w-48">
            <option value="">Tous les clients</option>
            <option value="eventpro">EventPro SA</option>
            <option value="montreux">Festival Montreux Jazz</option>
            <option value="palexpo">Palexpo Geneve</option>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Devis</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Projet</TableHead>
              <TableHead>Date creation</TableHead>
              <TableHead>Validite</TableHead>
              <TableHead className="text-right">Montant HT</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotes.map((quote) => (
              <TableRow key={quote.id} className={quote.status === 'expired' ? 'bg-orange-50' : ''}>
                <TableCell>
                  <div>
                    <p className="font-medium">{quote.number}</p>
                    <p className="text-sm text-muted-foreground">{quote.items} articles</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {quote.client}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{quote.project}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    {new Date(quote.createdAt).toLocaleDateString('fr-CH')}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={new Date(quote.validUntil) < new Date() ? 'text-red-600' : ''}>
                    {new Date(quote.validUntil).toLocaleDateString('fr-CH')}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(quote.totalHT)}</TableCell>
                <TableCell>{getStatusBadge(quote.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" title="Voir"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" title="Dupliquer"><Copy className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" title="Telecharger"><Download className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* New Quote Modal */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Nouveau devis" size="lg">
        <div className="space-y-4">
          <FormField label="Client" required>
            <Select>
              <option value="">Selectionner un client...</option>
              <option value="1">EventPro SA</option>
              <option value="2">Festival Montreux Jazz</option>
              <option value="3">Palexpo Geneve</option>
              <option value="4">Corporate Events GmbH</option>
            </Select>
          </FormField>
          <FormField label="Projet">
            <Select>
              <option value="">Selectionner un projet existant ou creer...</option>
              <option value="new">+ Nouveau projet</option>
              <option value="1">Concert Paleo 2024</option>
              <option value="2">Salon Auto 2024</option>
            </Select>
          </FormField>
          <FormField label="Titre du devis" required>
            <Input placeholder="ex: Location materiel eclairage" />
          </FormField>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Date de validite" required>
              <Input type="date" />
            </FormField>
            <FormField label="Conditions de paiement">
              <Select>
                <option value="30">30 jours net</option>
                <option value="10">10 jours net</option>
                <option value="immediate">Paiement immediat</option>
              </Select>
            </FormField>
          </div>
          <FormField label="Notes internes">
            <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={2} placeholder="Notes visibles uniquement en interne..." />
          </FormField>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowNewModal(false)}>Annuler</Button>
            <Button>Creer et editer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
