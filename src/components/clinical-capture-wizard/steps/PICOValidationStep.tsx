/**
 * PICO Validation Step
 * PI approval workflow for PICO framework
 * Features:
 * - Display captured PICO data for review
 * - Principal Investigator approval mechanism
 * - Rejection with feedback capability
 * - Role-based validation (PI vs Student)
 */

import { useState } from 'react';
import {
  Users,
  Syringe,
  GitCompare,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  FileText,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import type { FoundationalPaperExtraction } from '../../../services/geminiService';

interface PICOValidationStepProps {
  picoData: {
    rawObservation: string;
    picoFields: {
      population: string;
      intervention: string;
      comparison: string;
      outcome: string;
      timeframe?: string;
    };
    foundationalPapers: FoundationalPaperExtraction[];
  };
  onApprove: () => void;
  onReject: (reason: string) => void;
  onBackToEdit: () => void;
  userRole?: 'student' | 'pi' | 'admin';
}

export function PICOValidationStep({
  picoData,
  onApprove,
  onReject,
  onBackToEdit,
  userRole = 'pi',
}: PICOValidationStepProps) {
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const handleApprove = () => {
    setApprovalStatus('approved');
    setTimeout(() => {
      onApprove();
    }, 500);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    setApprovalStatus('rejected');
    setShowRejectionModal(false);
    setTimeout(() => {
      onReject(rejectionReason);
    }, 500);
  };

  const picoFieldsArray = [
    { key: 'population', label: 'Population', value: picoData.picoFields.population, icon: Users },
    { key: 'intervention', label: 'Intervention', value: picoData.picoFields.intervention, icon: Syringe },
    { key: 'comparison', label: 'Comparison', value: picoData.picoFields.comparison, icon: GitCompare },
    { key: 'outcome', label: 'Outcome', value: picoData.picoFields.outcome, icon: Target },
  ];

  const isComplete = picoFieldsArray.every(field => field.value && field.value.trim().length > 0);

  return (
    <div className="space-y-6">
      {/* Validation Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-purple-900">PI Approval Required</h2>
            <p className="text-sm text-purple-700 mt-1">
              Review the captured PICO framework and foundational papers before proceeding to study design.
            </p>
          </div>
        </div>

        {/* Approval Status Badge */}
        {approvalStatus === 'approved' && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <div className="font-semibold text-green-900">PICO Framework Approved</div>
              <div className="text-sm text-green-700">Proceeding to study design configuration...</div>
            </div>
          </div>
        )}

        {approvalStatus === 'rejected' && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <XCircle className="w-6 h-6 text-red-600" />
            <div>
              <div className="font-semibold text-red-900">PICO Framework Rejected</div>
              <div className="text-sm text-red-700">{rejectionReason}</div>
            </div>
          </div>
        )}

        {!isComplete && approvalStatus === 'pending' && (
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            <div>
              <div className="font-semibold text-amber-900">Incomplete PICO Framework</div>
              <div className="text-sm text-amber-700">All required PICO fields must be completed before approval.</div>
            </div>
          </div>
        )}
      </div>

      {/* Research Question */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">Research Question</h3>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-slate-700 leading-relaxed">{picoData.rawObservation}</p>
        </div>
      </div>

      {/* PICO Framework Review */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-slate-900">PICO Framework</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {picoFieldsArray.map(field => {
            const Icon = field.icon;
            const isEmpty = !field.value || field.value.trim().length === 0;

            return (
              <div
                key={field.key}
                className={`p-4 rounded-lg border-2 ${
                  isEmpty
                    ? 'bg-red-50 border-red-200'
                    : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-5 h-5 ${isEmpty ? 'text-red-600' : 'text-green-600'}`} />
                  <div className="font-semibold text-slate-900">{field.label}</div>
                  {!isEmpty && <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />}
                  {isEmpty && <XCircle className="w-4 h-4 text-red-600 ml-auto" />}
                </div>
                <p className={`text-sm ${isEmpty ? 'text-red-700 italic' : 'text-slate-700'}`}>
                  {isEmpty ? 'Not provided' : field.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Foundational Papers */}
      {picoData.foundationalPapers && picoData.foundationalPapers.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-900">Foundational Papers</h3>
            <span className="ml-auto text-sm font-medium text-blue-600">
              {picoData.foundationalPapers.length} paper{picoData.foundationalPapers.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-3">
            {picoData.foundationalPapers.map((paper, index) => (
              <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="font-medium text-blue-900">{paper.title}</div>
                <div className="text-sm text-blue-700 mt-1">{paper.authors}</div>
                {paper.abstract && (
                  <div className="text-sm text-blue-600 mt-2 line-clamp-2">{paper.abstract}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approval Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          {userRole === 'student' ? 'Request PI Approval' : 'Principal Investigator Approval'}
        </h3>

        {approvalStatus === 'pending' && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleApprove}
                disabled={!isComplete}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <CheckCircle className="w-5 h-5" />
                {userRole === 'student' ? 'Request Approval' : 'Approve & Continue'}
              </button>

              <button
                onClick={() => setShowRejectionModal(true)}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <XCircle className="w-5 h-5" />
                {userRole === 'student' ? 'Cancel' : 'Reject'}
              </button>
            </div>

            <button
              onClick={onBackToEdit}
              className="w-full px-6 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm"
            >
              Back to Edit PICO
            </button>

            {!isComplete && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <strong>Note:</strong> Complete all PICO fields before requesting approval.
              </div>
            )}
          </div>
        )}

        {approvalStatus === 'approved' && (
          <div className="text-center py-4">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <p className="text-lg font-semibold text-green-900">PICO Framework Approved!</p>
            <p className="text-sm text-green-700 mt-2">Advancing to study design configuration...</p>
          </div>
        )}

        {approvalStatus === 'rejected' && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <p className="text-lg font-semibold text-red-900">PICO Framework Rejected</p>
              <p className="text-sm text-red-700 mt-2">{rejectionReason}</p>
            </div>
            <button
              onClick={onBackToEdit}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Return to PICO Capture
            </button>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Reject PICO Framework</h3>
            </div>

            <p className="text-sm text-slate-600 mb-4">
              Please provide a reason for rejection to help the research team improve the PICO framework.
            </p>

            <textarea
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              placeholder="Explain why this PICO framework needs revision..."
              className="w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                }}
                className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
