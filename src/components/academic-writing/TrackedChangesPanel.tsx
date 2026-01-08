// Tracked Changes Review Panel

import { useState } from 'react';
import { Check, X, Trash2, Eye, EyeOff, Filter, Clock, User, AlertCircle } from 'lucide-react';
import type { TrackedChange, UserRole } from '../../types/trackedChanges';
import { ROLE_COLORS } from '../../types/trackedChanges';

interface TrackedChangesPanelProps {
  changes: TrackedChange[];
  onAcceptChange: (changeId: string) => void;
  onRejectChange: (changeId: string) => void;
  onDeleteChange: (changeId: string) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onClearReviewed: () => void;
  pendingCount: number;
}

export function TrackedChangesPanel({
  changes,
  onAcceptChange,
  onRejectChange,
  onDeleteChange,
  onAcceptAll,
  onRejectAll,
  onClearReviewed,
  pendingCount
}: TrackedChangesPanelProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('pending');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [expandedChangeId, setExpandedChangeId] = useState<string | null>(null);

  const filteredChanges = changes.filter(change => {
    if (filterStatus !== 'all' && change.status !== filterStatus) return false;
    if (filterRole !== 'all' && change.role !== filterRole) return false;
    return true;
  });

  const getChangeTypeLabel = (type: TrackedChange['type']) => {
    switch (type) {
      case 'insertion': return 'Added';
      case 'deletion': return 'Deleted';
      case 'replacement': return 'Modified';
    }
  };

  const getStatusBadge = (status: TrackedChange['status']) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded">Pending</span>;
      case 'accepted':
        return <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">Accepted</span>;
      case 'rejected':
        return <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">Rejected</span>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200">
        <h3 className="font-medium text-slate-900 mb-2">Tracked Changes</h3>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock className="w-4 h-4" />
          <span>{pendingCount} pending changes</span>
        </div>
      </div>

      {/* Bulk Actions */}
      {pendingCount > 0 && (
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex gap-2">
          <button
            onClick={onAcceptAll}
            className="flex-1 px-3 py-2 text-sm font-medium bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Accept All
          </button>
          <button
            onClick={onRejectAll}
            className="flex-1 px-3 py-2 text-sm font-medium bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Reject All
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="px-4 py-3 border-b border-slate-200 space-y-2">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <label className="text-xs font-medium text-slate-600">Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Changes</option>
            <option value="pending">Pending Only</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-500" />
          <label className="text-xs font-medium text-slate-600">Role:</label>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="PI">PI</option>
            <option value="Co-author">Co-author</option>
            <option value="Statistician">Statistician</option>
            <option value="Reviewer">Reviewer</option>
            <option value="Editor">Editor</option>
          </select>
        </div>
      </div>

      {/* Clear Reviewed Button */}
      {changes.some(c => c.status !== 'pending') && (
        <div className="px-4 py-2 border-b border-slate-200">
          <button
            onClick={onClearReviewed}
            className="text-xs text-slate-600 hover:text-slate-900 underline"
          >
            Clear all accepted/rejected changes
          </button>
        </div>
      )}

      {/* Changes List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChanges.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No changes to display</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredChanges.map((change) => (
              <div key={change.id} className="p-4 hover:bg-slate-50 transition-colors">
                {/* Change Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: ROLE_COLORS[change.role] }}
                      />
                      <span className="text-sm font-medium text-slate-900">{change.author}</span>
                      <span className="text-xs text-slate-500">{change.role}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{getChangeTypeLabel(change.type)}</span>
                      <span>•</span>
                      <span className="capitalize">{change.section}</span>
                      <span>•</span>
                      <span>{new Date(change.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  {getStatusBadge(change.status)}
                </div>

                {/* Change Content Preview */}
                <div className="mb-3 space-y-1">
                  {change.type === 'deletion' && change.originalText && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                      <span className="text-red-700 line-through">{change.originalText}</span>
                    </div>
                  )}
                  {change.type === 'insertion' && change.newText && (
                    <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                      <span className="text-green-700 underline">{change.newText}</span>
                    </div>
                  )}
                  {change.type === 'replacement' && (
                    <>
                      <div className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                        <span className="text-red-700 line-through">{change.originalText}</span>
                      </div>
                      <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                        <span className="text-green-700 underline">{change.newText}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Comment if present */}
                {change.comment && (
                  <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
                    💬 {change.comment}
                  </div>
                )}

                {/* Review Info */}
                {change.reviewedBy && (
                  <div className="mb-3 text-xs text-slate-500">
                    Reviewed by {change.reviewedBy} on {new Date(change.reviewedAt!).toLocaleString()}
                  </div>
                )}

                {/* Actions */}
                {change.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onAcceptChange(change.id)}
                      className="flex-1 px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Accept
                    </button>
                    <button
                      onClick={() => onRejectChange(change.id)}
                      className="flex-1 px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Reject
                    </button>
                  </div>
                )}

                {change.status !== 'pending' && (
                  <button
                    onClick={() => onDeleteChange(change.id)}
                    className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
