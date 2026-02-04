# Schéma de Base de Données MatFlow

## Diagramme ERD simplifié

```
┌─────────────────┐       ┌─────────────────┐
│  Organization   │──────<│     Branch      │
└─────────────────┘       └─────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
              ┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐
              │   User    │  │  Article  │  │  Location │
              └───────────┘  └───────────┘  └───────────┘
                    │              │
              ┌─────▼─────┐  ┌─────▼─────┐
              │  Project  │  │ Category  │
              └───────────┘  └───────────┘
                    │
              ┌─────▼─────────┐
              │  Reservation  │
              └───────────────┘
                    │
          ┌─────────┼─────────┐
          │                   │
    ┌─────▼─────┐       ┌─────▼─────┐
    │ PickingList│       │ReturnCheck│
    └───────────┘       └───────────┘
```

## Tables principales

### Organization
Entreprise/organisation utilisant MatFlow.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| name | VARCHAR | Nom de l'organisation |
| code | VARCHAR | Code unique |
| address | JSON | Adresse complète |
| settings | JSON | Paramètres personnalisés |
| createdAt | TIMESTAMP | Date de création |
| updatedAt | TIMESTAMP | Date de modification |

### Branch
Filiale ou succursale d'une organisation.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| organizationId | UUID | FK vers Organization |
| name | VARCHAR | Nom de la filiale |
| code | VARCHAR | Code unique dans l'org |
| address | JSON | Adresse |
| isMain | BOOLEAN | Filiale principale |
| settings | JSON | Paramètres locaux |

### User
Utilisateur du système.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| email | VARCHAR | Email (unique) |
| passwordHash | VARCHAR | Hash Argon2 |
| firstName | VARCHAR | Prénom |
| lastName | VARCHAR | Nom |
| role | ENUM | Rôle utilisateur |
| branchId | UUID | FK vers Branch |
| isActive | BOOLEAN | Compte actif |
| lastLoginAt | TIMESTAMP | Dernière connexion |

### Article
Équipement ou matériel géré.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| code | VARCHAR | Code article unique |
| barcode | VARCHAR | Code-barres |
| serialNumber | VARCHAR | Numéro de série |
| name | VARCHAR | Nom de l'article |
| description | TEXT | Description |
| type | ENUM | SERIALIZED, BATCH, CONSUMABLE |
| status | ENUM | Statut actuel |
| condition | ENUM | État physique |
| categoryId | UUID | FK vers Category |
| branchId | UUID | FK vers Branch |
| locationId | UUID | FK vers Location |
| purchasePrice | DECIMAL | Prix d'achat |
| rentalPriceDaily | DECIMAL | Prix location/jour |
| weight | DECIMAL | Poids en kg |
| dimensions | JSON | Dimensions LxWxH |
| qrCode | VARCHAR | QR code généré |
| images | JSON | URLs des images |
| customAttributes | JSON | Attributs personnalisés |
| maintenanceIntervalDays | INT | Intervalle maintenance |
| lastMaintenanceDate | DATE | Dernière maintenance |
| nextMaintenanceDate | DATE | Prochaine maintenance |

### Category
Catégorie d'articles avec hiérarchie.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| name | VARCHAR | Nom |
| code | VARCHAR | Code unique |
| description | TEXT | Description |
| parentId | UUID | FK vers Category (parent) |
| branchId | UUID | FK vers Branch |
| path | VARCHAR | Chemin hiérarchique |
| depth | INT | Niveau de profondeur |

### Location
Emplacement de stockage.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| name | VARCHAR | Nom (ex: "Rack A1") |
| code | VARCHAR | Code unique |
| branchId | UUID | FK vers Branch |
| parentId | UUID | FK vers Location (parent) |
| type | ENUM | WAREHOUSE, ZONE, RACK, SHELF |
| barcode | VARCHAR | Code-barres emplacement |

### Client
Client final pour les projets.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| name | VARCHAR | Nom/Raison sociale |
| type | ENUM | COMPANY, INDIVIDUAL |
| email | VARCHAR | Email principal |
| phone | VARCHAR | Téléphone |
| address | JSON | Adresse |
| vatNumber | VARCHAR | Numéro TVA |
| branchId | UUID | FK vers Branch |
| creditLimit | DECIMAL | Limite de crédit |
| paymentTerms | INT | Délai paiement (jours) |

### Project
Projet événementiel.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| number | VARCHAR | Numéro de projet |
| name | VARCHAR | Nom du projet |
| description | TEXT | Description |
| clientId | UUID | FK vers Client |
| branchId | UUID | FK vers Branch |
| managerId | UUID | FK vers User |
| status | ENUM | Statut du projet |
| startDate | DATE | Date de début |
| endDate | DATE | Date de fin |
| venue | JSON | Lieu de l'événement |
| budget | DECIMAL | Budget estimé |

### Reservation
Réservation de matériel.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| number | VARCHAR | Numéro de réservation |
| projectId | UUID | FK vers Project |
| status | ENUM | Statut réservation |
| startDate | TIMESTAMP | Début de location |
| endDate | TIMESTAMP | Fin de location |
| pickupDate | TIMESTAMP | Date prévue enlèvement |
| returnDate | TIMESTAMP | Date prévue retour |
| totalAmount | DECIMAL | Montant total |
| notes | TEXT | Notes internes |
| createdById | UUID | FK vers User |

### ReservationItem
Ligne de réservation.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| reservationId | UUID | FK vers Reservation |
| articleId | UUID | FK vers Article |
| quantity | INT | Quantité réservée |
| unitPrice | DECIMAL | Prix unitaire |
| discount | DECIMAL | Remise % |
| totalPrice | DECIMAL | Prix total ligne |

### PickingList
Liste de préparation.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| number | VARCHAR | Numéro de picking |
| reservationId | UUID | FK vers Reservation |
| status | ENUM | PENDING, IN_PROGRESS, COMPLETED |
| assignedToId | UUID | FK vers User |
| startedAt | TIMESTAMP | Début préparation |
| completedAt | TIMESTAMP | Fin préparation |

### PickingItem
Ligne de picking.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| pickingListId | UUID | FK vers PickingList |
| articleId | UUID | FK vers Article |
| quantity | INT | Quantité à préparer |
| pickedQuantity | INT | Quantité préparée |
| pickedAt | TIMESTAMP | Date/heure scan |
| pickedById | UUID | FK vers User |

### ReturnCheck
Contrôle de retour.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| number | VARCHAR | Numéro de retour |
| reservationId | UUID | FK vers Reservation |
| status | ENUM | Statut du contrôle |
| checkedById | UUID | FK vers User |
| startedAt | TIMESTAMP | Début contrôle |
| completedAt | TIMESTAMP | Fin contrôle |

### ReturnCheckItem
Ligne de contrôle retour.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| returnCheckId | UUID | FK vers ReturnCheck |
| articleId | UUID | FK vers Article |
| expectedQuantity | INT | Quantité attendue |
| returnedQuantity | INT | Quantité retournée |
| condition | ENUM | État au retour |
| notes | TEXT | Notes/commentaires |
| checkedAt | TIMESTAMP | Date/heure vérification |

### MaintenanceTask
Tâche de maintenance.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| articleId | UUID | FK vers Article |
| type | ENUM | PREVENTIVE, CORRECTIVE, REPAIR |
| priority | ENUM | LOW, MEDIUM, HIGH, URGENT |
| status | ENUM | Statut tâche |
| description | TEXT | Description problème |
| assignedToId | UUID | FK vers User |
| estimatedCost | DECIMAL | Coût estimé |
| actualCost | DECIMAL | Coût réel |
| startedAt | TIMESTAMP | Début intervention |
| completedAt | TIMESTAMP | Fin intervention |
| resolution | TEXT | Description résolution |

### StockMovement
Historique des mouvements de stock.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| articleId | UUID | FK vers Article |
| type | ENUM | IN, OUT, TRANSFER, ADJUSTMENT |
| quantity | INT | Quantité (+ ou -) |
| fromLocationId | UUID | FK vers Location (origine) |
| toLocationId | UUID | FK vers Location (destination) |
| reason | ENUM | Raison du mouvement |
| referenceType | VARCHAR | Type référence (Reservation, etc.) |
| referenceId | UUID | ID de la référence |
| performedById | UUID | FK vers User |
| performedAt | TIMESTAMP | Date/heure mouvement |

## Index recommandés

```sql
-- Articles
CREATE INDEX idx_articles_code ON articles(code);
CREATE INDEX idx_articles_barcode ON articles(barcode);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_branch ON articles(branch_id);
CREATE INDEX idx_articles_category ON articles(category_id);

-- Reservations
CREATE INDEX idx_reservations_number ON reservations(number);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_dates ON reservations(start_date, end_date);
CREATE INDEX idx_reservations_project ON reservations(project_id);

-- Stock movements
CREATE INDEX idx_movements_article ON stock_movements(article_id);
CREATE INDEX idx_movements_date ON stock_movements(performed_at);

-- Full-text search
CREATE INDEX idx_articles_search ON articles
  USING GIN(to_tsvector('french', name || ' ' || COALESCE(description, '')));
```
