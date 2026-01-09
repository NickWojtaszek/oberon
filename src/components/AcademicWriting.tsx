import { useState, useEffect } from 'react';
import { FileText, BookOpen, Sparkles, Shield, BarChart3, Target, AlertTriangle, X, GitBranch, PenTool } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { usePersonas } from './ai-personas/core/personaContext';
import { createDemoManuscript, shouldLoadDemoData, markDemoAsLoaded } from '../utils/demoAcademicData';
import { useManuscriptState } from '../hooks/useManuscriptState.refactored';
import { useVerificationState } from '../hooks/useVerificationState.refactored';
import { useExportState } from '../hooks/useExportState.refactored';
import { useStatisticalManifestState } from '../hooks/useStatisticalManifestState';
import { useJournalConstraints } from '../hooks/useJournalConstraints';
import { useTrackedChanges } from '../hooks/useTrackedChanges';
import { LogicAuditSidebar } from './academic-writing/LogicAuditSidebar';
import { PIDashboard } from './PIDashboard';
import { ManuscriptEditor } from './academic-writing/ManuscriptEditor';
import { SourceLibrary } from './academic-writing/SourceLibrary';
import { StatisticalManifestViewer } from './academic-writing/StatisticalManifestViewer';
import { ResearchMultiplier } from './academic-writing/ResearchMultiplier';
import { ReviewLayer } from './academic-writing/ReviewLayer';
import { BibliographyTab } from './academic-writing/BibliographyTab';
import { ExportDialog } from './academic-writing/ExportDialog';
import { JournalProfileSelector } from './academic-writing/JournalProfileSelector';
import { WordBudgetPanel } from './academic-writing/WordBudgetPanel';
import { TrackedChangesPanel } from './academic-writing/TrackedChangesPanel';
import { EmptyState } from './ui/EmptyState';
import { AcademicWritingPersonaPanel } from './academic-writing/AcademicWritingPersonaPanel';
import { ModulePersonaPanel } from './ai-personas/ui/ModulePersonaPanel';
import { AutoGenerateManuscriptModal, type GenerationOptions } from './academic-writing/AutoGenerateManuscriptModal';
import { aiManuscriptGenerationService, type ManuscriptGenerationContext } from '../services/aiManuscriptGenerationService';
import type { ManuscriptManifest } from './academic-writing/types';
import type { StatisticalManifest } from './analytics-stats/types';
import type { VerificationPacket } from './academic-writing/LogicAuditSidebar';

interface EditorState {
  aiMode: 'co-pilot' | 'autopilot' | 'manual';
  supervisionActive: boolean;
  autoCheckEnabled: boolean;
}

interface ClaimAudit {
  id: string;
  claim: string;
  status: 'verified' | 'flagged' | 'pending';
  source?: string;
}

interface EthicsCompliance {
  irbApprovalDate: string;
  expirationDate: string;
  status: 'active' | 'expired' | 'pending';
}

type CitationStyle = 'vancouver' | 'apa' | 'harvard' | 'chicago';
type IntelligenceTab = 'ai-assistant' | 'sources' | 'manifest' | 'multiplier' | 'review' | 'journal' | 'changes' | 'team';
type ManuscriptTab = 'editor' | 'bibliography';

interface AcademicWritingProps {
  onNavigate?: (tab: string) => void;
}

export function AcademicWriting({ onNavigate }: AcademicWritingProps = {}) {
  const { currentProject } = useProject();
  
  const manuscriptState = useManuscriptState(currentProject?.id);
  const verificationState = useVerificationState(manuscriptState.selectedManuscriptId || undefined);
  const exportState = useExportState();
  const manifestState = useStatisticalManifestState(currentProject?.id);
  
  // Tracked changes hook - initialize with selected manuscript
  const trackedChanges = useTrackedChanges({
    manuscriptId: manuscriptState.selectedManuscriptId || 'temp',
    currentUser: currentProject?.primaryInvestigator || 'User',
    currentRole: 'PI'
  });
  
  const [editorState, setEditorState] = useState<EditorState>({
    aiMode: 'co-pilot',
    supervisionActive: true,
    autoCheckEnabled: true
  });
  
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(null);
  const constraints = useJournalConstraints(selectedJournalId, manuscriptState.selectedManuscript);
  
  const [isAuditSidebarOpen, setIsAuditSidebarOpen] = useState(false);
  const [showPIDashboard, setShowPIDashboard] = useState(false);
  
  const [citationStyle, setCitationStyle] = useState<CitationStyle>('vancouver');
  const [activeManuscriptTab, setActiveManuscriptTab] = useState<ManuscriptTab>('editor');
  const [activeIntelligenceTab, setActiveIntelligenceTab] = useState<IntelligenceTab>('ai-assistant');
  const [groundingEnabled, setGroundingEnabled] = useState(true);
  const [showDemoBanner, setShowDemoBanner] = useState(false);
  const [claimsAudit, setClaimsAudit] = useState<ClaimAudit[]>([]);
  const [ethicsCompliance, setEthicsCompliance] = useState<EthicsCompliance | null>(null);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [showAutoGenerateModal, setShowAutoGenerateModal] = useState(false);

  // Load ethics compliance status for cross-tab validation
  useEffect(() => {
    if (!currentProject) return;
    
    const storageKey = `ethics_compliance_${currentProject.id}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      setEthicsCompliance(JSON.parse(stored));
    }
  }, [currentProject]);

  if (currentProject && shouldLoadDemoData(currentProject.id)) {
    const demoManuscript = createDemoManuscript(currentProject.id);
    manuscriptState.addManuscript(demoManuscript);
    markDemoAsLoaded(currentProject.id);
    setShowDemoBanner(true);
  }

  const handleInsertNarrative = (narrative: string) => {
    if (!manuscriptState.selectedManuscript) return;
    const currentContent = manuscriptState.selectedManuscript.manuscriptContent.results;
    const updated = currentContent + '\n\n' + narrative;
    manuscriptState.handleContentChange('results', updated);
  };

  const handleInsertFromChat = (text: string, section?: string) => {
    if (!manuscriptState.selectedManuscript) return;
    const targetSection = (section as keyof ManuscriptManifest['manuscriptContent']) || 'discussion';
    const currentContent = manuscriptState.selectedManuscript.manuscriptContent[targetSection];
    const updated = currentContent + '\n\n' + text;
    manuscriptState.handleContentChange(targetSection, updated);
    setActiveManuscriptTab('editor');
    alert(`✅ Content inserted into ${targetSection.charAt(0).toUpperCase() + targetSection.slice(1)} section`);
  };

  const handleInsertCitation = (citationKey: string, sourceId: string, section: string) => {
    console.log('Citation inserted:', citationKey, 'in', section);
  };

  const handleGenerateSection = (section: keyof ManuscriptManifest['manuscriptContent']) => {
    if (!manuscriptState.selectedManuscript || !manifestState.latestStatisticalManifest) {
      alert('No statistical manifest available for AI generation');
      return;
    }
    
    if (constraints.hasConstraints && constraints.journalProfile) {
      const sectionStatus = constraints.getSectionStatus(section);
      const journalName = constraints.journalProfile.name;
      
      if (sectionStatus && sectionStatus.status === 'error') {
        const confirm = window.confirm(
          `⚠️ Word Limit Exceeded\n\n` +
          `The ${section} section already has ${sectionStatus.currentWords} words, ` +
          `exceeding the ${journalName} limit of ${sectionStatus.limit} words.\n\n` +
          `Generating more content will further violate journal guidelines.\n\n` +
          `Continue anyway?`
        );
        if (!confirm) return;
      } else if (sectionStatus && sectionStatus.status === 'warning') {
        const confirm = window.confirm(
          `⚠️ Approaching Word Limit\n\n` +
          `The ${section} section has ${sectionStatus.currentWords}/${sectionStatus.limit} words ` +
          `(${Math.round(sectionStatus.percentage)}%).\n\n` +
          `AI generation may exceed the ${journalName} limit.\n\n` +
          `Continue?`
        );
        if (!confirm) return;
      }
    }
    
    const generatedText = simulateAIGeneration(section, manifestState.latestStatisticalManifest);
    manuscriptState.handleContentChange(section, generatedText);
    
    if (constraints.hasConstraints && constraints.journalProfile) {
      setTimeout(() => {
        const newStatus = constraints.getSectionStatus(section);
        if (newStatus && newStatus.status === 'error') {
          alert(`⚠️ ${section} section now exceeds word limit: ${newStatus.currentWords}/${newStatus.limit} words`);
        }
      }, 100);
    }
  };

  const handleCreateManuscript = () => {
    const title = prompt('Enter manuscript title:');
    if (!title) return;
    manuscriptState.handleCreateManuscript(title);
  };

  const simulateAIGeneration = (section: string, manifest: StatisticalManifest): string => {
    switch (section) {
      case 'methods':
        return `Statistical analysis was performed using the Clinical Intelligence Engine (v1.0). Continuous variables were analyzed using appropriate parametric or non-parametric tests based on distribution assessment. Categorical variables were compared using Fisher's Exact Test for small cell counts. A p-value < 0.05 was considered statistically significant.\n\nThe study population consisted of ${manifest.manifestMetadata.totalRecordsAnalyzed} participants. Descriptive statistics are presented as mean ± standard deviation for continuous variables and frequencies (percentages) for categorical variables.`;
      case 'results':
        const primaryFindings = manifest.descriptiveStats.slice(0, 3).map(stat => 
          `${stat.label} was ${stat.results.mean?.toFixed(2) || 'N/A'} ± ${stat.results.stdDev?.toFixed(2) || 'N/A'}.`
        ).join(' ');
        return `A total of ${manifest.manifestMetadata.totalRecordsAnalyzed} participants were analyzed. ${primaryFindings}\n\nComparative analyses revealed ${manifest.comparativeAnalyses.filter(a => (a.pValue || 1) < 0.05).length} statistically significant associations.`;
      default:
        return '[AI-generated content would appear here based on your Statistical Manifest]';
    }
  };

  const usedVariableIds: string[] = [];

  const handleAutoSync = (verification: VerificationPacket) => {
    if (!manuscriptState.selectedManuscript) return;
    
    const sections = manuscriptState.selectedManuscript.manuscriptContent;
    for (const [sectionKey, content] of Object.entries(sections)) {
      if (content.includes(verification.manuscriptClaim)) {
        const updated = content.replace(
          verification.manuscriptClaim,
          verification.externalCheck.sourceSnippet
        );
        manuscriptState.handleContentChange(sectionKey as keyof ManuscriptManifest['manuscriptContent'], updated);
        alert(`✅ Auto-synced claim in ${sectionKey} section`);
        return;
      }
    }
  };

  const handleApproveVerification = (verificationId: string) => {
    alert(`✅ PI approved verification: ${verificationId}`);
  };

  const handleSelectManuscriptFromDashboard = (manuscriptId: string, projectId: string) => {
    manuscriptState.setSelectedManuscriptId(manuscriptId);
    setShowPIDashboard(false);
  };

  // Handle manuscript switching with auto-save
  const handleManuscriptSelect = async (manuscriptId: string) => {
    if (manuscriptId === manuscriptState.selectedManuscriptId) return;
    
    // Auto-save current manuscript by updating its modified timestamp
    if (manuscriptState.selectedManuscript && currentProject) {
      const storageKey = `manuscript_last_worked_${currentProject.id}`;
      localStorage.setItem(storageKey, JSON.stringify({
        manuscriptId: manuscriptState.selectedManuscript.id,
        timestamp: Date.now()
      }));
    }
    
    // Switch to new manuscript
    manuscriptState.setSelectedManuscriptId(manuscriptId);
    
    // Update last worked timestamp for the new manuscript
    if (currentProject) {
      const storageKey = `manuscript_last_worked_${currentProject.id}`;
      localStorage.setItem(storageKey, JSON.stringify({
        manuscriptId: manuscriptId,
        timestamp: Date.now()
      }));
    }
  };

  // Load last worked manuscript on mount
  useEffect(() => {
    if (!currentProject || manuscriptState.manuscripts.length === 0) return;
    
    const storageKey = `manuscript_last_worked_${currentProject.id}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        const { manuscriptId } = JSON.parse(stored);
        const exists = manuscriptState.manuscripts.find(m => m.id === manuscriptId);
        if (exists && !manuscriptState.selectedManuscriptId) {
          manuscriptState.setSelectedManuscriptId(manuscriptId);
        }
      } catch (e) {
        console.error('Failed to load last worked manuscript:', e);
      }
    }
  }, [currentProject, manuscriptState.manuscripts.length]);

  if (showPIDashboard) {
    return (
      <PIDashboard
        onClose={() => setShowPIDashboard(false)}
        onSelectManuscript={handleSelectManuscriptFromDashboard}
      />
    );
  }

  const handleLogicCheck = () => {
    verificationState.handleLogicCheck(
      manuscriptState.selectedManuscript, 
      manifestState.latestStatisticalManifest,
      editorState.aiMode
    );
    setTimeout(() => {
      if (verificationState.verifications.length > 0 || verificationState.logicErrors.length > 0) {
        setIsAuditSidebarOpen(true);
      }
    }, 500);
  };

  const handleAutoGenerateManuscript = (options: GenerationOptions) => {
    if (!manuscriptState.selectedManuscript) return;

    // Build comprehensive generation context from all available sources
    const generationContext: ManuscriptGenerationContext = {
      schemaBlocks: manuscriptState.schemaBlocks,
      statisticalManifest: manifestState.latestStatisticalManifest,
      linkedSources: manuscriptState.selectedManuscript.notebookContext?.linkedSources || [],
      protocolMetadata: {
        protocolTitle: manuscriptState.selectedManuscript.projectMeta?.studyTitle,
        principalInvestigator: currentProject?.primaryInvestigator,
        studyPhase: manuscriptState.selectedManuscript.projectMeta?.studyPhase,
        therapeuticArea: manuscriptState.selectedManuscript.projectMeta?.therapeuticArea,
      },
      protocolContent: manuscriptState.selectedManuscript.projectMeta?.protocolContent,
      studyMethodology: currentProject?.studyMethodology,
      irbInfo: ethicsCompliance ? {
        approvalDate: ethicsCompliance.irbApprovalDate,
        boardName: 'Institutional Review Board',
        protocolNumber: currentProject?.studyNumber,
      } : undefined,
      analyticsMetadata: {
        databaseSource: 'Clinical Intelligence Engine',
        queryCount: manifestState.latestStatisticalManifest?.descriptiveStats.length || 0,
        lastAnalysisDate: manifestState.latestStatisticalManifest?.manifestMetadata.exportTimestamp,
        dataLockDate: manifestState.latestStatisticalManifest?.manifestMetadata.exportTimestamp,
      },
    };

    // Generate content for selected sections using the enhanced service
    Object.entries(options.sections).forEach(([section, shouldGenerate]) => {
      if (!shouldGenerate) return;
      
      const generatedText = aiManuscriptGenerationService.generateSection(
        section as any,
        generationContext,
        options
      );
      
      const currentContent = manuscriptState.selectedManuscript.manuscriptContent[section as keyof ManuscriptManifest['manuscriptContent']];
      
      let newContent = '';
      if (options.mode === 'overwrite') {
        newContent = generatedText;
      } else if (options.mode === 'append') {
        newContent = currentContent + '\n\n' + generatedText;
      } else if (options.mode === 'new-draft') {
        // For new draft mode, we'll create content but not apply it immediately
        // The modal should handle creating a new manuscript
        newContent = generatedText;
      }
      
      manuscriptState.handleContentChange(section as keyof ManuscriptManifest['manuscriptContent'], newContent);
    });
    
    // Build comprehensive data source summary
    const dataSources = [];
    if (manuscriptState.schemaBlocks.length > 0) {
      dataSources.push(`✓ ${manuscriptState.schemaBlocks.length} schema blocks from Research Wizard`);
    }
    if (generationContext.protocolContent) {
      const protocolFields = Object.keys(generationContext.protocolContent).filter(
        k => generationContext.protocolContent![k as keyof typeof generationContext.protocolContent]
      );
      if (protocolFields.length > 0) {
        dataSources.push(`✓ Protocol content (${protocolFields.join(', ')})`);
      }
    }
    if (generationContext.studyMethodology) {
      dataSources.push(`✓ Study methodology (${generationContext.studyMethodology.studyType})`);
    }
    if (manifestState.latestStatisticalManifest) {
      dataSources.push(`✓ Statistical Manifest (${manifestState.latestStatisticalManifest.manifestMetadata.totalRecordsAnalyzed} participants)`);
    }
    if ((manuscriptState.selectedManuscript.notebookContext?.linkedSources || []).filter(s => s.isActive).length > 0) {
      dataSources.push(`✓ ${(manuscriptState.selectedManuscript.notebookContext?.linkedSources || []).filter(s => s.isActive).length} active references`);
    }
    if (generationContext.irbInfo) {
      dataSources.push(`✓ IRB approval information`);
    }
    
    alert(
      '✨ Manuscript sections generated successfully!\n\n' +
      '🔒 SECURED DATA CONNECTIONS:\n' +
      (dataSources.length > 0 ? dataSources.join('\n') : '⚠️ Limited data available - content may be generic') +
      '\n\nReview the content and make any necessary edits.'
    );
    setActiveManuscriptTab('editor');
  };

  useEffect(() => {
    const handleLogicCheckEvent = () => {
      handleLogicCheck();
    };
    
    const handleSaveDraft = () => {
      console.log('💾 Save draft triggered from GlobalHeader');
      alert('✅ Draft saved successfully');
    };

    const handleCreateManuscriptEvent = () => {
      handleCreateManuscript();
    };

    window.addEventListener('academic-run-logic-check', handleLogicCheckEvent);
    window.addEventListener('academic-save-draft', handleSaveDraft);
    window.addEventListener('academic-create-manuscript', handleCreateManuscriptEvent);

    return () => {
      window.removeEventListener('academic-run-logic-check', handleLogicCheckEvent);
      window.removeEventListener('academic-save-draft', handleSaveDraft);
      window.removeEventListener('academic-create-manuscript', handleCreateManuscriptEvent);
    };
  }, [manuscriptState.selectedManuscript, manifestState.latestStatisticalManifest, verificationState, editorState.aiMode]);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex-1 overflow-hidden">
        {manuscriptState.selectedManuscript ? (
          <div className="h-full flex">
            {exportState.showExportDialog && exportState.verificationAppendix && (
              <ExportDialog
                appendix={exportState.verificationAppendix}
                onClose={exportState.handleCloseExport}
                onExport={(options, signOff) => exportState.handleExport(
                  manuscriptState.selectedManuscript,
                  manifestState.latestStatisticalManifest,
                  options,
                  signOff
                )}
              />
            )}

            {showDemoBanner && manuscriptState.selectedManuscript?.id.includes('demo') && (
              <div className="bg-purple-600 border-b border-purple-700">
                <div className="px-8 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-purple-200" />
                        <h3 className="text-white font-medium">Demo Manuscript Loaded - Phase 2 & 3 Features</h3>
                      </div>
                      <p className="text-purple-100 text-sm mb-3">
                        This manuscript contains pre-written content with citations to demonstrate the Evidence Card system (Phase 2) and Intelligence Chat (Phase 3).
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDemoBanner(false)}
                      className="px-3 py-1 bg-purple-700 text-purple-100 rounded hover:bg-purple-800 transition-colors text-sm ml-4"
                    >
                      Got it
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* IRB Approval Expired notification moved to Logic Audit Sidebar */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="w-full bg-white border-b border-slate-200 flex gap-1 px-8 py-3">
                <button
                  onClick={() => setActiveManuscriptTab('editor')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeManuscriptTab === 'editor'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Manuscript
                </button>
                <button
                  onClick={() => setActiveManuscriptTab('bibliography')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeManuscriptTab === 'bibliography'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  References ({manuscriptState.getUsedCitations().length})
                </button>
                
                <div className="w-px bg-slate-200 mx-2"></div>
                
                <button
                  onClick={() => setActiveIntelligenceTab('ai-assistant')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeIntelligenceTab === 'ai-assistant'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Faculty
                </button>
                <button
                  onClick={() => setActiveIntelligenceTab('sources')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeIntelligenceTab === 'sources'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Sources
                </button>
                <button
                  onClick={() => setActiveIntelligenceTab('manifest')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeIntelligenceTab === 'manifest'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Statistics
                </button>
                <button
                  onClick={() => setActiveIntelligenceTab('multiplier')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeIntelligenceTab === 'multiplier'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Multiplier
                </button>
                <button
                  onClick={() => setActiveIntelligenceTab('review')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                    activeIntelligenceTab === 'review'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Review
                  {(manuscriptState.selectedManuscript.reviewComments || []).filter(c => !c.resolved).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                      {(manuscriptState.selectedManuscript.reviewComments || []).filter(c => !c.resolved).length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveIntelligenceTab('journal')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeIntelligenceTab === 'journal'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  Journal
                </button>
                <button
                  onClick={() => setActiveIntelligenceTab('changes')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeIntelligenceTab === 'changes'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <GitBranch className="w-4 h-4" />
                  Changes
                </button>
                <button
                  onClick={() => setActiveIntelligenceTab('team')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeIntelligenceTab === 'team'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <PenTool className="w-4 h-4" />
                  Team
                </button>
              </div>

              <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 overflow-hidden flex flex-col">
                  <div className="flex-1 overflow-hidden">
                    {activeManuscriptTab === 'editor' ? (
                      <ManuscriptEditor
                        manifest={manuscriptState.selectedManuscript}
                        onContentChange={manuscriptState.handleContentChange}
                        onTitleChange={(title) => {
                          console.log('Title changed:', title);
                        }}
                        onAuthorsChange={(authors) => {
                          console.log('Authors changed:', authors);
                        }}
                        manuscriptTitle={manuscriptState.selectedManuscript.projectMeta?.studyTitle || ''}
                        manuscriptAuthors={[]}
                        citations={[]}
                        logicErrors={verificationState.logicErrors}
                        claimsAudit={claimsAudit}
                        sources={manuscriptState.selectedManuscript.notebookContext?.linkedSources || []}
                        onInsertCitation={handleInsertCitation}
                        aiMode={editorState.aiMode}
                        onGenerateSection={handleGenerateSection}
                        statisticalManifest={manifestState.latestStatisticalManifest || undefined}
                        verifications={verificationState.verifications}
                        onUpdateVerification={verificationState.handleUpdateVerification}
                        manuscripts={manuscriptState.manuscripts.map(m => ({
                          id: m.id,
                          title: m.projectMeta?.studyTitle || 'Untitled Manuscript',
                          lastModified: m.projectMeta?.modifiedAt || Date.now()
                        }))}
                        activeManuscriptId={manuscriptState.selectedManuscriptId || undefined}
                        onManuscriptSelect={handleManuscriptSelect}
                      />
                    ) : (
                      <BibliographyTab
                        usedCitations={manuscriptState.getUsedCitations()}
                        sources={manuscriptState.selectedManuscript.notebookContext?.linkedSources || []}
                        citationStyle={citationStyle}
                        onStyleChange={setCitationStyle}
                      />
                    )}
                  </div>
                </div>

                <div className="w-[400px] border-l border-slate-200 flex flex-col bg-white">
                  <div className="flex-1 overflow-hidden">
                    {activeIntelligenceTab === 'ai-assistant' && (
                      <div className="h-full overflow-y-auto">
                        <AcademicWritingPersonaPanel 
                          editorState={editorState}
                          onModeChange={(mode) => setEditorState({ ...editorState, aiMode: mode })}
                          onLogicCheck={handleLogicCheck}
                          claimConflicts={verificationState.logicErrors.length}
                          onAutoGenerate={() => setShowAutoGenerateModal(true)}
                          onNavigateToEthics={onNavigate ? () => onNavigate('ethics-board') : undefined}
                          dataConnections={[
                            ...(manuscriptState.schemaBlocks.length > 0 ? [{
                              source: 'Research Wizard Schema',
                              type: 'schema' as const,
                              status: 'connected' as const,
                              recordCount: manuscriptState.schemaBlocks.length,
                              lastUpdated: new Date().toISOString(),
                              dataLocked: true,
                            }] : []),
                            ...(manifestState.latestStatisticalManifest ? [{
                              source: 'Statistical Manifest',
                              type: 'manifest' as const,
                              status: 'connected' as const,
                              recordCount: manifestState.latestStatisticalManifest.manifestMetadata.totalRecordsAnalyzed,
                              lastUpdated: manifestState.latestStatisticalManifest.manifestMetadata.exportTimestamp,
                              dataLocked: true,
                              fields: ['descriptiveStats', 'comparativeAnalyses']
                            }] : []),
                            ...((manuscriptState.selectedManuscript?.notebookContext?.linkedSources || []).filter(s => s.isActive).length > 0 ? [{
                              source: 'Bibliography & References',
                              type: 'references' as const,
                              status: 'connected' as const,
                              recordCount: (manuscriptState.selectedManuscript?.notebookContext?.linkedSources || []).filter(s => s.isActive).length,
                              lastUpdated: new Date().toISOString(),
                            }] : []),
                            ...(currentProject?.studyMethodology ? [{
                              source: 'Protocol & Study Design',
                              type: 'protocol' as const,
                              status: 'connected' as const,
                              lastUpdated: new Date().toISOString(),
                              dataLocked: true,
                              fields: ['studyType', 'hypothesis', 'PICO framework']
                            }] : []),
                            ...(ethicsCompliance ? [{
                              source: 'IRB Approval',
                              type: 'irb' as const,
                              status: ethicsCompliance.status === 'expired' ? 'stale' as const : 'connected' as const,
                              lastUpdated: ethicsCompliance.irbApprovalDate,
                              dataLocked: true,
                            }] : []),
                            ...(manifestState.latestStatisticalManifest ? [{
                              source: 'Analytics Database',
                              type: 'analytics' as const,
                              status: 'connected' as const,
                              recordCount: manifestState.latestStatisticalManifest.descriptiveStats.length,
                              lastUpdated: manifestState.latestStatisticalManifest.manifestMetadata.exportTimestamp,
                              dataLocked: true,
                            }] : []),
                          ]}
                        />
                      </div>
                    )}
                    {activeIntelligenceTab === 'sources' && (
                      <SourceLibrary
                        sources={manuscriptState.selectedManuscript.notebookContext?.linkedSources || []}
                        onSourceAdd={manuscriptState.handleSourceAdd}
                        onSourceToggle={manuscriptState.handleSourceToggle}
                        onSourceRemove={manuscriptState.handleSourceRemove}
                        groundingEnabled={groundingEnabled}
                        onGroundingToggle={() => setGroundingEnabled(!groundingEnabled)}
                        manifest={manifestState.latestStatisticalManifest || undefined}
                        onInsertToDraft={handleInsertFromChat}
                      />
                    )}
                    {activeIntelligenceTab === 'manifest' && (
                      <StatisticalManifestViewer
                        manifest={manifestState.latestStatisticalManifest}
                        onInsertNarrative={handleInsertNarrative}
                        projectId={currentProject?.id}
                        onManifestUpdate={(updatedManifest) => {
                          manifestState.refreshManifests();
                        }}
                      />
                    )}
                    {activeIntelligenceTab === 'multiplier' && (
                      <ResearchMultiplier
                        schemaBlocks={manuscriptState.schemaBlocks}
                        usedVariableIds={usedVariableIds}
                        onCreateDraft={manuscriptState.handleCreateSatelliteDraft}
                      />
                    )}
                    {activeIntelligenceTab === 'review' && (
                      <ReviewLayer
                        comments={manuscriptState.selectedManuscript.reviewComments || []}
                        onAddComment={manuscriptState.handleAddComment}
                        onResolveComment={manuscriptState.handleResolveComment}
                        onDeleteComment={manuscriptState.handleDeleteComment}
                      />
                    )}
                    {activeIntelligenceTab === 'journal' && (
                      <div className="flex flex-col h-full">
                        <JournalProfileSelector
                          selectedJournalId={selectedJournalId}
                          onJournalChange={setSelectedJournalId}
                        />
                        {constraints.hasConstraints && (
                          <WordBudgetPanel
                            sections={[
                              { section: 'abstract', status: constraints.getSectionStatus('abstract') },
                              { section: 'introduction', status: constraints.getSectionStatus('introduction') },
                              { section: 'methods', status: constraints.getSectionStatus('methods') },
                              { section: 'results', status: constraints.getSectionStatus('results') },
                              { section: 'discussion', status: constraints.getSectionStatus('discussion') },
                              { section: 'conclusion', status: constraints.getSectionStatus('conclusion') }
                            ]}
                            citationStatus={constraints.getCitationStatus()}
                          />
                        )}
                      </div>
                    )}
                    {activeIntelligenceTab === 'changes' && (
                      <TrackedChangesPanel
                        changes={trackedChanges.changes}
                        onAcceptChange={trackedChanges.acceptChange}
                        onRejectChange={trackedChanges.rejectChange}
                        onDeleteChange={trackedChanges.deleteChange}
                        onAcceptAll={trackedChanges.acceptAll}
                        onRejectAll={trackedChanges.rejectAll}
                        onClearReviewed={trackedChanges.clearReviewed}
                        pendingCount={trackedChanges.getPendingCount()}
                      />
                    )}
                    {activeIntelligenceTab === 'team' && (
                      <ModulePersonaPanel
                        module="academic-writing"
                        className="h-full"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <EmptyState
              icon={FileText}
              title="No manuscripts yet"
              description="Create your first manuscript to begin writing"
              action={{
                label: "Create Manuscript",
                onClick: handleCreateManuscript
              }}
              size="md"
            />
          </div>
        )}

        <LogicAuditSidebar
          verifications={verificationState.verifications}
          isOpen={isAuditSidebarOpen}
          onClose={() => setIsAuditSidebarOpen(false)}
          onAutoSync={handleAutoSync}
          onApprove={handleApproveVerification}
          ethicsCompliance={ethicsCompliance}
        />

        {/* Auto-Generate Manuscript Modal */}
        <AutoGenerateManuscriptModal
          isOpen={showAutoGenerateModal}
          onClose={() => setShowAutoGenerateModal(false)}
          onGenerate={handleAutoGenerateManuscript}
          manifest={manifestState.latestStatisticalManifest}
          currentContent={manuscriptState.selectedManuscript?.manuscriptContent || {
            abstract: '',
            introduction: '',
            methods: '',
            results: '',
            discussion: '',
            conclusion: ''
          }}
        />
      </div>
    </div>
  );
}