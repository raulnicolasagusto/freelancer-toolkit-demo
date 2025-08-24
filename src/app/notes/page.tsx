'use client';

import { t } from '@/lib/i18n';
import { THEME_COLORS } from '@/lib/theme-colors';
import { Plus, Search, MoreVertical, Pin, Palette, Bell, Archive, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import NoteEditorModal from '@/components/notes/NoteEditorModal';

// Datos de ejemplo basados en la imagen de referencia
const EXAMPLE_NOTES = [
  // Notas fijas
  {
    id: '1',
    title: '',
    content: 'prueba 2',
    type: 'image' as const,
    color: '#A7C8E0',
    isPinned: true,
    imageUrl: '/api/placeholder/200/150',
    createdAt: '2024-01-15',
    folder_id: null
  },
  // Notas normales
  {
    id: '2',
    title: '',
    content: 'Te damos la bienvenida a Google Keep\n\nCaptura tus ideas.\n\nAgrega notas, listas, fotos y audios a Keep.',
    type: 'text' as const,
    color: '#FFF8C4',
    isPinned: false,
    createdAt: '2024-01-14',
    folder_id: null
  },
  {
    id: '3',
    title: '',
    content: 'Todo en un solo lugar\n\nSin importar la forma en la que accedas a Keep, todas las notas siempre están sincronizadas.\n\nEn la Web\nhttps://keep.google.com\n\nEn Android\nhttps://g.co/keep\n\nEn Chrome\nhttps://g.co/keepinchrome',
    type: 'text' as const,
    color: '#FFB5A0',
    isPinned: false,
    createdAt: '2024-01-13',
    folder_id: null
  },
  {
    id: '4',
    title: '',
    content: 'Crear una lista',
    type: 'list' as const,
    color: '#A7CCBB',
    isPinned: false,
    listItems: [
      { id: '1', text: '1 elemento completado', completed: true },
      { id: '2', text: 'Los elementos marcados pasan de forma automática al final de la...', completed: false }
    ],
    createdAt: '2024-01-12',
    folder_id: null
  },
  {
    id: '5',
    title: '',
    content: '¿Ya no usas más una nota?\n\nPresiona el botón para archivar o desliza el dedo para que desaparezca en Android.\n\n¡Pruébalo! Puedes buscarla cuando quieras.',
    type: 'text' as const,
    color: '#E8F5E8',
    isPinned: false,
    createdAt: '2024-01-11',
    folder_id: null
  },
  {
    id: '6',
    title: 'Prueba 1',
    content: 'pruebaghgjgkgkuk',
    type: 'image' as const,
    color: '#C8E6C9',
    isPinned: false,
    imageUrl: '/api/placeholder/180/120',
    createdAt: '2024-01-10',
    folder_id: null
  }
];

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
}

export default function NotesPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFolderId = searchParams.get('folder');
  
  const [notes, setNotes] = useState<Note[]>(EXAMPLE_NOTES);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Filtrar notas por búsqueda
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separar notas fijas y normales
  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const regularNotes = filteredNotes.filter(note => !note.isPinned);

  const handleCreateNote = () => {
    setEditingNote(null);
    setShowCreateModal(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowCreateModal(true);
  };

  const handleSaveNote = (noteData: any) => {
    if (editingNote) {
      // Actualizar nota existente
      setNotes(prev => prev.map(note => 
        note.id === editingNote.id ? { ...noteData } : note
      ));
    } else {
      // Crear nueva nota
      setNotes(prev => [...prev, noteData]);
    }
    setShowCreateModal(false);
    setEditingNote(null);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingNote(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header con barra de búsqueda */}
      <div className={`${THEME_COLORS.main.background} border-b ${THEME_COLORS.dashboard.card.border} p-4`}>
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar en las notas"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                w-full pl-10 pr-4 py-3 rounded-lg border ${THEME_COLORS.dashboard.card.border} 
                ${THEME_COLORS.dashboard.card.background} ${THEME_COLORS.dashboard.title}
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                ${THEME_COLORS.transitions.all}
              `}
            />
          </div>
          <button
            onClick={handleCreateNote}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-lg
              bg-blue-500 hover:bg-blue-600 text-white
              ${THEME_COLORS.transitions.all}
              font-medium
            `}
          >
            <Plus className="w-5 h-5" />
            <span>Nueva nota</span>
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className={`flex-1 ${THEME_COLORS.main.background} p-6 overflow-y-auto`}>
        <div className="max-w-7xl mx-auto">
          {/* Notas fijas */}
          {pinnedNotes.length > 0 && (
            <div className="mb-8">
              <h2 className={`${THEME_COLORS.dashboard.title} font-medium text-sm uppercase tracking-wide mb-4 flex items-center gap-2`}>
                <Pin className="w-4 h-4" />
                Fijadas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {pinnedNotes.map((note, index) => (
                  <NoteCard key={note.id} note={note} index={index} onEdit={handleEditNote} />
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
                <NoteCard key={note.id} note={note} index={index} masonry onEdit={handleEditNote} />
              ))}
            </div>
          )}

          {/* Estado vacío */}
          {filteredNotes.length === 0 && !loading && (
            <div className="text-center py-20">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${THEME_COLORS.dashboard.card.background} flex items-center justify-center`}>
                <Plus className={`w-8 h-8 ${THEME_COLORS.dashboard.subtitle}`} />
              </div>
              <h3 className={`${THEME_COLORS.dashboard.title} text-lg font-medium mb-2`}>
                {searchQuery ? 'No hay notas que coincidan' : 'Aún no tienes notas'}
              </h3>
              <p className={`${THEME_COLORS.dashboard.subtitle} mb-6`}>
                {searchQuery ? 'Intenta con diferentes términos de búsqueda' : 'Crea tu primera nota para comenzar'}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleCreateNote}
                  className={`
                    px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white
                    ${THEME_COLORS.transitions.all} font-medium
                  `}
                >
                  Crear primera nota
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de creación/edición */}
      <NoteEditorModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        note={editingNote}
        onSave={handleSaveNote}
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
}

function NoteCard({ note, index, masonry = false, onEdit }: NoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
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
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbjwvdGV4dD48L3N2Zz4=';
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
            <p className="text-gray-700 text-sm whitespace-pre-line line-clamp-6">
              {note.content}
            </p>
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
            <p className="text-gray-700 text-sm line-clamp-4">
              {note.content}
            </p>
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
              <button className="p-1.5 hover:bg-black/10 rounded transition-colors">
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}