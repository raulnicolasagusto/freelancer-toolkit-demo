'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Folder, FolderPlus, ChevronRight, ChevronDown, Home, Save, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';
import { THEME_COLORS } from '@/lib/theme-colors';
import { getFolders, createFolder, buildFolderTree, type Folder } from '@/lib/snippets';
import { useAuth, useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

const FOLDER_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#ec4899', // pink
  '#6b7280', // gray
];

// Remove duplicate interface, using the one from @/lib/snippets

interface FolderSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (folderId: string | null) => void;
  type: 'snippets' | 'notes';
  title: string;
  defaultSelectedFolderId?: string | null;
}

// Folders will be loaded from database

export default function FolderSelector({ isOpen, onClose, onSelect, type, title, defaultSelectedFolderId }: FolderSelectorProps) {
  const { userId } = useAuth();
  const { user } = useUser();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [folderTree, setFolderTree] = useState<Folder[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderParent, setNewFolderParent] = useState<string | null>(null);
  const [newFolderColor, setNewFolderColor] = useState(FOLDER_COLORS[0]);
  const [loading, setLoading] = useState(false);

  // Load folders when modal opens
  useEffect(() => {
    if (isOpen) {
      loadFolders();
      // Set default selected folder
      setSelectedFolder(defaultSelectedFolderId || null);
    }
  }, [isOpen, type, defaultSelectedFolderId]);

  // Build folder tree when folders change
  useEffect(() => {
    const tree = buildFolderTree(folders);
    setFolderTree(tree);
  }, [folders]);

  const loadFolders = async () => {
    if (!userId) {
      console.error('No user ID available');
      return;
    }
    
    setLoading(true);
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress || '';
      const foldersData = await getFolders(type, userId, userEmail);
      setFolders(foldersData);
    } catch (error) {
      console.error('Error loading folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleSelectFolder = (folderId: string | null) => {
    setSelectedFolder(folderId);
  };

  const handleSave = () => {
    onSelect(selectedFolder);
    onClose();
  };

  const handleCreateFolder = async () => {
    if (!userId) {
      console.error('No user ID available');
      return;
    }
    
    if (newFolderName.trim()) {
      setLoading(true);
      try {
        const userEmail = user?.primaryEmailAddress?.emailAddress || '';
        const newFolder = await createFolder({
          name: newFolderName.trim(),
          type,
          parent_folder_id: newFolderParent,
          color: newFolderColor,
          icon: 'folder'
        }, userId, userEmail);
        
        if (newFolder) {
          await loadFolders(); // Reload folders
          setSelectedFolder(newFolder.id); // Select the new folder
          toast.success(`Carpeta "${newFolderName.trim()}" creada exitosamente`);
        }
        
        setNewFolderName('');
        setNewFolderParent(null);
        setNewFolderColor(FOLDER_COLORS[0]);
        setIsCreatingFolder(false);
      } catch (error) {
        console.error('Error creating folder:', error);
        toast.error('Error al crear la carpeta. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderFolderTree = (folderList: any[], level = 0) => {
    return folderList.map((folder) => (
      <div key={folder.id}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`
            flex items-center space-x-2 p-2 rounded-lg cursor-pointer
            ${selectedFolder === folder.id 
              ? 'bg-blue-500/10 border border-blue-500/20' 
              : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
            }
            ${THEME_COLORS.transitions.all}
          `}
          style={{ marginLeft: `${level * 20}px` }}
          onClick={() => handleSelectFolder(folder.id)}
        >
          {folder.children && folder.children.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id);
              }}
              className="p-1"
            >
              {expandedFolders.has(folder.id) ? (
                <ChevronDown size={14} className={THEME_COLORS.dashboard.metadata} />
              ) : (
                <ChevronRight size={14} className={THEME_COLORS.dashboard.metadata} />
              )}
            </button>
          )}
          
          <div 
            className="w-4 h-4 rounded flex items-center justify-center"
            style={{ backgroundColor: folder.color + '20' }}
          >
            <Folder size={12} style={{ color: folder.color }} />
          </div>
          
          <span className={`flex-1 text-sm ${THEME_COLORS.dashboard.title}`}>
            {folder.name}
          </span>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setNewFolderParent(folder.id);
              setIsCreatingFolder(true);
            }}
            className={`
              p-1 rounded hover:bg-blue-500/10 opacity-0 group-hover:opacity-100
              ${THEME_COLORS.transitions.all}
            `}
            title="Crear subcarpeta"
          >
            <FolderPlus size={14} className="text-blue-500" />
          </button>
        </motion.div>
        
        {folder.children && expandedFolders.has(folder.id) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {renderFolderTree(folder.children, level + 1)}
          </motion.div>
        )}
      </div>
    ));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                type: 'spring',
                duration: 0.5,
                bounce: 0.3
              }}
              className={`
                relative w-full max-w-lg mx-auto
                ${THEME_COLORS.dashboard.card.background}
                rounded-2xl shadow-2xl border ${THEME_COLORS.dashboard.card.border}
                overflow-hidden
              `}
            >
              {/* Header */}
              <div className="p-6 border-b ${THEME_COLORS.dashboard.card.border}">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-xl font-semibold ${THEME_COLORS.dashboard.title}`}>
                      Seleccionar Carpeta
                    </h2>
                    <p className={`text-sm ${THEME_COLORS.dashboard.subtitle} mt-1`}>
                      Guardar "{title}" en {type === 'snippets' ? 'Mis Snippets' : 'Mis Notas'}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className={`
                      p-2 rounded-lg 
                      ${THEME_COLORS.buttons.quickAction.background}
                      ${THEME_COLORS.dashboard.subtitle} hover:${THEME_COLORS.dashboard.title}
                      ${THEME_COLORS.transitions.all}
                    `}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {/* Root option */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`
                      flex items-center space-x-2 p-2 rounded-lg cursor-pointer group
                      ${selectedFolder === null 
                        ? 'bg-blue-500/10 border border-blue-500/20' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                      }
                      ${THEME_COLORS.transitions.all}
                    `}
                    onClick={() => handleSelectFolder(null)}
                  >
                    <Home size={16} className={THEME_COLORS.icons.snippets} />
                    <span className={`flex-1 text-sm font-medium ${THEME_COLORS.dashboard.title}`}>
                      Raíz de {type === 'snippets' ? 'Snippets' : 'Notas'}
                    </span>
                  </motion.div>

                  {/* Loading state */}
                  {loading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  )}

                  {/* Folders tree */}
                  {!loading && (
                    <div className="space-y-1">
                      {renderFolderTree(folderTree)}
                    </div>
                  )}

                  {/* Create new folder */}
                  {isCreatingFolder ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`
                        p-4 rounded-lg border-2 border-dashed ${THEME_COLORS.dashboard.card.border}
                        space-y-4
                      `}
                    >
                      {/* Folder Name Input */}
                      <div>
                        <input
                          type="text"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          placeholder="Nombre de la carpeta"
                          className={`
                            w-full p-2 rounded border ${THEME_COLORS.dashboard.card.border}
                            ${THEME_COLORS.dashboard.card.background}
                            ${THEME_COLORS.dashboard.title}
                            focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                          `}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreateFolder();
                            if (e.key === 'Escape') setIsCreatingFolder(false);
                          }}
                        />
                      </div>

                      {/* Color Selection */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Palette size={14} className={THEME_COLORS.dashboard.metadata} />
                          <span className={`text-xs font-medium ${THEME_COLORS.dashboard.subtitle}`}>
                            Color
                          </span>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                          {FOLDER_COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setNewFolderColor(color)}
                              className={`
                                w-6 h-6 rounded border transition-all
                                ${newFolderColor === color 
                                  ? 'border-gray-400 scale-110' 
                                  : 'border-transparent hover:scale-105'
                                }
                              `}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Preview */}
                      <div className={`p-2 rounded ${THEME_COLORS.topBar.search.input.background} border ${THEME_COLORS.dashboard.card.border}`}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded flex items-center justify-center"
                            style={{ backgroundColor: newFolderColor + '20' }}
                          >
                            <Folder size={12} style={{ color: newFolderColor }} />
                          </div>
                          <span className={`text-xs ${THEME_COLORS.dashboard.title}`}>
                            {newFolderName || 'Nombre de la carpeta'}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={handleCreateFolder}
                          disabled={!newFolderName.trim()}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Crear
                        </button>
                        <button
                          onClick={() => {
                            setIsCreatingFolder(false);
                            setNewFolderName('');
                            setNewFolderColor(FOLDER_COLORS[0]);
                          }}
                          className={`px-3 py-1 rounded text-sm ${THEME_COLORS.dashboard.subtitle} hover:${THEME_COLORS.dashboard.title}`}
                        >
                          Cancelar
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsCreatingFolder(true)}
                      className={`
                        w-full flex items-center space-x-2 p-2 rounded-lg
                        border-2 border-dashed ${THEME_COLORS.dashboard.card.border}
                        ${THEME_COLORS.dashboard.subtitle} hover:${THEME_COLORS.dashboard.title}
                        hover:border-blue-500/30 hover:bg-blue-500/5
                        ${THEME_COLORS.transitions.all}
                      `}
                    >
                      <FolderPlus size={16} />
                      <span className="text-sm">Nueva carpeta</span>
                    </motion.button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t ${THEME_COLORS.dashboard.card.border}">
                  <button
                    onClick={onClose}
                    className={`
                      px-4 py-2 rounded-lg
                      ${THEME_COLORS.dashboard.subtitle} hover:${THEME_COLORS.dashboard.title}
                      ${THEME_COLORS.transitions.all}
                    `}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg
                      bg-blue-500 hover:bg-blue-600 text-white font-medium
                      ${THEME_COLORS.transitions.all}
                    `}
                  >
                    <Save size={16} />
                    <span>Guardar aquí</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}