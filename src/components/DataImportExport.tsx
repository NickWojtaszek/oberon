// Data Import/Export Management Component
// Professional dual-panel workspace inspired by Academic Writing

import { useState, useEffect } from 'react';
import { Download, Upload, Database, AlertTriangle, CheckCircle2, FileText, Info, Clock, Package } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { validateImportFile, formatValidationErrors, type ImportValidationResult } from '../utils/validation/importValidator';
import { ValidationErrorDisplay } from './ValidationErrorDisplay';
import { copyToClipboard } from '../utils/clipboard';
import { dataExporter } from '../utils/comprehensiveDataExport';
import { SIDEBAR_WIDTH } from '../lib/uiConstants';

type ImportOptions = {
  mergeMode: 'replace' | 'update' | 'skip';
  validateData: boolean;
  backupFirst: boolean;
};

type MainTab = 'export' | 'import' | 'template';
type SidebarView = 'preview' | 'validation' | 'activity' | 'stats';

export function DataImportExport() {
  const { currentProject } = useProject();
  
  // Main panel state
  const [activeTab, setActiveTab] = useState<MainTab>('export');
  const [exportDescription, setExportDescription] = useState('');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'update' | 'skip'>('update');
  const [importResult, setImportResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState<string>('');
  
  // Validation state
  const [validationResult, setValidationResult] = useState<ImportValidationResult | null>(null);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  
  // Sidebar state
  const [activeSidebarView, setActiveSidebarView] = useState<SidebarView>('preview');
  
  // Granular export selections
  const [exportSelections, setExportSelections] = useState({
    projects: true,
    protocols: true,
    clinicalData: true,
    manuscripts: true,
    statisticalManifests: true,
    personas: true,
    templates: true,
  });
  
  // Template component selections
  const [templateSelections, setTemplateSelections] = useState({
    project: true,
    protocol: true,
    clinicalData: true,
    manuscript: true,
    statisticalManifest: true,
    persona: true,
    template: true,
  });

  // Get data statistics for preview
  const getDataStats = () => {
    const projects = JSON.parse(localStorage.getItem('research_projects') || '[]');
    const protocols = JSON.parse(localStorage.getItem('protocols') || '[]');
    
    let totalClinicalRecords = 0;
    projects.forEach((p: any) => {
      const records = JSON.parse(localStorage.getItem(`clinical_data_${p.id}`) || '[]');
      totalClinicalRecords += records.length;
    });

    return {
      projects: projects.length,
      protocols: protocols.length,
      clinicalRecords: totalClinicalRecords,
      manuscripts: 0, // Would need to count from storage
    };
  };

  const stats = getDataStats();

  // Auto-switch sidebar view based on active tab
  useEffect(() => {
    if (activeTab === 'export') {
      setActiveSidebarView('preview');
    } else if (activeTab === 'import') {
      setActiveSidebarView('validation');
    } else {
      setActiveSidebarView('stats');
    }
  }, [activeTab]);

  const handleExportAll = () => {
    setIsProcessing(true);
    try {
      const fullExport = dataExporter.exportAll(exportDescription || undefined);
      
      const filteredExport = {
        ...fullExport,
        projects: fullExport.projects.map(projectExport => ({
          project: exportSelections.projects ? projectExport.project : { ...projectExport.project, id: projectExport.project.id, name: projectExport.project.name },
          protocols: exportSelections.protocols ? projectExport.protocols : [],
          clinicalData: exportSelections.clinicalData ? projectExport.clinicalData : [],
          manuscripts: exportSelections.manuscripts ? projectExport.manuscripts : [],
          statisticalManifests: exportSelections.statisticalManifests ? projectExport.statisticalManifests : [],
          personas: exportSelections.personas ? projectExport.personas : [],
          templates: exportSelections.templates ? projectExport.templates : [],
        })),
        globalTemplates: exportSelections.templates ? fullExport.globalTemplates : [],
        globalPersonas: exportSelections.personas ? fullExport.globalPersonas : [],
      };
      
      const jsonString = dataExporter.exportToJSON(filteredExport);
      
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clinical-engine-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      alert(`Export failed: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateTemplate = () => {
    setIsProcessing(true);
    try {
      const fullTemplate = dataExporter.generateMockDataTemplate();
      
      const filteredTemplate: any = {
        templateMetadata: fullTemplate.templateMetadata,
      };
      
      if (templateSelections.project) filteredTemplate.projectTemplate = fullTemplate.projectTemplate;
      if (templateSelections.protocol) filteredTemplate.protocolTemplate = fullTemplate.protocolTemplate;
      if (templateSelections.clinicalData) filteredTemplate.clinicalDataTemplate = fullTemplate.clinicalDataTemplate;
      if (templateSelections.manuscript) filteredTemplate.manuscriptTemplate = fullTemplate.manuscriptTemplate;
      if (templateSelections.statisticalManifest) filteredTemplate.statisticalManifestTemplate = fullTemplate.statisticalManifestTemplate;
      if (templateSelections.persona) filteredTemplate.personaTemplate = fullTemplate.personaTemplate;
      if (templateSelections.template) filteredTemplate.schemaTemplateTemplate = fullTemplate.schemaTemplateTemplate;
      
      const jsonString = JSON.stringify(filteredTemplate, null, 2);
      setGeneratedTemplate(jsonString);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      alert(`Template generation failed: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([generatedTemplate], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinical-engine-template-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyTemplate = async () => {
    const success = await copyToClipboard(generatedTemplate);
    if (success) {
      alert('✅ Template copied to clipboard');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      setValidationResult(null);
      setShowValidationErrors(false);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      alert('Please select a file to import');
      return;
    }
    
    setIsProcessing(true);
    setImportResult(null);
    setValidationResult(null);
    
    try {
      const fileContent = await importFile.text();
      
      console.log('🔍 Validating import file...');
      const validation = validateImportFile(fileContent);
      setValidationResult(validation);
      
      if (!validation.canProceed) {
        console.error('❌ Validation failed:', validation.errors);
        setShowValidationErrors(true);
        setIsProcessing(false);
        return;
      }
      
      console.log('✅ Validation passed:', validation.summary);
      
      const options: ImportOptions = {
        mergeMode: importMode,
        validateData: true,
        backupFirst: false,
      };
      
      const result = dataExporter.importFromJSON(fileContent, options);
      setImportResult(result);
      
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('Import error:', error);
      setImportResult({
        success: false,
        projectsImported: 0,
        protocolsImported: 0,
        manuscriptsImported: 0,
        clinicalRecordsImported: 0,
        errors: [`Import failed: ${error}`],
        warnings: [],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleValidateFile = async () => {
    if (!importFile) {
      alert('Please select a file to validate');
      return;
    }
    
    setIsProcessing(true);
    setValidationResult(null);
    setShowValidationErrors(false);
    
    try {
      const fileContent = await importFile.text();
      const result = validateImportFile(fileContent);
      setValidationResult(result);
      
      if (result.isValid) {
        setShowValidationErrors(false);
        alert('✅ File is valid for import');
      } else {
        setShowValidationErrors(true);
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        canProceed: false,
        summary: 'Unexpected validation error',
        reports: { projects: [] },
        errors: [{
          field: 'unknown',
          message: `Validation failed: ${error}`,
          code: 'UNEXPECTED_ERROR',
        }],
        warnings: [],
      });
      setShowValidationErrors(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-8 right-8 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <CheckCircle2 className="w-5 h-5" />
          <span>Operation completed successfully!</span>
        </div>
      )}

      {/* Navigation Tabs - Academic Writing Style */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-8 py-3">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('export')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'export'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'import'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Upload className="w-4 h-4" />
              Import Data
            </button>
            <button
              onClick={() => setActiveTab('template')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'template'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Database className="w-4 h-4" />
              Mock Template
            </button>

            {/* Divider */}
            <div className="w-px bg-slate-200 mx-2"></div>

            {/* Sidebar View Tabs */}
            <button
              onClick={() => setActiveSidebarView('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSidebarView === 'preview'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <FileText className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => setActiveSidebarView('validation')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSidebarView === 'validation'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Validation
            </button>
            <button
              onClick={() => setActiveSidebarView('stats')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSidebarView === 'stats'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Package className="w-4 h-4" />
              Statistics
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Two-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Panel */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1600px] mx-auto">
            {/* Export Tab */}
            {activeTab === 'export' && (
              <div className="bg-white rounded-lg border border-slate-200 p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Download className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-slate-900 mb-2">Export Complete System State</h2>
                    <p className="text-slate-600 text-sm">
                      Export all projects, protocols, clinical data, manuscripts, and configurations to a JSON file.
                      This creates a complete snapshot of your Clinical Intelligence Engine.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Export Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={exportDescription}
                      onChange={(e) => setExportDescription(e.target.value)}
                      placeholder="e.g., Backup before Q1 2024 data entry"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-slate-900">Select Components to Export</h3>
                      <button
                        onClick={() => {
                          const allSelected = Object.values(exportSelections).every(v => v);
                          setExportSelections({
                            projects: !allSelected,
                            protocols: !allSelected,
                            clinicalData: !allSelected,
                            manuscripts: !allSelected,
                            statisticalManifests: !allSelected,
                            personas: !allSelected,
                            templates: !allSelected,
                          });
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        {Object.values(exportSelections).every(v => v) ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {[
                        { key: 'projects', label: 'Projects', desc: 'Settings & metadata' },
                        { key: 'protocols', label: 'Protocols', desc: 'Schema & versions' },
                        { key: 'clinicalData', label: 'Clinical Data', desc: 'Patient records' },
                        { key: 'manuscripts', label: 'Manuscripts', desc: 'Documents & sources' },
                        { key: 'statisticalManifests', label: 'Analytics', desc: 'Statistical results' },
                        { key: 'personas', label: 'Personas', desc: 'User roles & permissions' },
                        { key: 'templates', label: 'Templates', desc: 'Schema templates' },
                      ].map(({ key, label, desc }) => (
                        <label key={key} className="flex items-center gap-3 p-3 bg-white rounded border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors">
                          <input
                            type="checkbox"
                            checked={exportSelections[key as keyof typeof exportSelections]}
                            onChange={(e) => setExportSelections({ ...exportSelections, [key]: e.target.checked })}
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                          />
                          <div className="flex-1">
                            <div className="text-slate-900 font-medium">{label}</div>
                            <div className="text-xs text-slate-500">{desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="text-xs text-slate-600">
                        {Object.values(exportSelections).filter(v => v).length} of 7 components selected for export
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleExportAll}
                    disabled={isProcessing || Object.values(exportSelections).every(v => !v)}
                    className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>
                          {Object.values(exportSelections).every(v => v) 
                            ? 'Export All Data' 
                            : `Export Selected (${Object.values(exportSelections).filter(v => v).length})`}
                        </span>
                      </>
                    )}
                  </button>
                  
                  {Object.values(exportSelections).every(v => !v) && (
                    <div className="text-center text-sm text-amber-600 -mt-2">
                      ⚠️ Please select at least one component to export
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Import Tab */}
            {activeTab === 'import' && (
              <div className="bg-white rounded-lg border border-slate-200 p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Upload className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-slate-900 mb-2">Import System Data</h2>
                    <p className="text-slate-600 text-sm">
                      Import previously exported data or AI-generated mock data. Choose how to handle existing data.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* File Upload */}
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Select JSON File
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleFileSelect}
                        className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-indigo-400 transition-colors cursor-pointer"
                      />
                      {importFile && (
                        <div className="mt-2 text-sm text-slate-600 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span>{importFile.name}</span>
                          <span className="text-slate-400">({(importFile.size / 1024).toFixed(2)} KB)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Import Mode */}
                  <div>
                    <label className="block text-sm text-slate-700 mb-3">
                      Import Mode
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
                        <input
                          type="radio"
                          name="importMode"
                          value="update"
                          checked={importMode === 'update'}
                          onChange={(e) => setImportMode(e.target.value as any)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="text-slate-900 font-medium">Update Existing</div>
                          <div className="text-sm text-slate-600 mt-1">
                            Update existing items with imported data, add new items
                          </div>
                        </div>
                      </label>
                      
                      <label className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
                        <input
                          type="radio"
                          name="importMode"
                          value="skip"
                          checked={importMode === 'skip'}
                          onChange={(e) => setImportMode(e.target.value as any)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="text-slate-900 font-medium">Skip Existing</div>
                          <div className="text-sm text-slate-600 mt-1">
                            Keep existing items unchanged, only add new items
                          </div>
                        </div>
                      </label>
                      
                      <label className="flex items-start gap-3 p-4 border-2 border-amber-200 rounded-lg cursor-pointer hover:border-amber-400 transition-colors bg-amber-50">
                        <input
                          type="radio"
                          name="importMode"
                          value="replace"
                          checked={importMode === 'replace'}
                          onChange={(e) => setImportMode(e.target.value as any)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="text-amber-900 font-medium flex items-center gap-2">
                            Replace All
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                          <div className="text-sm text-amber-700 mt-1">
                            ⚠️ Replace all existing data with imported data (irreversible)
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleValidateFile}
                      disabled={!importFile || isProcessing}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Validate File</span>
                    </button>

                    <button
                      onClick={handleImport}
                      disabled={!importFile || isProcessing}
                      className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Importing...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5" />
                          <span>Import Data</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Validation Errors */}
                  {showValidationErrors && validationResult && (
                    <ValidationErrorDisplay
                      validationResult={validationResult}
                      onDismiss={() => setShowValidationErrors(false)}
                    />
                  )}

                  {/* Import Result */}
                  {importResult && (
                    <div className={`p-4 rounded-lg border ${
                      importResult.success 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className={`flex items-center gap-2 mb-2 ${
                        importResult.success ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {importResult.success ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5" />
                        )}
                        <span className="font-medium">
                          {importResult.success ? 'Import Successful' : 'Import Failed'}
                        </span>
                      </div>
                      <div className={`text-sm ${
                        importResult.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {importResult.success ? (
                          <div>
                            <div>Projects: {importResult.projectsImported}</div>
                            <div>Protocols: {importResult.protocolsImported}</div>
                            <div>Clinical Records: {importResult.clinicalRecordsImported}</div>
                          </div>
                        ) : (
                          <div>
                            {importResult.errors?.map((err: string, i: number) => (
                              <div key={i}>• {err}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Template Tab */}
            {activeTab === 'template' && (
              <div className="bg-white rounded-lg border border-slate-200 p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-slate-900 mb-2">Generate Mock Data Template</h2>
                    <p className="text-slate-600 text-sm">
                      Create a JSON template with example data structures for testing and development.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-900 mb-4">Select Template Components</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {[
                        { key: 'project', label: 'Project Template' },
                        { key: 'protocol', label: 'Protocol Template' },
                        { key: 'clinicalData', label: 'Clinical Data Template' },
                        { key: 'manuscript', label: 'Manuscript Template' },
                        { key: 'statisticalManifest', label: 'Statistical Manifest' },
                        { key: 'persona', label: 'Persona Template' },
                        { key: 'template', label: 'Schema Template' },
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-3 p-3 bg-white rounded border border-slate-200 cursor-pointer hover:border-purple-300 transition-colors">
                          <input
                            type="checkbox"
                            checked={templateSelections[key as keyof typeof templateSelections]}
                            onChange={(e) => setTemplateSelections({ ...templateSelections, [key]: e.target.checked })}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                          />
                          <span className="text-slate-900">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateTemplate}
                    disabled={isProcessing}
                    className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Database className="w-5 h-5" />
                        <span>Generate Template</span>
                      </>
                    )}
                  </button>

                  {generatedTemplate && (
                    <div className="space-y-3">
                      <div className="bg-slate-900 text-slate-100 rounded-lg p-4 max-h-96 overflow-y-auto text-xs font-mono">
                        <pre>{generatedTemplate.substring(0, 500)}...</pre>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleDownloadTemplate}
                          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <button
                          onClick={handleCopyTemplate}
                          className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          Copy to Clipboard
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Info Panel */}
        <div className={`${SIDEBAR_WIDTH} border-l border-slate-200 bg-white overflow-y-auto`}>
          <div className="p-6 space-y-6">
            {/* Preview Panel */}
            {activeSidebarView === 'preview' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-medium text-slate-900">Export Preview</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="text-xs text-slate-600 mb-2">Selected Components</div>
                    <div className="space-y-2">
                      {Object.entries(exportSelections).map(([key, value]) => (
                        value && (
                          <div key={key} className="flex items-center justify-between text-sm">
                            <span className="text-slate-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                    <div className="text-xs text-indigo-600 mb-2">Current Data</div>
                    <div className="space-y-1 text-sm text-indigo-900">
                      <div className="flex justify-between">
                        <span>Projects:</span>
                        <span className="font-medium">{stats.projects}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protocols:</span>
                        <span className="font-medium">{stats.protocols}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Records:</span>
                        <span className="font-medium">{stats.clinicalRecords}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-900">
                      Exporting creates a complete backup that can be imported later to restore your data.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Validation Panel */}
            {activeSidebarView === 'validation' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-medium text-slate-900">Validation Status</h3>
                </div>
                <div className="space-y-3">
                  {validationResult ? (
                    <>
                      <div className={`rounded-lg p-4 border ${
                        validationResult.isValid 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className={`flex items-center gap-2 mb-2 ${
                          validationResult.isValid ? 'text-green-900' : 'text-red-900'
                        }`}>
                          {validationResult.isValid ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5" />
                          )}
                          <span className="font-medium">
                            {validationResult.isValid ? 'Valid File' : 'Invalid File'}
                          </span>
                        </div>
                        <p className={`text-sm ${
                          validationResult.isValid ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {validationResult.summary}
                        </p>
                      </div>

                      {validationResult.errors.length > 0 && (
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                          <div className="text-xs text-red-600 mb-2">Errors ({validationResult.errors.length})</div>
                          <div className="space-y-1 text-xs text-red-900">
                            {validationResult.errors.slice(0, 3).map((error, i) => (
                              <div key={i}>• {error.message}</div>
                            ))}
                            {validationResult.errors.length > 3 && (
                              <div className="text-red-600">... and {validationResult.errors.length - 3} more</div>
                            )}
                          </div>
                        </div>
                      )}

                      {validationResult.warnings.length > 0 && (
                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                          <div className="text-xs text-amber-600 mb-2">Warnings ({validationResult.warnings.length})</div>
                          <div className="space-y-1 text-xs text-amber-900">
                            {validationResult.warnings.slice(0, 3).map((warning, i) => (
                              <div key={i}>• {warning.message}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 text-center">
                      <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">No file validated yet</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Upload a file and click Validate to see results
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Statistics Panel */}
            {activeSidebarView === 'stats' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-slate-900">Data Statistics</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="text-xs text-slate-600 mb-3">Current System Data</div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Projects</span>
                        <span className="text-lg font-medium text-slate-900">{stats.projects}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Protocols</span>
                        <span className="text-lg font-medium text-slate-900">{stats.protocols}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Clinical Records</span>
                        <span className="text-lg font-medium text-slate-900">{stats.clinicalRecords}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="text-xs text-purple-600 mb-2">Storage Information</div>
                    <div className="text-sm text-purple-900">
                      <div>LocalStorage-based</div>
                      <div className="text-xs text-purple-700 mt-1">
                        Data persists in your browser
                      </div>
                    </div>
                  </div>

                  {currentProject && (
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                      <div className="text-xs text-indigo-600 mb-2">Active Project</div>
                      <div className="text-sm text-indigo-900 font-medium">
                        {currentProject.name}
                      </div>
                      <div className="text-xs text-indigo-700 mt-1">
                        ID: {currentProject.id.substring(0, 8)}...
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}