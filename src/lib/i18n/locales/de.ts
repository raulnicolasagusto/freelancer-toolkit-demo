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
      resources: "Ressourcen"
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
  }
};