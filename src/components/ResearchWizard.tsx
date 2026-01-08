/**
 * Research Wizard - Professional Dual-Panel Workspace
 * Anti-Hallucination Layer for Clinical Hypothesis Formation
 * Inspired by Academic Writing layout
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
  Brain,
  Lock,
  Pencil,
  FileCheck,
  Lightbulb,
  Shield,
  TrendingUp,
  Activity,
  FileText,
  Info,
  BarChart3
} from 'lucide-react';
import { GlobalHeader } from './unified-workspace/GlobalHeader';
import { ModulePersonaPanel } from './ai-personas/ui/ModulePersonaPanel';
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
type SidebarView = 'manifest' | 'statistics' | 'guide';

export function ResearchWizard({ 
  onComplete, 
  onCancel,
  userRole = 'student',
  onNavigate
}: ResearchWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('capture');
  const [activeSidebarView, setActiveSidebarView] = useState<SidebarView>('manifest');
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

  // Mock protocol schema variables (would come from actual protocol)
  const mockProtocolVariables = [
    'patient_age',
    'calcification_score',
    'mortality_rate',
    'intervention_type',
    'control_group',
    'primary_endpoint',
    'cohort_definition'
  ];

  // Mock statistical manifest data
  const mockStatisticalManifest = {
    mortality_rate: { pValue: 0.45, significant: false },
    calcification_score: { pValue: 0.02, significant: true },
    intervention_effectiveness: { pValue: 0.03, significant: true }
  };

  // Step 1 → Step 2: Process raw text and generate PICO
  const handleProcessObservation = () => {
    if (!rawObservation.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Mock PICO extraction
      const extracted = extractPICOFromText(rawObservation);
      setPicoFields(extracted);
      setIsProcessing(false);
      setCurrentStep('pico');
    }, 2000);
  };

  // Mock PICO extraction (in production, this would use real AI)
  const extractPICOFromText = (text: string): typeof picoFields => {
    const lowerText = text.toLowerCase();
    
    return {
      population: {
        label: 'Population',
        value: lowerText.includes('age') 
          ? 'Adult patients aged 65+ with severe calcification'
          : 'Adult patients with cardiovascular conditions',
        icon: Users,
        grounded: mockProtocolVariables.includes('patient_age') ? 'found' : 'missing',
        linkedVariable: 'patient_age',
      },
      intervention: {
        label: 'Intervention',
        value: lowerText.includes('catheter') 
          ? 'Atherectomy catheter treatment'
          : 'Standard intervention protocol',
        icon: Syringe,
        grounded: mockProtocolVariables.includes('intervention_type') ? 'found' : 'missing',
        linkedVariable: 'intervention_type',
      },
      comparison: {
        label: 'Comparison',
        value: 'Standard balloon angioplasty',
        icon: GitCompare,
        grounded: mockProtocolVariables.includes('control_group') ? 'found' : 'missing',
        linkedVariable: 'control_group',
      },
      outcome: {
        label: 'Outcome',
        value: lowerText.includes('mortality') 
          ? '30-day mortality rate'
          : 'Primary clinical endpoint',
        icon: Target,
        grounded: mockProtocolVariables.includes('primary_endpoint') ? 'found' : 'missing',
        linkedVariable: 'primary_endpoint',
      },
    };
  };

  // Step 2 → Step 3: Validate against manifest
  const handleValidateHypothesis = () => {
    const detectedConflicts: HypothesisConflict[] = [];
    
    // Check if outcome claims significance where data shows otherwise
    if (picoFields.outcome.value.toLowerCase().includes('mortality')) {
      const manifestData = mockStatisticalManifest.mortality_rate;
      if (!manifestData.significant && rawObservation.toLowerCase().includes('significant')) {
        detectedConflicts.push({
          field: 'outcome',
          reason: 'Hypothesis claims significant mortality difference, but statistical manifest shows p=0.45 (not significant)',
          manifestValue: 'p=0.45 (not significant)',
          proposedValue: 'Significant mortality reduction',
        });
      }
    }
    
    setConflicts(detectedConflicts);
    setCurrentStep('validation');
  };

  // Handle PI approval
  const handlePIApproval = (approved: boolean) => {
    setPiApprovalStatus(approved ? 'approved' : 'rejected');
    
    if (approved && onComplete) {
      // Package the refined hypothesis
      const hypothesis = {
        rawObservation,
        pico: picoFields,
        conflicts,
        approvedBy: 'PI',
        approvedAt: new Date().toISOString(),
        conceptualFoundation: {
          population: picoFields.population.value,
          intervention: picoFields.intervention.value,
          comparison: picoFields.comparison.value,
          outcome: picoFields.outcome.value,
        }
      };
      
      setTimeout(() => {
        onComplete(hypothesis);
      }, 1000);
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
              onComplete?.({ pico: picoFields, rawObservation });
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

            {/* Divider */}
            <div className="w-px bg-slate-200 mx-2"></div>

            {/* Sidebar View Tabs */}
            <button
              onClick={() => setActiveSidebarView('manifest')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSidebarView === 'manifest'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Activity className="w-4 h-4" />
              Manifest
            </button>
            <button
              onClick={() => setActiveSidebarView('statistics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSidebarView === 'statistics'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Statistics
            </button>
            <button
              onClick={() => setActiveSidebarView('guide')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSidebarView === 'guide'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Info className="w-4 h-4" />
              Guide
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

                  {/* Right: Structured PICO */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      Structured Hypothesis
                    </h3>
                    
                    {Object.entries(picoFields).map(([key, field]) => (
                      <div key={key} className="bg-white border border-slate-200 rounded-lg p-4">
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
                                  Found
                                </span>
                              )}
                              {field.grounded === 'missing' && (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded text-xs flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Missing
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-700 mb-2">
                              {field.value}
                            </p>
                            {field.linkedVariable && (
                              <div className="text-xs text-slate-500">
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
                      {hasConflicts ? 'Data Conflicts Detected' : 'Hypothesis Validated'}
                    </h2>
                    <p className="text-slate-600 text-sm">
                      {hasConflicts 
                        ? 'Your hypothesis conflicts with the Statistical Manifest'
                        : 'All fields grounded in Protocol Schema and Statistical Manifest'
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
                              <div className="text-xs text-slate-600 mb-1">Your Hypothesis</div>
                              <div className="text-sm text-red-900 font-medium">
                                {conflict.proposedValue}
                              </div>
                            </div>
                            <div className="bg-white border border-emerald-200 rounded-lg p-3">
                              <div className="text-xs text-slate-600 mb-1">Statistical Manifest</div>
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
                            Hypothesis Ready for Approval
                          </h3>
                          <p className="text-sm text-emerald-800">
                            All PICO fields are grounded in your Protocol Schema. No data conflicts detected.
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
                        disabled={hasConflicts || piApprovalStatus !== 'approved'}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Commit Hypothesis
                      </button>
                    ) : (
                      <button
                        onClick={() => onComplete?.({ pico: picoFields, rawObservation })}
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

        {/* Right Sidebar - Info Panel */}
        <div className="w-[400px] border-l border-slate-200 bg-white overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Manifest Panel */}
            {activeSidebarView === 'manifest' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-slate-900">Live Manifest Viewer</h3>
                </div>
                
                {/* Protocol Variables */}
                <div className="mb-6">
                  <h4 className="text-xs font-medium text-slate-700 mb-3 uppercase tracking-wider">
                    Protocol Schema
                  </h4>
                  <div className="space-y-2">
                    {mockProtocolVariables.map((variable) => (
                      <div key={variable} className="flex items-center gap-2 p-2 bg-emerald-50 rounded border border-emerald-200">
                        <Database className="w-3 h-3 text-emerald-600" />
                        <code className="text-xs text-emerald-900 font-mono">
                          {variable}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guidance */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-purple-900 mb-1">
                        Anti-Hallucination Guard
                      </div>
                      <p className="text-xs text-purple-700 leading-relaxed">
                        Your hypothesis must reference variables in the Protocol Schema and
                        align with Statistical Manifest data. Conflicts will block progression.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Statistics Panel */}
            {activeSidebarView === 'statistics' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-slate-900">Statistical Manifest</h3>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(mockStatisticalManifest).map(([key, value]) => (
                    <div key={key} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <div className="text-xs font-medium text-slate-900 mb-2">
                        {key.replace(/_/g, ' ').toUpperCase()}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600">p-value:</span>
                        <code className={`text-xs px-2 py-1 rounded font-mono ${
                          value.significant 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {value.pValue}
                        </code>
                      </div>
                      <div className="mt-2">
                        {value.significant ? (
                          <span className="text-xs text-emerald-700 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Significant
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">Not significant</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 mt-4">
                  <div className="text-xs font-medium text-indigo-900 mb-2">
                    Statistical Validation
                  </div>
                  <p className="text-xs text-indigo-700">
                    Hypotheses claiming "significant" results must align with p-values &lt; 0.05 in the manifest.
                  </p>
                </div>
              </div>
            )}

            {/* Guide Panel */}
            {activeSidebarView === 'guide' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-slate-900">Wizard Guide</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                    <h4 className="text-sm font-medium text-indigo-900 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Clinical Capture
                    </h4>
                    <p className="text-xs text-indigo-700">
                      Describe your clinical observation in natural language. The AI will extract key variables and structure them into a PICO framework.
                    </p>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <h4 className="text-sm font-medium text-emerald-900 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      PICO Refinement
                    </h4>
                    <p className="text-xs text-emerald-700">
                      Review the structured hypothesis. Each field is cross-referenced against your Protocol Schema to ensure all variables exist in your database.
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Validation
                    </h4>
                    <p className="text-xs text-purple-700">
                      The system validates your hypothesis against the Statistical Manifest. Claims of "significant" findings must be backed by p-values &lt; 0.05.
                    </p>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <h4 className="text-sm font-medium text-amber-900 mb-2">Anti-Hallucination</h4>
                    <p className="text-xs text-amber-700">
                      This wizard prevents fabricated claims by requiring all hypothesis components to be grounded in actual protocol data and statistical results.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}