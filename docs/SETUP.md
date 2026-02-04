# Guide d'installation MatFlow

## Prérequis

- **Node.js** 18.x ou supérieur
- **pnpm** 8.x ou supérieur
- **Docker** et Docker Compose
- **Rust** (pour l'application desktop Tauri)

## Installation rapide

### 1. Cloner le repository
```bash
git clone https://github.com/votre-org/matflow.git
cd matflow
```

### 2. Installer les dépendances
```bash
pnpm install
```

### 3. Configurer l'environnement
```bash
cp .env.example .env
# Éditer .env avec vos paramètres
```

### 4. Démarrer les services Docker
```bash
docker-compose up -d
```

Cela démarre:
- PostgreSQL (port 5432)
- Redis (port 6379)
- MinIO (ports 9000, 9001)

### 5. Initialiser la base de données
```bash
cd server
pnpm prisma migrate dev
pnpm prisma db seed
```

### 6. Démarrer le développement
```bash
# Depuis la racine
pnpm dev
```

Cela démarre:
- Server API: http://localhost:3000
- Web App: http://localhost:5173

## Configuration détaillée

### Variables d'environnement

```env
# Base de données
DATABASE_URL="postgresql://matflow:matflow@localhost:5432/matflow"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="votre-secret-super-securise-32-caracteres"
JWT_REFRESH_SECRET="autre-secret-super-securise-32-caracteres"

# Storage (MinIO/S3)
S3_ENDPOINT="http://localhost:9000"
S3_ACCESS_KEY="matflow"
S3_SECRET_KEY="matflow123"
S3_BUCKET="matflow"

# Email (optionnel en dev)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="noreply@example.com"
SMTP_PASS="password"
```

### Base de données

#### Migrations
```bash
# Créer une migration
cd server
pnpm prisma migrate dev --name nom_migration

# Appliquer les migrations (production)
pnpm prisma migrate deploy

# Reset complet
pnpm prisma migrate reset
```

#### Seed
```bash
pnpm prisma db seed
```

Crée:
- Organisation de démo
- Filiales Paris et Lyon
- Utilisateur admin (admin@matflow.local / Admin123!)
- Catégories de base
- Articles de démonstration

### Application Desktop (Tauri)

#### Prérequis supplémentaires
- Rust: https://rustup.rs
- Dépendances système Tauri: https://tauri.app/v1/guides/getting-started/prerequisites

#### Build
```bash
cd apps/desktop
pnpm tauri build
```

### Application Mobile (Expo)

#### Développement
```bash
cd apps/mobile
pnpm start
```

Scannez le QR code avec Expo Go (iOS/Android).

#### Build
```bash
# iOS
pnpm expo build:ios

# Android
pnpm expo build:android
```

## Structure des commandes

```bash
# Racine du projet
pnpm dev          # Démarre tous les services de dev
pnpm build        # Build tous les packages
pnpm lint         # Lint tous les packages
pnpm test         # Lance tous les tests
pnpm typecheck    # Vérifie les types

# Server
pnpm --filter @matflow/server dev
pnpm --filter @matflow/server build
pnpm --filter @matflow/server test

# Web
pnpm --filter @matflow/web dev
pnpm --filter @matflow/web build
pnpm --filter @matflow/web preview

# Desktop
pnpm --filter @matflow/desktop tauri dev
pnpm --filter @matflow/desktop tauri build

# Mobile
pnpm --filter @matflow/mobile start
pnpm --filter @matflow/mobile ios
pnpm --filter @matflow/mobile android
```

## Troubleshooting

### Erreur de connexion à PostgreSQL
```
Vérifiez que Docker est démarré:
docker-compose ps

Redémarrez les conteneurs:
docker-compose down && docker-compose up -d
```

### Erreur de migration Prisma
```
Réinitialisez la base de données:
cd server
pnpm prisma migrate reset
```

### Port déjà utilisé
```
Vérifiez les processus:
lsof -i :3000
lsof -i :5173

Tuez le processus:
kill -9 <PID>
```

### Erreur de permissions MinIO
```
Accédez à la console MinIO: http://localhost:9001
Identifiants: matflow / matflow123
Créez le bucket "matflow" manuellement si nécessaire
```

## Déploiement Production

### Docker
```bash
# Build des images
docker-compose -f docker-compose.prod.yml build

# Démarrage
docker-compose -f docker-compose.prod.yml up -d
```

### Variables d'environnement Production
```env
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@host:5432/matflow"
REDIS_URL="redis://host:6379"
JWT_SECRET="production-secret-très-long-et-complexe"
```

### Checklist déploiement
- [ ] Variables d'environnement configurées
- [ ] Certificats SSL en place
- [ ] Migrations appliquées
- [ ] Backups configurés
- [ ] Monitoring activé
- [ ] Rate limiting configuré
- [ ] CORS configuré pour les domaines autorisés
