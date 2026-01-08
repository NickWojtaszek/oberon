/**
 * Methodology-Driven Persona Engine Demo
 * Demonstrates Team DNA Configuration and Unblinding Protocol
 */

import { useState } from 'react';
import { StudyType } from '../../config/studyMethodology';
import { TeamDNAConfigurator, TeamConfiguration } from './TeamDNAConfigurator';
import { UnblindingGate } from './UnblindingGate';
import { 
  FlaskConical, 
  Users, 
  Eye,
  ArrowRight,
  CheckCircle 
} from 'lucide-react';

type DemoStep = 'select-study' | 'configure-team' | 'unblinding-protocol';

export function MethodologyDemo() {
  const [currentStep, setCurrentStep] = useState<DemoStep>('select-study');
  const [selectedStudyType, setSelectedStudyType] = useState<StudyType | null>(null);
  const [teamConfiguration, setTeamConfiguration] = useState<TeamConfiguration | null>(null);
  const [userRole, setUserRole] = useState<'Principal Investigator' | 'Clinical Statistician'>('Principal Investigator');
  
  // Mock blinding state
  const [blindingState, setBlindingState] = useState({
    isBlinded: true,
    blindedPersonas: ['Clinical Statistician', 'Blinded Outcome Evaluator'],
  });

  // Mock checklist
  const [checklist, setChecklist] = useState({
    protocolPublished: true,
    allRecordsComplete: true,
    statisticalPlanFrozen: true,
    manifestLocked: true,
    piSignatureRequired: false,
  });

  const studyTypes: Array<{ id: StudyType; name: string; description: string; icon: string }> = [
    {
      id: 'rct',
      name: 'Randomized Controlled Trial',
      description: 'Prospective RCT with double-blinding and rigorous controls',
      icon: '🔬',
    },
    {
      id: 'prospective-cohort',
      name: 'Prospective Cohort Study',
      description: 'Longitudinal observational study with safety monitoring',
      icon: '📊',
    },
    {
      id: 'retrospective-case-series',
      name: 'Retrospective Case Series',
      description: 'Historical data analysis with restricted data entry',
      icon: '📁',
    },
    {
      id: 'laboratory-investigation',
      name: 'Laboratory Investigation',
      description: 'Bench science with precision focus',
      icon: '🧪',
    },
    {
      id: 'technical-note',
      name: 'Technical Note / Case Report',
      description: 'Single-subject narrative with streamlined workflow',
      icon: '📝',
    },
  ];

  const handleStudySelect = (studyType: StudyType) => {
    setSelectedStudyType(studyType);
    setCurrentStep('configure-team');
  };

  const handleTeamConfigComplete = (config: TeamConfiguration) => {
    setTeamConfiguration(config);
    // If it's an RCT, show unblinding demo
    if (selectedStudyType === 'rct') {
      setCurrentStep('unblinding-protocol');
    } else {
      alert('Team configuration complete! In a real app, this would proceed to Protocol Builder.');
    }
  };

  const handleUnblind = (event: any) => {
    setBlindingState({
      ...blindingState,
      isBlinded: false,
      unblindingEvent: event,
    });
    alert('Study successfully unblinded! All treatment assignments are now visible.');
  };

  return (
    <div className="h-full bg-slate-50">
      {/* Step 1: Select Study Type */}
      {currentStep === 'select-study' && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-8 py-6">
            <div className="max-w-[1600px] mx-auto">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FlaskConical className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl text-slate-900 mb-2">
                    Methodology-Driven Persona Engine
                  </h1>
                  <p className="text-slate-600">
                    Select your study design to automatically configure the required scientific chain of command
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-[1600px] mx-auto">
              <div className="mb-6">
                <h2 className="font-medium text-slate-900 mb-2">
                  Step 1: Define Study Design
                </h2>
                <p className="text-sm text-slate-600">
                  Your selection determines required personas, blinding protocols, and AI autonomy levels
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studyTypes.map((study) => (
                  <button
                    key={study.id}
                    onClick={() => handleStudySelect(study.id)}
                    className="bg-white border-2 border-slate-200 hover:border-blue-500 rounded-xl p-6 text-left transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{study.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {study.name}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {study.description}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-sm text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Configure team</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Team DNA Configuration */}
      {currentStep === 'configure-team' && selectedStudyType && (
        <TeamDNAConfigurator
          studyType={selectedStudyType}
          onComplete={handleTeamConfigComplete}
          onBack={() => setCurrentStep('select-study')}
        />
      )}

      {/* Step 3: Unblinding Protocol (RCT only) */}
      {currentStep === 'unblinding-protocol' && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-8 py-6">
            <div className="max-w-[1600px] mx-auto">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Eye className="w-7 h-7 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl text-slate-900 mb-2">
                    Unblinding Protocol - "Break Glass"
                  </h1>
                  <p className="text-slate-600">
                    Demo: RCT Unblinding Interface (PI-Exclusive)
                  </p>
                </div>
                
                {/* Role Switcher */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setUserRole('Principal Investigator')}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      userRole === 'Principal Investigator'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    View as PI
                  </button>
                  <button
                    onClick={() => setUserRole('Clinical Statistician')}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      userRole === 'Clinical Statistician'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    View as Statistician
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-[1600px] mx-auto">
              <UnblindingGate
                studyName="AORTIC-CALC-2026 Trial"
                currentBlindingState={blindingState}
                checklist={checklist}
                onUnblind={handleUnblind}
                userRole={userRole}
              />

              {/* Demo Controls */}
              <div className="mt-8 bg-slate-100 border-2 border-slate-300 rounded-xl p-6">
                <h3 className="font-medium text-slate-900 mb-4">
                  Demo Controls
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setCurrentStep('configure-team')}
                    className="w-full px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg transition-colors text-sm"
                  >
                    Back to Team Configuration
                  </button>
                  <button
                    onClick={() => {
                      setBlindingState({ ...blindingState, isBlinded: true });
                      setChecklist({ ...checklist, piSignatureRequired: false });
                    }}
                    className="w-full px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg transition-colors text-sm"
                  >
                    Reset Blinding State
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
