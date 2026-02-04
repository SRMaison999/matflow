import { useState } from 'react';
import {
  Receipt,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
} from 'lucide-react';
import {
  Button,
  Card,
  Badge,
  Select,
} from '@/components/ui';

const MOCK_MONTHLY_DATA = [
  { month: 'Jan', revenue: 89500, invoiced: 95000, paid: 82000 },
  { month: 'Fev', revenue: 76200, invoiced: 78000, paid: 71000 },
  { month: 'Mar', revenue: 102300, invoiced: 110000, paid: 98000 },
  { month: 'Avr', revenue: 94800, invoiced: 98000, paid: 89000 },
  { month: 'Mai', revenue: 118500, invoiced: 125000, paid: 112000 },
  { month: 'Juin', revenue: 134200, invoiced: 140000, paid: 128000 },
];

const MOCK_TOP_CLIENTS = [
  { name: 'Festival Montreux Jazz', revenue: 485200, percentage: 28 },
  { name: 'Palexpo Geneve', revenue: 234500, percentage: 14 },
  { name: 'EventPro SA', revenue: 156800, percentage: 9 },
  { name: 'Corporate Events GmbH', revenue: 89600, percentage: 5 },
  { name: 'Commune de Nyon', revenue: 67800, percentage: 4 },
];

const MOCK_PENDING_INVOICES = [
  { number: 'FAC-2024-0066', client: 'EventPro SA', amount: 17016.60, dueDate: '2024-02-14', daysLeft: 30 },
  { number: 'FAC-2024-0064', client: 'Palexpo Geneve', amount: 16154.20, dueDate: '2024-02-05', daysLeft: 21 },
  { number: 'FAC-2024-0063', client: 'Corporate Events GmbH', amount: 19835.20, dueDate: '2024-01-20', daysLeft: -15 },
  { number: 'FAC-2024-0062', client: 'Commune de Nyon', amount: 13582.80, dueDate: '2024-01-15', daysLeft: -20 },
];

export default function BillingPage() {
  const [period, setPeriod] = useState('month');

  const stats = {
    totalRevenue: 615500,
    revenueChange: 12.5,
    pendingInvoices: 66588.80,
    overdueInvoices: 33418.00,
    activeClients: 24,
    avgInvoice: 18650,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF' }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Facturation</h1>
          <p className="text-muted-foreground">Vue d'ensemble financiere</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-40">
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette annee</option>
          </Select>
          <Button variant="outline"><BarChart3 className="mr-2 h-4 w-4" />Rapports</Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Chiffre d'affaires</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <ArrowUpRight className="h-4 w-4" />
                <span>+{stats.revenueChange}%</span>
              </div>
            </div>
            <div className="rounded-lg bg-green-100 p-3"><TrendingUp className="h-6 w-6 text-green-600" /></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">A encaisser</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.pendingInvoices)}</p>
              <p className="text-sm text-muted-foreground">4 factures</p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3"><Receipt className="h-6 w-6 text-blue-600" /></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">En retard</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.overdueInvoices)}</p>
              <p className="text-sm text-red-600">2 factures</p>
            </div>
            <div className="rounded-lg bg-red-100 p-3"><TrendingDown className="h-6 w-6 text-red-600" /></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Facture moyenne</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.avgInvoice)}</p>
              <p className="text-sm text-muted-foreground">{stats.activeClients} clients actifs</p>
            </div>
            <div className="rounded-lg bg-purple-100 p-3"><DollarSign className="h-6 w-6 text-purple-600" /></div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart Placeholder */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Evolution du CA</h3>
            <Badge variant="outline">6 derniers mois</Badge>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {MOCK_MONTHLY_DATA.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col gap-1">
                  <div
                    className="w-full bg-green-500 rounded-t"
                    style={{ height: `${(data.paid / 140000) * 200}px` }}
                    title={`Paye: ${formatCurrency(data.paid)}`}
                  />
                  <div
                    className="w-full bg-blue-300 rounded-b"
                    style={{ height: `${((data.invoiced - data.paid) / 140000) * 200}px` }}
                    title={`En attente: ${formatCurrency(data.invoiced - data.paid)}`}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span className="text-sm text-muted-foreground">Encaisse</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-300" />
              <span className="text-sm text-muted-foreground">En attente</span>
            </div>
          </div>
        </Card>

        {/* Top Clients */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Top clients</h3>
            <Button variant="ghost" size="sm">Voir tous</Button>
          </div>
          <div className="space-y-4">
            {MOCK_TOP_CLIENTS.map((client, index) => (
              <div key={client.name} className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{client.name}</span>
                    <span className="font-medium">{formatCurrency(client.revenue)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${client.percentage * 3}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">{client.percentage}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Invoices */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Factures en attente</h3>
            <Button variant="ghost" size="sm">Voir toutes</Button>
          </div>
          <div className="space-y-3">
            {MOCK_PENDING_INVOICES.map((invoice) => (
              <div key={invoice.number} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <p className="font-medium">{invoice.number}</p>
                  <p className="text-sm text-muted-foreground">{invoice.client}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                  <p className={`text-sm ${invoice.daysLeft < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                    {invoice.daysLeft < 0 ? `${Math.abs(invoice.daysLeft)}j de retard` : `${invoice.daysLeft}j restants`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Actions rapides</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <FileText className="h-6 w-6" />
              <span>Nouveau devis</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <Receipt className="h-6 w-6" />
              <span>Nouvelle facture</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <Users className="h-6 w-6" />
              <span>Nouveau client</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <Calendar className="h-6 w-6" />
              <span>Rappels</span>
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium mb-3">Statistiques</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-gray-50">
                <p className="text-2xl font-bold">87%</p>
                <p className="text-sm text-muted-foreground">Taux de conversion devis</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-gray-50">
                <p className="text-2xl font-bold">23j</p>
                <p className="text-sm text-muted-foreground">Delai paiement moyen</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
