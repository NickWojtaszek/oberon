/**
 * Team DNA Configurator
 * Methodology-Driven Persona Assignment
 * Automatically populates required "Scientific Chain of Command"
 */

import { useState } from 'react';
import { 
  Users, 
  Shield, 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  Award,
  Eye,
  EyeOff,
  UserPlus,
  FileCheck,
  Activity
} from 'lucide-react';
import { 
  StudyType, 
  STUDY_METHODOLOGIES, 
  PersonaRequirement,
  validateTeamConfiguration 
} from '../../config/studyMethodology';
import { RigorBadge, PermissionBadge, AIAutonomyBadge, StatusBadge } from '../ui/StatusBadge';
import { WarningBox } from '../ui/AlertCard';
import { ConfirmationModal } from '../ui/ConfirmationModal';

interface TeamDNAConfiguratorProps {
  studyType: StudyType;
  onComplete?: (configuration: TeamConfiguration) => void;
  onBack?: () => void;
}

export interface TeamConfiguration {
  studyType: StudyType;
  assignedPersonas: AssignedPersona[];
  locked: boolean;
  piSignature?: string;
  timestamp?: string;
}

export interface AssignedPersona {
  role: string;
  userId?: string;
  userName?: string;
  permissionLevel: 'read' | 'write' | 'admin';
  blinded: boolean;
  aiAutonomyCap: 'audit-only' | 'suggest' | 'co-pilot' | 'supervisor';
  certified: boolean;
}

export function TeamDNAConfigurator({ 
  studyType, 
  onComplete, 
  onBack 
}: TeamDNAConfiguratorProps) {
  const methodology = STUDY_METHODOLOGIES[studyType];
  
  const [assignedPersonas, setAssignedPersonas] = useState<AssignedPersona[]>(
    methodology.requiredPersonas.map(req => ({
      role: req.role,
      permissionLevel: req.permissionLevel,
      blinded: req.blinded || false,
      aiAutonomyCap: req.aiAutonomyCap || 'suggest',
      certified: req.certificationRequired || false,
    }))
  );
  
  const [showBlindingDetails, setShowBlindingDetails] = useState(false);
  const [piAcknowledged, setPiAcknowledged] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);

  // Validation
  const validation = validateTeamConfiguration(
    studyType,
    assignedPersonas.map(p => p.role)
  );

  const handleLockConfiguration = () => {
    if (!validation.valid) return;
    
    const configuration: TeamConfiguration = {
      studyType,
      assignedPersonas,
      locked: true,
      piSignature: 'PI-' + Date.now(),
      timestamp: new Date().toISOString(),
    };
    
    onComplete?.(configuration);
  };

  return (
    <div className="h-full flex">
      {/* Main Configuration Area (Pane B) */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl text-slate-900 mb-2">
                  Team DNA Configuration
                </h2>
                <p className="text-slate-600 mb-4">
                  Required scientific chain of command for <strong>{methodology.name}</strong>
                </p>
                
                {/* Methodology Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <RigorBadge level={methodology.rigorLevel} />
                  {methodology.blindingProtocol !== 'none' && (
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 border border-indigo-300 rounded-lg text-xs font-medium flex items-center gap-1">
                      <EyeOff className="w-3 h-3" />
                      {methodology.blindingProtocol.toUpperCase()} Blinding
                    </span>
                  )}
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium">
                    Template: {methodology.governanceTemplate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Methodology Requirements */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-2">
                    Methodology Requirements
                  </h3>
                  <p className="text-sm text-blue-800 mb-3">
                    {methodology.description}
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      {methodology.allowsProspectiveData ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      )}
                      <span className="text-slate-700">
                        {methodology.allowsProspectiveData 
                          ? 'Prospective Data Allowed' 
                          : 'Historical Data Only'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {methodology.requiresDataSafetyMonitoring ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="text-slate-700">
                        {methodology.requiresDataSafetyMonitoring 
                          ? 'Safety Monitoring Required' 
                          : 'No Safety Monitoring'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Required Roles Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-900">
                  Required Roles ({assignedPersonas.length})
                </h3>
                {methodology.blindingProtocol !== 'none' && (
                  <button
                    onClick={() => setShowBlindingDetails(!showBlindingDetails)}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    {showBlindingDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showBlindingDetails ? 'Hide' : 'Show'} Blinding Details
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {methodology.requiredPersonas.map((persona, idx) => (
                  <div 
                    key={idx}
                    className={`bg-white border-2 rounded-xl p-6 transition-all ${
                      persona.blinded && showBlindingDetails
                        ? 'border-indigo-300 shadow-sm'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        persona.blinded ? 'bg-indigo-100' : 'bg-slate-100'
                      }`}>
                        {persona.blinded ? (
                          <EyeOff className="w-6 h-6 text-indigo-600" />
                        ) : (
                          <Users className="w-6 h-6 text-slate-600" />
                        )}
                      </div>

                      {/* Persona Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-slate-900">
                                {persona.role}
                              </h4>
                              {persona.mandatory && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 border border-red-300 rounded text-xs font-medium">
                                  MANDATORY
                                </span>
                              )}
                              {persona.certificationRequired && (
                                <Award className="w-4 h-4 text-amber-500" title="Certification Required" />
                              )}
                            </div>
                            {persona.certificationRequired && (
                              <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 inline-block">
                                ✓ Certificate of Regulatory Authority
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Permission & AI Autonomy */}
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          <PermissionBadge level={persona.permissionLevel} />
                          <AIAutonomyBadge level={persona.aiAutonomyCap || 'suggest'} />
                          {persona.blinded && (
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-medium flex items-center gap-1">
                              <EyeOff className="w-3 h-3" />
                              BLINDED
                            </span>
                          )}
                        </div>

                        {/* Blinding Details */}
                        {persona.blinded && showBlindingDetails && persona.restrictedVariables && (
                          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                            <div className="text-xs font-medium text-indigo-900 mb-2">
                              Restricted Variables (Hidden from this persona):
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {persona.restrictedVariables.map((variable, vIdx) => (
                                <code key={vIdx} className="px-2 py-0.5 bg-white border border-indigo-200 rounded text-xs text-indigo-800">
                                  {variable}
                                </code>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Exclusive Access */}
                        {persona.exclusiveAccess && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                            <div className="text-xs font-medium text-emerald-900 mb-2">
                              Exclusive Access:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {persona.exclusiveAccess.map((field, fIdx) => (
                                <code key={fIdx} className="px-2 py-0.5 bg-white border border-emerald-200 rounded text-xs text-emerald-800">
                                  {field}
                                </code>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Assign User Button */}
                      <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs flex items-center gap-1 transition-colors">
                        <UserPlus className="w-3 h-3" />
                        Assign
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Validation Warnings */}
            {validation.warnings.length > 0 && (
              <WarningBox>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-900 mb-2">
                      Configuration Warnings
                    </h3>
                    <div className="space-y-2">
                      {validation.warnings.map((warning, idx) => (
                        <div key={idx} className="text-sm text-amber-800 flex items-start gap-2">
                          <span className="text-amber-600">⚠</span>
                          <span>{warning}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <label className="flex items-center gap-2 text-sm text-amber-900">
                        <input 
                          type="checkbox"
                          checked={piAcknowledged}
                          onChange={(e) => setPiAcknowledged(e.target.checked)}
                          className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                        />
                        <span>I acknowledge these warnings and wish to proceed</span>
                      </label>
                    </div>
                  </div>
                </div>
              </WarningBox>
            )}

            {/* Persona Lock */}
            <div className="bg-white border-2 border-slate-300 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900 mb-2">
                    Finalize Team Structure
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Once locked, this team configuration will be enforced throughout the project lifecycle.
                    The Protocol Builder will unlock after PI verification.
                  </p>
                  <button
                    onClick={() => setShowLockModal(true)}
                    disabled={!validation.valid || (validation.warnings.length > 0 && !piAcknowledged)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    Lock Team Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t border-slate-200 px-8 py-4">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              Back to Study Design
            </button>
            <button
              onClick={() => setShowLockModal(true)}
              disabled={!validation.valid || (validation.warnings.length > 0 && !piAcknowledged)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Protocol Builder
              <FileCheck className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Contextual Sidebar (Pane C) */}
      <div className="w-96 bg-white border-l border-slate-200 flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="font-medium text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Methodology Guide
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Study Type Info */}
          <div>
            <h4 className="text-xs font-medium text-slate-700 mb-3 uppercase tracking-wider">
              Study Type
            </h4>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="font-medium text-slate-900 mb-1">
                {methodology.name}
              </div>
              <div className="text-xs text-slate-600">
                {methodology.description}
              </div>
            </div>
          </div>

          {/* Rigor Requirements */}
          <div>
            <h4 className="text-xs font-medium text-slate-700 mb-3 uppercase tracking-wider">
              Scientific Rigor
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-700">
                  Governance: {methodology.governanceTemplate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-700">
                  Rigor Level: {methodology.rigorLevel}
                </span>
              </div>
              {methodology.blindingProtocol !== 'none' && (
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span className="text-slate-700">
                    {methodology.blindingProtocol} blinding enforced
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Validation Status */}
          <div>
            <h4 className="text-xs font-medium text-slate-700 mb-3 uppercase tracking-wider">
              Validation Status
            </h4>
            {validation.valid ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-emerald-800 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>All requirements met</span>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-xs font-medium text-red-900 mb-2">
                  Missing Required Personas:
                </div>
                <div className="space-y-1">
                  {validation.missing.map((role, idx) => (
                    <div key={idx} className="text-xs text-red-800">
                      • {role}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lock Confirmation Modal */}
      {showLockModal && (
        <ConfirmationModal
          isOpen={showLockModal}
          onClose={() => setShowLockModal(false)}
          onConfirm={() => {
            handleLockConfiguration();
            setShowLockModal(false);
          }}
          title="Lock Team Configuration?"
          description="This will finalize your team structure and unlock the Protocol Builder. Changes will require PI re-approval."
          variant="default"
          icon={Lock}
          confirmText="Lock & Continue"
          cancelText="Cancel"
        />
      )}
    </div>
  );
}