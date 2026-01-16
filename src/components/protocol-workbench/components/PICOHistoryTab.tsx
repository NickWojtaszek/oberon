/**
 * PICO History Tab
 * Displays PICO extraction history with input text and source articles
 */

import { useState } from 'react';
import {
  Users,
  Syringe,
  GitCompare,
  Target,
  Clock,
  FileText,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { useProject } from '../../../contexts/ProtocolContext';

interface PICOExtraction {
  id: string;
  timestamp: string;
  inputText: string;
  picoFramework: {
    population?: string;
    intervention?: string;
    comparison?: string;
    outcome?: string;
    timeframe?: string;
  };
  sourceArticles?: Array<{
    id: string;
    title: string;
    authors: string;
    year: number;
    doi?: string;
  }>;
  status: 'draft' | 'validated' | 'approved';
  validatedBy?: string;
  validatedAt?: string;
}

export function PICOHistoryTab() {
  const { currentProject, updateProject } = useProject();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Get PICO history from studyMethodology
  const picoHistory: PICOExtraction[] = currentProject?.studyMethodology?.picoHistory || [];

  // Current PICO (latest extraction)
  const currentPICO = currentProject?.studyMethodology?.hypothesis?.picoFramework;
  const researchQuestion = currentProject?.studyMethodology?.hypothesis?.researchQuestion;
  const foundationalPapers = currentProject?.studyMethodology?.foundationalPapers || [];

  // Check if we have any PICO data at all
  const hasPICO = currentPICO && (
    currentPICO.population ||
    currentPICO.intervention ||
    currentPICO.comparison ||
    currentPICO.outcome
  );

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case 'validated':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Validated
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            Draft
          </span>
        );
    }
  };

  const PICOField = ({
    icon: Icon,
    label,
    value,
    color
  }: {
    icon: React.ElementType;
    label: string;
    value?: string;
    color: string;
  }) => (
    <div className={`p-3 rounded-lg border ${value ? `bg-${color}-50 border-${color}-200` : 'bg-slate-50 border-slate-200'}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${value ? `text-${color}-600` : 'text-slate-400'}`} />
        <span className="text-xs font-medium text-slate-600">{label}</span>
      </div>
      <p className={`text-sm ${value ? 'text-slate-900' : 'text-slate-400 italic'}`}>
        {value || 'Not defined'}
      </p>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">PICO Framework</h2>
                <p className="text-sm text-slate-600">
                  Population, Intervention, Comparison, Outcome extraction history
                </p>
              </div>
              {hasPICO && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  PICO Defined
                </span>
              )}
            </div>

            {/* Research Question */}
            {researchQuestion && (
              <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-700">Research Question / Input Text</span>
                </div>
                <p className="text-sm text-purple-900">{researchQuestion}</p>
              </div>
            )}

            {/* Current PICO */}
            {hasPICO ? (
              <div className="grid grid-cols-2 gap-3">
                <PICOField
                  icon={Users}
                  label="Population"
                  value={currentPICO?.population}
                  color="blue"
                />
                <PICOField
                  icon={Syringe}
                  label="Intervention"
                  value={currentPICO?.intervention}
                  color="green"
                />
                <PICOField
                  icon={GitCompare}
                  label="Comparison"
                  value={currentPICO?.comparison}
                  color="amber"
                />
                <PICOField
                  icon={Target}
                  label="Outcome"
                  value={currentPICO?.outcome}
                  color="purple"
                />
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">No PICO Framework Defined</p>
                <p className="text-xs text-slate-500 mt-1">
                  Use the Research Wizard to define your PICO framework
                </p>
              </div>
            )}
          </div>

          {/* Foundational Papers */}
          {foundationalPapers.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-semibold text-slate-900">
                  Source Articles ({foundationalPapers.length})
                </h3>
              </div>
              <div className="space-y-3">
                {foundationalPapers.map((paper: any, index: number) => (
                  <div
                    key={paper.id || index}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <p className="text-sm font-medium text-slate-900 mb-1">
                      {paper.title}
                    </p>
                    <p className="text-xs text-slate-600">
                      {paper.authors} ({paper.year})
                    </p>
                    {paper.doi && (
                      <p className="text-xs text-blue-600 mt-1">
                        DOI: {paper.doi}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PICO History */}
          {picoHistory.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-slate-600" />
                <h3 className="text-base font-semibold text-slate-900">
                  Extraction History ({picoHistory.length})
                </h3>
              </div>
              <div className="space-y-3">
                {picoHistory.map((extraction) => (
                  <div
                    key={extraction.id}
                    className="border border-slate-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleExpanded(extraction.id)}
                      className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-600">
                          {formatDate(extraction.timestamp)}
                        </span>
                        {getStatusBadge(extraction.status)}
                      </div>
                      {expandedId === extraction.id ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {expandedId === extraction.id && (
                      <div className="p-4 border-t border-slate-200 space-y-3">
                        {extraction.inputText && (
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <span className="text-xs font-medium text-purple-700">Input Text</span>
                            <p className="text-sm text-purple-900 mt-1">{extraction.inputText}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          <PICOField
                            icon={Users}
                            label="Population"
                            value={extraction.picoFramework.population}
                            color="blue"
                          />
                          <PICOField
                            icon={Syringe}
                            label="Intervention"
                            value={extraction.picoFramework.intervention}
                            color="green"
                          />
                          <PICOField
                            icon={GitCompare}
                            label="Comparison"
                            value={extraction.picoFramework.comparison}
                            color="amber"
                          />
                          <PICOField
                            icon={Target}
                            label="Outcome"
                            value={extraction.picoFramework.outcome}
                            color="purple"
                          />
                        </div>
                        {extraction.sourceArticles && extraction.sourceArticles.length > 0 && (
                          <div className="mt-3">
                            <span className="text-xs font-medium text-slate-600">Source Articles</span>
                            <div className="mt-2 space-y-2">
                              {extraction.sourceArticles.map((article) => (
                                <div key={article.id} className="text-xs text-slate-700 bg-slate-50 p-2 rounded">
                                  {article.title} ({article.year})
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Debug Info */}
          <div className="bg-slate-100 rounded-lg p-4 text-xs font-mono text-slate-600">
            <p className="font-semibold mb-2">Debug Info:</p>
            <p>Protocol ID: {currentProject?.id || 'None'}</p>
            <p>Has studyMethodology: {currentProject?.studyMethodology ? 'Yes' : 'No'}</p>
            <p>Has hypothesis: {currentProject?.studyMethodology?.hypothesis ? 'Yes' : 'No'}</p>
            <p>Has picoFramework: {currentPICO ? 'Yes' : 'No'}</p>
            <p>PICO Population: {currentPICO?.population || 'Empty'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
