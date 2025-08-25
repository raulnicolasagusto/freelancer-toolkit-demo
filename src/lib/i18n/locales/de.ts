// Deutsch
import type { Translations } from './es';

export const de: Translations = {
  // === ALLGEMEINE ANWENDUNG ===
  app: {
    name: "DevToolkit",
    subtitle: "PRO",
    version: "v1.0.0",
    edition: "Premium Edition"
  },

  // === SIDEBAR ===
  sidebar: {
    // Hauptnavigation
    nav: {
      sectionTitle: "WERKZEUGE",
      dashboard: "Dashboard",
      snippets: "Meine Snippets",
      notes: "Meine Notizen", 
      productivity: "Produktivität",
      resources: "Ressourcen",
      trash: "Papierkorb"
    },
    
    // Benutzer
    user: {
      name: "Johann Entwickler",
      email: "johann@beispiel.com"
    }
  },

  // === DASHBOARD ===
  dashboard: {
    // Hauptüberschrift
    header: {
      title: "Willkommen zurück",
      subtitle: "Hier ist eine Zusammenfassung Ihrer Aktivität und verfügbaren Tools",
      lastActivity: "Letzte Aktivität: vor 2 Stunden"
    },

    // Statistiken
    stats: {
      snippets: {
        title: "Gespeicherte Snippets",
        trend: "diese Woche"
      },
      notes: {
        title: "Aktive Notizen", 
        lastUpdate: "Letzte: vor 1h"
      },
      tasks: {
        title: "Ausstehende Aufgaben",
        completed: "heute abgeschlossen"
      },
      resources: {
        title: "Gespeicherte Ressourcen",
        categories: "Kategorien"
      }
    },

    // Schnellaktionen
    quickActions: {
      title: "Schnellaktionen",
      newSnippet: {
        title: "Neues Snippet",
        description: "Speichern Sie Ihren Lieblingscode"
      },
      newNote: {
        title: "Neue Notiz", 
        description: "Notieren Sie wichtige Ideen"
      },
      newTask: {
        title: "Neue Aufgabe",
        description: "Organisieren Sie Ihre Arbeit"
      },
      exploreResources: {
        title: "Ressourcen Erkunden",
        description: "Finden Sie nützliche Tools"
      }
    },

    // Kürzliche Aktivität
    recentActivity: {
      title: "Kürzliche Aktivität",
      actions: {
        savedSnippet: "Sie haben ein neues React-Snippet gespeichert",
        completedTasks: "Sie haben 2 Projektaufgaben abgeschlossen", 
        createdNote: "Sie haben eine Notiz über Next.js 15 erstellt"
      },
      timeAgo: {
        hoursAgo: "vor {hours} Stunden",
        yesterday: "gestern"
      }
    }
  },

  // === ZEITBEGRIFFE ===
  time: {
    hoursAgo: "vor {count} Stunden",
    yesterday: "gestern",
    today: "heute",
    thisWeek: "diese Woche"
  },

  // === ZAHLEN UND ZÄHLER ===
  numbers: {
    categories: "Kategorien",
    completed: "abgeschlossen"
  },

  // === SNIPPETS SEITE ===
  snippets: {
    pageTitle: "Meine Snippets",
    addButton: "Hinzufügen",
    emptyState: "Sie haben noch keine Snippets gespeichert",
    dragToMoveText: "In einen Ordner ziehen, um es zu verschieben",
    actions: {
      edit: "Snippet bearbeiten",
      delete: "Snippet löschen"
    }
  },

  // === TRASH/PAPIERKORB ===
  trash: {
    pageTitle: "Papierkorb",
    subtitle: "Elemente, die vor weniger als 30 Tagen gelöscht wurden",
    emptyState: {
      title: "Der Papierkorb ist leer",
      description: "Gelöschte Elemente werden hier angezeigt und nach 30 Tagen automatisch gelöscht"
    },
    actions: {
      restore: "Wiederherstellen",
      deleteForever: "Endgültig löschen",
      emptyTrash: "Papierkorb leeren"
    },
    confirmDelete: {
      title: "Löschung bestätigen",
      message: "Sind Sie sicher, dass Sie {itemType} dauerhaft löschen möchten?",
      itemWillBeDeleted: "Dieses Element wird endgültig gelöscht und kann nicht wiederhergestellt werden.",
      warningAutoDelete: "Wird automatisch in {days} Tagen gelöscht",
      actions: {
        cancel: "Abbrechen",
        deleteForever: "Endgültig löschen",
        moveToTrash: "In Papierkorb verschieben"
      }
    },
    deleteOptions: {
      title: "Wie möchten Sie diese Notiz löschen?",
      description: "Wählen Sie eine Option, um fortzufahren",
      softDelete: {
        title: "In Papierkorb verschieben",
        description: "Die Notiz wird für 30 Tage in den Papierkorb verschoben und dann automatisch gelöscht"
      },
      hardDelete: {
        title: "Endgültig löschen",
        description: "Die Notiz wird dauerhaft gelöscht und kann nicht wiederhergestellt werden"
      }
    },
    itemTypes: {
      note: "Notiz",
      notes: "Notizen",
      snippet: "Snippet",
      snippets: "Snippets"
    }
  },

  // === OBERE NAVIGATIONSLEISTE ===
  topBar: {
    search: {
      placeholder: "Hier suchen...",
      noResults: "Keine Ergebnisse gefunden",
      searching: "Suche..."
    },
    breadcrumbs: {
      home: "Startseite"
    },
    actions: {
      notifications: "Benachrichtigungen",
      settings: "Einstellungen",
      profile: "Benutzerprofil"
    }
  }
};