// Français
import type { Translations } from './es';

export const fr: Translations = {
  // === APPLICATION GÉNÉRALE ===
  app: {
    name: "DevToolkit",
    subtitle: "PRO",
    version: "v1.0.0",
    edition: "Édition Premium"
  },

  // === SIDEBAR ===
  sidebar: {
    // Navigation principale
    nav: {
      sectionTitle: "OUTILS",
      dashboard: "Tableau de bord",
      snippets: "Mes Snippets",
      notes: "Mes Notes", 
      productivity: "Productivité",
      resources: "Ressources",
      trash: "Corbeille"
    },
    
    // Utilisateur
    user: {
      name: "Jean Développeur",
      email: "jean@exemple.com"
    }
  },

  // === DASHBOARD ===
  dashboard: {
    // En-tête principal
    header: {
      title: "Bon retour",
      subtitle: "Voici un résumé de votre activité et des outils disponibles",
      lastActivity: "Dernière activité : il y a 2 heures"
    },

    // Statistiques
    stats: {
      snippets: {
        title: "Snippets Sauvegardés",
        trend: "cette semaine"
      },
      notes: {
        title: "Notes Actives", 
        lastUpdate: "Dernière : il y a 1h"
      },
      tasks: {
        title: "Tâches En Attente",
        completed: "terminées aujourd'hui"
      },
      resources: {
        title: "Ressources Sauvegardées",
        categories: "catégories"
      }
    },

    // Actions rapides
    quickActions: {
      title: "Actions Rapides",
      newSnippet: {
        title: "Nouveau Snippet",
        description: "Sauvegardez votre code favori"
      },
      newNote: {
        title: "Nouvelle Note", 
        description: "Notez des idées importantes"
      },
      newTask: {
        title: "Nouvelle Tâche",
        description: "Organisez votre travail"
      },
      exploreResources: {
        title: "Explorer les Ressources",
        description: "Trouvez des outils utiles"
      }
    },

    // Activité récente
    recentActivity: {
      title: "Activité Récente",
      actions: {
        savedSnippet: "Vous avez sauvegardé un nouveau snippet React",
        completedTasks: "Vous avez terminé 2 tâches du projet", 
        createdNote: "Vous avez créé une note sur Next.js 15"
      },
      timeAgo: {
        hoursAgo: "il y a {hours} heures",
        yesterday: "hier"
      }
    }
  },

  // === TERMES TEMPORELS ===
  time: {
    hoursAgo: "il y a {count} heures",
    yesterday: "hier",
    today: "aujourd'hui",
    thisWeek: "cette semaine"
  },

  // === NOMBRES ET COMPTEURS ===
  numbers: {
    categories: "catégories",
    completed: "terminées"
  },

  snippets: {
    pageTitle: "Mes Snippets",
    addButton: "Ajouter",
    emptyState: "Vous n'avez pas encore de snippets sauvegardés",
    dragToMoveText: "Glissez vers un dossier pour le déplacer",
    actions: {
      edit: "Modifier snippet",
      delete: "Supprimer snippet"
    }
  },

  // === TRASH/CORBEILLE ===
  trash: {
    pageTitle: "Corbeille",
    subtitle: "Éléments supprimés il y a moins de 30 jours",
    emptyState: {
      title: "La corbeille est vide",
      description: "Les éléments supprimés apparaîtront ici et seront automatiquement supprimés après 30 jours"
    },
    actions: {
      restore: "Restaurer",
      deleteForever: "Supprimer définitivement",
      emptyTrash: "Vider la corbeille"
    },
    confirmDelete: {
      title: "Confirmer la suppression",
      message: "Êtes-vous sûr de vouloir supprimer définitivement {itemType}?",
      itemWillBeDeleted: "Cet élément sera supprimé définitivement et ne pourra pas être récupéré.",
      warningAutoDelete: "Sera automatiquement supprimé dans {days} jours",
      actions: {
        cancel: "Annuler",
        deleteForever: "Supprimer définitivement",
        moveToTrash: "Déplacer vers la corbeille"
      }
    },
    deleteOptions: {
      title: "Comment voulez-vous supprimer cette note?",
      description: "Choisissez une option pour continuer",
      softDelete: {
        title: "Déplacer vers la corbeille",
        description: "La note sera déplacée vers la corbeille pendant 30 jours, puis automatiquement supprimée"
      },
      hardDelete: {
        title: "Supprimer définitivement",
        description: "La note sera définitivement supprimée et ne pourra pas être récupérée"
      }
    },
    itemTypes: {
      note: "note",
      notes: "notes",
      snippet: "snippet",
      snippets: "snippets"
    }
  },

  // === BARRE DE NAVIGATION SUPÉRIEURE ===
  topBar: {
    search: {
      placeholder: "Rechercher ici...",
      noResults: "Aucun résultat trouvé",
      searching: "Recherche..."
    },
    breadcrumbs: {
      home: "Accueil"
    },
    actions: {
      notifications: "Notifications",
      settings: "Paramètres",
      profile: "Profil utilisateur"
    }
  }
};