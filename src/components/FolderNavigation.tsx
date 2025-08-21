'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Folder } from 'lucide-react';
import { THEME_COLORS } from '@/lib/theme-colors';
import { useFolders } from '@/hooks/useFolders';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type Folder } from '@/lib/snippets';

interface FolderNavigationProps {
  type: 'snippets' | 'notes';
  isCollapsed: boolean;
  basePath: string;
}

export default function FolderNavigation({ type, isCollapsed, basePath }: FolderNavigationProps) {
  const { folderTree, loading } = useFolders(type);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const pathname = usePathname();

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolderItem = (folder: any, level = 0) => {
    const hasChildren = folder.children && folder.children.length > 0;
    const isExpanded = expandedFolders.has(folder.id);
    const folderPath = `${basePath}?folder=${folder.id}`;
    const isActive = pathname.includes(folderPath);

    return (
      <div key={folder.id}>
        <div
          className={`
            flex items-center group relative
            ${isActive 
              ? `${THEME_COLORS.sidebar.nav.item.active.background} ${THEME_COLORS.sidebar.nav.item.active.text}` 
              : `${THEME_COLORS.sidebar.nav.item.text} ${THEME_COLORS.sidebar.nav.item.textHover} ${THEME_COLORS.sidebar.nav.item.background}`
            }
            ${THEME_COLORS.transitions.default} rounded-lg
          `}
          style={{ marginLeft: `${level * 16}px` }}
        >
          {/* Expand/Collapse button */}
          {hasChildren && !isCollapsed && (
            <button
              onClick={() => toggleFolder(folder.id)}
              className="p-1 hover:bg-white/10 rounded"
            >
              {isExpanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
          )}

          {/* Folder link */}
          <Link
            href={folderPath}
            className={`
              flex items-center space-x-3 px-3 py-2 flex-1 rounded-lg
              ${hasChildren && !isCollapsed ? 'ml-0' : 'ml-1'}
            `}
          >
            <div 
              className="w-4 h-4 rounded flex items-center justify-center"
              style={{ backgroundColor: folder.color + '20' }}
            >
              <Folder size={12} style={{ color: folder.color }} />
            </div>
            
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium truncate"
                >
                  {folder.name}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Active indicator */}
          {isActive && (
            <div className={`absolute right-0 w-1 h-6 ${THEME_COLORS.sidebar.nav.item.active.border} bg-current rounded-l-full`} />
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-2 mt-1 space-y-1"
          >
            {folder.children.map((child: any) => renderFolderItem(child, level + 1))}
          </motion.div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-1 px-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center space-x-2 px-3 py-2">
            <div className="w-4 h-4 bg-slate-600 rounded animate-pulse"></div>
            {!isCollapsed && (
              <div className="h-4 bg-slate-600 rounded flex-1 animate-pulse"></div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (folderTree.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1 px-3">
      {folderTree.map((folder) => renderFolderItem(folder))}
    </div>
  );
}