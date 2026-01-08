import { useState } from 'react';
import { AlertCircle, CheckCircle2, Lock, Sparkles, AlertTriangle, Calendar as CalendarIcon } from 'lucide-react';
import { DatabaseField } from './database/utils/schemaGenerator';

interface DataEntryFieldProps {
  field: DatabaseField;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  error?: string;
}

export function DataEntryField({ field, value, onChange, error }: DataEntryFieldProps) {
  const isDeprecated = field.status === 'deprecated';
  const isModified = field.status === 'modified';
  const isNew = field.status === 'new';

  // Get field container styling based on status
  const getContainerClass = () => {
    if (isDeprecated) return 'bg-slate-50 border-slate-200 opacity-60';
    if (isModified) return 'bg-amber-50 border-l-4 border-l-amber-500 border-slate-200';
    if (isNew) return 'bg-green-50 border-l-4 border-l-green-500 border-slate-200';
    return 'bg-white border-slate-200';
  };

  const renderInput = () => {
    // Deprecated fields are read-only
    if (isDeprecated) {
      return (
        <div className="flex items-center gap-2 text-slate-500">
          <Lock className="w-4 h-4" />
          <span className="text-sm line-through">Field deprecated - no data collection</span>
        </div>
      );
    }

    switch (field.dataType) {
      case 'Continuous':
        return (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={value || ''}
              onChange={(e) => onChange(field.id, e.target.value)}
              min={field.minValue}
              max={field.maxValue}
              step="any"
              disabled={isDeprecated}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
              placeholder={`Enter ${field.displayName.toLowerCase()}`}
            />
            {field.unit && (
              <span className="text-sm text-slate-600 min-w-[60px]">{field.unit}</span>
            )}
          </div>
        );

      case 'Categorical':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            disabled={isDeprecated}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            <option value="">Select {field.displayName.toLowerCase()}...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'Multi-Select':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v) => v !== option);
                    onChange(field.id, newValues);
                  }}
                  disabled={isDeprecated}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <span className="text-sm text-slate-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'Boolean':
        return (
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={value === true}
                onChange={() => onChange(field.id, true)}
                disabled={isDeprecated}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <span className="text-sm text-slate-700">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={value === false}
                onChange={() => onChange(field.id, false)}
                disabled={isDeprecated}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <span className="text-sm text-slate-700">No</span>
            </label>
          </div>
        );

      case 'Date':
        return (
          <div className="relative">
            <input
              type="date"
              value={value || ''}
              onChange={(e) => onChange(field.id, e.target.value)}
              disabled={isDeprecated}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
            <CalendarIcon className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        );

      case 'Text':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            disabled={isDeprecated}
            rows={3}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-slate-100 disabled:cursor-not-allowed"
            placeholder={`Enter ${field.displayName.toLowerCase()}`}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            disabled={isDeprecated}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
            placeholder={`Enter ${field.displayName.toLowerCase()}`}
          />
        );
    }
  };

  const getStatusBadge = () => {
    if (isNew) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
          <Sparkles className="w-3 h-3" />
          NEW
        </span>
      );
    }
    if (isModified) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">
          <AlertTriangle className="w-3 h-3" />
          MODIFIED
        </span>
      );
    }
    if (isDeprecated) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
          <Lock className="w-3 h-3" />
          DEPRECATED
        </span>
      );
    }
    return null;
  };

  return (
    <div className={`p-4 border rounded-lg ${getContainerClass()}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <label className={`text-sm font-medium ${isDeprecated ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
              {field.displayName}
              {field.isRequired && !isDeprecated && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            {getStatusBadge()}
          </div>
          {field.changeDescription && (
            <div className="text-xs text-amber-700 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {field.changeDescription}
            </div>
          )}
          {field.endpointTier && (
            <div className="mt-1">
              <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                field.endpointTier === 'primary' ? 'bg-purple-100 text-purple-700' :
                field.endpointTier === 'secondary' ? 'bg-blue-100 text-blue-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {field.endpointTier.toUpperCase()} ENDPOINT
              </span>
            </div>
          )}
        </div>
      </div>

      {renderInput()}

      {/* Validation hints */}
      {!isDeprecated && (
        <div className="mt-2 text-xs text-slate-500">
          {field.minValue !== undefined && field.maxValue !== undefined && (
            <div>Valid range: {field.minValue} - {field.maxValue} {field.unit || ''}</div>
          )}
          {field.options && field.dataType === 'Categorical' && (
            <div>{field.options.length} options available</div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );
}