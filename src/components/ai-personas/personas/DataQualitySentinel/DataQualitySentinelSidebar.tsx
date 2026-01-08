import React, { useState, useEffect } from 'react';
import { PersonaSidebar } from '../../ui/PersonaSidebar';
import { Persona } from '../../core/personaTypes';
import { useTranslation } from 'react-i18next';
import { SIDEBAR_WIDTH } from '../../../../lib/uiConstants';
import { usePersona } from '../../core/personaContext';
import type { SchemaBlock, ValidationContext, ValidationIssue } from '../../../protocol-workbench/types';

interface DataQualitySentinelSidebarProps {
  dataRecords: any[];
  schemaBlocks: SchemaBlock[];
  studyType?: string;
  onNavigateToIssue?: (issue: ValidationIssue) => void;
}

export function DataQualitySentinelSidebar({
  dataRecords,
  schemaBlocks,
  studyType,
  onNavigateToIssue
}: DataQualitySentinelSidebarProps) {
  const { persona, validate, isActive } = usePersona('data-quality-sentinel');
  const [validating, setValidating] = useState(false);
  const [qualityScore, setQualityScore] = useState<number | null>(null);

  // Run validation when data changes
  useEffect(() => {
    if (!isActive || !persona) return;

    const runValidation = async () => {
      setValidating(true);

      const context: ValidationContext = {
        dataRecords,
        schemaBlocks,
        studyDesign: {
          type: studyType as any || 'rct',
          isBlinded: false,
          isRandomized: studyType === 'rct'
        }
      };

      const result = await validate(context);
      
      // Calculate quality score based on issues
      if (result && dataRecords.length > 0) {
        const criticalCount = result.issues.filter(i => i.severity === 'critical').length;
        const warningCount = result.issues.filter(i => i.severity === 'warning').length;
        
        // Quality score: 100 - (critical * 10) - (warning * 5)
        const score = Math.max(0, 100 - (criticalCount * 10) - (warningCount * 5));
        setQualityScore(score);
      } else {
        setQualityScore(null);
      }

      setValidating(false);
    };

    // Debounce validation
    const timeoutId = setTimeout(runValidation, 500);

    return () => clearTimeout(timeoutId);
  }, [dataRecords, schemaBlocks, studyType, isActive, persona, validate]);

  if (!isActive || !persona) {
    return null;
  }

  const getCriticalIssues = (): ValidationIssue[] => {
    if (!persona.lastValidation) return [];
    return persona.lastValidation.issues.filter(i => i.severity === 'critical');
  };

  const getWarningIssues = (): ValidationIssue[] => {
    if (!persona.lastValidation) return [];
    return persona.lastValidation.issues.filter(i => i.severity === 'warning');
  };

  const getQualityScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-700';
    if (score >= 70) return 'text-amber-700';
    return 'text-red-700';
  };

  const getQualityScoreBg = (score: number): string => {
    if (score >= 90) return 'bg-green-50 border-green-200';
    if (score >= 70) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  const criticalIssues = getCriticalIssues();
  const warningIssues = getWarningIssues();

  return (
    <div className={`${SIDEBAR_WIDTH} border-l border-slate-200 bg-white overflow-y-auto flex-shrink-0`}>
      <div className="p-4">
        <PersonaSidebar
          persona={persona}
          validationResult={persona.lastValidation}
          onViewFullReport={() => {
            // Could open full report modal
          }}
        >
          {/* Data Quality Score */}
          {qualityScore !== null && (
            <div className={`rounded-lg p-4 mb-4 border ${getQualityScoreBg(qualityScore)}`}>
              <div className="text-xs font-medium mb-2 opacity-80">
                Data Quality Score
              </div>
              <div className={`text-3xl font-bold ${getQualityScoreColor(qualityScore)}`}>
                {qualityScore}
                <span className="text-lg">/100</span>
              </div>
              <div className="mt-2 text-xs opacity-75">
                {qualityScore >= 90 && '✅ Excellent quality'}
                {qualityScore >= 70 && qualityScore < 90 && '⚠️ Good with minor issues'}
                {qualityScore < 70 && '❌ Needs attention'}
              </div>
            </div>
          )}

          {/* Critical Issues */}
          {criticalIssues.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-1.5">
                🚨 Critical Issues ({criticalIssues.length})
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {criticalIssues.slice(0, 5).map((issue, idx) => (
                  <div
                    key={idx}
                    className="bg-white bg-opacity-60 rounded p-2 border border-red-300 cursor-pointer hover:bg-opacity-100 transition-all"
                    onClick={() => onNavigateToIssue?.(issue)}
                  >
                    <div className="text-xs font-semibold text-red-900 mb-1">
                      {issue.title}
                    </div>
                    {issue.location?.field && (
                      <div className="text-xs text-red-700 mb-1">
                        Field: <span className="font-mono bg-red-100 px-1 rounded">
                          {issue.location.field}
                        </span>
                      </div>
                    )}
                    {issue.location?.recordId && (
                      <div className="text-xs text-red-700 mb-1">
                        Record: <span className="font-mono bg-red-100 px-1 rounded">
                          {issue.location.recordId}
                        </span>
                      </div>
                    )}
                    <div className="text-xs text-red-800 leading-relaxed">
                      {issue.description}
                    </div>
                  </div>
                ))}
                {criticalIssues.length > 5 && (
                  <div className="text-xs text-red-700 text-center py-1">
                    +{criticalIssues.length - 5} more critical issues
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Warnings */}
          {warningIssues.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-1.5">
                ⚠️ Warnings ({warningIssues.length})
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {warningIssues.slice(0, 3).map((issue, idx) => (
                  <div
                    key={idx}
                    className="bg-white bg-opacity-60 rounded p-2 border border-amber-300 cursor-pointer hover:bg-opacity-100 transition-all"
                    onClick={() => onNavigateToIssue?.(issue)}
                  >
                    <div className="text-xs font-semibold text-amber-900 mb-1">
                      {issue.title}
                    </div>
                    {issue.location?.field && (
                      <div className="text-xs text-amber-700">
                        Field: <span className="font-mono bg-amber-100 px-1 rounded">
                          {issue.location.field}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {warningIssues.length > 3 && (
                  <div className="text-xs text-amber-700 text-center py-1">
                    +{warningIssues.length - 3} more warnings
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Validation Guidelines */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-4">
            <div className="text-sm font-semibold text-teal-900 mb-2">
              📋 Active Validations
            </div>
            <div className="space-y-1.5">
              <div className="text-xs text-teal-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-teal-600 mt-0.5">•</span>
                <span>Age range: 0-120 years</span>
              </div>
              <div className="text-xs text-teal-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-teal-600 mt-0.5">•</span>
                <span>Date logic: End after start</span>
              </div>
              <div className="text-xs text-teal-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-teal-600 mt-0.5">•</span>
                <span>Required fields completeness</span>
              </div>
              <div className="text-xs text-teal-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-teal-600 mt-0.5">•</span>
                <span>Categorical value constraints</span>
              </div>
              <div className="text-xs text-teal-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-teal-600 mt-0.5">•</span>
                <span>Duplicate detection</span>
              </div>
              {studyType === 'rct' && (
                <div className="text-xs text-teal-800 leading-relaxed flex items-start gap-1.5">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span>RCT: Randomization completeness</span>
                </div>
              )}
              {studyType === 'observational' && (
                <div className="text-xs text-teal-800 leading-relaxed flex items-start gap-1.5">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span>Observational: Exposure documentation</span>
                </div>
              )}
            </div>
          </div>

          {/* Data Statistics */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs font-medium text-slate-900 mb-2">
              📊 Data Statistics
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Total Records:</span>
                <span className="font-semibold text-slate-900">
                  {dataRecords.length}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Validation Status:</span>
                <span className={`font-semibold ${
                  validating ? 'text-blue-600' :
                  criticalIssues.length > 0 ? 'text-red-600' :
                  warningIssues.length > 0 ? 'text-amber-600' :
                  'text-green-600'
                }`}>
                  {validating ? 'Validating...' :
                   criticalIssues.length > 0 ? 'Critical Issues' :
                   warningIssues.length > 0 ? 'Warnings' :
                   'Clean'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Fields Defined:</span>
                <span className="font-semibold text-slate-900">
                  {schemaBlocks.length}
                </span>
              </div>
            </div>
          </div>
        </PersonaSidebar>
      </div>
    </div>
  );
}