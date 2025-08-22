'use client';

import { useEffect, useState } from 'react';
import { THEME_COLORS } from '@/lib/theme-colors';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { sql } from '@codemirror/lang-sql';
import { xml } from '@codemirror/lang-xml';
import { php } from '@codemirror/lang-php';
import { rust } from '@codemirror/lang-rust';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { oneDark } from '@codemirror/theme-one-dark';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

interface CodeMirrorEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  isDarkMode?: boolean;
}

export default function CodeMirrorEditor({ value, language, onChange, isDarkMode: propIsDarkMode }: CodeMirrorEditorProps) {
  const [systemDarkMode, setSystemDarkMode] = useState(false);

  useEffect(() => {
    // Detect system dark mode if no prop is provided
    if (propIsDarkMode === undefined) {
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
    }
  }, [propIsDarkMode]);

  const getLanguageExtension = (lang: string): Extension[] => {
    const langLower = lang.toLowerCase();
    
    switch (langLower) {
      case 'javascript':
      case 'js':
      case 'node.js':
        return [javascript({ jsx: false })];
      case 'typescript':
      case 'ts':
        return [javascript({ jsx: false, typescript: true })];
      case 'react':
      case 'jsx':
        return [javascript({ jsx: true })];
      case 'python':
      case 'py':
        return [python()];
      case 'html':
        return [html()];
      case 'css':
      case 'scss':
        return [css()];
      case 'json':
        return [json()];
      case 'sql':
        return [sql()];
      case 'xml':
      case 'yaml':
        return [xml()];
      case 'php':
        return [php()];
      case 'rust':
        return [rust()];
      case 'c++':
      case 'cpp':
        return [cpp()];
      case 'java':
        return [java()];
      default:
        return [];
    }
  };

  // Simple light theme without complex selection overrides
  const lightTheme = EditorView.theme({
    '&': {
      color: '#374151',
      backgroundColor: '#ffffff'
    },
    '.cm-content': {
      padding: '10px 0',
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

  const extensions = getLanguageExtension(language);
  const isDarkModeActive = propIsDarkMode !== undefined ? propIsDarkMode : systemDarkMode;
  const theme = isDarkModeActive ? oneDark : lightTheme;

  return (
    <div className="h-full overflow-hidden">
      <CodeMirror
        value={value}
        height="100%"
        theme={theme}
        extensions={extensions}
        onChange={(val) => onChange(val)}
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
      />
    </div>
  );
}