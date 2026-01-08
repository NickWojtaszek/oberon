import { useState } from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import { ConfidenceBadge, ConfidenceLevel } from './ConfidenceBadge';

interface Variable {
  id: string;
  name: string;
  label?: string;
  dataType: string;
  role: string;
  confidence: ConfidenceLevel;
  reviewed: boolean;
  missingness?: number;
  isPII?: boolean;
  aiSuggestedRole?: string;
  aiSuggestedType?: string;
}

export function VariableReviewWorkbench() {
  const [variables, setVariables] = useState<Variable[]>([
    {
      id: '1',
      name: 'subject_id',
      label: 'Subject Identifier',
      dataType: 'String',
      role: 'Identifier',
      confidence: 'high',
      reviewed: true,
      isPII: true,
      aiSuggestedRole: 'Identifier',
      aiSuggestedType: 'String',
    },
    {
      id: '2',
      name: 'age_years',
      label: 'Age at Baseline (Years)',
      dataType: 'Numeric',
      role: 'Covariate',
      confidence: 'high',
      reviewed: true,
      aiSuggestedRole: 'Covariate',
      aiSuggestedType: 'Numeric',
    },
    {
      id: '3',
      name: 'treatment_arm',
      label: 'Treatment Assignment',
      dataType: 'Categorical',
      role: 'Treatment',
      confidence: 'medium',
      reviewed: false,
      missingness: 0.02,
      aiSuggestedRole: 'Treatment',
      aiSuggestedType: 'Categorical',
    },
    {
      id: '4',
      name: 'primary_endpoint',
      label: 'Primary Efficacy Outcome',
      dataType: 'Numeric',
      role: 'Outcome',
      confidence: 'high',
      reviewed: false,
      missingness: 0.15,
      aiSuggestedRole: 'Outcome',
      aiSuggestedType: 'Numeric',
    },
    {
      id: '5',
      name: 'visit_date',
      dataType: 'Date',
      role: 'Temporal',
      confidence: 'low',
      reviewed: false,
      aiSuggestedRole: 'Identifier',
      aiSuggestedType: 'Date',
    },
  ]);

  const [activeVariableId, setActiveVariableId] = useState(variables[2].id);
  const [editedRole, setEditedRole] = useState(variables[2].role);
  const [editedDataType, setEditedDataType] = useState(variables[2].dataType);
  const [editedIsPII, setEditedIsPII] = useState(variables[2].isPII || false);

  const activeVariable = variables.find((v) => v.id === activeVariableId);
  const reviewedCount = variables.filter((v) => v.reviewed).length;

  const hasChanges =
    activeVariable &&
    (editedRole !== activeVariable.role ||
      editedDataType !== activeVariable.dataType ||
      editedIsPII !== (activeVariable.isPII || false));

  const handleConfirm = () => {
    if (!activeVariable) return;

    setVariables((prev) =>
      prev.map((v) =>
        v.id === activeVariableId
          ? {
              ...v,
              role: editedRole,
              dataType: editedDataType,
              isPII: editedIsPII,
              reviewed: true,
            }
          : v
      )
    );

    // Move to next unreviewed variable
    const nextUnreviewed = variables.find((v) => !v.reviewed && v.id !== activeVariableId);
    if (nextUnreviewed) {
      setActiveVariableId(nextUnreviewed.id);
      setEditedRole(nextUnreviewed.role);
      setEditedDataType(nextUnreviewed.dataType);
      setEditedIsPII(nextUnreviewed.isPII || false);
    }
  };

  const selectVariable = (variable: Variable) => {
    setActiveVariableId(variable.id);
    setEditedRole(variable.role);
    setEditedDataType(variable.dataType);
    setEditedIsPII(variable.isPII || false);
  };

  if (!activeVariable) return null;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Column - Variable List */}
      <div className="w-[300px] bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-slate-900 mb-2">Variables ({variables.length})</h2>
          <div className="text-slate-600 text-sm">
            {reviewedCount} / {variables.length} reviewed
          </div>
          <div className="mt-3 bg-slate-100 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(reviewedCount / variables.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {variables.map((variable) => (
            <button
              key={variable.id}
              onClick={() => selectVariable(variable)}
              className={`w-full text-left p-4 border-b border-slate-200 transition-colors ${
                activeVariableId === variable.id
                  ? 'bg-blue-50 border-l-4 border-l-blue-600'
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="text-slate-900 truncate font-medium">{variable.name}</div>
                  <div className="text-slate-600 text-xs mt-1">
                    {variable.dataType} • {variable.role}
                  </div>
                </div>
                {variable.reviewed && (
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 ml-2" />
                )}
              </div>
              <ConfidenceBadge level={variable.confidence} size="sm" />
            </button>
          ))}
        </div>
      </div>

      {/* Center Column - Variable Review Card */}
      <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
        <div className="max-w-[1600px] mx-auto">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h2 className="text-[#111827] mb-1">{activeVariable.name}</h2>
                  {activeVariable.label && (
                    <div className="text-[#6B7280]">{activeVariable.label}</div>
                  )}
                </div>
                <ConfidenceBadge level={activeVariable.confidence} size="lg" />
              </div>
            </div>

            {/* AI Suggestion Banner */}
            {activeVariable.aiSuggestedRole && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-blue-900 mb-2">AI Classification Suggestion</div>
                <div className="text-blue-800 text-sm">
                  Role: <span className="font-medium">{activeVariable.aiSuggestedRole}</span>
                  {' • '}
                  Data Type: <span className="font-medium">{activeVariable.aiSuggestedType}</span>
                </div>
                <div className="text-blue-700 text-sm mt-2">
                  Please review and confirm or modify this classification
                </div>
              </div>
            )}

            {/* High Missingness Warning */}
            {activeVariable.missingness && activeVariable.missingness > 0.1 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-yellow-900">High Missingness Detected</div>
                  <div className="text-yellow-800 text-sm mt-1">
                    {(activeVariable.missingness * 100).toFixed(1)}% of values are missing. Consider
                    reviewing the data collection process or imputation strategy.
                  </div>
                </div>
              </div>
            )}

            {/* Editable Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-slate-900 mb-2">Variable Role</label>
                <select
                  value={editedRole}
                  onChange={(e) => setEditedRole(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Identifier">Identifier</option>
                  <option value="Treatment">Treatment</option>
                  <option value="Outcome">Outcome</option>
                  <option value="Covariate">Covariate</option>
                  <option value="Temporal">Temporal</option>
                  <option value="Stratification">Stratification</option>
                  <option value="Exclude">Exclude</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-900 mb-2">Data Type</label>
                <select
                  value={editedDataType}
                  onChange={(e) => setEditedDataType(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Numeric">Numeric</option>
                  <option value="Categorical">Categorical</option>
                  <option value="String">String</option>
                  <option value="Date">Date</option>
                  <option value="Boolean">Boolean</option>
                </select>
              </div>

              {/* PII Checkbox */}
              <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editedIsPII}
                    onChange={(e) => setEditedIsPII(e.target.checked)}
                    className="w-5 h-5 mt-0.5 text-red-600 border-red-300 rounded focus:ring-red-500"
                  />
                  <div className="flex-1">
                    <div className="text-red-900">Contains Personally Identifiable Information (PII)</div>
                    <div className="text-red-700 text-sm mt-1">
                      Check this box if this variable contains personal data that requires special
                      handling or anonymization. PII variables will be excluded from AI analysis.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={handleConfirm}
                className={`w-full py-3 rounded-lg transition-colors ${
                  hasChanges
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {hasChanges ? 'Confirm Changes' : 'Confirm Classification'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Data Preview Panel */}
      <div className="w-[400px] bg-white border-l border-slate-200 p-6">
        <div className="sticky top-0">
          <h3 className="text-slate-900 mb-4">Data Preview</h3>

          {/* Variable Statistics */}
          <div className="bg-slate-50 rounded-lg p-4 mb-6 space-y-3 border border-slate-200">
            <div>
              <div className="text-[#6B7280] text-sm">Observations</div>
              <div className="text-[#111827]">234</div>
            </div>
            <div>
              <div className="text-[#6B7280] text-sm">Missing Values</div>
              <div className="text-[#111827]">
                {activeVariable.missingness
                  ? `${Math.round(activeVariable.missingness * 234)} (${(activeVariable.missingness * 100).toFixed(1)}%)`
                  : '0 (0%)'}
              </div>
            </div>
            <div>
              <div className="text-[#6B7280] text-sm">Unique Values</div>
              <div className="text-[#111827]">
                {activeVariable.dataType === 'Categorical' ? '3' : '234'}
              </div>
            </div>
          </div>

          {/* Sample Values */}
          <div>
            <div className="text-slate-900 mb-3">Sample Values</div>
            <div className="space-y-2">
              {activeVariable.dataType === 'Categorical' ? (
                <>
                  <div className="px-3 py-2 bg-slate-50 rounded border border-slate-200 text-slate-900 text-sm">
                    Treatment A (n=78)
                  </div>
                  <div className="px-3 py-2 bg-slate-50 rounded border border-slate-200 text-slate-900 text-sm">
                    Treatment B (n=80)
                  </div>
                  <div className="px-3 py-2 bg-slate-50 rounded border border-slate-200 text-slate-900 text-sm">
                    Placebo (n=76)
                  </div>
                </>
              ) : activeVariable.dataType === 'Date' ? (
                <>
                  <div className="px-3 py-2 bg-slate-50 rounded border border-slate-200 text-slate-900 text-sm">
                    2024-01-15
                  </div>
                  <div className="px-3 py-2 bg-slate-50 rounded border border-slate-200 text-slate-900 text-sm">
                    2024-01-22
                  </div>
                  <div className="px-3 py-2 bg-slate-50 rounded border border-slate-200 text-slate-900 text-sm">
                    2024-02-05
                  </div>
                </>
              ) : activeVariable.name === 'subject_id' ? (
                <>
                  <div className="px-3 py-2 bg-slate-50 rounded border border-slate-200 text-slate-900 text-sm">
                    SUBJ-001
                  </div>
                  <div className="px-3 py-2 bg-slate-50 rounded border border-slate-200 text-slate-900 text-sm">
                    SUBJ-002
                  </div>
                  <div className="px-3 py-2 bg-slate-50 rounded border border-slate-200 text-slate-900 text-sm">
                    SUBJ-003
                  </div>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 bg-slate-50 rounded border border-slate-200 text-slate-900 text-sm">
                    {activeVariable.name === 'age_years' ? '67.5' : '42.3'}
                  </div>
                  <div className="px-3 py-2 bg-slate-50 rounded border border-slate-200 text-slate-900 text-sm">
                    {activeVariable.name === 'age_years' ? '54.2' : '38.7'}
                  </div>
                  <div className="px-3 py-2 bg-slate-50 rounded border border-slate-200 text-slate-900 text-sm">
                    {activeVariable.name === 'age_years' ? '71.8' : '51.2'}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}