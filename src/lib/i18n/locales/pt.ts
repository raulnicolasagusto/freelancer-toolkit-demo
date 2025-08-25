// Português
import type { Translations } from './es';

export const pt: Translations = {
  // === APLICAÇÃO GERAL ===
  app: {
    name: "DevToolkit",
    subtitle: "PRO",
    version: "v1.0.0",
    edition: "Edição Premium"
  },

  // === SIDEBAR ===
  sidebar: {
    // Navegação principal
    nav: {
      sectionTitle: "FERRAMENTAS",
      dashboard: "Dashboard",
      snippets: "Meus Snippets",
      notes: "Minhas Notas", 
      productivity: "Produtividade",
      resources: "Recursos",
      trash: "Lixeira"
    },
    
    // Usuário
    user: {
      name: "João Desenvolvedor",
      email: "joao@exemplo.com"
    }
  },

  // === DASHBOARD ===
  dashboard: {
    // Cabeçalho principal
    header: {
      title: "Bem-vindo de volta",
      subtitle: "Aqui está um resumo da sua atividade e ferramentas disponíveis",
      lastActivity: "Última atividade: há 2 horas"
    },

    // Estatísticas
    stats: {
      snippets: {
        title: "Snippets Salvos",
        trend: "esta semana"
      },
      notes: {
        title: "Notas Ativas", 
        lastUpdate: "Última: há 1h"
      },
      tasks: {
        title: "Tarefas Pendentes",
        completed: "concluídas hoje"
      },
      resources: {
        title: "Recursos Salvos",
        categories: "categorias"
      }
    },

    // Ações rápidas
    quickActions: {
      title: "Ações Rápidas",
      newSnippet: {
        title: "Novo Snippet",
        description: "Salve seu código favorito"
      },
      newNote: {
        title: "Nova Nota", 
        description: "Anote ideias importantes"
      },
      newTask: {
        title: "Nova Tarefa",
        description: "Organize seu trabalho"
      },
      exploreResources: {
        title: "Explorar Recursos",
        description: "Encontre ferramentas úteis"
      }
    },

    // Atividade recente
    recentActivity: {
      title: "Atividade Recente",
      actions: {
        savedSnippet: "Você salvou um novo snippet de React",
        completedTasks: "Você concluiu 2 tarefas do projeto", 
        createdNote: "Você criou uma nota sobre Next.js 15"
      },
      timeAgo: {
        hoursAgo: "há {hours} horas",
        yesterday: "ontem"
      }
    }
  },

  // === TERMOS TEMPORAIS ===
  time: {
    hoursAgo: "há {count} horas",
    yesterday: "ontem",
    today: "hoje",
    thisWeek: "esta semana"
  },

  // === NÚMEROS E CONTADORES ===
  numbers: {
    categories: "categorias",
    completed: "concluídas"
  },

  // === SNIPPETS PAGE ===
  snippets: {
    pageTitle: "Meus Snippets",
    addButton: "Adicionar",
    emptyState: "Você não tem snippets salvos ainda",
    dragToMoveText: "Arraste para uma pasta para mover",
    actions: {
      edit: "Editar snippet",
      delete: "Deletar snippet"
    }
  },

  // === TRASH/LIXEIRA ===
  trash: {
    pageTitle: "Lixeira",
    subtitle: "Itens excluídos há menos de 30 dias",
    emptyState: {
      title: "A lixeira está vazia",
      description: "Os itens excluídos aparecerão aqui e serão automaticamente deletados após 30 dias"
    },
    actions: {
      restore: "Restaurar",
      deleteForever: "Excluir para sempre",
      emptyTrash: "Esvaziar lixeira"
    },
    confirmDelete: {
      title: "Confirmar exclusão",
      message: "Tem certeza de que deseja excluir permanentemente {itemType}?",
      itemWillBeDeleted: "Este item será excluído para sempre e não poderá ser recuperado.",
      warningAutoDelete: "Será automaticamente excluído em {days} dias",
      actions: {
        cancel: "Cancelar",
        deleteForever: "Excluir para sempre",
        moveToTrash: "Mover para lixeira"
      }
    },
    deleteOptions: {
      title: "Como você deseja excluir esta nota?",
      description: "Escolha uma opção para continuar",
      softDelete: {
        title: "Mover para lixeira",
        description: "A nota será movida para a lixeira por 30 dias, depois será automaticamente excluída"
      },
      hardDelete: {
        title: "Excluir para sempre",
        description: "A nota será permanentemente excluída e não poderá ser recuperada"
      }
    },
    itemTypes: {
      note: "nota",
      notes: "notas",
      snippet: "snippet",
      snippets: "snippets"
    }
  },

  // === BARRA DE NAVEGAÇÃO SUPERIOR ===
  topBar: {
    search: {
      placeholder: "Pesquisar aqui...",
      noResults: "Nenhum resultado encontrado",
      searching: "Pesquisando..."
    },
    breadcrumbs: {
      home: "Início"
    },
    actions: {
      notifications: "Notificações",
      settings: "Configurações",
      profile: "Perfil do usuário"
    }
  }
};