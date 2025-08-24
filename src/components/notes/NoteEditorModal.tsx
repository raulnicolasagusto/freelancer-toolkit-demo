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
import ReminderMenu from './ReminderMenu';

interface NoteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  note?: {
    id: string;
    title: string;
    content: string;
    color: string;
    type: 'text' | 'list' | 'image';
    reminder_date?: string;
    reminder_time?: string;
    reminder_location?: string;
  };
  onSave: (noteData: {
    id: string;
    title: string;
    content: string;
    color: string;
    type: 'text';
    isPinned: boolean;
    createdAt: string;
    reminder_date?: string;
    reminder_time?: string;
    reminder_location?: string;
  }) => void;
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
  const [showReminderMenu, setShowReminderMenu] = useState(false);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [reminderData, setReminderData] = useState({
    date: note?.reminder_date || '',
    time: note?.reminder_time || '',
    location: note?.reminder_location || ''
  });
  
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Inicializar campos basado en si hay una nota para editar
      const initialTitle = note?.title || '';
      const initialContent = note?.content || '';
      const initialColor = note?.color || COLOR_PALETTE[0];
      
      setTitle(initialTitle);
      setContent(initialContent);
      setSelectedColor(initialColor);
      setReminderData({
        date: note?.reminder_date || '',
        time: note?.reminder_time || '',
        location: note?.reminder_location || ''
      });
      
      // Establecer contenido en el div editable
      if (contentRef.current) {
        contentRef.current.innerHTML = initialContent;
      }
      
      // Enfocar el campo de título
      setTimeout(() => {
        if (titleRef.current) {
          titleRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, note?.id]);

  const handleSave = () => {
    console.log('handleSave called');
    console.log('title:', title);
    console.log('content:', content);
    
    // Permitir guardar si hay al menos título o contenido
    const hasTitle = title.trim().length > 0;
    const hasContent = content.trim().length > 0;
    
    if (!hasTitle && !hasContent) {
      console.log('No content to save - both title and content are empty');
      handleClose();
      return;
    }
    
    const noteData = {
      id: note?.id || `note_${Date.now()}`,
      title: hasTitle ? title.trim() : '',
      content: hasContent ? content.trim() : '',
      color: selectedColor,
      type: 'text' as const,
      isPinned: false,
      createdAt: new Date().toISOString(),
      folder_id: null, // Agregar esta propiedad que falta
      reminder_date: reminderData.date || undefined,
      reminder_time: reminderData.time || undefined,
      reminder_location: reminderData.location || undefined,
    };
    
    console.log('Calling onSave with noteData:', noteData);
    
    try {
      onSave(noteData);
      console.log('onSave completed successfully');
      handleClose();
    } catch (error) {
      console.error('Error in onSave:', error);
    }
  };

  const handleToolbarClick = (buttonId: string) => {
    switch (buttonId) {
      case 'format':
        setShowFormatMenu(!showFormatMenu);
        setShowColorPicker(false);
        setShowReminderMenu(false);
        break;
      case 'background':
        setShowColorPicker(!showColorPicker);
        setShowFormatMenu(false);
        setShowReminderMenu(false);
        break;
      case 'reminder':
        setShowReminderMenu(!showReminderMenu);
        setShowColorPicker(false);
        setShowFormatMenu(false);
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
    if (!contentRef.current) return;
    
    // Asegurar que el div tenga foco
    contentRef.current.focus();
    
    try {
      let success = false;
      
      switch (format) {
        case 'bold':
          success = document.execCommand('bold', false, null);
          break;
        case 'italic':
          success = document.execCommand('italic', false, null);
          break;
        case 'underline':
          success = document.execCommand('underline', false, null);
          break;
        case 'h1':
          success = document.execCommand('formatBlock', false, '<h1>');
          break;
        case 'h2':
          success = document.execCommand('formatBlock', false, '<h2>');
          break;
        default:
          return;
      }
      
      // Actualizar el estado con el contenido HTML
      setContent(contentRef.current.innerHTML);
      
      // Actualizar formatos activos
      updateActiveFormats();
      
      console.log(`Format ${format} applied:`, success);
      
    } catch (error) {
      console.error('Error applying format:', error);
    }
  };

  const updateActiveFormats = () => {
    if (!contentRef.current) return;
    
    const formats = [];
    
    if (document.queryCommandState('bold')) formats.push('bold');
    if (document.queryCommandState('italic')) formats.push('italic');
    if (document.queryCommandState('underline')) formats.push('underline');
    
    // Verificar formatos de bloque
    const formatBlock = document.queryCommandValue('formatBlock');
    if (formatBlock === 'h1') formats.push('h1');
    if (formatBlock === 'h2') formats.push('h2');
    
    setActiveFormats(formats);
  };

  const handleContentClick = () => {
    // Actualizar formatos activos cuando se hace clic en el contenido
    setTimeout(() => updateActiveFormats(), 10);
  };

  const handleContentKeyUp = () => {
    // Actualizar formatos activos cuando se mueve el cursor
    updateActiveFormats();
  };

  const handleReminderSave = (newReminderData: { date: string; time: string; location: string }) => {
    setReminderData(newReminderData);
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setSelectedColor(COLOR_PALETTE[0]);
    setShowColorPicker(false);
    setShowFormatMenu(false);
    setShowReminderMenu(false);
    setReminderData({ date: '', time: '', location: '' });
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
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning={true}
              onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
              onClick={handleContentClick}
              onKeyUp={handleContentKeyUp}
              className="w-full h-64 bg-transparent border-none outline-none resize-none overflow-y-auto p-2 border border-gray-200 rounded [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400"
              style={{ color: selectedColor === '#FFFFFF' ? '#000' : '#333' }}
              data-placeholder="Añade una nota..."
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
                    className={`p-2 rounded transition-colors ${
                      activeFormats.includes('bold') 
                        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                        : 'hover:bg-gray-100'
                    }`}
                    title="Negrita"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleFormatClick('italic')}
                    className={`p-2 rounded transition-colors ${
                      activeFormats.includes('italic') 
                        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                        : 'hover:bg-gray-100'
                    }`}
                    title="Cursiva"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleFormatClick('underline')}
                    className={`p-2 rounded transition-colors ${
                      activeFormats.includes('underline') 
                        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                        : 'hover:bg-gray-100'
                    }`}
                    title="Subrayado"
                  >
                    <Underline className="w-4 h-4" />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <button
                    onClick={() => handleFormatClick('h1')}
                    className={`p-2 rounded transition-colors text-sm font-semibold ${
                      activeFormats.includes('h1') 
                        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                        : 'hover:bg-gray-100'
                    }`}
                    title="Título grande"
                  >
                    H1
                  </button>
                  <button
                    onClick={() => handleFormatClick('h2')}
                    className={`p-2 rounded transition-colors text-sm font-semibold ${
                      activeFormats.includes('h2') 
                        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                        : 'hover:bg-gray-100'
                    }`}
                    title="Subtítulo"
                  >
                    H2
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reminder Menu Submenu */}
          <ReminderMenu
            isOpen={showReminderMenu}
            onClose={() => setShowReminderMenu(false)}
            onSave={handleReminderSave}
            currentReminder={reminderData.date ? reminderData : undefined}
          />

          {/* Toolbar */}
          <div className="border-t border-black/10 p-3">
            <div className="flex items-center justify-between">
              {/* Toolbar Icons */}
              <div className="flex items-center gap-1">
                {TOOLBAR_BUTTONS.map((button) => {
                  const IconComponent = button.icon;
                  const hasReminder = button.id === 'reminder' && reminderData.date && reminderData.time;
                  
                  return (
                    <button
                      key={button.id}
                      onClick={() => handleToolbarClick(button.id)}
                      className={`p-2 hover:bg-black/10 rounded-full transition-colors relative group ${
                        hasReminder ? 'text-orange-500' : ''
                      }`}
                      title={button.tooltip}
                    >
                      <IconComponent className="w-5 h-5" />
                      
                      {/* Indicator dot for active reminder */}
                      {hasReminder && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"></div>
                      )}
                      
                      {/* Tooltip */}
                      <div className={`
                        absolute bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20
                        ${button.id === 'more' || button.id === 'archive' ? 'right-0' : 'left-1/2 transform -translate-x-1/2'}
                      `}>
                        {button.tooltip}
                        {hasReminder && (
                          <div className="text-orange-300 mt-1">
                            {new Date(reminderData.date).toLocaleDateString()} {reminderData.time}
                          </div>
                        )}
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