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
      resources: "Recursos"
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
  }
};