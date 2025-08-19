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
  Menu,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { THEME_COLORS } from '@/lib/theme-colors';

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

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/'
  },
  {
    id: 'snippets',
    label: 'Mis Snippets',
    icon: Code2,
    href: '/snippets',
    badge: 12
  },
  {
    id: 'notes',
    label: 'Mis Notas',
    icon: StickyNote,
    href: '/notes',
    badge: 8
  },
  {
    id: 'productivity',
    label: 'Productividad',
    icon: CheckSquare,
    href: '/productivity',
    badge: 3
  },
  {
    id: 'resources',
    label: 'Recursos',
    icon: BookOpen,
    href: '/resources'
  }
];

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
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
                  DevToolkit
                </h1>
                <p className={`${THEME_COLORS.logo.subtitle} text-xs`}>PRO</p>
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
          <Avatar className={`h-10 w-10 ring-2 ${THEME_COLORS.sidebar.user.avatarRing}`}>
            <AvatarImage src="/api/placeholder/40/40" alt="Usuario" />
            <AvatarFallback className={`${THEME_COLORS.sidebar.user.avatarBackground} ${THEME_COLORS.sidebar.user.avatarText} font-semibold`}>
              JD
            </AvatarFallback>
          </Avatar>
          
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
                  John Developer
                </p>
                <p className={`${THEME_COLORS.sidebar.user.userEmail} text-xs truncate`}>
                  john@example.com
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
                HERRAMIENTAS
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Button
                variant="ghost"
                onClick={() => setActiveItem(item.id)}
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
                      {item.badge && (
                        <span className={cn(
                          `${THEME_COLORS.sidebar.nav.badge.background} ${THEME_COLORS.sidebar.nav.badge.text} text-xs px-2 py-0.5 rounded-full`,
                          isActive && `${THEME_COLORS.sidebar.nav.badge.active.background} ${THEME_COLORS.sidebar.nav.badge.active.text}`
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
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
              DevToolkit v1.0.0
              <br />
              <span className={THEME_COLORS.sidebar.footer.accent}>Premium Edition</span>
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
    </motion.aside>
  );
}