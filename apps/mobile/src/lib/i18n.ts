import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = 'user_language';

const resources = {
  fr: {
    translation: {
      common: {
        ok: 'OK',
        cancel: 'Annuler',
        back: 'Retour',
        goBack: 'Retour',
        done: 'Terminé',
        save: 'Enregistrer',
        delete: 'Supprimer',
        edit: 'Modifier',
        search: 'Rechercher',
        loading: 'Chargement...',
        error: 'Erreur',
        success: 'Succès',
        enabled: 'Activé',
        disabled: 'Désactivé',
      },
      error: 'Erreur',
      auth: {
        subtitle: 'Gestion de stock événementiel',
        email: 'Email',
        emailPlaceholder: 'votre@email.com',
        password: 'Mot de passe',
        passwordPlaceholder: '••••••••',
        login: 'Se connecter',
        forgotPassword: 'Mot de passe oublié ?',
        fillAllFields: 'Veuillez remplir tous les champs',
        loginFailed: 'Échec de la connexion',
        enterEmail: 'Veuillez entrer votre email',
        resetFailed: 'Échec de la réinitialisation',
        checkEmail: 'Vérifiez votre email',
        resetEmailSent: 'Un email de réinitialisation a été envoyé à {{email}}',
        backToLogin: 'Retour à la connexion',
        resetPassword: 'Réinitialiser le mot de passe',
        resetPasswordDescription: 'Entrez votre email pour recevoir un lien de réinitialisation',
        sendResetLink: 'Envoyer le lien',
      },
      tabs: {
        home: 'Accueil',
        picking: 'Picking',
        scan: 'Scanner',
        returns: 'Retours',
        profile: 'Profil',
      },
      home: {
        welcome: 'Bienvenue',
        pendingPickings: 'Pickings en attente',
        pendingReturns: 'Retours en attente',
        todayReservations: "Réservations du jour",
        stockAlerts: 'Alertes stock',
        quickActions: 'Actions rapides',
        quickScan: 'Scan rapide',
        newPicking: 'Nouveau picking',
        newReturn: 'Nouveau retour',
        searchArticle: 'Rechercher un article',
      },
      picking: {
        title: 'Picking',
        searchPlaceholder: 'Rechercher un picking...',
        noPickingLists: 'Aucun picking en cours',
        noProject: 'Sans projet',
        items: 'articles',
        scanToAdd: 'Scanner pour ajouter',
        status: {
          pending: 'En attente',
          in_progress: 'En cours',
          completed: 'Terminé',
        },
      },
      returns: {
        title: 'Retours',
        searchPlaceholder: 'Rechercher un retour...',
        noReturns: 'Aucun retour en cours',
        noProject: 'Sans projet',
        items: 'articles',
        scanToReturn: 'Scanner pour retourner',
        status: {
          pending: 'En attente',
          in_progress: 'En cours',
          completed: 'Terminé',
        },
      },
      scan: {
        title: 'Scanner',
        subtitle: 'Sélectionnez un mode de scan',
        articleInfo: 'Info article',
        articleInfoDesc: 'Voir les détails d\'un article',
        picking: 'Picking',
        pickingDesc: 'Ajouter un article au picking',
        return: 'Retour',
        returnDesc: 'Enregistrer un retour',
        inventory: 'Inventaire',
        inventoryDesc: 'Scanner pour l\'inventaire',
        maintenance: 'Maintenance',
        maintenanceDesc: 'Signaler un problème',
        quickScan: 'Scan rapide',
      },
      scanner: {
        title: 'Scanner',
        requestingPermission: 'Demande de permission...',
        permissionRequired: 'Permission caméra requise pour scanner les codes-barres',
        grantPermission: 'Autoriser la caméra',
        instruction: 'Placez le code-barres dans le cadre',
        scanAgain: 'Scanner à nouveau',
        error: 'Erreur de scan',
        scanFailed: 'Échec du scan',
        articleNotFound: 'Article non trouvé',
        articleNotFoundDesc: 'Aucun article correspondant à ce code',
        itemPicked: 'Article scanné',
        itemPickedDesc: '{{name}} ajouté au picking',
        itemScanned: 'Article scanné',
        itemScannedDesc: '{{name}} enregistré',
        continue: 'Continuer',
        modes: {
          article: 'Info article',
          picking: 'Mode Picking',
          return: 'Mode Retour',
          inventory: 'Mode Inventaire',
          maintenance: 'Mode Maintenance',
        },
      },
      article: {
        details: 'Détails de l\'article',
        notFound: 'Article non trouvé',
        category: 'Catégorie',
        location: 'Emplacement',
        branch: 'Filiale',
        type: 'Type',
        serialNumber: 'Numéro de série',
        barcode: 'Code-barres',
        pricing: 'Tarification',
        purchasePrice: 'Prix d\'achat',
        rentalPriceDaily: 'Prix location/jour',
        maintenance: 'Maintenance',
        lastMaintenance: 'Dernière maintenance',
        nextMaintenance: 'Prochaine maintenance',
        reportIssue: 'Signaler',
        history: 'Historique',
        status: {
          available: 'Disponible',
          reserved: 'Réservé',
          in_use: 'En utilisation',
          in_transit: 'En transit',
          in_maintenance: 'En maintenance',
          out_of_service: 'Hors service',
          lost: 'Perdu',
          sold: 'Vendu',
        },
        types: {
          serialized: 'Sérialisé',
          batch: 'Lot',
          consumable: 'Consommable',
        },
      },
      profile: {
        title: 'Profil',
        currentBranch: 'Filiale actuelle',
        editProfile: 'Modifier le profil',
        notifications: 'Notifications',
        language: 'Langue',
        darkMode: 'Mode sombre',
        privacy: 'Confidentialité',
        help: 'Aide',
        about: 'À propos',
        logout: 'Déconnexion',
        logoutConfirmTitle: 'Déconnexion',
        logoutConfirmMessage: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      },
      roles: {
        super_admin: 'Super Admin',
        admin: 'Administrateur',
        project_manager: 'Chef de projet',
        warehouse_manager: 'Responsable entrepôt',
        technician: 'Technicien',
        viewer: 'Observateur',
      },
    },
  },
  de: {
    translation: {
      common: {
        ok: 'OK',
        cancel: 'Abbrechen',
        back: 'Zurück',
        goBack: 'Zurück',
        done: 'Fertig',
        save: 'Speichern',
        delete: 'Löschen',
        edit: 'Bearbeiten',
        search: 'Suchen',
        loading: 'Laden...',
        error: 'Fehler',
        success: 'Erfolg',
        enabled: 'Aktiviert',
        disabled: 'Deaktiviert',
      },
      error: 'Fehler',
      auth: {
        subtitle: 'Event-Lagerverwaltung',
        email: 'E-Mail',
        emailPlaceholder: 'ihre@email.com',
        password: 'Passwort',
        passwordPlaceholder: '••••••••',
        login: 'Anmelden',
        forgotPassword: 'Passwort vergessen?',
        fillAllFields: 'Bitte füllen Sie alle Felder aus',
        loginFailed: 'Anmeldung fehlgeschlagen',
      },
      tabs: {
        home: 'Start',
        picking: 'Picking',
        scan: 'Scanner',
        returns: 'Rückgaben',
        profile: 'Profil',
      },
      home: {
        welcome: 'Willkommen',
        pendingPickings: 'Ausstehende Pickings',
        pendingReturns: 'Ausstehende Rückgaben',
        todayReservations: 'Reservierungen heute',
        stockAlerts: 'Lageralarme',
        quickActions: 'Schnellaktionen',
        quickScan: 'Schnellscan',
        newPicking: 'Neues Picking',
        newReturn: 'Neue Rückgabe',
        searchArticle: 'Artikel suchen',
      },
    },
  },
  en: {
    translation: {
      common: {
        ok: 'OK',
        cancel: 'Cancel',
        back: 'Back',
        goBack: 'Go Back',
        done: 'Done',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        search: 'Search',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        enabled: 'Enabled',
        disabled: 'Disabled',
      },
      error: 'Error',
      auth: {
        subtitle: 'Event Stock Management',
        email: 'Email',
        emailPlaceholder: 'your@email.com',
        password: 'Password',
        passwordPlaceholder: '••••••••',
        login: 'Sign In',
        forgotPassword: 'Forgot Password?',
        fillAllFields: 'Please fill in all fields',
        loginFailed: 'Login failed',
      },
      tabs: {
        home: 'Home',
        picking: 'Picking',
        scan: 'Scanner',
        returns: 'Returns',
        profile: 'Profile',
      },
      home: {
        welcome: 'Welcome',
        pendingPickings: 'Pending Pickings',
        pendingReturns: 'Pending Returns',
        todayReservations: "Today's Reservations",
        stockAlerts: 'Stock Alerts',
        quickActions: 'Quick Actions',
        quickScan: 'Quick Scan',
        newPicking: 'New Picking',
        newReturn: 'New Return',
        searchArticle: 'Search Article',
      },
    },
  },
  it: {
    translation: {
      common: {
        ok: 'OK',
        cancel: 'Annulla',
        back: 'Indietro',
        goBack: 'Torna indietro',
        done: 'Fatto',
        save: 'Salva',
        delete: 'Elimina',
        edit: 'Modifica',
        search: 'Cerca',
        loading: 'Caricamento...',
        error: 'Errore',
        success: 'Successo',
        enabled: 'Abilitato',
        disabled: 'Disabilitato',
      },
      error: 'Errore',
      auth: {
        subtitle: 'Gestione magazzino eventi',
        email: 'Email',
        emailPlaceholder: 'tua@email.com',
        password: 'Password',
        passwordPlaceholder: '••••••••',
        login: 'Accedi',
        forgotPassword: 'Password dimenticata?',
      },
      tabs: {
        home: 'Home',
        picking: 'Picking',
        scan: 'Scanner',
        returns: 'Resi',
        profile: 'Profilo',
      },
    },
  },
};

const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage) {
        callback(savedLanguage);
        return;
      }
    } catch (error) {
      console.error('Error reading language', error);
    }

    // Default to device locale or French
    const deviceLocale = Localization.locale.split('-')[0];
    const supportedLocales = ['fr', 'de', 'en', 'it'];
    callback(supportedLocales.includes(deviceLocale) ? deviceLocale : 'fr');
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lng);
    } catch (error) {
      console.error('Error saving language', error);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
