import { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, User, Calendar, Hash, ChevronLeft, ChevronRight, FileCheck, AlertTriangle, ArrowLeft } from 'lucide-react';
import { DatabaseTable } from './database/utils/schemaGenerator';
import { DataEntryField } from './DataEntryField';
import { validateDraft, validateComplete, getFormCompletion, getTableCompletionStatus, ValidationError } from '../utils/formValidation';
import { saveDataRecord, ClinicalDataRecord } from '../utils/dataStorage';

interface DataEntryFormProps {
  tables: DatabaseTable[];
  protocolNumber: string;
  protocolVersion: string;
  onSave: (data: any) => void;
  initialRecord?: ClinicalDataRecord | null;
  onBackToBrowser?: () => void;
}

interface FormData {
  [tableId: string]: {
    [fieldId: string]: any;
  };
}

export function DataEntryForm({ tables, protocolNumber, protocolVersion, onSave, initialRecord, onBackToBrowser }: DataEntryFormProps) {
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

  useEffect(() => {
    if (initialRecord) {
      setSubjectId(initialRecord.subjectId);
      setVisitNumber(initialRecord.visitNumber || '');
      setEnrollmentDate(initialRecord.enrollmentDate);
      setFormData(initialRecord.data);
    }
  }, [initialRecord]);

  const handleFieldChange = (tableId: string, fieldId: string, value: any) => {
    console.log('✅ Field changed:', { tableId, fieldId, value });
    
    setFormData((prev) => ({
      ...prev,
      [tableId]: {
        ...prev[tableId],
        [fieldId]: value,
      },
    }));

    // Clear error/warning for this field
    setErrors((prev) => prev.filter((e) => !(e.tableId === tableId && e.fieldId === fieldId)));
    setWarnings((prev) => prev.filter((w) => !(w.tableId === tableId && w.fieldId === fieldId)));
  };

  const handleSaveDraft = async () => {
    console.log('💾 Attempting to save draft...', { subjectId, enrollmentDate, formData });
    
    // Validate in draft mode (only base fields + data type validation)
    const validation = validateDraft(subjectId, enrollmentDate, formData, tables);
    setErrors(validation.errors);
    setWarnings(validation.warnings);

    if (!validation.isValid) {
      console.log('❌ Draft validation failed:', validation.errors);
      return;
    }

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

  const handleSubmitComplete = async () => {
    console.log('📋 Attempting to submit complete form...');
    
    // Validate in complete mode (all required fields)
    const validation = validateComplete(subjectId, enrollmentDate, formData, tables);
    setErrors(validation.errors);
    setWarnings(validation.warnings);

    if (!validation.isValid) {
      console.log('❌ Complete validation failed:', validation.errors);
      return;
    }

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
  const activeFields = selectedTableData?.fields.filter((f) => f.category !== 'Structural') || [];

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
          {saveSuccess && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-700">{saveMessage}</span>
            </div>
          )}
        </div>

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
            onClick={handleSaveDraft}
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
            onClick={handleSubmitComplete}
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