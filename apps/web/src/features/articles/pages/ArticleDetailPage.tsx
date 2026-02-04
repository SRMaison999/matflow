import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  ArrowLeft,
  Edit,
  Trash2,
  QrCode,
  History,
  Wrench,
  Calendar,
  MapPin,
  Tag,
  DollarSign,
  BarChart3,
  Camera,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
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
} from '@/components/ui';

const MOCK_ARTICLE = {
  id: '1',
  code: 'PAR-LED-001',
  barcode: '7640123456789',
  name: 'PAR LED RGBW 18x10W',
  description: 'Projecteur PAR LED haute puissance avec melange de couleurs RGBW. Ideal pour l\'eclairage de scene et d\'ambiance. Angle de faisceau 25 degres, DMX 512 canaux.',
  category: 'Eclairage',
  subcategory: 'Projecteurs LED',
  brand: 'Chauvet',
  model: 'COLORdash Par H18',
  serialNumber: 'CHV-2023-0456',
  status: 'available',
  condition: 'good',
  location: 'Entrepot Lausanne',
  zone: 'Zone A',
  rack: 'Rack 1',
  position: 'A1-03',
  purchaseDate: '2023-03-15',
  purchasePrice: 450,
  currentValue: 380,
  rentalPriceDay: 25,
  rentalPriceWeek: 150,
  weight: 4.5,
  dimensions: '28 x 28 x 35 cm',
  powerConsumption: '180W',
  quantity: {
    total: 24,
    available: 18,
    reserved: 4,
    inUse: 2,
    maintenance: 0,
  },
  maintenanceInterval: 90,
  lastMaintenance: '2024-01-05',
  nextMaintenance: '2024-04-05',
  totalRentals: 156,
  totalRevenue: 12450,
  averageRating: 4.8,
};

const MOCK_HISTORY = [
  { id: '1', date: '2024-01-15 14:32', type: 'rental_out', reference: 'RES-2024-0289', project: 'Festival Montreux', quantity: 12, user: 'Jean Martin' },
  { id: '2', date: '2024-01-10 09:15', type: 'rental_in', reference: 'RES-2024-0278', project: 'Conference EPFL', quantity: 8, user: 'Marie Dupont' },
  { id: '3', date: '2024-01-05 16:00', type: 'maintenance', reference: 'MNT-2024-0012', project: 'Maintenance preventive', quantity: 24, user: 'Pierre Bernard' },
  { id: '4', date: '2023-12-20 11:30', type: 'rental_out', reference: 'RES-2023-0456', project: 'Gala UBS', quantity: 16, user: 'Sophie Laurent' },
  { id: '5', date: '2023-12-15 10:00', type: 'rental_in', reference: 'RES-2023-0445', project: 'Concert Paleo', quantity: 20, user: 'Jean Martin' },
];

const MOCK_MAINTENANCE = [
  { id: '1', date: '2024-01-05', type: 'preventive', description: 'Nettoyage lentilles et verification connexions', technician: 'Pierre Bernard', cost: 50, status: 'completed' },
  { id: '2', date: '2023-10-12', type: 'corrective', description: 'Remplacement ventilateur defectueux', technician: 'Marc Roth', cost: 85, status: 'completed' },
  { id: '3', date: '2023-07-20', type: 'preventive', description: 'Maintenance semestrielle complete', technician: 'Pierre Bernard', cost: 50, status: 'completed' },
];

const MOCK_DOCUMENTS = [
  { id: '1', name: 'Manuel utilisateur', type: 'pdf', size: '2.4 MB', date: '2023-03-15' },
  { id: '2', name: 'Fiche technique', type: 'pdf', size: '856 KB', date: '2023-03-15' },
  { id: '3', name: 'Certificat CE', type: 'pdf', size: '124 KB', date: '2023-03-15' },
];

const MOCK_RESERVATIONS = [
  { id: '1', number: 'RES-2024-0295', project: 'Seminaire Nestle', dates: '25-26 Jan 2024', quantity: 8, status: 'confirmed' },
  { id: '2', number: 'RES-2024-0301', project: 'Expo Art Basel', dates: '02-05 Fev 2024', quantity: 12, status: 'pending' },
];

export default function ArticleDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const article = MOCK_ARTICLE;

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'success' | 'warning' | 'info' | 'destructive' | 'default'; label: string }> = {
      available: { variant: 'success', label: 'Disponible' },
      reserved: { variant: 'info', label: 'Reserve' },
      in_use: { variant: 'warning', label: 'En utilisation' },
      maintenance: { variant: 'warning', label: 'En maintenance' },
      out_of_service: { variant: 'destructive', label: 'Hors service' },
    };
    const { variant, label } = config[status] || { variant: 'default', label: status };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getConditionBadge = (condition: string) => {
    const config: Record<string, { variant: 'success' | 'warning' | 'destructive' | 'default'; label: string }> = {
      excellent: { variant: 'success', label: 'Excellent' },
      good: { variant: 'success', label: 'Bon' },
      fair: { variant: 'warning', label: 'Correct' },
      poor: { variant: 'destructive', label: 'Mauvais' },
    };
    const { variant, label } = config[condition] || { variant: 'default', label: condition };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getHistoryBadge = (type: string) => {
    const config: Record<string, { variant: 'success' | 'destructive' | 'info' | 'warning' | 'default'; label: string }> = {
      rental_out: { variant: 'destructive', label: 'Sortie' },
      rental_in: { variant: 'success', label: 'Retour' },
      maintenance: { variant: 'warning', label: 'Maintenance' },
      transfer: { variant: 'info', label: 'Transfert' },
    };
    const { variant, label } = config[type] || { variant: 'default', label: type };
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link to="/articles">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{article.name}</h1>
                {getStatusBadge(article.status)}
                {getConditionBadge(article.condition)}
              </div>
              <div className="flex items-center gap-4 mt-1 text-muted-foreground">
                <span className="flex items-center gap-1"><Tag className="h-4 w-4" />{article.code}</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{article.location}</span>
                <span className="flex items-center gap-1">{article.category} / {article.subcategory}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowQrModal(true)}><QrCode className="mr-2 h-4 w-4" />QR Code</Button>
          <Button variant="outline" onClick={() => setShowEditModal(true)}><Edit className="mr-2 h-4 w-4" />Modifier</Button>
          <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Supprimer</Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{article.quantity.available}</p>
          <p className="text-sm text-muted-foreground">Disponibles</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{article.quantity.reserved}</p>
          <p className="text-sm text-muted-foreground">Reserves</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-orange-600">{article.quantity.inUse}</p>
          <p className="text-sm text-muted-foreground">En utilisation</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold">{article.totalRentals}</p>
          <p className="text-sm text-muted-foreground">Locations totales</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{article.totalRevenue.toLocaleString()} CHF</p>
          <p className="text-sm text-muted-foreground">Revenus generes</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Details */}
            <Card>
              <div className="p-4 border-b font-semibold">Informations generales</div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-muted-foreground">Code article</p><p className="font-medium">{article.code}</p></div>
                  <div><p className="text-sm text-muted-foreground">Code-barres</p><p className="font-medium">{article.barcode}</p></div>
                  <div><p className="text-sm text-muted-foreground">Marque</p><p className="font-medium">{article.brand}</p></div>
                  <div><p className="text-sm text-muted-foreground">Modele</p><p className="font-medium">{article.model}</p></div>
                  <div><p className="text-sm text-muted-foreground">Numero de serie</p><p className="font-medium">{article.serialNumber}</p></div>
                  <div><p className="text-sm text-muted-foreground">Categorie</p><p className="font-medium">{article.category} / {article.subcategory}</p></div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{article.description}</p>
                </div>
              </div>
            </Card>

            {/* Location & Stock */}
            <Card>
              <div className="p-4 border-b font-semibold">Emplacement et stock</div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-muted-foreground">Entrepot</p><p className="font-medium">{article.location}</p></div>
                  <div><p className="text-sm text-muted-foreground">Zone</p><p className="font-medium">{article.zone}</p></div>
                  <div><p className="text-sm text-muted-foreground">Rack</p><p className="font-medium">{article.rack}</p></div>
                  <div><p className="text-sm text-muted-foreground">Position</p><p className="font-medium">{article.position}</p></div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3">Repartition du stock</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Disponible</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: `${(article.quantity.available / article.quantity.total) * 100}%` }} />
                        </div>
                        <span className="font-medium w-8 text-right">{article.quantity.available}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Reserve</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${(article.quantity.reserved / article.quantity.total) * 100}%` }} />
                        </div>
                        <span className="font-medium w-8 text-right">{article.quantity.reserved}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">En utilisation</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500" style={{ width: `${(article.quantity.inUse / article.quantity.total) * 100}%` }} />
                        </div>
                        <span className="font-medium w-8 text-right">{article.quantity.inUse}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Pricing */}
            <Card>
              <div className="p-4 border-b font-semibold">Tarification et valeur</div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-muted-foreground">Date d'achat</p><p className="font-medium">{new Date(article.purchaseDate).toLocaleDateString('fr-CH')}</p></div>
                  <div><p className="text-sm text-muted-foreground">Prix d'achat</p><p className="font-medium">{article.purchasePrice} CHF</p></div>
                  <div><p className="text-sm text-muted-foreground">Valeur actuelle</p><p className="font-medium">{article.currentValue} CHF</p></div>
                  <div><p className="text-sm text-muted-foreground">Depreciation</p><p className="font-medium text-red-600">-{article.purchasePrice - article.currentValue} CHF</p></div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3">Tarifs de location</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-3 bg-muted/50">
                      <p className="text-2xl font-bold">{article.rentalPriceDay} CHF</p>
                      <p className="text-sm text-muted-foreground">par jour</p>
                    </Card>
                    <Card className="p-3 bg-muted/50">
                      <p className="text-2xl font-bold">{article.rentalPriceWeek} CHF</p>
                      <p className="text-sm text-muted-foreground">par semaine</p>
                    </Card>
                  </div>
                </div>
              </div>
            </Card>

            {/* Technical Specs */}
            <Card>
              <div className="p-4 border-b font-semibold">Specifications techniques</div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-muted-foreground">Poids</p><p className="font-medium">{article.weight} kg</p></div>
                  <div><p className="text-sm text-muted-foreground">Dimensions</p><p className="font-medium">{article.dimensions}</p></div>
                  <div><p className="text-sm text-muted-foreground">Consommation</p><p className="font-medium">{article.powerConsumption}</p></div>
                  <div><p className="text-sm text-muted-foreground">Note moyenne</p><p className="font-medium">{article.averageRating} / 5</p></div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3">Maintenance</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Derniere maintenance</p>
                      <p className="font-medium">{new Date(article.lastMaintenance).toLocaleDateString('fr-CH')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Prochaine maintenance</p>
                      <p className="font-medium text-orange-600">{new Date(article.nextMaintenance).toLocaleDateString('fr-CH')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <div className="p-4 border-b flex items-center justify-between">
              <span className="font-semibold">Historique des mouvements</span>
              <Button variant="outline" size="sm"><History className="mr-2 h-4 w-4" />Exporter</Button>
            </div>
            <div className="divide-y">
              {MOCK_HISTORY.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground w-36">{item.date}</div>
                    {getHistoryBadge(item.type)}
                    <div>
                      <p className="font-medium">{item.project}</p>
                      <p className="text-sm text-muted-foreground">{item.reference}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-medium ${item.type === 'rental_in' ? 'text-green-600' : item.type === 'rental_out' ? 'text-red-600' : ''}`}>
                      {item.type === 'rental_in' ? '+' : item.type === 'rental_out' ? '-' : ''}{item.quantity} unites
                    </span>
                    <span className="text-sm text-muted-foreground">{item.user}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-orange-100 p-3">
                    <Wrench className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Prochaine maintenance preventive</p>
                    <p className="text-sm text-muted-foreground">Intervalle: tous les {article.maintenanceInterval} jours</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-orange-600">{new Date(article.nextMaintenance).toLocaleDateString('fr-CH')}</p>
                  <p className="text-sm text-muted-foreground">Dans 81 jours</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-4 border-b flex items-center justify-between">
                <span className="font-semibold">Historique de maintenance</span>
                <Button size="sm"><Wrench className="mr-2 h-4 w-4" />Planifier</Button>
              </div>
              <div className="divide-y">
                {MOCK_MAINTENANCE.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground w-28">{new Date(item.date).toLocaleDateString('fr-CH')}</div>
                      <Badge variant={item.type === 'preventive' ? 'info' : 'warning'}>
                        {item.type === 'preventive' ? 'Preventive' : 'Corrective'}
                      </Badge>
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-muted-foreground">Par {item.technician}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{item.cost} CHF</span>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reservations">
          <Card>
            <div className="p-4 border-b flex items-center justify-between">
              <span className="font-semibold">Reservations a venir</span>
              <Button size="sm"><Calendar className="mr-2 h-4 w-4" />Voir calendrier</Button>
            </div>
            <div className="divide-y">
              {MOCK_RESERVATIONS.map((res) => (
                <div key={res.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Link to={`/reservations/${res.id}`} className="font-medium hover:text-primary">{res.project}</Link>
                      <p className="text-sm text-muted-foreground">{res.number} - {res.dates}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{res.quantity} unites</span>
                    <Badge variant={res.status === 'confirmed' ? 'success' : 'warning'}>
                      {res.status === 'confirmed' ? 'Confirmee' : 'En attente'}
                    </Badge>
                  </div>
                </div>
              ))}
              {MOCK_RESERVATIONS.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  Aucune reservation a venir
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <div className="p-4 border-b flex items-center justify-between">
              <span className="font-semibold">Documents attaches</span>
              <Button size="sm"><Camera className="mr-2 h-4 w-4" />Ajouter</Button>
            </div>
            <div className="divide-y">
              {MOCK_DOCUMENTS.map((doc) => (
                <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">{doc.size} - Ajoute le {new Date(doc.date).toLocaleDateString('fr-CH')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm"><ExternalLink className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* QR Code Modal */}
      <Modal isOpen={showQrModal} onClose={() => setShowQrModal(false)} title="QR Code">
        <div className="text-center space-y-4">
          <div className="h-48 w-48 mx-auto bg-muted rounded-lg flex items-center justify-center">
            <QrCode className="h-32 w-32 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{article.code}</p>
            <p className="text-sm text-muted-foreground">{article.name}</p>
          </div>
          <div className="flex justify-center gap-2">
            <Button variant="outline"><Copy className="mr-2 h-4 w-4" />Copier</Button>
            <Button>Imprimer</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Modifier l'article" size="lg">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Code article" required><Input defaultValue={article.code} /></FormField>
            <FormField label="Code-barres"><Input defaultValue={article.barcode} /></FormField>
          </div>
          <FormField label="Nom de l'article" required><Input defaultValue={article.name} /></FormField>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Marque"><Input defaultValue={article.brand} /></FormField>
            <FormField label="Modele"><Input defaultValue={article.model} /></FormField>
          </div>
          <FormField label="Description">
            <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={3} defaultValue={article.description} />
          </FormField>
          <div className="grid gap-4 md:grid-cols-3">
            <FormField label="Prix location/jour"><Input type="number" defaultValue={article.rentalPriceDay} /></FormField>
            <FormField label="Prix location/semaine"><Input type="number" defaultValue={article.rentalPriceWeek} /></FormField>
            <FormField label="Quantite totale"><Input type="number" defaultValue={article.quantity.total} /></FormField>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Annuler</Button>
            <Button>Enregistrer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
