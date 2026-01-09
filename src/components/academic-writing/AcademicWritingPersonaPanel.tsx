/**
 * Academic Writing Persona Panel - Unified Faculty Tab Content
 * Displays Dr. Niamh (Writing Coach - Seelie) and Dr. Morana (Manuscript Reviewer - Unseelie)
 * Includes AI Mode controls (Co-Pilot, Audit, etc.)
 */

import { 
  Sparkles, Wand2, Zap, Brain, CheckCircle2, AlertCircle, Sun, Snowflake,
  Settings, Eye, Plane, ChevronUp, ChevronDown, BookOpen, Clock, XCircle, Users, Bot, EyeOff,
  // Persona-specific icons
  Scan, Blocks, Sigma, Radar, Scale, ShieldAlert, Target, FileDiff, Feather, SearchX
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePersonas } from '../ai-personas/core/personaContext';
import { getPersona, getAllPersonas } from '../ai-personas/core/personaRegistry';
import { DataConnectionPanel } from './DataConnectionPanel';
import type { ValidationResult } from '../../services/manuscriptValidationService';
import { useProject } from '../../contexts/ProjectContext';

export interface DataConnection {
  source: string;
  type: 'protocol' | 'schema' | 'manifest' | 'references' | 'irb' | 'analytics';
  status: 'connected' | 'disconnected' | 'stale';
  recordCount?: number;
  lastUpdated?: string;
  dataLocked?: boolean;
  fields?: string[];
}

interface AcademicWritingPersonaPanelProps {
  editorState?: {
    aiMode: 'co-pilot' | 'autopilot' | 'manual';
    supervisionActive: boolean;
    autoCheckEnabled: boolean;
  };
  onModeChange?: (mode: 'co-pilot' | 'autopilot' | 'manual') => void;
  onLogicCheck?: () => void;
  claimConflicts?: number;
  onAutoGenerate?: () => void;
  dataConnections?: DataConnection[];
  onNavigateToEthics?: () => void; // NEW: Navigate to Ethics Board
}

export function AcademicWritingPersonaPanel({
  editorState,
  onModeChange,
  onLogicCheck,
  claimConflicts = 0,
  onAutoGenerate,
  dataConnections,
  onNavigateToEthics
}: AcademicWritingPersonaPanelProps) {
  const { state } = usePersonas();
  const { currentProject } = useProject();
  const [isExpanded, setIsExpanded] = useState(true);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'assistant' | 'team'>('assistant');

  // Get the Academic Writing Coach persona
  const personaConfig = getPersona('academic-writing-coach');
  const personaState = state.personas['academic-writing-coach'];
  const validation = personaState?.lastValidation;
  
  // Get team configuration and all active personas for Team tab
  const teamPersonas = currentProject?.studyMethodology?.teamConfiguration?.assignedPersonas || [];
  const allPersonas = getAllPersonas();
  const allActivePersonas = allPersonas.filter(persona => state.personas[persona.id]?.active);
  
  // Icon mapping for AI personas - function-specific
  const PERSONA_ICONS: Record<string, any> = {
    'protocol-auditor': Scan,
    'schema-architect': Blocks,
    'statistical-advisor': Sigma,
    'data-quality-sentinel': Radar,
    'ethics-compliance': Scale,
    'safety-vigilance': ShieldAlert,
    'endpoint-validator': Target,
    'amendment-advisor': FileDiff,
    'academic-writing-coach': Feather,
    'manuscript-reviewer': SearchX,
  };

  if (!personaState?.active) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Sparkles className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          AI Writing Coach Unavailable
        </h3>
        <p className="text-xs text-slate-500">
          The Academic Writing Coach AI is currently disabled.
          Enable it in Persona Settings to get writing assistance.
        </p>
      </div>
    );
  }

  // Get validation status
  const getValidationStatus = () => {
    if (!validation) {
      return { icon: Clock, color: 'slate', label: 'Not validated', score: null };
    }
    const score = validation.complianceScore;
    if (score >= 90) {
      return { icon: CheckCircle2, color: 'green', label: 'Excellent', score };
    }
    if (score >= 75) {
      return { icon: CheckCircle2, color: 'amber', label: 'Good', score };
    }
    if (score >= 50) {
      return { icon: AlertCircle, color: 'orange', label: 'Needs work', score };
    }
    return { icon: XCircle, color: 'red', label: 'Critical', score };
  };

  const status = getValidationStatus();
  const StatusIcon = status.icon;

  useEffect(() => {
    // Skip validation if no manuscript available
    if (!editorState) return;
    
    // Run validation in the background (placeholder for now)
    // In a real implementation, this would validate the actual manuscript
    const mockValidation: ValidationResult = {
      mechanicalIssues: [],
      aiSupervisionIssues: [],
      totalIssues: 0,
      criticalCount: 0,
      warningCount: 0,
      passed: true,
      timestamp: Date.now(),
    };
    
    setValidationResult(mockValidation);
  }, [editorState]);

  return (
    <div className="h-full flex flex-col">
      {/* Header - Dr. Niamh (Writing Coach - Seelie) */}
      <div className="px-6 py-4 border-b border-amber-200 bg-amber-50">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Feather className="w-5 h-5 text-amber-700" />
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center">
              <Sun className="w-3 h-3 text-amber-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900">
              {personaConfig.fairyName || 'Dr. Niamh'}
            </h3>
            <p className="text-xs text-amber-700">
              {personaConfig.name} • Seelie Co-Pilot
            </p>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-${status.color}-100 text-${status.color}-700 border border-${status.color}-200`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {status.score !== null ? `${status.score}%` : status.label}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {personaConfig.description}
            </p>
          </div>

          {/* AI Mode Controls */}
          {editorState && onModeChange && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-4 h-4 text-purple-600" />
                <h4 className="text-sm font-semibold text-slate-900">AI Writing Mode</h4>
              </div>

              {/* 3-State Mode Selector */}
              <div className="space-y-2 mb-4">
                <button
                  onClick={() => onModeChange('manual')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    editorState.aiMode === 'manual'
                      ? 'border-slate-400 bg-slate-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <PenTool className={`w-4 h-4 ${editorState.aiMode === 'manual' ? 'text-slate-700' : 'text-slate-400'}`} />
                    <div className="text-left">
                      <div className={`text-sm font-medium ${editorState.aiMode === 'manual' ? 'text-slate-900' : 'text-slate-600'}`}>
                        Manual
                      </div>
                      <div className="text-xs text-slate-500">
                        Full manual control, no AI assistance
                      </div>
                    </div>
                  </div>
                  {editorState.aiMode === 'manual' && (
                    <CheckCircle2 className="w-5 h-5 text-slate-600" />
                  )}
                </button>

                <button
                  onClick={() => onModeChange('co-pilot')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    editorState.aiMode === 'co-pilot'
                      ? 'border-blue-400 bg-blue-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Eye className={`w-4 h-4 ${editorState.aiMode === 'co-pilot' ? 'text-blue-700' : 'text-slate-400'}`} />
                    <div className="text-left">
                      <div className={`text-sm font-medium ${editorState.aiMode === 'co-pilot' ? 'text-blue-900' : 'text-slate-600'}`}>
                        Co-Pilot
                      </div>
                      <div className="text-xs text-slate-500">
                        AI supervises and flags issues
                      </div>
                    </div>
                  </div>
                  {editorState.aiMode === 'co-pilot' && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  )}
                </button>

                <button
                  onClick={() => onModeChange('autopilot')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    editorState.aiMode === 'autopilot'
                      ? 'border-purple-400 bg-purple-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Plane className={`w-4 h-4 ${editorState.aiMode === 'autopilot' ? 'text-purple-700' : 'text-slate-400'}`} />
                    <div className="text-left">
                      <div className={`text-sm font-medium ${editorState.aiMode === 'autopilot' ? 'text-purple-900' : 'text-slate-600'}`}>
                        Autopilot
                      </div>
                      <div className="text-xs text-slate-500">
                        AI generates draft content
                      </div>
                    </div>
                  </div>
                  {editorState.aiMode === 'autopilot' && (
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  )}
                </button>
              </div>

              {/* Supervision Active Badge */}
              {editorState.aiMode === 'co-pilot' && editorState.supervisionActive && (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-100 border border-green-300 rounded-lg mb-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-green-700">
                    Supervision Active
                  </span>
                </div>
              )}

              {/* Claim Conflicts Warning */}
              {claimConflicts > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-100 border border-red-300 rounded-lg mb-3">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-medium text-red-700">
                    {claimConflicts} Claim{claimConflicts !== 1 ? 's' : ''} Need Review
                  </span>
                </div>
              )}

              {/* Logic Check Button - Only for AI modes */}
              {onLogicCheck && editorState.aiMode !== 'manual' && (
                <button
                  onClick={onLogicCheck}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm mb-3"
                >
                  <Zap className="w-4 h-4" />
                  Run Logic Check
                </button>
              )}

              {/* Auto-Generate Button - Only for Autopilot mode */}
              {onAutoGenerate && editorState.aiMode === 'autopilot' && (
                <button
                  onClick={onAutoGenerate}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  Auto-Generate Manuscript
                </button>
              )}

              {/* Manual Mode Notice */}
              {editorState.aiMode === 'manual' && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <div className="text-xs text-slate-600 leading-relaxed">
                    <strong>Manual Mode Active:</strong> Citation format and reference validation still run automatically. 
                    Statistical claim verification is disabled.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Real-Time Validation Status */}
          {personaConfig.realTimeValidation && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-amber-900 mb-1">
                    Real-Time Validation Active
                  </div>
                  <div className="text-xs text-amber-700">
                    Writing quality checks run automatically as you draft your manuscript
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Validation Details */}
          {validationResult && (
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Manuscript Quality Status
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Critical Issues</div>
                  <div className="text-2xl font-bold text-red-600">{validationResult.criticalCount}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Warnings</div>
                  <div className="text-2xl font-bold text-amber-600">{validationResult.warningCount}</div>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-200">
                <div className="text-xs text-slate-500 mb-1">Last Validated</div>
                <div className="text-sm text-slate-700">
                  {new Date(validationResult.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Data Connections Panel - Shows source data being used */}
          {dataConnections && dataConnections.length > 0 && (
            <div className="bg-white rounded-lg border-2 border-blue-200">
              <div className="px-4 py-3 bg-blue-50 border-b border-blue-200">
                <div className="text-xs font-semibold text-blue-900 uppercase tracking-wide">
                  🔒 Secured Data Connections
                </div>
              </div>
              <DataConnectionPanel 
                connections={dataConnections} 
                securityLevel="clinical-grade"
                onNavigateToEthics={onNavigateToEthics}
              />
            </div>
          )}

          {/* Competencies Section */}
          <div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between mb-3"
            >
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                AI Writing Competencies
              </div>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {isExpanded && personaConfig.sidebar?.sections && (
              <div className="space-y-3">
                {personaConfig.sidebar.sections.map((section, idx) => {
                  // Get content (handle both static and dynamic)
                  const content = typeof section.content === 'function' 
                    ? section.content({}) 
                    : section.content;

                  if (!content || content.length === 0) return null;

                  return (
                    <div key={idx} className="bg-rose-50 rounded-lg border border-rose-100 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        {section.type === 'guidance' && <Shield className="w-4 h-4 text-indigo-600" />}
                        {section.type === 'best-practices' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                        {section.type === 'checklist' && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
                        {section.type === 'warnings' && <AlertCircle className="w-4 h-4 text-amber-600" />}
                        {section.type === 'examples' && <BookOpen className="w-4 h-4 text-purple-600" />}
                        <div className="text-sm font-semibold text-slate-900">
                          {section.title}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {content.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0"></div>
                            <div className="text-sm text-slate-700 leading-relaxed">
                              {typeof item === 'string' ? item : String(item)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Suggested Actions */}
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Recommended Actions
            </div>
            <div className="space-y-2">
              {validationResult && validationResult.criticalCount > 0 && (
                <div className="flex items-start gap-3 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-red-900 mb-1">
                      Critical Issues Detected
                    </div>
                    <div className="text-xs text-red-700">
                      Review and address {validationResult.criticalCount} critical issue{validationResult.criticalCount > 1 ? 's' : ''} before submission
                    </div>
                  </div>
                </div>
              )}
              {validationResult && validationResult.warningCount > 0 && validationResult.criticalCount === 0 && (
                <div className="flex items-start gap-3 text-sm bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-amber-900 mb-1">
                      Warnings Found
                    </div>
                    <div className="text-xs text-amber-700">
                      Address {validationResult.warningCount} warning{validationResult.warningCount > 1 ? 's' : ''} to improve manuscript quality
                    </div>
                  </div>
                </div>
              )}
              {(!validationResult || (validationResult.criticalCount === 0 && validationResult.warningCount === 0)) && (
                <div className="flex items-start gap-3 text-sm bg-green-50 border border-green-200 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-900 mb-1">
                      All Checks Passed
                    </div>
                    <div className="text-xs text-green-700">
                      Your manuscript meets all quality guidelines
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
        <p className="text-xs text-slate-500 text-center">
          Powered by AI Persona System v2.0
        </p>
      </div>
    </div>
  );
}