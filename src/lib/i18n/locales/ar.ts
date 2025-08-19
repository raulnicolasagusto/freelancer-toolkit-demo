// العربية (RTL)
import type { Translations } from './es';

export const ar: Translations = {
  // === التطبيق العام ===
  app: {
    name: "DevToolkit",
    subtitle: "PRO",
    version: "v1.0.0",
    edition: "الإصدار المميز"
  },

  // === الشريط الجانبي ===
  sidebar: {
    // التنقل الرئيسي
    nav: {
      sectionTitle: "الأدوات",
      dashboard: "لوحة التحكم",
      snippets: "مقاطع الكود",
      notes: "ملاحظاتي", 
      productivity: "الإنتاجية",
      resources: "الموارد"
    },
    
    // المستخدم
    user: {
      name: "أحمد المطور",
      email: "ahmed@example.com"
    }
  },

  // === لوحة التحكم ===
  dashboard: {
    // العنوان الرئيسي
    header: {
      title: "مرحباً بعودتك",
      subtitle: "إليك ملخص لنشاطك والأدوات المتاحة",
      lastActivity: "آخر نشاط: منذ ساعتين"
    },

    // الإحصائيات
    stats: {
      snippets: {
        title: "مقاطع الكود المحفوظة",
        trend: "هذا الأسبوع"
      },
      notes: {
        title: "الملاحظات النشطة", 
        lastUpdate: "الأخيرة: منذ ساعة"
      },
      tasks: {
        title: "المهام المعلقة",
        completed: "مكتملة اليوم"
      },
      resources: {
        title: "الموارد المحفوظة",
        categories: "فئات"
      }
    },

    // الإجراءات السريعة
    quickActions: {
      title: "الإجراءات السريعة",
      newSnippet: {
        title: "مقطع كود جديد",
        description: "احفظ الكود المفضل لديك"
      },
      newNote: {
        title: "ملاحظة جديدة", 
        description: "دوّن الأفكار المهمة"
      },
      newTask: {
        title: "مهمة جديدة",
        description: "نظم عملك"
      },
      exploreResources: {
        title: "استكشف الموارد",
        description: "اعثر على أدوات مفيدة"
      }
    },

    // النشاط الأخير
    recentActivity: {
      title: "النشاط الأخير",
      actions: {
        savedSnippet: "لقد حفظت مقطع كود React جديد",
        completedTasks: "لقد أكملت مهمتين من المشروع", 
        createdNote: "لقد أنشأت ملاحظة حول Next.js 15"
      },
      timeAgo: {
        hoursAgo: "منذ {hours} ساعات",
        yesterday: "أمس"
      }
    }
  },

  // === المصطلحات الزمنية ===
  time: {
    hoursAgo: "منذ {count} ساعات",
    yesterday: "أمس",
    today: "اليوم",
    thisWeek: "هذا الأسبوع"
  },

  // === الأرقام والعدادات ===
  numbers: {
    categories: "فئات",
    completed: "مكتملة"
  }
};