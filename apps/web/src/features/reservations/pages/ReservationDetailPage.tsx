import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  ArrowLeft,
  Edit,
  Trash2,
  Copy,
  Printer,
  Send,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  Package,
  Plus,
  Minus,
  User,
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  AlertTriangle,
  DollarSign,
} from 'lucide-react';
import {
  Button,
  Card,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
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

const MOCK_RESERVATION = {
  id: '1',
  number: 'RES-2024-0289',
  status: 'confirmed',
  project: {
    id: '1',
    name: 'Festival Montreux',
    number: 'PRJ-2024-0045',
  },
  client: {
    id: '1',
    name: 'Montreux Jazz',
    contact: 'Jean-Pierre Muller',
    email: 'jp.muller@montreuxjazz.com',
    phone: '+41 21 966 44 44',
    address: 'Rue du Theatre 5, 1820 Montreux',
  },
  dates: {
    start: '2024-01-15',
    end: '2024-01-17',
    pickup: '2024-01-14 14:00',
    return: '2024-01-18 10:00',
  },
  location: 'Auditorium Stravinski, Montreux',
  createdAt: '2024-01-05 09:30',
  createdBy: 'Marie Dupont',
  totalItems: 45,
  subtotal: 11500,
  discount: 500,
  taxes: 1500,
  total: 12500,
  notes: 'Livraison par nos soins le 14 janvier. Contact sur place: Marc Bianchi +41 79 123 45 67',
};

const MOCK_ITEMS = [
  { id: '1', code: 'PAR-LED-001', name: 'PAR LED RGBW 18x10W', category: 'Eclairage', quantity: 24, priceDay: 25, days: 3, total: 1800 },
  { id: '2', code: 'LYR-SPT-002', name: 'Lyre Spot LED 150W', category: 'Eclairage', quantity: 8, priceDay: 75, days: 3, total: 1800 },
  { id: '3', code: 'ENC-ACT-001', name: 'Enceinte Active 15" 1000W', category: 'Son', quantity: 4, priceDay: 50, days: 3, total: 600 },
  { id: '4', code: 'CON-NUM-001', name: 'Console numerique 32 canaux', category: 'Son', quantity: 1, priceDay: 200, days: 3, total: 600 },
  { id: '5', code: 'CAB-XLR-10M', name: 'Cable XLR 10m', category: 'Cablage', quantity: 40, priceDay: 2, days: 3, total: 240 },
  { id: '6', code: 'TRU-ALU-001', name: 'Structure Alu 3m', category: 'Structure', quantity: 12, priceDay: 15, days: 3, total: 540 },
];

const MOCK_TIMELINE = [
  { id: '1', date: '2024-01-14 14:00', type: 'pickup', status: 'pending', label: 'Enlevement prevu' },
  { id: '2', date: '2024-01-15 00:00', type: 'start', status: 'pending', label: 'Debut location' },
  { id: '3', date: '2024-01-17 23:59', type: 'end', status: 'pending', label: 'Fin location' },
  { id: '4', date: '2024-01-18 10:00', type: 'return', status: 'pending', label: 'Retour prevu' },
];

const MOCK_HISTORY = [
  { id: '1', date: '2024-01-10 14:30', action: 'Reservation confirmee', user: 'Marie Dupont' },
  { id: '2', date: '2024-01-08 11:15', action: 'Devis accepte par le client', user: 'Systeme' },
  { id: '3', date: '2024-01-06 16:00', action: 'Devis envoye au client', user: 'Marie Dupont' },
  { id: '4', date: '2024-01-05 09:30', action: 'Reservation creee', user: 'Marie Dupont' },
];

const STATUS_CONFIG: Record<string, { variant: 'default' | 'success' | 'warning' | 'info' | 'destructive'; label: string; icon: any }> = {
  draft: { variant: 'default', label: 'Brouillon', icon: Edit },
  pending: { variant: 'warning', label: 'En attente', icon: Clock },
  confirmed: { variant: 'info', label: 'Confirmee', icon: CheckCircle2 },
  preparing: { variant: 'warning', label: 'En preparation', icon: Clock },
  ready: { variant: 'success', label: 'Prete', icon: CheckCircle2 },
  dispatched: { variant: 'info', label: 'Expediee', icon: Truck },
  in_use: { variant: 'info', label: 'En cours', icon: Calendar },
  returning: { variant: 'warning', label: 'En retour', icon: RotateCcw },
  completed: { variant: 'success', label: 'Terminee', icon: CheckCircle2 },
  cancelled: { variant: 'destructive', label: 'Annulee', icon: AlertTriangle },
};

export default function ReservationDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('articles');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  const reservation = MOCK_RESERVATION;
  const statusConfig = STATUS_CONFIG[reservation.status] || STATUS_CONFIG.draft;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link to="/reservations">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{reservation.number}</h1>
              <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
            </div>
            <div className="flex items-center gap-4 mt-1 text-muted-foreground">
              <Link to={`/projects/${reservation.project.id}`} className="flex items-center gap-1 hover:text-primary">
                <Calendar className="h-4 w-4" />{reservation.project.name}
              </Link>
              <span className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />{reservation.client.name}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Printer className="mr-2 h-4 w-4" />Imprimer</Button>
          <Button variant="outline"><Copy className="mr-2 h-4 w-4" />Dupliquer</Button>
          <Button variant="outline" onClick={() => setShowEditModal(true)}><Edit className="mr-2 h-4 w-4" />Modifier</Button>
          <Button><Send className="mr-2 h-4 w-4" />Envoyer devis</Button>
        </div>
      </div>

      {/* Status Timeline */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          {MOCK_TIMELINE.map((item, index) => (
            <div key={item.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  item.status === 'completed' ? 'bg-green-100 text-green-600' :
                  item.status === 'current' ? 'bg-blue-100 text-blue-600' : 'bg-muted text-muted-foreground'
                }`}>
                  {item.type === 'pickup' && <Truck className="h-5 w-5" />}
                  {item.type === 'start' && <Calendar className="h-5 w-5" />}
                  {item.type === 'end' && <Calendar className="h-5 w-5" />}
                  {item.type === 'return' && <RotateCcw className="h-5 w-5" />}
                </div>
                <p className="text-sm font-medium mt-2">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
              {index < MOCK_TIMELINE.length - 1 && (
                <div className="flex-1 h-0.5 bg-muted mx-4" />
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="articles">Articles ({MOCK_ITEMS.length})</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>

            <TabsContent value="articles">
              <Card>
                <div className="p-4 border-b flex items-center justify-between">
                  <span className="font-semibold">Articles reserves</span>
                  <Button size="sm" onClick={() => setShowAddItemModal(true)}><Plus className="mr-2 h-4 w-4" />Ajouter</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Article</TableHead>
                      <TableHead className="text-center">Qte</TableHead>
                      <TableHead className="text-right">Prix/jour</TableHead>
                      <TableHead className="text-center">Jours</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_ITEMS.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Package className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <Link to={`/articles/${item.id}`} className="font-medium hover:text-primary">{item.name}</Link>
                              <p className="text-sm text-muted-foreground">{item.code}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">{item.priceDay} CHF</TableCell>
                        <TableCell className="text-center">{item.days}</TableCell>
                        <TableCell className="text-right font-medium">{item.total} CHF</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="p-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>{reservation.subtotal.toLocaleString()} CHF</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Remise</span>
                    <span>-{reservation.discount.toLocaleString()} CHF</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>TVA (8%)</span>
                    <span>{reservation.taxes.toLocaleString()} CHF</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>{reservation.total.toLocaleString()} CHF</span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="details">
              <div className="space-y-4">
                <Card>
                  <div className="p-4 border-b font-semibold">Dates et lieu</div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><p className="text-sm text-muted-foreground">Debut</p><p className="font-medium">{new Date(reservation.dates.start).toLocaleDateString('fr-CH')}</p></div>
                      <div><p className="text-sm text-muted-foreground">Fin</p><p className="font-medium">{new Date(reservation.dates.end).toLocaleDateString('fr-CH')}</p></div>
                      <div><p className="text-sm text-muted-foreground">Enlevement</p><p className="font-medium">{reservation.dates.pickup}</p></div>
                      <div><p className="text-sm text-muted-foreground">Retour</p><p className="font-medium">{reservation.dates.return}</p></div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lieu de l'evenement</p>
                      <p className="font-medium flex items-center gap-2"><MapPin className="h-4 w-4" />{reservation.location}</p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="p-4 border-b font-semibold">Notes</div>
                  <div className="p-4">
                    <p className="text-sm">{reservation.notes || 'Aucune note'}</p>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <div className="p-4 border-b font-semibold">Historique</div>
                <div className="divide-y">
                  {MOCK_HISTORY.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{item.action}</p>
                          <p className="text-sm text-muted-foreground">Par {item.user}</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.date}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card>
            <div className="p-4 border-b font-semibold">Client</div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-lg font-semibold text-primary-foreground">
                  {reservation.client.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <p className="font-medium">{reservation.client.name}</p>
                  <p className="text-sm text-muted-foreground">{reservation.client.contact}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" />{reservation.client.email}</p>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{reservation.client.phone}</p>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{reservation.client.address}</p>
              </div>
              <Link to={`/clients/${reservation.client.id}`}>
                <Button variant="outline" className="w-full" size="sm">Voir la fiche client</Button>
              </Link>
            </div>
          </Card>

          {/* Project Info */}
          <Card>
            <div className="p-4 border-b font-semibold">Projet</div>
            <div className="p-4 space-y-3">
              <div>
                <p className="font-medium">{reservation.project.name}</p>
                <p className="text-sm text-muted-foreground">{reservation.project.number}</p>
              </div>
              <Link to={`/projects/${reservation.project.id}`}>
                <Button variant="outline" className="w-full" size="sm">Voir le projet</Button>
              </Link>
            </div>
          </Card>

          {/* Summary */}
          <Card>
            <div className="p-4 border-b font-semibold">Resume</div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Articles</span>
                <span className="font-medium">{reservation.totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duree</span>
                <span className="font-medium">3 jours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cree le</span>
                <span className="font-medium">{reservation.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Par</span>
                <span className="font-medium">{reservation.createdBy}</span>
              </div>
              <div className="pt-3 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">{reservation.total.toLocaleString()} CHF</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card>
            <div className="p-4 border-b font-semibold">Actions</div>
            <div className="p-4 space-y-2">
              <Button className="w-full"><FileText className="mr-2 h-4 w-4" />Generer bon de sortie</Button>
              <Button variant="outline" className="w-full"><DollarSign className="mr-2 h-4 w-4" />Creer facture</Button>
              <Button variant="destructive" className="w-full"><Trash2 className="mr-2 h-4 w-4" />Annuler</Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Item Modal */}
      <Modal isOpen={showAddItemModal} onClose={() => setShowAddItemModal(false)} title="Ajouter un article">
        <div className="space-y-4">
          <FormField label="Rechercher un article">
            <Input placeholder="Code ou nom de l'article..." />
          </FormField>
          <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
            {MOCK_ITEMS.slice(0, 3).map((item) => (
              <div key={item.id} className="p-3 flex items-center justify-between hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.code} - {item.priceDay} CHF/jour</p>
                  </div>
                </div>
                <Button size="sm"><Plus className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowAddItemModal(false)}>Fermer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
