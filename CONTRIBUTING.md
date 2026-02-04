# Contribution à MatFlow

Merci de considérer contribuer à MatFlow !

## Lecture obligatoire

Avant de contribuer, vous **devez** lire et respecter :

| Document | Contenu |
|----------|---------|
| [DEVELOPMENT_GUIDELINES.md](docs/DEVELOPMENT_GUIDELINES.md) | Règles de code obligatoires |
| [TECHNICAL_STACK.md](docs/TECHNICAL_STACK.md) | Stack technique |

## Principes fondamentaux

Ces principes sont **non négociables** :

| Principe | Application |
|----------|-------------|
| **SRP** | 1 composant = 1 responsabilité |
| **DRY** | Pas de code dupliqué |
| **Composition** | Composants réutilisables |
| **Séparation** | UI / Logic / Data en couches distinctes |
| **Tests** | Composants communs testés (90% couverture) |

### Interdictions strictes

- Emojis dans l'interface
- `console.log` en production
- `any` en TypeScript
- Styles inline
- Code commenté laissé dans le code
- Fichiers > 150 lignes (composants)
- `!important` en CSS

### Checklist avant commit

```bash
npm run lint          # Doit passer sans erreur
npm run typecheck     # Doit passer sans erreur
npm run test          # Tests doivent passer
npm run format        # Code formaté
```

## Comment contribuer

### Signaler un bug

1. Vérifier que le bug n'a pas déjà été signalé dans les [issues](../../issues)
2. Créer une nouvelle issue avec le template "Bug Report"
3. Fournir le maximum de détails pour reproduire le bug

### Proposer une fonctionnalité

1. Vérifier que la fonctionnalité n'a pas déjà été proposée
2. Créer une nouvelle issue avec le template "Feature Request"
3. Décrire le cas d'usage et les bénéfices

### Soumettre du code

1. **Fork** le repository
2. Créer une **branche** depuis `develop` : `git checkout -b feature/ma-fonctionnalite`
3. **Commiter** vos changements : `git commit -m 'feat: ajoute ma fonctionnalité'`
4. **Pusher** sur votre fork : `git push origin feature/ma-fonctionnalite`
5. Ouvrir une **Pull Request** vers `develop`

## Conventions

### Branches

- `main` : production stable
- `develop` : développement
- `feature/*` : nouvelles fonctionnalités
- `fix/*` : corrections de bugs
- `hotfix/*` : corrections urgentes production

### Commits

Suivre les [Conventional Commits](https://www.conventionalcommits.org/) :

```
feat: ajoute la fonctionnalité X
fix: corrige le bug Y
docs: met à jour la documentation
style: formatage, pas de changement de code
refactor: refactoring sans changement fonctionnel
test: ajout ou modification de tests
chore: maintenance, dépendances
```

### Code style

- **TypeScript** : strict mode activé
- **ESLint** : configuration partagée
- **Prettier** : formatage automatique
- Pas de `any` sauf exception justifiée
- Fonctions et variables en camelCase
- Composants React en PascalCase
- Fichiers en kebab-case

### Tests

- Écrire des tests pour les nouvelles fonctionnalités
- Maintenir la couverture existante
- Tests unitaires pour la logique métier
- Tests d'intégration pour l'API

### Documentation

- Documenter les fonctions publiques
- Mettre à jour le README si nécessaire
- Commenter le code complexe

## Setup développement

### Prérequis

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL (via Docker)
- Redis (via Docker)

### Installation

```bash
# Cloner le repo
git clone https://github.com/[username]/matflow.git
cd matflow

# Installer les dépendances
pnpm install

# Lancer les services
docker-compose up -d

# Configurer l'environnement
cp .env.example .env

# Lancer les migrations
pnpm db:migrate

# Démarrer en développement
pnpm dev
```

## Questions ?

Ouvrir une issue avec le tag "question" ou contacter les mainteneurs.
