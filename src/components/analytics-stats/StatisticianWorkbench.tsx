// Right Column: Statistician's Workbench (AI Sidebar)

import { Brain, AlertCircle, CheckCircle, TrendingUp, Lock } from 'lucide-react';
import type { AnalysisVariable } from './types';
import { recommendTest } from './utils/statisticalTests';

interface StatisticianWorkbenchProps {
  selectedVariables: AnalysisVariable[];
  predictor: AnalysisVariable | null;
  outcome: AnalysisVariable | null;
  analysisMode: 'descriptive' | 'comparative' | 'advanced';
}

export function StatisticianWorkbench({ 
  selectedVariables, 
  predictor, 
  outcome, 
  analysisMode 
}: StatisticianWorkbenchProps) {
  
  // Get test recommendation if both variables selected
  const recommendation = predictor && outcome 
    ? recommendTest(predictor, outcome)
    : null;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-slate-900">Statistician's Workbench</h3>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
            <Lock className="w-3 h-3" />
            Validated
          </div>
        </div>
        
        {/* Analysis Mode Indicator */}
        <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
          <span className="font-medium capitalize">{analysisMode}</span> Analysis Mode
        </div>
      </div>

      {/* Logic Monitor */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Variable Selection Status */}
        <div className="space-y-2">
          <div className="text-xs text-slate-600 font-medium">Variable Selection</div>
          
          <div className={`p-3 rounded-lg border ${
            selectedVariables.length > 0 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              {selectedVariables.length > 0 ? (
                <CheckCircle className="w-4 h-4 text-blue-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-slate-400" />
              )}
              <span className={`text-sm font-medium ${
                selectedVariables.length > 0 ? 'text-blue-900' : 'text-slate-600'
              }`}>
                {selectedVariables.length} Variable{selectedVariables.length !== 1 ? 's' : ''} Selected
              </span>
            </div>
            {selectedVariables.length > 0 && (
              <div className="text-xs text-slate-700 mt-2 space-y-1">
                {selectedVariables.slice(0, 3).map(v => (
                  <div key={v.id} className="truncate">• {v.label}</div>
                ))}
                {selectedVariables.length > 3 && (
                  <div className="text-slate-500">+ {selectedVariables.length - 3} more...</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Comparative Analysis Recommendation */}
        {analysisMode === 'comparative' && (
          <div className="space-y-2">
            <div className="text-xs text-slate-600 font-medium">Test Recommendation</div>
            
            {recommendation ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">
                    {recommendation.test}
                  </span>
                </div>
                <div className="text-xs text-slate-700 leading-relaxed">
                  {recommendation.rationale}
                </div>
                
                {/* Variable details */}
                <div className="mt-3 pt-3 border-t border-green-200 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-600">Predictor:</span>
                    <div className="text-slate-900 mt-1 font-medium">{predictor?.label}</div>
                    <div className="text-slate-500">Type: {predictor?.dataType}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Outcome:</span>
                    <div className="text-slate-900 mt-1 font-medium">{outcome?.label}</div>
                    <div className="text-slate-500">Type: {outcome?.dataType}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">Awaiting Variable Selection</span>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Select both a predictor and outcome variable to receive test recommendations.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Descriptive Analysis Guidance */}
        {analysisMode === 'descriptive' && selectedVariables.length > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Analysis Plan</span>
            </div>
            <div className="text-xs text-slate-700 space-y-2">
              <div>
                • Continuous variables: Mean, SD, median, IQR
              </div>
              <div>
                • Categorical variables: Frequency distributions
              </div>
              <div>
                • Missing data analysis for all variables
              </div>
              <div>
                • Outlier detection using IQR method
              </div>
            </div>
          </div>
        )}

        {/* Advanced Analysis Guidance */}
        {analysisMode === 'advanced' && (
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Advanced Methods</span>
            </div>
            <div className="text-xs text-slate-700 space-y-2">
              <div>
                • Correlation matrix (Pearson/Spearman)
              </div>
              <div>
                • Multivariable regression modeling
              </div>
              <div>
                • Covariate adjustment
              </div>
              <div>
                • Model diagnostics and validation
              </div>
            </div>
          </div>
        )}

        {/* Statistical Safeguards */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="text-xs font-medium text-amber-900 mb-2">Statistical Safeguards</div>
          <div className="text-xs text-slate-600 space-y-1">
            <div>✓ Automatic test selection based on data types</div>
            <div>✓ Multiple comparison corrections available</div>
            <div>✓ Assumption checking for parametric tests</div>
            <div>✓ Sample size adequacy warnings</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <div className="text-xs text-slate-500 text-center">
          Locked System Persona v1.0
          <div className="text-slate-400 mt-1">Prevents methodological errors</div>
        </div>
      </div>
    </div>
  );
}