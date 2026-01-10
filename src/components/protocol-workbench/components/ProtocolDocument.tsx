import { BookOpen, FileText } from 'lucide-react';
import { useState } from 'react';
import { ContentContainer } from '../../ui/ContentContainer';
import { ProtocolDocumentSidebar } from './ProtocolDocumentSidebar';
import { AISuggestionButton } from './AISuggestionButton';
import type { FoundationalPaperExtraction } from '../../../services/geminiService';

interface ProtocolDocumentProps {
  metadata: {
    protocolTitle: string;
    protocolNumber: string;
    principalInvestigator: string;
    sponsor: string;
    studyPhase: string;
    therapeuticArea: string;
    estimatedEnrollment: string;
    studyDuration: string;
  };
  content: {
    primaryObjective: string;
    secondaryObjectives: string;
    inclusionCriteria: string;
    exclusionCriteria: string;
    statisticalPlan: string;
  };
  onUpdateMetadata: (field: string, value: string) => void;
  onUpdateContent: (field: string, value: string) => void;
  activeField?: string;
  onActiveFieldChange?: (field: string) => void;
  // NEW: AI suggestion context
  pico?: {
    population: string;
    intervention: string;
    comparison: string;
    outcome: string;
  };
  foundationalPapers?: FoundationalPaperExtraction[];
}

export function ProtocolDocument({
  metadata,
  content,
  onUpdateMetadata,
  onUpdateContent,
  activeField: externalActiveField,
  onActiveFieldChange,
  pico = { population: '', intervention: '', comparison: '', outcome: '' },
  foundationalPapers = [],
}: ProtocolDocumentProps) {
  const [internalActiveField, setInternalActiveField] = useState<string>('protocolTitle');
  
  const activeField = externalActiveField || internalActiveField;

  const handleFieldFocus = (fieldName: string) => {
    setInternalActiveField(fieldName);
    onActiveFieldChange?.(fieldName);
  };

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto">
      <ContentContainer className="p-8 space-y-8">
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-900">Protocol Document</h2>
              <p className="text-sm text-slate-600">Enter protocol metadata and content</p>
            </div>
            <button
              onClick={() => {
                setActiveField('primaryObjective');
              }}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Show Help
            </button>
          </div>

          {/* Metadata Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900 mb-3">Protocol Metadata</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Protocol Title *
                </label>
                <input
                  type="text"
                  value={metadata.protocolTitle}
                  onChange={(e) => onUpdateMetadata('protocolTitle', e.target.value)}
                  onFocus={() => handleFieldFocus('protocolTitle')}
                  placeholder="Enter protocol title"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Protocol Number *
                </label>
                <input
                  type="text"
                  value={metadata.protocolNumber}
                  onChange={(e) => onUpdateMetadata('protocolNumber', e.target.value)}
                  onFocus={() => handleFieldFocus('protocolNumber')}
                  placeholder="e.g., PROTO-2024-001"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Principal Investigator
                </label>
                <input
                  type="text"
                  value={metadata.principalInvestigator}
                  onChange={(e) => onUpdateMetadata('principalInvestigator', e.target.value)}
                  onFocus={() => handleFieldFocus('principalInvestigator')}
                  placeholder="Enter PI name"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Sponsor
                </label>
                <input
                  type="text"
                  value={metadata.sponsor}
                  onChange={(e) => onUpdateMetadata('sponsor', e.target.value)}
                  onFocus={() => handleFieldFocus('sponsor')}
                  placeholder="Enter sponsor name"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-slate-700">
                    Study Phase
                  </label>
                  <AISuggestionButton
                    field="studyPhase"
                    pico={pico}
                    foundationalPapers={foundationalPapers}
                    onApply={(value) => onUpdateMetadata('studyPhase', value)}
                  />
                </div>
                <select
                  value={metadata.studyPhase}
                  onChange={(e) => onUpdateMetadata('studyPhase', e.target.value)}
                  onFocus={() => handleFieldFocus('studyPhase')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select phase</option>
                  <option value="Phase I">Phase I</option>
                  <option value="Phase II">Phase II</option>
                  <option value="Phase III">Phase III</option>
                  <option value="Phase IV">Phase IV</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-slate-700">
                    Therapeutic Area
                  </label>
                  <AISuggestionButton
                    field="therapeuticArea"
                    pico={pico}
                    foundationalPapers={foundationalPapers}
                    onApply={(value) => onUpdateMetadata('therapeuticArea', value)}
                  />
                </div>
                <input
                  type="text"
                  value={metadata.therapeuticArea}
                  onChange={(e) => onUpdateMetadata('therapeuticArea', e.target.value)}
                  onFocus={() => handleFieldFocus('therapeuticArea')}
                  placeholder="e.g., Oncology"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-slate-700">
                    Estimated Enrollment
                  </label>
                  <AISuggestionButton
                    field="estimatedEnrollment"
                    pico={pico}
                    foundationalPapers={foundationalPapers}
                    onApply={(value) => onUpdateMetadata('estimatedEnrollment', value)}
                  />
                </div>
                <input
                  type="text"
                  value={metadata.estimatedEnrollment}
                  onChange={(e) => onUpdateMetadata('estimatedEnrollment', e.target.value)}
                  onFocus={() => handleFieldFocus('estimatedEnrollment')}
                  placeholder="e.g., 200 subjects"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-slate-700">
                    Study Duration
                  </label>
                  <AISuggestionButton
                    field="studyDuration"
                    pico={pico}
                    foundationalPapers={foundationalPapers}
                    onApply={(value) => onUpdateMetadata('studyDuration', value)}
                  />
                </div>
                <input
                  type="text"
                  value={metadata.studyDuration}
                  onChange={(e) => onUpdateMetadata('studyDuration', e.target.value)}
                  onFocus={() => handleFieldFocus('studyDuration')}
                  placeholder="e.g., 24 months"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <h3 className="font-medium text-slate-900">Protocol Content</h3>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Primary Objective
              </label>
              <AISuggestionButton
                field="primaryObjective"
                pico={pico}
                foundationalPapers={foundationalPapers}
                onApply={(value) => onUpdateContent('primaryObjective', value)}
              />
            </div>
            <textarea
              value={content.primaryObjective}
              onChange={(e) => onUpdateContent('primaryObjective', e.target.value)}
              placeholder="Describe the primary objective of the study..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              onFocus={() => handleFieldFocus('primaryObjective')}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Secondary Objectives
              </label>
              <AISuggestionButton
                field="secondaryObjectives"
                pico={pico}
                foundationalPapers={foundationalPapers}
                onApply={(value) => onUpdateContent('secondaryObjectives', value)}
              />
            </div>
            <textarea
              value={content.secondaryObjectives}
              onChange={(e) => onUpdateContent('secondaryObjectives', e.target.value)}
              placeholder="Describe secondary objectives..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              onFocus={() => handleFieldFocus('secondaryObjectives')}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Inclusion Criteria
              </label>
              <AISuggestionButton
                field="inclusionCriteria"
                pico={pico}
                foundationalPapers={foundationalPapers}
                onApply={(value) => onUpdateContent('inclusionCriteria', value)}
              />
            </div>
            <textarea
              value={content.inclusionCriteria}
              onChange={(e) => onUpdateContent('inclusionCriteria', e.target.value)}
              placeholder="List inclusion criteria..."
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              onFocus={() => handleFieldFocus('inclusionCriteria')}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Exclusion Criteria
              </label>
              <AISuggestionButton
                field="exclusionCriteria"
                pico={pico}
                foundationalPapers={foundationalPapers}
                onApply={(value) => onUpdateContent('exclusionCriteria', value)}
              />
            </div>
            <textarea
              value={content.exclusionCriteria}
              onChange={(e) => onUpdateContent('exclusionCriteria', e.target.value)}
              placeholder="List exclusion criteria..."
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              onFocus={() => handleFieldFocus('exclusionCriteria')}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Statistical Analysis Plan
              </label>
              <AISuggestionButton
                field="statisticalPlan"
                pico={pico}
                foundationalPapers={foundationalPapers}
                onApply={(value) => onUpdateContent('statisticalPlan', value)}
              />
            </div>
            <textarea
              value={content.statisticalPlan}
              onChange={(e) => onUpdateContent('statisticalPlan', e.target.value)}
              placeholder="Describe the statistical analysis plan..."
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              onFocus={() => handleFieldFocus('statisticalPlan')}
            />
          </div>
        </div>
      </ContentContainer>
    </div>
  );
}