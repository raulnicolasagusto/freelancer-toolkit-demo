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
      resources: "Recursos",
      trash: "Papelera de reciclaje"
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
  },

  // === SNIPPETS PAGE ===
  snippets: {
    pageTitle: "Mis Snippets",
    addButton: "Agregar",
    emptyState: "No tienes snippets guardados aún",
    dragToMoveText: "Arrastra a una carpeta para moverlo",
    actions: {
      edit: "Editar snippet",
      delete: "Eliminar snippet"
    }
  },

  // === TRASH/PAPELERA ===
  trash: {
    pageTitle: "Papelera de reciclaje",
    subtitle: "Elementos eliminados hace menos de 30 días",
    emptyState: {
      title: "La papelera está vacía",
      description: "Los elementos eliminados aparecerán aquí y se eliminarán automáticamente después de 30 días"
    },
    actions: {
      restore: "Restaurar",
      deleteForever: "Eliminar para siempre",
      emptyTrash: "Vaciar papelera"
    },
    confirmDelete: {
      title: "Confirmar eliminación",
      message: "¿Estás seguro que deseas eliminar permanentemente {itemType}?",
      itemWillBeDeleted: "Este elemento se eliminará para siempre y no se podrá recuperar.",
      warningAutoDelete: "Se eliminará automáticamente en {days} días",
      actions: {
        cancel: "Cancelar",
        deleteForever: "Eliminar para siempre",
        moveToTrash: "Mover a papelera"
      }
    },
    deleteOptions: {
      title: "¿Cómo deseas eliminar esta nota?",
      description: "Elige una opción para continuar",
      softDelete: {
        title: "Mover a papelera",
        description: "La nota se moverá a la papelera por 30 días, luego se eliminará automáticamente"
      },
      hardDelete: {
        title: "Eliminar para siempre",
        description: "La nota se eliminará permanentemente y no se podrá recuperar"
      }
    },
    itemTypes: {
      note: "nota",
      notes: "notas",
      snippet: "snippet",
      snippets: "snippets"
    }
  },

  // === TOP BAR NAVIGATION ===
  topBar: {
    search: {
      placeholder: "Buscar aquí...",
      noResults: "No se encontraron resultados",
      searching: "Buscando..."
    },
    breadcrumbs: {
      home: "Inicio"
    },
    actions: {
      notifications: "Notificaciones",
      settings: "Configuración", 
      profile: "Perfil de usuario"
    }
  }
} as const;

export type Translations = typeof es;