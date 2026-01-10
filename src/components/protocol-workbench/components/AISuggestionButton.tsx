/**
 * AI Suggestion Button - Shows sparkle icon that opens suggestion popover
 * 
 * Used next to Protocol fields to offer AI-generated suggestions
 * based on PICO framework and foundational papers
 */

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Loader2, Check, X, ChevronRight, BookOpen } from 'lucide-react';
import { 
  generateProtocolSuggestion, 
  isGeminiConfigured,
  type ProtocolSuggestionField,
  type ProtocolFieldSuggestion,
  type FoundationalPaperExtraction
} from '../../../services/geminiService';

interface AISuggestionButtonProps {
  field: ProtocolSuggestionField;
  pico: {
    population: string;
    intervention: string;
    comparison: string;
    outcome: string;
  };
  foundationalPapers: FoundationalPaperExtraction[];
  onApply: (value: string) => void;
  disabled?: boolean;
}

export function AISuggestionButton({
  field,
  pico,
  foundationalPapers,
  onApply,
  disabled = false,
}: AISuggestionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<ProtocolFieldSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleClick = async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
    setSuggestion(null);
    setError(null);
    setIsLoading(true);

    try {
      const result = await generateProtocolSuggestion(field, pico, foundationalPapers);
      setSuggestion(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate suggestion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (suggestion) {
      onApply(suggestion.value);
      setIsOpen(false);
      setSuggestion(null);
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    setSuggestion(null);
  };

  const isConfigured = isGeminiConfigured();
  const hasPICO = pico.population || pico.intervention || pico.comparison || pico.outcome;

  // Don't show if Gemini not configured or no PICO data
  if (!isConfigured || !hasPICO) {
    return null;
  }

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={`p-1.5 rounded-lg transition-all ${
          isOpen 
            ? 'bg-amber-100 text-amber-600' 
            : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title="Get AI suggestion based on PICO"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </button>

      {/* Suggestion Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-50 right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-slate-800">AI Suggestion</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                <span className="ml-2 text-sm text-slate-600">Generating suggestion...</span>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={handleClick}
                  className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            )}

            {suggestion && !isLoading && (
              <div className="space-y-3">
                {/* Suggestion Value */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <p className="text-sm text-slate-800 whitespace-pre-wrap">{suggestion.value}</p>
                </div>

                {/* Rationale */}
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-600">{suggestion.rationale}</p>
                </div>

                {/* Sources & Confidence */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] text-slate-500">
                      {suggestion.sources.slice(0, 2).join(', ')}
                      {suggestion.sources.length > 2 && ` +${suggestion.sources.length - 2}`}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    suggestion.confidence === 'high' 
                      ? 'bg-green-100 text-green-700' 
                      : suggestion.confidence === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                  }`}>
                    {suggestion.confidence} confidence
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={handleApply}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Apply
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
