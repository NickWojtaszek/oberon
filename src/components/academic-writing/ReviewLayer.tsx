// Supervisor Mode - PI/Professor Review Layer

import { useState } from 'react';
import { MessageSquare, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import type { ReviewComment } from '../../types/manuscript';

interface ReviewLayerProps {
  comments: ReviewComment[];
  onAddComment: (comment: Omit<ReviewComment, 'id' | 'timestamp'>) => void;
  onResolveComment: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export function ReviewLayer({ comments, onAddComment, onResolveComment, onDeleteComment }: ReviewLayerProps) {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newComment, setNewComment] = useState({
    author: '',
    role: 'PI' as const,
    section: 'introduction' as const,
    comment: '',
    severity: 'info' as const
  });

  const handleSubmit = () => {
    if (!newComment.author || !newComment.comment) return;

    onAddComment({
      ...newComment,
      resolved: false
    });

    setNewComment({
      author: '',
      role: 'PI',
      section: 'introduction',
      comment: '',
      severity: 'info'
    });
    setIsAddingComment(false);
  };

  const getSeverityIcon = (severity: ReviewComment['severity']) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'info': return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getSeverityColor = (severity: ReviewComment['severity']) => {
    switch (severity) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-amber-200 bg-amber-50';
      case 'info': return 'border-blue-200 bg-blue-50';
    }
  };

  const getRoleBadge = (role: ReviewComment['role']) => {
    const colors = {
      PI: 'bg-purple-100 text-purple-700',
      Professor: 'bg-blue-100 text-blue-700',
      Reviewer: 'bg-green-100 text-green-700',
      Statistician: 'bg-amber-100 text-amber-700'
    };
    return colors[role];
  };

  const unresolvedComments = comments.filter(c => !c.resolved);
  const resolvedComments = comments.filter(c => c.resolved);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h3 className="text-slate-900">Review Comments</h3>
          </div>
          <button
            onClick={() => setIsAddingComment(true)}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Add Comment
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-slate-500">Unresolved</div>
            <div className="text-slate-900 font-medium">{unresolvedComments.length}</div>
          </div>
          <div>
            <div className="text-slate-500">Resolved</div>
            <div className="text-slate-900 font-medium">{resolvedComments.length}</div>
          </div>
        </div>
      </div>

      {/* Add Comment Form */}
      {isAddingComment && (
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-600 mb-1">Your Name</label>
              <input
                type="text"
                value={newComment.author}
                onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Dr. Smith"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Role</label>
                <select
                  value={newComment.role}
                  onChange={(e) => setNewComment({ ...newComment, role: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PI">PI</option>
                  <option value="Professor">Professor</option>
                  <option value="Reviewer">Reviewer</option>
                  <option value="Statistician">Statistician</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Section</label>
                <select
                  value={newComment.section}
                  onChange={(e) => setNewComment({ ...newComment, section: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="introduction">Introduction</option>
                  <option value="methods">Methods</option>
                  <option value="results">Results</option>
                  <option value="discussion">Discussion</option>
                  <option value="conclusion">Conclusion</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Severity</label>
              <select
                value={newComment.severity}
                onChange={(e) => setNewComment({ ...newComment, severity: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Comment</label>
              <textarea
                value={newComment.comment}
                onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                placeholder="Enter your feedback..."
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Add Comment
              </button>
              <button
                onClick={() => setIsAddingComment(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4">
        {comments.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <div className="text-sm">No review comments yet</div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Unresolved */}
            {unresolvedComments.length > 0 && (
              <>
                <div className="text-xs font-medium text-slate-600 mb-2">UNRESOLVED</div>
                {unresolvedComments.map(comment => (
                  <div key={comment.id} className={`border rounded-lg p-3 ${getSeverityColor(comment.severity)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(comment.severity)}
                        <span className={`px-2 py-0.5 rounded text-xs ${getRoleBadge(comment.role)}`}>
                          {comment.role}
                        </span>
                        <span className="text-xs text-slate-600">{comment.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onResolveComment(comment.id)}
                          className="p-1 hover:bg-green-100 rounded transition-colors"
                          title="Mark as resolved"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </button>
                        <button
                          onClick={() => onDeleteComment(comment.id)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                          title="Delete comment"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 mb-2">
                      Section: {comment.section.charAt(0).toUpperCase() + comment.section.slice(1)} • 
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-slate-900">{comment.comment}</div>
                  </div>
                ))}
              </>
            )}

            {/* Resolved */}
            {resolvedComments.length > 0 && (
              <>
                <div className="text-xs font-medium text-slate-600 mb-2 mt-6">RESOLVED</div>
                {resolvedComments.map(comment => (
                  <div key={comment.id} className="border border-slate-200 rounded-lg p-3 opacity-60">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className={`px-2 py-0.5 rounded text-xs ${getRoleBadge(comment.role)}`}>
                          {comment.role}
                        </span>
                        <span className="text-xs text-slate-600">{comment.author}</span>
                      </div>
                      <button
                        onClick={() => onDeleteComment(comment.id)}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                    <div className="text-xs text-slate-500 mb-2">
                      Section: {comment.section} • {new Date(comment.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-slate-900">{comment.comment}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
