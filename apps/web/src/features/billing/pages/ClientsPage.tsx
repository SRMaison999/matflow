import { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  MoreHorizontal,
  FileText,
  Receipt,
  TrendingUp,
  Star,
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
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui';

const MOCK_CLIENTS = [
  { id: '1', type: 'company', name: 'EventPro SA', contact: 'Marie Dupont', email: 'contact@eventpro.ch', phone: '+41 22 123 45 67', address: 'Rue du Lac 15, 1201 Geneve', totalRevenue: 156800, projectsCount: 12, status: 'active', rating: 5 },
  { id: '2', type: 'company', name: 'Festival Montreux Jazz', contact: 'Jean Rochat', email: 'technique@montreuxjazz.ch', phone: '+41 21 966 44 44', address: 'Avenue Claude-Nobs 5, 1820 Montreux', totalRevenue: 485200, projectsCount: 8, status: 'active', rating: 5 },
  { id: '3', type: 'company', name: 'Palexpo Geneve', contact: 'Sophie Martin', email: 'events@palexpo.ch', phone: '+41 22 761 11 11', address: 'Route Francois-Peyrot 30, 1218 Grand-Saconnex', totalRevenue: 234500, projectsCount: 15, status: 'active', rating: 4 },
  { id: '4', type: 'individual', name: 'Pierre Muller', contact: 'Pierre Muller', email: 'pierre.muller@gmail.com', phone: '+41 79 345 67 89', address: 'Chemin des Vignes 8, 1006 Lausanne', totalRevenue: 12400, projectsCount: 3, status: 'active', rating: 4 },
  { id: '5', type: 'company', name: 'Corporate Events GmbH', contact: 'Hans Weber', email: 'info@corporate-events.ch', phone: '+41 44 567 89 00', address: 'Bahnhofstrasse 42, 8001 Zurich', totalRevenue: 89600, projectsCount: 6, status: 'inactive', rating: 3 },
  { id: '6', type: 'company', name: 'Commune de Nyon', contact: 'Claire Bonnet', email: 'culture@nyon.ch', phone: '+41 22 316 40 00', address: 'Place du Chateau 3, 1260 Nyon', totalRevenue: 67800, projectsCount: 9, status: 'active', rating: 5 },
];

const MOCK_CONTACTS = [
  { id: '1', name: 'Marie Dupont', company: 'EventPro SA', role: 'Directrice technique', email: 'marie.dupont@eventpro.ch', phone: '+41 79 123 45 67', isPrimary: true },
  { id: '2', name: 'Lucas Bernard', company: 'EventPro SA', role: 'Chef de projet', email: 'lucas.bernard@eventpro.ch', phone: '+41 79 234 56 78', isPrimary: false },
  { id: '3', name: 'Jean Rochat', company: 'Festival Montreux Jazz', role: 'Directeur technique', email: 'jean.rochat@montreuxjazz.ch', phone: '+41 79 345 67 89', isPrimary: true },
  { id: '4', name: 'Sophie Martin', company: 'Palexpo Geneve', role: 'Responsable evenements', email: 'sophie.martin@palexpo.ch', phone: '+41 79 456 78 90', isPrimary: true },
  { id: '5', name: 'Emma Favre', company: 'Palexpo Geneve', role: 'Coordinatrice', email: 'emma.favre@palexpo.ch', phone: '+41 79 567 89 01', isPrimary: false },
];

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('clients');
  const [showNewModal, setShowNewModal] = useState(false);
  const [clientType, setClientType] = useState('company');

  const stats = {
    totalClients: MOCK_CLIENTS.length,
    activeClients: MOCK_CLIENTS.filter(c => c.status === 'active').length,
    totalRevenue: MOCK_CLIENTS.reduce((acc, c) => acc + c.totalRevenue, 0),
    avgRevenue: Math.round(MOCK_CLIENTS.reduce((acc, c) => acc + c.totalRevenue, 0) / MOCK_CLIENTS.length),
  };

  const filteredClients = MOCK_CLIENTS.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF' }).format(amount);
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground">Gestion des clients et contacts</p>
        </div>
        <Button onClick={() => setShowNewModal(true)}><Plus className="mr-2 h-4 w-4" />Nouveau client</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2"><Users className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{stats.totalClients}</p><p className="text-sm text-muted-foreground">Total clients</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2"><User className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold">{stats.activeClients}</p><p className="text-sm text-muted-foreground">Clients actifs</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2"><TrendingUp className="h-5 w-5 text-purple-600" /></div>
            <div><p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p><p className="text-sm text-muted-foreground">CA total</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2"><Receipt className="h-5 w-5 text-orange-600" /></div>
            <div><p className="text-2xl font-bold">{formatCurrency(stats.avgRevenue)}</p><p className="text-sm text-muted-foreground">CA moyen/client</p></div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="clients">Clients ({MOCK_CLIENTS.length})</TabsTrigger>
          <TabsTrigger value="contacts">Contacts ({MOCK_CONTACTS.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4">
          <Card className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
              </div>
              <Select className="w-48">
                <option value="">Tous types</option>
                <option value="company">Entreprise</option>
                <option value="individual">Particulier</option>
              </Select>
              <Select className="w-48">
                <option value="">Tous statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </Select>
            </div>
          </Card>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email / Tel</TableHead>
                  <TableHead className="text-center">Projets</TableHead>
                  <TableHead className="text-right">CA total</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {client.type === 'company' ? (
                            <Building2 className="h-5 w-5 text-primary" />
                          ) : (
                            <User className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {client.address.split(',')[1]?.trim() || client.address}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{client.contact}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm flex items-center gap-1"><Mail className="h-3 w-3" />{client.email}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{client.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{client.projectsCount}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(client.totalRevenue)}</TableCell>
                    <TableCell>
                      <div className="flex">{getRatingStars(client.rating)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={client.status === 'active' ? 'success' : 'default'}>
                        {client.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <Card className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Rechercher un contact..." className="pl-9" />
              </div>
              <Select className="w-48">
                <option value="">Toutes entreprises</option>
                {MOCK_CLIENTS.filter(c => c.type === 'company').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </div>
          </Card>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telephone</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_CONTACTS.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          {contact.isPrimary && <Badge variant="info" className="text-xs">Principal</Badge>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{contact.company}</TableCell>
                    <TableCell>{contact.role}</TableCell>
                    <TableCell className="text-sm">{contact.email}</TableCell>
                    <TableCell className="text-sm">{contact.phone}</TableCell>
                    <TableCell><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Client Modal */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Nouveau client" size="lg">
        <div className="space-y-4">
          <FormField label="Type de client" required>
            <Select value={clientType} onChange={(e) => setClientType(e.target.value)}>
              <option value="company">Entreprise</option>
              <option value="individual">Particulier</option>
            </Select>
          </FormField>

          {clientType === 'company' ? (
            <>
              <FormField label="Raison sociale" required><Input placeholder="Nom de l'entreprise" /></FormField>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Numero IDE"><Input placeholder="CHE-XXX.XXX.XXX" /></FormField>
                <FormField label="Numero TVA"><Input placeholder="CHE-XXX.XXX.XXX TVA" /></FormField>
              </div>
            </>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Prenom" required><Input placeholder="Prenom" /></FormField>
              <FormField label="Nom" required><Input placeholder="Nom" /></FormField>
            </div>
          )}

          <FormField label="Adresse" required><Input placeholder="Rue et numero" /></FormField>
          <div className="grid gap-4 md:grid-cols-3">
            <FormField label="NPA" required><Input placeholder="1000" /></FormField>
            <FormField label="Ville" required className="col-span-2"><Input placeholder="Lausanne" /></FormField>
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium mb-3">Contact principal</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Nom du contact" required><Input placeholder="Nom complet" /></FormField>
              <FormField label="Role"><Input placeholder="Fonction" /></FormField>
              <FormField label="Email" required><Input type="email" placeholder="email@exemple.ch" /></FormField>
              <FormField label="Telephone"><Input placeholder="+41 XX XXX XX XX" /></FormField>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowNewModal(false)}>Annuler</Button>
            <Button>Creer le client</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
