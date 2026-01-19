import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, X, FileJson, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  readProtocolFile,
  validateProtocolImport,
  importProtocol,
  getExportSummary,
  type ValidationResult,
  type ImportResult,
} from '../../../utils/protocolExportImport';

interface ImportProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (result: ImportResult) => void;
}

type ImportStep = 'select' | 'preview' | 'importing' | 'complete';

export function ImportProtocolModal({ isOpen, onClose, onImportComplete }: ImportProtocolModalProps) {
  const { t } = useTranslation('protocolLibrary');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<ImportStep>('select');
  const [fileData, setFileData] = useState<any>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  // Import options
  const [generateNewId, setGenerateNewId] = useState(true);
  const [includeClinicalData, setIncludeClinicalData] = useState(true);
  const [includeManifests, setIncludeManifests] = useState(true);

  const handleClose = () => {
    setStep('select');
    setFileData(null);
    setValidation(null);
    setImportResult(null);
    onClose();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await readProtocolFile(file);
      setFileData(data);

      const validationResult = validateProtocolImport(data);
      setValidation(validationResult);
      setStep('preview');
    } catch (error) {
      setValidation({
        valid: false,
        errors: [String(error)],
        warnings: [],
      });
      setStep('preview');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImport = () => {
    if (!fileData || !validation?.valid) return;

    setStep('importing');

    // Small delay for UX
    setTimeout(() => {
      const result = importProtocol(fileData, {
        generateNewId,
        overwriteExisting: !generateNewId,
        importClinicalData: includeClinicalData,
        importManifests: includeManifests,
      });

      setImportResult(result);
      setStep('complete');

      if (result.success) {
        onImportComplete(result);
      }
    }, 500);
  };

  if (!isOpen) return null;

  const summary = validation?.protocol ? getExportSummary(validation.protocol) : null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Import Protocol</h2>
              <p className="text-sm text-slate-600">
                {step === 'select' && 'Select a protocol export file to import'}
                {step === 'preview' && 'Review protocol details before importing'}
                {step === 'importing' && 'Importing protocol...'}
                {step === 'complete' && 'Import complete'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: File Selection */}
          {step === 'select' && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
              >
                <FileJson className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-700 font-medium mb-1">Click to select a file</p>
                <p className="text-sm text-slate-500">or drag and drop a .json export file</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-xs text-slate-500 text-center">
                Supports protocol export files (.json) from Clinical Intelligence Engine
              </p>
            </div>
          )}

          {/* Step 2: Preview & Validation */}
          {step === 'preview' && (
            <div className="space-y-4">
              {/* Validation Errors */}
              {validation && !validation.valid && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800">Invalid file</p>
                      <ul className="mt-2 text-sm text-red-700 space-y-1">
                        {validation.errors.map((error, i) => (
                          <li key={i}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Protocol Summary */}
              {validation?.valid && summary && (
                <>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-slate-600" />
                      <span className="font-medium text-slate-900">{summary.title}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-slate-500">Protocol Number:</span>
                        <span className="ml-2 text-slate-900">{summary.protocolNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Versions:</span>
                        <span className="ml-2 text-slate-900">
                          {summary.versionCount} ({summary.publishedVersions} published)
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Schema Blocks:</span>
                        <span className="ml-2 text-slate-900">{summary.schemaBlockCount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">PICO:</span>
                        {summary.hasPico ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Papers:</span>
                        {summary.hasFoundationalPapers ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Stats Plan:</span>
                        {summary.hasStatisticalPlan ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Warnings */}
                  {validation.warnings.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-amber-800">Warnings</p>
                          <ul className="mt-2 text-sm text-amber-700 space-y-1">
                            {validation.warnings.map((warning, i) => (
                              <li key={i}>• {warning}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Import Options */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-700">Import Options</p>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={generateNewId}
                        onChange={(e) => setGenerateNewId(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-slate-700">
                        Generate new protocol ID (recommended to avoid conflicts)
                      </span>
                    </label>
                    {fileData?.clinicalData && (
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeClinicalData}
                          onChange={(e) => setIncludeClinicalData(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-slate-700">
                          Import clinical data ({fileData.clinicalData.length} records)
                        </span>
                      </label>
                    )}
                    {fileData?.statisticalManifests && (
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeManifests}
                          onChange={(e) => setIncludeManifests(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-slate-700">
                          Import statistical manifests ({fileData.statisticalManifests.length})
                        </span>
                      </label>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Importing */}
          {step === 'importing' && (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Importing protocol...</p>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 'complete' && importResult && (
            <div className="space-y-4">
              {importResult.success ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800">Import successful!</p>
                      <p className="text-sm text-green-700 mt-1">
                        Protocol "{importResult.protocolNumber}" imported with {importResult.versionCount} version(s).
                      </p>
                      {importResult.warnings && importResult.warnings.length > 0 && (
                        <ul className="mt-2 text-sm text-green-700 space-y-1">
                          {importResult.warnings.map((warning, i) => (
                            <li key={i}>• {warning}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800">Import failed</p>
                      <p className="text-sm text-red-700 mt-1">{importResult.error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
          {step === 'select' && (
            <button
              onClick={handleClose}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          )}

          {step === 'preview' && (
            <>
              <button
                onClick={() => setStep('select')}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
              >
                Back
              </button>
              {validation?.valid && (
                <button
                  onClick={handleImport}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Import Protocol
                </button>
              )}
            </>
          )}

          {step === 'complete' && (
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
