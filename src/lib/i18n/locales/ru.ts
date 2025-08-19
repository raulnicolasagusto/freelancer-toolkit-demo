// Русский
import type { Translations } from './es';

export const ru: Translations = {
  // === ОБЩЕЕ ПРИЛОЖЕНИЕ ===
  app: {
    name: "DevToolkit",
    subtitle: "PRO",
    version: "v1.0.0",
    edition: "Премиум Издание"
  },

  // === БОКОВАЯ ПАНЕЛЬ ===
  sidebar: {
    // Основная навигация
    nav: {
      sectionTitle: "ИНСТРУМЕНТЫ",
      dashboard: "Панель управления",
      snippets: "Мои Сниппеты",
      notes: "Мои Заметки", 
      productivity: "Продуктивность",
      resources: "Ресурсы"
    },
    
    // Пользователь
    user: {
      name: "Иван Разработчик",
      email: "ivan@example.com"
    }
  },

  // === ПАНЕЛЬ УПРАВЛЕНИЯ ===
  dashboard: {
    // Основной заголовок
    header: {
      title: "Добро пожаловать обратно",
      subtitle: "Вот сводка вашей активности и доступных инструментов",
      lastActivity: "Последняя активность: 2 часа назад"
    },

    // Статистика
    stats: {
      snippets: {
        title: "Сохранённые Сниппеты",
        trend: "на этой неделе"
      },
      notes: {
        title: "Активные Заметки", 
        lastUpdate: "Последняя: 1ч назад"
      },
      tasks: {
        title: "Ожидающие Задачи",
        completed: "выполнено сегодня"
      },
      resources: {
        title: "Сохранённые Ресурсы",
        categories: "категории"
      }
    },

    // Быстрые действия
    quickActions: {
      title: "Быстрые Действия",
      newSnippet: {
        title: "Новый Сниппет",
        description: "Сохраните ваш любимый код"
      },
      newNote: {
        title: "Новая Заметка", 
        description: "Запишите важные идеи"
      },
      newTask: {
        title: "Новая Задача",
        description: "Организуйте вашу работу"
      },
      exploreResources: {
        title: "Изучить Ресурсы",
        description: "Найдите полезные инструменты"
      }
    },

    // Недавняя активность
    recentActivity: {
      title: "Недавняя Активность",
      actions: {
        savedSnippet: "Вы сохранили новый React сниппет",
        completedTasks: "Вы выполнили 2 задачи проекта", 
        createdNote: "Вы создали заметку о Next.js 15"
      },
      timeAgo: {
        hoursAgo: "{hours} часов назад",
        yesterday: "вчера"
      }
    }
  },

  // === ВРЕМЕННЫЕ ТЕРМИНЫ ===
  time: {
    hoursAgo: "{count} часов назад",
    yesterday: "вчера",
    today: "сегодня",
    thisWeek: "на этой неделе"
  },

  // === ЧИСЛА И СЧЕТЧИКИ ===
  numbers: {
    categories: "категории",
    completed: "выполнено"
  }
};