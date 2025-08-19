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
      resources: "リソース"
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
  }
};