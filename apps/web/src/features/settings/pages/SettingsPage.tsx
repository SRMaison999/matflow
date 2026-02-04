import { useState } from 'react';
import {
  Settings,
  Building2,
  Globe,
  Palette,
  Bell,
  Mail,
  Shield,
  Database,
  HardDrive,
  Cloud,
  Save,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import {
  Button,
  Input,
  Card,
  Badge,
  Select,
  FormField,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Checkbox,
} from '@/components/ui';

const MOCK_BRANCHES = [
  { id: '1', name: 'Geneve', address: 'Rue de la Servette 45, 1202 Geneve', phone: '+41 22 123 45 67', email: 'geneve@matflow.ch', isMain: true },
  { id: '2', name: 'Lausanne', address: 'Avenue de la Gare 12, 1003 Lausanne', phone: '+41 21 234 56 78', email: 'lausanne@matflow.ch', isMain: false },
  { id: '3', name: 'Zurich', address: 'Bahnhofstrasse 100, 8001 Zurich', phone: '+41 44 345 67 89', email: 'zurich@matflow.ch', isMain: false },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Parametres</h1>
          <p className="text-muted-foreground">Configuration de l'application</p>
        </div>
        <div className="flex gap-2">
          {saved && (
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Enregistre
            </Badge>
          )}
          <Button variant="outline"><RotateCcw className="mr-2 h-4 w-4" />Reinitialiser</Button>
          <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Enregistrer</Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="company">Entreprise</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="billing">Facturation</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">Systeme</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Building2 className="h-5 w-5" />Informations entreprise</h3>
            <div className="space-y-4">
              <FormField label="Nom de l'entreprise" required>
                <Input defaultValue="MatFlow SA" />
              </FormField>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Numero IDE">
                  <Input defaultValue="CHE-123.456.789" />
                </FormField>
                <FormField label="Numero TVA">
                  <Input defaultValue="CHE-123.456.789 TVA" />
                </FormField>
              </div>
              <FormField label="Adresse">
                <Input defaultValue="Rue de la Servette 45" />
              </FormField>
              <div className="grid gap-4 md:grid-cols-3">
                <FormField label="NPA">
                  <Input defaultValue="1202" />
                </FormField>
                <FormField label="Ville" className="col-span-2">
                  <Input defaultValue="Geneve" />
                </FormField>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Telephone">
                  <Input defaultValue="+41 22 123 45 67" />
                </FormField>
                <FormField label="Email">
                  <Input defaultValue="contact@matflow.ch" />
                </FormField>
              </div>
              <FormField label="Site web">
                <Input defaultValue="https://www.matflow.ch" />
              </FormField>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Globe className="h-5 w-5" />Localisation</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <FormField label="Langue">
                <Select defaultValue="fr">
                  <option value="fr">Francais</option>
                  <option value="de">Allemand</option>
                  <option value="it">Italien</option>
                  <option value="en">Anglais</option>
                </Select>
              </FormField>
              <FormField label="Fuseau horaire">
                <Select defaultValue="europe/zurich">
                  <option value="europe/zurich">Europe/Zurich (UTC+1)</option>
                  <option value="europe/paris">Europe/Paris (UTC+1)</option>
                </Select>
              </FormField>
              <FormField label="Format de date">
                <Select defaultValue="dd.mm.yyyy">
                  <option value="dd.mm.yyyy">DD.MM.YYYY</option>
                  <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                  <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                </Select>
              </FormField>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Palette className="h-5 w-5" />Apparence</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Theme">
                <Select defaultValue="light">
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                  <option value="system">Systeme</option>
                </Select>
              </FormField>
              <FormField label="Couleur principale">
                <div className="flex gap-2">
                  <Input type="color" defaultValue="#2563eb" className="w-12 h-10 p-1" />
                  <Input defaultValue="#2563eb" className="flex-1" />
                </div>
              </FormField>
            </div>
            <div className="mt-4">
              <FormField label="Logo">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">Glisser-deposer ou cliquer pour telecharger</p>
                  <p className="text-sm text-muted-foreground mt-1">PNG, JPG jusqu'a 2MB</p>
                </div>
              </FormField>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="branches" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Branches / Succursales</h3>
              <Button size="sm">Ajouter une branche</Button>
            </div>
            <div className="space-y-4">
              {MOCK_BRANCHES.map((branch) => (
                <div key={branch.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{branch.name}</h4>
                      {branch.isMain && <Badge variant="info">Principale</Badge>}
                    </div>
                    <Button variant="ghost" size="sm">Modifier</Button>
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground">
                    <p>{branch.address}</p>
                    <p>{branch.phone} | {branch.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Parametres de facturation</h3>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Devise">
                  <Select defaultValue="CHF">
                    <option value="CHF">CHF - Franc suisse</option>
                    <option value="EUR">EUR - Euro</option>
                  </Select>
                </FormField>
                <FormField label="Taux de TVA par defaut">
                  <Select defaultValue="7.7">
                    <option value="7.7">7.7%</option>
                    <option value="2.5">2.5% (reduit)</option>
                    <option value="0">0% (exonere)</option>
                  </Select>
                </FormField>
              </div>
              <FormField label="Delai de paiement par defaut">
                <Select defaultValue="30">
                  <option value="10">10 jours</option>
                  <option value="30">30 jours</option>
                  <option value="60">60 jours</option>
                </Select>
              </FormField>
              <FormField label="Prefixe numero de devis">
                <Input defaultValue="DEV-" />
              </FormField>
              <FormField label="Prefixe numero de facture">
                <Input defaultValue="FAC-" />
              </FormField>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Informations bancaires</h3>
            <div className="space-y-4">
              <FormField label="Nom de la banque">
                <Input defaultValue="UBS Switzerland AG" />
              </FormField>
              <FormField label="IBAN">
                <Input defaultValue="CH93 0027 3000 0000 0000 0" />
              </FormField>
              <FormField label="BIC/SWIFT">
                <Input defaultValue="UBSWCHZH80A" />
              </FormField>
              <FormField label="Numero QR">
                <Input placeholder="Numero QR pour factures QR" />
              </FormField>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Bell className="h-5 w-5" />Notifications email</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Nouvelles reservations</p>
                  <p className="text-sm text-muted-foreground">Recevoir un email lors de nouvelles reservations</p>
                </div>
                <Checkbox defaultChecked />
              </label>
              <label className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Retours en attente</p>
                  <p className="text-sm text-muted-foreground">Rappel des retours planifies</p>
                </div>
                <Checkbox defaultChecked />
              </label>
              <label className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Stock bas</p>
                  <p className="text-sm text-muted-foreground">Alerte quand le stock passe sous le seuil</p>
                </div>
                <Checkbox defaultChecked />
              </label>
              <label className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Factures en retard</p>
                  <p className="text-sm text-muted-foreground">Rappel des factures non payees</p>
                </div>
                <Checkbox defaultChecked />
              </label>
              <label className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Maintenance planifiee</p>
                  <p className="text-sm text-muted-foreground">Rappel des maintenances a venir</p>
                </div>
                <Checkbox />
              </label>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Mail className="h-5 w-5" />Configuration SMTP</h3>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Serveur SMTP">
                  <Input defaultValue="smtp.matflow.ch" />
                </FormField>
                <FormField label="Port">
                  <Input defaultValue="587" />
                </FormField>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Utilisateur">
                  <Input defaultValue="noreply@matflow.ch" />
                </FormField>
                <FormField label="Mot de passe">
                  <Input type="password" defaultValue="********" />
                </FormField>
              </div>
              <FormField label="Email expediteur">
                <Input defaultValue="noreply@matflow.ch" />
              </FormField>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Database className="h-5 w-5" />Base de donnees</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-muted-foreground">Taille</p>
                  <p className="font-medium">2.4 GB</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-muted-foreground">Articles</p>
                  <p className="font-medium">1,247</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-muted-foreground">Reservations</p>
                  <p className="font-medium">4,892</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-muted-foreground">Derniere sauvegarde</p>
                  <p className="font-medium">15.01.2024 03:00</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Exporter les donnees</Button>
                <Button variant="outline">Sauvegarder maintenant</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><HardDrive className="h-5 w-5" />Stockage</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Utilise: 12.8 GB / 50 GB</span>
                <span className="text-muted-foreground">25.6%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '25.6%' }} />
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Documents</p>
                  <p className="font-medium">5.2 GB</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Images</p>
                  <p className="font-medium">6.1 GB</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Autres</p>
                  <p className="font-medium">1.5 GB</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Shield className="h-5 w-5" />Securite</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Authentification a deux facteurs</p>
                  <p className="text-sm text-muted-foreground">Exiger 2FA pour tous les utilisateurs</p>
                </div>
                <Checkbox />
              </label>
              <label className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Expiration de session</p>
                  <p className="text-sm text-muted-foreground">Deconnecter apres inactivite</p>
                </div>
                <Select defaultValue="60" className="w-32">
                  <option value="30">30 min</option>
                  <option value="60">1 heure</option>
                  <option value="480">8 heures</option>
                </Select>
              </label>
              <label className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Journal d'audit</p>
                  <p className="text-sm text-muted-foreground">Enregistrer toutes les actions</p>
                </div>
                <Checkbox defaultChecked />
              </label>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
