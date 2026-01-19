/**
 * Review & Publish Step
 * Final review of protocol before publishing
 * PI approves and publishes the protocol, enabling data collection
 */

import { useState } from 'react';
import {
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  FlaskConical,
  Table,
  Shield,
  Send,
  Lock,
  Unlock,
  Eye,
  Edit,
  Download,
  FileDown,
} from 'lucide-react';
import type { ProtocolDetailsData } from './ProtocolDetailsStep';
import type { SavedProtocol } from '../../protocol-workbench/types';
import type { StudyMethodology } from '../../../contexts/ProtocolContext';
import type { FoundationalPaperExtraction } from '../../../services/geminiService';
import { downloadProtocolExport } from '../../../utils/protocolExportImport';
import { downloadProtocolPDF } from '../../protocol-export/pdf';

interface ReviewPublishStepProps {
  onPublish: () => void;
  onBack: (step: string) => void;
  protocolDetails: ProtocolDetailsData;
  protocol?: SavedProtocol; // Full protocol object for export functionality
  methodology?: StudyMethodology; // For PDF export with SPECTRA
  foundationalPapers?: FoundationalPaperExtraction[]; // For PDF export
  summary: {
    picoComplete: boolean;
    picoApproved: boolean;
    studyDesignComplete: boolean;
    schemaComplete: boolean;
    fieldCount: number;
    studyType: string;
    population?: string;
    intervention?: string;
    outcome?: string;
  };
}

export function ReviewPublishStep({ onPublish, onBack, protocolDetails, protocol, methodology, foundationalPapers, summary }: ReviewPublishStepProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'success'>('idle');
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const allChecksPass =
    summary.picoComplete &&
    summary.picoApproved &&
    summary.studyDesignComplete &&
    summary.schemaComplete &&
    summary.fieldCount > 0 &&
    protocolDetails.protocolTitle &&
    protocolDetails.principalInvestigator;

  const handlePublish = async () => {
    if (!confirmChecked || !allChecksPass) return;

    setIsPublishing(true);
    setPublishStatus('publishing');

    // Brief delay for UI feedback
    await new Promise(resolve => setTimeout(resolve, 1500));

    setPublishStatus('success');
    setIsPublishing(false);

    // Call onPublish after short delay for success animation
    setTimeout(() => {
      onPublish();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-purple-900">Review & Publish Protocol</h2>
            <p className="text-sm text-purple-700 mt-1">
              Review all protocol information and publish to enable data collection
            </p>
          </div>
        </div>
      </div>

      {publishStatus === 'success' ? (
        /* Success State */
        <div className="bg-white rounded-xl border border-green-200 p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-900 mb-2">Protocol Published!</h3>
            <p className="text-green-700 mb-6">
              Your protocol is now active and ready for data collection.
            </p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-800">
                <Unlock className="w-4 h-4" />
                <span className="font-medium">Data Entry Enabled</span>
              </div>
            </div>

            {/* Export Protocol Buttons */}
            {protocol && (
              <div className="pt-4 border-t border-green-100">
                <p className="text-sm text-slate-600 mb-4">
                  Export your protocol for backup, IRB submission, or sharing with collaborators
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={async () => {
                      setIsExportingPDF(true);
                      try {
                        await downloadProtocolPDF(
                          protocol,
                          protocol.versions[protocol.versions.length - 1],
                          methodology,
                          foundationalPapers
                        );
                      } catch (error) {
                        console.error('PDF export failed:', error);
                        alert('Failed to generate PDF. Please try again.');
                      } finally {
                        setIsExportingPDF(false);
                      }
                    }}
                    disabled={isExportingPDF}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-medium transition-colors"
                  >
                    {isExportingPDF ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <FileDown className="w-5 h-5" />
                        Export PDF
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => downloadProtocolExport(protocol, { includeClinicalData: true, includeManifests: true })}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Export JSON
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  PDF: Professional document for IRB/review • JSON: Data backup for re-import
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Protocol Summary Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Protocol Information</h3>
              <button
                onClick={() => onBack('protocol-details')}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500 mb-1">Protocol Title</div>
                <div className="font-medium text-slate-900">{protocolDetails.protocolTitle || 'Not set'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500 mb-1">Protocol Number</div>
                <div className="font-medium text-slate-900">{protocolDetails.protocolNumber || 'Not set'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500 mb-1">Principal Investigator</div>
                <div className="font-medium text-slate-900">{protocolDetails.principalInvestigator || 'Not set'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500 mb-1">Institution</div>
                <div className="font-medium text-slate-900">{protocolDetails.institution || 'Not set'}</div>
              </div>
              {protocolDetails.irbNumber && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">IRB Number</div>
                  <div className="font-medium text-slate-900">{protocolDetails.irbNumber}</div>
                </div>
              )}
              {protocolDetails.studyStartDate && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">Study Start Date</div>
                  <div className="font-medium text-slate-900">{protocolDetails.studyStartDate}</div>
                </div>
              )}
            </div>
          </div>

          {/* Study Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Study Summary</h3>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <FlaskConical className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-xs text-blue-600 mb-1">Study Type</div>
                <div className="font-semibold text-blue-900">{summary.studyType || 'Not specified'}</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <Table className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-xs text-purple-600 mb-1">Schema Fields</div>
                <div className="font-semibold text-purple-900">{summary.fieldCount} fields</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-xs text-green-600 mb-1">Population</div>
                <div className="font-semibold text-green-900 text-sm truncate">{summary.population || 'Defined'}</div>
              </div>
            </div>

            {(summary.intervention || summary.outcome) && (
              <div className="grid grid-cols-2 gap-4">
                {summary.intervention && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">Intervention</div>
                    <div className="text-sm text-slate-900">{summary.intervention}</div>
                  </div>
                )}
                {summary.outcome && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">Primary Outcome</div>
                    <div className="text-sm text-slate-900">{summary.outcome}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Completion Checklist */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Publication Checklist</h3>

            <div className="space-y-3">
              <ChecklistItem
                label="PICO Framework Complete"
                complete={summary.picoComplete}
                onEdit={() => onBack('pico-capture')}
              />
              <ChecklistItem
                label="PICO Approved by PI"
                complete={summary.picoApproved}
                onEdit={() => onBack('pico-validation')}
              />
              <ChecklistItem
                label="Study Design Configured"
                complete={summary.studyDesignComplete}
                onEdit={() => onBack('study-design')}
              />
              <ChecklistItem
                label="Protocol Schema Defined"
                complete={summary.schemaComplete && summary.fieldCount > 0}
                onEdit={() => onBack('schema-builder')}
              />
              <ChecklistItem
                label="Protocol Details Complete"
                complete={!!protocolDetails.protocolTitle && !!protocolDetails.principalInvestigator}
                onEdit={() => onBack('protocol-details')}
              />
            </div>
          </div>

          {/* Publishing Notice */}
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 mb-1">Publishing Notice</h4>
                <p className="text-sm text-amber-800 mb-3">
                  Publishing this protocol will:
                </p>
                <ul className="text-sm text-amber-800 space-y-1 mb-4">
                  <li>• Change protocol status from <strong>Draft</strong> to <strong>Published</strong></li>
                  <li>• Enable data entry in the Database module</li>
                  <li>• Create a locked version of the protocol schema</li>
                  <li>• This action can be reversed by archiving the protocol</li>
                </ul>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmChecked}
                    onChange={(e) => setConfirmChecked(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded border-amber-400 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-amber-900">
                    I confirm that I have reviewed all protocol information and approve publication
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => onBack('protocol-details')}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Back to Edit
            </button>

            <button
              onClick={handlePublish}
              disabled={!confirmChecked || !allChecksPass || isPublishing}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              {isPublishing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Publish Protocol
                </>
              )}
            </button>
          </div>

          {!allChecksPass && (
            <div className="text-center text-sm text-red-600 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Complete all checklist items before publishing
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Checklist Item Component
function ChecklistItem({
  label,
  complete,
  onEdit,
}: {
  label: string;
  complete: boolean;
  onEdit: () => void;
}) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg ${
        complete ? 'bg-green-50' : 'bg-red-50'
      }`}
    >
      <div className="flex items-center gap-3">
        {complete ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600" />
        )}
        <span
          className={`text-sm font-medium ${
            complete ? 'text-green-900' : 'text-red-900'
          }`}
        >
          {label}
        </span>
      </div>
      {!complete && (
        <button
          onClick={onEdit}
          className="text-sm text-red-700 hover:text-red-800 font-medium flex items-center gap-1"
        >
          <Edit className="w-3 h-3" />
          Complete
        </button>
      )}
    </div>
  );
}
