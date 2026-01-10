import { Save, CheckCircle2, XCircle, FileText, Users, Syringe, GitCompare, Target, BookOpen } from 'lucide-react';

interface PICOField {
  label: string;
  value: string;
  icon: any;
  grounded: 'pending' | 'found' | 'conflict';
  linkedVariable?: string;
}

interface SaveProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  picoFields: {
    population: PICOField;
    intervention: PICOField;
    comparison: PICOField;
    outcome: PICOField;
  };
  foundationalPapersCount: number;
  rawObservationLength: number;
}

export function SaveProgressModal({
  isOpen,
  onClose,
  onConfirm,
  picoFields,
  foundationalPapersCount,
  rawObservationLength
}: SaveProgressModalProps) {
  if (!isOpen) return null;

  const hasResearchQuestion = rawObservationLength >= 50;
  const hasPopulation = picoFields.population.value.length > 0;
  const hasIntervention = picoFields.intervention.value.length > 0;
  const hasComparison = picoFields.comparison.value.length > 0;
  const hasOutcome = picoFields.outcome.value.length > 0;
  const hasPapers = foundationalPapersCount > 0;

  const completedItems = [
    hasResearchQuestion,
    hasPopulation,
    hasIntervention,
    hasComparison,
    hasOutcome,
    hasPapers
  ].filter(Boolean).length;

  const totalItems = 6;
  const completionPercentage = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Save className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Save Progress</h2>
              <p className="text-sm text-slate-600">Your research hypothesis will be saved to the project</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Completion Progress</span>
              <span className="text-sm font-semibold text-blue-600">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* What's Being Saved */}
          <div className="space-y-2 mb-6">
            <h3 className="text-sm font-medium text-slate-700 mb-3">What's being saved:</h3>

            {/* Research Question */}
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
              {hasResearchQuestion ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-slate-300 flex-shrink-0" />
              )}
              <FileText className="w-4 h-4 text-slate-600 flex-shrink-0" />
              <span className="text-sm text-slate-700">
                Research Question ({rawObservationLength} characters)
              </span>
            </div>

            {/* Population */}
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
              {hasPopulation ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-slate-300 flex-shrink-0" />
              )}
              <Users className="w-4 h-4 text-slate-600 flex-shrink-0" />
              <span className="text-sm text-slate-700">Population defined</span>
            </div>

            {/* Intervention */}
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
              {hasIntervention ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-slate-300 flex-shrink-0" />
              )}
              <Syringe className="w-4 h-4 text-slate-600 flex-shrink-0" />
              <span className="text-sm text-slate-700">Intervention defined</span>
            </div>

            {/* Comparison */}
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
              {hasComparison ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-slate-300 flex-shrink-0" />
              )}
              <GitCompare className="w-4 h-4 text-slate-600 flex-shrink-0" />
              <span className="text-sm text-slate-700">Comparison defined</span>
            </div>

            {/* Outcome */}
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
              {hasOutcome ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-slate-300 flex-shrink-0" />
              )}
              <Target className="w-4 h-4 text-slate-600 flex-shrink-0" />
              <span className="text-sm text-slate-700">Outcome defined</span>
            </div>

            {/* Foundational Papers */}
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
              {hasPapers ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-slate-300 flex-shrink-0" />
              )}
              <BookOpen className="w-4 h-4 text-slate-600 flex-shrink-0" />
              <span className="text-sm text-slate-700">
                Foundational Papers ({foundationalPapersCount} uploaded)
              </span>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> You can continue editing after saving. This does NOT commit your hypothesis.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Progress
          </button>
        </div>
      </div>
    </div>
  );
}
