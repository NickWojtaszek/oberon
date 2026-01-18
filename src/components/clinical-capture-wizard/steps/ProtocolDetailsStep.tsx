/**
 * Protocol Details Step
 * Captures formal protocol information required before publishing
 * PI fills in official protocol details: title, number, investigator info, etc.
 */

import { useState, useEffect } from 'react';
import {
  FileText,
  User,
  Building,
  Calendar,
  Hash,
  Shield,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface ProtocolDetailsStepProps {
  onComplete: (data: ProtocolDetailsData) => void;
  initialData?: Partial<ProtocolDetailsData>;
  picoSummary?: {
    population: string;
    intervention: string;
    outcome: string;
  };
}

export interface ProtocolDetailsData {
  protocolTitle: string;
  protocolNumber: string;
  principalInvestigator: string;
  institution: string;
  sponsor?: string;
  irbNumber?: string;
  irbApprovalDate?: string;
  studyStartDate?: string;
  estimatedEndDate?: string;
  versionNotes?: string;
}

export function ProtocolDetailsStep({ onComplete, initialData, picoSummary }: ProtocolDetailsStepProps) {
  const [formData, setFormData] = useState<ProtocolDetailsData>({
    protocolTitle: initialData?.protocolTitle || '',
    protocolNumber: initialData?.protocolNumber || '',
    principalInvestigator: initialData?.principalInvestigator || '',
    institution: initialData?.institution || '',
    sponsor: initialData?.sponsor || '',
    irbNumber: initialData?.irbNumber || '',
    irbApprovalDate: initialData?.irbApprovalDate || '',
    studyStartDate: initialData?.studyStartDate || '',
    estimatedEndDate: initialData?.estimatedEndDate || '',
    versionNotes: initialData?.versionNotes || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProtocolDetailsData, string>>>({});

  // Generate suggested protocol number if empty
  useEffect(() => {
    if (!formData.protocolNumber && !initialData?.protocolNumber) {
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      setFormData(prev => ({
        ...prev,
        protocolNumber: `PROTO-${year}-${random}`,
      }));
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProtocolDetailsData, string>> = {};

    if (!formData.protocolTitle.trim()) {
      newErrors.protocolTitle = 'Protocol title is required';
    }
    if (!formData.protocolNumber.trim()) {
      newErrors.protocolNumber = 'Protocol number is required';
    }
    if (!formData.principalInvestigator.trim()) {
      newErrors.principalInvestigator = 'Principal Investigator is required';
    }
    if (!formData.institution.trim()) {
      newErrors.institution = 'Institution is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onComplete(formData);
    }
  };

  const updateField = (field: keyof ProtocolDetailsData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const requiredFieldsComplete =
    formData.protocolTitle.trim() &&
    formData.protocolNumber.trim() &&
    formData.principalInvestigator.trim() &&
    formData.institution.trim();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-900">Protocol Details</h2>
            <p className="text-sm text-blue-700 mt-1">
              Enter the formal protocol information required for publication
            </p>
          </div>
        </div>
      </div>

      {/* PICO Summary Reference */}
      {picoSummary && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
          <h4 className="text-sm font-medium text-slate-700 mb-2">Study Summary (from PICO)</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Population:</span>
              <p className="text-slate-900 truncate">{picoSummary.population || 'Not specified'}</p>
            </div>
            <div>
              <span className="text-slate-500">Intervention:</span>
              <p className="text-slate-900 truncate">{picoSummary.intervention || 'Not specified'}</p>
            </div>
            <div>
              <span className="text-slate-500">Outcome:</span>
              <p className="text-slate-900 truncate">{picoSummary.outcome || 'Not specified'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Required Fields */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <span className="text-red-500">*</span> Required Information
        </h3>

        <div className="space-y-4">
          {/* Protocol Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
              <FileText className="w-4 h-4" />
              Protocol Title
            </label>
            <input
              type="text"
              value={formData.protocolTitle}
              onChange={(e) => updateField('protocolTitle', e.target.value)}
              placeholder="e.g., A Phase 3 Randomized Controlled Trial of..."
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.protocolTitle ? 'border-red-300 bg-red-50' : 'border-slate-200'
              }`}
            />
            {errors.protocolTitle && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.protocolTitle}
              </p>
            )}
          </div>

          {/* Protocol Number */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
              <Hash className="w-4 h-4" />
              Protocol Number
            </label>
            <input
              type="text"
              value={formData.protocolNumber}
              onChange={(e) => updateField('protocolNumber', e.target.value)}
              placeholder="e.g., PROTO-2024-0001"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.protocolNumber ? 'border-red-300 bg-red-50' : 'border-slate-200'
              }`}
            />
            {errors.protocolNumber && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.protocolNumber}
              </p>
            )}
          </div>

          {/* Principal Investigator */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
              <User className="w-4 h-4" />
              Principal Investigator
            </label>
            <input
              type="text"
              value={formData.principalInvestigator}
              onChange={(e) => updateField('principalInvestigator', e.target.value)}
              placeholder="e.g., Dr. Jane Smith, MD, PhD"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.principalInvestigator ? 'border-red-300 bg-red-50' : 'border-slate-200'
              }`}
            />
            {errors.principalInvestigator && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.principalInvestigator}
              </p>
            )}
          </div>

          {/* Institution */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
              <Building className="w-4 h-4" />
              Institution
            </label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => updateField('institution', e.target.value)}
              placeholder="e.g., University Medical Center"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.institution ? 'border-red-300 bg-red-50' : 'border-slate-200'
              }`}
            />
            {errors.institution && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.institution}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Optional Fields */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Additional Information (Optional)</h3>

        <div className="space-y-4">
          {/* Sponsor */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
              <Building className="w-4 h-4" />
              Sponsor
            </label>
            <input
              type="text"
              value={formData.sponsor}
              onChange={(e) => updateField('sponsor', e.target.value)}
              placeholder="e.g., Pharmaceutical Company Inc."
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* IRB Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
                <Shield className="w-4 h-4" />
                IRB/Ethics Number
              </label>
              <input
                type="text"
                value={formData.irbNumber}
                onChange={(e) => updateField('irbNumber', e.target.value)}
                placeholder="e.g., IRB-2024-0123"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
                <Calendar className="w-4 h-4" />
                IRB Approval Date
              </label>
              <input
                type="date"
                value={formData.irbApprovalDate}
                onChange={(e) => updateField('irbApprovalDate', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Study Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
                <Calendar className="w-4 h-4" />
                Study Start Date
              </label>
              <input
                type="date"
                value={formData.studyStartDate}
                onChange={(e) => updateField('studyStartDate', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
                <Calendar className="w-4 h-4" />
                Estimated End Date
              </label>
              <input
                type="date"
                value={formData.estimatedEndDate}
                onChange={(e) => updateField('estimatedEndDate', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Version Notes */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
              <FileText className="w-4 h-4" />
              Version Notes
            </label>
            <textarea
              value={formData.versionNotes}
              onChange={(e) => updateField('versionNotes', e.target.value)}
              placeholder="e.g., Initial protocol version for Phase 3 study"
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          {requiredFieldsComplete ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-700">All required fields complete</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Please complete all required fields</span>
            </>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!requiredFieldsComplete}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
}
