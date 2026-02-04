# API Reference MatFlow

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication

Toutes les routes (sauf `/auth/login` et `/auth/register`) nécessitent un token JWT.

### Headers
```
Authorization: Bearer <access_token>
```

---

## Auth

### POST /auth/login
Authentification utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response 200:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "ADMIN",
    "branchId": "uuid"
  },
  "tokens": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "expiresIn": 900
  }
}
```

### POST /auth/logout
Déconnexion et invalidation du refresh token.

**Body:**
```json
{
  "refreshToken": "eyJ..."
}
```

### POST /auth/refresh
Renouvellement du access token.

**Body:**
```json
{
  "refreshToken": "eyJ..."
}
```

### POST /auth/forgot-password
Demande de réinitialisation de mot de passe.

**Body:**
```json
{
  "email": "user@example.com"
}
```

### POST /auth/reset-password
Réinitialisation du mot de passe.

**Body:**
```json
{
  "token": "reset_token",
  "password": "newPassword123"
}
```

---

## Articles

### GET /articles
Liste des articles avec filtres et pagination.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | number | Numéro de page (défaut: 1) |
| limit | number | Éléments par page (défaut: 20, max: 100) |
| search | string | Recherche dans nom, code, description |
| categoryId | uuid | Filtrer par catégorie |
| branchId | uuid | Filtrer par filiale |
| status | string | Filtrer par statut (AVAILABLE, RESERVED, etc.) |
| type | string | Filtrer par type (SERIALIZED, BATCH, CONSUMABLE) |
| sortBy | string | Champ de tri (défaut: createdAt) |
| sortOrder | string | Ordre de tri (asc, desc) |

**Response 200:**
```json
{
  "items": [
    {
      "id": "uuid",
      "code": "ART-001",
      "name": "Projecteur LED 1000W",
      "type": "SERIALIZED",
      "status": "AVAILABLE",
      "category": { "id": "uuid", "name": "Éclairage" },
      "location": { "id": "uuid", "name": "Rack A1" },
      "branch": { "id": "uuid", "name": "Paris" }
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

### POST /articles
Créer un nouvel article.

**Body:**
```json
{
  "code": "ART-001",
  "name": "Projecteur LED 1000W",
  "description": "Projecteur professionnel",
  "type": "SERIALIZED",
  "categoryId": "uuid",
  "branchId": "uuid",
  "locationId": "uuid",
  "serialNumber": "SN123456",
  "barcode": "1234567890123",
  "purchasePrice": 1500.00,
  "rentalPriceDaily": 75.00,
  "weight": 5.5,
  "dimensions": { "length": 30, "width": 20, "height": 15 }
}
```

### GET /articles/:id
Détails d'un article.

### PUT /articles/:id
Mettre à jour un article.

### DELETE /articles/:id
Supprimer un article (soft delete).

### GET /articles/by-code/:code
Rechercher un article par code ou code-barres.

### POST /articles/:id/status
Changer le statut d'un article.

**Body:**
```json
{
  "status": "IN_MAINTENANCE",
  "notes": "Envoyé en réparation"
}
```

---

## Categories

### GET /categories
Liste des catégories.

### POST /categories
Créer une catégorie.

**Body:**
```json
{
  "name": "Éclairage",
  "code": "LIGHT",
  "description": "Équipements d'éclairage",
  "parentId": null
}
```

---

## Reservations

### GET /reservations
Liste des réservations.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| status | string | DRAFT, PENDING, CONFIRMED, etc. |
| clientId | uuid | Filtrer par client |
| projectId | uuid | Filtrer par projet |
| dateFrom | date | Date de début minimum |
| dateTo | date | Date de fin maximum |

### POST /reservations
Créer une réservation.

**Body:**
```json
{
  "projectId": "uuid",
  "startDate": "2024-06-01",
  "endDate": "2024-06-05",
  "items": [
    { "articleId": "uuid", "quantity": 2 },
    { "articleId": "uuid", "quantity": 1 }
  ],
  "notes": "Installation le 31 mai"
}
```

### PUT /reservations/:id/status
Changer le statut d'une réservation.

**Body:**
```json
{
  "status": "CONFIRMED",
  "notes": "Confirmé par le client"
}
```

---

## Picking Lists

### GET /picking-lists
Liste des préparations.

### POST /picking-lists
Créer une liste de picking.

**Body:**
```json
{
  "reservationId": "uuid",
  "assignedToId": "uuid"
}
```

### POST /picking-lists/:id/scan
Scanner un article pour le picking.

**Body:**
```json
{
  "code": "1234567890123"
}
```

**Response 200:**
```json
{
  "success": true,
  "article": {
    "id": "uuid",
    "name": "Projecteur LED 1000W"
  },
  "pickingItem": {
    "id": "uuid",
    "pickedQuantity": 1,
    "quantity": 2
  }
}
```

---

## Return Checks

### GET /return-checks
Liste des contrôles de retour.

### POST /return-checks
Créer un contrôle de retour.

### POST /return-checks/:id/scan
Scanner un article pour le retour.

**Body:**
```json
{
  "code": "1234567890123",
  "condition": "GOOD",
  "notes": ""
}
```

---

## Maintenance

### GET /maintenance-tasks
Liste des tâches de maintenance.

### POST /maintenance-tasks
Créer une tâche de maintenance.

**Body:**
```json
{
  "articleId": "uuid",
  "type": "REPAIR",
  "priority": "HIGH",
  "description": "Remplacement lampe",
  "assignedToId": "uuid"
}
```

---

## Dashboard

### GET /dashboard/stats
Statistiques du tableau de bord.

**Response 200:**
```json
{
  "pendingPickings": 5,
  "pendingReturns": 3,
  "todayReservations": 8,
  "lowStockAlerts": 2,
  "articlesInMaintenance": 4,
  "overdueReturns": 1
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation error",
  "details": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```
