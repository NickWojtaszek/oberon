// Tab 3: Advanced Modeling & Correlation

import { useState, useMemo } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import type { AnalysisVariable } from '../types';
import type { ProtocolVersion } from '../../protocol-workbench/types';
import { storage } from '../../../utils/storageService';
import { pearsonCorrelation } from '../utils/statisticalTests';

interface AdvancedModelingTabProps {
  selectedVariables: AnalysisVariable[];
  protocolVersion: ProtocolVersion;
  projectId: string;
}

export function AdvancedModelingTab({ 
  selectedVariables, 
  protocolVersion, 
  projectId 
}: AdvancedModelingTabProps) {
  
  const [hideNonSignificant, setHideNonSignificant] = useState(false);
  const [dependentVariable, setDependentVariable] = useState<string | null>(null);
  const [covariates, setCovariates] = useState<string[]>([]);

  // Load clinical data
  const clinicalData = useMemo(() => {
    return storage.clinicalData.getByProtocol(
      protocolVersion.metadata.protocolNumber,
      protocolVersion.versionNumber,
      projectId
    );
  }, [protocolVersion, projectId]);

  // Filter for numeric variables only (for correlation)
  const numericVariables = selectedVariables.filter(v => v.dataType === 'Numeric');

  // Calculate correlation matrix
  const correlationMatrix = useMemo(() => {
    const matrix: {
      var1: string;
      var2: string;
      var1Label: string;
      var2Label: string;
      coefficient: number;
      pValue: number;
      significant: boolean;
    }[] = [];

    for (let i = 0; i < numericVariables.length; i++) {
      for (let j = i + 1; j < numericVariables.length; j++) {
        const var1 = numericVariables[i];
        const var2 = numericVariables[j];

        const data1 = clinicalData
          .map(r => parseFloat(r.data[var1.name]))
          .filter(v => !isNaN(v));
        
        const data2 = clinicalData
          .map(r => parseFloat(r.data[var2.name]))
          .filter(v => !isNaN(v));

        const { coefficient, pValue } = pearsonCorrelation(data1, data2);

        matrix.push({
          var1: var1.id,
          var2: var2.id,
          var1Label: var1.label,
          var2Label: var2.label,
          coefficient,
          pValue,
          significant: pValue < 0.05
        });
      }
    }

    return matrix;
  }, [numericVariables, clinicalData]);

  // Filter correlation matrix
  const filteredMatrix = hideNonSignificant
    ? correlationMatrix.filter(c => c.significant)
    : correlationMatrix;

  const toggleCovariate = (varId: string) => {
    setCovariates(prev =>
      prev.includes(varId)
        ? prev.filter(id => id !== varId)
        : [...prev, varId]
    );
  };

  const getCorrelationColor = (coefficient: number): string => {
    const abs = Math.abs(coefficient);
    if (abs >= 0.7) return 'bg-purple-600';
    if (abs >= 0.5) return 'bg-purple-500';
    if (abs >= 0.3) return 'bg-purple-400';
    return 'bg-slate-300';
  };

  const getCorrelationStrength = (coefficient: number): string => {
    const abs = Math.abs(coefficient);
    if (abs >= 0.7) return 'Strong';
    if (abs >= 0.5) return 'Moderate';
    if (abs >= 0.3) return 'Weak';
    return 'Very Weak';
  };

  if (selectedVariables.length === 0) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-slate-300 mb-4" />
        <h3 className="text-slate-600 mb-2">No Variables Selected</h3>
        <p className="text-slate-500 text-sm">
          Select numeric variables from the Schema Explorer to perform correlation analysis
        </p>
      </div>
    );
  }

  if (numericVariables.length < 2) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-slate-300 mb-4" />
        <h3 className="text-slate-600 mb-2">Insufficient Numeric Variables</h3>
        <p className="text-slate-500 text-sm">
          Select at least 2 numeric variables to perform correlation analysis
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-slate-900 mb-2">Advanced Modeling & Correlation</h2>
        <p className="text-slate-600 text-sm">
          Correlation analysis and multivariable regression modeling
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            {filteredMatrix.length} correlation{filteredMatrix.length !== 1 ? 's' : ''} computed
            {hideNonSignificant && ' (significant only)'}
          </div>
          <button
            onClick={() => setHideNonSignificant(!hideNonSignificant)}
            className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm text-slate-700"
          >
            {hideNonSignificant ? (
              <>
                <Eye className="w-4 h-4" />
                Show All
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                Hide Non-Significant
              </>
            )}
          </button>
        </div>
      </div>

      {/* Correlation Matrix Visualization */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-slate-900 mb-4">Correlation Matrix</h3>
        
        {filteredMatrix.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No {hideNonSignificant ? 'significant ' : ''}correlations found
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMatrix.map((corr, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="text-sm text-slate-900 mb-1">
                    {corr.var1Label} ↔ {corr.var2Label}
                  </div>
                  <div className="text-xs text-slate-500">
                    {getCorrelationStrength(corr.coefficient)} {corr.coefficient >= 0 ? 'positive' : 'negative'} correlation
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Correlation coefficient */}
                  <div className="text-right">
                    <div className="text-sm text-slate-600">Pearson r</div>
                    <div className="text-lg font-medium text-slate-900">
                      {corr.coefficient.toFixed(3)}
                    </div>
                  </div>

                  {/* Visual strength indicator */}
                  <div className="w-24">
                    <div className="h-2 bg-slate-100 rounded overflow-hidden">
                      <div
                        className={`h-full ${getCorrelationColor(corr.coefficient)}`}
                        style={{ width: `${Math.abs(corr.coefficient) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* P-value */}
                  <div className="text-right min-w-[80px]">
                    <div className="text-sm text-slate-600">p-value</div>
                    <div className={`text-sm font-medium ${
                      corr.significant ? 'text-green-700' : 'text-slate-900'
                    }`}>
                      {corr.pValue < 0.001 ? '< 0.001' : corr.pValue.toFixed(3)}
                    </div>
                  </div>

                  {/* Significance badge */}
                  {corr.significant && (
                    <div className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                      Significant
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Regression Builder */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-slate-900 mb-4">Regression Model Builder</h3>
        
        <div className="space-y-4">
          {/* Dependent Variable Selection */}
          <div>
            <label className="block text-sm text-slate-600 mb-2">Dependent Variable (Outcome)</label>
            <select
              value={dependentVariable || ''}
              onChange={(e) => setDependentVariable(e.target.value || null)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select dependent variable...</option>
              {numericVariables.map(v => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          {/* Covariates Selection */}
          <div>
            <label className="block text-sm text-slate-600 mb-2">
              Covariates (Predictors) - {covariates.length} selected
            </label>
            <div className="border border-slate-200 rounded-lg p-4 max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {numericVariables
                  .filter(v => v.id !== dependentVariable)
                  .map(v => (
                    <button
                      key={v.id}
                      onClick={() => toggleCovariate(v.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                        covariates.includes(v.id)
                          ? 'bg-blue-50 border-blue-200 text-blue-900'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          covariates.includes(v.id)
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-slate-300'
                        }`}>
                          {covariates.includes(v.id) && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm">{v.label}</span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Model Configuration */}
          <div>
            <label className="block text-sm text-slate-600 mb-2">Model Type</label>
            <select
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="linear">Linear Regression</option>
              <option value="logistic">Logistic Regression</option>
              <option value="cox">Cox Proportional Hazards</option>
            </select>
          </div>

          {/* Run Model Button */}
          <button
            disabled={!dependentVariable || covariates.length === 0}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Run Multivariable Model
          </button>

          {/* Placeholder for model results */}
          {dependentVariable && covariates.length > 0 && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="text-sm text-amber-900">
                <div className="font-medium mb-1">Model Preview</div>
                <div className="text-amber-800">
                  {numericVariables.find(v => v.id === dependentVariable)?.label} ~ {' '}
                  {covariates.map(id => numericVariables.find(v => v.id === id)?.label).join(' + ')}
                </div>
                <div className="text-xs text-amber-700 mt-2">
                  Advanced regression modeling coming soon. This will calculate coefficients, standard errors, and confidence intervals.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Statistical Notes */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div className="text-sm text-slate-600 space-y-2">
          <div className="font-medium text-slate-900">Statistical Notes:</div>
          <div>• Pearson correlation assumes linear relationships and normal distribution</div>
          <div>• Correlation ≠ causation - use clinical judgment</div>
          <div>• Strong correlations (|r| &gt; 0.7) may indicate multicollinearity in regression</div>
          <div>• Multiple testing correction (Bonferroni) may be needed for large matrices</div>
        </div>
      </div>
    </div>
  );
}