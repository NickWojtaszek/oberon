/**
 * PICO Capture Step
 * Migrated from ResearchWizard with full feature preservation:
 * - AI-powered PICO extraction
 * - PDF upload for foundational papers
 * - Dr. Ariadne persona integration
 * - Real-time validation
 */

import { useState, useRef } from 'react';
import {
  Users,
  Syringe,
  GitCompare,
  Target,
  Upload,
  Trash2,
  Loader2,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Bot,
  Mic,
  MicOff,
} from 'lucide-react';
import { getPersona } from '../../ai-personas/core/personaRegistry';
import {
  isGeminiConfigured,
  extractPICOWithGemini,
  extractFromPDF,
  synthesizeFoundationalPapers,
  type FoundationalPaperExtraction,
} from '../../../services/geminiService';

interface PICOField {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  grounded: 'found' | 'missing' | 'pending';
}

interface PICOCaptureStepProps {
  onComplete: (data: {
    rawObservation: string;
    picoFields: {
      population: string;
      intervention: string;
      comparison: string;
      outcome: string;
      timeframe?: string;
    };
    foundationalPapers: FoundationalPaperExtraction[];
  }) => void;
  initialData?: {
    rawObservation?: string;
    picoFields?: any;
    foundationalPapers?: FoundationalPaperExtraction[];
  };
}

export function PICOCaptureStep({ onComplete, initialData }: PICOCaptureStepProps) {
  // State
  const [rawObservation, setRawObservation] = useState(initialData?.rawObservation || '');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [personaExpanded, setPersonaExpanded] = useState(false);

  const [picoFields, setPicoFields] = useState<{
    population: PICOField;
    intervention: PICOField;
    comparison: PICOField;
    outcome: PICOField;
  }>(
    initialData?.picoFields || {
      population: { label: 'Population', value: '', icon: Users, grounded: 'pending' },
      intervention: { label: 'Intervention', value: '', icon: Syringe, grounded: 'pending' },
      comparison: { label: 'Comparison', value: '', icon: GitCompare, grounded: 'pending' },
      outcome: { label: 'Outcome', value: '', icon: Target, grounded: 'pending' },
    }
  );

  // Foundational Papers
  const [foundationalPapers, setFoundationalPapers] = useState<FoundationalPaperExtraction[]>(
    initialData?.foundationalPapers || []
  );
  const [isUploadingPaper, setIsUploadingPaper] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [synthesis, setSynthesis] = useState<Awaited<ReturnType<typeof synthesizeFoundationalPapers>> | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get Dr. Ariadne persona
  const ariadnePersona = getPersona('hypothesis-architect');

  // Extract PICO from raw observation
  const handleExtractPICO = async () => {
    if (!rawObservation.trim()) return;

    setIsProcessing(true);
    try {
      if (isGeminiConfigured()) {
        const extracted = await extractPICOWithGemini(rawObservation);
        setPicoFields({
          population: {
            label: 'Population',
            value: extracted.population || '',
            icon: Users,
            grounded: extracted.population ? 'found' : 'missing',
          },
          intervention: {
            label: 'Intervention',
            value: extracted.intervention || '',
            icon: Syringe,
            grounded: extracted.intervention ? 'found' : 'missing',
          },
          comparison: {
            label: 'Comparison',
            value: extracted.comparison || '',
            icon: GitCompare,
            grounded: extracted.comparison ? 'found' : 'missing',
          },
          outcome: {
            label: 'Outcome',
            value: extracted.outcome || '',
            icon: Target,
            grounded: extracted.outcome ? 'found' : 'missing',
          },
        });
      } else {
        // Fallback: simple keyword extraction
        const lower = rawObservation.toLowerCase();
        setPicoFields({
          population: {
            label: 'Population',
            value: lower.includes('patient') ? 'Patients (from text)' : '',
            icon: Users,
            grounded: 'pending',
          },
          intervention: {
            label: 'Intervention',
            value: '',
            icon: Syringe,
            grounded: 'pending',
          },
          comparison: {
            label: 'Comparison',
            value: '',
            icon: GitCompare,
            grounded: 'pending',
          },
          outcome: {
            label: 'Outcome',
            value: '',
            icon: Target,
            grounded: 'pending',
          },
        });
      }
    } catch (error) {
      console.error('PICO extraction error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle PDF upload
  const handlePDFUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are supported');
      return;
    }

    setIsUploadingPaper(true);
    setUploadError(null);

    try {
      if (!isGeminiConfigured()) {
        throw new Error('Gemini API not configured. Please add API key in settings.');
      }

      const extracted = await extractFromPDF(file);
      setFoundationalPapers(prev => [...prev, extracted]);
    } catch (error: any) {
      setUploadError(error.message || 'Failed to extract paper data');
    } finally {
      setIsUploadingPaper(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Synthesize papers
  const handleSynthesizePapers = async () => {
    if (foundationalPapers.length === 0) return;

    setIsSynthesizing(true);
    try {
      const result = await synthesizeFoundationalPapers(foundationalPapers);
      setSynthesis(result);

      // Auto-fill PICO from synthesis
      if (result.synthesizedPico) {
        setPicoFields({
          population: {
            label: 'Population',
            value: result.synthesizedPico.population || picoFields.population.value,
            icon: Users,
            grounded: 'found',
          },
          intervention: {
            label: 'Intervention',
            value: result.synthesizedPico.intervention || picoFields.intervention.value,
            icon: Syringe,
            grounded: 'found',
          },
          comparison: {
            label: 'Comparison',
            value: result.synthesizedPico.comparison || picoFields.comparison.value,
            icon: GitCompare,
            grounded: 'found',
          },
          outcome: {
            label: 'Outcome',
            value: result.synthesizedPico.outcome || picoFields.outcome.value,
            icon: Target,
            grounded: 'found',
          },
        });
      }
    } catch (error: any) {
      setUploadError(error.message || 'Failed to synthesize papers');
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Remove paper
  const handleRemovePaper = (index: number) => {
    setFoundationalPapers(prev => prev.filter((_, i) => i !== index));
  };

  // Handle completion
  const handleComplete = () => {
    onComplete({
      rawObservation,
      picoFields: {
        population: picoFields.population.value,
        intervention: picoFields.intervention.value,
        comparison: picoFields.comparison.value,
        outcome: picoFields.outcome.value,
      },
      foundationalPapers,
    });
  };

  const isComplete =
    rawObservation.trim().length >= 50 &&
    picoFields.population.value &&
    picoFields.intervention.value &&
    picoFields.outcome.value;

  return (
    <div className="space-y-6">
      {/* Dr. Ariadne Persona Card */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 overflow-hidden">
        <button
          onClick={() => setPersonaExpanded(!personaExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-purple-100/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-purple-900">{ariadnePersona?.name || 'Dr. Ariadne'}</h3>
              <p className="text-sm text-purple-700">{ariadnePersona?.role || 'Hypothesis Architect'}</p>
            </div>
          </div>
          {personaExpanded ? (
            <ChevronUp className="w-5 h-5 text-purple-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-purple-600" />
          )}
        </button>

        {personaExpanded && (
          <div className="px-6 pb-4 border-t border-purple-200 pt-4">
            <p className="text-sm text-purple-800">{ariadnePersona?.systemPrompt || 'I help structure your research hypothesis using the PICO framework.'}</p>
          </div>
        )}
      </div>

      {/* Step 1: Research Question */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Research Question
        </h3>

        <div className="space-y-4">
          <textarea
            value={rawObservation}
            onChange={e => setRawObservation(e.target.value)}
            placeholder="Describe your research question or clinical observation..."
            className="w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />

          <button
            onClick={handleExtractPICO}
            disabled={!rawObservation.trim() || isProcessing}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Extracting PICO...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Extract PICO Framework
              </>
            )}
          </button>
        </div>
      </div>

      {/* Step 2: PICO Fields */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">PICO Framework</h3>

        <div className="space-y-4">
          {Object.entries(picoFields).map(([key, field]) => {
            const Icon = field.icon;
            return (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {field.label}
                </label>
                <input
                  type="text"
                  value={field.value}
                  onChange={e =>
                    setPicoFields(prev => ({
                      ...prev,
                      [key]: { ...prev[key as keyof typeof prev], value: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 3: Foundational Papers */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          Foundational Papers
        </h3>

        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handlePDFUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingPaper}
            className="w-full px-6 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            {isUploadingPaper ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing PDF...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload PDF Paper
              </>
            )}
          </button>

          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              {uploadError}
            </div>
          )}

          {foundationalPapers.length > 0 && (
            <div className="space-y-2">
              {foundationalPapers.map((paper, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-blue-900">{paper.title}</div>
                    <div className="text-sm text-blue-700">{paper.authors}</div>
                  </div>
                  <button
                    onClick={() => handleRemovePaper(index)}
                    className="p-2 hover:bg-blue-200 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-blue-800" />
                  </button>
                </div>
              ))}

              <button
                onClick={handleSynthesizePapers}
                disabled={isSynthesizing}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSynthesizing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Synthesizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Synthesize Papers
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Complete Button */}
      <div className="flex items-center justify-between p-6 bg-slate-50 rounded-xl border border-slate-200">
        <div>
          <div className="font-medium text-slate-900">Ready to continue?</div>
          <div className="text-sm text-slate-600">
            {isComplete
              ? 'All required fields completed'
              : 'Complete research question and key PICO fields'}
          </div>
        </div>
        <button
          onClick={handleComplete}
          disabled={!isComplete}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          Complete & Continue
        </button>
      </div>
    </div>
  );
}
