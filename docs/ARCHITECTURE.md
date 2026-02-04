# Architecture MatFlow

## Vue d'ensemble

MatFlow est une application de gestion de stock circulant pour l'événementiel, construite avec une architecture monorepo moderne et multi-plateforme.

## Structure du projet

```
matflow/
├── apps/
│   ├── web/          # Application web React
│   ├── desktop/      # Application desktop Tauri
│   └── mobile/       # Application mobile React Native
├── packages/
│   ├── types/        # Types TypeScript partagés
│   ├── utils/        # Utilitaires partagés
│   └── validators/   # Schémas de validation Zod
├── server/           # Backend Fastify
├── docs/             # Documentation
└── scripts/          # Scripts utilitaires
```

## Stack technique

### Backend (server/)
- **Framework**: Fastify 4.x
- **ORM**: Prisma 5.x
- **Base de données**: PostgreSQL 15
- **Cache**: Redis 7.x
- **Stockage fichiers**: MinIO (S3-compatible)
- **Authentification**: JWT (access + refresh tokens)
- **Validation**: Zod
- **Email**: Nodemailer

### Frontend Web (apps/web/)
- **Framework**: React 18
- **Build**: Vite 5
- **Routing**: React Router 6
- **State**: Zustand + React Query
- **Styles**: TailwindCSS + Radix UI
- **i18n**: react-i18next

### Desktop (apps/desktop/)
- **Framework**: Tauri 1.x
- **Frontend**: React (partagé avec web)
- **Backend natif**: Rust

### Mobile (apps/mobile/)
- **Framework**: React Native + Expo
- **Navigation**: Expo Router
- **Styles**: NativeWind (TailwindCSS)
- **Scanner**: expo-camera + expo-barcode-scanner

### Packages partagés
- **@matflow/types**: Types et interfaces TypeScript
- **@matflow/utils**: Fonctions utilitaires
- **@matflow/validators**: Schémas de validation Zod

## Patterns architecturaux

### Modular Monolith (Backend)
Le backend est organisé en modules fonctionnels indépendants:
- `auth/` - Authentification et autorisation
- `articles/` - Gestion des articles
- `reservations/` - Gestion des réservations
- `operations/` - Picking et retours
- `maintenance/` - Maintenance des articles
- `billing/` - Facturation

Chaque module contient:
- `routes.ts` - Points d'entrée API
- `service.ts` - Logique métier
- `types.ts` - Types locaux (si nécessaire)

### Feature-based (Frontend)
Les applications frontend sont organisées par fonctionnalité:
```
features/
├── dashboard/
├── articles/
├── reservations/
├── operations/
└── ...
```

### Repository Pattern (Data Access)
Prisma est utilisé avec le pattern repository via les services.

## Flux de données

```
[Client] → [API Gateway (Fastify)] → [Service] → [Prisma] → [PostgreSQL]
                    ↓                     ↓
               [JWT Auth]            [Redis Cache]
```

## Sécurité

### Authentification
1. Login avec email/password
2. Génération de tokens JWT (access + refresh)
3. Access token: 15 minutes
4. Refresh token: 7 jours
5. Stockage sécurisé (httpOnly cookies / SecureStore mobile)

### Autorisation
- RBAC (Role-Based Access Control)
- Rôles: SUPER_ADMIN, ADMIN, PROJECT_MANAGER, WAREHOUSE_MANAGER, TECHNICIAN, VIEWER
- Permissions par module et action

### Protection des données
- Chiffrement des mots de passe (Argon2)
- Validation des entrées (Zod)
- Protection CSRF
- Rate limiting
- Audit logs

## Base de données

### Entités principales
- **Organization**: Entreprise cliente
- **Branch**: Filiale/succursale
- **User**: Utilisateur avec rôle
- **Article**: Équipement/matériel
- **Category**: Catégorie d'articles
- **Location**: Emplacement de stockage
- **Client**: Client final
- **Project**: Projet événementiel
- **Reservation**: Réservation de matériel
- **PickingList**: Liste de préparation
- **ReturnCheck**: Contrôle de retour
- **MaintenanceTask**: Tâche de maintenance
- **Quote/Invoice**: Devis et factures

### Relations clés
- Un article appartient à une filiale et une catégorie
- Une réservation contient plusieurs articles
- Un picking est lié à une réservation
- Les mouvements de stock tracent l'historique

## API

### Conventions
- REST avec préfixe `/api/v1`
- Réponses JSON standardisées
- Pagination: `?page=1&limit=20`
- Filtres: `?status=ACTIVE&branchId=xxx`
- Tri: `?sortBy=createdAt&sortOrder=desc`

### Endpoints principaux
```
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh

GET    /articles
POST   /articles
GET    /articles/:id
PUT    /articles/:id
DELETE /articles/:id

GET    /reservations
POST   /reservations
GET    /reservations/:id
PUT    /reservations/:id/status

GET    /picking-lists
POST   /picking-lists
POST   /picking-lists/:id/scan

GET    /return-checks
POST   /return-checks
POST   /return-checks/:id/scan
```

## Déploiement

### Développement
```bash
pnpm install
pnpm dev
```

### Production
```bash
# Build tous les packages
pnpm build

# Docker
docker-compose up -d
```

### Variables d'environnement
Voir `.env.example` pour la liste complète.

## Performance

### Caching
- Redis pour les sessions et données fréquentes
- React Query pour le cache côté client
- Stale-while-revalidate pattern

### Optimisations
- Lazy loading des routes
- Virtualisation des listes longues
- Compression des réponses API
- CDN pour les assets statiques

## Monitoring

### Logs
- Pino pour les logs structurés
- Niveaux: trace, debug, info, warn, error, fatal

### Métriques
- Health checks `/health`
- Métriques Prometheus (optionnel)
- Sentry pour le tracking d'erreurs
