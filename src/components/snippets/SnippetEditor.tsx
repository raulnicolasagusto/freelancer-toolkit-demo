'use client';

import { useState, useEffect } from 'react';
import { THEME_COLORS } from '@/lib/theme-colors';
import { Plus, X, Code } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import CodeMirrorEditor from './CodeMirrorEditor';

interface Tab {
  id: string;
  title: string;
  language: string;
  code: string;
}

interface SnippetEditorProps {
  onTitleChange: (title: string) => void;
}

export default function SnippetEditor({ onTitleChange }: SnippetEditorProps) {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: '1',
      title: 'example.js',
      language: 'JavaScript',
      code: `// Ejemplo de función JavaScript
function saludar(nombre) {
  return \`Hola, \${nombre}! Bienvenido a DevToolkit.\`;
}

// Uso de la función
const usuario = 'Developer';
console.log(saludar(usuario));

// Función asíncrona de ejemplo
async function obtenerDatos() {
  try {
    const response = await fetch('/api/datos');
    const datos = await response.json();
    return datos;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export { saludar, obtenerDatos };`
    }
  ]);
  
  const [activeTab, setActiveTab] = useState('1');
  const [observations, setObservations] = useState('Agrega aquí tus observaciones sobre este conjunto de snippets...');
  const [isEditingObservations, setIsEditingObservations] = useState(false);

  const currentTab = tabs.find(tab => tab.id === activeTab);

  useEffect(() => {
    // Update title based on first tab or observations
    if (tabs.length > 0) {
      onTitleChange(`Snippet Collection - ${tabs.length} archivo${tabs.length !== 1 ? 's' : ''}`);
    }
  }, [tabs.length, onTitleChange]);

  const addTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: `untitled.txt`,
      language: 'JavaScript',
      code: '// Nuevo snippet\n'
    };
    
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  const removeTab = (tabId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (tabs.length === 1) return; // No eliminar el último tab
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    if (activeTab === tabId && newTabs.length > 0) {
      setActiveTab(newTabs[0].id);
    }
  };

  const updateTab = (tabId: string, updates: Partial<Tab>) => {
    setTabs(tabs.map(tab => 
      tab.id === tabId ? { ...tab, ...updates } : tab
    ));
  };

  const handleTitleEdit = (tabId: string, newTitle: string) => {
    updateTab(tabId, { title: newTitle });
  };

  const handleLanguageChange = (language: string) => {
    if (currentTab) {
      updateTab(currentTab.id, { language });
      
      // Auto-update file extension based on language
      const extensions: { [key: string]: string } = {
        'JavaScript': '.js',
        'TypeScript': '.ts',
        'Python': '.py',
        'Java': '.java',
        'C++': '.cpp',
        'C#': '.cs',
        'PHP': '.php',
        'Ruby': '.rb',
        'Go': '.go',
        'Rust': '.rs',
        'Swift': '.swift',
        'Kotlin': '.kt',
        'HTML': '.html',
        'CSS': '.css',
        'JSON': '.json',
        'SQL': '.sql',
        'Bash': '.sh'
      };
      
      const extension = extensions[language] || '.txt';
      const baseName = currentTab.title.split('.')[0];
      updateTab(currentTab.id, { title: `${baseName}${extension}` });
    }
  };

  const handleCodeChange = (code: string) => {
    if (currentTab) {
      updateTab(currentTab.id, { code });
    }
  };

  if (!currentTab) return null;

  return (
    <div className={`h-full flex ${THEME_COLORS.main.background} ${THEME_COLORS.main.backgroundDark}`}>
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className={`
          ${THEME_COLORS.dashboard.card.background} 
          border-b ${THEME_COLORS.dashboard.card.border}
          flex items-center
        `}>
          <div className="flex-1 flex items-center overflow-x-auto">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-4 py-3 cursor-pointer
                  border-b-2 ${THEME_COLORS.transitions.all}
                  ${activeTab === tab.id 
                    ? 'border-blue-500 bg-blue-500/5' 
                    : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }
                `}
              >
                <Code size={16} className={activeTab === tab.id ? 'text-blue-500' : THEME_COLORS.dashboard.metadata} />
                
                <input
                  type="text"
                  value={tab.title}
                  onChange={(e) => handleTitleEdit(tab.id, e.target.value)}
                  className={`
                    bg-transparent border-none outline-none text-sm font-medium
                    ${activeTab === tab.id ? THEME_COLORS.dashboard.title : THEME_COLORS.dashboard.subtitle}
                    min-w-[80px] max-w-[150px]
                  `}
                  onFocus={(e) => e.target.select()}
                />
                
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => removeTab(tab.id, e)}
                    className={`
                      p-1 rounded hover:bg-red-500/10 hover:text-red-500
                      ${THEME_COLORS.transitions.all}
                    `}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addTab}
            className={`
              flex items-center space-x-1 px-3 py-2 m-2 rounded-lg
              ${THEME_COLORS.topBar.actions.button.background}
              ${THEME_COLORS.topBar.actions.button.text} ${THEME_COLORS.topBar.actions.button.textHover}
              ${THEME_COLORS.transitions.all}
            `}
          >
            <Plus size={16} />
            <span className="text-sm">Tab</span>
          </button>
        </div>

        {/* Editor Header */}
        <div className={`
          ${THEME_COLORS.dashboard.card.background}
          border-b ${THEME_COLORS.dashboard.card.border}
          p-4 flex items-center justify-between
        `}>
          <div className="flex items-center space-x-4">
            <span className={`text-sm font-medium ${THEME_COLORS.dashboard.subtitle}`}>
              Lenguaje:
            </span>
            <LanguageSelector
              value={currentTab.language}
              onChange={handleLanguageChange}
            />
          </div>
          
          <div className={`text-sm ${THEME_COLORS.dashboard.metadata}`}>
            Líneas: {currentTab.code.split('\n').length}
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1">
          <CodeMirrorEditor
            value={currentTab.code}
            language={currentTab.language}
            onChange={handleCodeChange}
          />
        </div>
      </div>

      {/* Observations Panel */}
      <div className={`
        w-80 border-l ${THEME_COLORS.dashboard.card.border}
        ${THEME_COLORS.dashboard.card.background}
        flex flex-col
      `}>
        <div className="p-4 border-b ${THEME_COLORS.dashboard.card.border}">
          <h3 className={`font-semibold ${THEME_COLORS.dashboard.title}`}>
            Observaciones
          </h3>
          <p className={`text-sm ${THEME_COLORS.dashboard.metadata} mt-1`}>
            Agrega notas sobre este conjunto de snippets
          </p>
        </div>
        
        <div className="flex-1 p-4">
          {isEditingObservations ? (
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              onBlur={() => setIsEditingObservations(false)}
              className={`
                w-full h-full resize-none bg-transparent border-none outline-none
                ${THEME_COLORS.dashboard.title}
                focus:ring-2 focus:ring-blue-500/20 rounded-lg p-2
              `}
              placeholder="Agrega tus observaciones aquí..."
              autoFocus
            />
          ) : (
            <div
              onClick={() => setIsEditingObservations(true)}
              className={`
                h-full cursor-text p-2 rounded-lg
                ${observations.includes('Agrega aquí') ? THEME_COLORS.dashboard.metadata : THEME_COLORS.dashboard.subtitle}
                hover:bg-slate-50 dark:hover:bg-slate-700/30
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