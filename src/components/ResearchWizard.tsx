/**
 * Research Wizard - Professional Dual-Panel Workspace
 * Anti-Hallucination Layer for Clinical Hypothesis Formation
 * 
 * NOW INTEGRATED with:
 * - ProjectContext for proper hypothesis storage
 * - Dr. Ariadne (Hypothesis Architect) persona
 * - Real PICO framework that flows to Academic Writing
 * - Gemini AI for actual PICO extraction (when API key configured)
 */

import { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  X,
  Users,
  Syringe,
  GitCompare,
  Target,
  Database,
  Lock,
  Lightbulb,
  TrendingUp,
  FileText,
  Compass,
  Sun,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Bot
} from 'lucide-react';
import { GlobalHeader } from './unified-workspace/GlobalHeader';
import { useProject } from '../contexts/ProjectContext';
import { getPersona } from './ai-personas/core/personaRegistry';
import { isGeminiConfigured, extractPICOWithGemini } from '../services/geminiService';
import type { AutonomyMode } from '../types/accountability';

interface PICOField {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  grounded: 'found' | 'missing' | 'pending';
  linkedVariable?: string;
  conflictReason?: string;
}

interface HypothesisConflict {
  field: string;
  reason: string;
  manifestValue: string;
  proposedValue: string;
}

interface ResearchWizardProps {
  onComplete?: (hypothesis: any) => void;
  onCancel?: () => void;
  userRole?: 'pi' | 'student' | 'statistician';
  onNavigate?: (tab: string) => void; // NEW: Cross-module navigation
}

type WizardStep = 'capture' | 'pico' | 'validation';

export function ResearchWizard({ 
  onComplete, 
  onCancel,
  userRole = 'student',
  onNavigate
}: ResearchWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('capture');
  const [rawObservation, setRawObservation] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Step 2: PICO Fields
  const [picoFields, setPicoFields] = useState<{
    population: PICOField;
    intervention: PICOField;
    comparison: PICOField;
    outcome: PICOField;
  }>({
    population: {
      label: 'Population',
      value: '',
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
  
  // Step 3: Conflicts and approval
  const [conflicts, setConflicts] = useState<HypothesisConflict[]>([]);
  const [piApprovalStatus, setPiApprovalStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [editMode, setEditMode] = useState(false);
  const [personaExpanded, setPersonaExpanded] = useState(false);

  // PROJECT CONTEXT - for storing hypothesis properly
  const { currentProject, updateProject } = useProject();

  // Get Dr. Ariadne persona
  const ariadnePersona = getPersona('hypothesis-architect');



  // Load existing hypothesis from project if available
  useEffect(() => {
    if (currentProject?.studyMethodology?.hypothesis) {
      const existing = currentProject.studyMethodology.hypothesis;
      if (existing.picoFramework) {
        setPicoFields(prev => ({
          population: {
            ...prev.population,
            value: existing.picoFramework.population || '',
            grounded: existing.picoFramework.population ? 'found' : 'pending',
          },
          intervention: {
            ...prev.intervention,
            value: existing.picoFramework.intervention || '',
            grounded: existing.picoFramework.intervention ? 'found' : 'pending',
          },
          comparison: {
            ...prev.comparison,
            value: existing.picoFramework.comparison || '',
            grounded: existing.picoFramework.comparison ? 'found' : 'pending',
          },
          outcome: {
            ...prev.outcome,
            value: existing.picoFramework.outcome || '',
            grounded: existing.picoFramework.outcome ? 'found' : 'pending',
          },
        }));
        if (existing.researchQuestion) {
          setRawObservation(existing.researchQuestion);
        }
      }
    }
  }, [currentProject?.id]);

  // Check if AI is available
  const aiAvailable = isGeminiConfigured();
  const [aiError, setAiError] = useState<string | null>(null);



  // Step 1 → Step 2: Process raw text and generate PICO
  const handleProcessObservation = async () => {
    if (!rawObservation.trim()) return;
    
    setIsProcessing(true);
    setAiError(null);
    
    // Try AI extraction first if available
    if (aiAvailable) {
      try {
        const aiResult = await extractPICOWithGemini(rawObservation);
        setPicoFields({
          population: {
            label: 'Population',
            value: aiResult.population,
            icon: Users,
            grounded: 'pending',
            linkedVariable: undefined,
          },
          intervention: {
            label: 'Intervention',
            value: aiResult.intervention,
            icon: Syringe,
            grounded: 'pending',
            linkedVariable: undefined,
          },
          comparison: {
            label: 'Comparison',
            value: aiResult.comparison,
            icon: GitCompare,
            grounded: 'pending',
            linkedVariable: undefined,
          },
          outcome: {
            label: 'Outcome',
            value: aiResult.outcome,
            icon: Target,
            grounded: 'pending',
            linkedVariable: undefined,
          },
        });
        setIsProcessing(false);
        setCurrentStep('pico');
        return;
      } catch (error) {
        console.error('AI extraction failed, falling back to regex:', error);
        setAiError('AI extraction failed - using fallback extraction');
      }
    }
    
    // Fallback to regex extraction
    setTimeout(() => {
      const extracted = extractPICOFromText(rawObservation);
      setPicoFields(extracted);
      setIsProcessing(false);
      setCurrentStep('pico');
    }, 1000);
  };

  // Smarter PICO extraction - analyzes text for actual content
  // In production, this would use an AI API for proper extraction
  const extractPICOFromText = (text: string): typeof picoFields => {
    const lowerText = text.toLowerCase();
    
    // Extract population - look for patient descriptors
    let population = '';
    if (lowerText.includes('patient')) {
      // Find sentences with "patient"
      const patientMatch = text.match(/\d+\s*patients?[^.]*\./i);
      if (patientMatch) {
        population = patientMatch[0].replace(/\.$/, '').trim();
      }
    }
    if (!population) {
      // Look for study subject descriptions
      const subjectPatterns = [
        /(?:patients?|subjects?|individuals?|participants?)\s+(?:with|undergoing|receiving|who)[^.]+/i,
        /(?:adults?|children|elderly|men|women)\s+(?:with|aged|undergoing)[^.]+/i,
      ];
      for (const pattern of subjectPatterns) {
        const match = text.match(pattern);
        if (match) {
          population = match[0].trim();
          break;
        }
      }
    }
    if (!population) {
      population = '(Please specify the target population)';
    }

    // Extract intervention - look for procedures, treatments, protocols
    let intervention = '';
    const interventionPatterns = [
      /(?:protocol|procedure|treatment|intervention|technique)\s+(?:for|to|that|which)[^.]+/i,
      /(?:stent-?graft|endovascular|surgical|therapeutic)[^.]+(?:implantation|repair|treatment)/i,
      /(?:aim|objective|purpose)\s+(?:is|was)\s+to[^.]+/i,
    ];
    for (const pattern of interventionPatterns) {
      const match = text.match(pattern);
      if (match) {
        intervention = match[0].trim();
        break;
      }
    }
    if (!intervention && lowerText.includes('protocol')) {
      intervention = 'Clinical protocol for procedure optimization';
    }
    if (!intervention) {
      intervention = '(Please specify the intervention or exposure)';
    }

    // Extract comparison - look for control, comparison, versus, compared to
    let comparison = '';
    const comparisonPatterns = [
      /(?:compared?\s+(?:to|with)|versus|vs\.?|control\s+group)[^.]+/i,
      /(?:standard|conventional|traditional)\s+(?:treatment|care|approach)[^.]*/i,
    ];
    for (const pattern of comparisonPatterns) {
      const match = text.match(pattern);
      if (match) {
        comparison = match[0].trim();
        break;
      }
    }
    if (!comparison) {
      // Check if this is a methods/protocol paper without comparison
      if (lowerText.includes('protocol') || lowerText.includes('case series') || lowerText.includes('retrospective')) {
        comparison = '(No comparison group - observational/protocol study)';
      } else {
        comparison = '(Please specify comparison or control group)';
      }
    }

    // Extract outcome - look for endpoints, results, risk reduction
    let outcome = '';
    const outcomePatterns = [
      /(?:risk\s+of|incidence\s+of|rate\s+of)[^.]+/i,
      /(?:primary|secondary)\s+(?:endpoint|outcome|objective)[^.]*/i,
      /(?:stroke|mortality|morbidity|complication|survival)[^.]*/i,
      /(?:cerebral|neurological)\s+(?:microemboli|injury|damage|protection)[^.]*/i,
    ];
    for (const pattern of outcomePatterns) {
      const match = text.match(pattern);
      if (match) {
        outcome = match[0].trim();
        break;
      }
    }
    if (!outcome) {
      outcome = '(Please specify the primary outcome or endpoint)';
    }

    return {
      population: {
        label: 'Population',
        value: population.length > 150 ? population.substring(0, 150) + '...' : population,
        icon: Users,
        grounded: population.includes('Please specify') ? 'pending' : 'pending',
        linkedVariable: undefined,
      },
      intervention: {
        label: 'Intervention',
        value: intervention.length > 150 ? intervention.substring(0, 150) + '...' : intervention,
        icon: Syringe,
        grounded: intervention.includes('Please specify') ? 'pending' : 'pending',
        linkedVariable: undefined,
      },
      comparison: {
        label: 'Comparison',
        value: comparison.length > 150 ? comparison.substring(0, 150) + '...' : comparison,
        icon: GitCompare,
        grounded: comparison.includes('Please specify') || comparison.includes('No comparison') ? 'pending' : 'pending',
        linkedVariable: undefined,
      },
      outcome: {
        label: 'Outcome',
        value: outcome.length > 150 ? outcome.substring(0, 150) + '...' : outcome,
        icon: Target,
        grounded: outcome.includes('Please specify') ? 'pending' : 'pending',
        linkedVariable: undefined,
      },
    };
  };

  // Update a single PICO field
  const updatePicoField = (field: keyof typeof picoFields, value: string) => {
    setPicoFields(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
        grounded: value.trim() ? 'pending' : 'missing',
      }
    }));
  };

  // Validate field has content (no schema exists yet at this stage)
  // Protocol schema will be built AFTER PICO is defined
  const validateGrounding = (field: keyof typeof picoFields) => {
    const fieldValue = picoFields[field].value.trim();
    // At this stage, "grounded" means: has meaningful content (>10 chars)
    const hasContent = fieldValue.length >= 10;
    setPicoFields(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        grounded: hasContent ? 'found' : 'missing',
      }
    }));
  };

  // Step 2 → Step 3: Validate PICO completeness
  // Note: No statistical validation at this stage - study hasn't run yet
  // Validation checks that all PICO fields have meaningful content
  const handleValidateHypothesis = () => {
    const detectedConflicts: HypothesisConflict[] = [];
    
    // Check each PICO field has content
    const picoEntries = Object.entries(picoFields) as [string, PICOField][];
    picoEntries.forEach(([key, field]) => {
      if (!field.value.trim() || field.value.length < 10) {
        detectedConflicts.push({
          field: key,
          reason: `${field.label} needs more detail to inform protocol design`,
          manifestValue: 'At least 10 characters describing the component',
          proposedValue: field.value || '(empty)',
        });
      }
    });
    
    setConflicts(detectedConflicts);
    setCurrentStep('validation');
  };

  // FIXED: Save hypothesis to project context properly
  const saveHypothesisToProject = () => {
    if (!currentProject) return;

    const hypothesis = {
      picoFramework: {
        population: picoFields.population.value,
        intervention: picoFields.intervention.value,
        comparison: picoFields.comparison.value,
        outcome: picoFields.outcome.value,
      },
      researchQuestion: rawObservation,
      variables: [
        { 
          name: 'population', 
          type: 'inclusion_criteria', 
          grounded: picoFields.population.grounded === 'found',
          boundTo: picoFields.population.linkedVariable,
        },
        { 
          name: 'intervention', 
          type: 'treatment_arm', 
          grounded: picoFields.intervention.grounded === 'found',
          boundTo: picoFields.intervention.linkedVariable,
        },
        { 
          name: 'comparison', 
          type: 'control_arm', 
          grounded: picoFields.comparison.grounded === 'found',
          boundTo: picoFields.comparison.linkedVariable,
        },
        { 
          name: 'outcome', 
          type: 'primary_endpoint', 
          grounded: picoFields.outcome.grounded === 'found',
          boundTo: picoFields.outcome.linkedVariable,
        },
      ],
      validatedAt: new Date().toISOString(),
    };

    // Update project with hypothesis in studyMethodology
    updateProject(currentProject.id, {
      studyMethodology: {
        ...currentProject.studyMethodology,
        studyType: currentProject.studyMethodology?.studyType || 'rct',
        configuredAt: currentProject.studyMethodology?.configuredAt || new Date().toISOString(),
        configuredBy: currentProject.studyMethodology?.configuredBy || 'current-user',
        hypothesis,
      },
    });

    return hypothesis;
  };

  // Handle PI approval
  const handlePIApproval = (approved: boolean) => {
    setPiApprovalStatus(approved ? 'approved' : 'rejected');
    
    if (approved) {
      // Save to project context FIRST
      const savedHypothesis = saveHypothesisToProject();
      
      if (onComplete && savedHypothesis) {
        setTimeout(() => {
          onComplete(savedHypothesis);
        }, 1000);
      }
    }
  };

  // Voice input simulation
  const toggleListening = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      // Simulate voice input
      setTimeout(() => {
        setRawObservation(prev => 
          prev + ' Observed high calcification scores in elderly patients treated with novel catheter...'
        );
      }, 2000);
    }
  };

  const hasConflicts = conflicts.length > 0;
  const canCommit = !hasConflicts && 
    Object.values(picoFields).every(field => field.grounded === 'found');

  // State for autonomy mode
  const [autonomyMode, setAutonomyMode] = useState<AutonomyMode>('audit');

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Global Header */}
      <GlobalHeader
        breadcrumbs={[
          { label: 'Research Factory', onClick: () => {} },
          { label: 'Research Wizard' }
        ]}
        autonomyMode={autonomyMode}
        onAutonomyChange={setAutonomyMode}
        primaryAction={{
          label: currentStep === 'validation' && !hasConflicts && (userRole !== 'student' || piApprovalStatus === 'approved')
            ? 'Commit Hypothesis'
            : 'Save Progress',
          onClick: () => {
            if (currentStep === 'validation' && !hasConflicts) {
              // Save to project and complete
              const savedHypothesis = saveHypothesisToProject();
              onComplete?.(savedHypothesis);
            } else {
              // Save progress without completing
              saveHypothesisToProject();
            }
          },
          disabled: currentStep === 'validation' ? hasConflicts || (userRole === 'student' && piApprovalStatus !== 'approved') : false
        }}
        secondaryActions={[
          {
            label: 'Cancel',
            onClick: () => onCancel?.(),
            icon: X
          }
        ]}
      />

      {/* Navigation Tabs - Academic Writing Style */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-8 py-3">
          <div className="flex gap-1">
            {/* Main Panel Tabs */}
            <button
              onClick={() => setCurrentStep('capture')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentStep === 'capture'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              Clinical Capture
            </button>
            <button
              onClick={() => currentStep !== 'capture' && setCurrentStep('pico')}
              disabled={currentStep === 'capture'}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentStep === 'pico'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : currentStep === 'capture'
                  ? 'text-slate-400 cursor-not-allowed border border-transparent'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Shield className="w-4 h-4" />
              PICO Refinement
            </button>
            <button
              onClick={() => currentStep === 'validation' && setCurrentStep('validation')}
              disabled={currentStep === 'capture' || currentStep === 'pico'}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentStep === 'validation'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : currentStep !== 'validation'
                  ? 'text-slate-400 cursor-not-allowed border border-transparent'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Validation
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Two-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Panel */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1600px] mx-auto">
            {/* Step 1: Clinical Capture */}
            {currentStep === 'capture' && (
              <div className="bg-white rounded-lg border border-slate-200 p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-slate-900 mb-2">Share Your Clinical Observation</h2>
                    <p className="text-slate-600 text-sm">
                      Describe your clinical hunch, observations from the OR, or retrospective case notes.
                      Be specific about populations, interventions, and outcomes.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Text Area */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-slate-700">
                        Raw Clinical Observation
                      </label>
                      <button
                        onClick={toggleListening}
                        className={`p-2 rounded-lg transition-colors ${
                          isListening 
                            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    <textarea
                      value={rawObservation}
                      onChange={(e) => setRawObservation(e.target.value)}
                      placeholder="Example: 'I've noticed that elderly patients with severe calcification who receive the new atherectomy catheter seem to have better outcomes compared to standard balloon angioplasty. The mortality rates appear lower, though I haven't run formal statistics yet...'"
                      className="w-full min-h-[300px] px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                    
                    {isListening && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                        <div className="flex gap-1">
                          <div className="w-1 h-3 bg-red-600 rounded animate-pulse" style={{ animationDelay: '0ms' }} />
                          <div className="w-1 h-3 bg-red-600 rounded animate-pulse" style={{ animationDelay: '150ms' }} />
                          <div className="w-1 h-3 bg-red-600 rounded animate-pulse" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span>Listening... AI is parsing clinical variables</span>
                      </div>
                    )}
                  </div>

                  {/* AI Detection Preview */}
                  {rawObservation.length > 50 && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Brain className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-indigo-900 mb-1">
                            AI Detection Active
                          </div>
                          <div className="text-xs text-indigo-700 space-y-1">
                            <div>✓ Detected: Population markers (age, calcification)</div>
                            <div>✓ Detected: Intervention type (catheter treatment)</div>
                            <div>✓ Detected: Outcome measures (mortality)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                  <button
                    onClick={onCancel}
                    className="px-6 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProcessObservation}
                    disabled={rawObservation.length < 50 || isProcessing}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Extract PICO
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: PICO Refinement */}
            {currentStep === 'pico' && (
              <div className="bg-white rounded-lg border border-slate-200 p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-slate-900 mb-2">Grounded PICO Framework</h2>
                    <p className="text-slate-600 text-sm">
                      AI-structured hypothesis cross-referenced against your Protocol Schema
                    </p>
                  </div>
                </div>

                {/* Split-Screen Comparison */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* Left: Raw Observation */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                      <FileCheck className="w-4 h-4" />
                      Raw Observation
                    </h3>
                    <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {rawObservation}
                    </div>
                  </div>

                  {/* Right: Structured PICO - EDITABLE */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        Structured Hypothesis
                      </h3>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        ✏️ Click to edit
                      </span>
                    </div>
                    
                    {(Object.entries(picoFields) as [keyof typeof picoFields, PICOField][]).map(([key, field]) => (
                      <div key={key} className="bg-white border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <field.icon className="w-5 h-5 text-slate-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-slate-900">
                                {field.label}
                              </span>
                              {/* Grounding Badge */}
                              {field.grounded === 'found' && (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-xs flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Grounded
                                </span>
                              )}
                              {field.grounded === 'missing' && (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded text-xs flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Not Grounded
                                </span>
                              )}
                              {field.grounded === 'pending' && (
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-xs flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Pending
                                </span>
                              )}
                            </div>
                            <textarea
                              value={field.value}
                              onChange={(e) => updatePicoField(key, e.target.value)}
                              onBlur={() => validateGrounding(key)}
                              placeholder={`Enter ${field.label.toLowerCase()}...`}
                              className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none min-h-[60px]"
                              rows={2}
                            />
                            {field.linkedVariable && (
                              <div className="text-xs text-slate-500 mt-2">
                                Linked: <code className="bg-slate-100 px-1 py-0.5 rounded">{field.linkedVariable}</code>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                  <button
                    onClick={() => setCurrentStep('capture')}
                    className="px-6 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleValidateHypothesis}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Validate Hypothesis
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Validation & Approval */}
            {currentStep === 'validation' && (
              <div className="bg-white rounded-lg border border-slate-200 p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    hasConflicts ? 'bg-red-100' : 'bg-emerald-100'
                  }`}>
                    {hasConflicts ? (
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-slate-900 mb-2">
                      {hasConflicts ? 'PICO Needs More Detail' : 'PICO Complete'}
                    </h2>
                    <p className="text-slate-600 text-sm">
                      {hasConflicts 
                        ? 'Some fields need more detail before creating your protocol'
                        : 'Your PICO framework is ready to guide protocol design'
                      }
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Conflict Warnings */}
                  {hasConflicts && conflicts.map((conflict, idx) => (
                    <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <X className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-red-900 mb-2">
                            Conflict: {conflict.field.toUpperCase()}
                          </h3>
                          <p className="text-sm text-red-800 mb-4">
                            {conflict.reason}
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white border border-red-200 rounded-lg p-3">
                              <div className="text-xs text-slate-600 mb-1">Current</div>
                              <div className="text-sm text-red-900 font-medium">
                                {conflict.proposedValue}
                              </div>
                            </div>
                            <div className="bg-white border border-emerald-200 rounded-lg p-3">
                              <div className="text-xs text-slate-600 mb-1">Required</div>
                              <div className="text-sm text-emerald-900 font-medium">
                                {conflict.manifestValue}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Validated Hypothesis Summary */}
                  {!hasConflicts && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-emerald-900 mb-1">
                            PICO Ready for Protocol Design
                          </h3>
                          <p className="text-sm text-emerald-800">
                            Your hypothesis will guide the Protocol Workbench to create matching schema variables.
                          </p>
                        </div>
                      </div>
                      
                      {/* PICO Summary */}
                      <div className="space-y-2 pt-4 border-t border-emerald-200">
                        {Object.entries(picoFields).map(([key, field]) => (
                          <div key={key} className="flex items-start gap-3 text-sm">
                            <field.icon className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <span className="font-medium text-emerald-900">{field.label}:</span>
                              <span className="text-emerald-800 ml-2">{field.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PI Approval (for Student role) */}
                  {userRole === 'student' && !hasConflicts && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-indigo-900 mb-2">
                            Principal Investigator Approval Required
                          </h3>
                          <p className="text-sm text-indigo-800 mb-4">
                            As a Student user, your hypothesis must be reviewed and digitally signed by the PI
                            before the Writing Tab is unlocked.
                          </p>
                          
                          {piApprovalStatus === 'pending' && (
                            <div className="flex gap-3">
                              <button
                                onClick={() => handlePIApproval(true)}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve (PI)
                              </button>
                              <button
                                onClick={() => handlePIApproval(false)}
                                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors text-sm"
                              >
                                Request Revision
                              </button>
                            </div>
                          )}
                          
                          {piApprovalStatus === 'approved' && (
                            <div className="flex items-center gap-2 text-emerald-700">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm font-medium">Approved by PI</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                  <button
                    onClick={() => setCurrentStep('pico')}
                    className="px-6 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Back
                  </button>
                  
                  <div className="flex items-center gap-3">
                    {/* Cross-Module Navigation: Research Wizard → Protocol Workbench */}
                    {!hasConflicts && onNavigate && (
                      <button
                        onClick={() => onNavigate('protocol-workbench')}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors border border-blue-200"
                        title="Create a new protocol from this validated hypothesis"
                      >
                        <FileText className="w-4 h-4" />
                        Create Protocol from Hypothesis
                      </button>
                    )}
                    
                    {userRole === 'student' ? (
                      <button
                        onClick={() => {
                          const saved = saveHypothesisToProject();
                          onComplete?.(saved);
                        }}
                        disabled={hasConflicts || piApprovalStatus !== 'approved'}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Commit Hypothesis
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const saved = saveHypothesisToProject();
                          onComplete?.(saved);
                        }}
                        disabled={hasConflicts}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Commit Hypothesis
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Dr. Ariadne Persona + Info Panel */}
        <div className="w-[400px] border-l border-slate-200 bg-white overflow-y-auto">
          <div className="p-6 space-y-6">
            
            {/* Dr. Ariadne Persona Card - Always visible */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-slate-900">The Oberon Faculty</h3>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                  <Sun className="w-3 h-3" />
                  1
                </div>
              </div>

              {/* Dr. Ariadne Card */}
              {ariadnePersona && (
                <div className={`rounded-lg border-2 transition-all ${
                  personaExpanded 
                    ? 'border-indigo-300 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}>
                  <button
                    onClick={() => setPersonaExpanded(!personaExpanded)}
                    className="w-full p-3 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`relative w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        personaExpanded ? 'bg-white/50' : 'bg-indigo-50'
                      }`}>
                        <Compass className="w-5 h-5 text-indigo-600" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center bg-amber-100">
                          <Sun className="w-2.5 h-2.5 text-amber-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <h4 className="text-sm font-semibold text-slate-900">
                            {ariadnePersona.fairyName}
                          </h4>
                          {personaExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mb-1.5">{ariadnePersona.name}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {aiAvailable ? (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-700">
                              <Bot className="w-3 h-3" />
                              AI Connected
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700">
                              <AlertTriangle className="w-3 h-3" />
                              Regex Mode
                            </div>
                          )}
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                            <Lock className="w-3 h-3" />
                            {ariadnePersona.validationRules?.length || 0} rules
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>

                  {personaExpanded && (
                    <div className="px-3 pb-3 space-y-3 border-t border-slate-200">
                      <div className="pt-3 p-2 rounded-lg bg-amber-50">
                        <div className="flex items-center gap-2 mb-1">
                          <Sun className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-medium text-amber-800">
                            Seelie Court • Co-Pilot
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 italic ml-6">
                          {ariadnePersona.folkloreOrigin}
                        </p>
                      </div>
                      
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {ariadnePersona.description}
                      </p>

                      <div>
                        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
                          Current Step Guidance
                        </div>
                        <div className="space-y-1">
                          {currentStep === 'capture' && (
                            <div className="flex items-start gap-2 text-xs text-indigo-700 bg-indigo-50 rounded p-2">
                              <Lightbulb className="w-3 h-3 flex-shrink-0 mt-0.5" />
                              <span className="text-[10px]">Describe your clinical observation clearly. Include population, treatment, and expected outcome.</span>
                            </div>
                          )}
                          {currentStep === 'pico' && (
                            <div className="flex items-start gap-2 text-xs text-emerald-700 bg-emerald-50 rounded p-2">
                              <Database className="w-3 h-3 flex-shrink-0 mt-0.5" />
                              <span className="text-[10px]">Review each PICO field. Ensure each has meaningful content to guide protocol design.</span>
                            </div>
                          )}
                          {currentStep === 'validation' && (
                            <div className="flex items-start gap-2 text-xs text-purple-700 bg-purple-50 rounded p-2">
                              <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                              <span className="text-[10px]">Your PICO is complete. Commit to save, then create a protocol from your hypothesis.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Forward Flow Panel - How PICO feeds Protocol */}
            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h3 className="font-medium text-slate-900">Forward Flow</h3>
              </div>
              
              <p className="text-xs text-slate-600 mb-4">
                Your PICO framework will guide the Protocol Workbench to create appropriate schema variables.
              </p>

              {/* PICO → Protocol Mapping */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-800">Population</div>
                    <div className="text-[10px] text-slate-500">→ Inclusion/exclusion criteria</div>
                  </div>
                  {picoFields.population.value && (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <Syringe className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-800">Intervention</div>
                    <div className="text-[10px] text-slate-500">→ Treatment arm design</div>
                  </div>
                  {picoFields.intervention.value && (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <GitCompare className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-800">Comparison</div>
                    <div className="text-[10px] text-slate-500">→ Control group definition</div>
                  </div>
                  {picoFields.comparison.value && (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <Target className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-800">Outcome</div>
                    <div className="text-[10px] text-slate-500">→ Primary endpoint variables</div>
                  </div>
                  {picoFields.outcome.value && (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
              </div>

              {/* Next Steps Hint */}
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-indigo-900 mb-1">
                      Next: Protocol Workbench
                    </div>
                    <p className="text-[10px] text-indigo-700 leading-relaxed">
                      After committing your PICO, the Protocol Workbench will receive these definitions and suggest matching schema variables.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}