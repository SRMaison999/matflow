import { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Download,
  Eye,
  Building2,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
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

const MOCK_INVOICES = [
  { id: '1', number: 'FAC-2024-0067', client: 'Festival Montreux Jazz', project: 'Scene Stravinski - Son', quoteRef: 'DEV-2024-0088', createdAt: '2024-01-15', dueDate: '2024-02-15', totalHT: 48500, totalTTC: 52282.50, paidAmount: 52282.50, status: 'paid', paidAt: '2024-01-28' },
  { id: '2', number: 'FAC-2024-0066', client: 'EventPro SA', project: 'Concert Paleo 2024', quoteRef: 'DEV-2024-0089', createdAt: '2024-01-14', dueDate: '2024-02-14', totalHT: 15800, totalTTC: 17016.60, paidAmount: 0, status: 'sent', paidAt: null },
  { id: '3', number: 'FAC-2024-0065', client: 'Pierre Muller', project: 'Mariage Muller-Favre', quoteRef: 'DEV-2024-0084', createdAt: '2024-01-10', dueDate: '2024-02-10', totalHT: 4500, totalTTC: 4851.00, paidAmount: 4851.00, status: 'paid', paidAt: '2024-01-15' },
  { id: '4', number: 'FAC-2024-0064', client: 'Palexpo Geneve', project: 'Congres Medical', quoteRef: 'DEV-2024-0080', createdAt: '2024-01-05', dueDate: '2024-02-05', totalHT: 28900, totalTTC: 31154.20, paidAmount: 15000, status: 'partial', paidAt: null },
  { id: '5', number: 'FAC-2024-0063', client: 'Corporate Events GmbH', project: 'Gala Credit Suisse', quoteRef: 'DEV-2024-0078', createdAt: '2023-12-20', dueDate: '2024-01-20', totalHT: 18400, totalTTC: 19835.20, paidAmount: 0, status: 'overdue', paidAt: null },
  { id: '6', number: 'FAC-2024-0062', client: 'Commune de Nyon', project: 'Marche de Noel', quoteRef: 'DEV-2024-0075', createdAt: '2023-12-15', dueDate: '2024-01-15', totalHT: 12600, totalTTC: 13582.80, paidAmount: 0, status: 'overdue', paidAt: null },
];

const STATUS_CONFIG: Record<string, { variant: 'default' | 'success' | 'warning' | 'destructive' | 'info'; label: string }> = {
  draft: { variant: 'default', label: 'Brouillon' },
  sent: { variant: 'info', label: 'Envoyee' },
  paid: { variant: 'success', label: 'Payee' },
  partial: { variant: 'warning', label: 'Partielle' },
  overdue: { variant: 'destructive', label: 'En retard' },
  cancelled: { variant: 'default', label: 'Annulee' },
};

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const stats = {
    pending: MOCK_INVOICES.filter(i => i.status === 'sent').length,
    overdue: MOCK_INVOICES.filter(i => i.status === 'overdue').length,
    totalPending: MOCK_INVOICES.filter(i => ['sent', 'partial', 'overdue'].includes(i.status)).reduce((acc, i) => acc + (i.totalTTC - i.paidAmount), 0),
    totalPaid: MOCK_INVOICES.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.totalTTC, 0),
  };

  const filteredInvoices = MOCK_INVOICES.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || invoice.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF' }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Factures</h1>
          <p className="text-muted-foreground">Gestion des factures et paiements</p>
        </div>
        <Button onClick={() => setShowNewModal(true)}><Plus className="mr-2 h-4 w-4" />Nouvelle facture</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2"><Send className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{stats.pending}</p><p className="text-sm text-muted-foreground">En attente</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2"><AlertTriangle className="h-5 w-5 text-red-600" /></div>
            <div><p className="text-2xl font-bold">{stats.overdue}</p><p className="text-sm text-muted-foreground">En retard</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2"><Clock className="h-5 w-5 text-orange-600" /></div>
            <div><p className="text-2xl font-bold">{formatCurrency(stats.totalPending)}</p><p className="text-sm text-muted-foreground">A encaisser</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2"><CheckCircle2 className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold">{formatCurrency(stats.totalPaid)}</p><p className="text-sm text-muted-foreground">Encaisse ce mois</p></div>
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
              <TableHead>Facture</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Projet</TableHead>
              <TableHead>Echeance</TableHead>
              <TableHead className="text-right">Montant TTC</TableHead>
              <TableHead className="text-right">Paye</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id} className={invoice.status === 'overdue' ? 'bg-red-50' : ''}>
                <TableCell>
                  <div>
                    <p className="font-medium">{invoice.number}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {invoice.quoteRef}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {invoice.client}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{invoice.project}</TableCell>
                <TableCell>
                  <div>
                    <p className={invoice.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                      {new Date(invoice.dueDate).toLocaleDateString('fr-CH')}
                    </p>
                    {invoice.status === 'overdue' && (
                      <p className="text-xs text-red-600">{getDaysOverdue(invoice.dueDate)} jours de retard</p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(invoice.totalTTC)}</TableCell>
                <TableCell className="text-right">
                  <span className={invoice.paidAmount > 0 ? 'text-green-600' : 'text-muted-foreground'}>
                    {formatCurrency(invoice.paidAmount)}
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" title="Voir"><Eye className="h-4 w-4" /></Button>
                    {invoice.status !== 'paid' && (
                      <Button variant="ghost" size="icon" title="Enregistrer paiement" onClick={() => setShowPaymentModal(true)}>
                        <CreditCard className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" title="Telecharger"><Download className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* New Invoice Modal */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Nouvelle facture" size="lg">
        <div className="space-y-4">
          <FormField label="Creer depuis">
            <Select>
              <option value="quote">Un devis accepte</option>
              <option value="scratch">De zero</option>
            </Select>
          </FormField>
          <FormField label="Devis source" required>
            <Select>
              <option value="">Selectionner un devis...</option>
              <option value="1">DEV-2024-0089 - EventPro SA - Concert Paleo 2024</option>
              <option value="2">DEV-2024-0088 - Festival Montreux Jazz - Scene Stravinski</option>
            </Select>
          </FormField>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Date de facture" required>
              <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </FormField>
            <FormField label="Echeance" required>
              <Input type="date" />
            </FormField>
          </div>
          <FormField label="Reference externe">
            <Input placeholder="Numero de commande client, etc." />
          </FormField>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowNewModal(false)}>Annuler</Button>
            <Button>Creer la facture</Button>
          </div>
        </div>
      </Modal>

      {/* Payment Modal */}
      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Enregistrer un paiement">
        <div className="space-y-4">
          <FormField label="Montant recu" required>
            <Input type="number" placeholder="0.00" step="0.01" />
          </FormField>
          <FormField label="Date du paiement" required>
            <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
          </FormField>
          <FormField label="Mode de paiement" required>
            <Select>
              <option value="bank_transfer">Virement bancaire</option>
              <option value="check">Cheque</option>
              <option value="cash">Especes</option>
              <option value="card">Carte de credit</option>
            </Select>
          </FormField>
          <FormField label="Reference">
            <Input placeholder="Reference du paiement" />
          </FormField>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowPaymentModal(false)}>Annuler</Button>
            <Button>Enregistrer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
