/**
 * Project Setup - Professional Dual-Panel Workspace
 * Configure study design, team, blinding, and auto-generate methodology sections
 * Inspired by Academic Writing layout
 */

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Users, 
  EyeOff, 
  ClipboardCheck, 
  Copy, 
  Check,
  FlaskConical,
  BookOpen,
  Info,
  Save,
  X,
  Shield,
  UserPlus,
  Bot,
  AlertTriangle,
  Award
} from 'lucide-react';
import { useProject } from '../contexts/ProtocolContext';
import { GlobalHeader } from './unified-workspace/GlobalHeader';
import type { AutonomyMode } from '../types/accountability';
import { StudyMethodologySelector } from './project/StudyMethodologySelector';
import type { BlindingLevel, StudyType } from '../config/studyMethodology';
import { STUDY_METHODOLOGIES } from '../config/studyMethodology';
import { ModulePersonaPanel } from './ai-personas/ui/ModulePersonaPanel';
import { getInitialStudyType } from '../utils/studyTypeMapping';
import { initializeProjectSetupForm, type ProjectSetupFormData } from '../utils/projectSetupInitialization';
import { RigorBadge, PermissionBadge, AIAutonomyBadge, StatusBadge } from './ui/StatusBadge';

interface ProjectSetupProps {
  onComplete: () => void;
  onCancel: () => void;
}

type SetupStep = 'design' | 'team' | 'blinding' | 'review';
type SidebarView = 'preview' | 'methodology' | 'guide';

interface AssignedPersona {
  role: string;
  userId?: string;
  userName?: string;
  permissionLevel: 'read' | 'write' | 'admin';
  blinded: boolean;
  aiAutonomyCap: 'audit-only' | 'suggest' | 'co-pilot' | 'supervisor';
  certified: boolean;
  restrictedVariables?: string[];
}

export function ProjectSetup({ onComplete, onCancel }: ProjectSetupProps) {
  const { currentProject, updateProject } = useProject();
  const [currentStep, setCurrentStep] = useState<SetupStep>('design');
  const [activeSidebarView, setActiveSidebarView] = useState<SidebarView>('preview');
  const [autonomyMode, setAutonomyMode] = useState<AutonomyMode>('audit');
  
  // Form state - Initialize from studyDesign OR studyMethodology
  const [formData, setFormData] = useState<ProjectSetupFormData>(
    initializeProjectSetupForm(currentProject)
  );

  // Real Team DNA - Role-based configuration
  const studyConfig = STUDY_METHODOLOGIES[formData.studyType];
  const [assignedPersonas, setAssignedPersonas] = useState<AssignedPersona[]>(() => {
    // Initialize from existing config or from study requirements
    if (currentProject?.studyMethodology?.teamConfiguration?.assignedPersonas) {
      return currentProject.studyMethodology.teamConfiguration.assignedPersonas.map(p => ({
        role: p.role,
        userId: (p as any).userId,
        userName: (p as any).userName,
        permissionLevel: 'write' as const,
        blinded: p.blinded,
        aiAutonomyCap: 'suggest' as const,
        certified: false,
      }));
    }
    
    // Default: Use required personas from study type
    return studyConfig.requiredPersonas.map(req => ({
      role: req.role,
      permissionLevel: req.permissionLevel,
      blinded: req.blinded || false,
      aiAutonomyCap: req.aiAutonomyCap || 'suggest',
      certified: req.certificationRequired || false,
      restrictedVariables: req.restrictedVariables,
    }));
  });

  // Update team when study type changes
  useEffect(() => {
    const newStudyConfig = STUDY_METHODOLOGIES[formData.studyType];
    setAssignedPersonas(newStudyConfig.requiredPersonas.map(req => ({
      role: req.role,
      permissionLevel: req.permissionLevel,
      blinded: req.blinded || false,
      aiAutonomyCap: req.aiAutonomyCap || 'suggest',
      certified: req.certificationRequired || false,
      restrictedVariables: req.restrictedVariables,
    })));
  }, [formData.studyType]);

  // Methodology generation state
  const [generatedMethodology, setGeneratedMethodology] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Auto-generate methodology when configuration changes
  useEffect(() => {
    if (formData.studyType && formData.hypothesis && studyConfig) {
      generateMethodology();
    }
  }, [formData.studyType, formData.teamSize, formData.blindingProtocol, formData.hypothesis]);

  const generateMethodology = () => {
    if (!studyConfig) return;
    
    const sections = [];

    // Study Design Section
    sections.push(`## Study Design\n\n`);
    sections.push(`This ${studyConfig.name.toLowerCase()} study was designed to ${formData.hypothesis || 'investigate the research question'}. `);
    sections.push(`The study follows a ${studyConfig.rigorLevel}-rigor ${studyConfig.name.toLowerCase()} framework, which ${studyConfig.description.toLowerCase()}.\n\n`);

    // Blinding Protocol Section
    if (formData.blindingProtocol !== 'none') {
      sections.push(`### Blinding\n\n`);
      
      if (formData.blindingProtocol === 'double-blind') {
        sections.push(`A double-blind protocol was implemented to minimize bias. Neither the participants nor the research staff were aware of treatment allocation throughout the study period. `);
        sections.push(`Treatment codes were maintained by an independent data manager not involved in participant assessment.\n\n`);
      } else if (formData.blindingProtocol === 'single-blind') {
        sections.push(`A single-blind protocol was employed, where participants were blinded to treatment allocation while research staff maintained awareness for clinical safety monitoring.\n\n`);
      } else if (formData.blindingProtocol === 'triple-blind') {
        sections.push(`A triple-blind protocol was rigorously enforced, with participants, research staff, and data analysts all blinded to treatment allocation until final database lock and statistical analysis completion.\n\n`);
      } else if (formData.blindingProtocol === 'open-label') {
        sections.push(`An open-label design was utilized, appropriate for the nature of the intervention and research objectives. All parties were aware of treatment allocation.\n\n`);
      }
    }

    // Team Configuration Section
    sections.push(`### Research Team\n\n`);
    sections.push(`The study was conducted by a team of ${formData.teamSize} trained researchers. `);
    
    if (formData.blindingProtocol !== 'none' && formData.blindingProtocol !== 'open-label') {
      sections.push(`Team members were blinded to treatment allocation to maintain study integrity.\n\n`);
    } else {
      sections.push(`\n\n`);
    }

    // Study Type Specific Methodology
    sections.push(`### Methodological Approach\n\n`);
    
    switch (formData.studyType) {
      case 'rct':
        sections.push(`Participants were randomly allocated to treatment arms using a computer-generated randomization sequence with permuted block design (block size = 4). `);
        sections.push(`Allocation concealment was maintained using sequentially numbered, opaque sealed envelopes.\n\n`);
        break;
      case 'prospective-cohort':
        sections.push(`This prospective cohort study followed participants over time to assess the relationship between exposure and outcomes. `);
        sections.push(`Baseline characteristics were measured at enrollment, with follow-up assessments conducted at predetermined intervals.\n\n`);
        break;
      case 'retrospective-case-series':
        sections.push(`This retrospective case series reports detailed clinical observations and outcomes from a consecutive series of patients presenting with the condition of interest. `);
        sections.push(`Each case was documented using standardized data collection protocols.\n\n`);
        break;
      case 'laboratory-investigation':
        sections.push(`Laboratory investigations were conducted under controlled experimental conditions following standard operating procedures. `);
        sections.push(`All assays were performed in duplicate, and quality control samples were included in each analytical run.\n\n`);
        break;
      case 'technical-note':
        sections.push(`This technical report describes a novel methodology or procedural approach. `);
        sections.push(`Step-by-step protocols were developed and validated through iterative testing.\n\n`);
        break;
    }

    // Data Collection Section
    sections.push(`### Data Collection\n\n`);
    sections.push(`Data were collected using standardized case report forms (CRFs) with real-time electronic data capture. `);
    sections.push(`All data underwent quality assurance checks with 100% source data verification for primary endpoints.\n\n`);

    setGeneratedMethodology(sections.join(''));
  };

  const handleSaveAndContinue = () => {
    if (!currentProject) return;

    // Save current configuration with REAL team DNA
    const methodology = {
      studyType: formData.studyType,
      teamConfiguration: {
        assignedPersonas: assignedPersonas.map(p => ({
          personaId: p.userId || `ai-${p.role.toLowerCase().replace(/\s+/g, '-')}`,
          role: p.role,
          blinded: p.blinded,
          ...(p.userId && { userId: p.userId }),
          ...(p.userName && { userName: p.userName }),
        })),
        locked: false
      },
      blindingState: {
        protocol: formData.blindingProtocol,
        isUnblinded: false,
        preUnblindingChecklistCompleted: false,
        auditTrail: []
      },
      hypothesis: formData.hypothesis ? {
        researchQuestion: formData.hypothesis,
        primaryObjective: formData.hypothesis,
        secondaryObjectives: [],
        generatedAt: new Date().toISOString()
      } : undefined,
      configuredAt: currentProject.studyMethodology?.configuredAt || new Date().toISOString(),
      configuredBy: 'current-user-id' // TODO: Replace with real user ID
    };

    updateProject(currentProject.id, { studyMethodology: methodology });

    // Navigate to next step
    if (currentStep === 'design') setCurrentStep('team');
    else if (currentStep === 'team') setCurrentStep('blinding');
    else if (currentStep === 'blinding') setCurrentStep('review');
    else onComplete();
  };

  const handleBack = () => {
    if (currentStep === 'team') setCurrentStep('design');
    else if (currentStep === 'blinding') setCurrentStep('team');
    else if (currentStep === 'review') setCurrentStep('blinding');
    else onCancel();
  };

  const handleCopyMethodology = async () => {
    try {
      await navigator.clipboard.writeText(generatedMethodology);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      alert('Failed to copy to clipboard');
    }
  };

  const handleDownloadMethodology = () => {
    const blob = new Blob([generatedMethodology], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `methodology-${currentProject?.name || 'draft'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Global Header */}
      <GlobalHeader
        breadcrumbs={[
          { label: 'Research Factory', onClick: () => {} },
          { label: 'Project Setup' }
        ]}
        autonomyMode={autonomyMode}
        onAutonomyChange={setAutonomyMode}
        primaryAction={{
          label: currentStep === 'review' ? 'Complete Setup' : 'Save & Continue',
          onClick: handleSaveAndContinue,
          disabled: !formData.hypothesis || !formData.studyType,
          icon: currentStep === 'review' ? CheckCircle2 : Save
        }}
        secondaryActions={[
          {
            label: 'Cancel',
            onClick: onCancel,
            icon: X
          }
        ]}
      />

      {/* Success Toast */}
      {copySuccess && (
        <div className="fixed top-8 right-8 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <CheckCircle2 className="w-5 h-5" />
          <span>Copied to clipboard!</span>
        </div>
      )}

      {/* Navigation Tabs - Academic Writing Style */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-8 py-3">
          <div className="flex gap-1">
            {/* Main Panel Tabs */}
            <button
              onClick={() => setCurrentStep('design')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentStep === 'design'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              Study Design
            </button>
            <button
              onClick={() => setCurrentStep('team')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentStep === 'team'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Users className="w-4 h-4" />
              Team Setup
            </button>
            <button
              onClick={() => setCurrentStep('blinding')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentStep === 'blinding'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <EyeOff className="w-4 h-4" />
              Blinding
            </button>
            <button
              onClick={() => setCurrentStep('review')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentStep === 'review'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Review
            </button>

            {/* Divider */}
            <div className="w-px bg-slate-200 mx-2"></div>

            {/* Sidebar View Tabs */}
            <button
              onClick={() => setActiveSidebarView('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSidebarView === 'preview'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <FileText className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => setActiveSidebarView('methodology')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSidebarView === 'methodology'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Methodology
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
            {/* Study Design Step */}
            {currentStep === 'design' && (
              <div className="bg-white rounded-lg border border-slate-200 p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FlaskConical className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-slate-900 mb-2">Study Design Selection</h2>
                    <p className="text-slate-600 text-sm">
                      Choose the study methodology that best fits your research question and objectives.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Research Question / Primary Objective
                    </label>
                    <textarea
                      value={formData.hypothesis}
                      onChange={(e) => setFormData({ ...formData, hypothesis: e.target.value })}
                      placeholder="e.g., To investigate the efficacy of Treatment X in reducing symptoms of Condition Y compared to standard care..."
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    />
                  </div>

                  <StudyMethodologySelector
                    value={formData.studyType}
                    onChange={(value) => setFormData({ ...formData, studyType: value })}
                  />
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                  <button
                    onClick={onCancel}
                    className="px-6 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAndContinue}
                    disabled={!formData.hypothesis || !formData.studyType}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Team Setup Step */}
            {currentStep === 'team' && (
              <div className="bg-white rounded-lg border border-slate-200 p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-slate-900 mb-2">Research Team Configuration</h2>
                    <p className="text-slate-600 text-sm">
                      Configure the Scientific Chain of Command for this {studyConfig.name}.
                      Each role has specific permissions and AI autonomy levels.
                    </p>
                  </div>
                </div>

                {/* Study Rigor Badge */}
                <div className="mb-6 flex items-center gap-3">
                  <RigorBadge level={studyConfig.rigorLevel} />
                  <span className="text-sm text-slate-600">
                    {assignedPersonas.length} required role{assignedPersonas.length !== 1 ? 's' : ''}
                  </span>
                  {studyConfig.blindingProtocol !== 'none' && (
                    <span className="text-sm text-indigo-600 flex items-center gap-1">
                      <EyeOff className="w-4 h-4" />
                      Blinded roles enforced
                    </span>
                  )}
                </div>

                {/* Role Cards */}
                <div className="space-y-4">
                  {assignedPersonas.map((persona, idx) => {
                    const requirement = studyConfig.requiredPersonas[idx];
                    
                    return (
                      <div
                        key={idx}
                        className={`bg-slate-50 border-2 rounded-xl p-6 transition-all ${
                          persona.blinded
                            ? 'border-indigo-200'
                            : 'border-slate-200'
                        }`}
                      >
                        {/* Role Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            persona.blinded ? 'bg-indigo-100' : 'bg-slate-200'
                          }`}>
                            <Shield className={`w-5 h-5 ${
                              persona.blinded ? 'text-indigo-600' : 'text-slate-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <h3 className="text-slate-900 font-medium">{persona.role}</h3>
                              {requirement.mandatory && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                                  Required
                                </span>
                              )}
                              {persona.blinded && (
                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full flex items-center gap-1">
                                  <EyeOff className="w-3 h-3" />
                                  Blinded
                                </span>
                              )}
                              {persona.certified && (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full flex items-center gap-1">
                                  <Award className="w-3 h-3" />
                                  Certification Required
                                </span>
                              )}
                            </div>
                            
                            {/* Permission and AI Badges */}
                            <div className="flex items-center gap-2 mb-3">
                              <PermissionBadge level={persona.permissionLevel} size="sm" />
                              <AIAutonomyBadge level={persona.aiAutonomyCap} size="sm" />
                            </div>
                            
                            {/* Restricted Variables Warning */}
                            {persona.restrictedVariables && persona.restrictedVariables.length > 0 && (
                              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <div className="text-xs font-medium text-amber-900 mb-1">
                                    Restricted Access
                                  </div>
                                  <div className="text-xs text-amber-700">
                                    Cannot view: {persona.restrictedVariables.join(', ')}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Exclusive Access Info */}
                            {requirement.exclusiveAccess && requirement.exclusiveAccess.length > 0 && (
                              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mt-2">
                                <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <div className="text-xs font-medium text-blue-900 mb-1">
                                    Exclusive Access
                                  </div>
                                  <div className="text-xs text-blue-700">
                                    Only this role can access: {requirement.exclusiveAccess.join(', ')}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Human Assignment Section */}
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              {persona.userId ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-blue-700">
                                      {persona.userName?.charAt(0) || 'U'}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-slate-900">{persona.userName}</div>
                                    <div className="text-xs text-slate-500">Human Assigned</div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-purple-600" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-slate-900">AI Co-Pilot</div>
                                    <div className="text-xs text-slate-500">No human assigned</div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                const newPersonas = [...assignedPersonas];
                                if (persona.userId) {
                                  // Remove human assignment
                                  newPersonas[idx] = {
                                    ...persona,
                                    userId: undefined,
                                    userName: undefined,
                                  };
                                } else {
                                  // Mock assign human (in real app, would open user selector)
                                  newPersonas[idx] = {
                                    ...persona,
                                    userId: 'user-' + Date.now(),
                                    userName: 'Dr. Jane Smith',
                                  };
                                }
                                setAssignedPersonas(newPersonas);
                              }}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <UserPlus className="w-4 h-4" />
                              {persona.userId ? 'Change' : 'Assign Human'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-900 mb-1">
                        Role-Based Team Configuration
                      </div>
                      <div className="text-sm text-blue-700">
                        Each role can be assigned to a human team member or left as AI co-pilot.
                        Roles with specific permission levels and blinding status are automatically enforced throughout the platform.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleSaveAndContinue}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Blinding Step */}
            {currentStep === 'blinding' && (
              <div className="bg-white rounded-lg border border-slate-200 p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <EyeOff className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-slate-900 mb-2">Blinding Protocol</h2>
                    <p className="text-slate-600 text-sm">
                      Select the appropriate blinding level for your study to minimize bias.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { value: 'none', label: 'No Blinding', desc: 'All parties aware of assignments (not recommended for interventional studies)' },
                    { value: 'open-label', label: 'Open-Label', desc: 'Transparent assignment (appropriate for certain study types)' },
                    { value: 'single-blind', label: 'Single-Blind', desc: 'Participants blinded, staff unblinded' },
                    { value: 'double-blind', label: 'Double-Blind', desc: 'Both participants and staff blinded (gold standard)' },
                    { value: 'triple-blind', label: 'Triple-Blind', desc: 'Participants, staff, and analysts all blinded' },
                  ].map(({ value, label, desc }) => (
                    <label
                      key={value}
                      className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        formData.blindingProtocol === value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="blinding"
                        value={value}
                        checked={formData.blindingProtocol === value}
                        onChange={(e) => setFormData({ ...formData, blindingProtocol: e.target.value as BlindingProtocol })}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="text-slate-900 font-medium">{label}</div>
                        <div className="text-sm text-slate-600 mt-1">{desc}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleSaveAndContinue}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Review Step */}
            {currentStep === 'review' && studyConfig && (
              <div className="bg-white rounded-lg border border-slate-200 p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-slate-900 mb-2">Review Configuration</h2>
                    <p className="text-slate-600 text-sm">
                      Review your project setup before completing the configuration.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Study Design */}
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-900 mb-3">Study Design</h3>
                    <div className="text-sm text-slate-700">
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-600">Type:</span>
                        <span className="font-medium">{studyConfig.name}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-600">Rigor Level:</span>
                        <div className="flex items-center gap-2">
                          <RigorBadge level={studyConfig.rigorLevel} size="xs" />
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className="text-xs text-slate-600">{formData.hypothesis}</p>
                      </div>
                    </div>
                  </div>

                  {/* Team Configuration */}
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-900 mb-3">Team Configuration</h3>
                    <div className="space-y-3">
                      {/* Summary Stats */}
                      <div className="flex items-center gap-4 text-sm pb-3 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-600">{assignedPersonas.length} roles</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserPlus className="w-4 h-4 text-blue-500" />
                          <span className="text-slate-600">
                            {assignedPersonas.filter(p => p.userId).length} human assigned
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-purple-500" />
                          <span className="text-slate-600">
                            {assignedPersonas.filter(p => !p.userId).length} AI co-pilot
                          </span>
                        </div>
                        {assignedPersonas.some(p => p.blinded) && (
                          <div className="flex items-center gap-2">
                            <EyeOff className="w-4 h-4 text-indigo-500" />
                            <span className="text-slate-600">
                              {assignedPersonas.filter(p => p.blinded).length} blinded
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Role List */}
                      <div className="space-y-2">
                        {assignedPersonas.map((persona, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200"
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              persona.blinded ? 'bg-indigo-100' : 'bg-slate-100'
                            }`}>
                              <Shield className={`w-4 h-4 ${
                                persona.blinded ? 'text-indigo-600' : 'text-slate-600'
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-sm font-medium text-slate-900">
                                  {persona.role}
                                </span>
                                {persona.blinded && (
                                  <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded">
                                    Blinded
                                  </span>
                                )}
                                {persona.certified && (
                                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">
                                    Certified
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {persona.userId ? (
                                  <span className="text-xs text-slate-600 flex items-center gap-1">
                                    <UserPlus className="w-3 h-3 text-blue-600" />
                                    {persona.userName}
                                  </span>
                                ) : (
                                  <span className="text-xs text-slate-500 flex items-center gap-1">
                                    <Bot className="w-3 h-3 text-purple-600" />
                                    AI Co-Pilot
                                  </span>
                                )}
                                <span className="text-slate-300">•</span>
                                <PermissionBadge level={persona.permissionLevel} size="xs" />
                                <span className="text-slate-300">•</span>
                                <AIAutonomyBadge level={persona.aiAutonomyCap} size="xs" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Blinding Info */}
                      {assignedPersonas.some(p => p.blinded) && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <div className="flex items-start gap-2 text-xs text-slate-600">
                            <EyeOff className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <span>
                              Blinded roles have restricted access to treatment assignments and will not see
                              sensitive variables throughout the study lifecycle.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Blinding Protocol */}
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-900 mb-3">Blinding Protocol</h3>
                    <div className="text-sm text-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Protocol:</span>
                        <span className="font-medium capitalize">{formData.blindingProtocol.replace('-', ' ')}</span>
                      </div>
                      {formData.blindingProtocol !== 'none' && formData.blindingProtocol !== 'open-label' && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <p className="text-xs text-slate-600">
                            {formData.blindingProtocol === 'double-blind' && 
                              'Both participants and research staff will be blinded to treatment allocation.'}
                            {formData.blindingProtocol === 'single-blind' && 
                              'Participants will be blinded to treatment allocation.'}
                            {formData.blindingProtocol === 'triple-blind' && 
                              'Participants, research staff, and data analysts will all be blinded to treatment allocation.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Methodology Preview */}
                  {studyConfig.requiresDataSafetyMonitoring && (
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-amber-900 mb-1">
                            Data Safety Monitoring Required
                          </h3>
                          <p className="text-xs text-amber-700">
                            This {studyConfig.name.toLowerCase()} requires ongoing data safety monitoring.
                            Ensure appropriate safety oversight is in place before data collection begins.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleSaveAndContinue}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Complete Setup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* AI Personas Panel */}
        <ModulePersonaPanel module="project-setup" />
      </div>
    </div>
  );
}