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
      resources: "Risorse",
      trash: "Cestino"
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
  },

  // === SNIPPETS PAGE ===
  snippets: {
    pageTitle: "I Miei Snippet",
    addButton: "Aggiungi",
    emptyState: "Non hai ancora snippet salvati",
    dragToMoveText: "Trascina in una cartella per spostarlo",
    actions: {
      edit: "Modifica snippet",
      delete: "Elimina snippet"
    }
  },

  // === TRASH/CESTINO ===
  trash: {
    pageTitle: "Cestino",
    subtitle: "Elementi eliminati da meno di 30 giorni",
    emptyState: {
      title: "Il cestino è vuoto",
      description: "Gli elementi eliminati appariranno qui e saranno automaticamente eliminati dopo 30 giorni"
    },
    actions: {
      restore: "Ripristina",
      deleteForever: "Elimina per sempre",
      emptyTrash: "Svuota cestino"
    },
    confirmDelete: {
      title: "Conferma eliminazione",
      message: "Sei sicuro di voler eliminare permanentemente {itemType}?",
      itemWillBeDeleted: "Questo elemento sarà eliminato per sempre e non potrà essere recuperato.",
      warningAutoDelete: "Sarà automaticamente eliminato in {days} giorni",
      actions: {
        cancel: "Annulla",
        deleteForever: "Elimina per sempre",
        moveToTrash: "Sposta nel cestino"
      }
    },
    deleteOptions: {
      title: "Come vuoi eliminare questa nota?",
      description: "Scegli un'opzione per continuare",
      softDelete: {
        title: "Sposta nel cestino",
        description: "La nota sarà spostata nel cestino per 30 giorni, poi sarà automaticamente eliminata"
      },
      hardDelete: {
        title: "Elimina per sempre",
        description: "La nota sarà permanentemente eliminata e non potrà essere recuperata"
      }
    },
    itemTypes: {
      note: "nota",
      notes: "note",
      snippet: "snippet",
      snippets: "snippets"
    }
  },

  // === BARRA DI NAVIGAZIONE SUPERIORE ===
  topBar: {
    search: {
      placeholder: "Cerca qui...",
      noResults: "Nessun risultato trovato",
      searching: "Ricerca in corso..."
    },
    breadcrumbs: {
      home: "Home"
    },
    actions: {
      notifications: "Notifiche",
      settings: "Impostazioni",
      profile: "Profilo utente"
    }
  }
};