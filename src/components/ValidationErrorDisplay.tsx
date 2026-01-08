/**
 * Validation Error Display Component
 * 
 * Shows validation errors in a user-friendly, actionable format.
 * Allows users to understand what's wrong and how to fix it.
 */

import { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronRight, FileWarning, Download, X } from 'lucide-react';
import type { ImportValidationResult } from '../utils/validation/importValidator';

interface ValidationErrorDisplayProps {
  result: ImportValidationResult;
  onClose: () => void;
  onRetry: () => void;
}

export function ValidationErrorDisplay({ result, onClose, onRetry }: ValidationErrorDisplayProps) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  // Calculate total error count safely
  const totalErrors = result.errors?.length || 0;
  const totalWarnings = result.warnings?.length || 0;

  const downloadReport = () => {
    const reportText = generateTextReport(result);
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `validation-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateTextReport = (result: ImportValidationResult): string => {
    let report = `Validation Report\n`;
    report += `==================\n\n`;
    report += `Status: ${result.isValid ? 'VALID' : 'INVALID'}\n`;
    report += `Summary: ${result.summary}\n\n`;

    if (result.errors.length > 0) {
      report += `Errors (${result.errors.length}):\n`;
      report += `-------------------\n`;
      result.errors.forEach((error, index) => {
        report += `${index + 1}. Field: ${error.field}\n`;
        report += `   Message: ${error.message}\n`;
        report += `   Code: ${error.code}\n\n`;
      });
    }

    if (result.warnings.length > 0) {
      report += `\nWarnings (${result.warnings.length}):\n`;
      report += `---------------------\n`;
      result.warnings.forEach((warning, index) => {
        report += `${index + 1}. Field: ${warning.field}\n`;
        report += `   Message: ${warning.message}\n\n`;
      });
    }

    return report;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`p-6 border-b ${result.isValid ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {result.isValid ? (
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <AlertCircle className="w-10 h-10 text-red-600 flex-shrink-0" />
              )}
              <div>
                <h2 className={`text-xl ${result.isValid ? 'text-emerald-900' : 'text-red-900'}`}>
                  {result.isValid ? 'Validation Successful' : 'Validation Failed'}
                </h2>
                <p className={`text-sm mt-1 ${result.isValid ? 'text-emerald-700' : 'text-red-700'}`}>
                  {result.summary}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Global Errors */}
          {result.reports.global && !result.reports.global.isValid && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-red-900 font-medium mb-2 flex items-center gap-2">
                <FileWarning className="w-5 h-5" />
                File Structure Issues
              </h3>
              <div className="space-y-2">
                {result.reports.global.details.map((detail, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-mono text-red-700">{detail.field}</span>
                    <span className="text-red-600 ml-2">{detail.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Reports */}
          {result.reports.projects.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-slate-900 font-medium">Project Validation Details</h3>
              {result.reports.projects.map((projectReport) => {
                const isExpanded = expandedProjects.has(projectReport.projectId);
                const hasErrors = !projectReport.report.isValid;
                const hasSubReports = Object.keys(projectReport.subReports).length > 0;

                return (
                  <div
                    key={projectReport.projectId}
                    className={`border rounded-lg overflow-hidden ${
                      hasErrors ? 'border-red-300 bg-red-50' : 'border-emerald-300 bg-emerald-50'
                    }`}
                  >
                    <button
                      onClick={() => toggleProject(projectReport.projectId)}
                      className="w-full p-4 flex items-center justify-between hover:bg-white/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-slate-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-600" />
                        )}
                        <span className={hasErrors ? 'text-red-900' : 'text-emerald-900'}>
                          {projectReport.projectName}
                        </span>
                      </div>
                      <span className={`text-sm ${hasErrors ? 'text-red-700' : 'text-emerald-700'}`}>
                        {projectReport.report.summary}
                      </span>
                    </button>

                    {isExpanded && hasSubReports && (
                      <div className="px-4 pb-4 space-y-3 bg-white">
                        {/* Protocols */}
                        {projectReport.subReports.protocols && (
                          <ValidationSubSection
                            title="Protocols"
                            report={projectReport.subReports.protocols}
                          />
                        )}

                        {/* Manuscripts */}
                        {projectReport.subReports.manuscripts && (
                          <ValidationSubSection
                            title="Manuscripts"
                            report={projectReport.subReports.manuscripts}
                          />
                        )}

                        {/* Statistical Manifests */}
                        {projectReport.subReports.statisticalManifests && (
                          <ValidationSubSection
                            title="Statistical Manifests"
                            report={projectReport.subReports.statisticalManifests}
                            isWarning
                          />
                        )}

                        {/* Clinical Data */}
                        {projectReport.subReports.clinicalData && (
                          <ValidationSubSection
                            title="Clinical Data"
                            report={projectReport.subReports.clinicalData}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h3 className="text-amber-900 font-medium mb-2">
                ⚠️ Warnings ({result.warnings.length})
              </h3>
              <div className="space-y-2 text-sm">
                {result.warnings.slice(0, 5).map((warning, index) => (
                  <div key={index}>
                    <span className="font-mono text-amber-700">{warning.field}</span>
                    <span className="text-amber-600 ml-2">{warning.message}</span>
                  </div>
                ))}
                {result.warnings.length > 5 && (
                  <div className="text-amber-600 italic">
                    ... and {result.warnings.length - 5} more warnings
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-700 hover:text-slate-900 transition-colors"
            >
              Close
            </button>
            {!result.isValid && (
              <button
                onClick={onRetry}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Try Another File
              </button>
            )}
            {result.canProceed && (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
              >
                Proceed with Import
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ValidationSubSectionProps {
  title: string;
  report: { isValid: boolean; summary: string; details: Array<{ field: string; message: string }> };
  isWarning?: boolean;
}

function ValidationSubSection({ title, report, isWarning = false }: ValidationSubSectionProps) {
  const colorClass = isWarning ? 'amber' : 'red';
  
  return (
    <div className={`p-3 bg-${colorClass}-50 border border-${colorClass}-200 rounded`}>
      <h4 className={`text-${colorClass}-900 font-medium text-sm mb-2`}>{title}</h4>
      <div className="space-y-1 text-xs">
        {report.details.slice(0, 3).map((detail, index) => (
          <div key={index}>
            <span className={`font-mono text-${colorClass}-700`}>{detail.field}</span>
            <span className={`text-${colorClass}-600 ml-2`}>{detail.message}</span>
          </div>
        ))}
        {report.details.length > 3 && (
          <div className={`text-${colorClass}-600 italic`}>
            ... and {report.details.length - 3} more issues
          </div>
        )}
      </div>
    </div>
  );
}