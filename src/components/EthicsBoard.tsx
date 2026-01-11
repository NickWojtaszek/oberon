/**
 * Ethics Board & IRB Tracker - Professional Dual-Panel Workspace
 * Regulatory compliance and IRB submission management
 */

import { useState, useEffect } from 'react';
import { 
  FileCheck, 
  Upload, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  Download, 
  Filter, 
  Calendar, 
  FileText, 
  Shield, 
  TrendingUp, 
  History,
  Info,
  Eye,
  X,
  Edit2,
  Trash2,
  ClipboardList,
  BarChart3,
  Database
} from 'lucide-react';
import { useProject } from '../contexts/ProtocolContext';
import { IRBSubmissionCard } from './ethics-board/IRBSubmissionCard';
import { DocumentUploadPanel } from './ethics-board/DocumentUploadPanel';
import { RegulatoryAssistant } from './ethics-board/RegulatoryAssistant';
import { AuditLogViewer } from './ethics-board/AuditLogViewer';
import { EthicsPersonaCard } from './ethics-board/EthicsPersonaCard';
import { EmptyState } from './ui/EmptyState';
import { ModulePersonaPanel } from './ai-personas/ui/ModulePersonaPanel';
import { getAuditLogger } from '../utils/auditLogger';
import type { AutonomyMode } from '../types/accountability';
import type { IRBSubmission, EthicsCompliance, SubmissionStatus, Country, RegulatoryContext, DocumentMetadata } from '../types/ethics';

type MainView = 'submissions' | 'documents' | 'timeline' | 'review';
// REMOVED: type SidebarView = 'ai-assistant' | 'regulatory' | 'statistics' | 'audit' | 'guide';

interface EthicsBoardProps {
  onNavigate?: (tab: string) => void;
}

export function EthicsBoard({ onNavigate }: EthicsBoardProps = {}) {
  const { currentProject } = useProject();
  
  const [currentView, setCurrentView] = useState<MainView>('submissions');
  // REMOVED: const [activeSidebarView, setActiveSidebarView] = useState<SidebarView>('ai-assistant');
  const [autonomyMode, setAutonomyMode] = useState<AutonomyMode>('audit');
  const [ethicsCompliance, setEthicsCompliance] = useState<EthicsCompliance | null>(null);
  const [filterStatus, setFilterStatus] = useState<SubmissionStatus | 'ALL'>('ALL');
  const [showNewSubmissionDialog, setShowNewSubmissionDialog] = useState(false);
  const [documentPanelSubmissionId, setDocumentPanelSubmissionId] = useState<string | null>(null);

  // Load ethics compliance data from localStorage
  useEffect(() => {
    if (!currentProject) return;

    const storageKey = `ethics_compliance_${currentProject.id}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      setEthicsCompliance(JSON.parse(stored));
    } else {
      // Initialize with demo data for MVP
      const initialCompliance: EthicsCompliance = {
        projectId: currentProject.id,
        country: 'Poland',
        irbStatus: 'APPROVED',
        approvalNumber: '2024/KB/123',
        approvalDate: '2024-01-15',
        expirationDate: '2025-01-15',
        renewalDueDate: '2024-12-15',
        submissions: [
          {
            id: 'sub_001',
            projectId: currentProject.id,
            type: 'INITIAL',
            status: 'APPROVED',
            protocolNumber: 'CARDIO-2024-001',
            protocolVersion: 'v1.0',
            committeeName: 'Bioethics Committee - Medical University of Warsaw',
            submittedBy: 'user_pi',
            submittedByName: 'Dr. Anna Kowalska',
            approvedBy: 'user_pi',
            approvedByName: 'Dr. Anna Kowalska',
            documents: [
              {
                id: 'doc_001',
                name: 'Informed_Consent_v1.pdf',
                type: 'ICF',
                uploadedAt: '2024-01-10',
                uploadedBy: 'user_pi'
              },
              {
                id: 'doc_002',
                name: 'Protocol_v1.0.pdf',
                type: 'PROTOCOL',
                uploadedAt: '2024-01-10',
                uploadedBy: 'user_pi'
              },
              {
                id: 'doc_003',
                name: 'PI_CV_Kowalska.pdf',
                type: 'PI_CV',
                uploadedAt: '2024-01-10',
                uploadedBy: 'user_pi'
              }
            ],
            createdAt: '2024-01-10',
            submittedAt: '2024-01-12',
            decidedAt: '2024-01-15',
            reviewNotes: 'Approved without modifications. Annual continuing review required.'
          }
        ],
        lastUpdated: new Date().toISOString()
      };
      
      setEthicsCompliance(initialCompliance);
      localStorage.setItem(storageKey, JSON.stringify(initialCompliance));
    }
  }, [currentProject]);

  // Save ethics compliance when it changes
  useEffect(() => {
    if (!currentProject || !ethicsCompliance) return;
    const storageKey = `ethics_compliance_${currentProject.id}`;
    localStorage.setItem(storageKey, JSON.stringify(ethicsCompliance));
  }, [ethicsCompliance, currentProject]);

  // Listen for create submission event from GlobalHeader
  useEffect(() => {
    const handleCreateSubmissionEvent = () => {
      setShowNewSubmissionDialog(true);
    };

    window.addEventListener('ethics-create-submission', handleCreateSubmissionEvent);

    return () => {
      window.removeEventListener('ethics-create-submission', handleCreateSubmissionEvent);
    };
  }, []);

  const handleCreateSubmission = () => {
    if (!ethicsCompliance) return;

    const newSubmission: IRBSubmission = {
      id: `sub_${Date.now()}`,
      projectId: currentProject!.id,
      type: 'INITIAL',
      status: 'DRAFT',
      protocolVersion: 'v1.0',
      committeeName: 'Bioethics Committee - Medical University of Warsaw',
      submittedBy: 'user_pi',
      submittedByName: 'Dr. Anna Kowalska',
      documents: [],
      createdAt: new Date().toISOString()
    };

    setEthicsCompliance({
      ...ethicsCompliance,
      submissions: [...ethicsCompliance.submissions, newSubmission],
      lastUpdated: new Date().toISOString()
    });

    // Audit log
    const logger = getAuditLogger(currentProject!.id);
    logger.log(
      'SUBMISSION_CREATED',
      'user_pi',
      'Dr. Anna Kowalska',
      'PI',
      {
        metadata: {
          submissionId: newSubmission.id,
          type: newSubmission.type,
          protocolVersion: newSubmission.protocolVersion
        }
      },
      newSubmission.id
    );

    setShowNewSubmissionDialog(false);
    alert('✅ New submission draft created. You can now add documents and submit for review.');
  };

  const handleEditSubmission = (submissionId: string) => {
    alert(`📝 Editing submission ${submissionId}. Full editor coming in next update.`);
  };

  const handleViewDocuments = (submissionId: string) => {
    setDocumentPanelSubmissionId(submissionId);
  };

  const handleDocumentsUpdate = (submissionId: string, documents: DocumentMetadata[]) => {
    if (!ethicsCompliance) return;

    setEthicsCompliance({
      ...ethicsCompliance,
      submissions: ethicsCompliance.submissions.map(s =>
        s.id === submissionId ? { ...s, documents } : s
      ),
      lastUpdated: new Date().toISOString()
    });
  };

  const getRegulatoryContext = (): RegulatoryContext => {
    return {
      country: ethicsCompliance?.country || 'Poland',
      studyPhase: 'III',
      studyType: 'Drug',
      multiCenter: false
    };
  };

  const getStatusCounts = () => {
    if (!ethicsCompliance) return { draft: 0, submitted: 0, underReview: 0, approved: 0, rejected: 0 };
    
    return {
      draft: ethicsCompliance.submissions.filter(s => s.status === 'DRAFT').length,
      submitted: ethicsCompliance.submissions.filter(s => s.status === 'SUBMITTED').length,
      underReview: ethicsCompliance.submissions.filter(s => s.status === 'UNDER_REVIEW').length,
      approved: ethicsCompliance.submissions.filter(s => s.status === 'APPROVED').length,
      rejected: ethicsCompliance.submissions.filter(s => s.status === 'REJECTED').length
    };
  };

  const filteredSubmissions = ethicsCompliance?.submissions.filter(s => 
    filterStatus === 'ALL' || s.status === filterStatus
  ) || [];

  const statusCounts = getStatusCounts();
  const canEditSubmissions = true; // Placeholder for user role check

  const isRenewalDueSoon = ethicsCompliance?.renewalDueDate && 
    new Date(ethicsCompliance.renewalDueDate).getTime() - Date.now() < (30 * 24 * 60 * 60 * 1000);

  const isExpired = ethicsCompliance?.expirationDate && 
    new Date(ethicsCompliance.expirationDate).getTime() < Date.now();

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-250px)]">
        <EmptyState
          preset="noProjectSelected"
          onAction={onNavigate ? () => onNavigate('project-library') : undefined}
          size="md"
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Navigation Tabs - Professional Layout */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-8 py-3">
          <div className="flex gap-1">
            {/* Main Panel Tabs - ONLY main content views */}
            <button
              onClick={() => setCurrentView('submissions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'submissions'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Submissions
            </button>
            <button
              onClick={() => setCurrentView('documents')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'documents'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Upload className="w-4 h-4" />
              Documents
            </button>
            <button
              onClick={() => setCurrentView('timeline')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'timeline'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Clock className="w-4 h-4" />
              Timeline
            </button>
            <button
              onClick={() => setCurrentView('review')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'review'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Eye className="w-4 h-4" />
              Review
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Two-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Panel */}
        <div className="flex-1 overflow-y-auto">
          {/* Global Alert Banners */}
          {/* IRB Approval Expired notification moved to Regulatory Assistant sidebar */}

          {isRenewalDueSoon && !isExpired && (
            <div className="bg-amber-600 border-b border-amber-700 px-8 py-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-amber-200 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-white">Continuing Review Due Soon</div>
                  <div className="text-sm text-amber-100 mt-0.5">
                    Annual review due by {ethicsCompliance?.renewalDueDate && new Date(ethicsCompliance.renewalDueDate).toLocaleDateString()}
                  </div>
                </div>
                <button className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-sm font-medium transition-colors">
                  Prepare Renewal
                </button>
              </div>
            </div>
          )}

          {ethicsCompliance?.irbStatus === 'APPROVED' && !isExpired && (
            <div className="bg-green-600 border-b border-green-700 px-8 py-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-200 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-white">Active IRB Approval</div>
                  <div className="text-sm text-green-100 mt-0.5">
                    Approval #{ethicsCompliance.approvalNumber} · Valid until {ethicsCompliance.expirationDate && new Date(ethicsCompliance.expirationDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content based on current view */}
          <div className="p-8">
            <div className="max-w-[1600px] mx-auto">
              {currentView === 'submissions' && (
                <div>
                  {/* Status Summary Cards */}
                  <div className="grid grid-cols-5 gap-3 mb-6">
                    <div className="px-4 py-3 bg-white border border-slate-200 rounded-lg">
                      <div className="text-xs text-slate-600 mb-1">Draft</div>
                      <div className="text-xl font-medium text-slate-900">{statusCounts.draft}</div>
                    </div>
                    <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-xs text-blue-600 mb-1">Submitted</div>
                      <div className="text-xl font-medium text-blue-900">{statusCounts.submitted}</div>
                    </div>
                    <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="text-xs text-amber-600 mb-1">Under Review</div>
                      <div className="text-xl font-medium text-amber-900">{statusCounts.underReview}</div>
                    </div>
                    <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-xs text-green-600 mb-1">Approved</div>
                      <div className="text-xl font-medium text-green-900">{statusCounts.approved}</div>
                    </div>
                    <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="text-xs text-red-600 mb-1">Rejected</div>
                      <div className="text-xl font-medium text-red-900">{statusCounts.rejected}</div>
                    </div>
                  </div>

                  {/* Filter Bar */}
                  <div className="flex items-center gap-3 mb-6">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <div className="flex gap-2">
                      {(['ALL', 'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] as const).map(status => (
                        <button
                          key={status}
                          onClick={() => setFilterStatus(status)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            filterStatus === status
                              ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                          }`}
                        >
                          {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                    
                    {/* Cross-Module Navigation: Ethics → Database */}
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('database')}
                        className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors border border-blue-200"
                        title="View related clinical data records"
                      >
                        <Database className="w-4 h-4" />
                        View Related Data
                      </button>
                    )}
                  </div>

                  {/* Submissions List */}
                  {filteredSubmissions.length > 0 ? (
                    <div className="space-y-4">
                      {filteredSubmissions.map(submission => (
                        <IRBSubmissionCard
                          key={submission.id}
                          submission={submission}
                          onEdit={handleEditSubmission}
                          onViewDocuments={handleViewDocuments}
                          canEdit={canEditSubmissions}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <EmptyState
                        icon={FileText}
                        title="No submissions found"
                        description={filterStatus !== 'ALL' 
                          ? "Try adjusting your filter settings to see more results" 
                          : "Create your first IRB submission to get started"}
                        action={filterStatus !== 'ALL' ? {
                          label: "Clear filter",
                          onClick: () => setFilterStatus('ALL')
                        } : undefined}
                        size="sm"
                      />
                    </div>
                  )}
                </div>
              )}

              {currentView === 'documents' && (
                <div className="flex items-center justify-center h-96">
                  <EmptyState
                    icon={Upload}
                    title="Document Management"
                    description="View and manage all submission documents across all IRB submissions"
                    size="md"
                  />
                </div>
              )}

              {currentView === 'timeline' && (
                <div className="flex items-center justify-center h-96">
                  <EmptyState
                    icon={Clock}
                    title="Submission Timeline"
                    description="Visual timeline of all IRB submissions and milestones"
                    size="md"
                  />
                </div>
              )}

              {currentView === 'review' && (
                <div className="flex items-center justify-center h-96">
                  <EmptyState
                    icon={Eye}
                    title="Committee Review"
                    description="Track committee feedback and decision history"
                    size="md"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - ModulePersonaPanel (400px fixed width) */}
        <ModulePersonaPanel module="ethics-board" />
      </div>

      {/* New Submission Dialog */}
      {showNewSubmissionDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="font-medium text-slate-900">Create New Submission</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-slate-600 mb-4">
                This will create a new IRB submission draft for the current project. 
                You can add documents and submit for committee review.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Submission Type
                  </label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                    <option>Initial Submission</option>
                    <option>Amendment</option>
                    <option>Renewal</option>
                    <option>Continuing Review</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex gap-3">
              <button
                onClick={() => setShowNewSubmissionDialog(false)}
                className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSubmission}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Create Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Panel */}
      {documentPanelSubmissionId && (() => {
        const submission = ethicsCompliance?.submissions.find(s => s.id === documentPanelSubmissionId);
        if (!submission) return null;
        
        return (
          <DocumentUploadPanel
            submissionId={documentPanelSubmissionId}
            documents={submission.documents}
            onDocumentsUpdate={(docs) => handleDocumentsUpdate(documentPanelSubmissionId, docs)}
            onClose={() => setDocumentPanelSubmissionId(null)}
            canEdit={canEditSubmissions}
          />
        );
      })()}
    </div>
  );
}