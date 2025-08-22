'use client';

import { useState, useEffect, useRef } from 'react';
import { THEME_COLORS } from '@/lib/theme-colors';
import { Eye, Edit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownEditorProps {
  showPreview: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  initialContent?: string;
}

export default function MarkdownEditor({ showPreview, onTitleChange, onContentChange, initialContent }: MarkdownEditorProps) {
  const isInitialized = useRef(false);
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

  // Load initial content if provided (solo una vez)
  useEffect(() => {
    if (initialContent && !isInitialized.current) {
      setContent(initialContent);
      isInitialized.current = true;
    }
  }, [initialContent]);

  useEffect(() => {
    // Extract title from first h1 in content (solo si no hay contenido inicial)
    if (!isInitialized.current) {
      const lines = content.split('\n');
      const titleLine = lines.find(line => line.startsWith('# '));
      if (titleLine) {
        const extractedTitle = titleLine.replace('# ', '').trim();
        if (extractedTitle) {
          onTitleChange(extractedTitle);
        }
      }
    }
    // Pass content to parent
    onContentChange(content);
  }, [content, onTitleChange, onContentChange]);

  return (
    <div className={`h-full ${THEME_COLORS.main.background} ${THEME_COLORS.main.backgroundDark}`}>
      <div className="h-full p-4">
        <div className={`
          h-full rounded-lg border ${THEME_COLORS.dashboard.card.border}
          ${THEME_COLORS.dashboard.card.background}
          overflow-hidden flex
        `}>
          {showPreview ? (
            // Preview Mode
            <div className="flex-1 overflow-y-auto p-6">
              <div className={`prose prose-slate dark:prose-invert max-w-none ${THEME_COLORS.dashboard.title}`}>
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            // Edit Mode
            <div className="flex-1 flex flex-col">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`
                  flex-1 resize-none p-6 bg-transparent border-none outline-none
                  ${THEME_COLORS.dashboard.title}
                  font-mono text-sm leading-relaxed
                  focus:ring-0 focus:outline-none
                `}
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
                style={{
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", consolas, "source-code-pro", monospace',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}