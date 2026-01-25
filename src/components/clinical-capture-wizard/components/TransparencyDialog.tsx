/**
 * TransparencyDialog - Shows AI reasoning pipeline for PICO extraction
 * Displays: Prompt sent → Raw response → Parsed PICO
 * Helps users debug, verify, and understand AI extraction
 */

import { useState } from 'react';
import {
  Eye,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  FileText,
  Code2,
  Sparkles,
  Clock,
  X,
} from 'lucide-react';
import type { FoundationalPaperExtraction } from '../../../services/geminiService';

interface PICOExtractionTransparency {
  timestamp: string;
  status: 'success' | 'error';
  input: {
    rawObservation: string;
    foundationalPapers: FoundationalPaperExtraction[];
  };
  prompt: {
    fullPrompt: string;
    model: string;
    parameters: {
      temperature: number;
      maxOutputTokens: number;
    };
  };
  response: {
    rawText: string;
    responseTimeMs: number;
  };
  parsed: {
    population: string;
    intervention: string;
    comparison: string;
    outcome: string;
    confidence: number;
    reasoning: string;
  };
  error?: {
    message: string;
    details?: string;
  };
}

interface TransparencyDialogProps {
  open: boolean;
  onClose: () => void;
  data: PICOExtractionTransparency | null;
}

export function TransparencyDialog({ open, onClose, data }: TransparencyDialogProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    input: false,
    prompt: true,
    response: false,
    parsed: true,
  });

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  if (!open) return null;

  const formattedDate = data
    ? new Date(data.timestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : '';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">AI Extraction Transparency</h2>
                {data && (
                  <div className="flex items-center gap-3 text-sm text-purple-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formattedDate}
                    </span>
                    <span>•</span>
                    <span>{Math.round(data.response.responseTimeMs)}ms</span>
                    <span>•</span>
                    {data.status === 'success' ? (
                      <span className="flex items-center gap-1 text-green-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Success
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-200">
                        <AlertCircle className="w-3 h-3" />
                        Error
                      </span>
                    )}
                  </div>
                )}
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
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!data ? (
            <div className="p-8 text-center text-slate-600">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <p>No transparency data available</p>
            </div>
          ) : (
            <>
              {/* Input Data Section */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedSections((prev) => ({ ...prev, input: !prev.input }))
                  }
                  className="flex items-center justify-between w-full p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedSections.input ? (
                      <ChevronDown className="w-4 h-4 text-slate-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    )}
                    <FileText className="w-4 h-4 text-slate-600" />
                    <span className="font-medium text-slate-900">Input Data</span>
                  </div>
                </button>
                {expandedSections.input && (
                  <div className="p-4 border-t border-slate-200 space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                        Research Question
                      </label>
                      <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">
                        {data.input.rawObservation}
                      </p>
                    </div>
                    {data.input.foundationalPapers.length > 0 && (
                      <div>
                        <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                          Foundational Papers ({data.input.foundationalPapers.length})
                        </label>
                        <ul className="mt-1 space-y-1">
                          {data.input.foundationalPapers.map((paper, i) => (
                            <li key={i} className="text-sm text-slate-700">
                              {paper.title} ({paper.year})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Prompt Section */}
              <div className="border border-purple-200 rounded-lg overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedSections((prev) => ({ ...prev, prompt: !prev.prompt }))
                  }
                  className="flex items-center justify-between w-full p-4 bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedSections.prompt ? (
                      <ChevronDown className="w-4 h-4 text-purple-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-purple-600" />
                    )}
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-purple-900">Prompt Sent to Gemini</span>
                    <span className="text-xs text-purple-600 ml-2">
                      {data.prompt.model} • temp: {data.prompt.parameters.temperature}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(data.prompt.fullPrompt, 'prompt');
                    }}
                    className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1 px-2 py-1 rounded hover:bg-purple-200 transition-colors"
                  >
                    {copiedSection === 'prompt' ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </button>
                {expandedSections.prompt && (
                  <div className="p-4 border-t border-purple-200">
                    <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded overflow-x-auto whitespace-pre-wrap break-words max-h-[300px] overflow-y-auto">
                      {data.prompt.fullPrompt}
                    </pre>
                  </div>
                )}
              </div>

              {/* Raw Response Section */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedSections((prev) => ({ ...prev, response: !prev.response }))
                  }
                  className="flex items-center justify-between w-full p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedSections.response ? (
                      <ChevronDown className="w-4 h-4 text-slate-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    )}
                    <Code2 className="w-4 h-4 text-slate-600" />
                    <span className="font-medium text-slate-900">Raw API Response</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(data.response.rawText, 'response');
                    }}
                    className="text-xs text-slate-600 hover:text-slate-800 flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-200 transition-colors"
                  >
                    {copiedSection === 'response' ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </button>
                {expandedSections.response && (
                  <div className="p-4 border-t border-slate-200">
                    <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded overflow-x-auto whitespace-pre-wrap break-words max-h-[300px] overflow-y-auto">
                      {data.response.rawText}
                    </pre>
                  </div>
                )}
              </div>

              {/* Parsed Results Section */}
              <div className="border border-green-200 rounded-lg overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedSections((prev) => ({ ...prev, parsed: !prev.parsed }))
                  }
                  className="flex items-center justify-between w-full p-4 bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedSections.parsed ? (
                      <ChevronDown className="w-4 h-4 text-green-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-green-600" />
                    )}
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-900">Parsed PICO Results</span>
                  </div>
                </button>
                {expandedSections.parsed && (
                  <div className="p-4 border-t border-green-200">
                    {data.error ? (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-900">{data.error.message}</p>
                          {data.error.details && (
                            <p className="text-sm text-red-700 mt-1">{data.error.details}</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                            Population
                          </label>
                          <p className="mt-1 text-sm text-slate-900">{data.parsed.population}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                            Intervention
                          </label>
                          <p className="mt-1 text-sm text-slate-900">{data.parsed.intervention}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                            Comparison
                          </label>
                          <p className="mt-1 text-sm text-slate-900">{data.parsed.comparison}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                            Outcome
                          </label>
                          <p className="mt-1 text-sm text-slate-900">{data.parsed.outcome}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-200">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                              Confidence
                            </label>
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded ${
                                data.parsed.confidence >= 0.8
                                  ? 'bg-green-100 text-green-700'
                                  : data.parsed.confidence >= 0.6
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {Math.round(data.parsed.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                            AI Reasoning
                          </label>
                          <p className="mt-1 text-sm text-slate-700 italic">{data.parsed.reasoning}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
