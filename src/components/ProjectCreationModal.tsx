import { useState } from 'react';
import { X, FolderPlus, ChevronRight } from 'lucide-react';
import { useProject } from '../contexts/ProtocolContext';
import type { Project } from '../types/shared';
import type { StudyDesignType, StudyDesignConfiguration } from '../types/studyDesigns';
import { StudyDesignSelector } from './project/StudyDesignSelector';
import { RCTConfiguration } from './project/study-designs/RCTConfiguration';
import { CaseSeriesConfiguration } from './project/study-designs/CaseSeriesConfiguration';
import { CohortConfiguration } from './project/study-designs/CohortConfiguration';
import { LaboratoryConfiguration } from './project/study-designs/LaboratoryConfiguration';
import { TechnicalNoteConfiguration } from './project/study-designs/TechnicalNoteConfiguration';
import { StatisticianPreview } from './project/study-designs/StatisticianPreview';
import { PersonaAssignmentDisplay } from './PersonaAssignmentDisplay';
import {
  generateStudyDNA,
  DEFAULT_RCT_CONFIG,
  DEFAULT_CASE_SERIES_CONFIG,
  DEFAULT_COHORT_CONFIG,
  DEFAULT_LABORATORY_CONFIG,
  DEFAULT_TECHNICAL_NOTE_CONFIG,
} from '../utils/studyDesignDefaults';
import {
  createPersonaFromStudyDNA,
  createProtocolFromStudyDNA,
} from '../utils/studyDNAAutoGeneration';
import { storage } from '../utils/storageService';

interface ProjectCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectCreationModal({
  isOpen,
  onClose,
}: ProjectCreationModalProps) {
  const { createProject } = useProject();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    studyNumber: '',
    description: '',
    phase: '',
    status: 'active' as Project['status'],
  });

  // Study design state
  const [studyDesignType, setStudyDesignType] = useState<StudyDesignType | null>(
    null
  );
  const [rctConfig, setRctConfig] = useState(DEFAULT_RCT_CONFIG);
  const [caseSeriesConfig, setCaseSeriesConfig] = useState(
    DEFAULT_CASE_SERIES_CONFIG
  );
  const [cohortConfig, setCohortConfig] = useState(DEFAULT_COHORT_CONFIG);
  const [laboratoryConfig, setLaboratoryConfig] = useState(
    DEFAULT_LABORATORY_CONFIG
  );
  const [technicalNoteConfig, setTechnicalNoteConfig] = useState(
    DEFAULT_TECHNICAL_NOTE_CONFIG
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute studyDNA based on selected type
  const studyDNA = studyDesignType ? generateStudyDNA(studyDesignType) : null;

  const handleSubmit = async () => {
    // Prevent double submission
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      // Validate form
      const newErrors: Record<string, string> = {};

      if (!formData.name.trim()) {
        newErrors.name = 'Project name is required';
      }

      if (!formData.studyNumber.trim()) {
        newErrors.studyNumber = 'Study number is required';
      }

      if (!studyDesignType) {
        newErrors.studyDesign = 'Study design is required';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Build study design configuration
      const studyDesignConfig: StudyDesignConfiguration = {
        type: studyDesignType!,
        rct: studyDesignType === 'rct' ? rctConfig : undefined,
        caseSeries: studyDesignType === 'case-series' ? caseSeriesConfig : undefined,
        cohort: studyDesignType === 'cohort' ? cohortConfig : undefined,
        laboratory: studyDesignType === 'laboratory' ? laboratoryConfig : undefined,
        technicalNote:
          studyDesignType === 'technical-note' ? technicalNoteConfig : undefined,
      };

      // Create project with study DNA
      const newProject = createProject({
        name: formData.name.trim(),
        studyNumber: formData.studyNumber.trim(),
        description: formData.description.trim(),
        phase: formData.phase.trim() || undefined,
        status: formData.status,
        studyDesign: studyDesignConfig,
      });

      // ✅ PHASE 3: Auto-create statistician persona based on Study DNA
      if (studyDesignType) {
        const persona = createPersonaFromStudyDNA(
          studyDesignType,
          newProject.id,
          newProject.name
        );
        
        // Get existing personas and add new one
        const existingPersonas = storage.personas.getAll(newProject.id);
        storage.personas.save([...existingPersonas, persona], newProject.id);
      }

      // ✅ PHASE 3: Auto-generate protocol template based on Study DNA
      if (studyDesignType) {
        const protocol = createProtocolFromStudyDNA(
          studyDesignType,
          newProject.id,
          {
            name: formData.name.trim(),
            studyNumber: formData.studyNumber.trim(),
            description: formData.description.trim(),
            phase: formData.phase.trim() || undefined,
          },
          studyDesignConfig
        );
        
        // Get existing protocols and add new one
        const existingProtocols = storage.protocols.getAll(newProject.id);
        storage.protocols.save([...existingProtocols, protocol], newProject.id);
      }

      // Success - reset and close
      handleClose();
    } catch (error) {
      console.error('Failed to create project:', error);
      setErrors({ 
        submit: 'Failed to create project. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      studyNumber: '',
      description: '',
      phase: '',
      status: 'active',
    });
    setStudyDesignType(null);
    setRctConfig(DEFAULT_RCT_CONFIG);
    setCaseSeriesConfig(DEFAULT_CASE_SERIES_CONFIG);
    setCohortConfig(DEFAULT_COHORT_CONFIG);
    setLaboratoryConfig(DEFAULT_LABORATORY_CONFIG);
    setTechnicalNoteConfig(DEFAULT_TECHNICAL_NOTE_CONFIG);
    setErrors({});
    onClose();
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FolderPlus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Create New Project
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  Set up a new clinical research study with Study DNA
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Content - Two Column Layout */}
          <div className="flex-1 overflow-y-auto"> {/* Single scrollable container */}
            <div className="grid grid-cols-2 gap-6 p-6"> {/* Changed to gap instead of divider */}
              {/* Left Column: Project Details & Study Design */}
              <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4"> {/* Reduced from space-y-5 to space-y-4 */}
                  {/* Project Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Project Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., Phase II Clinical Study"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? 'border-red-300' : 'border-slate-200'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Study Number */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Study Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.studyNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, studyNumber: e.target.value })
                      }
                      placeholder="e.g., STUDY-2026-001"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.studyNumber ? 'border-red-300' : 'border-slate-200'
                      }`}
                    />
                    {errors.studyNumber && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.studyNumber}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Brief description of the study objectives and scope"
                      rows={2}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {/* Phase */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Study Phase
                    </label>
                    <select
                      value={formData.phase}
                      onChange={(e) =>
                        setFormData({ ...formData, phase: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select phase (optional)</option>
                      <option value="Preclinical">Preclinical</option>
                      <option value="Phase I">Phase I</option>
                      <option value="Phase II">Phase II</option>
                      <option value="Phase III">Phase III</option>
                      <option value="Phase IV">Phase IV</option>
                      <option value="Observational">Observational</option>
                    </select>
                  </div>
                </form>

                {/* Divider */}
                <div className="border-t border-slate-200 pt-5"> {/* Reduced from pt-6 */}
                  <div className="flex items-center gap-2 mb-3"> {/* Reduced from mb-4 */}
                    <ChevronRight className="w-4 h-4 text-blue-600" />
                    <h3 className="font-semibold text-slate-900">Study DNA</h3>
                  </div>

                  {/* Study Design Selector */}
                  <StudyDesignSelector
                    value={studyDesignType}
                    onChange={setStudyDesignType}
                  />
                  {errors.studyDesign && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.studyDesign}
                    </p>
                  )}

                  {/* Design-Specific Configuration */}
                  {studyDesignType === 'rct' && (
                    <div className="mt-6">
                      <RCTConfiguration
                        config={rctConfig}
                        onChange={setRctConfig}
                      />
                    </div>
                  )}

                  {studyDesignType === 'case-series' && (
                    <div className="mt-6">
                      <CaseSeriesConfiguration
                        config={caseSeriesConfig}
                        onChange={setCaseSeriesConfig}
                      />
                    </div>
                  )}

                  {studyDesignType === 'cohort' && (
                    <div className="mt-6">
                      <CohortConfiguration
                        config={cohortConfig}
                        onChange={setCohortConfig}
                      />
                    </div>
                  )}

                  {studyDesignType === 'laboratory' && (
                    <div className="mt-6">
                      <LaboratoryConfiguration
                        config={laboratoryConfig}
                        onChange={setLaboratoryConfig}
                      />
                    </div>
                  )}

                  {studyDesignType === 'technical-note' && (
                    <div className="mt-6">
                      <TechnicalNoteConfiguration
                        config={technicalNoteConfig}
                        onChange={setTechnicalNoteConfig}
                      />
                    </div>
                  )}

                  {/* Other study types show info message */}
                  {studyDesignType &&
                    studyDesignType !== 'rct' &&
                    studyDesignType !== 'case-series' &&
                    studyDesignType !== 'cohort' &&
                    studyDesignType !== 'laboratory' &&
                    studyDesignType !== 'technical-note' && (
                      <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <p className="text-sm text-slate-700">
                          <strong>
                            {studyDNA?.metadata.label} configuration
                          </strong>{' '}
                          will use default settings optimized for this study type.
                          You can customize details after project creation.
                        </p>
                      </div>
                    )}
                </div>
              </div>

              {/* Right Column: Statistician Preview */}
              <div className="p-6 bg-slate-50 overflow-y-auto"> {/* Added overflow-y-auto */}
                {studyDNA ? (
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h3 className="font-semibold text-slate-900 mb-1">
                        Your Study Team
                      </h3>
                      <p className="text-sm text-slate-600">
                        Based on your {studyDNA.metadata.label}, we'll
                        automatically configure the ideal statistical approach
                      </p>
                    </div>

                    <StatisticianPreview
                      template={studyDNA.statisticianTemplate}
                    />

                    {/* AI Persona Assignments */}
                    <div className="mt-6 p-4 bg-white border border-slate-200 rounded-lg">
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">
                        AI Persona Team
                      </h4>
                      <PersonaAssignmentDisplay studyType={studyDesignType} compact />
                    </div>

                    {/* Study Metadata */}
                    <div className="mt-6 p-4 bg-white border border-slate-200 rounded-lg space-y-3">
                      <h4 className="text-sm font-semibold text-slate-900">
                        Study Characteristics
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Sample Size:</span>
                          <span className="font-medium text-slate-900">
                            {studyDNA.metadata.typicalSampleSize}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Duration:</span>
                          <span className="font-medium text-slate-900">
                            {studyDNA.metadata.typicalDuration}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Protocol Template Preview */}
                    <div className="p-4 bg-white border border-slate-200 rounded-lg">
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">
                        Protocol Template Includes
                      </h4>
                      <ul className="space-y-1.5 text-sm text-slate-700">
                        {studyDNA.protocolTemplate.suggestedSections
                          .slice(0, 5)
                          .map((section, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                              {section}
                            </li>
                          ))}
                        {studyDNA.protocolTemplate.suggestedSections.length >
                          5 && (
                          <li className="text-xs text-slate-500 ml-3.5">
                            +
                            {studyDNA.protocolTemplate.suggestedSections.length -
                              5}{' '}
                            more sections
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center max-w-xs">
                      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ChevronRight className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">
                        Select Study Design
                      </h3>
                      <p className="text-sm text-slate-600">
                        Choose your study design to see the automatically configured
                        statistician persona and protocol template
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-white">
            <div className="flex-1 mr-6">
              <p className="text-sm text-slate-600">
                <strong>Study DNA</strong> automatically configures your project based
                on research methodology
              </p>
              {errors.submit && (
                <p className="text-sm text-red-600 mt-1">{errors.submit}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Project'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}