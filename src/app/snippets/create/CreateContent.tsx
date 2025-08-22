'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { THEME_COLORS } from '@/lib/theme-colors';
import { ArrowLeft, Save, Eye, Copy, Sun, Moon } from 'lucide-react';
import MarkdownEditor from '@/components/snippets/MarkdownEditor';
import SnippetEditor from '@/components/snippets/SnippetEditor';
import FolderSelector from '@/components/snippets/FolderSelector';
import { createSnippet, getSnippetById, updateSnippet } from '@/lib/snippets';
import { motion } from 'framer-motion';
import { useAuth, useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

export default function CreateContent() {
  const { userId } = useAuth();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get('type') as 'markdown' | 'snippet' | null;
  const editId = searchParams.get('edit'); // ID para edición
  
  const [title, setTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showFolderSelector, setShowFolderSelector] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [tabs, setTabs] = useState<any[]>([]);
  const [observations, setObservations] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snippetType, setSnippetType] = useState<'markdown' | 'snippet' | null>(null);
  const [isEditorDarkMode, setIsEditorDarkMode] = useState(false);

  useEffect(() => {
    if (editId) {
      // Modo edición - cargar datos del snippet
      setIsEditing(true);
      loadSnippetData();
    } else if (!type || !['markdown', 'snippet'].includes(type)) {
      // Modo creación - verificar tipo válido
      router.push('/snippets');
    }
  }, [type, editId, router]);

  const loadSnippetData = async () => {
    if (!editId || !userId) return;

    setLoading(true);
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress || '';
      const snippet = await getSnippetById(editId, userId, userEmail);
      
      if (snippet) {
        setTitle(snippet.title);
        setContent(snippet.code);
        setObservations(snippet.observations || '');
        setSelectedFolderId(snippet.folder_id || null);
        setSnippetType(snippet.type);
        
        // Si es un snippet con tabs, cargar los tabs
        if (snippet.tabs && snippet.tabs.length > 0) {
          setTabs(snippet.tabs);
        } else {
          // Si no tiene tabs, crear uno con el código principal
          setTabs([{
            id: 1,
            title: snippet.title,
            language: snippet.language,
            code: snippet.code
          }]);
        }
      } else {
        toast.error('Snippet no encontrado');
        router.push('/snippets');
      }
    } catch (error) {
      console.error('Error loading snippet:', error);
      toast.error('Error cargando el snippet');
      router.push('/snippets');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Por favor ingresa un título');
      return;
    }
    
    // Si estamos editando, guardar directamente sin mostrar modal
    if (isEditing) {
      handleFolderSelect(selectedFolderId);
    } else {
      // Solo en modo creación mostrar selector de carpeta
      setShowFolderSelector(true);
    }
  };

  const handleFolderSelect = async (folderId: string | null) => {
    if (!userId) {
      console.error('No user ID available');
      toast.error('Error de autenticación. Intenta nuevamente.');
      return;
    }

    try {
      const snippetType = isEditing ? (editId ? await getSnippetById(editId, userId) : null)?.type || 'snippet' : type as 'snippet' | 'markdown';
      
      const snippetData = {
        title: title.trim(),
        type: snippetType,
        folder_id: folderId,
        ...(snippetType === 'markdown' ? {
          code: content,
          language: 'markdown',
          description: 'Documento Markdown'
        } : {
          code: tabs.length > 0 ? tabs[0].code : '',
          language: tabs.length > 0 ? tabs[0].language : 'javascript',
          description: observations || 'Colección de snippets',
          observations,
          tabs: tabs
        })
      };

      console.log(isEditing ? 'Updating snippet:' : 'Saving snippet:', snippetData);
      
      let savedSnippet;
      if (isEditing && editId) {
        savedSnippet = await updateSnippet(editId, snippetData);
      } else {
        savedSnippet = await createSnippet(snippetData, userId);
      }
      
      if (savedSnippet) {
        console.log('Snippet saved successfully:', savedSnippet);
        // Mostrar notificación de éxito
        const action = isEditing ? 'actualizado' : 'creado';
        const type = snippetType === 'markdown' ? 'Markdown' : 'Snippet';
        toast.success(`${type} ${action} exitosamente`);
        router.push('/snippets');
      }
    } catch (error) {
      console.error('Error saving snippet:', error);
      toast.error('Error al guardar. Intenta nuevamente.');
    }
  };

  const handleBack = () => {
    router.push('/snippets');
  };

  const handleCopyContent = async () => {
    try {
      let contentToCopy = '';
      
      if ((isEditing ? snippetType : type) === 'markdown') {
        contentToCopy = content;
      } else {
        // Para snippets, copiar todos los tabs
        if (tabs.length > 0) {
          contentToCopy = tabs.map(tab => 
            `// ${tab.title} (${tab.language})\n${tab.code}`
          ).join('\n\n');
        }
      }
      
      await navigator.clipboard.writeText(contentToCopy);
      // Aquí podrías agregar una notificación visual de éxito
    } catch (err) {
      console.error('Error copying content:', err);
    }
  };

  if (!type && !isEditing) return null;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-screen flex flex-col"
    >
      {/* Header */}
      <div className={`
        ${isEditorDarkMode ? 'bg-gray-800 border-gray-700' : `${THEME_COLORS.topBar.background} ${THEME_COLORS.topBar.border}`}
        p-4 flex items-center justify-between transition-colors duration-200
      `}>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${isEditorDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white' 
                : `${THEME_COLORS.topBar.actions.button.background} ${THEME_COLORS.topBar.actions.button.text} ${THEME_COLORS.topBar.actions.button.textHover}`
              }
            `}
          >
            <ArrowLeft size={18} />
          </button>

          {/* Title */}
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditingTitle(false);
                }
              }}
              className={`
                text-xl font-semibold bg-transparent border-none outline-none
                ${isEditorDarkMode ? 'text-white' : THEME_COLORS.dashboard.title}
                min-w-[200px]
              `}
              placeholder={isEditing ? `Editando ${title || 'snippet'}` : `Nuevo ${type === 'markdown' ? 'Markdown' : 'Snippet'}`}
              autoFocus
            />
          ) : (
            <h1
              onClick={() => setIsEditingTitle(true)}
              className={`
                text-xl font-semibold cursor-pointer transition-all duration-200
                ${isEditorDarkMode ? 'text-white hover:text-gray-300' : `${THEME_COLORS.dashboard.title} hover:${THEME_COLORS.dashboard.subtitle}`}
                ${title ? '' : 'text-opacity-60'}
              `}
            >
              {title || (isEditing ? 'Editando snippet' : `Nuevo ${type === 'markdown' ? 'Markdown' : 'Snippet'}`)}
            </h1>
          )}

          <span className={`
            px-2 py-1 text-xs font-medium rounded-full
            ${(isEditing ? snippetType : type) === 'markdown' 
              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
              : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
            }
          `}>
            {(isEditing ? snippetType : type) === 'markdown' ? 'Markdown' : 'Snippet'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setIsEditorDarkMode(!isEditorDarkMode)}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${isEditorDarkMode 
                ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
            title={isEditorDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isEditorDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {(isEditing ? snippetType : type) === 'markdown' && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
                ${showPreview 
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                  : (isEditorDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                    : THEME_COLORS.topBar.actions.button.background
                  )
                }
                ${!showPreview && !isEditorDarkMode ? `${THEME_COLORS.topBar.actions.button.text} ${THEME_COLORS.topBar.actions.button.textHover}` : ''}
              `}
            >
              <Eye size={16} />
              <span>{showPreview ? 'Editar' : 'Vista previa'}</span>
            </button>
          )}

          <button
            onClick={handleCopyContent}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${isEditorDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white' 
                : `${THEME_COLORS.topBar.actions.button.background} ${THEME_COLORS.topBar.actions.button.text} ${THEME_COLORS.topBar.actions.button.textHover}`
              }
            `}
            title="Copiar contenido"
          >
            <Copy size={16} />
          </button>
          
          <button
            onClick={handleSave}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg
              bg-blue-500 hover:bg-blue-600 text-white
              ${THEME_COLORS.transitions.all}
              font-medium
            `}
          >
            <Save size={16} />
            <span>Guardar</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {(isEditing ? snippetType : type) === 'markdown' ? (
          <MarkdownEditor 
            showPreview={showPreview}
            onTitleChange={setTitle}
            onContentChange={setContent}
            initialContent={content}
            isEditorDarkMode={isEditorDarkMode}
            onThemeChange={setIsEditorDarkMode}
          />
        ) : (
          <SnippetEditor 
            onTitleChange={setTitle}
            onTabsChange={setTabs}
            onObservationsChange={setObservations}
            initialTabs={tabs}
            initialObservations={observations}
            isEditorDarkMode={isEditorDarkMode}
            onThemeChange={setIsEditorDarkMode}
          />
        )}
      </div>

      {/* Folder Selector Modal */}
      <FolderSelector
        isOpen={showFolderSelector}
        onClose={() => setShowFolderSelector(false)}
        onSelect={handleFolderSelect}
        type="snippets"
        title={title || `Nuevo ${type}`}
      />
    </motion.div>
  );
}