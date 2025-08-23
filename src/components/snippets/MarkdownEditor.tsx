'use client';

import { useState, useEffect, useRef } from 'react';
import { THEME_COLORS } from '@/lib/theme-colors';
import { Eye, Edit, Sun, Moon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';

interface MarkdownEditorProps {
  showPreview: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  initialContent?: string;
  isEditorDarkMode?: boolean;
  onThemeChange?: (isDark: boolean) => void;
  onObservationsChange: (observations: string) => void;
  initialObservations?: string;
}

export default function MarkdownEditor({ showPreview, onTitleChange, onContentChange, initialContent, isEditorDarkMode: propIsEditorDarkMode, onThemeChange, onObservationsChange, initialObservations }: MarkdownEditorProps) {
  const isInitialized = useRef(false);
  const [systemDarkMode, setSystemDarkMode] = useState(false);
  const [localIsEditorDarkMode, setLocalIsEditorDarkMode] = useState(true);
  const [observations, setObservations] = useState('Agrega aquí tus observaciones sobre este markdown...');
  const [isEditingObservations, setIsEditingObservations] = useState(false);
  
  const isEditorDarkMode = propIsEditorDarkMode !== undefined ? propIsEditorDarkMode : localIsEditorDarkMode;
  const [content, setContent] = useState(`# Bienvenido a tu Markdown

## Características principales

- **Texto enriquecido** con *cursiva* y **negrita**
- Listas ordenadas y no ordenadas
- Enlaces: [Ejemplo](https://example.com)
- Código inline: \`console.log('Hello')\`

## Bloque de código

\`\`\`javascript
function saludar(nombre) {
  return \`Hola, \${nombre}!\`;
}

console.log(saludar('Usuario'));
\`\`\`

## Lista de tareas

- [x] Crear documento
- [ ] Agregar contenido
- [ ] Revisar y publicar

## Tabla de ejemplo

| Característica | Descripción |
|----------------|-------------|
| Markdown | Sintaxis simple |
| Preview | Vista previa en tiempo real |
| Export | Múltiples formatos |

> **Tip:** Puedes cambiar entre modo edición y vista previa usando el botón en la barra superior.
`);

  // Detect system dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setSystemDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Load initial content if provided (solo una vez)
  useEffect(() => {
    if (initialContent && !isInitialized.current) {
      setContent(initialContent);
      isInitialized.current = true;
    }
  }, [initialContent]);

  // Load initial observations if provided
  useEffect(() => {
    if (initialObservations) {
      setObservations(initialObservations);
    }
  }, [initialObservations]);

  // Pass observations to parent
  useEffect(() => {
    onObservationsChange(observations);
  }, [observations, onObservationsChange]);

  useEffect(() => {
    // Extract title from first h1 in content (solo si no hay contenido inicial)
    if (!isInitialized.current) {
      const lines = content.split('\n');
      const titleLine = lines.find(line => line.startsWith('# '));
      if (titleLine) {
        const extractedTitle = titleLine.replace('# ', '').trim();
        if (extractedTitle) {
          // Limitar título a 60 caracteres
          const limitedTitle = extractedTitle.length > 60 
            ? extractedTitle.substring(0, 60) 
            : extractedTitle;
          onTitleChange(limitedTitle);
        }
      }
    }
    // Pass content to parent
    onContentChange(content);
  }, [content, onTitleChange, onContentChange]);

  // Simple light theme for CodeMirror without selection overrides
  const lightTheme = EditorView.theme({
    '&': {
      color: '#374151',
      backgroundColor: '#ffffff'
    },
    '.cm-content': {
      padding: '16px',
      caretColor: '#374151'
    },
    '.cm-focused .cm-cursor': {
      borderLeftColor: '#374151'
    },
    '.cm-gutters': {
      backgroundColor: '#f9fafb',
      color: '#9ca3af',
      border: 'none'
    },
    '.cm-activeLineGutter': {
      backgroundColor: '#f3f4f6'
    },
    '.cm-activeLine': {
      backgroundColor: '#f9fafb'
    }
  }, { dark: false });

  const theme = isEditorDarkMode ? oneDark : lightTheme;

  return (
    <div className={`h-full flex ${isEditorDarkMode ? 'bg-gray-900' : THEME_COLORS.main.background}`}>
      {/* Main Editor Area */}
      <div className="flex-1 p-4 min-h-0">
        <div className={`
          h-full rounded-lg border ${isEditorDarkMode ? 'border-gray-700 bg-gray-800' : `${THEME_COLORS.dashboard.card.border} ${THEME_COLORS.dashboard.card.background}`}
          flex
        `}>
          {showPreview ? (
            // Preview Mode
            <div className="flex-1 overflow-y-auto p-6">
              <div className={`prose ${isEditorDarkMode ? 'prose-invert' : 'prose-slate'} max-w-none ${isEditorDarkMode ? 'text-gray-100' : THEME_COLORS.dashboard.title}`}>
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            // Edit Mode - Now using CodeMirror
            <div className="flex-1">
              <CodeMirror
                value={content}
                height="70vh"
                theme={theme}
                extensions={[markdown(), EditorView.theme({
                  '&': {
                    height: '100%'
                  },
                  '.cm-scroller': {
                    overflow: 'auto',
                    maxHeight: '100%'
                  },
                  '.cm-content': {
                    minHeight: '100%',
                    padding: '16px'
                  }
                })]}
                onChange={(val) => setContent(val)}
                  basicSetup={{
                    lineNumbers: true,
                    foldGutter: false,
                    dropCursor: false,
                    allowMultipleSelections: false,
                    indentOnInput: true,
                    bracketMatching: true,
                    closeBrackets: true,
                    autocompletion: true,
                    highlightSelectionMatches: false,
                    searchKeymap: true,
                  }}
                  style={{
                    fontSize: '14px',
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", consolas, "source-code-pro", monospace',
                  }}
                  placeholder="# Mi Nuevo Markdown

Escribe tu contenido en markdown aquí...

## Características
- **Texto enriquecido** 
- `Código inline`
- [Enlaces](https://example.com)

```javascript
// Bloques de código
console.log('Hello World');
```"
                />
            </div>
          )}
        </div>
      </div>

      {/* Observations Panel */}
      <div className={`
        w-80 border-l ${isEditorDarkMode ? 'border-gray-700 bg-gray-800' : `${THEME_COLORS.dashboard.card.border} ${THEME_COLORS.dashboard.card.background}`}
        flex flex-col
      `}>
        <div className={`p-4 border-b ${isEditorDarkMode ? 'border-gray-700' : THEME_COLORS.dashboard.card.border}`}>
          <h3 className={`font-semibold ${isEditorDarkMode ? 'text-white' : THEME_COLORS.dashboard.title}`}>
            Observaciones
          </h3>
          <p className={`text-sm ${isEditorDarkMode ? 'text-gray-400' : THEME_COLORS.dashboard.metadata} mt-1`}>
            Agrega notas sobre este markdown
          </p>
        </div>
        
        <div className="flex-1 p-4 overflow-auto">
          {isEditingObservations ? (
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              onBlur={() => setIsEditingObservations(false)}
              className={`
                w-full h-full resize-none bg-transparent border-none outline-none
                ${isEditorDarkMode ? 'text-white' : THEME_COLORS.dashboard.title}
                focus:ring-2 focus:ring-blue-500/20 rounded-lg p-2 overflow-auto
              `}
              placeholder="Agrega tus observaciones aquí..."
              autoFocus
            />
          ) : (
            <div
              onClick={() => setIsEditingObservations(true)}
              className={`
                h-full cursor-text p-2 rounded-lg
                ${observations.includes('Agrega aquí') ? (isEditorDarkMode ? 'text-gray-500' : THEME_COLORS.dashboard.metadata) : (isEditorDarkMode ? 'text-gray-300' : THEME_COLORS.dashboard.subtitle)}
                ${isEditorDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-50'}
                ${THEME_COLORS.transitions.all}
              `}
            >
              {observations}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}