// Tab 1: Descriptive Stats - Data Quality & Distribution

import { useState, useMemo } from 'react';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { AnalysisVariable, DescriptiveStatResult } from '../types';
import type { ProtocolVersion } from '../../protocol-workbench/types';
import { storage } from '../../../utils/storageService';
import { calculateContinuousStats, calculateFrequency } from '../utils/statisticalTests';

interface DescriptiveStatsTabProps {
  selectedVariables: AnalysisVariable[];
  protocolVersion: ProtocolVersion;
  projectId: string;
}

export function DescriptiveStatsTab({ selectedVariables, protocolVersion, projectId }: DescriptiveStatsTabProps) {
  
  // Load clinical data
  const clinicalData = useMemo(() => {
    return storage.clinicalData.getByProtocol(
      protocolVersion.metadata.protocolNumber,
      protocolVersion.versionNumber,
      projectId
    );
  }, [protocolVersion, projectId]);

  // Calculate descriptive statistics
  const descriptiveResults = useMemo(() => {
    return selectedVariables.map(variable => {
      const values = clinicalData
        .map(record => record.data[variable.name])
        .filter(v => v !== null && v !== undefined && v !== '');

      const totalN = clinicalData.length;
      const missingN = totalN - values.length;
      const missingPercentage = totalN > 0 ? (missingN / totalN) * 100 : 0;

      if (variable.dataType === 'Numeric') {
        const numericValues = values.map(v => typeof v === 'number' ? v : parseFloat(v)).filter(v => !isNaN(v));
        const stats = calculateContinuousStats(numericValues);

        return {
          variableId: variable.id,
          label: variable.label,
          type: 'Continuous' as const,
          results: {
            ...stats,
            totalN,
            missingN,
            missingPercentage
          }
        };
      } else {
        const stringValues = values.map(v => String(v));
        const freq = calculateFrequency(stringValues);

        return {
          variableId: variable.id,
          label: variable.label,
          type: 'Categorical' as const,
          results: {
            frequency: freq.frequency,
            percentage: freq.percentage,
            totalN,
            missingN,
            missingPercentage
          }
        };
      }
    });
  }, [selectedVariables, clinicalData]);

  // Data completeness heatmap data
  const completenessData = useMemo(() => {
    return selectedVariables.map(variable => {
      const result = descriptiveResults.find(r => r.variableId === variable.id);
      return {
        label: (variable.label || 'Unnamed').substring(0, 30),
        completeness: result ? 100 - result.results.missingPercentage : 0,
        missing: result ? result.results.missingPercentage : 100
      };
    });
  }, [selectedVariables, descriptiveResults]);

  if (selectedVariables.length === 0) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-slate-300 mb-4" />
        <h3 className="text-slate-600 mb-2">No Variables Selected</h3>
        <p className="text-slate-500 text-sm">
          Select variables from the Schema Explorer to view descriptive statistics
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-slate-900 mb-2">Descriptive Statistics</h2>
        <p className="text-slate-600 text-sm">
          Data quality assessment and distribution analysis for {selectedVariables.length} variable{selectedVariables.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Data Completeness Heatmap */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-slate-900 mb-4">Data Completeness</h3>
        <ResponsiveContainer width="100%" height={Math.max(200, selectedVariables.length * 40)}>
          <BarChart
            data={completenessData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="label" type="category" width={190} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="completeness" name="Complete (%)" stackId="a">
              {completenessData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.completeness >= 95 ? '#10b981' : entry.completeness >= 80 ? '#f59e0b' : '#ef4444'}
                />
              ))}
            </Bar>
            <Bar dataKey="missing" name="Missing (%)" stackId="a" fill="#e5e7eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Distribution Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {descriptiveResults.map(result => (
          <div key={result.variableId} className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-slate-900">{result.label}</h4>
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                {result.type}
              </span>
            </div>

            {result.type === 'Continuous' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-600">Mean ± SD</div>
                    <div className="text-slate-900 font-medium">
                      {result.results.mean?.toFixed(2)} ± {result.results.sd?.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-600">Median (IQR)</div>
                    <div className="text-slate-900 font-medium">
                      {result.results.median?.toFixed(2)} ({result.results.iqr?.[0].toFixed(2)} - {result.results.iqr?.[1].toFixed(2)})
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-600">Range</div>
                    <div className="text-slate-900 font-medium">
                      {result.results.min?.toFixed(2)} - {result.results.max?.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-600">Outliers</div>
                    <div className="text-slate-900 font-medium">
                      {result.results.outlierCount || 0}
                    </div>
                  </div>
                </div>
                
                {/* Missing data indicator */}
                <div className="pt-3 border-t border-slate-200">
                  <div className="text-xs text-slate-600">
                    Missing: {result.results.missingN} / {result.results.totalN} ({result.results.missingPercentage.toFixed(1)}%)
                  </div>
                  <div className="mt-2 h-2 bg-slate-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${100 - result.results.missingPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Frequency table */}
                <div className="space-y-2 text-sm">
                  {Object.entries(result.results.frequency || {}).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-slate-600">{category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-900 font-medium">{count}</span>
                        <span className="text-slate-500">
                          ({result.results.percentage?.[category].toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Missing data indicator */}
                <div className="pt-3 border-t border-slate-200">
                  <div className="text-xs text-slate-600">
                    Missing: {result.results.missingN} / {result.results.totalN} ({result.results.missingPercentage.toFixed(1)}%)
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-slate-900 mb-4">Summary Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-slate-600 font-medium">Variable</th>
                <th className="text-left py-3 px-4 text-slate-600 font-medium">Type</th>
                <th className="text-left py-3 px-4 text-slate-600 font-medium">N</th>
                <th className="text-left py-3 px-4 text-slate-600 font-medium">Missing (%)</th>
                <th className="text-left py-3 px-4 text-slate-600 font-medium">Summary</th>
              </tr>
            </thead>
            <tbody>
              {descriptiveResults.map(result => (
                <tr key={result.variableId} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-900">{result.label}</td>
                  <td className="py-3 px-4 text-slate-600">{result.type}</td>
                  <td className="py-3 px-4 text-slate-900">{result.results.totalN - result.results.missingN}</td>
                  <td className="py-3 px-4">
                    <span className={`${
                      result.results.missingPercentage > 10 ? 'text-red-600' : 'text-slate-600'
                    }`}>
                      {result.results.missingPercentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-900">
                    {result.type === 'Continuous' 
                      ? `${result.results.mean?.toFixed(2)} ± ${result.results.sd?.toFixed(2)}`
                      : Object.keys(result.results.frequency || {}).length + ' categories'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}