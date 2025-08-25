'use client';

import { t } from '@/lib/i18n';
import { THEME_COLORS } from '@/lib/theme-colors';
import { Trash2, RotateCcw, X, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, useUser } from '@clerk/nextjs';
import { getTrashedNotes, restoreNote, deleteNotePermanently, type Note as NoteType } from '@/lib/notes';
import toast from 'react-hot-toast';

interface TrashedNote {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'list' | 'image';
  color: string;
  deleted_at: string;
  days_remaining: number;
}

export default function TrashPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  
  const [trashedNotes, setTrashedNotes] = useState<TrashedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEmptyTrashModal, setShowEmptyTrashModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<TrashedNote | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (userId) {
      loadTrashedNotes();
    }
  }, [userId]);

  const loadTrashedNotes = async () => {
    try {
      setLoading(true);
      const userEmail = user?.primaryEmailAddress?.emailAddress || '';
      const notes = await getTrashedNotes(userId || '', userEmail);
      
      // Convertir formato y calcular días restantes
      const formattedNotes = notes.map(note => {
        const deletedDate = new Date(note.deleted_at);
        const daysPassed = Math.floor((Date.now() - deletedDate.getTime()) / (1000 * 60 * 60 * 24));
        const daysRemaining = Math.max(0, 30 - daysPassed);
        
        return {
          id: note.id,
          title: note.title,
          content: note.content,
          type: note.type,
          color: note.color,
          deleted_at: note.deleted_at,
          days_remaining: daysRemaining
        };
      });
      
      setTrashedNotes(formattedNotes);
    } catch (error) {
      console.error('Error loading trashed notes:', error);
      toast.error('Error al cargar la papelera');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = (note: TrashedNote) => {
    setSelectedNote(note);
    setShowRestoreModal(true);
  };

  const handleDeleteForever = (note: TrashedNote) => {
    setSelectedNote(note);
    setShowDeleteModal(true);
  };

  const handleEmptyTrash = () => {
    if (trashedNotes.length > 0) {
      setShowEmptyTrashModal(true);
    }
  };

  const confirmRestore = async () => {
    if (!selectedNote) return;

    setIsProcessing(true);
    try {
      const success = await restoreNote(selectedNote.id);
      
      if (success) {
        toast.success(`"${selectedNote.title}" restaurada exitosamente`);
        setTrashedNotes(prev => prev.filter(note => note.id !== selectedNote.id));
      } else {
        toast.error('Error al restaurar la nota');
      }
    } catch (error) {
      console.error('Error restoring note:', error);
      toast.error('Error al restaurar la nota');
    } finally {
      setIsProcessing(false);
      setShowRestoreModal(false);
      setSelectedNote(null);
    }
  };

  const confirmDeleteForever = async () => {
    if (!selectedNote) return;

    setIsProcessing(true);
    try {
      const success = await deleteNotePermanently(selectedNote.id);
      
      if (success) {
        toast.success(`"${selectedNote.title}" eliminada permanentemente`);
        setTrashedNotes(prev => prev.filter(note => note.id !== selectedNote.id));
      } else {
        toast.error('Error al eliminar la nota');
      }
    } catch (error) {
      console.error('Error deleting note permanently:', error);
      toast.error('Error al eliminar la nota');
    } finally {
      setIsProcessing(false);
      setShowDeleteModal(false);
      setSelectedNote(null);
    }
  };

  const confirmEmptyTrash = async () => {
    setIsProcessing(true);
    try {
      // Eliminar todas las notas de la papelera
      const promises = trashedNotes.map(note => deleteNotePermanently(note.id));
      const results = await Promise.all(promises);
      
      if (results.every(result => result)) {
        toast.success('Papelera vaciada exitosamente');
        setTrashedNotes([]);
      } else {
        toast.error('Error al vaciar la papelera');
      }
    } catch (error) {
      console.error('Error emptying trash:', error);
      toast.error('Error al vaciar la papelera');
    } finally {
      setIsProcessing(false);
      setShowEmptyTrashModal(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className={`${THEME_COLORS.main.background} p-6 flex-shrink-0`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Trash2 size={24} className="text-red-500" />
                <div>
                  <h1 className={`text-3xl font-bold ${THEME_COLORS.dashboard.title}`}>
                    {t('trash.pageTitle')}
                  </h1>
                  <p className={`text-sm ${THEME_COLORS.dashboard.subtitle}`}>
                    {t('trash.subtitle')}
                  </p>
                </div>
              </div>
            </div>
            
            {trashedNotes.length > 0 && (
              <button
                onClick={handleEmptyTrash}
                className={`
                  flex items-center space-x-2 px-4 py-2
                  bg-red-500/10 border border-red-500/20
                  text-red-600 hover:text-red-700 hover:bg-red-500/20
                  rounded-lg font-medium
                  ${THEME_COLORS.transitions.all}
                `}
              >
                <Trash2 size={18} />
                <span>{t('trash.actions.emptyTrash')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className={`flex-1 ${THEME_COLORS.main.background} px-6 pb-6 overflow-y-auto min-h-0`}>
        <div className="max-w-7xl mx-auto">
          {/* Loading state */}
          {loading && (
            <div className="text-center py-20">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${THEME_COLORS.dashboard.card.background} flex items-center justify-center`}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
              </div>
              <h3 className={`${THEME_COLORS.dashboard.title} text-lg font-medium mb-2`}>
                Cargando papelera...
              </h3>
            </div>
          )}

          {/* Estado vacío */}
          {!loading && trashedNotes.length === 0 && (
            <div className="text-center py-20">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${THEME_COLORS.dashboard.card.background} flex items-center justify-center`}>
                <Trash2 className={`w-8 h-8 text-red-400`} />
              </div>
              <h3 className={`${THEME_COLORS.dashboard.title} text-lg font-medium mb-2`}>
                {t('trash.emptyState.title')}
              </h3>
              <p className={`${THEME_COLORS.dashboard.subtitle} mb-6`}>
                {t('trash.emptyState.description')}
              </p>
            </div>
          )}

          {/* Lista de notas en papelera */}
          {!loading && trashedNotes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {trashedNotes.map((note, index) => (
                <TrashedNoteCard
                  key={note.id}
                  note={note}
                  index={index}
                  onRestore={() => handleRestore(note)}
                  onDeleteForever={() => handleDeleteForever(note)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación de restauración */}
      <ConfirmModal
        isOpen={showRestoreModal}
        onClose={() => {
          if (!isProcessing) {
            setShowRestoreModal(false);
            setSelectedNote(null);
          }
        }}
        onConfirm={confirmRestore}
        title="Restaurar nota"
        message={`¿Estás seguro que deseas restaurar "${selectedNote?.title}"?`}
        description="La nota volverá a su ubicación original."
        confirmText="Restaurar"
        confirmColor="blue"
        icon={<RotateCcw size={20} className="text-blue-600" />}
        isProcessing={isProcessing}
      />

      {/* Modal de confirmación de eliminación permanente */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          if (!isProcessing) {
            setShowDeleteModal(false);
            setSelectedNote(null);
          }
        }}
        onConfirm={confirmDeleteForever}
        title={t('trash.confirmDelete.title')}
        message={`${t('trash.confirmDelete.message', { itemType: t('trash.itemTypes.note') })}`}
        description={t('trash.confirmDelete.itemWillBeDeleted')}
        confirmText={t('trash.actions.deleteForever')}
        confirmColor="red"
        icon={<AlertTriangle size={20} className="text-red-600" />}
        isProcessing={isProcessing}
        warning={true}
      />

      {/* Modal de confirmación de vaciar papelera */}
      <ConfirmModal
        isOpen={showEmptyTrashModal}
        onClose={() => {
          if (!isProcessing) {
            setShowEmptyTrashModal(false);
          }
        }}
        onConfirm={confirmEmptyTrash}
        title="Vaciar papelera"
        message={`¿Estás seguro que deseas eliminar permanentemente todas las ${trashedNotes.length} notas?`}
        description="Esta acción no se puede deshacer. Todas las notas se eliminarán para siempre."
        confirmText={t('trash.actions.emptyTrash')}
        confirmColor="red"
        icon={<AlertTriangle size={20} className="text-red-600" />}
        isProcessing={isProcessing}
        warning={true}
      />
    </div>
  );
}

// Componente para tarjetas de notas en papelera
interface TrashedNoteCardProps {
  note: TrashedNote;
  index: number;
  onRestore: () => void;
  onDeleteForever: () => void;
}

function TrashedNoteCard({ note, index, onRestore, onDeleteForever }: TrashedNoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative group"
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative rounded-lg border border-red-200 hover:shadow-lg 
          ${THEME_COLORS.transitions.all}
          overflow-hidden opacity-75
        `}
        style={{ 
          backgroundColor: note.color,
          minHeight: '120px'
        }}
      >
        {/* Warning strip */}
        <div className="bg-red-500/20 border-b border-red-300 px-3 py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Trash2 size={12} className="text-red-600" />
              <span className="text-xs text-red-700 font-medium">
                En papelera
              </span>
            </div>
            <span className="text-xs text-red-600">
              {note.days_remaining}d restantes
            </span>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4">
          {note.title && (
            <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">
              {note.title}
            </h3>
          )}

          <div 
            className="text-gray-700 text-sm line-clamp-4"
            dangerouslySetInnerHTML={{ __html: note.content }}
            style={{
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
          />
        </div>

        {/* Hover actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 bottom-0 bg-black/10 backdrop-blur-sm p-2 flex items-center justify-center space-x-2"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRestore();
                }}
                className={`
                  p-1.5 rounded bg-blue-500/20 border border-blue-500/30
                  text-blue-600 hover:text-blue-700 hover:bg-blue-500/30
                  transition-colors
                `}
                title={t('trash.actions.restore')}
              >
                <RotateCcw size={14} />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteForever();
                }}
                className={`
                  p-1.5 rounded bg-red-500/20 border border-red-500/30
                  text-red-600 hover:text-red-700 hover:bg-red-500/30
                  transition-colors
                `}
                title={t('trash.actions.deleteForever')}
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Componente de modal de confirmación reutilizable
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  description: string;
  confirmText: string;
  confirmColor: 'blue' | 'red';
  icon: React.ReactNode;
  isProcessing: boolean;
  warning?: boolean;
}

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  description,
  confirmText,
  confirmColor,
  icon,
  isProcessing,
  warning = false
}: ConfirmModalProps) {
  const colorClasses = {
    blue: {
      button: 'bg-blue-500 hover:bg-blue-600',
      iconBg: 'bg-blue-500/10'
    },
    red: {
      button: 'bg-red-500 hover:bg-red-600',
      iconBg: 'bg-red-500/10'
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
            onClick={onClose}
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
                  <div className={`p-2 rounded-lg ${colorClasses[confirmColor].iconBg}`}>
                    {icon}
                  </div>
                  <div>
                    <h2 className={`text-lg font-semibold ${THEME_COLORS.dashboard.title}`}>
                      {title}
                    </h2>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
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
              <div className="mb-6">
                <p className={`text-sm ${THEME_COLORS.dashboard.subtitle} mb-3`}>
                  {message}
                </p>
                
                {warning && (
                  <div className={`
                    p-3 rounded-lg bg-red-500/10 border border-red-500/30
                    border-l-4 border-l-red-500 mb-4
                  `}>
                    <div className="flex items-start space-x-2">
                      <AlertTriangle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                      <p className={`text-xs ${THEME_COLORS.dashboard.metadata}`}>
                        {description}
                      </p>
                    </div>
                  </div>
                )}
                
                {!warning && (
                  <p className={`text-xs ${THEME_COLORS.dashboard.metadata}`}>
                    {description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  className={`
                    flex-1 px-4 py-2 rounded-lg border font-medium transition-colors
                    ${THEME_COLORS.dashboard.card.border}
                    ${THEME_COLORS.dashboard.subtitle}
                    hover:${THEME_COLORS.topBar.search.input.background}
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {t('trash.confirmDelete.actions.cancel')}
                </button>
                
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isProcessing}
                  className={`
                    flex-1 px-4 py-2 rounded-lg font-medium transition-colors
                    ${colorClasses[confirmColor].button} text-white
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center space-x-2
                  `}
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <span>{confirmText}</span>
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