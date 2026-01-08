// Auto-Generate Manuscript Modal
// Allows users to configure and trigger AI-powered manuscript generation in Autopilot mode

import { useState } from 'react';
import { X, Sparkles, FileText, AlertCircle, CheckCircle2, Wand2 } from 'lucide-react';
import type { StatisticalManifest } from '../analytics-stats/types';

interface AutoGenerateManuscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (options: GenerationOptions) => void;
  manifest: StatisticalManifest | null;
  currentContent: {
    abstract: string;
    introduction: string;
    methods: string;
    results: string;
    discussion: string;
    conclusion: string;
  };
}

export interface GenerationOptions {
  sections: {
    abstract: boolean;
    introduction: boolean;
    methods: boolean;
    results: boolean;
    discussion: boolean;
    conclusion: boolean;
  };
  mode: 'overwrite' | 'append' | 'new-draft';
  tone: 'formal' | 'conversational' | 'technical';
  citationStyle: 'vancouver' | 'apa' | 'harvard';
  includeStatistics: boolean;
  includeDiscussion: boolean;
  wordBudget: 'strict' | 'flexible' | 'extended';
}

export function AutoGenerateManuscriptModal({
  isOpen,
  onClose,
  onGenerate,
  manifest,
  currentContent,
}: AutoGenerateManuscriptModalProps) {
  const [options, setOptions] = useState<GenerationOptions>({
    sections: {
      abstract: true,
      introduction: true,
      methods: true,
      results: true,
      discussion: true,
      conclusion: true,
    },
    mode: 'overwrite',
    tone: 'formal',
    citationStyle: 'vancouver',
    includeStatistics: true,
    includeDiscussion: true,
    wordBudget: 'strict',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const hasExistingContent = Object.values(currentContent).some(content => content.trim().length > 50);
  const hasManifest = manifest !== null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onGenerate(options);
    setIsGenerating(false);
    onClose();
  };

  const toggleSection = (section: keyof GenerationOptions['sections']) => {
    setOptions({
      ...options,
      sections: {
        ...options.sections,
        [section]: !options.sections[section],
      },
    });
  };

  const selectedSectionCount = Object.values(options.sections).filter(Boolean).length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Auto-Generate Manuscript</h2>
                <p className="text-sm text-purple-100">AI-powered draft generation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Alerts */}
          <div className="space-y-3">
            {!hasManifest && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-amber-900">No Statistical Manifest</div>
                  <div className="text-xs text-amber-700 mt-1">
                    AI will generate content without statistical data. For best results, create a Statistical Manifest first.
                  </div>
                </div>
              </div>
            )}

            {hasExistingContent && options.mode === 'overwrite' && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-red-900">Warning: Content Will Be Replaced</div>
                  <div className="text-xs text-red-700 mt-1">
                    Existing content in selected sections will be overwritten. Consider using "Append" or "New Draft" mode instead.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Generation Mode */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">Generation Mode</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setOptions({ ...options, mode: 'overwrite' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  options.mode === 'overwrite'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="text-sm font-medium text-slate-900 mb-1">Overwrite</div>
                <div className="text-xs text-slate-600">Replace existing content</div>
              </button>
              <button
                onClick={() => setOptions({ ...options, mode: 'append' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  options.mode === 'append'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="text-sm font-medium text-slate-900 mb-1">Append</div>
                <div className="text-xs text-slate-600">Add to existing content</div>
              </button>
              <button
                onClick={() => setOptions({ ...options, mode: 'new-draft' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  options.mode === 'new-draft'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="text-sm font-medium text-slate-900 mb-1">New Draft</div>
                <div className="text-xs text-slate-600">Create separate version</div>
              </button>
            </div>
          </div>

          {/* Sections to Generate */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-slate-900">
                Sections to Generate ({selectedSectionCount}/6)
              </label>
              <button
                onClick={() => {
                  const allSelected = selectedSectionCount === 6;
                  setOptions({
                    ...options,
                    sections: {
                      abstract: !allSelected,
                      introduction: !allSelected,
                      methods: !allSelected,
                      results: !allSelected,
                      discussion: !allSelected,
                      conclusion: !allSelected,
                    },
                  });
                }}
                className="text-xs text-purple-600 hover:text-purple-700 font-medium"
              >
                {selectedSectionCount === 6 ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(options.sections) as Array<keyof GenerationOptions['sections']>).map(section => {
                const wordCount = currentContent[section]?.split(/\s+/).filter(w => w.length > 0).length || 0;
                return (
                  <button
                    key={section}
                    onClick={() => toggleSection(section)}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                      options.sections[section]
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        options.sections[section]
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-slate-300'
                      }`}>
                        {options.sections[section] && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm font-medium capitalize text-slate-900">{section}</span>
                    </div>
                    {wordCount > 0 && (
                      <span className="text-xs text-slate-500">{wordCount} words</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Writing Style */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">Writing Tone</label>
            <div className="grid grid-cols-3 gap-3">
              {(['formal', 'conversational', 'technical'] as const).map(tone => (
                <button
                  key={tone}
                  onClick={() => setOptions({ ...options, tone })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    options.tone === tone
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-sm font-medium capitalize text-slate-900">{tone}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Citation Style */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">Citation Style</label>
            <div className="grid grid-cols-3 gap-3">
              {(['vancouver', 'apa', 'harvard'] as const).map(style => (
                <button
                  key={style}
                  onClick={() => setOptions({ ...options, citationStyle: style })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    options.citationStyle === style
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-sm font-medium uppercase text-slate-900">{style}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Word Budget */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">Word Budget Compliance</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setOptions({ ...options, wordBudget: 'strict' })}
                className={`p-3 rounded-lg border-2 transition-all ${
                  options.wordBudget === 'strict'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="text-sm font-medium text-slate-900 mb-1">Strict</div>
                <div className="text-xs text-slate-600">Journal limits</div>
              </button>
              <button
                onClick={() => setOptions({ ...options, wordBudget: 'flexible' })}
                className={`p-3 rounded-lg border-2 transition-all ${
                  options.wordBudget === 'flexible'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="text-sm font-medium text-slate-900 mb-1">Flexible</div>
                <div className="text-xs text-slate-600">+20% buffer</div>
              </button>
              <button
                onClick={() => setOptions({ ...options, wordBudget: 'extended' })}
                className={`p-3 rounded-lg border-2 transition-all ${
                  options.wordBudget === 'extended'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="text-sm font-medium text-slate-900 mb-1">Extended</div>
                <div className="text-xs text-slate-600">No limits</div>
              </button>
            </div>
          </div>

          {/* Additional Options */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">Additional Options</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeStatistics}
                  onChange={(e) => setOptions({ ...options, includeStatistics: e.target.checked })}
                  className="w-4 h-4 text-purple-600"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">Include Statistical Results</div>
                  <div className="text-xs text-slate-600">Pull data from Statistical Manifest</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeDiscussion}
                  onChange={(e) => setOptions({ ...options, includeDiscussion: e.target.checked })}
                  className="w-4 h-4 text-purple-600"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">Generate Discussion Points</div>
                  <div className="text-xs text-slate-600">AI will interpret findings and suggest implications</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            {selectedSectionCount === 0 ? (
              <span className="text-amber-600 font-medium">⚠️ Select at least one section</span>
            ) : (
              <span>Ready to generate {selectedSectionCount} section{selectedSectionCount !== 1 ? 's' : ''}</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              disabled={isGenerating}
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={selectedSectionCount === 0 || isGenerating}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Manuscript
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
