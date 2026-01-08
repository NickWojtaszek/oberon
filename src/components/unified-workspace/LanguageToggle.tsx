/**
 * Language Toggle Component
 * Elegant square tile with 3-letter language code
 * Opens modal for language selection
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '../../lib/i18n/config';

const LANGUAGE_CODES: Record<LanguageCode, string> = {
  en: 'ENG',
  pl: 'POL',
  es: 'ESP',
  zh: 'CHI'
};

export function LanguageToggle() {
  const { i18n, t } = useTranslation('navigation');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const currentLanguageCode = LANGUAGE_CODES[i18n.language as LanguageCode] || 'ENG';
  
  const handleLanguageChange = (code: LanguageCode) => {
    i18n.changeLanguage(code);
    setIsModalOpen(false);
  };
  
  return (
    <>
      {/* Language Tile Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="
          w-12 h-12 
          bg-slate-800 
          border border-slate-600 
          rounded-lg 
          text-slate-200 
          font-semibold 
          text-xs 
          tracking-wider
          hover:bg-slate-700 
          hover:border-slate-500
          hover:text-white
          transition-all
          flex items-center justify-center
        "
        title={t('language.changeLanguage')}
      >
        {currentLanguageCode}
      </button>
      
      {/* Language Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-slate-800 rounded-lg border border-slate-600 shadow-2xl w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">
                {t('language.title')}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Language Options */}
            <div className="p-6 space-y-2">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isActive = i18n.language === lang.code;
                const displayCode = LANGUAGE_CODES[lang.code];
                
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`
                      w-full px-6 py-4 rounded-lg
                      flex items-center gap-4
                      transition-all
                      ${isActive 
                        ? 'bg-blue-600 text-white border-2 border-blue-400' 
                        : 'bg-slate-700 text-slate-200 border-2 border-slate-600 hover:bg-slate-650 hover:border-slate-500'
                      }
                    `}
                  >
                    {/* Language Code (3-letter) */}
                    <div className={`
                      w-16 h-16 
                      rounded-lg 
                      flex items-center justify-center
                      font-bold text-sm tracking-wider
                      ${isActive 
                        ? 'bg-blue-700 text-blue-100' 
                        : 'bg-slate-600 text-slate-300'
                      }
                    `}>
                      {displayCode}
                    </div>
                    
                    {/* Language Name */}
                    <div className="flex-1 text-left">
                      <div className={`
                        text-lg font-semibold
                        ${isActive ? 'text-white' : 'text-slate-100'}
                      `}>
                        {lang.name}
                      </div>
                      <div className={`
                        text-sm
                        ${isActive ? 'text-blue-100' : 'text-slate-400'}
                      `}>
                        {lang.code.toUpperCase()}
                      </div>
                    </div>
                    
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="w-3 h-3 bg-blue-300 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-700 bg-slate-750">
              <p className="text-xs text-slate-400 text-center">
                {t('language.autoSave')}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}