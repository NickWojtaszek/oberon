/**
 * Generic Journal Editor
 * Research Factory - Phase 3 Enhancement
 * 
 * Allows users to customize the "Generic" journal defaults
 * Useful for setting baseline expectations for unknown journals
 */

import { useState, useEffect } from 'react';
import { Settings, X, Save, RotateCcw } from 'lucide-react';
import type { JournalConstraints } from '../../types/accountability';

interface GenericJournalEditorProps {
  isOpen: boolean;
  onClose: () => void;
  currentConstraints: JournalConstraints;
  onSave: (constraints: JournalConstraints) => void;
}

// Default factory settings
const FACTORY_DEFAULTS: JournalConstraints = {
  abstract: { wordLimit: 300, structured: false },
  introduction: { wordLimit: 1000 },
  methods: { wordLimit: 2000 },
  results: { wordLimit: 2000 },
  discussion: { wordLimit: 1500 },
  overall: { wordLimit: 6000 },
  references: { maxCount: 50, citationStyle: 'vancouver' },
  figures: { maxCount: 8 },
  tables: { maxCount: 8 },
};

export function GenericJournalEditor({ 
  isOpen, 
  onClose, 
  currentConstraints,
  onSave 
}: GenericJournalEditorProps) {
  // Local state for editing
  const [abstractLimit, setAbstractLimit] = useState(currentConstraints.abstract.wordLimit.toString());
  const [introLimit, setIntroLimit] = useState(currentConstraints.introduction.wordLimit.toString());
  const [methodsLimit, setMethodsLimit] = useState(currentConstraints.methods.wordLimit.toString());
  const [resultsLimit, setResultsLimit] = useState(currentConstraints.results.wordLimit.toString());
  const [discussionLimit, setDiscussionLimit] = useState(currentConstraints.discussion.wordLimit.toString());
  const [overallLimit, setOverallLimit] = useState(currentConstraints.overall.wordLimit.toString());
  const [refLimit, setRefLimit] = useState(currentConstraints.references.maxCount.toString());
  const [figureLimit, setFigureLimit] = useState(currentConstraints.figures.maxCount.toString());
  const [tableLimit, setTableLimit] = useState(currentConstraints.tables.maxCount.toString());
  const [citationStyle, setCitationStyle] = useState(currentConstraints.references.citationStyle);
  const [structuredAbstract, setStructuredAbstract] = useState(currentConstraints.abstract.structured);
  
  // Update local state when currentConstraints change
  useEffect(() => {
    setAbstractLimit(currentConstraints.abstract.wordLimit.toString());
    setIntroLimit(currentConstraints.introduction.wordLimit.toString());
    setMethodsLimit(currentConstraints.methods.wordLimit.toString());
    setResultsLimit(currentConstraints.results.wordLimit.toString());
    setDiscussionLimit(currentConstraints.discussion.wordLimit.toString());
    setOverallLimit(currentConstraints.overall.wordLimit.toString());
    setRefLimit(currentConstraints.references.maxCount.toString());
    setFigureLimit(currentConstraints.figures.maxCount.toString());
    setTableLimit(currentConstraints.tables.maxCount.toString());
    setCitationStyle(currentConstraints.references.citationStyle);
    setStructuredAbstract(currentConstraints.abstract.structured);
  }, [currentConstraints]);
  
  if (!isOpen) return null;
  
  const handleSave = () => {
    const newConstraints: JournalConstraints = {
      abstract: {
        wordLimit: parseInt(abstractLimit),
        structured: structuredAbstract,
      },
      introduction: {
        wordLimit: parseInt(introLimit),
      },
      methods: {
        wordLimit: parseInt(methodsLimit),
      },
      results: {
        wordLimit: parseInt(resultsLimit),
      },
      discussion: {
        wordLimit: parseInt(discussionLimit),
      },
      overall: {
        wordLimit: parseInt(overallLimit),
      },
      references: {
        maxCount: parseInt(refLimit),
        citationStyle,
      },
      figures: {
        maxCount: parseInt(figureLimit),
      },
      tables: {
        maxCount: parseInt(tableLimit),
      },
    };
    
    onSave(newConstraints);
    onClose();
  };
  
  const handleReset = () => {
    if (confirm('Reset to factory defaults? This will discard your custom settings.')) {
      setAbstractLimit(FACTORY_DEFAULTS.abstract.wordLimit.toString());
      setIntroLimit(FACTORY_DEFAULTS.introduction.wordLimit.toString());
      setMethodsLimit(FACTORY_DEFAULTS.methods.wordLimit.toString());
      setResultsLimit(FACTORY_DEFAULTS.results.wordLimit.toString());
      setDiscussionLimit(FACTORY_DEFAULTS.discussion.wordLimit.toString());
      setOverallLimit(FACTORY_DEFAULTS.overall.wordLimit.toString());
      setRefLimit(FACTORY_DEFAULTS.references.maxCount.toString());
      setFigureLimit(FACTORY_DEFAULTS.figures.maxCount.toString());
      setTableLimit(FACTORY_DEFAULTS.tables.maxCount.toString());
      setCitationStyle(FACTORY_DEFAULTS.references.citationStyle);
      setStructuredAbstract(FACTORY_DEFAULTS.abstract.structured);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Edit Generic Journal Defaults</h2>
              <p className="text-xs text-slate-500">Customize baseline constraints for unknown journals</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Info Banner */}
        <div className="mx-6 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-900">
            <strong>Note:</strong> These settings will be used as defaults when "Generic Academic Journal" is selected.
            Changes are saved to your browser and persist across sessions.
          </p>
        </div>
        
        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Word Limits */}
          <div>
            <h3 className="text-sm font-medium text-slate-900 mb-3">Word Limits</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Abstract</label>
                <input
                  type="number"
                  value={abstractLimit}
                  onChange={(e) => setAbstractLimit(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Introduction</label>
                <input
                  type="number"
                  value={introLimit}
                  onChange={(e) => setIntroLimit(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Methods</label>
                <input
                  type="number"
                  value={methodsLimit}
                  onChange={(e) => setMethodsLimit(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Results</label>
                <input
                  type="number"
                  value={resultsLimit}
                  onChange={(e) => setResultsLimit(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Discussion</label>
                <input
                  type="number"
                  value={discussionLimit}
                  onChange={(e) => setDiscussionLimit(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Overall</label>
                <input
                  type="number"
                  value={overallLimit}
                  onChange={(e) => setOverallLimit(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
          
          {/* Other Limits */}
          <div>
            <h3 className="text-sm font-medium text-slate-900 mb-3">Other Limits</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-600 mb-1">References</label>
                <input
                  type="number"
                  value={refLimit}
                  onChange={(e) => setRefLimit(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Figures</label>
                <input
                  type="number"
                  value={figureLimit}
                  onChange={(e) => setFigureLimit(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Tables</label>
                <input
                  type="number"
                  value={tableLimit}
                  onChange={(e) => setTableLimit(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
          
          {/* Formatting */}
          <div>
            <h3 className="text-sm font-medium text-slate-900 mb-3">Formatting</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Citation Style</label>
                <select
                  value={citationStyle}
                  onChange={(e) => setCitationStyle(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="vancouver">Vancouver</option>
                  <option value="apa">APA</option>
                  <option value="chicago">Chicago</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Abstract Type</label>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={structuredAbstract}
                    onChange={(e) => setStructuredAbstract(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-sm text-slate-700">Structured Abstract</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Presets Section */}
          <div>
            <h3 className="text-sm font-medium text-slate-900 mb-3">Quick Presets</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => {
                  // Conservative (strict limits)
                  setAbstractLimit('250');
                  setIntroLimit('750');
                  setMethodsLimit('1500');
                  setResultsLimit('1500');
                  setDiscussionLimit('1000');
                  setOverallLimit('4000');
                  setRefLimit('30');
                  setFigureLimit('4');
                  setTableLimit('4');
                }}
                className="px-3 py-2 text-xs bg-amber-50 border border-amber-200 rounded-md hover:bg-amber-100 transition-colors text-amber-900 font-medium"
              >
                🔒 Conservative
              </button>
              <button
                onClick={() => {
                  // Moderate (balanced)
                  setAbstractLimit('300');
                  setIntroLimit('1000');
                  setMethodsLimit('2000');
                  setResultsLimit('2000');
                  setDiscussionLimit('1500');
                  setOverallLimit('6000');
                  setRefLimit('50');
                  setFigureLimit('8');
                  setTableLimit('8');
                }}
                className="px-3 py-2 text-xs bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors text-blue-900 font-medium"
              >
                ⚖️ Moderate
              </button>
              <button
                onClick={() => {
                  // Lenient (generous limits)
                  setAbstractLimit('400');
                  setIntroLimit('1500');
                  setMethodsLimit('3000');
                  setResultsLimit('3000');
                  setDiscussionLimit('2000');
                  setOverallLimit('10000');
                  setRefLimit('100');
                  setFigureLimit('15');
                  setTableLimit('15');
                }}
                className="px-3 py-2 text-xs bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors text-green-900 font-medium"
              >
                🌐 Lenient
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Click a preset to quickly set common configurations
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
