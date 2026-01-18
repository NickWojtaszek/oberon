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

  // Transform initialData.picoFields if it exists (from protocol storage)
  // Protocol stores as {population: "string", intervention: "string"}
  // Component needs {population: {value: "string", ...}, intervention: {value: "string", ...}}
  const initialPicoFields = initialData?.picoFields
    ? {
        population: {
          label: 'Population',
          value: typeof initialData.picoFields.population === 'string'
            ? initialData.picoFields.population
            : (initialData.picoFields.population as any)?.value || '',
          icon: Users,
          grounded: 'found' as const,
        },
        intervention: {
          label: 'Intervention',
          value: typeof initialData.picoFields.intervention === 'string'
            ? initialData.picoFields.intervention
            : (initialData.picoFields.intervention as any)?.value || '',
          icon: Syringe,
          grounded: 'found' as const,
        },
        comparison: {
          label: 'Comparison',
          value: typeof initialData.picoFields.comparison === 'string'
            ? initialData.picoFields.comparison
            : (initialData.picoFields.comparison as any)?.value || '',
          icon: GitCompare,
          grounded: 'found' as const,
        },
        outcome: {
          label: 'Outcome',
          value: typeof initialData.picoFields.outcome === 'string'
            ? initialData.picoFields.outcome
            : (initialData.picoFields.outcome as any)?.value || '',
          icon: Target,
          grounded: 'found' as const,
        },
      }
    : {
        population: { label: 'Population', value: '', icon: Users, grounded: 'pending' },
        intervention: { label: 'Intervention', value: '', icon: Syringe, grounded: 'pending' },
        comparison: { label: 'Comparison', value: '', icon: GitCompare, grounded: 'pending' },
        outcome: { label: 'Outcome', value: '', icon: Target, grounded: 'pending' },
      };

  const [picoFields, setPicoFields] = useState<{
    population: PICOField;
    intervention: PICOField;
    comparison: PICOField;
    outcome: PICOField;
  }>(initialPicoFields);

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
        // Pass foundational papers to extraction to enrich PICO with paper context
        const extracted = await extractPICOWithGemini(rawObservation, foundationalPapers);
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

  // Handle multiple PDF upload
  const handlePDFUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Limit to 5 papers max
    const filesToProcess = Array.from(files).slice(0, 5);

    if (filesToProcess.some(file => file.type !== 'application/pdf')) {
      setUploadError('Only PDF files are supported');
      return;
    }

    setIsUploadingPaper(true);
    setUploadError(null);

    try {
      if (!isGeminiConfigured()) {
        throw new Error('Gemini API not configured. Please add API key in settings.');
      }

      // Process papers sequentially (avoid rate limits)
      const extractedPapers: FoundationalPaperExtraction[] = [];
      for (const file of filesToProcess) {
        try {
          const extracted = await extractFromPDF(file);
          extractedPapers.push(extracted);
        } catch (error) {
          console.error(`Failed to extract ${file.name}:`, error);
          // Continue with other files
        }
      }

      setFoundationalPapers(prev => [...prev, ...extractedPapers]);

      if (extractedPapers.length < filesToProcess.length) {
        setUploadError(`Successfully uploaded ${extractedPapers.length} of ${filesToProcess.length} papers`);
      }
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
        population: (picoFields.population.value || '').toString(),
        intervention: (picoFields.intervention.value || '').toString(),
        comparison: (picoFields.comparison.value || '').toString(),
        outcome: (picoFields.outcome.value || '').toString(),
      },
      foundationalPapers,
    });
  };

  const isComplete =
    rawObservation.trim().length >= 50 &&
    (picoFields.population.value || '').toString().trim().length > 0 &&
    (picoFields.intervention.value || '').toString().trim().length > 0 &&
    (picoFields.outcome.value || '').toString().trim().length > 0;

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
          Step 1: Research Question
        </h3>

        <div className="space-y-4">
          <textarea
            value={rawObservation}
            onChange={e => setRawObservation(e.target.value)}
            placeholder="Describe your research question or clinical observation..."
            className="w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />

          <p className="text-sm text-slate-600">
            Describe your research question in detail. Upload foundational papers below to enhance PICO extraction.
          </p>
        </div>
      </div>

      {/* Step 2: Foundational Papers */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          Step 2: Foundational Papers (Optional)
        </h3>

        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Upload relevant research papers to enhance PICO extraction with evidence-based context.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
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
                Processing PDFs...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload PDF Papers (max 5)
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
            </div>
          )}
        </div>
      </div>

      {/* Step 3: Synthesize Papers (only shown if papers uploaded) */}
      {foundationalPapers.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Step 3: Synthesize Papers
          </h3>

          <p className="text-sm text-slate-600 mb-4">
            Synthesize {foundationalPapers.length} uploaded paper{foundationalPapers.length !== 1 ? 's' : ''} to extract common PICO patterns and methodology insights.
          </p>

          <button
            onClick={handleSynthesizePapers}
            disabled={isSynthesizing}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSynthesizing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Synthesizing Papers...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Synthesize Papers
              </>
            )}
          </button>

          {synthesis && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm text-green-800">
                <strong>✓ Synthesis Complete</strong> - Papers analyzed and ready to inform PICO extraction
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Extract PICO Framework */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Step {foundationalPapers.length > 0 ? '4' : '3'}: Extract PICO Framework
        </h3>

        <p className="text-sm text-slate-600 mb-4">
          {foundationalPapers.length > 0
            ? 'Extract PICO framework from your research question, enhanced with insights from uploaded papers.'
            : 'Extract PICO framework from your research question using AI.'}
        </p>

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
              {foundationalPapers.length > 0 && ` (with ${foundationalPapers.length} paper${foundationalPapers.length !== 1 ? 's' : ''})`}
            </>
          )}
        </button>
      </div>

      {/* Step 5: PICO Fields */}
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
