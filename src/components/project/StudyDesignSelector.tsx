import { FlaskConical, CheckCircle2 } from 'lucide-react';
import type { StudyDesignType } from '../../types/studyDesigns';
import { getStudyDesignOptions } from '../../utils/studyDesignDefaults';

interface StudyDesignSelectorProps {
  value: StudyDesignType | null;
  onChange: (type: StudyDesignType) => void;
}

export function StudyDesignSelector({ value, onChange }: StudyDesignSelectorProps) {
  const options = getStudyDesignOptions();

  return (
    <div>
      {/* Label */}
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
        <FlaskConical className="w-4 h-4" />
        Study Design
        <span className="text-red-500">*</span>
      </label>

      {/* Grid of Study Design Cards */}
      <div className="grid grid-cols-1 gap-2">
        {options.map((option) => {
          const isSelected = value === option.value;
          
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`w-full p-3 rounded-lg border-2 text-left transition-all hover:border-blue-400 hover:shadow-sm ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 shadow-sm'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl flex-shrink-0">{option.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold mb-0.5 ${
                    isSelected ? 'text-blue-900' : 'text-slate-900'
                  }`}>
                    {option.label}
                  </div>
                  <div className={`text-xs leading-snug ${
                    isSelected ? 'text-blue-700' : 'text-slate-600'
                  }`}>
                    {option.description}
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Helper Text */}
      <p className="mt-2 text-xs text-slate-600">
        Your study design determines the protocol structure and statistical approach
      </p>
    </div>
  );
}