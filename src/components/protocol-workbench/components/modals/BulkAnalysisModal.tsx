/**
 * Bulk Analysis Modal - Dr. Puck analyzes all schema fields at once
 * Much more efficient than going through 100+ fields one by one
 */

import { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle, Loader2, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import type { SchemaBlock, DataType, RoleTag } from '../../types';
import { analyzeBulkFieldConfiguration, isGeminiConfigured, type SchemaFieldSuggestion } from '../../../../services/geminiService';
import { getAllBlocks } from '../../utils';

interface BulkAnalysisModalProps {
  schemaBlocks: SchemaBlock[];
  onClose: () => void;
  onApplySuggestions: (updates: Map<string, Partial<SchemaBlock>>) => void;
  protocolContext?: {
    primaryObjective?: string;
    secondaryObjectives?: string;
    statisticalPlan?: string;
    studyPhase?: string;
    therapeuticArea?: string;
    fullProtocolText?: string;
  };
}

interface FieldSuggestion {
  fieldId: string;
  fieldName: string;
  currentConfig: {
    role: string;
    endpointTier: string | null;
    analysisMethod: string | null;
    dataType: string;
  };
  suggestion: SchemaFieldSuggestion;
  selected: boolean;
}

export function BulkAnalysisModal({
  schemaBlocks,
  onClose,
  onApplySuggestions,
  protocolContext,
}: BulkAnalysisModalProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<FieldSuggestion[]>([]);
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState({ processed: 0, total: 0 });

  // Get all non-Section fields
  const allFields = getAllBlocks(schemaBlocks).filter(b => b.dataType !== 'Section');
  const fieldCount = allFields.length;

  // Check if Gemini is configured
  const geminiConfigured = isGeminiConfigured();

  // Run analysis on mount
  useEffect(() => {
    if (geminiConfigured && fieldCount > 0) {
      runBulkAnalysis();
    }
  }, []);

  const runBulkAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    setSuggestions([]);
    setProgress({ processed: 0, total: fieldCount });

    try {
      // Prepare fields for analysis
      const fieldsForAnalysis = allFields.map(block => ({
        id: block.id,
        name: block.customName || block.variable.name,
        currentRole: block.role,
        currentEndpointTier: block.endpointTier || null,
        currentAnalysisMethod: block.analysisMethod || null,
        dataType: block.dataType,
      }));

      // Call bulk analysis API with progress callback
      const suggestionMap = await analyzeBulkFieldConfiguration(
        fieldsForAnalysis,
        protocolContext || {},
        (processed, total) => setProgress({ processed, total })
      );

      // Convert to array with selection state
      const suggestionsArray: FieldSuggestion[] = [];
      suggestionMap.forEach((suggestion, fieldId) => {
        const block = allFields.find(f => f.id === fieldId);
        if (block) {
          suggestionsArray.push({
            fieldId,
            fieldName: block.customName || block.variable.name,
            currentConfig: {
              role: block.role,
              endpointTier: block.endpointTier || null,
              analysisMethod: block.analysisMethod || null,
              dataType: block.dataType,
            },
            suggestion,
            selected: true, // Default to selected
          });
        }
      });

      setSuggestions(suggestionsArray);

      if (suggestionsArray.length === 0) {
        setError('No configuration changes suggested - your schema looks good!');
      }
    } catch (err) {
      console.error('Bulk analysis failed:', err);
      // More descriptive error message
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (errorMessage.includes('API key') || errorMessage.includes('configured')) {
        setError('Gemini API key not configured. Go to Settings to add your API key.');
      } else if (errorMessage.includes('429') || errorMessage.includes('rate')) {
        setError('API rate limit reached. Please wait a moment and try again.');
      } else if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
        setError('Network timeout. Check your connection and try again.');
      } else {
        setError(`Analysis failed: ${errorMessage.substring(0, 100)}`);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleFieldSelection = (fieldId: string) => {
    setSuggestions(prev =>
      prev.map(s =>
        s.fieldId === fieldId ? { ...s, selected: !s.selected } : s
      )
    );
  };

  const toggleAllSelected = () => {
    const allSelected = suggestions.every(s => s.selected);
    setSuggestions(prev =>
      prev.map(s => ({ ...s, selected: !allSelected }))
    );
  };

  const toggleExpanded = (fieldId: string) => {
    setExpandedFields(prev => {
      const next = new Set(prev);
      if (next.has(fieldId)) {
        next.delete(fieldId);
      } else {
        next.add(fieldId);
      }
      return next;
    });
  };

  const handleApply = () => {
    const updates = new Map<string, Partial<SchemaBlock>>();

    suggestions
      .filter(s => s.selected)
      .forEach(s => {
        updates.set(s.fieldId, {
          role: s.suggestion.role as RoleTag,
          endpointTier: s.suggestion.endpointTier,
          analysisMethod: s.suggestion.analysisMethod,
          dataType: s.suggestion.dataType as DataType,
        });
      });

    onApplySuggestions(updates);
    onClose();
  };

  const selectedCount = suggestions.filter(s => s.selected).length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col">
        {/* Header - fixed at top */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Dr. Puck Bulk Analysis</h2>
                <p className="text-sm text-slate-600">
                  Analyzing {fieldCount} fields for optimal configuration
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content - scrollable area */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          {/* Not Configured State */}
          {!geminiConfigured && (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Gemini API Not Configured
              </h3>
              <p className="text-slate-600 mb-4">
                Dr. Puck requires a Gemini API key to analyze your schema.
              </p>
              <p className="text-sm text-slate-500">
                Go to Settings to configure your API key.
              </p>
            </div>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Analyzing Schema...
              </h3>
              <p className="text-slate-600">
                Dr. Puck is reviewing {fieldCount} fields against your protocol context.
              </p>
              {progress.total > 0 && (
                <div className="mt-4 max-w-xs mx-auto">
                  <div className="flex justify-between text-sm text-slate-500 mb-1">
                    <span>Progress</span>
                    <span>{progress.processed} / {progress.total} fields</span>
                  </div>
                  <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 transition-all duration-300"
                      style={{ width: `${Math.round((progress.processed / progress.total) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Processing in batches of 40 fields...
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Error State */}
          {error && !isAnalyzing && (
            <div className="text-center py-8">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                error.includes('looks good') ? 'bg-green-100' : 'bg-amber-100'
              }`}>
                {error.includes('looks good') ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                )}
              </div>
              <p className={`${error.includes('looks good') ? 'text-green-700' : 'text-amber-700'}`}>
                {error}
              </p>
              {!error.includes('looks good') && (
                <button
                  onClick={runBulkAnalysis}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Retry Analysis
                </button>
              )}
            </div>
          )}

          {/* Results */}
          {!isAnalyzing && suggestions.length > 0 && (
            <>
              {/* Summary */}
              <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-purple-900">
                      {suggestions.length} fields
                    </span>
                    <span className="text-purple-700"> need configuration updates</span>
                  </div>
                  <button
                    onClick={toggleAllSelected}
                    className="text-sm text-purple-600 hover:text-purple-800"
                  >
                    {suggestions.every(s => s.selected) ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
              </div>

              {/* Suggestions List */}
              <div className="space-y-2">
                {suggestions.map(s => (
                  <div
                    key={s.fieldId}
                    className={`border rounded-lg transition-colors ${
                      s.selected ? 'border-purple-300 bg-purple-50/50' : 'border-slate-200 bg-white'
                    }`}
                  >
                    {/* Header Row */}
                    <div
                      className="flex items-center gap-3 p-3 cursor-pointer"
                      onClick={() => toggleExpanded(s.fieldId)}
                    >
                      <input
                        type="checkbox"
                        checked={s.selected}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleFieldSelection(s.fieldId);
                        }}
                        className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                      />
                      <button className="p-1">
                        {expandedFields.has(s.fieldId) ? (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      <div className="flex-1">
                        <span className="font-medium text-slate-900">{s.fieldName}</span>
                        <span className="text-slate-500 text-sm ml-2">
                          → {s.suggestion.role}
                          {s.suggestion.endpointTier && ` (${s.suggestion.endpointTier})`}
                        </span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                        {s.suggestion.roleConfidence}% confidence
                      </span>
                    </div>

                    {/* Expanded Details */}
                    {expandedFields.has(s.fieldId) && (
                      <div className="px-12 pb-3 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-slate-500 mb-1">Current</div>
                            <div className="space-y-1">
                              <div><span className="text-slate-600">Role:</span> {s.currentConfig.role}</div>
                              <div><span className="text-slate-600">Endpoint:</span> {s.currentConfig.endpointTier || 'None'}</div>
                              <div><span className="text-slate-600">Analysis:</span> {s.currentConfig.analysisMethod || 'None'}</div>
                              <div><span className="text-slate-600">Data Type:</span> {s.currentConfig.dataType}</div>
                            </div>
                          </div>
                          <div>
                            <div className="text-purple-600 font-medium mb-1">Suggested</div>
                            <div className="space-y-1">
                              <div><span className="text-slate-600">Role:</span> <span className="font-medium text-purple-700">{s.suggestion.role}</span></div>
                              <div><span className="text-slate-600">Endpoint:</span> <span className="font-medium text-purple-700">{s.suggestion.endpointTier || 'None'}</span></div>
                              <div><span className="text-slate-600">Analysis:</span> <span className="font-medium text-purple-700">{s.suggestion.analysisMethod || 'None'}</span></div>
                              <div><span className="text-slate-600">Data Type:</span> <span className="font-medium text-purple-700">{s.suggestion.dataType}</span></div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-white border border-slate-200 rounded text-slate-600">
                          <span className="font-medium">Rationale:</span> {s.suggestion.roleRationale}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer - fixed at bottom */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="text-sm text-slate-600">
            {suggestions.length > 0 ? (
              <span>{selectedCount} of {suggestions.length} suggestions selected</span>
            ) : !isAnalyzing && !error && geminiConfigured && (
              <span className="text-slate-400">No suggestions available</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Retry button always visible when not analyzing */}
            {!isAnalyzing && geminiConfigured && (
              <button
                onClick={runBulkAnalysis}
                className="px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Re-analyze
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors"
            >
              Cancel
            </button>
            {suggestions.length > 0 && (
              <button
                onClick={handleApply}
                disabled={selectedCount === 0}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Apply {selectedCount} Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
