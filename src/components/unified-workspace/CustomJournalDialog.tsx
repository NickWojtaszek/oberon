/**
 * Custom Journal Builder Dialog
 * Research Factory - Phase 3 Enhancement
 * 
 * Allows users to create custom journal profiles for lesser-known journals
 */

import { useState } from 'react';
import { Plus, X, Save } from 'lucide-react';
import { createCustomJournal } from '../../data/journalLibrary';
import type { JournalProfile, JournalConstraints } from '../../types/accountability';

interface CustomJournalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (journal: JournalProfile) => void;
}

export function CustomJournalDialog({ isOpen, onClose, onSave }: CustomJournalDialogProps) {
  const [journalName, setJournalName] = useState('');
  const [shortName, setShortName] = useState('');
  const [impactFactor, setImpactFactor] = useState('');
  
  // Constraints
  const [abstractLimit, setAbstractLimit] = useState('300');
  const [introLimit, setIntroLimit] = useState('1000');
  const [methodsLimit, setMethodsLimit] = useState('2000');
  const [resultsLimit, setResultsLimit] = useState('2000');
  const [discussionLimit, setDiscussionLimit] = useState('1500');
  const [overallLimit, setOverallLimit] = useState('6000');
  const [refLimit, setRefLimit] = useState('50');
  const [figureLimit, setFigureLimit] = useState('8');
  const [tableLimit, setTableLimit] = useState('8');
  const [citationStyle, setCitationStyle] = useState<'vancouver' | 'apa' | 'chicago'>('vancouver');
  const [structuredAbstract, setStructuredAbstract] = useState(false);
  
  if (!isOpen) return null;
  
  const handleSave = () => {
    const constraints: JournalConstraints = {
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
    
    const journal = createCustomJournal(
      journalName,
      shortName,
      constraints,
      impactFactor ? parseFloat(impactFactor) : undefined
    );
    
    onSave(journal);
    handleClose();
  };
  
  const handleClose = () => {
    // Reset form
    setJournalName('');
    setShortName('');
    setImpactFactor('');
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Create Custom Journal</h2>
              <p className="text-xs text-slate-500">For lesser-known or regional journals</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Journal Info */}
          <div>
            <h3 className="text-sm font-medium text-slate-900 mb-3">Journal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={journalName}
                  onChange={(e) => setJournalName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Journal of Clinical Research"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Short Name *
                </label>
                <input
                  type="text"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="JCR"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Impact Factor (Optional)
              </label>
              <input
                type="number"
                step="0.1"
                value={impactFactor}
                onChange={(e) => setImpactFactor(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="3.5"
              />
            </div>
          </div>
          
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
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Introduction</label>
                <input
                  type="number"
                  value={introLimit}
                  onChange={(e) => setIntroLimit(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Methods</label>
                <input
                  type="number"
                  value={methodsLimit}
                  onChange={(e) => setMethodsLimit(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Results</label>
                <input
                  type="number"
                  value={resultsLimit}
                  onChange={(e) => setResultsLimit(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Discussion</label>
                <input
                  type="number"
                  value={discussionLimit}
                  onChange={(e) => setDiscussionLimit(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Overall</label>
                <input
                  type="number"
                  value={overallLimit}
                  onChange={(e) => setOverallLimit(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm"
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
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Figures</label>
                <input
                  type="number"
                  value={figureLimit}
                  onChange={(e) => setFigureLimit(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Tables</label>
                <input
                  type="number"
                  value={tableLimit}
                  onChange={(e) => setTableLimit(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
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
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-slate-700">Structured Abstract</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!journalName || !shortName}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Save Journal
          </button>
        </div>
      </div>
    </div>
  );
}
