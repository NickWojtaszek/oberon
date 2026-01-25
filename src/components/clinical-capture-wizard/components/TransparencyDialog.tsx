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
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../ui/dialog';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../../ui/collapsible';
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {!data ? (
          <div className="p-8 text-center text-slate-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <p>No transparency data available</p>
          </div>
        ) : (
          <>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-purple-600" />
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                AI Extraction Transparency
              </DialogTitle>
              <DialogDescription className="flex items-center gap-3 mt-1 text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formattedDate}
                </span>
                <span className="text-slate-400">•</span>
                <span>{Math.round(data.response.responseTimeMs)}ms</span>
                <span className="text-slate-400">•</span>
                {data.status === 'success' ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="w-3 h-3" />
                    Success
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-600">
                    <AlertCircle className="w-3 h-3" />
                    Error
                  </span>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Input Data Section */}
          <Collapsible
            open={expandedSections.input}
            onOpenChange={(open) =>
              setExpandedSections((prev) => ({ ...prev, input: open }))
            }
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-2">
                {expandedSections.input ? (
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                )}
                <FileText className="w-4 h-4 text-slate-600" />
                <span className="font-medium text-slate-900">Input Data</span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border border-slate-200 rounded-lg mt-2">
              <div className="space-y-3">
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
            </CollapsibleContent>
          </Collapsible>

          {/* Prompt Section */}
          <Collapsible
            open={expandedSections.prompt}
            onOpenChange={(open) =>
              setExpandedSections((prev) => ({ ...prev, prompt: open }))
            }
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
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
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border border-purple-200 rounded-lg mt-2">
              <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded overflow-x-auto whitespace-pre-wrap break-words">
                {data.prompt.fullPrompt}
              </pre>
            </CollapsibleContent>
          </Collapsible>

          {/* Raw Response Section */}
          <Collapsible
            open={expandedSections.response}
            onOpenChange={(open) =>
              setExpandedSections((prev) => ({ ...prev, response: open }))
            }
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
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
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border border-slate-200 rounded-lg mt-2">
              <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded overflow-x-auto whitespace-pre-wrap break-words">
                {data.response.rawText}
              </pre>
            </CollapsibleContent>
          </Collapsible>

          {/* Parsed Results Section */}
          <Collapsible
            open={expandedSections.parsed}
            onOpenChange={(open) =>
              setExpandedSections((prev) => ({ ...prev, parsed: open }))
            }
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div className="flex items-center gap-2">
                {expandedSections.parsed ? (
                  <ChevronDown className="w-4 h-4 text-green-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-green-600" />
                )}
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-900">Parsed PICO Results</span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border border-green-200 rounded-lg mt-2">
              {data.error ? (
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">{data.error.message}</p>
                      {data.error.details && (
                        <p className="text-sm text-red-700 mt-1">{data.error.details}</p>
                      )}
                    </div>
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
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
        </>
        )}
      </DialogContent>
    </Dialog>
  );
}
