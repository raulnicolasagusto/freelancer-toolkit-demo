// Sistema de Internacionalización (i18n) - DevToolkit Premium
import { es } from './locales/es';
import { en } from './locales/en';
import { pt } from './locales/pt';
import { it } from './locales/it';
import { fr } from './locales/fr';
import { de } from './locales/de';
import { ru } from './locales/ru';
import { ja } from './locales/ja';
import { ar } from './locales/ar';

// Tipos
export type SupportedLocale = 'es' | 'en' | 'pt' | 'it' | 'fr' | 'de' | 'ru' | 'ja' | 'ar';
export type Translations = typeof es;

// Configuración de idiomas
export const SUPPORTED_LOCALES: Record<SupportedLocale, {
  name: string;
  nativeName: string;
  flag: string;
  isRTL: boolean;
  translations: Translations;
}> = {
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    isRTL: false,
    translations: es
  },
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    isRTL: false,
    translations: en
  },
  pt: {
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    isRTL: false,
    translations: pt
  },
  it: {
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    isRTL: false,
    translations: it
  },
  fr: {
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    isRTL: false,
    translations: fr
  },
  de: {
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    isRTL: false,
    translations: de
  },
  ru: {
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    isRTL: false,
    translations: ru
  },
  ja: {
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    isRTL: false,
    translations: ja
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    isRTL: true,
    translations: ar
  }
};

// Estado global del idioma (por ahora simple, después se puede usar context/store)
let currentLocale: SupportedLocale = 'es'; // Idioma por defecto

// === HELPER FUNCTIONS ===

/**
 * Establece el idioma actual
 */
export function setLocale(locale: SupportedLocale): void {
  if (locale in SUPPORTED_LOCALES) {
    currentLocale = locale;
    
    // Actualizar dir attribute del HTML para idiomas RTL
    if (typeof document !== 'undefined') {
      document.documentElement.dir = SUPPORTED_LOCALES[locale].isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = locale;
    }
  }
}

/**
 * Obtiene el idioma actual
 */
export function getCurrentLocale(): SupportedLocale {
  return currentLocale;
}

/**
 * Obtiene las traducciones del idioma actual
 */
export function getCurrentTranslations(): Translations {
  return SUPPORTED_LOCALES[currentLocale].translations;
}

/**
 * Función principal para obtener textos traducidos
 * Soporta navegación anidada con dot notation
 * Ejemplo: t('dashboard.header.title')
 */
export function t(key: string, replacements?: Record<string, string | number>): string {
  const translations = getCurrentTranslations();
  
  // Navegar por la estructura anidada usando dot notation
  const keys = key.split('.');
  let value: unknown = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Si la clave no existe, retornar la clave como fallback
      console.warn(`Translation key not found: ${key} for locale: ${currentLocale}`);
      return key;
    }
  }
  
  if (typeof value !== 'string') {
    console.warn(`Translation value is not a string: ${key}`);
    return key;
  }
  
  // Reemplazar variables si se proporcionan
  if (replacements) {
    return value.replace(/\{(\w+)\}/g, (match, variable) => {
      return replacements[variable]?.toString() || match;
    });
  }
  
  return value;
}

/**
 * Hook para usar traducciones (para cuando implementemos React Context)
 */
export function useTranslation() {
  return {
    t,
    locale: getCurrentLocale(),
    setLocale,
    isRTL: SUPPORTED_LOCALES[getCurrentLocale()].isRTL
  };
}

/**
 * Obtiene información del idioma actual
 */
export function getCurrentLocaleInfo() {
  return SUPPORTED_LOCALES[currentLocale];
}

/**
 * Obtiene lista de todos los idiomas soportados
 */
export function getSupportedLocales() {
  return Object.entries(SUPPORTED_LOCALES).map(([code, info]) => ({
    code: code as SupportedLocale,
    ...info
  }));
}

/**
 * Detecta el idioma del navegador del usuario
 */
export function detectBrowserLocale(): SupportedLocale {
  if (typeof navigator === 'undefined') return 'es';
  
  const browserLang = navigator.language.split('-')[0] as SupportedLocale;
  return browserLang in SUPPORTED_LOCALES ? browserLang : 'es';
}

/**
 * Inicializar i18n con detección automática o idioma guardado
 */
export function initializeI18n(): void {
  // En el futuro, aquí podríamos cargar desde localStorage o cookies
  const savedLocale = typeof localStorage !== 'undefined' 
    ? localStorage.getItem('devtoolkit-locale') as SupportedLocale
    : null;
    
  const initialLocale = savedLocale || detectBrowserLocale();
  setLocale(initialLocale);
}

/**
 * Guarda el idioma en localStorage
 */
export function saveLocalePreference(locale: SupportedLocale): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('devtoolkit-locale', locale);
  }
  setLocale(locale);
}

// Exportar por defecto para uso fácil
const i18nUtils = {
  t,
  setLocale,
  getCurrentLocale,
  getCurrentTranslations,
  useTranslation,
  getSupportedLocales,
  initializeI18n,
  saveLocalePreference
};

export default i18nUtils;