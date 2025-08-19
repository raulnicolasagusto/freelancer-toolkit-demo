// Italiano
import type { Translations } from './es';

export const it: Translations = {
  // === APPLICAZIONE GENERALE ===
  app: {
    name: "DevToolkit",
    subtitle: "PRO",
    version: "v1.0.0",
    edition: "Edizione Premium"
  },

  // === SIDEBAR ===
  sidebar: {
    // Navigazione principale
    nav: {
      sectionTitle: "STRUMENTI",
      dashboard: "Dashboard",
      snippets: "I Miei Snippet",
      notes: "Le Mie Note", 
      productivity: "Produttività",
      resources: "Risorse"
    },
    
    // Utente
    user: {
      name: "Giovanni Sviluppatore",
      email: "giovanni@esempio.com"
    }
  },

  // === DASHBOARD ===
  dashboard: {
    // Intestazione principale
    header: {
      title: "Bentornato",
      subtitle: "Ecco un riassunto della tua attività e degli strumenti disponibili",
      lastActivity: "Ultima attività: 2 ore fa"
    },

    // Statistiche
    stats: {
      snippets: {
        title: "Snippet Salvati",
        trend: "questa settimana"
      },
      notes: {
        title: "Note Attive", 
        lastUpdate: "Ultima: 1h fa"
      },
      tasks: {
        title: "Attività Pendenti",
        completed: "completate oggi"
      },
      resources: {
        title: "Risorse Salvate",
        categories: "categorie"
      }
    },

    // Azioni rapide
    quickActions: {
      title: "Azioni Rapide",
      newSnippet: {
        title: "Nuovo Snippet",
        description: "Salva il tuo codice preferito"
      },
      newNote: {
        title: "Nuova Nota", 
        description: "Annota idee importanti"
      },
      newTask: {
        title: "Nuova Attività",
        description: "Organizza il tuo lavoro"
      },
      exploreResources: {
        title: "Esplora Risorse",
        description: "Trova strumenti utili"
      }
    },

    // Attività recente
    recentActivity: {
      title: "Attività Recente",
      actions: {
        savedSnippet: "Hai salvato un nuovo snippet React",
        completedTasks: "Hai completato 2 attività del progetto", 
        createdNote: "Hai creato una nota su Next.js 15"
      },
      timeAgo: {
        hoursAgo: "{hours} ore fa",
        yesterday: "ieri"
      }
    }
  },

  // === TERMINI TEMPORALI ===
  time: {
    hoursAgo: "{count} ore fa",
    yesterday: "ieri",
    today: "oggi",
    thisWeek: "questa settimana"
  },

  // === NUMERI E CONTATORI ===
  numbers: {
    categories: "categorie",
    completed: "completate"
  }
};