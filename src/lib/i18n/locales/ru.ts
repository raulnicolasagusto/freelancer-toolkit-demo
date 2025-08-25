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
      resources: "Ресурсы",
      trash: "Корзина"
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
  },

  // === СТРАНИЦА СНИППЕТОВ ===
  snippets: {
    pageTitle: "Мои Сниппеты",
    addButton: "Добавить",
    emptyState: "У вас пока нет сохранённых сниппетов",
    dragToMoveText: "Перетащите в папку для перемещения",
    actions: {
      edit: "Редактировать сниппет",
      delete: "Удалить сниппет"
    }
  },

  // === TRASH/КОРЗИНА ===
  trash: {
    pageTitle: "Корзина",
    subtitle: "Элементы, удалённые менее 30 дней назад",
    emptyState: {
      title: "Корзина пуста",
      description: "Удалённые элементы будут появляться здесь и автоматически удаляться через 30 дней"
    },
    actions: {
      restore: "Восстановить",
      deleteForever: "Удалить навсегда",
      emptyTrash: "Очистить корзину"
    },
    confirmDelete: {
      title: "Подтвердить удаление",
      message: "Вы уверены, что хотите навсегда удалить {itemType}?",
      itemWillBeDeleted: "Этот элемент будет удалён навсегда и его нельзя будет восстановить.",
      warningAutoDelete: "Будет автоматически удалён через {days} дней",
      actions: {
        cancel: "Отменить",
        deleteForever: "Удалить навсегда",
        moveToTrash: "Переместить в корзину"
      }
    },
    deleteOptions: {
      title: "Как вы хотите удалить эту заметку?",
      description: "Выберите опцию для продолжения",
      softDelete: {
        title: "Переместить в корзину",
        description: "Заметка будет перемещена в корзину на 30 дней, затем автоматически удалена"
      },
      hardDelete: {
        title: "Удалить навсегда",
        description: "Заметка будет навсегда удалена и её нельзя будет восстановить"
      }
    },
    itemTypes: {
      note: "заметку",
      notes: "заметки",
      snippet: "сниппет",
      snippets: "сниппеты"
    }
  },

  // === ВЕРХНЯЯ НАВИГАЦИОННАЯ ПАНЕЛЬ ===
  topBar: {
    search: {
      placeholder: "Поиск здесь...",
      noResults: "Результаты не найдены",
      searching: "Поиск..."
    },
    breadcrumbs: {
      home: "Главная"
    },
    actions: {
      notifications: "Уведомления",
      settings: "Настройки",
      profile: "Профиль пользователя"
    }
  }
};