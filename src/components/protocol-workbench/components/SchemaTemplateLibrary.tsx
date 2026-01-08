import { useState, useEffect } from 'react';
import { Save, X, Tag, FileText, Users, Stethoscope, Calendar, Plus, Trash2, Download, Upload, Search, Filter, Star, Copy, Beaker, Heart, Activity } from 'lucide-react';
import type { SchemaTemplate, SchemaBlock } from '../types';

interface SchemaTemplateLibraryProps {
  currentSchemaBlocks: SchemaBlock[];
  onLoadTemplate: (template: SchemaTemplate) => void;
  onClose: () => void;
}

const STORAGE_KEY = 'clinical-intelligence-schema-templates';

// Helper to create schema blocks
const createBlock = (
  id: string,
  name: string,
  category: any,
  dataType: any,
  role: any,
  options?: Partial<SchemaBlock>
): SchemaBlock => ({
  id,
  variable: {
    id: `var-${id}`,
    name,
    category,
    icon: Activity,
    defaultType: dataType,
  },
  dataType,
  role,
  ...options
});

// Pre-built system templates with actual schema blocks
const SYSTEM_TEMPLATES: SchemaTemplate[] = [
  {
    id: 'system-phase1-oncology',
    name: 'Phase I Oncology Trial',
    description: 'Standard dose-escalation study with safety endpoints and DLT assessment',
    category: 'Phase I',
    therapeuticArea: 'Oncology',
    isSystem: true,
    createdBy: 'System',
    createdAt: new Date('2024-01-01'),
    modifiedAt: new Date('2024-01-01'),
    usageCount: 0,
    tags: ['oncology', 'dose-escalation', 'safety'],
    schemaBlocks: [
      createBlock('demo-1', 'Patient ID', 'Demographics', 'Text', 'Structure'),
      createBlock('demo-2', 'Age', 'Demographics', 'Continuous', 'Predictor', { unit: 'years', minValue: 18, maxValue: 100 }),
      createBlock('demo-3', 'Sex', 'Demographics', 'Categorical', 'Predictor', { options: ['Male', 'Female'] }),
      createBlock('demo-4', 'ECOG Performance Status', 'Clinical', 'Categorical', 'Predictor', { 
        options: ['0 - Fully active', '1 - Restricted', '2 - Ambulatory', '3 - Limited', '4 - Disabled'] 
      }),
      createBlock('treat-1', 'Dose Level', 'Treatments', 'Categorical', 'Predictor', { 
        options: ['Level 1: 10mg', 'Level 2: 20mg', 'Level 3: 40mg', 'Level 4: 80mg'] 
      }),
      createBlock('treat-2', 'Treatment Start Date', 'Treatments', 'Date', 'Structure'),
      createBlock('safety-1', 'Dose-Limiting Toxicity (DLT)', 'Adverse Events', 'Boolean', 'Outcome', { 
        endpointTier: 'primary' 
      }),
      createBlock('safety-2', 'DLT Description', 'Adverse Events', 'Text', 'Outcome'),
      createBlock('safety-3', 'Adverse Events', 'Adverse Events', 'Categorical', 'Outcome', { 
        options: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'] 
      }),
      createBlock('lab-1', 'ALT (U/L)', 'Laboratory', 'Continuous', 'Outcome', { unit: 'U/L', clinicalRange: { min: 0, max: 100, unit: 'U/L' } }),
      createBlock('lab-2', 'Creatinine (mg/dL)', 'Laboratory', 'Continuous', 'Outcome', { unit: 'mg/dL' }),
    ]
  },
  {
    id: 'system-phase2-cardio',
    name: 'Phase II Cardiovascular Efficacy',
    description: 'Efficacy study with primary endpoint (BP reduction) and safety monitoring',
    category: 'Phase II',
    therapeuticArea: 'Cardiovascular',
    isSystem: true,
    createdBy: 'System',
    createdAt: new Date('2024-01-01'),
    modifiedAt: new Date('2024-01-01'),
    usageCount: 0,
    tags: ['cardiovascular', 'efficacy', 'blood-pressure'],
    schemaBlocks: [
      createBlock('demo-1', 'Patient ID', 'Demographics', 'Text', 'Structure'),
      createBlock('demo-2', 'Age', 'Demographics', 'Continuous', 'Predictor', { unit: 'years', minValue: 40, maxValue: 85 }),
      createBlock('demo-3', 'Sex', 'Demographics', 'Categorical', 'Predictor', { options: ['Male', 'Female'] }),
      createBlock('demo-4', 'Race', 'Demographics', 'Categorical', 'Predictor', { 
        options: ['White', 'Black or African American', 'Asian', 'Hispanic or Latino', 'Other'] 
      }),
      createBlock('treat-1', 'Treatment Arm', 'Treatments', 'Categorical', 'Predictor', { 
        options: ['Placebo', 'Drug 10mg', 'Drug 20mg'] 
      }),
      createBlock('treat-2', 'Randomization Date', 'Treatments', 'Date', 'Structure'),
      createBlock('vitals-1', 'Systolic BP Change from Baseline', 'Vitals', 'Continuous', 'Outcome', { 
        unit: 'mmHg',
        endpointTier: 'primary',
        analysisMethod: 'mean-comparison'
      }),
      createBlock('vitals-2', 'Diastolic BP Change from Baseline', 'Vitals', 'Continuous', 'Outcome', { 
        unit: 'mmHg',
        endpointTier: 'secondary'
      }),
      createBlock('vitals-3', 'Heart Rate', 'Vitals', 'Continuous', 'Outcome', { unit: 'bpm' }),
      createBlock('qol-1', 'Quality of Life Score', 'Quality of Life', 'Continuous', 'Outcome', { 
        minValue: 0, 
        maxValue: 100,
        endpointTier: 'secondary'
      }),
      createBlock('ae-1', 'Treatment-Emergent Adverse Events', 'Adverse Events', 'Boolean', 'Outcome'),
      createBlock('ae-2', 'Serious Adverse Events', 'Adverse Events', 'Boolean', 'Outcome'),
    ]
  },
  {
    id: 'system-phase3-rct',
    name: 'Phase III Randomized Controlled Trial',
    description: 'Large-scale RCT with primary/secondary endpoints and comprehensive safety',
    category: 'Phase III',
    therapeuticArea: 'General',
    isSystem: true,
    createdBy: 'System',
    createdAt: new Date('2024-01-01'),
    modifiedAt: new Date('2024-01-01'),
    usageCount: 0,
    tags: ['rct', 'phase-3', 'efficacy', 'safety'],
    schemaBlocks: [
      createBlock('demo-1', 'Patient ID', 'Demographics', 'Text', 'Structure'),
      createBlock('demo-2', 'Site Number', 'Demographics', 'Text', 'Structure'),
      createBlock('demo-3', 'Age', 'Demographics', 'Continuous', 'Predictor', { unit: 'years' }),
      createBlock('demo-4', 'Sex', 'Demographics', 'Categorical', 'Predictor', { options: ['Male', 'Female'] }),
      createBlock('demo-5', 'Body Mass Index', 'Demographics', 'Continuous', 'Predictor', { unit: 'kg/m²' }),
      createBlock('treat-1', 'Treatment Group', 'Treatments', 'Categorical', 'Predictor', { 
        options: ['Active Treatment', 'Control'] 
      }),
      createBlock('treat-2', 'Stratification Factor', 'Treatments', 'Categorical', 'Structure', { 
        options: ['Low Risk', 'High Risk'] 
      }),
      createBlock('endpoint-1', 'Primary Efficacy Outcome', 'Efficacy', 'Boolean', 'Outcome', { 
        endpointTier: 'primary',
        analysisMethod: 'chi-square'
      }),
      createBlock('endpoint-2', 'Time to Event', 'Efficacy', 'Continuous', 'Outcome', { 
        unit: 'days',
        endpointTier: 'primary',
        analysisMethod: 'survival'
      }),
      createBlock('endpoint-3', 'Secondary Outcome 1', 'Efficacy', 'Continuous', 'Outcome', { 
        endpointTier: 'secondary' 
      }),
      createBlock('endpoint-4', 'Secondary Outcome 2', 'Efficacy', 'Boolean', 'Outcome', { 
        endpointTier: 'secondary' 
      }),
      createBlock('safety-1', 'Any Adverse Event', 'Adverse Events', 'Boolean', 'Outcome'),
      createBlock('safety-2', 'Severe Adverse Event', 'Adverse Events', 'Boolean', 'Outcome'),
      createBlock('qol-1', 'Patient-Reported Outcome', 'Quality of Life', 'Continuous', 'Outcome', { 
        endpointTier: 'exploratory' 
      }),
    ]
  },
  {
    id: 'system-observational',
    name: 'Observational Study',
    description: 'Non-interventional study with patient-reported outcomes',
    category: 'Observational',
    therapeuticArea: 'General',
    isSystem: true,
    createdBy: 'System',
    createdAt: new Date('2024-01-01'),
    modifiedAt: new Date('2024-01-01'),
    usageCount: 0,
    tags: ['observational', 'real-world', 'outcomes'],
    schemaBlocks: [
      createBlock('demo-1', 'Patient ID', 'Demographics', 'Text', 'Structure'),
      createBlock('demo-2', 'Enrollment Date', 'Demographics', 'Date', 'Structure'),
      createBlock('demo-3', 'Age', 'Demographics', 'Continuous', 'Predictor', { unit: 'years' }),
      createBlock('demo-4', 'Sex', 'Demographics', 'Categorical', 'Predictor', { options: ['Male', 'Female'] }),
      createBlock('hist-1', 'Medical History', 'Medical History', 'Multi-Select', 'Predictor', { 
        options: ['Hypertension', 'Diabetes', 'Cardiovascular Disease', 'Cancer', 'Other'] 
      }),
      createBlock('med-1', 'Current Medications', 'Medications', 'Multi-Select', 'Predictor', { 
        options: ['ACE Inhibitors', 'Beta Blockers', 'Statins', 'Anticoagulants', 'Other'] 
      }),
      createBlock('outcome-1', 'Clinical Outcome', 'Clinical', 'Categorical', 'Outcome', { 
        options: ['Improved', 'Stable', 'Worsened'] 
      }),
      createBlock('qol-1', 'Health-Related Quality of Life', 'Quality of Life', 'Continuous', 'Outcome', { 
        minValue: 0,
        maxValue: 100
      }),
      createBlock('followup-1', 'Follow-up Duration', 'Clinical', 'Continuous', 'Structure', { unit: 'months' }),
    ]
  }
];

export function SchemaTemplateLibrary({ currentSchemaBlocks, onLoadTemplate, onClose }: SchemaTemplateLibraryProps) {
  const [userTemplates, setUserTemplates] = useState<SchemaTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<'system' | 'user'>('system');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const [newTemplateCategory, setNewTemplateCategory] = useState<SchemaTemplate['category']>('Custom');
  const [newTemplateTherapeuticArea, setNewTemplateTherapeuticArea] = useState('');

  // Load user templates from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const templates = parsed.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          modifiedAt: new Date(t.modifiedAt)
        }));
        setUserTemplates(templates);
      } catch (error) {
        console.error('Failed to load templates:', error);
      }
    }
  }, []);

  // Save user templates to localStorage
  const saveUserTemplates = (templates: SchemaTemplate[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    setUserTemplates(templates);
  };

  const handleSaveCurrentSchema = () => {
    if (!newTemplateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    const newTemplate: SchemaTemplate = {
      id: `user-${Date.now()}`,
      name: newTemplateName,
      description: newTemplateDescription,
      category: newTemplateCategory,
      therapeuticArea: newTemplateTherapeuticArea || undefined,
      schemaBlocks: currentSchemaBlocks,
      isSystem: false,
      createdBy: 'Current User',
      createdAt: new Date(),
      modifiedAt: new Date(),
      usageCount: 0,
      tags: []
    };

    saveUserTemplates([...userTemplates, newTemplate]);
    setShowSaveDialog(false);
    setNewTemplateName('');
    setNewTemplateDescription('');
    setNewTemplateCategory('Custom');
    setNewTemplateTherapeuticArea('');
    setActiveTab('user');
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      saveUserTemplates(userTemplates.filter(t => t.id !== templateId));
    }
  };

  const handleDuplicateTemplate = (template: SchemaTemplate) => {
    const duplicated: SchemaTemplate = {
      ...template,
      id: `user-${Date.now()}`,
      name: `${template.name} (Copy)`,
      isSystem: false,
      createdBy: 'Current User',
      createdAt: new Date(),
      modifiedAt: new Date(),
      usageCount: 0
    };
    saveUserTemplates([...userTemplates, duplicated]);
    setActiveTab('user');
  };

  const handleLoadTemplate = (template: SchemaTemplate) => {
    // Increment usage count for user templates
    if (!template.isSystem) {
      const updated = userTemplates.map(t =>
        t.id === template.id ? { ...t, usageCount: (t.usageCount || 0) + 1 } : t
      );
      saveUserTemplates(updated);
    }
    onLoadTemplate(template);
    onClose();
  };

  const allTemplates = activeTab === 'system' ? SYSTEM_TEMPLATES : userTemplates;

  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.therapeuticArea?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Phase I':
      case 'Phase II':
      case 'Phase III':
      case 'Phase IV':
        return <FileText className="w-4 h-4" />;
      case 'Observational':
        return <Users className="w-4 h-4" />;
      case 'Registry':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Schema Template Library</h2>
              <p className="text-sm text-slate-600 mt-0.5">
                Load pre-built templates or save your current schema for reuse
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Tab Bar */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setActiveTab('system')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'system'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                System Templates ({SYSTEM_TEMPLATES.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('user')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'user'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                My Templates ({userTemplates.length})
              </div>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Phase I">Phase I</option>
              <option value="Phase II">Phase II</option>
              <option value="Phase III">Phase III</option>
              <option value="Phase IV">Phase IV</option>
              <option value="Observational">Observational</option>
              <option value="Registry">Registry</option>
              <option value="Custom">Custom</option>
            </select>
            <button
              onClick={() => setShowSaveDialog(true)}
              disabled={currentSchemaBlocks.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save Current Schema
            </button>
          </div>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  {searchQuery || categoryFilter !== 'all' ? 'No Templates Found' : 'No Templates Yet'}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {activeTab === 'user' && !searchQuery && categoryFilter === 'all'
                    ? 'Save your current schema as a template to reuse it later'
                    : 'Try adjusting your search or filters'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white border-2 border-slate-200 rounded-lg p-4 hover:border-blue-400 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        template.isSystem ? 'bg-purple-100' : 'bg-blue-100'
                      }`}>
                        {getCategoryIcon(template.category)}
                      </div>
                      <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                        template.isSystem
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {template.category}
                      </div>
                    </div>
                    {!template.isSystem && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDuplicateTemplate(template)}
                          className="p-1 hover:bg-slate-100 rounded transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4 text-slate-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                      {template.description}
                    </p>
                    {template.therapeuticArea && (
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <Stethoscope className="w-3 h-3" />
                        {template.therapeuticArea}
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-3 pb-3 border-b border-slate-200">
                    <span>{template.schemaBlocks.length || 0} variables</span>
                    {template.usageCount !== undefined && template.usageCount > 0 && (
                      <span>Used {template.usageCount}x</span>
                    )}
                    {template.isSystem && (
                      <span className="text-purple-600 font-medium">System</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLoadTemplate(template)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Load Template
                    </button>
                    {template.isSystem && (
                      <button
                        onClick={() => handleDuplicateTemplate(template)}
                        className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                        title="Duplicate to customize"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Save Schema as Template</h3>
              <p className="text-sm text-slate-600 mt-0.5">
                Create a reusable template from your current schema
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g., My Phase II Oncology Template"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newTemplateDescription}
                  onChange={(e) => setNewTemplateDescription(e.target.value)}
                  placeholder="Describe what this template is for..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newTemplateCategory}
                    onChange={(e) => setNewTemplateCategory(e.target.value as SchemaTemplate['category'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Custom">Custom</option>
                    <option value="Phase I">Phase I</option>
                    <option value="Phase II">Phase II</option>
                    <option value="Phase III">Phase III</option>
                    <option value="Phase IV">Phase IV</option>
                    <option value="Observational">Observational</option>
                    <option value="Registry">Registry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Therapeutic Area
                  </label>
                  <input
                    type="text"
                    value={newTemplateTherapeuticArea}
                    onChange={(e) => setNewTemplateTherapeuticArea(e.target.value)}
                    placeholder="e.g., Oncology"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-sm text-blue-900">
                  <strong>Template will include:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>{currentSchemaBlocks.length} schema variables</li>
                    <li>All configurations and dependencies</li>
                    <li>Version tags and analysis methods</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setNewTemplateName('');
                  setNewTemplateDescription('');
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCurrentSchema}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}