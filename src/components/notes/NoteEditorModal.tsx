'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Type, 
  Palette, 
  Bell, 
  Pin, 
  Image, 
  PenTool, 
  Undo, 
  Redo,
  MoreHorizontal,
  Archive,
  Bold,
  Italic,
  Underline
} from 'lucide-react';
import { THEME_COLORS } from '@/lib/theme-colors';

interface NoteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  note?: {
    id: string;
    title: string;
    content: string;
    color: string;
    type: 'text' | 'list' | 'image';
  };
  onSave: (noteData: any) => void;
}

// Paleta de colores predefinida
const COLOR_PALETTE = [
  '#FFFFFF', // Blanco
  '#FFF8C4', // Amarillo claro
  '#FFE0B2', // Naranja claro  
  '#FFB5A0', // Coral
  '#F8BBD9', // Rosa claro
  '#E1C4FD', // Púrpura claro
  '#A7C8E0', // Azul claro
  '#A7CCBB', // Verde azulado
  '#C8E6C9', // Verde claro
  '#E8F5E8', // Verde muy claro
  '#F0F0F0', // Gris claro
  '#D7CCC8', // Beige
];

// Toolbar buttons configuration
const TOOLBAR_BUTTONS = [
  { 
    id: 'format', 
    icon: Type, 
    tooltip: 'Opciones de formato',
    hasSubmenu: true 
  },
  { 
    id: 'background', 
    icon: Palette, 
    tooltip: 'Cambiar color de fondo',
    hasSubmenu: true 
  },
  { 
    id: 'reminder', 
    icon: Bell, 
    tooltip: 'Recordatorio' 
  },
  { 
    id: 'pin', 
    icon: Pin, 
    tooltip: 'Fijar nota' 
  },
  { 
    id: 'image', 
    icon: Image, 
    tooltip: 'Agregar imagen' 
  },
  { 
    id: 'draw', 
    icon: PenTool, 
    tooltip: 'Añadir dibujo' 
  },
  { 
    id: 'undo', 
    icon: Undo, 
    tooltip: 'Deshacer' 
  },
  { 
    id: 'redo', 
    icon: Redo, 
    tooltip: 'Rehacer' 
  },
  { 
    id: 'archive', 
    icon: Archive, 
    tooltip: 'Archivar' 
  },
  { 
    id: 'more', 
    icon: MoreHorizontal, 
    tooltip: 'Más opciones' 
  }
];

export default function NoteEditorModal({ isOpen, onClose, note, onSave }: NoteEditorModalProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [selectedColor, setSelectedColor] = useState(note?.color || COLOR_PALETTE[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [activeFormat, setActiveFormat] = useState<string[]>([]);
  
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isOpen]);

  const handleSave = () => {
    const noteData = {
      id: note?.id || `note_${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      color: selectedColor,
      type: 'text' as const,
      isPinned: false,
      createdAt: new Date().toISOString(),
    };
    
    onSave(noteData);
    onClose();
  };

  const handleToolbarClick = (buttonId: string) => {
    switch (buttonId) {
      case 'format':
        setShowFormatMenu(!showFormatMenu);
        setShowColorPicker(false);
        break;
      case 'background':
        setShowColorPicker(!showColorPicker);
        setShowFormatMenu(false);
        break;
      case 'reminder':
        // Implementar más adelante
        console.log('Reminder clicked');
        break;
      case 'pin':
        // Implementar más adelante
        console.log('Pin clicked');
        break;
      case 'image':
        // Implementar más adelante
        console.log('Image clicked');
        break;
      case 'draw':
        // Implementar más adelante
        console.log('Draw clicked');
        break;
      case 'undo':
        // Implementar más adelante
        console.log('Undo clicked');
        break;
      case 'redo':
        // Implementar más adelante
        console.log('Redo clicked');
        break;
      case 'archive':
        // Implementar más adelante
        console.log('Archive clicked');
        break;
      case 'more':
        // Implementar más adelante
        console.log('More clicked');
        break;
      default:
        break;
    }
  };

  const handleFormatClick = (format: string) => {
    // Implementación básica de formato (sin editor rico por ahora)
    console.log('Format clicked:', format);
    
    if (activeFormat.includes(format)) {
      setActiveFormat(prev => prev.filter(f => f !== format));
    } else {
      setActiveFormat(prev => [...prev, format]);
    }
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setSelectedColor(COLOR_PALETTE[0]);
    setShowColorPicker(false);
    setShowFormatMenu(false);
    setActiveFormat([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
          style={{ backgroundColor: selectedColor }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-black/10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-current opacity-40" />
              <span className="text-sm opacity-70">
                {note?.id ? 'Editar nota' : 'Nueva nota'}
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-black/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 min-h-0">
            {/* Title */}
            <input
              ref={titleRef}
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-medium bg-transparent border-none outline-none placeholder-current/60 mb-4"
              style={{ color: selectedColor === '#FFFFFF' ? '#000' : '#333' }}
            />

            {/* Content */}
            <textarea
              ref={contentRef}
              placeholder="Añade una nota..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 bg-transparent border-none outline-none resize-none placeholder-current/60"
              style={{ color: selectedColor === '#FFFFFF' ? '#000' : '#333' }}
            />
          </div>

          {/* Color Picker Submenu */}
          <AnimatePresence>
            {showColorPicker && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-20 left-4 right-4 bg-white rounded-lg shadow-lg border p-4 z-10"
              >
                <div className="grid grid-cols-6 gap-2">
                  {COLOR_PALETTE.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        setShowColorPicker(false);
                      }}
                      className={`
                        w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform
                        ${selectedColor === color ? 'border-gray-800' : 'border-gray-300'}
                      `}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Format Menu Submenu */}
          <AnimatePresence>
            {showFormatMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-20 left-4 bg-white rounded-lg shadow-lg border p-2 z-10"
              >
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleFormatClick('bold')}
                    className={`
                      p-2 rounded hover:bg-gray-100 transition-colors
                      ${activeFormat.includes('bold') ? 'bg-blue-100 text-blue-600' : ''}
                    `}
                    title="Negrita"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleFormatClick('italic')}
                    className={`
                      p-2 rounded hover:bg-gray-100 transition-colors
                      ${activeFormat.includes('italic') ? 'bg-blue-100 text-blue-600' : ''}
                    `}
                    title="Cursiva"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleFormatClick('underline')}
                    className={`
                      p-2 rounded hover:bg-gray-100 transition-colors
                      ${activeFormat.includes('underline') ? 'bg-blue-100 text-blue-600' : ''}
                    `}
                    title="Subrayado"
                  >
                    <Underline className="w-4 h-4" />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <button
                    onClick={() => handleFormatClick('h1')}
                    className={`
                      p-2 rounded hover:bg-gray-100 transition-colors text-sm font-semibold
                      ${activeFormat.includes('h1') ? 'bg-blue-100 text-blue-600' : ''}
                    `}
                    title="Título grande"
                  >
                    H1
                  </button>
                  <button
                    onClick={() => handleFormatClick('h2')}
                    className={`
                      p-2 rounded hover:bg-gray-100 transition-colors text-sm font-semibold
                      ${activeFormat.includes('h2') ? 'bg-blue-100 text-blue-600' : ''}
                    `}
                    title="Subtítulo"
                  >
                    H2
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toolbar */}
          <div className="border-t border-black/10 p-3">
            <div className="flex items-center justify-between">
              {/* Toolbar Icons */}
              <div className="flex items-center gap-1">
                {TOOLBAR_BUTTONS.map((button) => {
                  const IconComponent = button.icon;
                  return (
                    <button
                      key={button.id}
                      onClick={() => handleToolbarClick(button.id)}
                      className="p-2 hover:bg-black/10 rounded-full transition-colors relative group"
                      title={button.tooltip}
                    >
                      <IconComponent className="w-5 h-5" />
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                        {button.tooltip}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
              >
                {note?.id ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}