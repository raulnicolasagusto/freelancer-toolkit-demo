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
      resources: "Ressources"
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
  }
};