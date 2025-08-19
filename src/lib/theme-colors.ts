// Sistema de colores del tema - DevToolkit Premium
// Organizados por categorías para fácil cambio de temas

export const THEME_COLORS = {
  // === SIDEBAR COLORS ===
  sidebar: {
    // Fondo principal del sidebar
    background: 'bg-slate-800',
    
    // Bordes del sidebar
    border: 'border-slate-700/50',
    borderSeparator: 'border-slate-700/50',
    
    // Botón de toggle/colapso
    toggleButton: {
      text: 'text-slate-400',
      textHover: 'hover:text-white',
      background: 'hover:bg-slate-700/50'
    },
    
    // Sección de usuario
    user: {
      avatarRing: 'ring-blue-500/20',
      avatarBackground: 'bg-blue-500',
      avatarText: 'text-white',
      userName: 'text-white',
      userEmail: 'text-slate-400'
    },
    
    // Navegación
    nav: {
      sectionTitle: 'text-slate-400',
      
      // Items de navegación (estados normales)
      item: {
        text: 'text-slate-300',
        textHover: 'hover:text-white',
        background: 'hover:bg-slate-700/50',
        
        // Estado activo
        active: {
          background: 'bg-blue-500/10',
          text: 'text-blue-400',
          textHover: 'hover:text-blue-300',
          border: 'border-blue-500',
          icon: 'text-blue-400'
        }
      },
      
      // Badges/contadores
      badge: {
        background: 'bg-slate-600',
        text: 'text-slate-200',
        
        // Badge cuando el item está activo
        active: {
          background: 'bg-blue-500/20',
          text: 'text-blue-300'
        }
      }
    },
    
    // Footer del sidebar
    footer: {
      text: 'text-slate-500',
      accent: 'text-blue-400',
      indicator: 'bg-blue-500'
    }
  },

  // === LOGO Y BRANDING ===
  logo: {
    background: 'bg-gradient-to-br from-blue-500 to-blue-600',
    icon: 'text-white',
    title: 'text-white',
    subtitle: 'text-slate-400'
  },

  // === MAIN CONTENT AREA ===
  main: {
    // Fondo principal
    background: 'bg-gradient-to-br from-slate-50 to-slate-100',
    backgroundDark: 'dark:from-slate-900 dark:to-slate-800',
    
    // Contenedor del body
    bodyBackground: 'bg-slate-50',
    bodyBackgroundDark: 'dark:bg-slate-900'
  },

  // === DASHBOARD CONTENT ===
  dashboard: {
    // Headers y títulos
    title: 'text-slate-900 dark:text-white',
    subtitle: 'text-slate-600 dark:text-slate-400',
    metadata: 'text-slate-500 dark:text-slate-400',
    
    // Cards y contenedores
    card: {
      background: 'bg-white dark:bg-slate-800',
      border: 'border-slate-200 dark:border-slate-700',
      shadow: 'hover:shadow-lg'
    },
    
    // Stats cards
    stats: {
      label: 'text-slate-600 dark:text-slate-400',
      value: 'text-slate-900 dark:text-white',
      trend: {
        positive: 'text-green-500',
        neutral: 'text-slate-600 dark:text-slate-400'
      }
    }
  },

  // === ICON COLORS (por categoría) ===
  icons: {
    // Iconos de navegación principal
    dashboard: 'text-slate-500', // Cuando no está activo
    snippets: 'text-blue-500',
    notes: 'text-yellow-500',
    productivity: 'text-green-500',
    resources: 'text-purple-500',
    
    // Iconos de dashboard/stats
    trending: 'text-green-500',
    clock: 'text-blue-500',
    
    // Backgrounds de iconos en cards
    iconBackgrounds: {
      blue: 'bg-blue-500/10',
      yellow: 'bg-yellow-500/10',
      green: 'bg-green-500/10',
      purple: 'bg-purple-500/10'
    }
  },

  // === INTERACTIVE ELEMENTS ===
  buttons: {
    // Quick action buttons
    quickAction: {
      background: 'hover:bg-slate-50 dark:hover:bg-slate-700',
      border: 'border-slate-200 dark:border-slate-600',
      iconHover: 'group-hover:scale-110',
      title: 'text-slate-900 dark:text-white',
      description: 'text-slate-600 dark:text-slate-400'
    }
  },

  // === ACTIVITY FEED ===
  activity: {
    item: {
      border: 'border-slate-100 dark:border-slate-700',
      title: 'text-slate-900 dark:text-white',
      timestamp: 'text-slate-600 dark:text-slate-400'
    }
  },

  // === TRANSITIONS ===
  transitions: {
    default: 'transition-colors',
    shadow: 'transition-shadow',
    all: 'transition-all duration-200',
    transform: 'transition-transform'
  }
} as const;

// Helper function para obtener colores por categoría
export const getThemeColors = () => THEME_COLORS;

// Type para autocompletado
export type ThemeColors = typeof THEME_COLORS;