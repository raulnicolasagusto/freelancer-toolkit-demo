'use client';

import { t } from '@/lib/i18n';
import { THEME_COLORS } from '@/lib/theme-colors';
import { Plus, Trash2, Edit3, Folder as FolderIcon, Home, FolderPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import CreateModal from '@/components/snippets/CreateModal';
import FolderCreateModal from '@/components/FolderCreateModal';
import { getSnippets, getFolders, type Snippet, type Folder } from '@/lib/snippets';
import { useAuth, useUser } from '@clerk/nextjs';

// Datos de ejemplo para los snippets
const EXAMPLE_SNIPPETS = [
  {
    id: 1,
    title: "React Detail Component",
    language: "React",
    code: `import { Detail } from "@raycast/api";\n\nexport default function Command() {\n  return <Detail markdown="Hello World" />;\n}`,
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    title: "Express Route Handler",
    language: "JavaScript",
    code: `app.get('/api/users', async (req, res) => {\n  try {\n    const users = await User.findAll();\n    res.json(users);\n  } catch (error) {\n    res.status(500).json({ error });\n  }\n});`,
    createdAt: "2024-01-14"
  },
  {
    id: 3,
    title: "Python Data Processing",
    language: "Python",
    code: `import pandas as pd\nimport numpy as np\n\ndef process_data(df):\n    df_clean = df.dropna()\n    return df_clean.groupby('category').sum()`,
    createdAt: "2024-01-13"
  },
  {
    id: 4,
    title: "CSS Flexbox Layout",
    language: "CSS",
    code: `.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  gap: 1rem;\n}`,
    createdAt: "2024-01-12"
  },
  {
    id: 5,
    title: "TypeScript Interface",
    language: "TypeScript",
    code: `interface User {\n  id: number;\n  name: string;\n  email: string;\n  isActive: boolean;\n  roles: string[];\n}`,
    createdAt: "2024-01-11"
  },
  {
    id: 6,
    title: "SQL Query Builder",
    language: "SQL",
    code: `SELECT u.name, u.email, p.title\nFROM users u\nINNER JOIN posts p ON u.id = p.user_id\nWHERE u.is_active = true\nORDER BY p.created_at DESC;`,
    createdAt: "2024-01-10"
  },
  {
    id: 7,
    title: "Vue Component",
    language: "Vue",
    code: `<template>\n  <div class="card">\n    <h2>{{ title }}</h2>\n    <p>{{ description }}</p>\n  </div>\n</template>\n\n<script setup>\ndefineProps(['title', 'description']);\n</script>`,
    createdAt: "2024-01-09"
  },
  {
    id: 8,
    title: "Docker Compose",
    language: "YAML",
    code: `version: '3.8'\nservices:\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      - NODE_ENV=production`,
    createdAt: "2024-01-08"
  },
  {
    id: 9,
    title: "Go HTTP Server",
    language: "Go",
    code: `package main\n\nimport (\n    "fmt"\n    "net/http"\n)\n\nfunc handler(w http.ResponseWriter, r *http.Request) {\n    fmt.Fprintf(w, "Hello, World!")\n}\n\nfunc main() {\n    http.HandleFunc("/", handler)\n    http.ListenAndServe(":8080", nil)\n}`,
    createdAt: "2024-01-07"
  }
];

// Helper para obtener colores de lenguajes
const getLanguageColor = (language: string) => {
  const lang = language.toLowerCase();
  switch (lang) {
    case 'react': return THEME_COLORS.snippets.languages.react;
    case 'javascript': return THEME_COLORS.snippets.languages.javascript;
    case 'python': return THEME_COLORS.snippets.languages.python;
    case 'css': return THEME_COLORS.snippets.languages.css;
    case 'typescript': return THEME_COLORS.snippets.languages.typescript;
    case 'sql': return THEME_COLORS.snippets.languages.sql;
    case 'vue': return THEME_COLORS.snippets.languages.vue;
    case 'yaml': return THEME_COLORS.snippets.languages.yaml;
    case 'go': return THEME_COLORS.snippets.languages.go;
    default: return THEME_COLORS.snippets.languages.default;
  }
};

interface SnippetCardProps {
  snippet: {
    id: string;
    title: string;
    language: string;
    code: string;
    createdAt: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function SnippetCard({ snippet, onEdit, onDelete }: SnippetCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Obtener las primeras 4 líneas del código
  const previewLines = snippet.code.split('\n').slice(0, 4);
  const hasMoreLines = snippet.code.split('\n').length > 4;

  return (
    <div
      className={`
        relative group
        ${THEME_COLORS.dashboard.card.background}
        ${THEME_COLORS.dashboard.card.border}
        border rounded-xl overflow-hidden
        ${THEME_COLORS.transitions.all}
        hover:scale-105 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/30
        cursor-pointer
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdit(snippet.id)}
    >
      {/* Terminal header */}
      <div className={`${THEME_COLORS.snippets.terminal.background} p-3 flex items-center justify-between`}>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className={`w-3 h-3 ${THEME_COLORS.snippets.terminal.dots.red} rounded-full`}></div>
            <div className={`w-3 h-3 ${THEME_COLORS.snippets.terminal.dots.yellow} rounded-full`}></div>
            <div className={`w-3 h-3 ${THEME_COLORS.snippets.terminal.dots.green} rounded-full`}></div>
          </div>
          <span className={`${THEME_COLORS.snippets.terminal.titleText} text-sm font-mono`}>{snippet.title}</span>
        </div>
        <span className={`text-sm font-medium ${getLanguageColor(snippet.language)}`}>
          {snippet.language}
        </span>
      </div>

      {/* Code preview */}
      <div className={`${THEME_COLORS.snippets.code.background} p-4 min-h-[140px] relative overflow-hidden`}>
        <pre className={`text-sm ${THEME_COLORS.snippets.code.text} font-mono leading-relaxed`}>
          {previewLines.map((line, index) => (
            <div key={index} className="flex">
              <span className={`${THEME_COLORS.snippets.code.lineNumbers} mr-3 select-none`}>{index + 1}</span>
              <span className="flex-1">{line || ' '}</span>
            </div>
          ))}
          {hasMoreLines && (
            <div className="flex">
              <span className={`${THEME_COLORS.snippets.code.lineNumbers} mr-3 select-none`}>...</span>
              <span className={`${THEME_COLORS.snippets.code.moreLine} italic`}>más código</span>
            </div>
          )}
        </pre>

        {/* Gradient overlay */}
        <div className={`absolute bottom-0 left-0 right-0 h-8 ${THEME_COLORS.snippets.code.gradient} pointer-events-none`}></div>
      </div>

      {/* Action buttons - aparecen en hover */}
      <div
        className={`
          absolute bottom-3 left-3 flex space-x-2
          ${THEME_COLORS.transitions.all}
          ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(snippet.id);
          }}
          className={`
            p-2 rounded-lg ${THEME_COLORS.snippets.actions.edit.background} border ${THEME_COLORS.snippets.actions.edit.border}
            ${THEME_COLORS.snippets.actions.edit.text} ${THEME_COLORS.snippets.actions.edit.textHover} ${THEME_COLORS.snippets.actions.edit.backgroundHover}
            ${THEME_COLORS.transitions.all}
          `}
          title={t('snippets.actions.edit')}
        >
          <Edit3 size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(snippet.id);
          }}
          className={`
            p-2 rounded-lg ${THEME_COLORS.snippets.actions.delete.background} border ${THEME_COLORS.snippets.actions.delete.border}
            ${THEME_COLORS.snippets.actions.delete.text} ${THEME_COLORS.snippets.actions.delete.textHover} ${THEME_COLORS.snippets.actions.delete.backgroundHover}
            ${THEME_COLORS.transitions.all}
          `}
          title={t('snippets.actions.delete')}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default function SnippetsPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const currentFolderId = searchParams.get('folder');
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFolderCreateModal, setShowFolderCreateModal] = useState(false);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSnippets();
    if (currentFolderId) {
      loadCurrentFolder();
    }
  }, [currentFolderId, userId]);

  const loadSnippets = async () => {
    if (!userId) {
      setSnippets([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress || '';
      const snippetsData = await getSnippets(currentFolderId, userId, userEmail);
      setSnippets(snippetsData);
    } catch (error) {
      console.error('Error loading snippets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentFolder = async () => {
    if (!currentFolderId || !userId) {
      setCurrentFolder(null);
      return;
    }
    
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress || '';
      const folders = await getFolders('snippets', userId, userEmail);
      const folder = folders.find(f => f.id === currentFolderId);
      setCurrentFolder(folder || null);
    } catch (error) {
      console.error('Error loading folder:', error);
    }
  };

  const handleEdit = (id: string) => {
    // Navegar a la página de crear/editar con el ID del snippet
    window.location.href = `/snippets/create?edit=${id}`;
  };

  const handleDelete = (id: string) => {
    console.log('Delete snippet:', id);
    // TODO: Implementar funcionalidad de eliminar
  };

  const handleAddSnippet = () => {
    setShowCreateModal(true);
  };

  return (
    <div className="space-y-8">
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
                  <h1 className={`text-3xl font-bold ${THEME_COLORS.dashboard.title}`}>
                    {currentFolder.name}
                  </h1>
                  <p className={`text-sm ${THEME_COLORS.dashboard.subtitle}`}>
                    Carpeta de {t('snippets.pageTitle')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Home size={24} className={THEME_COLORS.icons.snippets} />
                <h1 className={`text-3xl font-bold ${THEME_COLORS.dashboard.title}`}>
                  {t('snippets.pageTitle')}
                </h1>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleAddSnippet}
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
              <span>{t('snippets.addButton')}</span>
            </button>

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

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`
                ${THEME_COLORS.dashboard.card.background} 
                ${THEME_COLORS.dashboard.card.border}
                border rounded-xl h-48 animate-pulse
              `}>
                <div className="p-3 bg-slate-700 flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                    <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                    <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                  </div>
                  <div className="h-3 bg-slate-600 rounded flex-1"></div>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-600 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-600 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-600 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && snippets.length === 0 && (
          <div className="text-center py-12">
            <div className={`${THEME_COLORS.icons.iconBackgrounds.blue} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
              {currentFolder ? (
                <FolderIcon size={32} style={{ color: currentFolder.color }} />
              ) : (
                <Home size={32} className={THEME_COLORS.icons.snippets} />
              )}
            </div>
            <h3 className={`text-lg font-semibold ${THEME_COLORS.dashboard.title} mb-2`}>
              {currentFolder ? `No hay snippets en ${currentFolder.name}` : 'No hay snippets'}
            </h3>
            <p className={`${THEME_COLORS.dashboard.subtitle} mb-4`}>
              Crea tu primer {currentFolder ? 'snippet en esta carpeta' : 'snippet'} para comenzar.
            </p>
            <button
              onClick={handleAddSnippet}
              className={`
                inline-flex items-center space-x-2 px-4 py-2
                ${THEME_COLORS.sidebar.nav.item.active.background}
                ${THEME_COLORS.sidebar.nav.item.active.text}
                border ${THEME_COLORS.sidebar.nav.item.active.border}
                rounded-lg font-medium
                hover:${THEME_COLORS.sidebar.nav.item.active.textHover}
                ${THEME_COLORS.transitions.all}
              `}
            >
              <Plus size={18} />
              <span>Crear Snippet</span>
            </button>
          </div>
        )}

        {/* Snippets Grid */}
        {!loading && snippets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {snippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={{
                  id: snippet.id,
                  title: snippet.title,
                  language: snippet.language,
                  code: snippet.code,
                  createdAt: new Date(snippet.created_at).toLocaleDateString()
                }}
                onEdit={() => handleEdit(snippet.id)}
                onDelete={() => handleDelete(snippet.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <CreateModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        currentFolderId={currentFolderId}
      />

      {/* Folder Create Modal */}
      <FolderCreateModal 
        isOpen={showFolderCreateModal} 
        onClose={() => setShowFolderCreateModal(false)}
        type="snippets"
        parentFolderId={currentFolderId}
        parentFolderName={currentFolder?.name}
        onFolderCreated={() => {
          setShowFolderCreateModal(false);
          // Refrescar después de un pequeño delay para que se vea el toast
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }}
      />
    </div>
  );
}