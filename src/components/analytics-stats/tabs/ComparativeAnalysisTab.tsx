// Tab 2: Comparative Analysis - The 'P-Value' Engine

import { useState, useMemo } from 'react';
import { AlertCircle, Play, FlaskConical, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import type { AnalysisVariable, ComparativeAnalysisResult } from '../types';
import type { ProtocolVersion } from '../../protocol-workbench/types';
import { storage } from '../../../utils/storageService';
import { recommendTest, fishersExactTest, tTest, pearsonCorrelation, formatPValue, isSignificant } from '../utils/statisticalTests';

interface ComparativeAnalysisTabProps {
  selectedVariables: AnalysisVariable[];
  protocolVersion: ProtocolVersion;
  projectId: string;
  predictor: AnalysisVariable | null;
  outcome: AnalysisVariable | null;
  onPredictorChange: (v: AnalysisVariable | null) => void;
  onOutcomeChange: (v: AnalysisVariable | null) => void;
}

export function ComparativeAnalysisTab({
  selectedVariables,
  protocolVersion,
  projectId,
  predictor,
  outcome,
  onPredictorChange,
  onOutcomeChange
}: ComparativeAnalysisTabProps) {
  
  const [analysisResult, setAnalysisResult] = useState<ComparativeAnalysisResult | null>(null);

  // Load clinical data
  const clinicalData = useMemo(() => {
    return storage.clinicalData.getByProtocol(
      protocolVersion.metadata.protocolNumber,
      protocolVersion.versionNumber,
      projectId
    );
  }, [protocolVersion, projectId]);

  // Categorize variables
  const predictors = selectedVariables.filter(v => 
    v.role === 'Predictor' || v.role === 'Covariate'
  );
  const outcomes = selectedVariables.filter(v => 
    v.role === 'Outcome' || v.role === 'Endpoint'
  );

  const runAnalysis = () => {
    if (!predictor || !outcome) return;
    
    // Add fallback values for label and name
    const predictorName = predictor.name || '';
    const predictorLabel = predictor.label || 'Unnamed Predictor';
    const outcomeName = outcome.name || '';
    const outcomeLabel = outcome.label || 'Unnamed Outcome';

    const recommendation = recommendTest(predictor, outcome);

    // Extract data values
    const predictorValues = clinicalData.map(r => r.data[predictorName]).filter(v => v != null);
    const outcomeValues = clinicalData.map(r => r.data[outcomeName]).filter(v => v != null);

    let result: ComparativeAnalysisResult;

    // Run appropriate test
    if (
      (predictor.dataType === 'Text' || predictor.dataType === 'Boolean') &&
      (outcome.dataType === 'Text' || outcome.dataType === 'Boolean')
    ) {
      // Fisher's Exact Test (categorical × categorical)
      const groups = [...new Set(predictorValues)];
      const outcomes_unique = [...new Set(outcomeValues)];
      
      if (groups.length === 2 && outcomes_unique.length === 2) {
        const group1 = groups[0];
        const outcome1 = outcomes_unique[0];
        
        const group1_outcome1 = clinicalData.filter(r => 
          r.data[predictorName] === group1 && r.data[outcomeName] === outcome1
        ).length;
        const group1_outcome2 = clinicalData.filter(r => 
          r.data[predictorName] === group1 && r.data[outcomeName] !== outcome1
        ).length;
        const group2_outcome1 = clinicalData.filter(r => 
          r.data[predictorName] !== group1 && r.data[outcomeName] === outcome1
        ).length;
        const group2_outcome2 = clinicalData.filter(r => 
          r.data[predictorName] !== group1 && r.data[outcomeName] !== outcome1
        ).length;
        
        const { pValue, oddsRatio } = fishersExactTest(
          group1_outcome1,
          group1_outcome2,
          group2_outcome1,
          group2_outcome2
        );
        
        result = {
          analysisId: `comp-${Date.now()}`,
          title: `${predictorLabel} vs ${outcomeLabel}`,
          testUsed: recommendation.test,
          predictor: predictor.id,
          predictorLabel,
          outcome: outcome.id,
          outcomeLabel,
          results: {
            pValue,
            significance: isSignificant(pValue) ? 'Significant' : 'Not Significant',
            oddsRatio
          },
          aiRationale: recommendation.rationale
        };
      } else {
        result = createPlaceholderResult(predictor, outcome, recommendation);
      }
    } else if (
      (predictor.dataType === 'Text' || predictor.dataType === 'Boolean') &&
      outcome.dataType === 'Numeric'
    ) {
      // T-Test (categorical predictor × continuous outcome)
      const groups = [...new Set(predictorValues)];
      
      if (groups.length === 2) {
        const group1Data = clinicalData
          .filter(r => r.data[predictorName] === groups[0])
          .map(r => parseFloat(r.data[outcomeName]))
          .filter(v => !isNaN(v));
        
        const group2Data = clinicalData
          .filter(r => r.data[predictorName] === groups[1])
          .map(r => parseFloat(r.data[outcomeName]))
          .filter(v => !isNaN(v));
        
        const { tStatistic, pValue, degreesOfFreedom } = tTest(group1Data, group2Data);
        
        result = {
          analysisId: `comp-${Date.now()}`,
          title: `${predictorLabel} vs ${outcomeLabel}`,
          testUsed: recommendation.test,
          predictor: predictor.id,
          predictorLabel,
          outcome: outcome.id,
          outcomeLabel,
          results: {
            pValue,
            significance: isSignificant(pValue) ? 'Significant' : 'Not Significant',
            testStatistic: tStatistic,
            degreesOfFreedom
          },
          aiRationale: recommendation.rationale,
          chartData: [
            { group: String(groups[0]), mean: group1Data.reduce((a, b) => a + b, 0) / group1Data.length },
            { group: String(groups[1]), mean: group2Data.reduce((a, b) => a + b, 0) / group2Data.length }
          ]
        };
      } else {
        result = createPlaceholderResult(predictor, outcome, recommendation);
      }
    } else if (predictor.dataType === 'Numeric' && outcome.dataType === 'Numeric') {
      // Pearson Correlation
      const xData = clinicalData
        .map(r => parseFloat(r.data[predictorName]))
        .filter(v => !isNaN(v));
      
      const yData = clinicalData
        .map(r => parseFloat(r.data[outcomeName]))
        .filter(v => !isNaN(v));
      
      const { coefficient, pValue } = pearsonCorrelation(xData, yData);
      
      result = {
        analysisId: `comp-${Date.now()}`,
        title: `${predictorLabel} vs ${outcomeLabel}`,
        testUsed: recommendation.test,
        predictor: predictor.id,
        predictorLabel,
        outcome: outcome.id,
        outcomeLabel,
        results: {
          pValue,
          significance: isSignificant(pValue) ? 'Significant' : 'Not Significant',
          effectSize: coefficient
        },
        aiRationale: recommendation.rationale,
        chartData: clinicalData.map(r => ({
          x: parseFloat(r.data[predictorName]),
          y: parseFloat(r.data[outcomeName])
        })).filter(d => !isNaN(d.x) && !isNaN(d.y))
      };
    } else {
      result = createPlaceholderResult(predictor, outcome, recommendation);
    }

    setAnalysisResult(result);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-slate-900 mb-2">Comparative Analysis</h2>
        <p className="text-slate-600 text-sm">
          Hypothesis testing and statistical comparison between variables
        </p>
      </div>

      {/* The Test-Bench: Variable Selection */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-slate-900 mb-4">Test Configuration</h3>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Predictor Selection */}
          <div>
            <label className="block text-sm text-slate-600 mb-2 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-blue-600" />
              Predictor Variable
            </label>
            <select
              value={predictor?.id || ''}
              onChange={(e) => {
                const selected = selectedVariables.find(v => v.id === e.target.value);
                onPredictorChange(selected || null);
              }}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select predictor...</option>
              {predictors.map(v => (
                <option key={v.id} value={v.id}>
                  {v.label} ({v.dataType})
                </option>
              ))}
            </select>
          </div>

          {/* Outcome Selection */}
          <div>
            <label className="block text-sm text-slate-600 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-600" />
              Outcome Variable
            </label>
            <select
              value={outcome?.id || ''}
              onChange={(e) => {
                const selected = selectedVariables.find(v => v.id === e.target.value);
                onOutcomeChange(selected || null);
              }}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select outcome...</option>
              {outcomes.map(v => (
                <option key={v.id} value={v.id}>
                  {v.label} ({v.dataType})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Run Analysis Button */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            {predictor && outcome ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Ready to analyze
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-300 rounded-full" />
                Select both variables to continue
              </div>
            )}
          </div>
          <button
            onClick={runAnalysis}
            disabled={!predictor || !outcome}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            Run Analysis
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Results Summary */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900">{analysisResult.title}</h3>
              <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                analysisResult.results.significance === 'Significant'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}>
                {analysisResult.results.significance}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <div className="text-sm text-slate-600 mb-1">Statistical Test</div>
                <div className="text-lg text-slate-900 font-medium">{analysisResult.testUsed}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">P-Value</div>
                <div className={`text-lg font-medium ${
                  analysisResult.results.pValue < 0.05 ? 'text-green-700' : 'text-slate-900'
                }`}>
                  {formatPValue(analysisResult.results.pValue)}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">
                  {analysisResult.results.oddsRatio ? 'Odds Ratio' : 
                   analysisResult.results.testStatistic ? 'T-Statistic' :
                   analysisResult.results.effectSize ? 'Correlation' : 'Effect'}
                </div>
                <div className="text-lg text-slate-900 font-medium">
                  {analysisResult.results.oddsRatio?.toFixed(2) ||
                   analysisResult.results.testStatistic?.toFixed(2) ||
                   analysisResult.results.effectSize?.toFixed(3) ||
                   'N/A'}
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-medium text-blue-900 mb-1">AI Rationale</div>
              <div className="text-sm text-blue-800">{analysisResult.aiRationale}</div>
            </div>
          </div>

          {/* Visualization */}
          {analysisResult.chartData && analysisResult.chartData.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-slate-900 mb-4">Visual Output</h3>
              
              {analysisResult.testUsed.includes('T-Test') ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analysisResult.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="group" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="mean" fill="#3b82f6" name={outcome?.label || 'Outcome'} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" name={predictor?.label || 'X'} />
                    <YAxis dataKey="y" name={outcome?.label || 'Y'} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter data={analysisResult.chartData} fill="#3b82f6" />
                  </ScatterChart>
                </ResponsiveContainer>
              )}
            </div>
          )}
        </div>
      )}

      {!analysisResult && selectedVariables.length === 0 && (
        <div className="p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-slate-600 mb-2">No Variables Selected</h3>
          <p className="text-slate-500 text-sm">
            Select predictor and outcome variables from the Schema Explorer
          </p>
        </div>
      )}
    </div>
  );
}

function createPlaceholderResult(
  predictor: AnalysisVariable,
  outcome: AnalysisVariable,
  recommendation: { test: string; rationale: string }
): ComparativeAnalysisResult {
  return {
    analysisId: `comp-${Date.now()}`,
    title: `${predictor.label || 'Unnamed Predictor'} vs ${outcome.label || 'Unnamed Outcome'}`,
    testUsed: recommendation.test,
    predictor: predictor.id,
    predictorLabel: predictor.label || 'Unnamed Predictor',
    outcome: outcome.id,
    outcomeLabel: outcome.label || 'Unnamed Outcome',
    results: {
      pValue: 0.5,
      significance: 'Not Significant'
    },
    aiRationale: recommendation.rationale + ' (Analysis pending - insufficient data)'
  };
}