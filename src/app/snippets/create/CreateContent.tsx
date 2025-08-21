'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { THEME_COLORS } from '@/lib/theme-colors';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import MarkdownEditor from '@/components/snippets/MarkdownEditor';
import SnippetEditor from '@/components/snippets/SnippetEditor';
import { motion } from 'framer-motion';

export default function CreateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get('type') as 'markdown' | 'snippet' | null;
  
  const [title, setTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!type || !['markdown', 'snippet'].includes(type)) {
      router.push('/snippets');
    }
  }, [type, router]);

  const handleSave = () => {
    // TODO: Implementar guardado
    console.log('Saving...', { type, title });
  };

  const handleBack = () => {
    router.push('/snippets');
  };

  if (!type) return null;

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
              placeholder={`Nuevo ${type === 'markdown' ? 'Markdown' : 'Snippet'}`}
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
              {title || `Nuevo ${type === 'markdown' ? 'Markdown' : 'Snippet'}`}
            </h1>
          )}

          <span className={`
            px-2 py-1 text-xs font-medium rounded-full
            ${type === 'markdown' 
              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
              : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
            }
          `}>
            {type === 'markdown' ? 'Markdown' : 'Snippet'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {type === 'markdown' && (
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
        {type === 'markdown' ? (
          <MarkdownEditor 
            showPreview={showPreview}
            onTitleChange={setTitle}
          />
        ) : (
          <SnippetEditor 
            onTitleChange={setTitle}
          />
        )}
      </div>
    </motion.div>
  );
}