'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { THEME_COLORS } from '@/lib/theme-colors';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import MarkdownEditor from '@/components/snippets/MarkdownEditor';
import SnippetEditor from '@/components/snippets/SnippetEditor';
import FolderSelector from '@/components/snippets/FolderSelector';
import { createSnippet, getSnippetById, updateSnippet } from '@/lib/snippets';
import { motion } from 'framer-motion';
import { useAuth, useUser } from '@clerk/nextjs';

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
        setSelectedFolderId(snippet.folder_id);
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
        alert('Snippet no encontrado');
        router.push('/snippets');
      }
    } catch (error) {
      console.error('Error loading snippet:', error);
      alert('Error cargando el snippet');
      router.push('/snippets');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Por favor ingresa un título');
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
      alert('Error de autenticación. Intenta nuevamente.');
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
        router.push('/snippets');
      }
    } catch (error) {
      console.error('Error saving snippet:', error);
      alert('Error al guardar. Intenta nuevamente.');
    }
  };

  const handleBack = () => {
    router.push('/snippets');
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
        ${THEME_COLORS.topBar.background} ${THEME_COLORS.topBar.border}
        p-4 flex items-center justify-between
      `}>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className={`
              p-2 rounded-lg
              ${THEME_COLORS.topBar.actions.button.background}
              ${THEME_COLORS.topBar.actions.button.text} ${THEME_COLORS.topBar.actions.button.textHover}
              ${THEME_COLORS.transitions.all}
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
                ${THEME_COLORS.dashboard.title}
                min-w-[200px]
              `}
              placeholder={isEditing ? `Editando ${title || 'snippet'}` : `Nuevo ${type === 'markdown' ? 'Markdown' : 'Snippet'}`}
              autoFocus
            />
          ) : (
            <h1
              onClick={() => setIsEditingTitle(true)}
              className={`
                text-xl font-semibold cursor-pointer
                ${THEME_COLORS.dashboard.title}
                hover:${THEME_COLORS.dashboard.subtitle}
                ${THEME_COLORS.transitions.all}
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
          {(isEditing ? snippetType : type) === 'markdown' && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg
                ${showPreview 
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                  : THEME_COLORS.topBar.actions.button.background
                }
                ${THEME_COLORS.topBar.actions.button.text} ${THEME_COLORS.topBar.actions.button.textHover}
                ${THEME_COLORS.transitions.all}
              `}
            >
              <Eye size={16} />
              <span>{showPreview ? 'Editar' : 'Vista previa'}</span>
            </button>
          )}
          
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
          />
        ) : (
          <SnippetEditor 
            onTitleChange={setTitle}
            onTabsChange={setTabs}
            onObservationsChange={setObservations}
            initialTabs={tabs}
            initialObservations={observations}
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