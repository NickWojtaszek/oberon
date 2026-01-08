import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '../../../lib/i18n/config';

interface LanguageSelectorProps {
  variant?: 'full' | 'compact';
}

export function LanguageSelector({ variant = 'full' }: LanguageSelectorProps) {
  const { i18n } = useTranslation();
  
  const handleLanguageChange = (languageCode: LanguageCode) => {
    i18n.changeLanguage(languageCode);
  };

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  if (variant === 'compact') {
    return (
      <div className="relative inline-block">
        <select
          value={i18n.language}
          onChange={(e) => handleLanguageChange(e.target.value as LanguageCode)}
          className="appearance-none bg-white border border-slate-300 rounded-lg pl-3 pr-8 py-2 text-sm cursor-pointer hover:border-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-3">
        <Globe className="w-4 h-4 text-slate-600" />
        <span className="text-xs font-semibold text-slate-900">Interface Language</span>
      </div>
      
      <div className="space-y-2">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`w-full px-3 py-2 rounded-lg text-left text-sm flex items-center gap-2 transition-colors ${
              i18n.language === lang.code
                ? 'bg-blue-100 text-blue-900 font-semibold'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.name}</span>
            {i18n.language === lang.code && (
              <span className="ml-auto text-blue-600">✓</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-200">
        <div className="text-xs text-slate-600 leading-relaxed">
          <div className="mb-1.5">
            <span className="font-semibold">Current: </span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-semibold">
              {currentLanguage.flag} {currentLanguage.name}
            </span>
          </div>
          <div className="text-xs text-slate-500">
            Language preference is saved automatically. Regulatory citations remain in English for legal validity.
          </div>
        </div>
      </div>
    </div>
  );
}
