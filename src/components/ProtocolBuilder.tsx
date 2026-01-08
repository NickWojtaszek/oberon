import { useState, useEffect } from 'react';
import { FileText, Calendar, User, Building, CheckCircle2, AlertTriangle, Save, Download, Edit3, Plus, Archive, GitBranch } from 'lucide-react';
import { ContentContainer } from './ui/ContentContainer';
import { ActivePersonasBar } from './ai-personas/ui/ActivePersonasBar';
import { ModulePersonaPanel } from './ai-personas/ui/ModulePersonaPanel';

interface SchemaBlock {
  id: string;
  variable: {
    id: string;
    name: string;
    category: string;
    icon: any;
  };
  dataType: string;
  role: string;
  endpointTier?: 'primary' | 'secondary' | 'exploratory' | null;
  children?: SchemaBlock[];
  customName?: string;
  unit?: string;
  minValue?: number;
  maxValue?: number;
  options?: string[];
}

interface ProtocolBuilderProps {
  schemaBlocks: SchemaBlock[];
  protocolMetadata?: {
    protocolTitle: string;
    protocolNumber: string;
    principalInvestigator: string;
    sponsor: string;
    studyPhase: string;
    therapeuticArea: string;
    estimatedEnrollment: string;
    studyDuration: string;
  };
  protocolContent?: {
    primaryObjective?: string;
    secondaryObjectives?: string;
    inclusionCriteria?: string;
    exclusionCriteria?: string;
    statisticalPlan?: string;
  };
  onMetadataChange?: (metadata: any) => void;
  onContentChange?: (content: any) => void;
  onSaveProtocol?: (data: any) => void;
  onExportProtocol?: () => void;
  currentVersion?: string;
  versionStatus?: 'draft' | 'published' | 'archived';
}

export function ProtocolBuilder({ schemaBlocks, protocolMetadata, protocolContent, onMetadataChange, onContentChange, onSaveProtocol, onExportProtocol, currentVersion, versionStatus }: ProtocolBuilderProps) {
  const [protocolTitle, setProtocolTitle] = useState(protocolMetadata?.protocolTitle || '');
  const [protocolNumber, setProtocolNumber] = useState(protocolMetadata?.protocolNumber || '');
  const [principalInvestigator, setPrincipalInvestigator] = useState(protocolMetadata?.principalInvestigator || '');
  const [sponsor, setSponsor] = useState(protocolMetadata?.sponsor || '');
  const [studyPhase, setStudyPhase] = useState(protocolMetadata?.studyPhase || '');
  const [therapeuticArea, setTherapeuticArea] = useState(protocolMetadata?.therapeuticArea || '');
  const [estimatedEnrollment, setEstimatedEnrollment] = useState(protocolMetadata?.estimatedEnrollment || '');
  const [studyDuration, setStudyDuration] = useState(protocolMetadata?.studyDuration || '');
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Protocol Content State
  const [primaryObjective, setPrimaryObjective] = useState(protocolContent?.primaryObjective || '');
  const [secondaryObjectives, setSecondaryObjectives] = useState(protocolContent?.secondaryObjectives || '');
  const [inclusionCriteria, setInclusionCriteria] = useState(protocolContent?.inclusionCriteria || '');
  const [exclusionCriteria, setExclusionCriteria] = useState(protocolContent?.exclusionCriteria || '');
  const [statisticalPlan, setStatisticalPlan] = useState(protocolContent?.statisticalPlan || '');

  // Sync protocol content changes to parent
  useEffect(() => {
    if (onContentChange) {
      onContentChange({
        primaryObjective,
        secondaryObjectives,
        inclusionCriteria,
        exclusionCriteria,
        statisticalPlan,
      });
    }
  }, [primaryObjective, secondaryObjectives, inclusionCriteria, exclusionCriteria, statisticalPlan]);

  // Update local state when protocolContent prop changes (e.g., when loading a saved protocol)
  useEffect(() => {
    if (protocolContent) {
      setPrimaryObjective(protocolContent.primaryObjective || '');
      setSecondaryObjectives(protocolContent.secondaryObjectives || '');
      setInclusionCriteria(protocolContent.inclusionCriteria || '');
      setExclusionCriteria(protocolContent.exclusionCriteria || '');
      setStatisticalPlan(protocolContent.statisticalPlan || '');
    }
  }, [protocolContent]);

  // Sync metadata changes to parent
  useEffect(() => {
    if (onMetadataChange) {
      onMetadataChange({
        protocolTitle,
        protocolNumber,
        principalInvestigator,
        sponsor,
        studyPhase,
        therapeuticArea,
        estimatedEnrollment,
        studyDuration,
      });
    }
  }, [protocolTitle, protocolNumber, principalInvestigator, sponsor, studyPhase, therapeuticArea, estimatedEnrollment, studyDuration]);

  // Update local state when protocolMetadata prop changes
  useEffect(() => {
    if (protocolMetadata) {
      setProtocolTitle(protocolMetadata.protocolTitle || '');
      setProtocolNumber(protocolMetadata.protocolNumber || '');
      setPrincipalInvestigator(protocolMetadata.principalInvestigator || '');
      setSponsor(protocolMetadata.sponsor || '');
      setStudyPhase(protocolMetadata.studyPhase || '');
      setTherapeuticArea(protocolMetadata.therapeuticArea || '');
      setEstimatedEnrollment(protocolMetadata.estimatedEnrollment || '');
      setStudyDuration(protocolMetadata.studyDuration || '');
    }
  }, [protocolMetadata]);

  // Group blocks by category/section
  const getAllBlocks = (blocks: SchemaBlock[]): SchemaBlock[] => {
    let result: SchemaBlock[] = [];
    blocks.forEach(block => {
      result.push(block);
      if (block.children) {
        result = result.concat(getAllBlocks(block.children));
      }
    });
    return result;
  };

  const allBlocks = getAllBlocks(schemaBlocks);
  const demographics = allBlocks.filter(b => b.variable.category === 'Demographics');
  const clinical = allBlocks.filter(b => b.variable.category === 'Clinical');
  const laboratory = allBlocks.filter(b => b.variable.category === 'Laboratory');
  const treatments = allBlocks.filter(b => b.variable.category === 'Treatments');
  const endpoints = allBlocks.filter(b => b.role === 'Outcome');
  const primaryEndpoints = endpoints.filter(b => b.endpointTier === 'primary');
  const secondaryEndpoints = endpoints.filter(b => b.endpointTier === 'secondary');

  const hasContent = schemaBlocks.length > 0;

  // Save Protocol Draft Function
  const handleSaveProtocol = () => {
    const protocolData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      documentType: 'protocol-draft',
      metadata: {
        protocolTitle,
        protocolNumber,
        principalInvestigator,
        sponsor,
        studyPhase,
        therapeuticArea,
        estimatedEnrollment,
        studyDuration,
      },
      schemaBlocks,
      endpoints: {
        primary: primaryEndpoints,
        secondary: secondaryEndpoints,
      },
      content: {
        primaryObjective,
        secondaryObjectives,
        inclusionCriteria,
        exclusionCriteria,
        statisticalPlan,
      },
    };

    const dataStr = JSON.stringify(protocolData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `protocol-draft-${protocolNumber || Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onSaveProtocol) {
      onSaveProtocol(protocolData);
    }
  };

  // Export Protocol as HTML/Document
  const handleExportProtocol = () => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Clinical Study Protocol - ${protocolTitle || 'Untitled'}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 40px;
      line-height: 1.6;
      color: #1e293b;
    }
    h1 { color: #0f172a; border-bottom: 3px solid #3b82f6; padding-bottom: 12px; }
    h2 { color: #334155; margin-top: 32px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
    h3 { color: #475569; margin-top: 24px; }
    .metadata { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .metadata-row { display: grid; grid-template-columns: 200px 1fr; gap: 16px; margin: 8px 0; }
    .label { font-weight: 600; color: #64748b; }
    .value { color: #0f172a; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
    th { background: #f1f5f9; font-weight: 600; }
    .endpoint-primary { background: #dbeafe; }
    .endpoint-secondary { background: #f0fdf4; }
    @media print {
      body { margin: 0; padding: 20px; }
    }
  </style>
</head>
<body>
  <h1>Clinical Study Protocol</h1>
  
  <div class="metadata">
    <div class="metadata-row">
      <div class="label">Protocol Number:</div>
      <div class="value">${protocolNumber || 'Not specified'}</div>
    </div>
    <div class="metadata-row">
      <div class="label">Protocol Title:</div>
      <div class="value">${protocolTitle || 'Not specified'}</div>
    </div>
    <div class="metadata-row">
      <div class="label">Principal Investigator:</div>
      <div class="value">${principalInvestigator || 'Not specified'}</div>
    </div>
    <div class="metadata-row">
      <div class="label">Sponsor:</div>
      <div class="value">${sponsor || 'Not specified'}</div>
    </div>
    <div class="metadata-row">
      <div class="label">Study Phase:</div>
      <div class="value">${studyPhase || 'Not specified'}</div>
    </div>
    <div class="metadata-row">
      <div class="label">Therapeutic Area:</div>
      <div class="value">${therapeuticArea || 'Not specified'}</div>
    </div>
    <div class="metadata-row">
      <div class="label">Estimated Enrollment:</div>
      <div class="value">${estimatedEnrollment || 'Not specified'}</div>
    </div>
    <div class="metadata-row">
      <div class="label">Study Duration:</div>
      <div class="value">${studyDuration || 'Not specified'}</div>
    </div>
  </div>

  ${primaryEndpoints.length > 0 ? `
  <h2>Primary Endpoints</h2>
  <table>
    <thead>
      <tr>
        <th>Variable Name</th>
        <th>Data Type</th>
        <th>Unit</th>
      </tr>
    </thead>
    <tbody>
      ${primaryEndpoints.map(ep => `
        <tr class="endpoint-primary">
          <td>${ep.customName || ep.variable.name}</td>
          <td>${ep.dataType}</td>
          <td>${ep.unit || 'N/A'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  ` : ''}

  ${secondaryEndpoints.length > 0 ? `
  <h2>Secondary Endpoints</h2>
  <table>
    <thead>
      <tr>
        <th>Variable Name</th>
        <th>Data Type</th>
        <th>Unit</th>
      </tr>
    </thead>
    <tbody>
      ${secondaryEndpoints.map(ep => `
        <tr class="endpoint-secondary">
          <td>${ep.customName || ep.variable.name}</td>
          <td>${ep.dataType}</td>
          <td>${ep.unit || 'N/A'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  ` : ''}

  ${demographics.length > 0 ? `
  <h2>Demographics</h2>
  <table>
    <thead>
      <tr>
        <th>Variable Name</th>
        <th>Data Type</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      ${demographics.map(d => `
        <tr>
          <td>${d.customName || d.variable.name}</td>
          <td>${d.dataType}</td>
          <td>${d.unit || d.options?.join(', ') || 'N/A'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  ` : ''}

  <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
    Generated on ${new Date().toLocaleString()} | Total Variables: ${allBlocks.length}
  </p>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `protocol-${protocolNumber || Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onExportProtocol) {
      onExportProtocol();
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Active Personas Bar */}
      <ActivePersonasBar module="protocol-workbench" />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <ContentContainer className="p-8">
            
            {/* Empty State */}
            {!hasContent && (
              <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-12 text-center">
                <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg text-slate-900 mb-2">No Schema Defined</h3>
                <p className="text-slate-600 mb-4">
                  Switch to <strong>Schema Builder</strong> tab to create your protocol structure first.
                </p>
                <p className="text-sm text-slate-500">
                  Once you add meta-blocks, they'll automatically populate this fillable protocol document.
                </p>
              </div>
            )}

            {/* Protocol Document */}
            {hasContent && (
              <div className="space-y-6">
                
                {/* Version Status Banner */}
                {currentVersion && (
                  <div className={`rounded-xl p-4 border-2 ${
                    versionStatus === 'draft' 
                      ? 'bg-amber-50 border-amber-300' 
                      : versionStatus === 'published'
                      ? 'bg-green-50 border-green-300'
                      : 'bg-slate-50 border-slate-300'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {versionStatus === 'draft' && <Edit3 className="w-5 h-5 text-amber-600" />}
                        {versionStatus === 'published' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                        {versionStatus === 'archived' && <Archive className="w-5 h-5 text-slate-600" />}
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            Version {currentVersion}
                            <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                              versionStatus === 'draft' ? 'bg-amber-100 text-amber-700' :
                              versionStatus === 'published' ? 'bg-green-100 text-green-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {versionStatus?.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600">
                            {versionStatus === 'draft' && 'Make changes and save as new draft or publish'}
                            {versionStatus === 'published' && 'This is a published version - create a new version to make changes'}
                            {versionStatus === 'archived' && 'This version is archived'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {versionStatus === 'draft' && onSaveProtocol && (
                          <>
                            <button
                              onClick={() => onSaveProtocol({ status: 'draft' })}
                              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
                            >
                              <Save className="w-4 h-4" />
                              Save Draft
                            </button>
                            <button
                              onClick={() => {
                                const changelog = prompt('Enter changes made in this version:');
                                if (changelog !== null) {
                                  onSaveProtocol({ status: 'published', changelog });
                                }
                              }}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Publish Version
                            </button>
                          </>
                        )}
                        {versionStatus === 'published' && onSaveProtocol && (
                          <button
                            onClick={() => onSaveProtocol({ status: 'draft' })}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
                          >
                            <GitBranch className="w-4 h-4" />
                            Create New Version
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Document Header */}
                <div className="bg-white border-2 border-slate-300 rounded-xl p-8 shadow-sm">
                  <div className="text-center mb-6 pb-6 border-b-2 border-slate-200">
                    <h1 className="text-2xl text-slate-900 mb-2">Clinical Study Protocol</h1>
                    <p className="text-sm text-slate-600">Protocol Document Generator</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-2">
                        Protocol Number *
                      </label>
                      <input
                        type="text"
                        value={protocolNumber}
                        onChange={(e) => setProtocolNumber(e.target.value)}
                        placeholder="e.g., PROTO-2026-001"
                        className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-2">
                        Study Phase *
                      </label>
                      <select
                        value={studyPhase}
                        onChange={(e) => setStudyPhase(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                      >
                        <option value="">Select Phase</option>
                        <option value="Phase I">Phase I</option>
                        <option value="Phase II">Phase II</option>
                        <option value="Phase III">Phase III</option>
                        <option value="Phase IV">Phase IV</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-2">
                        Protocol Title *
                      </label>
                      <input
                        type="text"
                        value={protocolTitle}
                        onChange={(e) => setProtocolTitle(e.target.value)}
                        placeholder="Full protocol title"
                        className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-2">
                        Principal Investigator
                      </label>
                      <input
                        type="text"
                        value={principalInvestigator}
                        onChange={(e) => setPrincipalInvestigator(e.target.value)}
                        placeholder="Dr. Name"
                        className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-2">
                        Sponsor
                      </label>
                      <input
                        type="text"
                        value={sponsor}
                        onChange={(e) => setSponsor(e.target.value)}
                        placeholder="Organization name"
                        className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-2">
                        Therapeutic Area
                      </label>
                      <input
                        type="text"
                        value={therapeuticArea}
                        onChange={(e) => setTherapeuticArea(e.target.value)}
                        placeholder="e.g., Oncology"
                        className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-2">
                        Estimated Enrollment
                      </label>
                      <input
                        type="text"
                        value={estimatedEnrollment}
                        onChange={(e) => setEstimatedEnrollment(e.target.value)}
                        placeholder="e.g., 200 participants"
                        className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 1: Study Objectives */}
                <div className="bg-white border-2 border-slate-300 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-indigo-50 border-b-2 border-indigo-200 px-6 py-4">
                    <h2 className="text-lg text-indigo-900 font-medium">1. Study Objectives</h2>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Primary Objective
                      </label>
                      <textarea
                        value={primaryObjective}
                        onChange={(e) => setPrimaryObjective(e.target.value)}
                        placeholder="Enter primary study objective..."
                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 min-h-[100px]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Secondary Objectives
                      </label>
                      <textarea
                        value={secondaryObjectives}
                        onChange={(e) => setSecondaryObjectives(e.target.value)}
                        placeholder="Enter secondary objectives..."
                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Endpoints (Auto-populated from Schema) */}
                <div className="bg-white border-2 border-slate-300 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-indigo-50 border-b-2 border-indigo-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-lg text-indigo-900 font-medium">2. Study Endpoints</h2>
                    <div className="flex items-center gap-2 text-xs text-indigo-700">
                      <CheckCircle2 className="w-4 h-4" />
                      Auto-populated from schema
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    
                    {/* Primary Endpoints */}
                    {primaryEndpoints.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-slate-900 mb-3">Primary Endpoints</h3>
                        <div className="space-y-3">
                          {primaryEndpoints.map((endpoint) => (
                            <div key={endpoint.id} className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <CheckCircle2 className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-purple-900 mb-1">
                                    {endpoint.customName || endpoint.variable.name}
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-purple-700">
                                    <span>Data Type: {endpoint.dataType}</span>
                                    {endpoint.unit && <span>Unit: {endpoint.unit}</span>}
                                  </div>
                                  <div className="mt-2">
                                    <textarea
                                      placeholder="Describe how this endpoint will be measured and analyzed..."
                                      className="w-full px-3 py-2 border-2 border-purple-200 bg-white rounded text-xs focus:outline-none focus:border-purple-500 min-h-[60px]"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Secondary Endpoints */}
                    {secondaryEndpoints.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-slate-900 mb-3">Secondary Endpoints</h3>
                        <div className="space-y-2">
                          {secondaryEndpoints.map((endpoint) => (
                            <div key={endpoint.id} className="bg-slate-50 border border-slate-300 rounded-lg p-3">
                              <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-slate-600 rounded flex items-center justify-center flex-shrink-0">
                                  <CheckCircle2 className="w-3 h-3 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm text-slate-900 mb-1">
                                    {endpoint.customName || endpoint.variable.name}
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-slate-600">
                                    <span>Type: {endpoint.dataType}</span>
                                    {endpoint.unit && <span>Unit: {endpoint.unit}</span>}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {endpoints.length === 0 && (
                      <div className="text-center py-8 text-slate-500 text-sm">
                        <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                        No endpoints defined in schema. Add outcome variables in Schema Builder.
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 3: Study Population */}
                <div className="bg-white border-2 border-slate-300 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-indigo-50 border-b-2 border-indigo-200 px-6 py-4">
                    <h2 className="text-lg text-indigo-900 font-medium">3. Study Population</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Inclusion Criteria
                      </label>
                      <textarea
                        value={inclusionCriteria}
                        onChange={(e) => setInclusionCriteria(e.target.value)}
                        placeholder="List inclusion criteria (one per line)..."
                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 min-h-[120px]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Exclusion Criteria
                      </label>
                      <textarea
                        value={exclusionCriteria}
                        onChange={(e) => setExclusionCriteria(e.target.value)}
                        placeholder="List exclusion criteria (one per line)..."
                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 min-h-[120px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Data Collection (Auto-populated) */}
                <div className="bg-white border-2 border-slate-300 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-indigo-50 border-b-2 border-indigo-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-lg text-indigo-900 font-medium">4. Data Collection Plan</h2>
                    <div className="flex items-center gap-2 text-xs text-indigo-700">
                      <CheckCircle2 className="w-4 h-4" />
                      {allBlocks.length} variables from schema
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    
                    {/* Demographics */}
                    {demographics.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          Demographics ({demographics.length})
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {demographics.map((block) => (
                            <div key={block.id} className="bg-blue-50 border border-blue-300 rounded-lg p-3">
                              <div className="text-sm text-blue-900">{block.customName || block.variable.name}</div>
                              <div className="text-xs text-blue-700 mt-1">{block.dataType}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Clinical Assessments */}
                    {clinical.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-green-600" />
                          Clinical Assessments ({clinical.length})
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {clinical.map((block) => (
                            <div key={block.id} className="bg-green-50 border border-green-300 rounded-lg p-3">
                              <div className="text-sm text-green-900">{block.customName || block.variable.name}</div>
                              <div className="text-xs text-green-700 mt-1">{block.dataType}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Laboratory */}
                    {laboratory.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-amber-600" />
                          Laboratory Tests ({laboratory.length})
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {laboratory.map((block) => (
                            <div key={block.id} className="bg-amber-50 border border-amber-300 rounded-lg p-3">
                              <div className="text-sm text-amber-900">{block.customName || block.variable.name}</div>
                              <div className="text-xs text-amber-700 mt-1">{block.dataType}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Treatments */}
                    {treatments.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          Treatments ({treatments.length})
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {treatments.map((block) => (
                            <div key={block.id} className="bg-indigo-50 border border-indigo-300 rounded-lg p-3">
                              <div className="text-sm text-indigo-900">{block.customName || block.variable.name}</div>
                              <div className="text-xs text-indigo-700 mt-1">{block.dataType}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 5: Statistical Analysis Plan */}
                <div className="bg-white border-2 border-slate-300 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-indigo-50 border-b-2 border-indigo-200 px-6 py-4">
                    <h2 className="text-lg text-indigo-900 font-medium">5. Statistical Analysis Plan</h2>
                  </div>
                  <div className="p-6">
                    <textarea
                      value={statisticalPlan}
                      onChange={(e) => setStatisticalPlan(e.target.value)}
                      placeholder="Describe statistical methods, sample size calculation, and analysis approach..."
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 min-h-[200px]"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    onClick={handleSaveProtocol}
                  >
                    <Save className="w-5 h-5" />
                    Save Protocol Draft
                  </button>
                  <button
                    className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-300 rounded-lg font-medium transition-colors flex items-center gap-2"
                    onClick={handleExportProtocol}
                  >
                    <Download className="w-5 h-5" />
                    Export PDF
                  </button>
                </div>
              </div>
            )}
          </ContentContainer>
        </div>
        
        {/* Right Sidebar - AI Personas */}
        <ModulePersonaPanel module="protocol-workbench" />
      </div>
    </div>
  );
}