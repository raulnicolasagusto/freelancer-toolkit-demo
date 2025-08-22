'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { THEME_COLORS } from '@/lib/theme-colors';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemTitle: string;
  itemType: 'snippet' | 'markdown' | 'nota';
  isDeleting?: boolean;
}

export default function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemTitle, 
  itemType,
  isDeleting = false 
}: DeleteConfirmModalProps) {
  
  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  const getItemTypeText = () => {
    switch (itemType) {
      case 'snippet': return 'snippet';
      case 'markdown': return 'markdown';
      case 'nota': return 'nota';
      default: return 'elemento';
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
                    <AlertTriangle size={20} className="text-red-600" />
                  </div>
                  <div>
                    <h2 className={`text-lg font-semibold ${THEME_COLORS.dashboard.title}`}>
                      Confirmar eliminación
                    </h2>
                    <p className={`text-sm ${THEME_COLORS.dashboard.metadata}`}>
                      Esta acción no se puede deshacer
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleClose}
                  disabled={isDeleting}
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
              <div className="mb-6">
                <p className={`text-sm ${THEME_COLORS.dashboard.subtitle} mb-2`}>
                  ¿Estás seguro que deseas eliminar el {getItemTypeText()}?
                </p>
                <div className={`
                  p-3 rounded-lg border-l-4 border-red-500 
                  bg-red-500/5 ${THEME_COLORS.dashboard.card.border} border border-l-red-500
                `}>
                  <p className={`font-medium ${THEME_COLORS.dashboard.title}`}>
                    {itemTitle}
                  </p>
                </div>
              </div>

              {/* Warning */}
              <div className={`
                p-3 rounded-lg bg-amber-500/5 border ${THEME_COLORS.dashboard.card.border} 
                border-l-4 border-l-amber-500 mb-6
              `}>
                <div className="flex items-start space-x-2">
                  <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className={`text-xs ${THEME_COLORS.dashboard.metadata}`}>
                    Esta acción eliminará permanentemente el {getItemTypeText()} y no se podrá recuperar.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isDeleting}
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
                  type="button"
                  onClick={handleConfirm}
                  disabled={isDeleting}
                  className={`
                    flex-1 px-4 py-2 rounded-lg font-medium transition-colors
                    bg-red-500 hover:bg-red-600 text-white
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center space-x-2
                  `}
                >
                  {isDeleting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <>
                      <Trash2 size={16} />
                      <span>Eliminar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}