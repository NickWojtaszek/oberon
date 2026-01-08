// Document Upload Panel - Manage IRB submission documents

import { useState } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import type { DocumentMetadata } from '../../types/ethics';

interface DocumentUploadPanelProps {
  submissionId: string;
  documents: DocumentMetadata[];
  onDocumentsUpdate: (documents: DocumentMetadata[]) => void;
  onClose: () => void;
  canEdit: boolean;
}

const DOCUMENT_TYPES = [
  { value: 'ICF', label: 'Informed Consent Form' },
  { value: 'PROTOCOL', label: 'Study Protocol' },
  { value: 'PI_CV', label: 'Principal Investigator CV' },
  { value: 'AMENDMENT', label: 'Amendment Document' },
  { value: 'OTHER', label: 'Other Supporting Document' },
] as const;

export function DocumentUploadPanel({ 
  submissionId, 
  documents, 
  onDocumentsUpdate, 
  onClose,
  canEdit 
}: DocumentUploadPanelProps) {
  const [uploadQueue, setUploadQueue] = useState<Array<{
    id: string;
    file: File;
    type: DocumentMetadata['type'];
    status: 'pending' | 'uploading' | 'success' | 'error';
    progress: number;
  }>>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newUploads = Array.from(files).map(file => ({
      id: `upload_${Date.now()}_${Math.random()}`,
      file,
      type: 'OTHER' as DocumentMetadata['type'],
      status: 'pending' as const,
      progress: 0,
    }));

    setUploadQueue(prev => [...prev, ...newUploads]);
  };

  const handleTypeChange = (uploadId: string, type: DocumentMetadata['type']) => {
    setUploadQueue(prev => prev.map(u => 
      u.id === uploadId ? { ...u, type } : u
    ));
  };

  const handleUpload = async (uploadId: string) => {
    const upload = uploadQueue.find(u => u.id === uploadId);
    if (!upload) return;

    // Update status to uploading
    setUploadQueue(prev => prev.map(u => 
      u.id === uploadId ? { ...u, status: 'uploading' as const, progress: 0 } : u
    ));

    // Simulate upload progress (in production, this would be actual file upload)
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadQueue(prev => prev.map(u => 
        u.id === uploadId ? { ...u, progress: i } : u
      ));
    }

    // Create document metadata
    const newDocument: DocumentMetadata = {
      id: `doc_${Date.now()}`,
      name: upload.file.name,
      type: upload.type,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'current-user', // TODO: Get from auth context
      fileSize: upload.file.size,
    };

    // Add to documents
    onDocumentsUpdate([...documents, newDocument]);

    // Update status to success
    setUploadQueue(prev => prev.map(u => 
      u.id === uploadId ? { ...u, status: 'success' as const, progress: 100 } : u
    ));

    // Remove from queue after 2 seconds
    setTimeout(() => {
      setUploadQueue(prev => prev.filter(u => u.id !== uploadId));
    }, 2000);
  };

  const handleRemoveFromQueue = (uploadId: string) => {
    setUploadQueue(prev => prev.filter(u => u.id !== uploadId));
  };

  const handleDeleteDocument = (documentId: string) => {
    if (!canEdit) {
      alert('You do not have permission to delete documents.');
      return;
    }

    if (confirm('Are you sure you want to delete this document?')) {
      onDocumentsUpdate(documents.filter(d => d.id !== documentId));
    }
  };

  const getDocumentTypeLabel = (type: DocumentMetadata['type']) => {
    return DOCUMENT_TYPES.find(t => t.value === type)?.label || type;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-900">Document Management</h3>
              <div className="text-sm text-slate-600 mt-1">
                Submission: {submissionId}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Upload Area */}
          {canEdit && (
            <div className="mb-6">
              <label className="block">
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-slate-900">Upload Documents</div>
                      <div className="text-sm text-slate-500 mt-1">
                        Click to browse or drag and drop
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        PDF, DOC, DOCX up to 10MB
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          )}

          {/* Upload Queue */}
          {uploadQueue.length > 0 && (
            <div className="mb-6">
              <div className="text-sm font-medium text-slate-700 mb-3">Upload Queue</div>
              <div className="space-y-3">
                {uploadQueue.map(upload => (
                  <div key={upload.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 truncate">
                          {upload.file.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {formatFileSize(upload.file.size)}
                        </div>

                        {/* Document Type Selector */}
                        {upload.status === 'pending' && (
                          <div className="mt-2">
                            <select
                              value={upload.type}
                              onChange={(e) => handleTypeChange(upload.id, e.target.value as DocumentMetadata['type'])}
                              className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm"
                            >
                              {DOCUMENT_TYPES.map(type => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Progress Bar */}
                        {upload.status === 'uploading' && (
                          <div className="mt-2">
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 transition-all duration-300"
                                style={{ width: `${upload.progress}%` }}
                              />
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              Uploading... {upload.progress}%
                            </div>
                          </div>
                        )}

                        {/* Success Message */}
                        {upload.status === 'success' && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>Upload successful</span>
                          </div>
                        )}

                        {/* Error Message */}
                        {upload.status === 'error' && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            <span>Upload failed</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {upload.status === 'pending' && (
                          <button
                            onClick={() => handleUpload(upload.id)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                          >
                            Upload
                          </button>
                        )}
                        {upload.status === 'pending' && (
                          <button
                            onClick={() => handleRemoveFromQueue(upload.id)}
                            className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                          >
                            <X className="w-4 h-4 text-slate-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Existing Documents */}
          <div>
            <div className="text-sm font-medium text-slate-700 mb-3">
              Uploaded Documents ({documents.length})
            </div>
            {documents.length > 0 ? (
              <div className="space-y-2">
                {documents.map(doc => (
                  <div 
                    key={doc.id}
                    className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900 truncate">
                        {doc.name}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span>{getDocumentTypeLabel(doc.type)}</span>
                        <span>•</span>
                        <span>Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        {doc.fileSize && (
                          <>
                            <span>•</span>
                            <span>{formatFileSize(doc.fileSize)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {canEdit && (
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="p-1.5 hover:bg-red-50 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="text-sm">No documents uploaded yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-600">
              {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
