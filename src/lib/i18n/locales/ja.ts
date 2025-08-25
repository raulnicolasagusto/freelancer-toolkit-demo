// 日本語
import type { Translations } from './es';

export const ja: Translations = {
  // === 一般アプリケーション ===
  app: {
    name: "DevToolkit",
    subtitle: "PRO",
    version: "v1.0.0",
    edition: "プレミアム版"
  },

  // === サイドバー ===
  sidebar: {
    // メインナビゲーション
    nav: {
      sectionTitle: "ツール",
      dashboard: "ダッシュボード",
      snippets: "マイスニペット",
      notes: "マイノート", 
      productivity: "生産性",
      resources: "リソース",
      trash: "ゴミ箱"
    },
    
    // ユーザー
    user: {
      name: "田中開発者",
      email: "tanaka@example.com"
    }
  },

  // === ダッシュボード ===
  dashboard: {
    // メインヘッダー
    header: {
      title: "お帰りなさい",
      subtitle: "あなたの活動と利用可能なツールの概要です",
      lastActivity: "最後のアクティビティ：2時間前"
    },

    // 統計
    stats: {
      snippets: {
        title: "保存されたスニペット",
        trend: "今週"
      },
      notes: {
        title: "アクティブなノート", 
        lastUpdate: "最後：1時間前"
      },
      tasks: {
        title: "保留中のタスク",
        completed: "今日完了"
      },
      resources: {
        title: "保存されたリソース",
        categories: "カテゴリ"
      }
    },

    // クイックアクション
    quickActions: {
      title: "クイックアクション",
      newSnippet: {
        title: "新しいスニペット",
        description: "お気に入りのコードを保存"
      },
      newNote: {
        title: "新しいノート", 
        description: "重要なアイデアをメモ"
      },
      newTask: {
        title: "新しいタスク",
        description: "作業を整理する"
      },
      exploreResources: {
        title: "リソースを探索",
        description: "便利なツールを見つける"
      }
    },

    // 最近のアクティビティ
    recentActivity: {
      title: "最近のアクティビティ",
      actions: {
        savedSnippet: "新しいReactスニペットを保存しました",
        completedTasks: "プロジェクトのタスクを2つ完了しました", 
        createdNote: "Next.js 15についてのノートを作成しました"
      },
      timeAgo: {
        hoursAgo: "{hours}時間前",
        yesterday: "昨日"
      }
    }
  },

  // === 時間用語 ===
  time: {
    hoursAgo: "{count}時間前",
    yesterday: "昨日",
    today: "今日",
    thisWeek: "今週"
  },

  // === 数字とカウンター ===
  numbers: {
    categories: "カテゴリ",
    completed: "完了"
  },

  // === スニペットページ ===
  snippets: {
    pageTitle: "マイスニペット",
    addButton: "追加",
    emptyState: "まだ保存されたスニペットがありません",
    dragToMoveText: "フォルダにドラッグして移動",
    actions: {
      edit: "スニペットを編集",
      delete: "スニペットを削除"
    }
  },

  // === TRASH/ゴミ箱 ===
  trash: {
    pageTitle: "ゴミ箱",
    subtitle: "30日未満に削除されたアイテム",
    emptyState: {
      title: "ゴミ箱は空です",
      description: "削除されたアイテムがここに表示され、30日後に自動的に削除されます"
    },
    actions: {
      restore: "復元",
      deleteForever: "完全に削除",
      emptyTrash: "ゴミ箱を空にする"
    },
    confirmDelete: {
      title: "削除の確認",
      message: "{itemType}を完全に削除してもよろしいですか？",
      itemWillBeDeleted: "このアイテムは完全に削除され、復元できません。",
      warningAutoDelete: "{days}日後に自動的に削除されます",
      actions: {
        cancel: "キャンセル",
        deleteForever: "完全に削除",
        moveToTrash: "ゴミ箱に移動"
      }
    },
    deleteOptions: {
      title: "このノートをどのように削除しますか？",
      description: "継続するためのオプションを選択してください",
      softDelete: {
        title: "ゴミ箱に移動",
        description: "ノートは30日間ゴミ箱に移動され、その後自動的に削除されます"
      },
      hardDelete: {
        title: "完全に削除",
        description: "ノートは完全に削除され、復元できません"
      }
    },
    itemTypes: {
      note: "ノート",
      notes: "ノート",
      snippet: "スニペット",
      snippets: "スニペット"
    }
  },

  // === 上部ナビゲーションバー ===
  topBar: {
    search: {
      placeholder: "ここで検索...",
      noResults: "結果が見つかりません",
      searching: "検索中..."
    },
    breadcrumbs: {
      home: "ホーム"
    },
    actions: {
      notifications: "通知",
      settings: "設定",
      profile: "ユーザープロフィール"
    }
  }
};