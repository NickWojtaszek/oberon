// IRB Submission Card - Status Display and Lifecycle Tracker

import { FileText, Calendar, User, CheckCircle, AlertCircle, Clock, XCircle, Upload } from 'lucide-react';
import type { IRBSubmission, SubmissionStatus } from '../../types/ethics';

interface IRBSubmissionCardProps {
  submission: IRBSubmission;
  onEdit?: (submissionId: string) => void;
  onViewDocuments?: (submissionId: string) => void;
  canEdit: boolean;
}

export function IRBSubmissionCard({ 
  submission, 
  onEdit, 
  onViewDocuments,
  canEdit 
}: IRBSubmissionCardProps) {
  
  const getStatusConfig = (status: SubmissionStatus) => {
    switch (status) {
      case 'DRAFT':
        return { 
          icon: FileText, 
          color: 'text-slate-600', 
          bg: 'bg-slate-100', 
          border: 'border-slate-300',
          label: 'Draft' 
        };
      case 'SUBMITTED':
        return { 
          icon: Upload, 
          color: 'text-blue-600', 
          bg: 'bg-blue-100', 
          border: 'border-blue-300',
          label: 'Submitted' 
        };
      case 'UNDER_REVIEW':
        return { 
          icon: Clock, 
          color: 'text-amber-600', 
          bg: 'bg-amber-100', 
          border: 'border-amber-300',
          label: 'Under Review' 
        };
      case 'APPROVED':
        return { 
          icon: CheckCircle, 
          color: 'text-green-600', 
          bg: 'bg-green-100', 
          border: 'border-green-300',
          label: 'Approved',
          glow: true
        };
      case 'REJECTED':
        return { 
          icon: XCircle, 
          color: 'text-red-600', 
          bg: 'bg-red-100', 
          border: 'border-red-300',
          label: 'Rejected' 
        };
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'INITIAL': return 'Initial Submission';
      case 'AMENDMENT': return 'Amendment';
      case 'RENEWAL': return 'Renewal';
      case 'CONTINUING_REVIEW': return 'Continuing Review';
      default: return type;
    }
  };

  const statusConfig = getStatusConfig(submission.status);
  const StatusIcon = statusConfig.icon;

  const isExpiringSoon = submission.status === 'APPROVED' && submission.decidedAt && 
    new Date(submission.decidedAt).getTime() + (365 * 24 * 60 * 60 * 1000) - Date.now() < (60 * 24 * 60 * 60 * 1000);

  return (
    <div className={`bg-white border-2 rounded-lg p-6 transition-all hover:shadow-md ${
      statusConfig.glow ? 'border-green-300 shadow-sm shadow-green-100' : statusConfig.border
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-medium text-slate-900">
              {getTypeLabel(submission.type)} - {submission.protocolNumber || submission.id}
            </h3>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig.bg} ${statusConfig.color} text-xs font-medium ${
              statusConfig.glow ? 'shadow-sm shadow-green-200' : ''
            }`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {statusConfig.label}
            </div>
          </div>
          <div className="text-sm text-slate-600">{submission.committeeName}</div>
        </div>
      </div>

      {/* Lifecycle Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-500">Submission Lifecycle</span>
          <span className="text-slate-600 font-medium">
            {submission.status === 'DRAFT' ? '0%' : 
             submission.status === 'SUBMITTED' ? '25%' :
             submission.status === 'UNDER_REVIEW' ? '50%' :
             submission.status === 'APPROVED' ? '100%' : '0%'}
          </span>
        </div>
        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`absolute top-0 left-0 h-full transition-all duration-500 ${
              submission.status === 'APPROVED' ? 'bg-green-500' :
              submission.status === 'REJECTED' ? 'bg-red-500' :
              'bg-blue-500'
            }`}
            style={{ 
              width: submission.status === 'DRAFT' ? '10%' : 
                     submission.status === 'SUBMITTED' ? '33%' :
                     submission.status === 'UNDER_REVIEW' ? '66%' :
                     submission.status === 'APPROVED' ? '100%' : '5%'
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
          <span className={submission.status === 'DRAFT' ? 'text-slate-900 font-medium' : ''}>Draft</span>
          <span className={submission.status === 'SUBMITTED' ? 'text-slate-900 font-medium' : ''}>Submitted</span>
          <span className={submission.status === 'UNDER_REVIEW' ? 'text-slate-900 font-medium' : ''}>Review</span>
          <span className={submission.status === 'APPROVED' ? 'text-green-600 font-medium' : ''}>Approved</span>
        </div>
      </div>

      {/* Alert Banner for Expiring/Renewal */}
      {isExpiringSoon && (
        <div className="mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-medium text-amber-900">Continuing Review Due in 30 Days</div>
            <div className="text-xs text-amber-700 mt-0.5">
              Action required to maintain IRB approval status
            </div>
          </div>
        </div>
      )}

      {/* Amendment Reason */}
      {submission.type === 'AMENDMENT' && submission.amendmentReason && (
        <div className="mb-4 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-xs font-medium text-blue-900 mb-1">Amendment Reason</div>
          <div className="text-sm text-blue-700">{submission.amendmentReason}</div>
        </div>
      )}

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <FileText className="w-3.5 h-3.5" />
            Protocol Version
          </div>
          <div className="text-sm font-medium text-slate-900">{submission.protocolVersion}</div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <User className="w-3.5 h-3.5" />
            Submitted By
          </div>
          <div className="text-sm font-medium text-slate-900">{submission.submittedByName}</div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Calendar className="w-3.5 h-3.5" />
            Created
          </div>
          <div className="text-sm font-medium text-slate-900">
            {new Date(submission.createdAt).toLocaleDateString()}
          </div>
        </div>
        {submission.decidedAt && (
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Calendar className="w-3.5 h-3.5" />
              Decided
            </div>
            <div className="text-sm font-medium text-slate-900">
              {new Date(submission.decidedAt).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>

      {/* Documents */}
      <div className="mb-4 pt-4 border-t border-slate-200">
        <div className="text-xs font-medium text-slate-700 mb-2">
          Documents ({submission.documents.length})
        </div>
        <div className="flex flex-wrap gap-2">
          {submission.documents.slice(0, 3).map(doc => (
            <div 
              key={doc.id}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 flex items-center gap-1.5"
            >
              <FileText className="w-3 h-3" />
              {doc.name.length > 20 ? doc.name.substring(0, 20) + '...' : doc.name}
            </div>
          ))}
          {submission.documents.length > 3 && (
            <div className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600">
              +{submission.documents.length - 3} more
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {canEdit && submission.status === 'DRAFT' && (
          <button
            onClick={() => onEdit?.(submission.id)}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Continue Editing
          </button>
        )}
        <button
          onClick={() => onViewDocuments?.(submission.id)}
          className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
        >
          View Documents
        </button>
      </div>

      {/* PI Approval Footer */}
      {submission.status === 'APPROVED' && submission.approvedByName && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
            <span>Approved by PI: <span className="font-medium text-slate-900">{submission.approvedByName}</span></span>
          </div>
        </div>
      )}

      {/* Review Notes */}
      {submission.reviewNotes && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="text-xs font-medium text-slate-700 mb-1">Committee Notes</div>
          <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
            {submission.reviewNotes}
          </div>
        </div>
      )}
    </div>
  );
}
