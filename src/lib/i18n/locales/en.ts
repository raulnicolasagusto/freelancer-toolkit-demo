// English
import type { Translations } from './es';

export const en: Translations = {
  // === GENERAL APPLICATION ===
  app: {
    name: "DevToolkit",
    subtitle: "PRO",
    version: "v1.0.0",
    edition: "Premium Edition"
  },

  // === SIDEBAR ===
  sidebar: {
    // Main navigation
    nav: {
      sectionTitle: "TOOLS",
      dashboard: "Dashboard",
      snippets: "My Snippets",
      notes: "My Notes", 
      productivity: "Productivity",
      resources: "Resources",
      trash: "Recycle Bin"
    },
    
    // User
    user: {
      name: "John Developer",
      email: "john@example.com"
    }
  },

  // === DASHBOARD ===
  dashboard: {
    // Main header
    header: {
      title: "Welcome back",
      subtitle: "Here's a summary of your activity and available tools",
      lastActivity: "Last activity: 2 hours ago"
    },

    // Statistics
    stats: {
      snippets: {
        title: "Saved Snippets",
        trend: "this week"
      },
      notes: {
        title: "Active Notes", 
        lastUpdate: "Last: 1h ago"
      },
      tasks: {
        title: "Pending Tasks",
        completed: "completed today"
      },
      resources: {
        title: "Saved Resources",
        categories: "categories"
      }
    },

    // Quick actions
    quickActions: {
      title: "Quick Actions",
      newSnippet: {
        title: "New Snippet",
        description: "Save your favorite code"
      },
      newNote: {
        title: "New Note", 
        description: "Write down important ideas"
      },
      newTask: {
        title: "New Task",
        description: "Organize your work"
      },
      exploreResources: {
        title: "Explore Resources",
        description: "Find useful tools"
      }
    },

    // Recent activity
    recentActivity: {
      title: "Recent Activity",
      actions: {
        savedSnippet: "You saved a new React snippet",
        completedTasks: "You completed 2 project tasks", 
        createdNote: "You created a note about Next.js 15"
      },
      timeAgo: {
        hoursAgo: "{hours} hours ago",
        yesterday: "yesterday"
      }
    }
  },

  // === TIME TERMS ===
  time: {
    hoursAgo: "{count} hours ago",
    yesterday: "yesterday",
    today: "today",
    thisWeek: "this week"
  },

  // === NUMBERS AND COUNTERS ===
  numbers: {
    categories: "categories",
    completed: "completed"
  },

  // === TRASH/RECYCLE BIN ===
  trash: {
    pageTitle: "Recycle Bin",
    subtitle: "Items deleted less than 30 days ago",
    emptyState: {
      title: "Recycle bin is empty",
      description: "Deleted items will appear here and will be automatically deleted after 30 days"
    },
    actions: {
      restore: "Restore",
      deleteForever: "Delete forever",
      emptyTrash: "Empty trash"
    },
    confirmDelete: {
      title: "Confirm deletion",
      message: "Are you sure you want to permanently delete {itemType}?",
      itemWillBeDeleted: "This item will be deleted forever and cannot be recovered.",
      warningAutoDelete: "Will be automatically deleted in {days} days",
      actions: {
        cancel: "Cancel",
        deleteForever: "Delete forever",
        moveToTrash: "Move to trash"
      }
    },
    deleteOptions: {
      title: "How do you want to delete this note?",
      description: "Choose an option to continue",
      softDelete: {
        title: "Move to trash",
        description: "The note will be moved to trash for 30 days, then automatically deleted"
      },
      hardDelete: {
        title: "Delete forever",
        description: "The note will be permanently deleted and cannot be recovered"
      }
    },
    itemTypes: {
      note: "note",
      notes: "notes",
      snippet: "snippet",
      snippets: "snippets"
    }
  },

  // === SNIPPETS PAGE ===
  snippets: {
    pageTitle: "My Snippets",
    addButton: "Add",
    emptyState: "You don't have any saved snippets yet",
    dragToMoveText: "Drag to a folder to move it",
    actions: {
      edit: "Edit snippet",
      delete: "Delete snippet"
    }
  },

  // === TOP BAR NAVIGATION ===
  topBar: {
    search: {
      placeholder: "Search here...",
      noResults: "No results found",
      searching: "Searching..."
    },
    breadcrumbs: {
      home: "Home"
    },
    actions: {
      notifications: "Notifications",
      settings: "Settings", 
      profile: "User profile"
    }
  }
};