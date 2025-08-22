"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Code2, 
  StickyNote, 
  CheckSquare, 
  BookOpen, 
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { THEME_COLORS } from '@/lib/theme-colors';
import { t } from '@/lib/i18n';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';
import FolderNavigation from './FolderNavigation';
import DeleteConfirmModal from './DeleteConfirmModal';
import { deleteFolder, type Folder } from '@/lib/snippets';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
}

const getNavItems = (): NavItem[] => [
  {
    id: 'dashboard',
    label: t('sidebar.nav.dashboard'),
    icon: LayoutDashboard,
    href: '/'
  },
  {
    id: 'snippets',
    label: t('sidebar.nav.snippets'),
    icon: Code2,
    href: '/snippets'
  },
  {
    id: 'notes',
    label: t('sidebar.nav.notes'),
    icon: StickyNote,
    href: '/notes'
  },
  {
    id: 'productivity',
    label: t('sidebar.nav.productivity'),
    icon: CheckSquare,
    href: '/productivity'
  },
  {
    id: 'resources',
    label: t('sidebar.nav.resources'),
    icon: BookOpen,
    href: '/resources'
  }
];

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSnippets, setExpandedSnippets] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  
  const navItems = getNavItems();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Determinar item activo basado en la ruta actual
  const getActiveItem = () => {
    // Si estamos en rutas de snippets (/snippets/create, /snippets/edit, etc.)
    if (pathname.startsWith('/snippets')) {
      return 'snippets';
    }
    
    const item = navItems.find(nav => nav.href === pathname);
    return item?.id || 'dashboard';
  };

  // Memoizar los datos del usuario para evitar recalculaciones
  const userInitials = user 
    ? (user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '') || user.emailAddresses[0]?.emailAddress.charAt(0).toUpperCase() || 'U'
    : 'U';

  const userFullName = user 
    ? (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username || user.emailAddresses[0]?.emailAddress.split('@')[0] || 'Usuario')
    : 'Usuario';

  const userEmail = user?.emailAddresses[0]?.emailAddress || '';

  // Handlers para eliminar carpeta
  const handleDeleteFolder = (folder: Folder) => {
    setFolderToDelete(folder);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!folderToDelete) return;

    setIsDeleting(true);
    try {
      const success = await deleteFolder(folderToDelete.id);
      
      if (success) {
        toast.success(`Carpeta "${folderToDelete.name}" eliminada exitosamente`);
        setShowDeleteModal(false);
        setFolderToDelete(null);
        // Recargar la página para actualizar la lista de carpetas
        window.location.reload();
      } else {
        toast.error('Error al eliminar la carpeta. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error('Error al eliminar la carpeta. Intenta nuevamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
      setFolderToDelete(null);
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ 
        duration: 0.3, 
        ease: [0.4, 0, 0.2, 1],
        type: "tween"
      }}
      className={cn(
        `relative flex flex-col ${THEME_COLORS.sidebar.background} border-r ${THEME_COLORS.sidebar.border} h-screen overflow-hidden`,
        className
      )}
    >
      {/* Header with Logo and Toggle */}
      <div className={`flex items-center justify-between p-4 border-b ${THEME_COLORS.sidebar.borderSeparator}`}>
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <div className={`w-8 h-8 ${THEME_COLORS.logo.background} rounded-lg flex items-center justify-center`}>
                <LayoutDashboard className={`w-4 h-4 ${THEME_COLORS.logo.icon}`} />
              </div>
              <div>
                <h1 className={`${THEME_COLORS.logo.title} font-semibold text-lg leading-none`}>
                  {t('app.name')}
                </h1>
                <p className={`${THEME_COLORS.logo.subtitle} text-xs`}>{t('app.subtitle')}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className={`h-8 w-8 p-0 ${THEME_COLORS.sidebar.toggleButton.text} ${THEME_COLORS.sidebar.toggleButton.textHover} ${THEME_COLORS.sidebar.toggleButton.background} ${THEME_COLORS.transitions.default}`}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* User Profile Section */}
      <div className={`p-4 border-b ${THEME_COLORS.sidebar.borderSeparator}`}>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Avatar className={`h-10 w-10 ring-2 ${THEME_COLORS.sidebar.user.avatarRing} ${THEME_COLORS.transitions.default}`}>
              <AvatarImage 
                src={user?.imageUrl || undefined} 
                alt={userFullName} 
              />
              <AvatarFallback className={`${THEME_COLORS.sidebar.user.avatarBackground} ${THEME_COLORS.sidebar.user.avatarText} font-semibold`}>
                {isLoaded ? userInitials : '...'}
              </AvatarFallback>
            </Avatar>
            
            {/* Logout button on hover */}
            {!isCollapsed && (
              <div className="absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <SignOutButton>
                  <button className={`w-6 h-6 ${THEME_COLORS.sidebar.user.avatarBackground} ${THEME_COLORS.sidebar.user.avatarText} rounded-full flex items-center justify-center text-xs hover:bg-red-500 ${THEME_COLORS.transitions.default}`}>
                    <LogOut className="w-3 h-3" />
                  </button>
                </SignOutButton>
              </div>
            )}
          </div>
          
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="flex-1 min-w-0"
              >
                <p className={`${THEME_COLORS.sidebar.user.userName} font-medium text-sm truncate`}>
                  {isLoaded ? userFullName : 'Cargando...'}
                </p>
                <p className={`${THEME_COLORS.sidebar.user.userEmail} text-xs truncate`}>
                  {isLoaded ? userEmail : ''}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Logout button cuando está colapsado */}
        <AnimatePresence>
          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="mt-3 flex justify-center"
            >
              <SignOutButton>
                <button className={`w-8 h-8 ${THEME_COLORS.sidebar.toggleButton.text} ${THEME_COLORS.sidebar.toggleButton.textHover} ${THEME_COLORS.sidebar.toggleButton.background} rounded-lg flex items-center justify-center ${THEME_COLORS.transitions.default}`}>
                  <LogOut className="w-4 h-4" />
                </button>
              </SignOutButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-4"
            >
              <h2 className={`${THEME_COLORS.sidebar.nav.sectionTitle} text-xs font-semibold uppercase tracking-wider mb-2`}>
                {t('sidebar.nav.sectionTitle')}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = getActiveItem() === item.id;
          const isSnippets = item.id === 'snippets';
          const isNotes = item.id === 'notes';
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              {/* Item principal */}
              <div className="relative">
                <Link href={item.href} className="block w-full">
                  <Button
                    variant="ghost"
                    className={cn(
                      `w-full justify-start h-11 px-3 ${THEME_COLORS.sidebar.nav.item.text} ${THEME_COLORS.sidebar.nav.item.textHover} ${THEME_COLORS.sidebar.nav.item.background} ${THEME_COLORS.transitions.all}`,
                      isActive && `${THEME_COLORS.sidebar.nav.item.active.background} ${THEME_COLORS.sidebar.nav.item.active.text} ${THEME_COLORS.sidebar.nav.item.active.textHover} border-r-2 ${THEME_COLORS.sidebar.nav.item.active.border}`,
                      isCollapsed && "justify-center px-0"
                    )}
                  >
                  <Icon className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive && THEME_COLORS.sidebar.nav.item.active.icon
                  )} />
                  
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between flex-1 ml-3"
                      >
                        <span className="font-medium">{item.label}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  </Button>
                </Link>
                
                {/* Botón de expansión para snippets y notes */}
                {(isSnippets || isNotes) && !isCollapsed && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (isSnippets) {
                        setExpandedSnippets(!expandedSnippets);
                      } else {
                        setExpandedNotes(!expandedNotes);
                      }
                    }}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-white/10 ${THEME_COLORS.transitions.all}`}
                  >
                    {(isSnippets ? expandedSnippets : expandedNotes) ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>
                )}
              </div>

              {/* Carpetas para snippets */}
              {isSnippets && !isCollapsed && expandedSnippets && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-4 mt-2"
                >
                  <FolderNavigation 
                    type="snippets" 
                    isCollapsed={false}
                    basePath="/snippets"
                    onDeleteFolder={handleDeleteFolder}
                  />
                </motion.div>
              )}

              {/* Carpetas para notes */}
              {isNotes && !isCollapsed && expandedNotes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-4 mt-2"
                >
                  <FolderNavigation 
                    type="notes" 
                    isCollapsed={false}
                    basePath="/notes"
                    onDeleteFolder={handleDeleteFolder}
                  />
                </motion.div>
              )}
            </motion.div>
          );
        })}

      </nav>

      {/* Footer */}
      <div className={`p-4 border-t ${THEME_COLORS.sidebar.borderSeparator}`}>
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`text-xs ${THEME_COLORS.sidebar.footer.text} text-center`}
            >
              {t('app.name')} {t('app.version')}
              <br />
              <span className={THEME_COLORS.sidebar.footer.accent}>{t('app.edition')}</span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="flex justify-center"
            >
              <div className={`w-2 h-2 ${THEME_COLORS.sidebar.footer.indicator} rounded-full animate-pulse`} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemTitle={folderToDelete?.name || 'Sin título'}
        itemType="folder"
        isDeleting={isDeleting}
      />
    </motion.aside>
  );
}