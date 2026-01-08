import { X, Sparkles, FileJson, Loader } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SchemaBlock } from '../../types';
import { variableLibrary } from '../../constants';

interface SchemaGeneratorModalProps {
  onClose: () => void;
  onGenerate: (blocks: SchemaBlock[]) => void;
}

export function SchemaGeneratorModal({ onClose, onGenerate }: SchemaGeneratorModalProps) {
  const { t } = useTranslation('ui');
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const templates = [
    {
      id: 'oncology-trial',
      name: 'Oncology Clinical Trial',
      description: 'Standard schema for oncology trials with survival endpoints',
      variables: ['age', 'sex', 'patient_id', 'treatment_arm', 'os', 'pfs', 'mortality_30d'],
    },
    {
      id: 'cardiovascular-study',
      name: 'Cardiovascular Study',
      description: 'Schema for cardiovascular device studies',
      variables: ['age', 'sex', 'patient_id', 'hypertension', 'cad', 'dissection_type'],
    },
    {
      id: 'lab-monitoring',
      name: 'Laboratory Monitoring',
      description: 'Basic lab values monitoring schema',
      variables: ['patient_id', 'age', 'sex', 'hemoglobin', 'egfr', 'creatinine'],
    },
    {
      id: 'safety-assessment',
      name: 'Safety Assessment',
      description: 'Comprehensive safety evaluation schema',
      variables: ['patient_id', 'age', 'sex', 'comorbidities', 'mortality_30d'],
    },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      if (selectedTemplate) {
        const template = templates.find((t) => t.id === selectedTemplate);
        if (template) {
          const generatedBlocks: SchemaBlock[] = template.variables.map((varId) => {
            const variable = variableLibrary.find((v) => v.id === varId);
            if (!variable) return null;

            return {
              id: `block-${Date.now()}-${Math.random()}`,
              variable,
              dataType: variable.defaultType as any,
              role: 'Structure',
              isPrimary: false,
              isMapped: false,
              unit: variable.defaultUnit,
              children: variable.defaultType === 'Section' ? [] : undefined,
              isExpanded: true,
              versionTag: 'v1.0',
              versionColor: 'blue' as const,
              dependencies: [],
              isCustom: false,
            };
          }).filter(Boolean) as SchemaBlock[];

          onGenerate(generatedBlocks);
        }
      } else if (description) {
        // Generate based on description (simplified - in real app, this would call an AI API)
        const keywords = description.toLowerCase();
        const relevantVars: string[] = [];

        // Simple keyword matching
        if (keywords.includes('age')) relevantVars.push('age');
        if (keywords.includes('sex') || keywords.includes('gender')) relevantVars.push('sex');
        if (keywords.includes('patient') || keywords.includes('id')) relevantVars.push('patient_id');
        if (keywords.includes('survival') || keywords.includes('os')) relevantVars.push('os');
        if (keywords.includes('treatment') || keywords.includes('arm')) relevantVars.push('treatment_arm');
        if (keywords.includes('lab') || keywords.includes('hemoglobin')) relevantVars.push('hemoglobin');
        if (keywords.includes('lab') || keywords.includes('egfr')) relevantVars.push('egfr');

        // If no keywords matched, add basic demographics
        if (relevantVars.length === 0) {
          relevantVars.push('patient_id', 'age', 'sex');
        }

        const generatedBlocks: SchemaBlock[] = relevantVars.map((varId) => {
          const variable = variableLibrary.find((v) => v.id === varId);
          if (!variable) return null;

          return {
            id: `block-${Date.now()}-${Math.random()}`,
            variable,
            dataType: variable.defaultType as any,
            role: 'Structure',
            isPrimary: false,
            isMapped: false,
            unit: variable.defaultUnit,
            children: variable.defaultType === 'Section' ? [] : undefined,
            isExpanded: true,
            versionTag: 'v1.0',
            versionColor: 'blue' as const,
            dependencies: [],
            isCustom: false,
          };
        }).filter(Boolean) as SchemaBlock[];

        onGenerate(generatedBlocks);
      }

      setIsGenerating(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="font-semibold text-slate-900">{t('protocolWorkbench.schemaGeneratorModal.title')}</h2>
              <p className="text-sm text-slate-600 mt-0.5">
                Generate schema from templates or description
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {t('protocolWorkbench.schemaGeneratorModal.description')}
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setSelectedTemplate(null);
              }}
              placeholder={t('protocolWorkbench.schemaGeneratorModal.descriptionPlaceholder')}
              rows={4}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Describe your protocol and we'll suggest relevant variables
            </p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-sm text-slate-500">OR</span>
            </div>
          </div>

          {/* Templates */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              {t('protocolWorkbench.schemaGeneratorModal.chooseTemplate')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setDescription('');
                  }}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        selectedTemplate === template.id ? 'bg-blue-100' : 'bg-slate-100'
                      }`}
                    >
                      <FileJson
                        className={`w-5 h-5 ${
                          selectedTemplate === template.id ? 'text-blue-600' : 'text-slate-600'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900 text-sm">{template.name}</h3>
                      <p className="text-xs text-slate-600 mt-1">{template.description}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {template.variables.length} variables
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {t('protocolWorkbench.schemaGeneratorModal.cancel')}
          </button>
          <button
            onClick={handleGenerate}
            disabled={!description && !selectedTemplate || isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                {t('protocolWorkbench.schemaGeneratorModal.generating')}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {t('protocolWorkbench.schemaGeneratorModal.generate')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}