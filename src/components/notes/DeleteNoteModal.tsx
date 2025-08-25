'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, AlertTriangle, Clock } from 'lucide-react';
import { useState } from 'react';
import { THEME_COLORS } from '@/lib/theme-colors';
import { t } from '@/lib/i18n';

interface DeleteNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMoveToTrash: () => void;
  onDeletePermanently: () => void;
  noteTitle: string;
  isProcessing?: boolean;
}

export default function DeleteNoteModal({ 
  isOpen, 
  onClose, 
  onMoveToTrash,
  onDeletePermanently,
  noteTitle,
  isProcessing = false 
}: DeleteNoteModalProps) {
  
  const [showPermanentConfirm, setShowPermanentConfirm] = useState(false);

  const handleMoveToTrash = () => {
    onMoveToTrash();
  };

  const handleDeletePermanently = () => {
    if (!showPermanentConfirm) {
      setShowPermanentConfirm(true);
      return;
    }
    onDeletePermanently();
  };

  const handleClose = () => {
    if (!isProcessing) {
      setShowPermanentConfirm(false);
      onClose();
    }
  };

  const handleBackToOptions = () => {
    setShowPermanentConfirm(false);
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
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
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
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <Trash2 size={20} className="text-red-600" />
                  </div>
                  <div>
                    <h2 className={`text-lg font-semibold ${THEME_COLORS.dashboard.title}`}>
                      {showPermanentConfirm 
                        ? t('trash.confirmDelete.title')
                        : t('trash.deleteOptions.title')
                      }
                    </h2>
                    <p className={`text-sm ${THEME_COLORS.dashboard.metadata}`}>
                      {showPermanentConfirm 
                        ? 'Esta acción no se puede deshacer'
                        : t('trash.deleteOptions.description')
                      }
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleClose}
                  disabled={isProcessing}
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

            {/* Content */}
            <div className="p-6">
              {/* Título de la nota */}
              <div className="mb-6">
                <div className={`
                  p-3 rounded-lg border-l-4 border-red-500 
                  bg-red-500/5 ${THEME_COLORS.dashboard.card.border} border border-l-red-500
                `}>
                  <p className={`font-medium ${THEME_COLORS.dashboard.title}`}>
                    {noteTitle || 'Sin título'}
                  </p>
                </div>
              </div>

              {!showPermanentConfirm ? (
                /* Opciones de eliminación */
                <div className="space-y-4">
                  {/* Opción: Mover a papelera */}
                  <button
                    onClick={handleMoveToTrash}
                    disabled={isProcessing}
                    className={`
                      w-full p-4 rounded-lg border-2 border-orange-300
                      bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30
                      transition-colors text-left group
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors">
                        <Clock size={16} className="text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-orange-900 dark:text-orange-100 mb-1">
                          {t('trash.deleteOptions.softDelete.title')}
                        </h3>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          {t('trash.deleteOptions.softDelete.description')}
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Opción: Eliminar para siempre */}
                  <button
                    onClick={handleDeletePermanently}
                    disabled={isProcessing}
                    className={`
                      w-full p-4 rounded-lg border-2 border-red-300
                      bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30
                      transition-colors text-left group
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
                        <AlertTriangle size={16} className="text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-red-900 dark:text-red-100 mb-1">
                          {t('trash.deleteOptions.hardDelete.title')}
                        </h3>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          {t('trash.deleteOptions.hardDelete.description')}
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Botón cancelar */}
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isProcessing}
                    className={`
                      w-full px-4 py-2 rounded-lg border font-medium transition-colors
                      ${THEME_COLORS.dashboard.card.border}
                      ${THEME_COLORS.dashboard.subtitle}
                      hover:${THEME_COLORS.topBar.search.input.background}
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    {t('trash.confirmDelete.actions.cancel')}
                  </button>
                </div>
              ) : (
                /* Confirmación de eliminación permanente */
                <div>
                  <div className="mb-6">
                    <p className={`text-sm ${THEME_COLORS.dashboard.subtitle} mb-4`}>
                      {t('trash.confirmDelete.message', { itemType: t('trash.itemTypes.note') })}
                    </p>
                    
                    <div className={`
                      p-3 rounded-lg bg-red-500/10 border border-red-500/30
                      border-l-4 border-l-red-500
                    `}>
                      <div className="flex items-start space-x-2">
                        <AlertTriangle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                        <p className={`text-xs ${THEME_COLORS.dashboard.metadata}`}>
                          {t('trash.confirmDelete.itemWillBeDeleted')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleBackToOptions}
                      disabled={isProcessing}
                      className={`
                        flex-1 px-4 py-2 rounded-lg border font-medium transition-colors
                        ${THEME_COLORS.dashboard.card.border}
                        ${THEME_COLORS.dashboard.subtitle}
                        hover:${THEME_COLORS.topBar.search.input.background}
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      Volver
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleDeletePermanently}
                      disabled={isProcessing}
                      className={`
                        flex-1 px-4 py-2 rounded-lg font-medium transition-colors
                        bg-red-500 hover:bg-red-600 text-white
                        disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center justify-center space-x-2
                      `}
                    >
                      {isProcessing ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <>
                          <AlertTriangle size={16} />
                          <span>{t('trash.actions.deleteForever')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}