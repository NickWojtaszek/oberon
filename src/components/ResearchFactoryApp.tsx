/**
 * Research Factory App
 * Unified Workspace with Golden Grid Layout
 */

import { useState, useRef } from 'react';
import { useProject, useProtocol } from '../contexts/ProtocolContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { storage } from '../utils/storageService';
import { generateExportPackage, downloadExportPackage } from '../utils/exportPackageGenerator';
import { generateDemoLineage } from '../utils/dataLineageTracer';
import { generateDemoMismatches } from '../utils/mismatchDetectionEngine';
import { checkExportCompliance } from '../utils/ethicsComplianceChecker';
import { getAuditLogger } from '../utils/auditLogger';
import { 
  WorkspaceShell, 
  NavigationPanel, 
  GlobalHeader, 
  LogicAuditSidebar,
  CustomJournalDialog,
  GenericJournalEditor 
} from './unified-workspace';
import { DashboardV2 } from './DashboardV2';
import { ProtocolLibraryScreen, type ProtocolLibraryScreenRef } from './ProtocolLibraryScreen';
import { PersonaEditor } from './PersonaEditor';
import { PersonaLibrary, type PersonaLibraryRef } from './PersonaLibrary';
import { FairyCourtPersonas } from './FairyCourtPersonas';
import { ProtocolWorkbench } from './ProtocolWorkbench';
import { ResearchWizard } from './ResearchWizard';
import { AcademicWriting } from './AcademicWriting';
import { GovernanceDashboard } from './governance/GovernanceDashboard';
import { EthicsBoard } from './EthicsBoard';
import { ProjectLibraryScreen, type ProjectLibraryScreenRef } from './ProjectLibraryScreen';
import { AnalyticsApp } from './AnalyticsApp';
import { DataImportExport } from './DataImportExport';
import { Database } from './Database';
import { ProjectSetup } from './ProjectSetup';
import { JOURNAL_LIBRARY, getGenericJournal, updateGenericJournal } from '../data/journalLibrary';
import type { NavigationTab } from './unified-workspace/NavigationPanel';
import type { MismatchCard, AutonomyMode, PaperType, JournalProfile } from '../types/accountability';

export function ResearchFactoryApp() {
  const { currentProject } = useProject(); // Compatibility shim from ProtocolContext
  const { currentProtocol } = useProtocol(); // Direct protocol access
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [logicAuditOpen, setLogicAuditOpen] = useState(false);
  
  // Ref for ProjectLibraryScreen to trigger create modal
  const projectLibraryRef = useRef<ProjectLibraryScreenRef>(null);
  
  // Ref for ProtocolLibraryScreen to trigger create new
  const protocolLibraryRef = useRef<ProtocolLibraryScreenRef>(null);
  
  // Ref for PersonaLibrary to trigger create new
  const personaLibraryRef = useRef<PersonaLibraryRef>(null);

  // Protocol IDs for loading specific protocol in workbench
  const [loadProtocolId, setLoadProtocolId] = useState<string | undefined>();
  const [loadVersionId, setLoadVersionId] = useState<string | undefined>();

  // Phase 4: Journal Constraints
  const [selectedJournal, setSelectedJournal] = useState<JournalProfile>(JOURNAL_LIBRARY[0]);
  const [paperType, setPaperType] = useState<PaperType>('original-research');
  
  // Custom journals and dialogs
  const [customJournals, setCustomJournals] = useState<JournalProfile[]>([]);
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [genericEditorOpen, setGenericEditorOpen] = useState(false);
  const [genericJournal, setGenericJournal] = useState<JournalProfile>(getGenericJournal());
  
  // Autonomy mode (defaults to 'audit' for clinical integrity)
  const [autonomyMode, setAutonomyMode] = useState<AutonomyMode>('audit');
  
  // Phase 4: Mismatch detection
  const [mismatches, setMismatches] = useState<MismatchCard[]>([]);
  
  // Handler for running logic check
  const handleRunLogicCheck = () => {
    // Generate demo mismatches for testing
    // In production, this would call detectMismatches() with real manuscript content
    const demoMismatches = generateDemoMismatches(currentProject?.id || 'demo');
    setMismatches(demoMismatches);
    setLogicAuditOpen(true);
  };
  
  // Handler for auto-fixing a mismatch
  const handleAutoFix = (mismatchId: string) => {
    setMismatches(prev => prev.map(m => 
      m.id === mismatchId 
        ? { ...m, status: 'auto-fixed', resolvedAt: new Date().toISOString() }
        : m
    ));
  };
  
  // Handler for manual approval
  const handleManualApprove = (mismatchId: string) => {
    setMismatches(prev => prev.map(m => 
      m.id === mismatchId 
        ? { ...m, status: 'manually-approved', resolvedAt: new Date().toISOString() }
        : m
    ));
  };
  
  // Handler for dismissing a mismatch
  const handleDismiss = (mismatchId: string) => {
    setMismatches(prev => prev.map(m => 
      m.id === mismatchId 
        ? { ...m, status: 'dismissed', resolvedAt: new Date().toISOString() }
        : m
    ));
  };
  
  // Handler for viewing in manuscript
  const handleViewInManuscript = (mismatchId: string) => {
    console.log('View in manuscript:', mismatchId);
    // Would scroll to the location in the editor
  };
  
  // Phase 5: Export Package Handler
  const handleExportPackage = async () => {
    try {
      // Get current manuscript from storage
      if (!currentProject) {
        alert('No project selected');
        return;
      }

      // Check IRB compliance FIRST - block export if not approved
      const complianceCheck = checkExportCompliance(currentProject.id);
      if (!complianceCheck.canExport) {
        // Log blocked export attempt
        const logger = getAuditLogger(currentProject.id);
        logger.log(
          'EXPORT_BLOCKED',
          user?.id || 'unknown',
          user?.name || 'Unknown User',
          user?.role || 'Unknown',
          {
            reason: complianceCheck.message,
            metadata: {
              status: complianceCheck.status,
              errors: complianceCheck.errors,
              warnings: complianceCheck.warnings
            }
          }
        );

        alert(complianceCheck.message + '\n\nGo to the Ethics & IRB tab to submit for approval.');
        return;
      }
      
      const manuscripts = storage.manuscripts.getAll(currentProject.id);
      if (!manuscripts || !Array.isArray(manuscripts) || manuscripts.length === 0) {
        alert('No manuscript found. Please create a manuscript first.');
        return;
      }
      
      const manuscript = manuscripts[0];
      
      // Generate demo data lineage
      const dataLineage = generateDemoLineage();
      
      // Generate export package
      const exportPackage = await generateExportPackage(
        manuscript,
        dataLineage,
        mismatches,
        selectedJournal,
        currentProject.id,
        user?.name || 'Dr. Principal Investigator'
      );
      
      // Download the package
      await downloadExportPackage(exportPackage, manuscript.title);
      
      // Log successful export
      const logger = getAuditLogger(currentProject.id);
      logger.log(
        'EXPORT_ALLOWED',
        user?.id || 'unknown',
        user?.name || 'Unknown User',
        user?.role || 'Unknown',
        {
          metadata: {
            manuscript: manuscript.title,
            journal: selectedJournal.name,
            approvalNumber: complianceCheck.status === 'APPROVED' ? 'See ethics compliance' : undefined,
            mismatchCount: mismatches.length
          }
        }
      );
      
      alert(`✅ Export package generated successfully!\n\n4 files downloaded:\n- Manuscript (HTML)\n- Verification Appendix (HTML)\n- Data Lineage Table (CSV)\n- Metadata (JSON)`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('❌ Export failed. See console for details.');
    }
  };

  // Dashboard uses full-width mode
  const isFullWidth = true; // All pages use full-width mode for edge-to-edge Global Header
  
  // Get all journals including custom ones and updated generic
  const allJournals = [
    ...JOURNAL_LIBRARY.filter(j => j.id !== 'generic'),
    genericJournal,
    ...customJournals
  ];

  // Inner component that has access to all state
  const ScreenRenderer = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="h-full flex flex-col">
            <GlobalHeader
              breadcrumbs={[
                { label: 'Clinical Trial Workflow' }
              ]}
              autonomyMode={autonomyMode}
              onAutonomyChange={setAutonomyMode}
            />
            <div className="flex-1 overflow-y-auto">
              <DashboardV2 onNavigate={(tab) => {
                // Map dashboard navigation to unified workspace tabs
                const tabMap: Record<string, NavigationTab> = {
                  'project-library': 'project-library',
                  'personas': 'persona-editor',
                  'persona-editor': 'persona-editor',
                  'protocol-builder': 'protocol-workbench',
                  'protocol-workbench': 'protocol-workbench',
                  'protocol-library': 'protocol-library',
                  'database': 'database',
                  'analytics': 'analytics',
                  'academic-writing': 'academic-writing',
                  'project-settings': 'project-setup',
                  'project-setup': 'project-setup',
                  'methodology': 'methodology-engine',
                  'methodology-engine': 'methodology-engine',
                  'irb': 'ethics',
                  'ethics': 'ethics',
                  'governance': 'governance',
                  'data-management': 'data-import-export',
                };
                
                const mappedTab = tabMap[tab];
                if (mappedTab) {
                  setActiveTab(mappedTab);
                }
              }} />
            </div>
          </div>
        );

      case 'project-library':
        return (
          <div className="h-full flex flex-col">
            <GlobalHeader
              breadcrumbs={[
                { label: 'Project Library' }
              ]}
              autonomyMode={autonomyMode}
              onAutonomyChange={setAutonomyMode}
              primaryAction={{
                label: 'Create New Project',
                onClick: () => projectLibraryRef.current?.openCreateModal(),
              }}
            />
            <div className="flex-1 overflow-y-auto">
              <ProjectLibraryScreen 
                ref={projectLibraryRef}
                onNavigateToProject={(projectId) => {
                  // Switch back to dashboard after selecting a project
                  setActiveTab('dashboard');
                }}
              />
            </div>
          </div>
        );

      case 'protocol-workbench':
        return (
          <div className="h-full flex flex-col">
            <GlobalHeader
              breadcrumbs={[
                { label: 'Protocol Workbench' }
              ]}
              autonomyMode={autonomyMode}
              onAutonomyChange={setAutonomyMode}
              primaryAction={{
                label: 'Save Draft',
                onClick: () => {
                  // Trigger save from workbench
                  const event = new CustomEvent('protocol-save-draft');
                  window.dispatchEvent(event);
                },
              }}
              secondaryActions={[
                {
                  label: 'Template Library',
                  onClick: () => {
                    const event = new CustomEvent('protocol-show-templates');
                    window.dispatchEvent(event);
                  },
                },
                {
                  label: 'AI Generate',
                  onClick: () => {
                    const event = new CustomEvent('protocol-show-ai-generator');
                    window.dispatchEvent(event);
                  },
                },
                {
                  label: 'Import Schema',
                  onClick: () => {
                    const event = new CustomEvent('protocol-import-schema');
                    window.dispatchEvent(event);
                  },
                },
                {
                  label: 'Export Schema',
                  onClick: () => {
                    const event = new CustomEvent('protocol-export-schema');
                    window.dispatchEvent(event);
                  },
                },
              ]}
            />
            <div className="flex-1 overflow-y-auto">
              <ProtocolWorkbench
                initialProtocolId={loadProtocolId}
                initialVersionId={loadVersionId}
                onNavigateToLibrary={() => {
                  setLoadProtocolId(undefined);
                  setLoadVersionId(undefined);
                  setActiveTab('protocol-library');
                }}
              />
            </div>
          </div>
        );

      case 'protocol-library':
        return (
          <div className="h-full flex flex-col">
            <GlobalHeader
              breadcrumbs={[
                { label: t('protocolLibrary:header.title') }
              ]}
              autonomyMode={autonomyMode}
              onAutonomyChange={setAutonomyMode}
              primaryAction={{
                label: 'Create New Protocol',
                onClick: () => protocolLibraryRef.current?.createNew(),
              }}
            />
            <div className="flex-1 overflow-y-auto">
              <ProtocolLibraryScreen
                ref={protocolLibraryRef}
                onNavigateToBuilder={(protocolId, versionId) => {
                  console.log('Navigate to builder:', protocolId, versionId);
                  // Set protocol IDs and navigate to workbench
                  setLoadProtocolId(protocolId);
                  setLoadVersionId(versionId);
                  setActiveTab('protocol-workbench');
                }}
              />
            </div>
          </div>
        );

      case 'academic-writing':
        return (
          <div className="h-full flex flex-col">
            <GlobalHeader
              breadcrumbs={[
                { label: 'Academic Writing' },
                { label: selectedJournal.shortName }
              ]}
              selectedJournal={selectedJournal}
              onJournalChange={setSelectedJournal}
              journalOptions={allJournals}
              onCreateCustomJournal={() => setCustomDialogOpen(true)}
              onEditGenericJournal={() => setGenericEditorOpen(true)}
              autonomyMode={autonomyMode}
              onAutonomyChange={setAutonomyMode}
              primaryAction={{
                label: 'Export Package',
                onClick: handleExportPackage,
              }}
              secondaryActions={[
                {
                  label: 'Create Manuscript',
                  onClick: () => {
                    // Trigger create manuscript via event
                    const event = new CustomEvent('academic-create-manuscript');
                    window.dispatchEvent(event);
                  },
                },
                {
                  label: 'Run Logic Check',
                  onClick: () => {
                    // Trigger logic check via event
                    const event = new CustomEvent('academic-run-logic-check');
                    window.dispatchEvent(event);
                  },
                },
                {
                  label: 'Save Draft',
                  onClick: () => {
                    // Trigger save via event
                    const event = new CustomEvent('academic-save-draft');
                    window.dispatchEvent(event);
                  },
                }
              ]}
            />
            <div className="flex-1 overflow-hidden">
              <AcademicWriting 
                selectedJournal={selectedJournal}
                onJournalChange={setSelectedJournal}
              />
            </div>
          </div>
        );

      case 'persona-editor':
        return (
          <div className="h-full flex flex-col">
            <GlobalHeader
              breadcrumbs={[
                { label: 'Persona Editor' }
              ]}
              autonomyMode={autonomyMode}
              onAutonomyChange={setAutonomyMode}
              primaryAction={{
                label: 'Save Persona',
                onClick: () => console.log('Save persona'),
              }}
            />
            <div className="flex-1 overflow-y-auto">
              <PersonaEditor />
            </div>
          </div>
        );

      case 'ai-personas':
        return (
          <div className="h-full flex flex-col">
            <GlobalHeader
              breadcrumbs={[
                { label: 'AI Personas' },
                { label: 'The Oberon Faculty' }
              ]}
              autonomyMode={autonomyMode}
              onAutonomyChange={setAutonomyMode}
            />
            <div className="flex-1 overflow-y-auto">
              <FairyCourtPersonas />
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="h-full flex flex-col">
            <GlobalHeader
              breadcrumbs={[
                { label: 'Analytics' }
              ]}
              autonomyMode={autonomyMode}
              onAutonomyChange={setAutonomyMode}
              secondaryActions={[
                {
                  label: 'Export Data',
                  onClick: () => console.log('Export data'),
                }
              ]}
            />
            <div className="flex-1 overflow-y-auto">
              <AnalyticsApp onNavigate={setActiveTab} />
            </div>
          </div>
        );

      case 'data-import-export':
        return (
          <div className="h-full flex flex-col">
            <GlobalHeader
              breadcrumbs={[
                { label: 'Data Management' }
              ]}
              autonomyMode={autonomyMode}
              onAutonomyChange={setAutonomyMode}
              primaryAction={{
                label: 'Import Data',
                onClick: () => console.log('Import data'),
              }}
              secondaryActions={[
                {
                  label: 'Export All',
                  onClick: () => console.log('Export all'),
                }
              ]}
            />
            <div className="flex-1 overflow-y-auto">
              <DataImportExport />
            </div>
          </div>
        );

      case 'governance':
        return (
          <div className="h-full flex flex-col">
            <GlobalHeader
              breadcrumbs={[
                { label: 'Governance' }
              ]}
              autonomyMode={autonomyMode}
              onAutonomyChange={setAutonomyMode}
            />
            <div className="flex-1 overflow-y-auto">
              <GovernanceDashboard />
            </div>
          </div>
        );

      case 'database':
        return (
          <div className="h-full flex flex-col">
            <GlobalHeader
              breadcrumbs={[
                { label: 'Database' },
                { label: 'Protocol-Generated Data' }
              ]}
              autonomyMode={autonomyMode}
              onAutonomyChange={setAutonomyMode}
              secondaryActions={[
                {
                  label: 'Export All Data',
                  onClick: () => console.log('Export all data'),
                }
              ]}
            />
            <div className="flex-1 overflow-y-auto">
              <Database />
            </div>
          </div>
        );

      case 'research-wizard':
        return (
          <div className="h-full">
            <ResearchWizard 
              onComplete={(hypothesis) => {
                console.log('Hypothesis completed:', hypothesis);
                // Navigate to Protocol Workbench where AI can help pre-fill objectives, criteria, and stats plan
                setActiveTab('protocol-workbench');
              }}
              onCancel={() => {
                setActiveTab('dashboard');
              }}
            />
          </div>
        );

      case 'project-setup':
        return (
          <div className="h-full">
            <ProjectSetup
              onComplete={() => {
                // Navigate to protocol workbench after completion
                setActiveTab('protocol-workbench');
              }}
              onCancel={() => {
                setActiveTab('dashboard');
              }}
            />
          </div>
        );

      case 'ethics':
        return (
          <div className="h-full flex flex-col">
            <GlobalHeader
              breadcrumbs={[
                { label: 'Ethics & IRB' }
              ]}
              autonomyMode={autonomyMode}
              onAutonomyChange={setAutonomyMode}
              primaryAction={{
                label: 'New Submission',
                onClick: () => {
                  // Trigger create submission via event
                  const event = new CustomEvent('ethics-create-submission');
                  window.dispatchEvent(event);
                },
              }}
            />
            <div className="flex-1 overflow-hidden">
              <EthicsBoard onNavigate={setActiveTab} />
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-slate-500">Screen: {activeTab}</p>
              <p className="text-xs text-slate-400 mt-2">Component mapping in progress</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <WorkspaceShell
        navigation={
          <NavigationPanel
            activeTab={activeTab}
            onTabChange={setActiveTab}
            projectName={currentProtocol?.protocolTitle || currentProject?.name}
          />
        }
        utilitySidebar={
          <LogicAuditSidebar
            isOpen={logicAuditOpen}
            onClose={() => setLogicAuditOpen(false)}
            mismatches={mismatches}
            onAutoFix={handleAutoFix}
            onManualApprove={handleManualApprove}
            onDismiss={handleDismiss}
            onViewInManuscript={handleViewInManuscript}
          />
        }
        utilitySidebarOpen={logicAuditOpen}
        fullWidth={isFullWidth}
      >
        <ScreenRenderer />
      </WorkspaceShell>
      
      {/* Custom Journal Dialog */}
      <CustomJournalDialog
        isOpen={customDialogOpen}
        onClose={() => setCustomDialogOpen(false)}
        onSave={(journal) => {
          setCustomJournals(prev => [...prev, journal]);
          setSelectedJournal(journal);
          setCustomDialogOpen(false);
        }}
      />
      
      {/* Generic Journal Editor */}
      <GenericJournalEditor
        isOpen={genericEditorOpen}
        onClose={() => setGenericEditorOpen(false)}
        currentConstraints={genericJournal.constraints}
        onSave={(constraints) => {
          const updated = updateGenericJournal(constraints);
          setGenericJournal(updated);
          // If generic is currently selected, update it
          if (selectedJournal.id === 'generic') {
            setSelectedJournal(updated);
          }
        }}
      />
    </div>
  );
}