'use client';

import { useState } from 'react';
import { THEME_COLORS } from '@/lib/theme-colors';
import { X, FolderPlus, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createFolder } from '@/lib/snippets';
import { useAuth, useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

interface FolderCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'snippets' | 'notes';
  parentFolderId?: string | null;
  parentFolderName?: string;
  onFolderCreated?: () => void;
}

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

export default function FolderCreateModal({ isOpen, onClose, type, parentFolderId, parentFolderName, onFolderCreated }: FolderCreateModalProps) {
  const { userId } = useAuth();
  const { user } = useUser();
  const [folderName, setFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(FOLDER_COLORS[0]);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!folderName.trim()) {
      toast.error('Por favor ingresa un nombre para la carpeta');
      return;
    }

    if (!userId) {
      toast.error('Error de autenticación');
      return;
    }

    setIsCreating(true);
    
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress || '';
      const folderData = {
        name: folderName.trim(),
        color: selectedColor,
        type: type,
        parent_folder_id: parentFolderId
      };

      await createFolder(folderData, userId, userEmail);
      
      const message = parentFolderName 
        ? `Subcarpeta "${folderName.trim()}" creada dentro de "${parentFolderName}"`
        : `Carpeta "${folderName.trim()}" creada exitosamente`;
      toast.success(message);
      
      // Reset form
      setFolderName('');
      setSelectedColor(FOLDER_COLORS[0]);
      
      // Disparar evento personalizado para actualizar carpetas dinámicamente
      window.dispatchEvent(new CustomEvent('folder-created', { 
        detail: { folderName: folderName.trim(), type, parentFolderId } 
      }));

      // Close modal and notify parent
      onClose();
      if (onFolderCreated) {
        onFolderCreated();
      }
      
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Error al crear la carpeta. Intenta nuevamente.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setFolderName('');
      setSelectedColor(FOLDER_COLORS[0]);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`
              relative w-full max-w-md mx-4
              ${THEME_COLORS.dashboard.card.background}
              ${THEME_COLORS.dashboard.card.border} border
              rounded-xl shadow-xl
            `}
          >
            {/* Header */}
            <div className={`p-6 border-b ${THEME_COLORS.dashboard.card.border}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${THEME_COLORS.icons.iconBackgrounds.blue}`}>
                    <FolderPlus size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className={`text-lg font-semibold ${THEME_COLORS.dashboard.title}`}>
                      Nueva Carpeta
                    </h2>
                    <p className={`text-sm ${THEME_COLORS.dashboard.metadata}`}>
                      {parentFolderName 
                        ? `Crear subcarpeta dentro de "${parentFolderName}"`
                        : `Crear carpeta para ${type === 'snippets' ? 'snippets' : 'notas'}`
                      }
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleClose}
                  disabled={isCreating}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${THEME_COLORS.topBar.actions.button.background}
                    ${THEME_COLORS.topBar.actions.button.text}
                    ${THEME_COLORS.topBar.actions.button.textHover}
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Folder Name */}
              <div>
                <label className={`block text-sm font-medium ${THEME_COLORS.dashboard.subtitle} mb-2`}>
                  Nombre de la carpeta
                </label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => {
                    if (e.target.value.length <= 50) {
                      setFolderName(e.target.value);
                    }
                  }}
                  placeholder="Ej: Proyectos React, APIs, Tutoriales..."
                  disabled={isCreating}
                  maxLength={50}
                  className={`
                    w-full px-3 py-2 rounded-lg border
                    ${THEME_COLORS.topBar.search.input.background}
                    ${THEME_COLORS.topBar.search.input.border}
                    ${THEME_COLORS.dashboard.title}
                    ${THEME_COLORS.topBar.search.input.placeholder}
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                  autoFocus
                />
                <div className="flex justify-end mt-1">
                  <span className={`text-xs ${folderName.length > 45 ? 'text-orange-500' : THEME_COLORS.dashboard.metadata}`}>
                    {folderName.length}/50
                  </span>
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className={`block text-sm font-medium ${THEME_COLORS.dashboard.subtitle} mb-3`}>
                  <div className="flex items-center space-x-2">
                    <Palette size={16} />
                    <span>Color de la carpeta</span>
                  </div>
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {FOLDER_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      disabled={isCreating}
                      className={`
                        w-10 h-10 rounded-lg border-2 transition-all
                        ${selectedColor === color 
                          ? 'border-gray-400 scale-110' 
                          : 'border-transparent hover:scale-105'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className={`p-3 rounded-lg ${THEME_COLORS.topBar.search.input.background} border ${THEME_COLORS.dashboard.card.border}`}>
                <p className={`text-xs ${THEME_COLORS.dashboard.metadata} mb-2`}>Vista previa:</p>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-6 h-6 rounded flex items-center justify-center"
                    style={{ backgroundColor: selectedColor + '20' }}
                  >
                    <FolderPlus size={14} style={{ color: selectedColor }} />
                  </div>
                  <span className={`text-sm font-medium ${THEME_COLORS.dashboard.title}`}>
                    {folderName || 'Nombre de la carpeta'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isCreating}
                  className={`
                    flex-1 px-4 py-2 rounded-lg border font-medium transition-colors
                    ${THEME_COLORS.dashboard.card.border}
                    ${THEME_COLORS.dashboard.subtitle}
                    hover:${THEME_COLORS.topBar.search.input.background}
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  Cancelar
                </button>
                
                <button
                  type="submit"
                  disabled={isCreating || !folderName.trim()}
                  className={`
                    flex-1 px-4 py-2 rounded-lg font-medium transition-colors
                    bg-blue-500 hover:bg-blue-600 text-white
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center space-x-2
                  `}
                >
                  {isCreating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <>
                      <FolderPlus size={16} />
                      <span>Crear Carpeta</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}