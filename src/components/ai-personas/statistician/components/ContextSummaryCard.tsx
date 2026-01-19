// ContextSummaryCard
// Displays a summary of the analysis context the AI is using

import React from 'react';
import {
  Users,
  Target,
  Database,
  FileText,
  Activity,
  AlertCircle,
} from 'lucide-react';
import type { StatisticalAnalysisContext } from '../types';

interface ContextSummaryCardProps {
  context: StatisticalAnalysisContext;
}

export function ContextSummaryCard({ context }: ContextSummaryCardProps) {
  const { protocol, schema, data, foundationalPapers } = context;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
        <Activity className="w-4 h-4 text-purple-500" />
        Analysis Context
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Study Design */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <FileText className="w-3 h-3" />
            Study Design
          </div>
          <p className="text-sm font-medium text-slate-800 capitalize">
            {protocol.studyDesign.replace(/-/g, ' ')}
          </p>
        </div>

        {/* Sample Size */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Users className="w-3 h-3" />
            Sample Size
          </div>
          <p className="text-sm font-medium text-slate-800">
            N = {data.completedRecords}
            <span className="text-xs text-slate-500 font-normal ml-1">
              ({data.totalRecords} total)
            </span>
          </p>
        </div>

        {/* Variables */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Database className="w-3 h-3" />
            Variables
          </div>
          <p className="text-sm font-medium text-slate-800">
            {schema.blocks.length} total
          </p>
        </div>

        {/* Missing Data */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <AlertCircle className="w-3 h-3" />
            Missing Data
          </div>
          <p
            className={`text-sm font-medium ${
              data.missingDataSummary.overallMissingRate > 10
                ? 'text-amber-600'
                : 'text-slate-800'
            }`}
          >
            {data.missingDataSummary.overallMissingRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* PICO Summary */}
      {(protocol.pico.population || protocol.pico.intervention) && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500 mb-2">PICO Framework</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {protocol.pico.population && (
              <div>
                <span className="font-medium text-slate-600">P:</span>{' '}
                <span className="text-slate-700">
                  {truncate(protocol.pico.population, 50)}
                </span>
              </div>
            )}
            {protocol.pico.intervention && (
              <div>
                <span className="font-medium text-slate-600">I:</span>{' '}
                <span className="text-slate-700">
                  {truncate(protocol.pico.intervention, 50)}
                </span>
              </div>
            )}
            {protocol.pico.comparison && (
              <div>
                <span className="font-medium text-slate-600">C:</span>{' '}
                <span className="text-slate-700">
                  {truncate(protocol.pico.comparison, 50)}
                </span>
              </div>
            )}
            {protocol.pico.outcome && (
              <div>
                <span className="font-medium text-slate-600">O:</span>{' '}
                <span className="text-slate-700">
                  {truncate(protocol.pico.outcome, 50)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Endpoints Summary */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <p className="text-xs text-slate-500 mb-2">Endpoints</p>
        <div className="flex flex-wrap gap-2">
          {schema.primaryEndpoints.length > 0 && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
              {schema.primaryEndpoints.length} Primary
            </span>
          )}
          {schema.secondaryEndpoints.length > 0 && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              {schema.secondaryEndpoints.length} Secondary
            </span>
          )}
          {schema.exploratoryEndpoints.length > 0 && (
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              {schema.exploratoryEndpoints.length} Exploratory
            </span>
          )}
          {schema.predictors.length > 0 && (
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
              {schema.predictors.length} Predictors
            </span>
          )}
        </div>
      </div>

      {/* Foundational Papers */}
      {foundationalPapers && foundationalPapers.papers.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
            <Target className="w-3 h-3" />
            Foundational Literature ({foundationalPapers.papers.length} papers)
          </p>
          {foundationalPapers.commonStatisticalApproaches &&
            foundationalPapers.commonStatisticalApproaches.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {foundationalPapers.commonStatisticalApproaches.slice(0, 4).map((method, i) => (
                  <span
                    key={i}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded"
                  >
                    {method}
                  </span>
                ))}
              </div>
            )}
        </div>
      )}

      {/* Group Sizes */}
      {data.sampleSizeByGroup && Object.keys(data.sampleSizeByGroup).length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500 mb-2">Group Sizes</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(data.sampleSizeByGroup).map(([group, n]) => (
              <span
                key={group}
                className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded"
              >
                {group}: n={n}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}
