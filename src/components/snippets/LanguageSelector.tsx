'use client';

import { THEME_COLORS } from '@/lib/theme-colors';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'PHP',
  'Ruby',
  'Go',
  'Rust',
  'Swift',
  'Kotlin',
  'Dart',
  'HTML',
  'CSS',
  'SCSS',
  'JSON',
  'XML',
  'YAML',
  'SQL',
  'Bash',
  'PowerShell',
  'React',
  'Vue',
  'Angular',
  'Node.js',
  'Express',
  'Django',
  'Flask',
  'Spring',
  'Docker',
  'Kubernetes',
  'Otro'
];

interface LanguageSelectorProps {
  value: string;
  onChange: (language: string) => void;
}

export default function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [customLanguage, setCustomLanguage] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredLanguages = LANGUAGES.filter(lang =>
    lang.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (language: string) => {
    if (language === 'Otro') {
      setCustomLanguage('');
    } else {
      onChange(language);
      setIsOpen(false);
      setSearch('');
    }
  };

  const handleCustomSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customLanguage.trim()) {
      onChange(customLanguage.trim());
      setIsOpen(false);
      setCustomLanguage('');
      setSearch('');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full px-3 py-2 rounded-lg
          ${THEME_COLORS.topBar.search.input.background}
          ${THEME_COLORS.topBar.search.input.border} border
          ${THEME_COLORS.dashboard.title}
          hover:${THEME_COLORS.topBar.search.input.borderFocus}
          ${THEME_COLORS.transitions.all}
          min-w-[150px]
        `}
      >
        <span className="truncate">{value || 'Seleccionar lenguaje'}</span>
        <ChevronDown 
          size={16} 
          className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className={`
          absolute top-full left-0 right-0 mt-2 z-50
          ${THEME_COLORS.topBar.search.results.background}
          ${THEME_COLORS.topBar.search.results.border} border
          rounded-lg ${THEME_COLORS.topBar.search.results.shadow}
          max-h-64 overflow-hidden
        `}>
          {/* Search input */}
          <div className="p-2 border-b ${THEME_COLORS.dashboard.card.border}">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar lenguaje..."
              className={`
                w-full px-2 py-1 rounded text-sm
                ${THEME_COLORS.topBar.search.input.background}
                ${THEME_COLORS.topBar.search.input.border} border
                ${THEME_COLORS.dashboard.title}
                ${THEME_COLORS.topBar.search.input.placeholder}
                focus:outline-none focus:ring-2 focus:ring-blue-500/20
              `}
            />
          </div>

          {/* Language list */}
          <div className="max-h-48 overflow-y-auto">
            {filteredLanguages.map((language) => (
              <button
                key={language}
                onClick={() => handleSelect(language)}
                className={`
                  w-full px-3 py-2 text-left text-sm
                  ${THEME_COLORS.topBar.search.results.item.background}
                  ${THEME_COLORS.topBar.search.results.item.text}
                  hover:${THEME_COLORS.topBar.search.results.item.description}
                  ${value === language ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : ''}
                  ${THEME_COLORS.transitions.all}
                `}
              >
                {language}
              </button>
            ))}

            {/* Custom language input */}
            {value === 'Otro' && (
              <div className="p-2 border-t ${THEME_COLORS.dashboard.card.border}">
                <input
                  type="text"
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value)}
                  onKeyDown={handleCustomSubmit}
                  placeholder="Escribir lenguaje personalizado..."
                  className={`
                    w-full px-2 py-1 rounded text-sm
                    ${THEME_COLORS.topBar.search.input.background}
                    ${THEME_COLORS.topBar.search.input.border} border
                    ${THEME_COLORS.dashboard.title}
                    ${THEME_COLORS.topBar.search.input.placeholder}
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20
                  `}
                  autoFocus
                />
                <p className={`text-xs ${THEME_COLORS.dashboard.metadata} mt-1`}>
                  Presiona Enter para confirmar
                </p>
              </div>
            )}

            {filteredLanguages.length === 0 && (
              <div className={`px-3 py-2 text-sm ${THEME_COLORS.dashboard.metadata}`}>
                No se encontraron lenguajes
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}