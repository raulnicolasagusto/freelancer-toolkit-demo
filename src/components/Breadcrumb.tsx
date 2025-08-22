'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home, Folder } from 'lucide-react';
import { 
  LayoutDashboard, 
  Code2, 
  StickyNote, 
  CheckSquare, 
  BookOpen 
} from 'lucide-react';
import { THEME_COLORS } from '@/lib/theme-colors';
import { t } from '@/lib/i18n';
import { useFolders } from '@/hooks/useFolders';
import { getFolderPath } from '@/lib/snippets';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive: boolean;
}

const getPageConfig = (pathname: string, folderId?: string | null, folders?: any[]): BreadcrumbItem[] => {
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
    let currentPage;
    let actualHref = pathname;

    // Manejar rutas de snippets (create, edit, etc.)
    if (pathname.startsWith('/snippets')) {
      currentPage = pageConfigs['/snippets'];
      actualHref = '/snippets';
    } 
    // Manejar otras rutas de sección
    else if (pathname.startsWith('/notes')) {
      currentPage = pageConfigs['/notes'];
      actualHref = '/notes';
    }
    else if (pathname.startsWith('/productivity')) {
      currentPage = pageConfigs['/productivity'];
      actualHref = '/productivity';
    }
    else if (pathname.startsWith('/resources')) {
      currentPage = pageConfigs['/resources'];
      actualHref = '/resources';
    }
    else {
      currentPage = pageConfigs[pathname as keyof typeof pageConfigs];
    }

    if (currentPage) {
      breadcrumbs.push({
        label: currentPage.label,
        href: actualHref,
        icon: currentPage.icon,
        isActive: !folderId // Solo activo si no hay carpeta seleccionada
      });

      // Si hay una carpeta seleccionada, agregar la ruta de carpetas
      if (folderId && folders && folders.length > 0) {
        const folderPath = getFolderPath(folderId, folders);
        
        folderPath.forEach((folder, index) => {
          const isLastFolder = index === folderPath.length - 1;
          breadcrumbs.push({
            label: folder.name,
            href: `${actualHref}?folder=${folder.id}`,
            icon: Folder,
            isActive: isLastFolder
          });
        });
      }
    }
  }

  return breadcrumbs;
};

export function Breadcrumb() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const folderId = searchParams.get('folder');
  
  // Obtener folders para construir el path
  const { folders } = useFolders('snippets'); // Por ahora solo snippets, podrías hacer esto dinámico
  
  const breadcrumbs = getPageConfig(pathname, folderId, folders);

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