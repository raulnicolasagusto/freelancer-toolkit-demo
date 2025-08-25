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
      resources: "الموارد",
      trash: "سلة المحذوفات"
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
  },

  // === صفحة مقاطع الكود ===
  snippets: {
    pageTitle: "مقاطع الكود",
    addButton: "إضافة",
    emptyState: "لا توجد مقاطع كود محفوظة بعد",
    dragToMoveText: "اسحب إلى مجلد لنقله",
    actions: {
      edit: "تعديل مقطع الكود",
      delete: "حذف مقطع الكود"
    }
  },

  // === TRASH/سلة المحذوفات ===
  trash: {
    pageTitle: "سلة المحذوفات",
    subtitle: "عناصر محذوفة منذ أقل من 30 يومًا",
    emptyState: {
      title: "سلة المحذوفات فارغة",
      description: "ستظهر العناصر المحذوفة هنا وسيتم حذفها تلقائيًا بعد 30 يومًا"
    },
    actions: {
      restore: "استعادة",
      deleteForever: "حذف نهائي",
      emptyTrash: "إفراغ سلة المحذوفات"
    },
    confirmDelete: {
      title: "تأكيد الحذف",
      message: "هل أنت متأكد من رغبتك في حذف {itemType} نهائيًا؟",
      itemWillBeDeleted: "سيتم حذف هذا العنصر نهائيًا ولن يمكن استعادته.",
      warningAutoDelete: "سيتم حذفه تلقائيًا في {days} أيام",
      actions: {
        cancel: "إلغاء",
        deleteForever: "حذف نهائي",
        moveToTrash: "نقل إلى سلة المحذوفات"
      }
    },
    deleteOptions: {
      title: "كيف تريد حذف هذه الملاحظة؟",
      description: "اختر خيارًا للمتابعة",
      softDelete: {
        title: "نقل إلى سلة المحذوفات",
        description: "سيتم نقل الملاحظة إلى سلة المحذوفات لمدة 30 يومًا، ثم سيتم حذفها تلقائيًا"
      },
      hardDelete: {
        title: "حذف نهائي",
        description: "سيتم حذف الملاحظة نهائيًا ولن يمكن استعادتها"
      }
    },
    itemTypes: {
      note: "ملاحظة",
      notes: "ملاحظات",
      snippet: "مقطع كود",
      snippets: "مقاطع الكود"
    }
  },

  // === شريط التنقل العلوي ===
  topBar: {
    search: {
      placeholder: "ابحث هنا...",
      noResults: "لا توجد نتائج",
      searching: "جاري البحث..."
    },
    breadcrumbs: {
      home: "الرئيسية"
    },
    actions: {
      notifications: "الإشعارات",
      settings: "الإعدادات",
      profile: "ملف المستخدم"
    }
  }
};