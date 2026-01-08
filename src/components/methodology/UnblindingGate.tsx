/**
 * Unblinding Gate - "Break Glass" Protocol
 * PI-exclusive interface for formal study unblinding
 */

import { useState } from 'react';
import { 
  EyeOff, 
  Eye,
  AlertTriangle, 
  CheckCircle, 
  Lock,
  Unlock,
  FileText,
  Shield,
  Clock,
  Database,
  TrendingUp,
  FileCheck,
  X
} from 'lucide-react';
import { UnblindingChecklist, BlindingState } from '../../config/studyMethodology';
import { Checklist } from '../ui/ChecklistItem';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { AlertCard, WarningBox } from '../ui/AlertCard';

interface UnblindingGateProps {
  studyName: string;
  currentBlindingState: BlindingState;
  checklist: UnblindingChecklist;
  onUnblind?: (event: BlindingState['unblindingEvent']) => void;
  userRole: string;
}

export function UnblindingGate({ 
  studyName,
  currentBlindingState, 
  checklist, 
  onUnblind,
  userRole 
}: UnblindingGateProps) {
  const [showBreakGlassModal, setShowBreakGlassModal] = useState(false);
  const [piSignature, setPiSignature] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isUnblinding, setIsUnblinding] = useState(false);

  const isPrincipalInvestigator = userRole === 'Principal Investigator';
  const allChecklistComplete = Object.values(checklist).every(v => v === true);
  const canUnblind = isPrincipalInvestigator && allChecklistComplete && !currentBlindingState.unblindingEvent;

  const handleUnblind = () => {
    if (!canUnblind) return;
    if (confirmText !== 'UNBLIND') return;
    
    setIsUnblinding(true);
    
    // Simulate unblinding process
    setTimeout(() => {
      const unblindingEvent = {
        timestamp: new Date().toISOString(),
        performedBy: userRole,
        userId: 'PI-' + Date.now(),
        conditionsMet: true,
        manifestHash: 'a7f3e' + Math.random().toString(36).substring(7),
      };
      
      onUnblind?.(unblindingEvent);
      setIsUnblinding(false);
      setShowBreakGlassModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Blinding Status Header */}
      <div className={`border-2 rounded-xl p-6 ${
        currentBlindingState.isBlinded 
          ? 'bg-indigo-50 border-indigo-300' 
          : 'bg-emerald-50 border-emerald-300'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
            currentBlindingState.isBlinded 
              ? 'bg-indigo-100' 
              : 'bg-emerald-100'
          }`}>
            {currentBlindingState.isBlinded ? (
              <EyeOff className="w-7 h-7 text-indigo-600" />
            ) : (
              <Eye className="w-7 h-7 text-emerald-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className={`text-xl font-medium ${
                currentBlindingState.isBlinded ? 'text-indigo-900' : 'text-emerald-900'
              }`}>
                {currentBlindingState.isBlinded ? 'Study Currently Blinded' : 'Study Unblinded'}
              </h2>
              {currentBlindingState.isBlinded ? (
                <Lock className="w-5 h-5 text-indigo-600" />
              ) : (
                <Unlock className="w-5 h-5 text-emerald-600" />
              )}
            </div>
            <p className={`text-sm ${
              currentBlindingState.isBlinded ? 'text-indigo-800' : 'text-emerald-800'
            }`}>
              {currentBlindingState.isBlinded ? (
                <>
                  Treatment assignments are masked. Blinded personas see generic group labels (Group 1, Group 2).
                  Statistical analyses can proceed without bias.
                </>
              ) : (
                <>
                  Study has been formally unblinded. All personas now have access to true treatment assignments.
                  AI Writing Assistant is authorized to generate efficacy claims.
                </>
              )}
            </p>
            
            {/* Unblinding Event Details */}
            {currentBlindingState.unblindingEvent && (
              <div className="mt-4 bg-white border border-emerald-300 rounded-lg p-4">
                <div className="text-xs font-medium text-emerald-900 mb-2">
                  Unblinding Event (Audit Trail)
                </div>
                <div className="space-y-1 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>
                      {new Date(currentBlindingState.unblindingEvent.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-slate-500" />
                    <span>
                      Performed by: {currentBlindingState.unblindingEvent.performedBy} ({currentBlindingState.unblindingEvent.userId})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="w-3 h-3 text-slate-500" />
                    <span>
                      Manifest Hash: <code className="bg-slate-100 px-1 py-0.5 rounded">{currentBlindingState.unblindingEvent.manifestHash}</code>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unblinding Checklist (Only show if still blinded) */}
      {currentBlindingState.isBlinded && (
        <div className="bg-white border-2 border-slate-300 rounded-xl p-6">
          <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
            <FileCheck className="w-5 h-5" />
            Unblinding Checklist
          </h3>
          <div className="space-y-3">
            <ChecklistItem
              label="Protocol Schema Published"
              completed={checklist.protocolPublished}
              description="Protocol must be locked and version-controlled"
            />
            <ChecklistItem
              label="All Subject Records Complete"
              completed={checklist.allRecordsComplete}
              description="No missing data in primary endpoint variables"
            />
            <ChecklistItem
              label="Statistical Analysis Plan (SAP) Frozen"
              completed={checklist.statisticalPlanFrozen}
              description="Analysis methodology must be locked before unblinding"
            />
            <ChecklistItem
              label="Statistical Manifest Locked"
              completed={checklist.manifestLocked}
              description="All p-values and statistical tests finalized"
            />
            <ChecklistItem
              label="PI Digital Signature Required"
              completed={checklist.piSignatureRequired}
              description="Principal Investigator must authorize unblinding"
            />
          </div>
        </div>
      )}

      {/* Break Glass Button (PI Only, when blinded) */}
      {currentBlindingState.isBlinded && isPrincipalInvestigator && (
        <div className="bg-white border-2 border-slate-300 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-slate-900 mb-2">
                Perform Final Unblinding
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                This is a one-way operation. Once unblinded, treatment assignments will be revealed to all personas.
                This event will be permanently logged in the Scientific Receipt.
              </p>
              
              {!allChecklistComplete && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-amber-800">
                      <div className="font-medium mb-1">Checklist Incomplete</div>
                      <div>Complete all checklist items before unblinding.</div>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => setShowBreakGlassModal(true)}
                disabled={!canUnblind}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Eye className="w-4 h-4" />
                Perform Final Unblinding
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Access Restricted (Non-PI) */}
      {currentBlindingState.isBlinded && !isPrincipalInvestigator && (
        <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 text-slate-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-slate-700 mb-2">
                Unblinding Restricted to PI
              </h3>
              <p className="text-sm text-slate-600">
                Only the Principal Investigator can perform the final unblinding operation.
                Current role: <strong>{userRole}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Break Glass Modal */}
      {showBreakGlassModal && (
        <ConfirmationModal
          isOpen={showBreakGlassModal}
          onClose={() => setShowBreakGlassModal(false)}
          onConfirm={handleUnblind}
          title="⚠️ IRREVERSIBLE ACTION"
          description={`You are about to unblind: ${studyName}`}
          variant="danger"
          icon={AlertTriangle}
          confirmText="Confirm Unblinding"
          cancelText="Cancel"
          requiresConfirmation={true}
          confirmationWord="UNBLIND"
          requiresSignature={true}
          signatureLabel="Principal Investigator Digital Signature"
          isLoading={isUnblinding}
        >
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-sm text-slate-700">
            <div className="flex items-start gap-2">
              <span className="text-red-600 font-bold">•</span>
              <span>All Blinded Analyst personas will immediately see treatment assignments</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-600 font-bold">•</span>
              <span>AI Writing Assistant will be authorized to generate efficacy claims</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-600 font-bold">•</span>
              <span>Group placeholders (Group 1, Group 2) will be replaced with true labels</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-600 font-bold">•</span>
              <span>This event will be permanently logged in the Scientific Receipt</span>
            </div>
          </div>

          {/* Conditions Met Verification */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <div className="text-xs font-medium text-emerald-900 mb-2">
              ✓ All Pre-Conditions Met:
            </div>
            <div className="text-xs text-emerald-800 space-y-1">
              <div>• Statistical tests finalized prior to unblinding</div>
              <div>• Protocol Schema locked and version-controlled</div>
              <div>• Statistical Manifest frozen (Hash: a7f3e...)</div>
            </div>
          </div>
        </ConfirmationModal>
      )}
    </div>
  );
}

function ChecklistItem({ 
  label, 
  completed, 
  description 
}: { 
  label: string; 
  completed: boolean; 
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">
        {completed ? (
          <CheckCircle className="w-5 h-5 text-emerald-600" />
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
        )}
      </div>
      <div className="flex-1">
        <div className={`text-sm font-medium ${completed ? 'text-slate-900' : 'text-slate-500'}`}>
          {label}
        </div>
        <div className="text-xs text-slate-600 mt-0.5">
          {description}
        </div>
      </div>
    </div>
  );
}