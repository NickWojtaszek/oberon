// Audit Log Viewer - Regulatory compliance history

import { useState, useEffect } from 'react';
import { FileText, Download, Filter, Search, Shield, Clock } from 'lucide-react';
import { getAuditLogger } from '../../utils/auditLogger';
import type { AuditLogEntry, AuditAction } from '../../types/ethics';

interface AuditLogViewerProps {
  projectId: string;
  submissionId?: string; // Filter to specific submission
}

const ACTION_LABELS: Record<AuditAction, string> = {
  SUBMISSION_CREATED: 'Submission Created',
  SUBMISSION_EDITED: 'Submission Edited',
  SUBMISSION_SUBMITTED: 'Submitted to IRB',
  SUBMISSION_APPROVED: 'Submission Approved',
  SUBMISSION_REJECTED: 'Submission Rejected',
  SUBMISSION_WITHDRAWN: 'Submission Withdrawn',
  DOCUMENT_UPLOADED: 'Document Uploaded',
  DOCUMENT_DELETED: 'Document Deleted',
  STATUS_CHANGED: 'Status Changed',
  APPROVAL_GRANTED: 'IRB Approval Granted',
  APPROVAL_EXPIRED: 'Approval Expired',
  EXPORT_BLOCKED: 'Export Blocked',
  EXPORT_ALLOWED: 'Export Allowed',
};

const ACTION_COLORS: Record<AuditAction, string> = {
  SUBMISSION_CREATED: 'bg-blue-100 text-blue-700 border-blue-200',
  SUBMISSION_EDITED: 'bg-slate-100 text-slate-700 border-slate-200',
  SUBMISSION_SUBMITTED: 'bg-purple-100 text-purple-700 border-purple-200',
  SUBMISSION_APPROVED: 'bg-green-100 text-green-700 border-green-200',
  SUBMISSION_REJECTED: 'bg-red-100 text-red-700 border-red-200',
  SUBMISSION_WITHDRAWN: 'bg-orange-100 text-orange-700 border-orange-200',
  DOCUMENT_UPLOADED: 'bg-blue-100 text-blue-700 border-blue-200',
  DOCUMENT_DELETED: 'bg-red-100 text-red-700 border-red-200',
  STATUS_CHANGED: 'bg-amber-100 text-amber-700 border-amber-200',
  APPROVAL_GRANTED: 'bg-green-100 text-green-700 border-green-200',
  APPROVAL_EXPIRED: 'bg-red-100 text-red-700 border-red-200',
  EXPORT_BLOCKED: 'bg-red-100 text-red-700 border-red-200',
  EXPORT_ALLOWED: 'bg-green-100 text-green-700 border-green-200',
};

export function AuditLogViewer({ projectId, submissionId }: AuditLogViewerProps) {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [filterAction, setFilterAction] = useState<AuditAction | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const logger = getAuditLogger(projectId);
    
    if (submissionId) {
      setEntries(logger.getSubmissionEntries(submissionId));
    } else {
      setEntries(logger.getRecentEntries(100));
    }
  }, [projectId, submissionId]);

  const handleExport = () => {
    const logger = getAuditLogger(projectId);
    const logData = logger.exportLog();
    
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_log_${projectId}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredEntries = entries.filter(entry => {
    // Action filter
    if (filterAction !== 'ALL' && entry.action !== filterAction) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        entry.performedByName.toLowerCase().includes(searchLower) ||
        ACTION_LABELS[entry.action].toLowerCase().includes(searchLower) ||
        entry.details.reason?.toLowerCase().includes(searchLower) ||
        JSON.stringify(entry.details.metadata).toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDetails = (entry: AuditLogEntry) => {
    const parts: string[] = [];

    if (entry.details.reason) {
      parts.push(entry.details.reason);
    }

    if (entry.details.oldValue !== undefined && entry.details.newValue !== undefined) {
      parts.push(`Changed from "${entry.details.oldValue}" to "${entry.details.newValue}"`);
    }

    if (entry.details.metadata) {
      const metaStr = Object.entries(entry.details.metadata)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      if (metaStr) parts.push(metaStr);
    }

    return parts.join(' • ');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="font-medium text-slate-900">Audit Log</h3>
              <div className="text-xs text-slate-500 mt-0.5">
                {entries.length} entries • Regulatory compliance trail
              </div>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by user, action, or details..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>

          {/* Action Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value as AuditAction | 'ALL')}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="ALL">All Actions</option>
              <optgroup label="Submission Events">
                <option value="SUBMISSION_CREATED">Created</option>
                <option value="SUBMISSION_SUBMITTED">Submitted</option>
                <option value="SUBMISSION_APPROVED">Approved</option>
                <option value="SUBMISSION_REJECTED">Rejected</option>
              </optgroup>
              <optgroup label="Document Events">
                <option value="DOCUMENT_UPLOADED">Uploaded</option>
                <option value="DOCUMENT_DELETED">Deleted</option>
              </optgroup>
              <optgroup label="Compliance Events">
                <option value="APPROVAL_GRANTED">Approval Granted</option>
                <option value="APPROVAL_EXPIRED">Approval Expired</option>
                <option value="EXPORT_BLOCKED">Export Blocked</option>
                <option value="EXPORT_ALLOWED">Export Allowed</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Entries List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {filteredEntries.length > 0 ? (
          <div className="space-y-3">
            {filteredEntries.map((entry, index) => (
              <div
                key={entry.id}
                className="p-4 bg-white border border-slate-200 rounded-lg hover:border-purple-300 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${ACTION_COLORS[entry.action]}`}>
                      {ACTION_LABELS[entry.action]}
                    </span>
                    {index === 0 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        Latest
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {formatTimestamp(entry.timestamp)}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-purple-700">
                      {entry.performedByName.charAt(0)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-slate-900">{entry.performedByName}</span>
                    <span className="text-slate-500"> · </span>
                    <span className="text-slate-600">{entry.performedByRole}</span>
                  </div>
                </div>

                {/* Details */}
                {formatDetails(entry) && (
                  <div className="text-sm text-slate-600 mt-2 pl-8">
                    {formatDetails(entry)}
                  </div>
                )}

                {/* Submission ID */}
                {entry.submissionId && !submissionId && (
                  <div className="text-xs text-slate-500 mt-2 pl-8">
                    Submission: {entry.submissionId}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm">No audit entries found</p>
              {(filterAction !== 'ALL' || searchQuery) && (
                <button
                  onClick={() => {
                    setFilterAction('ALL');
                    setSearchQuery('');
                  }}
                  className="mt-2 text-xs text-purple-600 hover:text-purple-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
        <div className="text-xs text-slate-600">
          <strong>Regulatory Note:</strong> This audit log is immutable and maintained for compliance inspection. 
          All actions are timestamped and attributed to authenticated users.
        </div>
      </div>
    </div>
  );
}
