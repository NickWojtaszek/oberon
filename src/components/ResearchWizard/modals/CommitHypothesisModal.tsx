import { CheckCircle, AlertTriangle, ArrowRight, FileText } from 'lucide-react';
import { useState } from 'react';

interface PICOField {
  label: string;
  value: string;
  icon: any;
  grounded: 'pending' | 'found' | 'conflict';
  linkedVariable?: string;
}

interface CommitHypothesisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommit: (redirectToWorkbench: boolean) => void;
  picoFields: {
    population: PICOField;
    intervention: PICOField;
    comparison: PICOField;
    outcome: PICOField;
  };
  hasConflicts: boolean;
}

export function CommitHypothesisModal({
  isOpen,
  onClose,
  onCommit,
  picoFields,
  hasConflicts
}: CommitHypothesisModalProps) {
  const [redirectToWorkbench, setRedirectToWorkbench] = useState(true);

  if (!isOpen) return null;

  const handleCommit = () => {
    onCommit(redirectToWorkbench);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Commit Hypothesis</h2>
              <p className="text-sm text-slate-600">Lock your PICO framework and create a study protocol</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* PICO Summary */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-700 mb-3">PICO Framework Summary:</h3>
            <div className="space-y-3 bg-slate-50 rounded-lg p-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Population</span>
                  {picoFields.population.grounded === 'found' && (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  )}
                </div>
                <p className="text-sm text-slate-800">{picoFields.population.value || '(Not defined)'}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Intervention</span>
                  {picoFields.intervention.grounded === 'found' && (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  )}
                </div>
                <p className="text-sm text-slate-800">{picoFields.intervention.value || '(Not defined)'}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Comparison</span>
                  {picoFields.comparison.grounded === 'found' && (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  )}
                </div>
                <p className="text-sm text-slate-800">{picoFields.comparison.value || '(Not defined)'}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Outcome</span>
                  {picoFields.outcome.grounded === 'found' && (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  )}
                </div>
                <p className="text-sm text-slate-800">{picoFields.outcome.value || '(Not defined)'}</p>
              </div>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <strong>Committing will:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Save this hypothesis snapshot to the project</li>
                  <li>Make it available for protocol development</li>
                  <li>You can still edit it later if needed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Navigation Choice */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-700 mb-3">What would you like to do next?</h3>

            <div className="space-y-3">
              {/* Option 1: Go to Workbench */}
              <button
                onClick={() => setRedirectToWorkbench(true)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  redirectToWorkbench
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    redirectToWorkbench
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-slate-300'
                  }`}>
                    {redirectToWorkbench && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-slate-900">Commit & Go to Protocol Workbench</div>
                      <p className="text-sm text-slate-600 mt-0.5">
                        Start building your study protocol immediately
                      </p>
                    </div>
                  </div>
                  {redirectToWorkbench && (
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </button>

              {/* Option 2: Stay Here */}
              <button
                onClick={() => setRedirectToWorkbench(false)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  !redirectToWorkbench
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    !redirectToWorkbench
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-slate-300'
                  }`}>
                    {!redirectToWorkbench && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-slate-900">Commit & Stay Here</div>
                      <p className="text-sm text-slate-600 mt-0.5">
                        Review or refine your hypothesis first
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            </div>
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
            onClick={handleCommit}
            disabled={hasConflicts}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4" />
            Commit Hypothesis
          </button>
        </div>
      </div>
    </div>
  );
}
