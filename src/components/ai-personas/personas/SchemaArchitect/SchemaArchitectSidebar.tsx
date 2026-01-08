import React, { useState, useEffect } from 'react';
import { PersonaSidebar } from '../../ui/PersonaSidebar';
import { Persona } from '../../core/personaTypes';
import { useTranslation } from 'react-i18next';
import { SIDEBAR_WIDTH } from '../../../../lib/uiConstants';
import { usePersona } from '../../core/personaContext';
import type { SchemaBlock, ValidationContext } from '../../../protocol-workbench/types';

interface SchemaArchitectSidebarProps {
  schemaBlocks: SchemaBlock[];
  studyType?: string;
  onAddSuggestedVariable?: (variableTemplate: {
    name: string;
    type: string;
    description: string;
  }) => void;
}

export function SchemaArchitectSidebar({
  schemaBlocks,
  studyType,
  onAddSuggestedVariable
}: SchemaArchitectSidebarProps) {
  const { persona, validate, isActive } = usePersona('schema-architect');
  const [validating, setValidating] = useState(false);

  // Run validation when schema changes
  useEffect(() => {
    if (!isActive || !persona) return;

    const runValidation = async () => {
      setValidating(true);

      const context: ValidationContext = {
        schemaBlocks,
        studyDesign: {
          type: studyType as any || 'rct',
          isBlinded: false, // TODO: Get from protocol metadata
          isRandomized: studyType === 'rct'
        }
      };

      await validate(context);
      setValidating(false);
    };

    // Debounce validation
    const timeoutId = setTimeout(runValidation, 500);

    return () => clearTimeout(timeoutId);
  }, [schemaBlocks, studyType, isActive, persona, validate]);

  if (!isActive || !persona) {
    return null;
  }

  // Get study-type-specific recommendations
  const getStudyTypeRecommendations = (): string[] => {
    switch (studyType) {
      case 'rct':
        return [
          'Randomization Assignment (categorical)',
          'Treatment Arm (categorical)',
          'Blinding Status (Yes/No)',
          'Protocol Deviation (Yes/No)',
          'Withdrawal Reason (text)'
        ];
      
      case 'observational':
        return [
          'Primary Exposure (categorical/continuous)',
          'Age (numeric)',
          'Sex/Gender (categorical)',
          'Race/Ethnicity (categorical)',
          'Baseline Comorbidities (categorical)'
        ];
      
      case 'diagnostic':
        return [
          'Index Test Result (categorical/numeric)',
          'Reference Standard Result (categorical)',
          'Reader ID (for blinding)',
          'Image Quality (categorical)',
          'Inconclusive Results Flag (Yes/No)'
        ];
      
      case 'registry':
        return [
          'Enrollment Date (date)',
          'Visit Number (numeric)',
          'Follow-up Date (date)',
          'Vital Status (Alive/Deceased/Unknown)',
          'Lost to Follow-up (Yes/No)'
        ];
      
      default:
        return [
          'Subject ID (text)',
          'Visit Date (date)',
          'Primary Endpoint (varies)',
          'Safety Events (categorical)',
          'Study Completion Status (categorical)'
        ];
    }
  };

  const getMissingCriticalVariables = (): ValidationIssue[] => {
    if (!persona.lastValidation) return [];
    
    return persona.lastValidation.issues.filter(
      issue => issue.severity === 'critical' || issue.severity === 'warning'
    );
  };

  const studyTypeLabel = {
    'rct': 'RCT',
    'observational': 'Observational',
    'diagnostic': 'Diagnostic',
    'registry': 'Registry'
  }[studyType || 'rct'] || studyType?.toUpperCase();

  return (
    <div className={`${SIDEBAR_WIDTH} border-l border-slate-200 bg-white overflow-y-auto flex-shrink-0`}>
      <div className="p-4">
        <PersonaSidebar
          persona={persona}
          validationResult={persona.lastValidation}
          onViewFullReport={() => {
            // Could navigate to full audit tab
          }}
        >
          {/* Study Type Badge */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="text-xs font-medium text-blue-900 mb-1">
              Study Type
            </div>
            <div className="text-sm font-bold text-blue-700">
              {studyTypeLabel}
            </div>
          </div>

          {/* Recommended Variables for Study Type */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
            <div className="text-sm font-semibold text-emerald-900 mb-2">
              📋 Recommended Variables
            </div>
            <div className="space-y-1.5">
              {getStudyTypeRecommendations().map((variable, idx) => (
                <div
                  key={idx}
                  className="text-xs text-emerald-800 leading-relaxed flex items-start gap-1.5"
                >
                  <span className="text-emerald-600 mt-0.5">•</span>
                  <span className="flex-1">{variable}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Critical Variables */}
          {getMissingCriticalVariables().length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-1.5">
                ⚠️ Missing Critical Variables
              </div>
              <div className="space-y-2">
                {getMissingCriticalVariables().map((issue, idx) => (
                  <div
                    key={idx}
                    className="bg-white bg-opacity-60 rounded p-2 border border-amber-300"
                  >
                    <div className="text-xs font-semibold text-amber-900 mb-1">
                      {issue.title}
                    </div>
                    <div className="text-xs text-amber-800 leading-relaxed mb-1.5">
                      {issue.description}
                    </div>
                    <div className="text-xs text-amber-700 leading-relaxed bg-amber-100 bg-opacity-50 p-1.5 rounded">
                      <strong>Fix:</strong> {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schema Statistics */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs font-medium text-slate-900 mb-2">
              📊 Schema Statistics
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Total Variables:</span>
                <span className="font-semibold text-slate-900">
                  {schemaBlocks.length}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Validation Status:</span>
                <span className={`font-semibold ${
                  validating ? 'text-blue-600' :
                  persona.lastValidation?.canProceed ? 'text-green-600' :
                  'text-amber-600'
                }`}>
                  {validating ? 'Validating...' :
                   persona.lastValidation?.canProceed ? 'Good' : 'Issues Found'}
                </span>
              </div>
            </div>
          </div>
        </PersonaSidebar>
      </div>
    </div>
  );
}