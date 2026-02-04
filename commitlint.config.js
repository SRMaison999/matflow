export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nouvelle fonctionnalité
        'fix',      // Correction de bug
        'docs',     // Documentation uniquement
        'style',    // Formatage, points-virgules manquants, etc.
        'refactor', // Refactoring du code
        'perf',     // Amélioration des performances
        'test',     // Ajout de tests
        'build',    // Changements système de build
        'ci',       // Changements CI/CD
        'chore',    // Tâches de maintenance
        'revert',   // Annulation d'un commit
      ],
    ],
    'scope-enum': [
      1,
      'always',
      [
        'server',
        'web',
        'mobile',
        'desktop',
        'shared',
        'types',
        'utils',
        'validators',
        'auth',
        'articles',
        'stock',
        'reservations',
        'projects',
        'kits',
        'cases',
        'maintenance',
        'billing',
        'notifications',
        'documents',
        'users',
        'branches',
        'import',
        'export',
        'api',
        'db',
        'ui',
        'i18n',
        'config',
        'deps',
        'release',
      ],
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 200],
  },
};
