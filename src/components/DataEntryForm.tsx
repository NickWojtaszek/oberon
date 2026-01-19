import { useState, useEffect, useCallback, useRef } from 'react';
import { Save, CheckCircle2, AlertCircle, User, Calendar, Hash, ChevronLeft, ChevronRight, FileCheck, AlertTriangle, ArrowLeft, TestTube2, X } from 'lucide-react';
import { DatabaseTable } from './database/utils/schemaGenerator';
import { DataEntryField } from './DataEntryField';
import { validateDraft, validateComplete, getFormCompletion, getTableCompletionStatus, ValidationError } from '../utils/formValidation';
import { saveDataRecord, ClinicalDataRecord } from '../utils/dataStorage';

// Confirmation Modal Component
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmVariant?: 'primary' | 'warning';
  isLoading?: boolean;
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmVariant = 'primary',
  isLoading = false
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-slate-600">{message}</p>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 ${
              confirmVariant === 'warning'
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Auto-save delay in ms (5 seconds after last change)
const AUTO_SAVE_DELAY = 5000;

interface DataEntryFormProps {
  tables: DatabaseTable[];
  protocolNumber: string;
  protocolVersion: string;
  onSave: (data: any) => void;
  initialRecord?: ClinicalDataRecord | null;
  onBackToBrowser?: () => void;
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

interface FormData {
  [tableId: string]: {
    [fieldId: string]: any;
  };
}

export function DataEntryForm({ tables, protocolNumber, protocolVersion, onSave, initialRecord, onBackToBrowser, onUnsavedChanges }: DataEntryFormProps) {
  const [subjectId, setSubjectId] = useState('');
  const [visitNumber, setVisitNumber] = useState('');
  const [enrollmentDate, setEnrollmentDate] = useState('');
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [warnings, setWarnings] = useState<ValidationError[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [selectedTable, setSelectedTable] = useState<string>(tables[0]?.tableName || '');

  // Testing mode: skip required field validation for easier testing
  const [testingMode, setTestingMode] = useState(false);

  // Auto-save timer ref
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'pending' | 'saving' | 'saved'>('idle');

  // Confirmation modal states
  const [showSaveDraftConfirm, setShowSaveDraftConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showLoadPatientConfirm, setShowLoadPatientConfirm] = useState(false);
  const [pendingPatientLoad, setPendingPatientLoad] = useState<ClinicalDataRecord | null>(null);

  useEffect(() => {
    if (initialRecord) {
      setSubjectId(initialRecord.subjectId);
      setVisitNumber(initialRecord.visitNumber || '');
      setEnrollmentDate(initialRecord.enrollmentDate);
      setFormData(initialRecord.data);
      setHasUnsavedChanges(false);
    }
  }, [initialRecord]);

  // Report unsaved changes to parent component
  useEffect(() => {
    onUnsavedChanges?.(hasUnsavedChanges);
  }, [hasUnsavedChanges, onUnsavedChanges]);

  // Auto-save function
  const performAutoSave = useCallback(async () => {
    // Only auto-save if we have subject ID and enrollment date (minimum required)
    if (!subjectId.trim() || !enrollmentDate) {
      console.log('⏸️ Auto-save skipped: missing Subject ID or Enrollment Date');
      setAutoSaveStatus('idle');
      return;
    }

    setAutoSaveStatus('saving');

    try {
      const result = saveDataRecord({
        protocolNumber,
        protocolVersion,
        subjectId,
        visitNumber: visitNumber || null,
        enrollmentDate,
        collectedBy: 'Current User',
        status: 'draft',
        data: formData,
      });

      if (result.success) {
        console.log('💾 Auto-saved successfully:', result.recordId);
        setAutoSaveStatus('saved');
        setHasUnsavedChanges(false);
        // Reset status after 2 seconds
        setTimeout(() => setAutoSaveStatus('idle'), 2000);
      }
    } catch (error) {
      console.error('❌ Auto-save failed:', error);
      setAutoSaveStatus('idle');
    }
  }, [subjectId, enrollmentDate, visitNumber, formData, protocolNumber, protocolVersion]);

  // Schedule auto-save when data changes
  useEffect(() => {
    if (hasUnsavedChanges && subjectId && enrollmentDate) {
      setAutoSaveStatus('pending');

      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Schedule new auto-save
      autoSaveTimerRef.current = setTimeout(() => {
        performAutoSave();
      }, AUTO_SAVE_DELAY);

      return () => {
        if (autoSaveTimerRef.current) {
          clearTimeout(autoSaveTimerRef.current);
        }
      };
    }
  }, [hasUnsavedChanges, subjectId, enrollmentDate, performAutoSave]);

  const handleFieldChange = (tableId: string, fieldId: string, value: any) => {
    console.log('✅ Field changed:', { tableId, fieldId, value });

    setFormData((prev) => ({
      ...prev,
      [tableId]: {
        ...prev[tableId],
        [fieldId]: value,
      },
    }));

    // Mark as having unsaved changes (triggers auto-save)
    setHasUnsavedChanges(true);

    // Clear error/warning for this field
    setErrors((prev) => prev.filter((e) => !(e.tableId === tableId && e.fieldId === fieldId)));
    setWarnings((prev) => prev.filter((w) => !(w.tableId === tableId && w.fieldId === fieldId)));
  };

  // Show confirmation for save draft
  const handleSaveDraftClick = () => {
    // Validate first before showing confirmation
    const validation = validateDraft(subjectId, enrollmentDate, formData, tables);
    setErrors(validation.errors);
    setWarnings(validation.warnings);

    if (!validation.isValid) {
      console.log('❌ Draft validation failed:', validation.errors);
      return;
    }

    setShowSaveDraftConfirm(true);
  };

  const handleSaveDraft = async () => {
    console.log('💾 Saving draft...', { subjectId, enrollmentDate, formData });
    setShowSaveDraftConfirm(false);
    setIsSaving(true);

    try {
      const result = saveDataRecord({
        protocolNumber,
        protocolVersion,
        subjectId,
        visitNumber: visitNumber || null,
        enrollmentDate,
        collectedBy: 'Current User',
        status: 'draft',
        data: formData,
      });

      if (result.success) {
        console.log('✅ Draft saved successfully:', result.recordId);
        setSaveSuccess(true);
        setSaveMessage('Draft saved successfully');
        setHasUnsavedChanges(false);
        onSave({ recordId: result.recordId, status: 'draft' });

        // Reset success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
          setSaveMessage('');
        }, 3000);
      } else {
        console.error('❌ Save failed:', result.error);
        setErrors([{
          tableId: 'base',
          fieldId: 'save',
          message: `Save failed: ${result.error}`,
          severity: 'error',
        }]);
      }
    } catch (error) {
      console.error('❌ Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Show confirmation for submit complete
  const handleSubmitCompleteClick = () => {
    // Validate first before showing confirmation
    const validation = validateComplete(subjectId, enrollmentDate, formData, tables, testingMode);
    setErrors(validation.errors);
    setWarnings(validation.warnings);

    if (!validation.isValid) {
      console.log('❌ Complete validation failed:', validation.errors);
      return;
    }

    setShowSubmitConfirm(true);
  };

  const handleSubmitComplete = async () => {
    console.log('📋 Submitting complete form...', { testingMode });
    setShowSubmitConfirm(false);
    setIsSaving(true);

    try {
      const result = saveDataRecord({
        protocolNumber,
        protocolVersion,
        subjectId,
        visitNumber: visitNumber || null,
        enrollmentDate,
        collectedBy: 'Current User',
        status: 'complete',
        data: formData,
      });

      if (result.success) {
        console.log('✅ Complete form submitted:', result.recordId);
        setSaveSuccess(true);
        setSaveMessage('Form submitted successfully');
        setHasUnsavedChanges(false);
        onSave({ recordId: result.recordId, status: 'complete' });

        // Reset form after complete submission
        setTimeout(() => {
          setFormData({});
          setSubjectId('');
          setVisitNumber('');
          setEnrollmentDate('');
          setSaveSuccess(false);
          setSaveMessage('');
        }, 2000);
      } else {
        console.error('❌ Submit failed:', result.error);
        setErrors([{
          tableId: 'base',
          fieldId: 'save',
          message: `Submit failed: ${result.error}`,
          severity: 'error',
        }]);
      }
    } catch (error) {
      console.error('❌ Submit error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getFieldError = (tableId: string, fieldId: string): string | undefined => {
    return errors.find((e) => e.tableId === tableId && e.fieldId === fieldId)?.message;
  };

  // Calculate progress
  const completion = getFormCompletion(formData, tables);
  const tableStatus = getTableCompletionStatus(formData, tables);

  // Navigation
  const selectedTableData = tables.find((t) => t.tableName === selectedTable);

  // Filter out:
  // 1. Section dataType (these are headers/dividers, not data entry fields)
  // 2. Base structural fields that are handled separately in the form header
  const baseFieldIds = ['subject_id', 'visit_name', 'visit_date', 'enrollment_date', 'visit_number'];
  const activeFields = selectedTableData?.fields.filter((f) =>
    f.dataType !== 'Section' && !baseFieldIds.includes(f.id)
  ) || [];

  // Debug: Log field filtering
  useEffect(() => {
    if (selectedTableData) {
      const totalFields = selectedTableData.fields.length;
      const sectionFields = selectedTableData.fields.filter(f => f.dataType === 'Section').length;
      const baseFields = selectedTableData.fields.filter(f => baseFieldIds.includes(f.id)).length;
      console.log(`📝 [DataEntryForm] Field filtering for "${selectedTable}":`, {
        total: totalFields,
        sections: sectionFields,
        baseFields: baseFields,
        active: activeFields.length,
        sampleFields: activeFields.slice(0, 5).map(f => ({ name: f.fieldName, type: f.dataType, cat: f.category }))
      });
    }
  }, [selectedTableData, selectedTable, activeFields]);

  const currentTableIndex = tables.findIndex((t) => t.tableName === selectedTable);
  const canGoPrevious = currentTableIndex > 0;
  const canGoNext = currentTableIndex < tables.length - 1;

  const handlePrevious = () => {
    if (canGoPrevious) {
      setSelectedTable(tables[currentTableIndex - 1].tableName);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setSelectedTable(tables[currentTableIndex + 1].tableName);
    }
  };

  // Debug: Log when tables change
  useEffect(() => {
    console.log('📊 Tables loaded:', tables.length, tables.map(t => t.tableName));
  }, [tables]);

  return (
    <div className="space-y-6">
      {/* Back to Browser Button */}
      {initialRecord && onBackToBrowser && (
        <button
          onClick={onBackToBrowser}
          className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-white border border-slate-200 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Data Browser
        </button>
      )}

      {/* Header Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-slate-900">{initialRecord ? 'Review/Edit Record' : 'Data Collection Form'}</h2>
            <p className="text-sm text-slate-600 mt-1">
              Protocol {protocolNumber} • Version {protocolVersion}
              {initialRecord && <span className="ml-2">• {initialRecord.recordId}</span>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Auto-save status indicator */}
            {autoSaveStatus !== 'idle' && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${
                autoSaveStatus === 'pending' ? 'bg-amber-50 text-amber-700' :
                autoSaveStatus === 'saving' ? 'bg-blue-50 text-blue-700' :
                'bg-green-50 text-green-700'
              }`}>
                {autoSaveStatus === 'pending' && '⏳ Auto-save pending...'}
                {autoSaveStatus === 'saving' && '💾 Auto-saving...'}
                {autoSaveStatus === 'saved' && '✅ Auto-saved'}
              </div>
            )}

            {/* Testing Mode Toggle */}
            <label className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors">
              <input
                type="checkbox"
                checked={testingMode}
                onChange={(e) => setTestingMode(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
              <TestTube2 className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">Testing Mode</span>
            </label>

            {saveSuccess && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-700">{saveMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Testing Mode Notice */}
        {testingMode && (
          <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-purple-800">
              <TestTube2 className="w-4 h-4" />
              <span className="font-medium">Testing Mode Enabled:</span>
              <span>Required field validation is disabled. You can submit with any fields filled.</span>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-700">Form Completion</span>
            <span className="text-sm text-slate-600">{completion.filled} / {completion.total} fields ({completion.percentage}%)</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${completion.percentage}%` }}
            />
          </div>
        </div>

        {/* Base Fields */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Subject ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., SUB-001"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {getFieldError('base', 'subject_id') && (
              <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="w-3 h-3" />
                {getFieldError('base', 'subject_id')}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Visit Number
            </label>
            <div className="relative">
              <input
                type="number"
                value={visitNumber}
                onChange={(e) => setVisitNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 1"
                min="0"
              />
              <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className="mt-1 text-xs text-slate-500">Leave blank for baseline</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Enrollment Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={enrollmentDate}
                onChange={(e) => setEnrollmentDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {getFieldError('base', 'enrollment_date') && (
              <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="w-3 h-3" />
                {getFieldError('base', 'enrollment_date')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Validation Errors Summary */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-medium text-red-900 mb-2">
                Please fix the following errors:
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.slice(0, 5).map((error, idx) => (
                  <li key={idx}>• {error.message}</li>
                ))}
                {errors.length > 5 && (
                  <li className="text-red-600">• And {errors.length - 5} more...</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Section Navigation Tabs */}
      {tables.length > 1 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex border-b border-slate-200 overflow-x-auto">
            {tables.map((table, index) => {
              const status = tableStatus.get(table.tableName);
              const isActive = table.tableName === selectedTable;
              
              return (
                <button
                  key={table.tableName}
                  onClick={() => setSelectedTable(table.tableName)}
                  className={`flex-shrink-0 px-6 py-3 text-sm font-medium border-b-2 transition-colors relative ${
                    isActive
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{table.displayName}</span>
                    {status?.isComplete && (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  {status && (
                    <div className="text-xs text-slate-500 mt-1">
                      {status.filled}/{status.total}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Form Fields */}
      {selectedTableData && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {/* Section Header with Navigation */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-slate-900">{selectedTableData.displayName}</h3>
                  <span className="text-xs text-slate-500">
                    Section {currentTableIndex + 1} of {tables.length}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{selectedTableData.description}</p>
              </div>
              {tables.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevious}
                    disabled={!canGoPrevious}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      canGoPrevious
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'border border-slate-300 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!canGoNext}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      canGoNext
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'border border-slate-300 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Fields */}
          <div className="p-6">
            <div className="space-y-4">
              {activeFields.map((field) => (
                <DataEntryField
                  key={field.id}
                  field={field}
                  value={formData[selectedTable]?.[field.id]}
                  onChange={(fieldId, value) => handleFieldChange(selectedTable, fieldId, value)}
                  error={getFieldError(selectedTable, field.id)}
                />
              ))}
              {activeFields.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  No fields available for this section
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-6">
        <button
          onClick={() => {
            setFormData({});
            setSubjectId('');
            setVisitNumber('');
            setEnrollmentDate('');
            setErrors([]);
            setWarnings([]);
          }}
          className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-700"
        >
          Clear Form
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraftClick}
            disabled={isSaving}
            className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Draft
              </>
            )}
          </button>
          <button
            onClick={handleSubmitCompleteClick}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <FileCheck className="w-4 h-4" />
                Submit Complete
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showSaveDraftConfirm}
        onClose={() => setShowSaveDraftConfirm(false)}
        onConfirm={handleSaveDraft}
        title="Save as Draft"
        message={`Save data for Subject ${subjectId} as a draft? You can continue editing later.`}
        confirmText="Save Draft"
        isLoading={isSaving}
      />

      <ConfirmationModal
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        onConfirm={handleSubmitComplete}
        title="Submit Complete Record"
        message={`Submit complete record for Subject ${subjectId}? This marks the data as finalized. The form will be cleared after submission.`}
        confirmText="Submit Complete"
        confirmVariant="warning"
        isLoading={isSaving}
      />

      {/* Warnings (non-blocking) */}
      {warnings.length > 0 && errors.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-medium text-amber-900 mb-2">
                Recommended fields missing:
              </div>
              <ul className="text-sm text-amber-700 space-y-1">
                {warnings.slice(0, 3).map((warning, idx) => (
                  <li key={idx}>• {warning.message}</li>
                ))}
                {warnings.length > 3 && (
                  <li className="text-amber-600">• And {warnings.length - 3} more...</li>
                )}
              </ul>
              <div className="text-xs text-amber-600 mt-2">
                You can save as draft and complete these fields later.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}