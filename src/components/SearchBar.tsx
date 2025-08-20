'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { THEME_COLORS } from '@/lib/theme-colors';
import { t } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'page' | 'snippet' | 'note' | 'resource';
  href: string;
}

// Datos de búsqueda simulados (en el futuro conectar con API real)
const SEARCH_DATA: SearchResult[] = [
  // Páginas
  { id: 'dashboard', title: 'Dashboard', description: 'Página principal', type: 'page', href: '/' },
  { id: 'snippets', title: 'Mis Snippets', description: 'Códigos guardados', type: 'page', href: '/snippets' },
  { id: 'notes', title: 'Mis Notas', description: 'Notas y apuntes', type: 'page', href: '/notes' },
  { id: 'productivity', title: 'Productividad', description: 'Herramientas de productividad', type: 'page', href: '/productivity' },
  { id: 'resources', title: 'Recursos', description: 'Recursos útiles', type: 'page', href: '/resources' },
  
  // Snippets simulados
  { id: 'react-component', title: 'React Detail Component', description: 'Componente de React', type: 'snippet', href: '/snippets' },
  { id: 'express-route', title: 'Express Route Handler', description: 'Manejador de rutas', type: 'snippet', href: '/snippets' },
  { id: 'python-data', title: 'Python Data Processing', description: 'Procesamiento de datos', type: 'snippet', href: '/snippets' },
  { id: 'css-flexbox', title: 'CSS Flexbox Layout', description: 'Layout con Flexbox', type: 'snippet', href: '/snippets' },
  { id: 'typescript-interface', title: 'TypeScript Interface', description: 'Interfaz de TypeScript', type: 'snippet', href: '/snippets' },
];

const getResultIcon = (type: SearchResult['type']) => {
  const icons = {
    page: '📄',
    snippet: '💻',
    note: '📝',
    resource: '🔗'
  };
  return icons[type] || '📄';
};

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Función de búsqueda dinámica
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    
    // Simular delay de búsqueda realista
    setTimeout(() => {
      const filteredResults = SEARCH_DATA.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6); // Limitar a 6 resultados

      setResults(filteredResults);
      setShowResults(true);
      setIsSearching(false);
    }, 150); // 150ms delay para simular búsqueda real
  };

  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Cerrar resultados al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = () => {
    setQuery('');
    setShowResults(false);
    // La navegación se manejará con el Link del resultado
  };

  return (
    <div ref={searchRef} className={`${THEME_COLORS.topBar.search.container} w-80`}>
      {/* Input de búsqueda */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <Loader2 className={`h-4 w-4 ${THEME_COLORS.topBar.search.icon} animate-spin`} />
          ) : (
            <Search className={`h-4 w-4 ${THEME_COLORS.topBar.search.icon}`} />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('topBar.search.placeholder')}
          className={`
            w-full pl-10 pr-4 py-2 rounded-lg border
            ${THEME_COLORS.topBar.search.input.background}
            ${THEME_COLORS.topBar.search.input.border}
            ${THEME_COLORS.topBar.search.input.borderFocus}
            ${THEME_COLORS.topBar.search.input.text}
            ${THEME_COLORS.topBar.search.input.placeholder}
            ${THEME_COLORS.transitions.all}
            focus:outline-none focus:ring-2
          `}
        />
      </div>

      {/* Resultados de búsqueda */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute top-full left-0 right-0 mt-2 rounded-lg border
              ${THEME_COLORS.topBar.search.results.background}
              ${THEME_COLORS.topBar.search.results.border}
              ${THEME_COLORS.topBar.search.results.shadow}
              z-50 max-h-80 overflow-y-auto
            `}
          >
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((result, index) => (
                  <motion.a
                    key={result.id}
                    href={result.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    onClick={handleResultClick}
                    className={`
                      flex items-center px-4 py-3 cursor-pointer
                      ${THEME_COLORS.topBar.search.results.item.background}
                      ${THEME_COLORS.transitions.all}
                    `}
                  >
                    <span className="text-lg mr-3" role="img" aria-label={result.type}>
                      {getResultIcon(result.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium ${THEME_COLORS.topBar.search.results.item.text}`}>
                        {result.title}
                      </div>
                      {result.description && (
                        <div className={`text-sm ${THEME_COLORS.topBar.search.results.item.description} truncate`}>
                          {result.description}
                        </div>
                      )}
                    </div>
                  </motion.a>
                ))}
              </div>
            ) : query.trim() && !isSearching ? (
              <div className="px-4 py-6 text-center">
                <div className={`${THEME_COLORS.topBar.search.results.item.description}`}>
                  {t('topBar.search.noResults')}
                </div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}