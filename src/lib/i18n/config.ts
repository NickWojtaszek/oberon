// i18n Configuration for Clinical Intelligence Engine
// Multi-language support for AI Persona System

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslations from './locales/en';
import plTranslations from './locales/pl';
import esTranslations from './locales/es';
import zhTranslations from './locales/zh';

// Import persona translations
import enPersonas from './locales/en/personas';
import plPersonas from './locales/pl/personas';
import esPersonas from './locales/es/personas';
import zhPersonas from './locales/zh/personas';

// Language resources
const resources = {
  en: {
    ...enTranslations,
    personas: enPersonas
  },
  pl: {
    ...plTranslations,
    personas: plPersonas
  },
  es: {
    ...esTranslations,
    personas: esPersonas
  },
  zh: {
    ...zhTranslations,
    personas: zhPersonas
  }
};

// Get saved language from localStorage or detect browser language
const getSavedLanguage = (): string => {
  if (typeof window === 'undefined') return 'en';
  
  const saved = localStorage.getItem('clinical-engine-language');
  if (saved && ['en', 'pl', 'es', 'zh'].includes(saved)) {
    return saved;
  }
  
  // Detect browser language
  const browserLang = navigator.language.split('-')[0];
  if (['en', 'pl', 'es', 'zh'].includes(browserLang)) {
    return browserLang;
  }
  
  return 'en'; // Default to English
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getSavedLanguage(),
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'navigation', 'protocol', 'protocolLibrary', 'projectSetup', 'researchWizard', 'dataManagement', 'methodologyEngine', 'dashboard', 'workflows', 'academic', 'database', 'analytics', 'governance', 'ethics', 'validation', 'personas', 'ui'],
    
    interpolation: {
      escapeValue: false // React already escapes
    },
    
    react: {
      useSuspense: false
    }
  });

// Save language preference when it changes
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('clinical-engine-language', lng);
  }
});

export default i18n;

// Supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
] as const;

export type LanguageCode = 'en' | 'pl' | 'es' | 'zh';