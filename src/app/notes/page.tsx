'use client';

import { t } from '@/lib/i18n';
import { THEME_COLORS } from '@/lib/theme-colors';
import { Plus, Search, MoreVertical, Pin, Palette, Bell, Archive, Trash2, FolderPlus, Home, FolderIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import NoteEditorModal from '@/components/notes/NoteEditorModal';
import FolderCreateModal from '@/components/FolderCreateModal';
import DeleteNoteModal from '@/components/notes/DeleteNoteModal';
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getFolders, type Folder } from '@/lib/snippets';
import { getNotes, createNote, updateNote, deleteNote, moveNoteToTrash, deleteNotePermanently, createExampleNotes, type Note as NoteType } from '@/lib/notes';
import toast from 'react-hot-toast';

// Interfaz para mantener compatibilidad con el componente actual

interface Note {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'list' | 'image';
  color: string;
  isPinned: boolean;
  imageUrl?: string;
  listItems?: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  createdAt: string;
  folder_id: string | null;
  reminder_date?: string;
  reminder_time?: string;
  reminder_location?: string;
}

export default function NotesPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFolderId = searchParams.get('folder');
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showFolderCreateModal, setShowFolderCreateModal] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [isEditingFolderName, setIsEditingFolderName] = useState(false);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cargar notas cuando cambie el usuario o la carpeta
  useEffect(() => {
    if (userId) {
      loadNotes();
    }
  }, [userId, currentFolderId]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const userEmail = user?.primaryEmailAddress?.emailAddress || '';
      
      // Crear notas de ejemplo para nuevos usuarios (solo se ejecuta si no tiene notas)
      await createExampleNotes(userId || '', userEmail);
      
      const notesData = await getNotes(currentFolderId, userId, userEmail);
      
      // Convertir formato de BD a formato del componente
      const formattedNotes = notesData.map(note => ({
        id: note.id,
        title: note.title,
        content: note.content,
        type: note.type,
        color: note.color,
        isPinned: note.is_pinned,
        imageUrl: note.image_url,
        listItems: note.list_items,
        createdAt: note.created_at,
        folder_id: note.folder_id,
        reminder_date: note.reminder_date,
        reminder_time: note.reminder_time,
        reminder_location: note.reminder_location
      }));
      
      setNotes(formattedNotes);
      console.log('Notas cargadas:', formattedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sensor para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Requiere mover 8px antes de activar drag
      },
    })
  );

  // Filtrar notas por búsqueda
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtrar notas por carpeta actual
  const folderFilteredNotes = filteredNotes.filter(note => {
    if (currentFolderId) {
      return note.folder_id === currentFolderId;
    }
    return note.folder_id === null; // Solo mostrar notas sin carpeta en la vista principal
  });

  // Separar notas fijas y normales
  const pinnedNotes = folderFilteredNotes.filter(note => note.isPinned);
  const regularNotes = folderFilteredNotes.filter(note => !note.isPinned);

  // Debug logging
  console.log('Filter debug:', {
    totalNotes: notes.length,
    filteredNotes: filteredNotes.length,
    folderFilteredNotes: folderFilteredNotes.length,
    pinnedNotes: pinnedNotes.length,
    regularNotes: regularNotes.length,
    currentFolderId,
    searchQuery
  });

  // Cargar carpeta actual cuando cambie el parámetro
  useEffect(() => {
    if (currentFolderId && userId) {
      loadCurrentFolder();
    } else {
      setCurrentFolder(null);
    }
  }, [currentFolderId, userId]);

  const loadCurrentFolder = async () => {
    if (!currentFolderId || !userId) {
      setCurrentFolder(null);
      return;
    }
    
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress || '';
      const folders = await getFolders('notes', userId, userEmail);
      const folder = folders.find(f => f.id === currentFolderId);
      setCurrentFolder(folder || null);
    } catch (error) {
      console.error('Error loading folder:', error);
    }
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setShowCreateModal(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowCreateModal(true);
  };

  const handleSaveNote = async (noteData: any) => {
    console.log('handleSaveNote called with:', noteData);
    console.log('editingNote:', editingNote);
    
    try {
      if (editingNote) {
        // Actualizar nota existente
        console.log('Updating existing note');
        const updatedNote = await updateNote(editingNote.id, {
          title: noteData.title,
          content: noteData.content,
          color: noteData.color,
          is_pinned: noteData.isPinned,
          reminder_date: noteData.reminder_date,
          reminder_time: noteData.reminder_time,
          reminder_location: noteData.reminder_location,
          type: noteData.type || 'text'
        });
        
        if (updatedNote) {
          // Actualizar en el estado local
          setNotes(prev => prev.map(note => 
            note.id === editingNote.id ? {
              ...note,
              title: updatedNote.title,
              content: updatedNote.content,
              color: updatedNote.color,
              isPinned: updatedNote.is_pinned,
              reminder_date: updatedNote.reminder_date,
              reminder_time: updatedNote.reminder_time,
              reminder_location: updatedNote.reminder_location
            } : note
          ));
        }
      } else {
        // Crear nueva nota
        console.log('Creating new note');
        const userEmail = user?.primaryEmailAddress?.emailAddress || '';
        const newNote = await createNote({
          title: noteData.title,
          content: noteData.content,
          type: noteData.type || 'text',
          color: noteData.color,
          is_pinned: noteData.isPinned || false,
          folder_id: currentFolderId,
          reminder_date: noteData.reminder_date,
          reminder_time: noteData.reminder_time,
          reminder_location: noteData.reminder_location
        }, userId, userEmail);
        
        if (newNote) {
          // Agregar al estado local con formato correcto
          const formattedNote = {
            id: newNote.id,
            title: newNote.title,
            content: newNote.content,
            type: newNote.type,
            color: newNote.color,
            isPinned: newNote.is_pinned,
            imageUrl: newNote.image_url,
            listItems: newNote.list_items,
            createdAt: newNote.created_at,
            folder_id: newNote.folder_id,
            reminder_date: newNote.reminder_date,
            reminder_time: newNote.reminder_time,
            reminder_location: newNote.reminder_location
          };
          
          setNotes(prev => [formattedNote, ...prev]);
        }
      }
      
      console.log('Note saved successfully');
    } catch (error) {
      console.error('Error saving note:', error);
      // TODO: Mostrar mensaje de error al usuario
    }
    
    console.log('Closing modal and resetting editing state');
    setShowCreateModal(false);
    setEditingNote(null);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingNote(null);
  };

  const handleDeleteRequest = (note: Note) => {
    setNoteToDelete(note);
    setShowDeleteModal(true);
  };

  const handleMoveToTrash = async () => {
    if (!noteToDelete) return;

    setIsDeleting(true);
    try {
      const success = await moveNoteToTrash(noteToDelete.id);
      
      if (success) {
        toast.success(`"${noteToDelete.title || 'Sin título'}" movida a la papelera`);
        // Actualizar la lista de notas
        setNotes(prev => prev.filter(n => n.id !== noteToDelete.id));
      } else {
        toast.error('Error al mover la nota a la papelera');
      }
    } catch (error) {
      console.error('Error moving note to trash:', error);
      toast.error('Error al mover la nota a la papelera');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setNoteToDelete(null);
    }
  };

  const handleDeletePermanently = async () => {
    if (!noteToDelete) return;

    setIsDeleting(true);
    try {
      const success = await deleteNotePermanently(noteToDelete.id);
      
      if (success) {
        toast.success(`"${noteToDelete.title || 'Sin título'}" eliminada permanentemente`);
        // Actualizar la lista de notas
        setNotes(prev => prev.filter(n => n.id !== noteToDelete.id));
      } else {
        toast.error('Error al eliminar la nota');
      }
    } catch (error) {
      console.error('Error deleting note permanently:', error);
      toast.error('Error al eliminar la nota');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setNoteToDelete(null);
    }
  };

  const handleDeleteModalClose = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
      setNoteToDelete(null);
    }
  };

  // Función para manejar el final del drag
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setNotes((notes) => {
      const oldIndex = notes.findIndex(note => note.id === active.id);
      const newIndex = notes.findIndex(note => note.id === over.id);
      
      return arrayMove(notes, oldIndex, newIndex);
    });
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header con navegación */}
      <div className={`${THEME_COLORS.main.background} p-6 flex-shrink-0`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              {currentFolder ? (
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: currentFolder.color + '20' }}
                  >
                    <FolderIcon size={18} style={{ color: currentFolder.color }} />
                  </div>
                  <div>
                    {isEditingFolderName ? (
                      <input
                        type="text"
                        value={editingFolderName}
                        onChange={(e) => setEditingFolderName(e.target.value)}
                        onBlur={() => setIsEditingFolderName(false)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setIsEditingFolderName(false);
                          }
                          if (e.key === 'Escape') {
                            setIsEditingFolderName(false);
                          }
                        }}
                        className={`
                          text-3xl font-bold bg-transparent border-none outline-none
                          ${THEME_COLORS.dashboard.title}
                          border-b-2 border-blue-500 pb-1
                        `}
                        autoFocus
                        maxLength={30}
                      />
                    ) : (
                      <h1 
                        onClick={() => {
                          setEditingFolderName(currentFolder.name);
                          setIsEditingFolderName(true);
                        }}
                        className={`text-3xl font-bold ${THEME_COLORS.dashboard.title} cursor-pointer hover:text-blue-500 ${THEME_COLORS.transitions.all}`}
                      >
                        {currentFolder.name}
                      </h1>
                    )}
                    <p className={`text-sm ${THEME_COLORS.dashboard.subtitle}`}>
                      Carpeta de Mis Notas
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Home size={24} className={THEME_COLORS.icons.snippets} />
                  <h1 className={`text-3xl font-bold ${THEME_COLORS.dashboard.title}`}>
                    Mis Notas
                  </h1>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Buscador compacto que se expande */}
              <div className="relative">
                <Search className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10
                  transition-colors duration-200
                  ${isSearchFocused ? 'text-blue-500' : ''}
                `} />
                <input
                  type="text"
                  placeholder="Buscar notas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`
                    pl-10 pr-4 py-2 rounded-lg border ${THEME_COLORS.dashboard.card.border} 
                    ${THEME_COLORS.dashboard.card.background} ${THEME_COLORS.dashboard.title}
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                    transition-all duration-300 ease-in-out
                    ${isSearchFocused ? 'w-80 sm:w-96' : 'w-48 sm:w-64'}
                  `}
                />
              </div>

              {/* Botón Nueva nota - estilo consistente con snippets */}
              <button
                onClick={handleCreateNote}
                className={`
                  flex items-center space-x-2 px-4 py-2
                  ${THEME_COLORS.sidebar.nav.item.active.background}
                  ${THEME_COLORS.sidebar.nav.item.active.text}
                  border ${THEME_COLORS.sidebar.nav.item.active.border}
                  rounded-lg font-medium
                  hover:${THEME_COLORS.sidebar.nav.item.active.textHover}
                  ${THEME_COLORS.transitions.all}
                `}
              >
                <Plus size={18} />
                <span>Agregar</span>
              </button>

              {/* Botón Nueva carpeta - estilo consistente con snippets */}
              <button
                onClick={() => setShowFolderCreateModal(true)}
                className={`
                  flex items-center space-x-2 px-3 py-2
                  ${THEME_COLORS.topBar.actions.button.background}
                  ${THEME_COLORS.topBar.actions.button.text}
                  border ${THEME_COLORS.dashboard.card.border}
                  rounded-lg font-medium
                  hover:${THEME_COLORS.topBar.actions.button.textHover}
                  ${THEME_COLORS.transitions.all}
                `}
                title="Crear nueva carpeta"
              >
                <FolderPlus size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className={`flex-1 ${THEME_COLORS.main.background} px-6 pb-6 overflow-y-auto min-h-0`}>
        <div className="max-w-7xl mx-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={notes.map(note => note.id)} strategy={verticalListSortingStrategy}>
              {/* Notas fijas */}
              {pinnedNotes.length > 0 && (
                <div className="mb-8">
                  <h2 className={`${THEME_COLORS.dashboard.title} font-medium text-sm uppercase tracking-wide mb-4 flex items-center gap-2`}>
                    <Pin className="w-4 h-4" />
                    Fijadas
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                    {pinnedNotes.map((note, index) => (
                      <SortableNoteCard key={note.id} note={note} index={index} onEdit={handleEditNote} onDelete={handleDeleteRequest} />
                    ))}
                  </div>
                </div>
              )}

              {/* Separador */}
              {pinnedNotes.length > 0 && regularNotes.length > 0 && (
                <div className="mb-6">
                  <h2 className={`${THEME_COLORS.dashboard.subtitle} font-medium text-sm uppercase tracking-wide mb-4`}>
                    Otras
                  </h2>
                </div>
              )}

              {/* Notas normales - Grid masonry */}
              {regularNotes.length > 0 && (
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 space-y-4">
                  {regularNotes.map((note, index) => (
                    <SortableNoteCard key={note.id} note={note} index={index} masonry onEdit={handleEditNote} onDelete={handleDeleteRequest} />
                  ))}
                </div>
              )}
            </SortableContext>

          {/* Loading state */}
          {loading && (
            <div className="text-center py-20">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${THEME_COLORS.dashboard.card.background} flex items-center justify-center`}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
              <h3 className={`${THEME_COLORS.dashboard.title} text-lg font-medium mb-2`}>
                Cargando notas...
              </h3>
            </div>
          )}

          {/* Estado vacío */}
          {folderFilteredNotes.length === 0 && !loading && (
            <div className="text-center py-20">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${THEME_COLORS.dashboard.card.background} flex items-center justify-center`}>
                <Plus className={`w-8 h-8 ${THEME_COLORS.dashboard.subtitle}`} />
              </div>
              <h3 className={`${THEME_COLORS.dashboard.title} text-lg font-medium mb-2`}>
                {searchQuery 
                  ? 'No hay notas que coincidan' 
                  : currentFolder 
                    ? `La carpeta "${currentFolder.name}" está vacía`
                    : 'Aún no tienes notas'
                }
              </h3>
              <p className={`${THEME_COLORS.dashboard.subtitle} mb-6`}>
                {searchQuery 
                  ? 'Intenta con diferentes términos de búsqueda' 
                  : currentFolder
                    ? `Crea tu primera nota en "${currentFolder.name}"`
                    : 'Crea tu primera nota para comenzar'
                }
              </p>
              {!searchQuery && (
                <button
                  onClick={handleCreateNote}
                  className={`
                    px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white
                    ${THEME_COLORS.transitions.all} font-medium
                  `}
                >
                  {currentFolder ? `Crear nota en ${currentFolder.name}` : 'Crear primera nota'}
                </button>
              )}
            </div>
          )}
          </DndContext>
        </div>
      </div>

      {/* Modal de creación/edición */}
      <NoteEditorModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        note={editingNote}
        onSave={handleSaveNote}
      />

      {/* Modal de creación de carpetas */}
      <FolderCreateModal 
        isOpen={showFolderCreateModal} 
        onClose={() => setShowFolderCreateModal(false)}
        type="notes"
        parentFolderId={currentFolderId}
        parentFolderName={currentFolder?.name}
        onFolderCreated={() => {
          setShowFolderCreateModal(false);
          // Recargar datos dinámicamente sin recargar la página
          setTimeout(() => {
            // Aquí cargaríamos las carpetas de notas si tuviéramos la función
            console.log('Carpeta de notas creada');
          }, 500);
        }}
      />

      {/* Modal de eliminación de notas */}
      <DeleteNoteModal
        isOpen={showDeleteModal}
        onClose={handleDeleteModalClose}
        onMoveToTrash={handleMoveToTrash}
        onDeletePermanently={handleDeletePermanently}
        noteTitle={noteToDelete?.title || 'Sin título'}
        isProcessing={isDeleting}
      />
    </div>
  );
}

// Componente sortable que envuelve NoteCard
interface SortableNoteCardProps {
  note: Note;
  index: number;
  masonry?: boolean;
  onEdit?: (note: Note) => void;
  onDelete?: (note: Note) => void;
}

function SortableNoteCard({ note, index, masonry = false, onEdit, onDelete }: SortableNoteCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <NoteCard 
        note={note} 
        index={index} 
        masonry={masonry} 
        onEdit={onEdit}
        onDelete={onDelete}
        isDragging={isDragging}
      />
    </div>
  );
}

// Componente para tarjetas de notas
interface NoteCardProps {
  note: Note;
  index: number;
  masonry?: boolean;
  onEdit?: (note: Note) => void;
  onDelete?: (note: Note) => void;
  isDragging?: boolean;
}

function NoteCard({ note, index, masonry = false, onEdit, onDelete, isDragging = false }: NoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Cerrar menú cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = () => {
      if (showMenu) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenu]);

  const handleClick = () => {
    // No abrir modal si estamos arrastrando
    if (isDragging) return;
    
    if (onEdit) {
      onEdit(note);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`
        ${masonry ? 'break-inside-avoid mb-4' : ''}
        relative group cursor-pointer
      `}
    >
      <div
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative rounded-lg border border-gray-200 hover:shadow-lg 
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          ${THEME_COLORS.transitions.all}
          overflow-hidden
        `}
        style={{ 
          backgroundColor: note.color,
          minHeight: note.type === 'list' ? '120px' : note.type === 'image' ? '200px' : '100px'
        }}
      >
        {/* Imagen para notas con imagen */}
        {note.type === 'image' && note.imageUrl && (
          <div className="w-full h-32 bg-gray-200 mb-3 rounded-t-lg overflow-hidden">
            <img 
              src={note.imageUrl} 
              alt="" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iNzUiIHI9IjMwIiBmaWxsPSIjZDFkOWU2IiBzdHJva2U9IiNhYmI4YzMiIHN0cm9rZS13aWR0aD0iMiIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI5NSIgY3k9IjcwIiByPSI1IiBmaWxsPSIjZmZkNzAwIi8+PGVsbGlwc2UgY3g9IjEwMCIgY3k9Ijg1IiByeD0iMTUiIHJ5PSI4IiBmaWxsPSIjYWJiOGMzIi8+PHRleHQgeD0iNTAlIiB5PSIxMzUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+';
              }}
            />
          </div>
        )}

        {/* Contenido */}
        <div className="p-4">
          {/* Título si existe */}
          {note.title && (
            <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">
              {note.title}
            </h3>
          )}

          {/* Contenido según tipo */}
          {note.type === 'text' && (
            <div 
              className="text-gray-700 text-sm whitespace-pre-line line-clamp-6"
              dangerouslySetInnerHTML={{ __html: note.content }}
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            />
          )}

          {note.type === 'list' && note.listItems && (
            <div className="space-y-2">
              {note.listItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-start gap-2">
                  <div className={`
                    w-4 h-4 mt-0.5 border border-gray-400 rounded-sm flex-shrink-0
                    ${item.completed ? 'bg-blue-500 border-blue-500' : ''}
                  `}>
                    {item.completed && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          {note.type === 'image' && note.content && (
            <div 
              className="text-gray-700 text-sm line-clamp-4"
              dangerouslySetInnerHTML={{ __html: note.content }}
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            />
          )}
        </div>

        {/* Pin indicator */}
        {note.isPinned && (
          <div className="absolute top-2 right-2">
            <Pin className="w-4 h-4 text-gray-600" />
          </div>
        )}

        {/* Hover actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 bottom-0 bg-black/5 backdrop-blur-sm p-2 flex items-center justify-between"
            >
              <div className="flex items-center gap-1">
                <button className="p-1.5 hover:bg-black/10 rounded transition-colors">
                  <Bell className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1.5 hover:bg-black/10 rounded transition-colors">
                  <Palette className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1.5 hover:bg-black/10 rounded transition-colors">
                  <Archive className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="relative">
                <button 
                  className="p-1.5 hover:bg-black/10 rounded transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                >
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
                
                {/* Dropdown menu */}
                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      className={`
                        absolute bottom-full right-0 mb-1 w-36
                        ${THEME_COLORS.dashboard.card.background}
                        ${THEME_COLORS.dashboard.card.border} border
                        rounded-lg shadow-lg z-50
                      `}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMenu(false);
                          if (onDelete) {
                            onDelete(note);
                          }
                        }}
                        className={`
                          w-full px-3 py-2 text-left text-sm
                          hover:bg-red-50 dark:hover:bg-red-900/20
                          text-red-600 hover:text-red-700
                          flex items-center space-x-2
                          rounded-lg transition-colors
                        `}
                      >
                        <Trash2 size={14} />
                        <span>Eliminar</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}