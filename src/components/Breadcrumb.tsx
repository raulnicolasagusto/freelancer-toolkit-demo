'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { 
  LayoutDashboard, 
  Code2, 
  StickyNote, 
  CheckSquare, 
  BookOpen 
} from 'lucide-react';
import { THEME_COLORS } from '@/lib/theme-colors';
import { t } from '@/lib/i18n';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive: boolean;
}

const getPageConfig = (pathname: string): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: t('topBar.breadcrumbs.home'),
      href: '/',
      icon: Home,
      isActive: pathname === '/'
    }
  ];

  // Configuración de páginas con sus iconos
  const pageConfigs = {
    '/': {
      label: t('sidebar.nav.dashboard'),
      icon: LayoutDashboard
    },
    '/snippets': {
      label: t('sidebar.nav.snippets'),
      icon: Code2
    },
    '/notes': {
      label: t('sidebar.nav.notes'),
      icon: StickyNote
    },
    '/productivity': {
      label: t('sidebar.nav.productivity'),
      icon: CheckSquare
    },
    '/resources': {
      label: t('sidebar.nav.resources'),
      icon: BookOpen
    }
  };

  // Si no estamos en home, agregar la página actual
  if (pathname !== '/') {
    const currentPage = pageConfigs[pathname as keyof typeof pageConfigs];
    if (currentPage) {
      breadcrumbs.push({
        label: currentPage.label,
        href: pathname,
        icon: currentPage.icon,
        isActive: true
      });
    }
  }

  return breadcrumbs;
};

export function Breadcrumb() {
  const pathname = usePathname();
  const breadcrumbs = getPageConfig(pathname);

  return (
    <nav className={THEME_COLORS.topBar.breadcrumbs.container}>
      {breadcrumbs.map((item, index) => {
        const Icon = item.icon;
        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={item.href} className="flex items-center">
            {/* Breadcrumb Item */}
            <Link
              href={item.href}
              className={`
                flex items-center space-x-2 px-2 py-1 rounded-md
                ${THEME_COLORS.transitions.all}
                ${item.isActive 
                  ? THEME_COLORS.topBar.breadcrumbs.item.active
                  : `${THEME_COLORS.topBar.breadcrumbs.item.text} ${THEME_COLORS.topBar.breadcrumbs.item.textHover}`
                }
              `}
            >
              {Icon && (
                <Icon className={`h-4 w-4 ${THEME_COLORS.topBar.breadcrumbs.icon}`} />
              )}
              <span className="text-sm">{item.label}</span>
            </Link>

            {/* Separator */}
            {!isLast && (
              <ChevronRight 
                className={`h-4 w-4 mx-2 ${THEME_COLORS.topBar.breadcrumbs.separator}`} 
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}