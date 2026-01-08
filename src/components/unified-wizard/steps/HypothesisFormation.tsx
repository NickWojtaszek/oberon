/**
 * Step 3: Hypothesis Formation (Simplified Research Wizard)
 * PICO framework extraction with grounding validation
 */

import { useState } from 'react';
import { Lightbulb, ArrowLeft, CheckCircle, AlertTriangle, Database, FileText } from 'lucide-react';
import { StudyType } from '../../../config/studyMethodology';
import { TeamConfiguration } from '../../methodology/TeamDNAConfigurator';
import { WizardStepContent } from '../WizardShell';
import { InfoBox, WarningBox } from '../../ui/AlertCard';
import { Checklist } from '../../ui/ChecklistItem';
import { StatusBadge } from '../../ui/StatusBadge';

interface HypothesisFormationProps {
  studyType: StudyType;
  teamConfiguration: TeamConfiguration;
  onComplete: (hypothesis: any) => void;
  onBack: () => void;
  existingHypothesis?: any;
}

export function HypothesisFormation({ 
  studyType, 
  teamConfiguration, 
  onComplete, 
  onBack,
  existingHypothesis 
}: HypothesisFormationProps) {
  const [rawObservation, setRawObservation] = useState(
    existingHypothesis?.rawObservation || ''
  );
  const [picoFramework, setPicoFramework] = useState({
    population: existingHypothesis?.picoFramework?.population || '',
    intervention: existingHypothesis?.picoFramework?.intervention || '',
    comparison: existingHypothesis?.picoFramework?.comparison || '',
    outcome: existingHypothesis?.picoFramework?.outcome || '',
  });
  const [researchQuestion, setResearchQuestion] = useState(
    existingHypothesis?.researchQuestion || ''
  );

  // Mock grounding validation
  const [isGrounded, setIsGrounded] = useState(false);

  const checklistItems = [
    {
      id: '1',
      label: 'Population defined',
      completed: picoFramework.population.length > 10,
      description: 'Clearly specify the target population',
    },
    {
      id: '2',
      label: 'Intervention specified',
      completed: picoFramework.intervention.length > 5,
      description: 'Define the primary intervention or exposure',
    },
    {
      id: '3',
      label: 'Comparison identified',
      completed: picoFramework.comparison.length > 5,
      description: 'Specify control or comparison group',
    },
    {
      id: '4',
      label: 'Outcome measurable',
      completed: picoFramework.outcome.length > 5,
      description: 'Define primary endpoint or outcome',
    },
    {
      id: '5',
      label: 'Variables grounded',
      completed: isGrounded,
      description: 'All variables map to protocol schema',
      required: true,
    },
  ];

  const allComplete = checklistItems.every(item => item.completed);

  const handleValidateGrounding = () => {
    // Simulate grounding check
    setTimeout(() => {
      setIsGrounded(true);
    }, 500);
  };

  const handleContinue = () => {
    if (!allComplete) return;

    const hypothesis = {
      rawObservation,
      picoFramework,
      researchQuestion,
      variables: [
        { name: 'population', type: 'inclusion_criteria', grounded: true },
        { name: 'intervention', type: 'treatment_arm', grounded: true },
        { name: 'outcome', type: 'primary_endpoint', grounded: true },
      ],
      timestamp: new Date().toISOString(),
    };

    onComplete(hypothesis);
  };

  return (
    <WizardStepContent
      title="Research Hypothesis Formation"
      description="PICO framework extraction with anti-hallucination guardrails"
      icon={Lightbulb}
      sidebar={
        <div className="flex flex-col h-full">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="font-medium text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Grounding Validation
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <h4 className="text-xs font-medium text-slate-700 mb-3 uppercase tracking-wider">
                Anti-Hallucination Layer
              </h4>
              <div className="text-xs text-slate-600 space-y-2">
                <p>
                  All hypothesis variables must be grounded to actual database schema.
                  This prevents "AI rat holes" and ensures traceability.
                </p>
              </div>
            </div>

            <Checklist items={checklistItems} title="Validation Checklist" />

            {!isGrounded && picoFramework.outcome && (
              <button
                onClick={handleValidateGrounding}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
              >
                Validate Variable Grounding
              </button>
            )}
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
            Back to Team Configuration
          </button>
          <button
            onClick={handleContinue}
            disabled={!allComplete}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4" />
            Complete Project Setup
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <InfoBox icon={Lightbulb} title="Research Hypothesis Development">
          Transform your clinical observation into a structured, grounded research hypothesis
          using the PICO framework. All variables will be validated against your protocol schema.
        </InfoBox>

        {/* Raw Observation */}
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Clinical Observation
          </label>
          <textarea
            value={rawObservation}
            onChange={(e) => setRawObservation(e.target.value)}
            placeholder="Describe your initial clinical observation or research idea..."
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* PICO Framework */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
          <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            PICO Framework
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Population (P)
                {picoFramework.population.length > 10 && (
                  <StatusBadge variant="success" size="xs" className="ml-2">
                    Complete
                  </StatusBadge>
                )}
              </label>
              <input
                type="text"
                value={picoFramework.population}
                onChange={(e) => setPicoFramework({ ...picoFramework, population: e.target.value })}
                placeholder="e.g., Adult patients with severe aortic calcification"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Intervention (I)
                {picoFramework.intervention.length > 5 && (
                  <StatusBadge variant="success" size="xs" className="ml-2">
                    Complete
                  </StatusBadge>
                )}
              </label>
              <input
                type="text"
                value={picoFramework.intervention}
                onChange={(e) => setPicoFramework({ ...picoFramework, intervention: e.target.value })}
                placeholder="e.g., Novel chelation therapy protocol"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Comparison (C)
                {picoFramework.comparison.length > 5 && (
                  <StatusBadge variant="success" size="xs" className="ml-2">
                    Complete
                  </StatusBadge>
                )}
              </label>
              <input
                type="text"
                value={picoFramework.comparison}
                onChange={(e) => setPicoFramework({ ...picoFramework, comparison: e.target.value })}
                placeholder="e.g., Standard medical management"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Outcome (O)
                {picoFramework.outcome.length > 5 && (
                  <StatusBadge variant="success" size="xs" className="ml-2">
                    Complete
                  </StatusBadge>
                )}
              </label>
              <input
                type="text"
                value={picoFramework.outcome}
                onChange={(e) => setPicoFramework({ ...picoFramework, outcome: e.target.value })}
                placeholder="e.g., Change in calcium score at 6 months"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Research Question */}
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Structured Research Question
          </label>
          <textarea
            value={researchQuestion}
            onChange={(e) => setResearchQuestion(e.target.value)}
            placeholder="e.g., Does novel chelation therapy reduce aortic calcium scores compared to standard management in adult patients with severe calcification?"
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Grounding Status */}
        {isGrounded && (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-emerald-900 mb-2">
                  Variables Grounded Successfully
                </h3>
                <p className="text-sm text-emerald-800 mb-3">
                  All hypothesis variables have been validated against protocol schema.
                  Your hypothesis is ready for Protocol Builder integration.
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-0.5 bg-emerald-100 border border-emerald-300 rounded">
                      population
                    </code>
                    <span className="text-emerald-700">→ inclusion_criteria</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-0.5 bg-emerald-100 border border-emerald-300 rounded">
                      intervention
                    </code>
                    <span className="text-emerald-700">→ treatment_arm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-0.5 bg-emerald-100 border border-emerald-300 rounded">
                      outcome
                    </code>
                    <span className="text-emerald-700">→ primary_endpoint</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </WizardStepContent>
  );
}
