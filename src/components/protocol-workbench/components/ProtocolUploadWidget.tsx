import { Upload, FileText, CheckCircle, Sparkles, X, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { extractFromPDF } from '../../../services/geminiService';

interface ProtocolUploadWidgetProps {
  onProtocolExtracted: (extractedText: string, fileName: string) => void;
  onClear?: () => void;
  currentFileName?: string;
}

export function ProtocolUploadWidget({
  onProtocolExtracted,
  onClear,
  currentFileName
}: ProtocolUploadWidgetProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [extractionSuccess, setExtractionSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validExtensions = ['.pdf', '.docx', '.doc'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

    if (!validExtensions.includes(fileExtension)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
    setProcessing(true);
    setError(null);
    setExtractionSuccess(false);

    try {
      // Use existing extractFromPDF function from geminiService
      const result = await extractFromPDF(file);

      // Pass extracted text to parent component
      onProtocolExtracted(result.fullText, file.name);
      setExtractionSuccess(true);

    } catch (error) {
      console.error('Protocol extraction failed:', error);
      setError('Failed to process protocol document. Please try again.');
      setUploadedFile(null);
    } finally {
      setProcessing(false);
    }
  };

  const handleClear = () => {
    setUploadedFile(null);
    setExtractionSuccess(false);
    setError(null);
    if (onClear) onClear();
  };

  const displayFileName = currentFileName || uploadedFile?.name;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4 text-purple-600" />
        <h3 className="text-sm font-semibold text-slate-900">
          Full Protocol Document (Optional)
        </h3>
      </div>

      <p className="text-xs text-slate-600 mb-3">
        Upload your complete protocol PDF or DOCX for more accurate AI suggestions
      </p>

      {!displayFileName ? (
        <label className="cursor-pointer block">
          <input
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={handleFileUpload}
            className="hidden"
            disabled={processing}
          />
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-purple-400 hover:bg-purple-50/50 transition-all">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Upload className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-slate-900 mb-0.5">
                  Click to upload protocol
                </div>
                <div className="text-xs text-slate-500">
                  PDF or DOCX • Max 10MB
                </div>
              </div>
            </div>
          </div>
        </label>
      ) : (
        <div className="space-y-3">
          {/* File Info */}
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-slate-900 truncate">
                  {displayFileName}
                </div>
                {uploadedFile && (
                  <div className="text-xs text-slate-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                )}
              </div>
              {extractionSuccess && (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              )}
            </div>
          </div>

          {/* Processing Status */}
          {processing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
              <span className="text-xs text-blue-900">Extracting protocol content...</span>
            </div>
          )}

          {/* Success Status */}
          {extractionSuccess && !processing && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs font-semibold text-green-900 mb-1">
                    Protocol analyzed successfully!
                  </div>
                  <div className="text-xs text-green-700">
                    AI can now provide context-aware field suggestions based on your complete protocol document
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Status */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-red-800">{error}</div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <label className="flex-1 cursor-pointer">
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileUpload}
                className="hidden"
                disabled={processing}
              />
              <div className="text-xs text-center px-3 py-2 border border-purple-300 text-purple-700 rounded hover:bg-purple-50 transition-colors">
                Upload different file
              </div>
            </label>
            <button
              onClick={handleClear}
              disabled={processing}
              className="flex items-center gap-1 text-xs px-3 py-2 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
