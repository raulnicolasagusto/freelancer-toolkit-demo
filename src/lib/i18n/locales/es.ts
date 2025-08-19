// Español - Idioma base
export const es = {
  // === APLICACIÓN GENERAL ===
  app: {
    name: "DevToolkit",
    subtitle: "PRO",
    version: "v1.0.0",
    edition: "Premium Edition"
  },

  // === SIDEBAR ===
  sidebar: {
    // Navegación principal
    nav: {
      sectionTitle: "HERRAMIENTAS",
      dashboard: "Dashboard",
      snippets: "Mis Snippets",
      notes: "Mis Notas", 
      productivity: "Productividad",
      resources: "Recursos"
    },
    
    // Usuario
    user: {
      name: "John Developer",
      email: "john@example.com"
    }
  },

  // === DASHBOARD ===
  dashboard: {
    // Header principal
    header: {
      title: "Bienvenido de vuelta",
      subtitle: "Aquí tienes un resumen de tu actividad y herramientas disponibles",
      lastActivity: "Última actividad: hace 2 horas"
    },

    // Estadísticas
    stats: {
      snippets: {
        title: "Snippets Guardados",
        trend: "esta semana"
      },
      notes: {
        title: "Notas Activas", 
        lastUpdate: "Última: hace 1h"
      },
      tasks: {
        title: "Tareas Pendientes",
        completed: "completadas hoy"
      },
      resources: {
        title: "Recursos Guardados",
        categories: "categorías"
      }
    },

    // Acciones rápidas
    quickActions: {
      title: "Acciones Rápidas",
      newSnippet: {
        title: "Nuevo Snippet",
        description: "Guarda tu código favorito"
      },
      newNote: {
        title: "Nueva Nota", 
        description: "Anota ideas importantes"
      },
      newTask: {
        title: "Nueva Tarea",
        description: "Organiza tu trabajo"
      },
      exploreResources: {
        title: "Explorar Recursos",
        description: "Encuentra herramientas útiles"
      }
    },

    // Actividad reciente
    recentActivity: {
      title: "Actividad Reciente",
      actions: {
        savedSnippet: "Guardaste un nuevo snippet de React",
        completedTasks: "Completaste 2 tareas del proyecto", 
        createdNote: "Creaste una nota sobre Next.js 15"
      },
      timeAgo: {
        hoursAgo: "hace {hours} horas",
        yesterday: "ayer"
      }
    }
  },

  // === TÉRMINOS TEMPORALES ===
  time: {
    hoursAgo: "hace {count} horas",
    yesterday: "ayer",
    today: "hoy",
    thisWeek: "esta semana"
  },

  // === NÚMEROS Y CONTADORES ===
  numbers: {
    categories: "categorías",
    completed: "completadas"
  }
} as const;

export type Translations = typeof es;