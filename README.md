# MatFlow

**Système complet de gestion de stock circulant pour l'événementiel**

MatFlow est une solution de gestion d'actifs conçue pour les entreprises qui utilisent leur matériel sur des projets/événements, puis le récupèrent pour le réutiliser. Typiquement : prestataires techniques événementiels, sociétés de location, équipes audiovisuelles.

---

## 🎯 Problématique adressée

Le matériel événementiel suit un cycle particulier :

```
Réservation → Préparation → Expédition → Service → Retour → Contrôle → Remise en stock
                                                              ↓
                                                         Maintenance
```

Les solutions de gestion de stock classiques ne gèrent pas bien :
- Les **réservations temporelles** avec vérification de disponibilité future
- Les **kits composites** (assemblages d'articles)
- Les **transferts inter-projets** sans retour à l'entrepôt
- Le **suivi d'état** et la maintenance du matériel
- La **traçabilité par scanning** sur le terrain

MatFlow répond à ces besoins spécifiques.

---

## 📦 Fonctionnalités principales

### Gestion des articles
- Articles sérialisés (identifiant unique) et articles par lot
- Catégorisation flexible avec attributs personnalisables
- Poids, dimensions, valeur, documentation
- Photos et fiches techniques
- Suivi de complétude des données

### Gestion des kits
- Création de kits physiques à partir du stock
- Vérification de disponibilité réelle (incluant réservations futures)
- Templates de kits réutilisables
- Démontage et recomposition

### Gestion des caisses/conteneurs
- Caisses comme entités traçables
- Contenu attendu vs contenu réel
- Vérification par scanning

### Réservations & Projets
- Réservations par période avec calcul de disponibilité
- Gestion des conflits
- Projets regroupant plusieurs réservations
- Transferts directs entre projets

### Workflow opérationnel
- Listes de picking pour préparation
- Validation par scanning (QR codes)
- Contrôle au retour (état, quantité)
- Signalement des écarts et anomalies

### Maintenance
- Historique de maintenance par article
- Planification préventive
- Suivi des réparations
- Coûts de maintenance

### Multi-utilisateurs
- Rôles : Admin, Chef de projet, Magasinier, Technicien
- Permissions granulaires par module
- Logs d'activité complets

### Multi-filiales
- Stock local par filiale + stock central partagé
- Transferts et prêts inter-filiales
- Projets mobilisant plusieurs filiales
- Facturation interne optionnelle
- Reporting consolidé (groupe) et par filiale

### Notifications & Alertes
- Notifications in-app, email, push mobile
- Alertes configurables par type d'événement
- Rappels automatiques (préparation, retour, maintenance)
- Résumé quotidien optionnel

### Devis & Facturation client
- Tarification configurable (journalier, forfait, dégressif)
- Génération de devis depuis les réservations
- Transformation devis → facture
- Suivi des paiements
- Conditions commerciales par client

### Gestion documentaire
- Documents liés aux projets (plans, riders, contrats)
- Gestion des versions
- Accès restreint pour documents sensibles
- Disponibilité hors ligne sur mobile

### Assurance & Conformité
- Suivi de la valeur assurée par projet
- Certificats d'assurance générés
- Déclarations de valeur pour transport
- Gestion des pertes et dommages
- Refacturation et déclarations sinistres

### Import & Intégrations
- Import Excel/CSV avec mapping intelligent
- Migration depuis systèmes existants
- Intégrations : Google Calendar, Slack, Bexio
- API publique et webhooks

### Multi-langue & RGPD
- Interface en FR, DE, EN (IT prévu)
- Documents générés dans la langue du client
- Conformité RGPD/LPD (Suisse)
- Export et suppression des données personnelles

---

## 🏗️ Architecture technique

| Couche | Technologie |
|--------|-------------|
| Frontend Web | React + TypeScript |
| Desktop | Tauri (réutilisation React) |
| Mobile | React Native |
| Backend | Node.js (Fastify) |
| Base de données | PostgreSQL |
| Cache | Redis |
| Authentification | JWT |

Voir [TECHNICAL_STACK.md](docs/TECHNICAL_STACK.md) pour les détails.

---

## 📚 Documentation

### Core
- [Spécifications fonctionnelles](docs/SPECIFICATIONS.md)
- [Description des modules](docs/MODULES.md)
- [Schéma de base de données](docs/DATABASE_SCHEMA.md)
- [User Stories](docs/USER_STORIES.md)
- [Stack technique](docs/TECHNICAL_STACK.md)
- [**Guidelines de développement**](docs/DEVELOPMENT_GUIDELINES.md)

### Fonctionnalités avancées
- [Nomenclature & Codification](docs/NOMENCLATURE.md)
- [Multi-Filiales](docs/MULTI_BRANCH.md)
- [Notifications & Alertes](docs/NOTIFICATIONS.md)
- [Gestion des Consommables](docs/CONSUMABLES.md)
- [Devis & Facturation](docs/BILLING.md)

### Gestion documentaire & Conformité
- [Documents, Assurance & Incidents](docs/DOCUMENTS_INSURANCE_INCIDENTS.md)
- [Import & Migration](docs/IMPORT_MIGRATION.md)
- [Intégrations Externes](docs/INTEGRATIONS.md)
- [Internationalisation & RGPD](docs/I18N_COMPLIANCE.md)

---

## 🚀 Roadmap

### Phase 1 : MVP (Core)
- [ ] Module Articles (CRUD, catégories)
- [ ] Module Stock (localisations, états)
- [ ] Module Réservations (base)
- [ ] Module Projets (base)
- [ ] Authentification & rôles de base
- [ ] Import de codes existants
- [ ] Notifications in-app (base)
- [ ] Documents projets (base)

### Phase 2 : Opérations
- [ ] Module Kits
- [ ] Module Caisses
- [ ] Module Préparation/Expédition
- [ ] Module Retour
- [ ] Scanning QR (web + mobile)
- [ ] Templates de réservation
- [ ] Nomenclature configurable
- [ ] Consommables
- [ ] Notifications email + push
- [ ] Pertes et dommages
- [ ] Import/Migration données

### Phase 3 : Complet
- [ ] Module Maintenance
- [ ] Application mobile native
- [ ] Application desktop
- [ ] Mode offline + synchronisation
- [ ] Reporting avancé
- [ ] Multi-filiales (organisations, transferts, stock partagé)
- [ ] Facturation interne inter-filiales
- [ ] Devis & Facturation client
- [ ] Export comptable
- [ ] Assurance et valeur déclarée
- [ ] Multi-langue (FR, DE, EN)
- [ ] Conformité RGPD/LPD

### Phase 4 : Intégrations
- [ ] Google Calendar / Outlook
- [ ] Slack / Microsoft Teams
- [ ] Bexio / Comptabilité
- [ ] API publique
- [ ] Webhooks
- [ ] Zapier / Make

---

## 📋 Prérequis

*À compléter lors du setup technique*

---

## ⚙️ Installation

*À compléter lors du développement*

---

## 🤝 Contribution

Ce projet est actuellement en phase de conception. Les contributions seront les bienvenues une fois la base établie.

---

## 📄 Licence

*À définir*

---

## 📞 Contact

*À compléter*
