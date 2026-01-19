// ExecutionResultCard
// Displays executed analysis results

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  BarChart2,
  TrendingUp,
} from 'lucide-react';
import type {
  AnalysisSuggestion,
  DescriptiveResults,
  TTestResults,
  ChiSquareResults,
  CorrelationResults,
} from '../types';

interface ExecutionResultCardProps {
  suggestion: AnalysisSuggestion;
  compact?: boolean;
}

export function ExecutionResultCard({ suggestion, compact = false }: ExecutionResultCardProps) {
  const [expanded, setExpanded] = useState(!compact);
  const result = suggestion.executionResult;

  if (!result) {
    return null;
  }

  const isSuccess = result.success;

  return (
    <div
      className={`rounded-lg border ${
        isSuccess ? 'border-blue-200 bg-blue-50' : 'border-red-200 bg-red-50'
      } overflow-hidden`}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          {isSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600" />
          )}
          <span className="font-medium text-sm text-slate-800">{suggestion.title}</span>
          <span className="text-xs text-slate-500">
            {suggestion.proposedAnalysis.method.name}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>

      {/* Expanded Results */}
      {expanded && isSuccess && (
        <div className="border-t border-slate-200 bg-white p-4">
          {renderResults(result.results)}
        </div>
      )}

      {/* Error Display */}
      {expanded && !isSuccess && (
        <div className="border-t border-red-200 bg-red-100 p-4">
          <p className="text-sm text-red-700">{result.error}</p>
        </div>
      )}
    </div>
  );
}

function renderResults(results: any) {
  if (!results) return <p className="text-sm text-slate-500">No results available</p>;

  switch (results.type) {
    case 'descriptive':
      return <DescriptiveResultsDisplay results={results} />;
    case 't-test':
      return <TTestResultsDisplay results={results} />;
    case 'chi-square':
    case 'fisher-exact':
      return <ChiSquareResultsDisplay results={results} />;
    case 'pearson':
    case 'spearman':
      return <CorrelationResultsDisplay results={results} />;
    default:
      return (
        <pre className="text-xs bg-slate-100 p-2 rounded overflow-x-auto">
          {JSON.stringify(results, null, 2)}
        </pre>
      );
  }
}

function DescriptiveResultsDisplay({ results }: { results: DescriptiveResults }) {
  if (results.continuous) {
    const c = results.continuous;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <BarChart2 className="w-4 h-4 text-blue-500" />
          Continuous Variable Summary
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBox label="N" value={c.n.toString()} />
          <StatBox label="Mean" value={c.mean.toFixed(2)} />
          <StatBox label="SD" value={c.sd.toFixed(2)} />
          <StatBox label="Median" value={c.median.toFixed(2)} />
          <StatBox label="Min" value={c.min.toFixed(2)} />
          <StatBox label="Max" value={c.max.toFixed(2)} />
          <StatBox label="IQR" value={`[${c.iqr[0].toFixed(1)}, ${c.iqr[1].toFixed(1)}]`} />
          <StatBox label="Missing" value={c.missing.toString()} />
        </div>
      </div>
    );
  }

  if (results.categorical) {
    const cat = results.categorical;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <BarChart2 className="w-4 h-4 text-purple-500" />
          Categorical Variable Summary (N={cat.n})
        </div>

        <div className="space-y-1">
          {Object.entries(cat.frequencies).map(([category, count]) => (
            <div key={category} className="flex items-center gap-2">
              <span className="text-sm text-slate-700 w-32 truncate">{category}</span>
              <div className="flex-1 bg-slate-200 rounded-full h-4">
                <div
                  className="bg-purple-500 h-4 rounded-full"
                  style={{ width: `${cat.percentages[category]}%` }}
                />
              </div>
              <span className="text-xs text-slate-600 w-20 text-right">
                {count} ({cat.percentages[category].toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>

        {cat.missing > 0 && (
          <p className="text-xs text-slate-500">Missing: {cat.missing}</p>
        )}
      </div>
    );
  }

  return <p className="text-sm text-slate-500">No data</p>;
}

function TTestResultsDisplay({ results }: { results: TTestResults }) {
  const isSignificant = results.pValue < 0.05;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <TrendingUp className="w-4 h-4 text-green-500" />
        T-Test Results
        {isSignificant && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
            Significant
          </span>
        )}
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="t-statistic" value={results.tStatistic.toFixed(3)} />
        <StatBox
          label="p-value"
          value={formatPValue(results.pValue)}
          highlight={isSignificant}
        />
        <StatBox label="df" value={results.degreesOfFreedom.toString()} />
        <StatBox label="Cohen's d" value={results.effectSize.toFixed(3)} />
      </div>

      {/* Mean Difference */}
      <div className="bg-slate-50 rounded-lg p-3">
        <p className="text-sm text-slate-700">
          <span className="font-medium">Mean Difference:</span>{' '}
          {results.meanDifference.toFixed(3)}
          <span className="text-slate-500 ml-2">
            95% CI [{results.confidenceInterval[0].toFixed(3)},{' '}
            {results.confidenceInterval[1].toFixed(3)}]
          </span>
        </p>
      </div>

      {/* Group Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs font-medium text-blue-700 mb-1">Group 1</p>
          <p className="text-sm text-slate-700">
            N={results.group1.n}, M={results.group1.mean.toFixed(2)}, SD=
            {results.group1.sd.toFixed(2)}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <p className="text-xs font-medium text-purple-700 mb-1">Group 2</p>
          <p className="text-sm text-slate-700">
            N={results.group2.n}, M={results.group2.mean.toFixed(2)}, SD=
            {results.group2.sd.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

function ChiSquareResultsDisplay({ results }: { results: ChiSquareResults }) {
  const isSignificant = results.pValue < 0.05;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <BarChart2 className="w-4 h-4 text-orange-500" />
        {results.type === 'fisher-exact' ? "Fisher's Exact Test" : 'Chi-Square Test'}
        {isSignificant && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
            Significant
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {results.chiSquare !== undefined && (
          <StatBox label="χ²" value={results.chiSquare.toFixed(3)} />
        )}
        <StatBox
          label="p-value"
          value={formatPValue(results.pValue)}
          highlight={isSignificant}
        />
        {results.degreesOfFreedom !== undefined && (
          <StatBox label="df" value={results.degreesOfFreedom.toString()} />
        )}
        {results.oddsRatio !== undefined && (
          <StatBox label="OR" value={results.oddsRatio.toFixed(2)} />
        )}
      </div>

      {results.oddsRatioCI && (
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-sm text-slate-700">
            <span className="font-medium">Odds Ratio:</span> {results.oddsRatio?.toFixed(2)}
            <span className="text-slate-500 ml-2">
              95% CI [{results.oddsRatioCI[0].toFixed(2)}, {results.oddsRatioCI[1].toFixed(2)}]
            </span>
          </p>
        </div>
      )}

      {/* Contingency Table */}
      <div>
        <p className="text-xs font-medium text-slate-500 mb-2">Contingency Table</p>
        <div className="overflow-x-auto">
          <table className="text-xs border-collapse">
            <tbody>
              {results.contingencyTable.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="border border-slate-200 px-3 py-1 text-center bg-white"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CorrelationResultsDisplay({ results }: { results: CorrelationResults }) {
  const isSignificant = results.pValue < 0.05;

  // Correlation strength interpretation
  const absR = Math.abs(results.coefficient);
  let strength = 'negligible';
  if (absR >= 0.7) strength = 'strong';
  else if (absR >= 0.5) strength = 'moderate';
  else if (absR >= 0.3) strength = 'weak';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <TrendingUp className="w-4 h-4 text-cyan-500" />
        {results.type === 'spearman' ? 'Spearman Correlation' : 'Pearson Correlation'}
        {isSignificant && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
            Significant
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox
          label={results.type === 'spearman' ? 'ρ' : 'r'}
          value={results.coefficient.toFixed(3)}
        />
        <StatBox
          label="p-value"
          value={formatPValue(results.pValue)}
          highlight={isSignificant}
        />
        <StatBox label="N" value={results.n.toString()} />
        {results.r2 !== undefined && (
          <StatBox label="R²" value={(results.r2 * 100).toFixed(1) + '%'} />
        )}
      </div>

      <div className="bg-slate-50 rounded-lg p-3">
        <p className="text-sm text-slate-700">
          <span className="font-medium">Interpretation:</span>{' '}
          {results.coefficient >= 0 ? 'Positive' : 'Negative'} {strength} correlation
          <span className="text-slate-500 ml-2">
            95% CI [{results.confidenceInterval[0].toFixed(3)},{' '}
            {results.confidenceInterval[1].toFixed(3)}]
          </span>
        </p>
      </div>
    </div>
  );
}

// Helper Components

function StatBox({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-2 text-center ${
        highlight ? 'bg-green-100' : 'bg-slate-100'
      }`}
    >
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={`text-sm font-medium ${
          highlight ? 'text-green-700' : 'text-slate-800'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function formatPValue(p: number): string {
  if (p < 0.001) return '< 0.001';
  if (p < 0.01) return p.toFixed(3);
  return p.toFixed(2);
}
