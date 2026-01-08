/**
 * Step 2: Team Configuration (Wrapper)
 * Uses the existing TeamDNAConfigurator but adapted for wizard flow
 */

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
  ArrowRight,
  ArrowLeft,
  Activity
} from 'lucide-react';
import { useState } from 'react';
import { 
  StudyType, 
  STUDY_METHODOLOGIES,
  validateTeamConfiguration 
} from '../../../config/studyMethodology';
import { 
  TeamConfiguration as TeamConfig, 
  AssignedPersona 
} from '../../methodology/TeamDNAConfigurator';
import { WizardStepContent } from '../WizardShell';
import { RigorBadge, PermissionBadge, AIAutonomyBadge, StatusBadge } from '../../ui/StatusBadge';
import { WarningBox } from '../../ui/AlertCard';
import { ConfirmationModal } from '../../ui/ConfirmationModal';

interface TeamConfigurationProps {
  studyType: StudyType;
  onComplete: (config: TeamConfig) => void;
  onBack: () => void;
  existingConfig?: TeamConfig | null;
}

export function TeamConfiguration({ 
  studyType, 
  onComplete, 
  onBack,
  existingConfig 
}: TeamConfigurationProps) {
  const methodology = STUDY_METHODOLOGIES[studyType];
  
  const [assignedPersonas, setAssignedPersonas] = useState<AssignedPersona[]>(
    existingConfig?.assignedPersonas || methodology.requiredPersonas.map(req => ({
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

  const validation = validateTeamConfiguration(
    studyType,
    assignedPersonas.map(p => p.role)
  );

  const handleContinue = () => {
    if (!validation.valid) return;
    if (validation.warnings.length > 0 && !piAcknowledged) return;
    
    const configuration: TeamConfig = {
      studyType,
      assignedPersonas,
      locked: true,
      piSignature: 'PI-' + Date.now(),
      timestamp: new Date().toISOString(),
    };
    
    onComplete(configuration);
  };

  return (
    <WizardStepContent
      title="Team DNA Configuration"
      description={`Required scientific chain of command for ${methodology.name}`}
      icon={Users}
      sidebar={
        <div className="flex flex-col h-full">
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
      }
      footer={
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Study Design
          </button>
          <button
            onClick={handleContinue}
            disabled={!validation.valid || (validation.warnings.length > 0 && !piAcknowledged)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Hypothesis
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      }
    >
      <div className="space-y-6">
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

        {/* Required Roles */}
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
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    persona.blinded ? 'bg-indigo-100' : 'bg-slate-100'
                  }`}>
                    {persona.blinded ? (
                      <EyeOff className="w-6 h-6 text-indigo-600" />
                    ) : (
                      <Users className="w-6 h-6 text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-slate-900">
                        {persona.role}
                      </h4>
                      {persona.mandatory && (
                        <StatusBadge variant="error" size="xs">
                          MANDATORY
                        </StatusBadge>
                      )}
                      {persona.certificationRequired && (
                        <Award className="w-4 h-4 text-amber-500" title="Certification Required" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <PermissionBadge level={persona.permissionLevel} size="xs" />
                      <AIAutonomyBadge level={persona.aiAutonomyCap || 'suggest'} size="xs" />
                      {persona.blinded && (
                        <StatusBadge variant="indigo" size="xs">
                          <EyeOff className="w-3 h-3" />
                          BLINDED
                        </StatusBadge>
                      )}
                    </div>

                    {persona.blinded && showBlindingDetails && persona.restrictedVariables && (
                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                        <div className="text-xs font-medium text-indigo-900 mb-2">
                          Restricted Variables:
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
                  </div>

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
          </WarningBox>
        )}
      </div>
    </WizardStepContent>
  );
}
