// Left Pane: Distraction-Free Manuscript Editor

import { useState, useRef } from 'react';
import { FileText, BookOpen, FlaskConical, MessageSquare, Lightbulb, Sparkles, Eye, EyeOff, GitBranch } from 'lucide-react';
import { CitationChipInput } from './CitationChipInput';
import { CitationChipGroup } from './CitationChip';
import { EvidenceCard } from './EvidenceCard';
import { generateVerificationPacket } from '../../utils/verificationService';
import { useTrackedChanges } from '../../hooks/useTrackedChanges';
import type { ManuscriptManifest, ReferenceCitation, SourceDocument } from '../../types/manuscript';
import type { AIMode, ClaimAudit } from '../../types/aiMode';
import type { VerificationPacket } from '../../types/evidenceVerification';
import type { StatisticalManifest } from '../analytics-stats/types';
import type { ViewMode } from '../../types/trackedChanges';
import { SectionNavigator, type SectionKey } from './SectionNavigator';
import { ManuscriptTitle } from './ManuscriptTitle';
import { AuthorsSection, type Author } from './AuthorsSection';

interface ManuscriptEditorProps {
  manifest: ManuscriptManifest;
  onContentChange: (section: keyof ManuscriptManifest['manuscriptContent'], content: string) => void;
  onTitleChange: (title: string) => void;
  onAuthorsChange: (authors: Author[]) => void;
  manuscriptTitle: string;
  manuscriptAuthors: Author[];
  citations: ReferenceCitation[];
  logicErrors: Array<{ section: string; message: string }>;
  claimsAudit: ClaimAudit[];
  sources: SourceDocument[];
  onInsertCitation: (citationKey: string, sourceId: string, section: string) => void;
  aiMode: AIMode;
  onGenerateSection?: (section: keyof ManuscriptManifest['manuscriptContent']) => void;
  statisticalManifest?: StatisticalManifest;
  verifications: VerificationPacket[];
  onUpdateVerification: (verification: VerificationPacket) => void;
  // Manuscript management props
  manuscripts?: Array<{
    id: string;
    title: string;
    lastModified: number;
  }>;
  activeManuscriptId?: string;
  onManuscriptSelect?: (manuscriptId: string) => void;
}

export function ManuscriptEditor({ 
  manifest, 
  onContentChange, 
  onTitleChange,
  onAuthorsChange,
  manuscriptTitle,
  manuscriptAuthors,
  citations, 
  logicErrors, 
  claimsAudit,
  sources,
  onInsertCitation,
  aiMode,
  onGenerateSection,
  statisticalManifest,
  verifications = [],
  onUpdateVerification,
  // Manuscript management props
  manuscripts,
  activeManuscriptId,
  onManuscriptSelect
}: ManuscriptEditorProps) {
  const [activeSection, setActiveSection] = useState<SectionKey>('introduction');
  const [showCitationInput, setShowCitationInput] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<VerificationPacket | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Tracked changes hook
  const trackedChanges = useTrackedChanges({
    manuscriptId: manifest.id,
    currentUser: manifest.projectMeta.primaryInvestigator,
    currentRole: 'PI'
  });

  const getSectionErrors = (section: SectionKey) => {
    return logicErrors.filter(e => e.section === section);
  };

  const getSectionConflicts = (section: SectionKey) => {
    return claimsAudit.filter(c => c.section === section && c.status === 'conflict');
  };

  const wordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
  };

  const handleInsertCitation = (citationKey: string, sourceId: string) => {
    onInsertCitation(citationKey, sourceId, activeSection);
    setShowCitationInput(false);
    
    // Get the sentence/context around cursor for verification
    const text = manifest.manuscriptContent?.[activeSection] || '';
    const cursorPos = textareaRef.current?.selectionStart || text.length;
    const context = extractSentenceContext(text, cursorPos);
    
    // Generate verification packet
    const source = sources.find(s => s.citationKey === citationKey);
    if (source) {
      const verification = generateVerificationPacket(
        citationKey,
        context,
        activeSection,
        source,
        statisticalManifest
      );
      onUpdateVerification(verification);
    }
    
    // Insert at cursor position
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const before = text.substring(0, start);
      const after = text.substring(end);
      const newText = before + `[@${citationKey}]` + after;
      onContentChange(activeSection, newText);
      
      // Set cursor after inserted citation
      setTimeout(() => {
        if (textareaRef.current) {
          const newPos = start + citationKey.length + 3;
          textareaRef.current.setSelectionRange(newPos, newPos);
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  // Extract sentence containing cursor position
  const extractSentenceContext = (text: string, position: number): string => {
    // Find sentence boundaries
    const before = text.substring(0, position);
    const after = text.substring(position);
    
    const sentenceStart = Math.max(
      before.lastIndexOf('. '),
      before.lastIndexOf('! '),
      before.lastIndexOf('? '),
      0
    );
    
    const sentenceEnd = Math.min(
      after.indexOf('. ') !== -1 ? position + after.indexOf('. ') + 1 : text.length,
      after.indexOf('! ') !== -1 ? position + after.indexOf('! ') + 1 : text.length,
      after.indexOf('? ') !== -1 ? position + after.indexOf('? ') + 1 : text.length
    );
    
    return text.substring(sentenceStart, sentenceEnd).trim();
  };

  // Get citations for current section
  const getSectionCitations = (section: SectionKey) => {
    const text = manifest.manuscriptContent?.[section] || '';
    const citationPattern = /\[@([^\]]+)\]/g;
    const matches = [...text.matchAll(citationPattern)];
    
    return matches.map(match => {
      const key = match[1];
      const verification = verifications.find(v => 
        v.referenceSource.citationKey === key && v.section === section
      );
      return { key, verification };
    });
  };

  const handleCitationClick = (citationKey: string) => {
    const verification = verifications.find(v => 
      v.referenceSource.citationKey === citationKey && v.section === activeSection
    );
    
    if (verification) {
      setSelectedEvidence(verification);
    } else {
      // Generate verification on-the-fly if not found
      const source = sources.find(s => s.citationKey === citationKey);
      const text = manifest.manuscriptContent?.[activeSection] || '';
      const citationPattern = new RegExp(`([^.!?]*\\[@${citationKey}\\][^.!?]*)`, 'i');
      const match = text.match(citationPattern);
      const context = match ? match[1] : text.substring(0, 200);
      
      if (source) {
        const newVerification = generateVerificationPacket(
          citationKey,
          context,
          activeSection,
          source,
          statisticalManifest
        );
        onUpdateVerification(newVerification);
        setSelectedEvidence(newVerification);
      }
    }
  };

  const handleFixCitation = (citationId: string) => {
    // In production: Use AI to suggest rewrite based on manifest
    alert('AI would suggest a corrected version based on your Statistical Manifest data');
    setSelectedEvidence(null);
  };

  // Render text with citation chips highlighted
  const sectionCitations = getSectionCitations(activeSection);
  
  // Calculate section stats for navigator
  const sectionStats: Record<SectionKey, {
    wordCount: number;
    errorCount: number;
    conflictCount: number;
    hasContent: boolean;
  }> = {
    introduction: {
      wordCount: wordCount(manifest.manuscriptContent.introduction),
      errorCount: getSectionErrors('introduction').length,
      conflictCount: getSectionConflicts('introduction').length,
      hasContent: !!manifest.manuscriptContent.introduction
    },
    methods: {
      wordCount: wordCount(manifest.manuscriptContent.methods),
      errorCount: getSectionErrors('methods').length,
      conflictCount: getSectionConflicts('methods').length,
      hasContent: !!manifest.manuscriptContent.methods
    },
    results: {
      wordCount: wordCount(manifest.manuscriptContent.results),
      errorCount: getSectionErrors('results').length,
      conflictCount: getSectionConflicts('results').length,
      hasContent: !!manifest.manuscriptContent.results
    },
    discussion: {
      wordCount: wordCount(manifest.manuscriptContent.discussion),
      errorCount: getSectionErrors('discussion').length,
      conflictCount: getSectionConflicts('discussion').length,
      hasContent: !!manifest.manuscriptContent.discussion
    },
    conclusion: {
      wordCount: wordCount(manifest.manuscriptContent.conclusion),
      errorCount: getSectionErrors('conclusion').length,
      conflictCount: getSectionConflicts('conclusion').length,
      hasContent: !!manifest.manuscriptContent.conclusion
    },
    authors: {
      wordCount: 0, // Authors section doesn't have word count
      errorCount: 0,
      conflictCount: 0,
      hasContent: true // Always show as available
    }
  };

  // Mock manuscript content for authors section to satisfy type
  const manuscriptContentWithAuthors = {
    ...manifest.manuscriptContent,
    authors: '' // Empty string for authors section
  };

  return (
    <div className="h-full flex bg-white">
      {/* Left Sidebar: Section Navigator */}
      <SectionNavigator
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        sectionStats={sectionStats}
        manuscriptContent={manuscriptContentWithAuthors}
        manuscripts={manuscripts}
        activeManuscriptId={activeManuscriptId}
        onManuscriptSelect={onManuscriptSelect}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Manuscript Title */}
        <ManuscriptTitle 
          title={manuscriptTitle}
          onTitleChange={onTitleChange}
        />

        {activeSection === 'authors' ? (
          /* Authors Section */
          <AuthorsSection
            authors={manuscriptAuthors}
            onAuthorsChange={onAuthorsChange}
          />
        ) : (
          /* Writing Sections */
          <>
            <div className="flex-1 overflow-y-auto px-8 py-8">
              <div className="max-w-[1600px] mx-auto">
                {/* Logic Errors Display */}
                {getSectionErrors(activeSection).length > 0 && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-sm font-medium text-red-900 mb-2">Logic Check Failed</div>
                    {getSectionErrors(activeSection).map((error, idx) => (
                      <div key={idx} className="text-sm text-red-700 mb-1">
                        • {error.message}
                      </div>
                    ))}
                  </div>
                )}

                {/* Co-Pilot Mode: Claim Conflicts */}
                {aiMode === 'co-pilot' && getSectionConflicts(activeSection).length > 0 && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="text-sm font-medium text-amber-900 mb-2">
                      ⚠️ AI Supervision: Potential Conflicts Detected
                    </div>
                    {getSectionConflicts(activeSection).map((conflict, idx) => (
                      <div key={idx} className="text-sm text-amber-800 mb-2">
                        <div className="font-medium mb-1">"{conflict.sentence}"</div>
                        {conflict.manifestReference && (
                          <div className="text-xs">
                            Expected: {conflict.manifestReference.expectedValue} | 
                            Found: {conflict.manifestReference.actualValue}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Pilot Mode: AI Generation Button */}
                {aiMode === 'pilot' && onGenerateSection && (
                  <div className="mb-6">
                    <button
                      onClick={() => onGenerateSection(activeSection)}
                      className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-3 group"
                    >
                      <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                      <span className="font-medium">Generate {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Section with AI</span>
                    </button>
                  </div>
                )}

                {/* Citation Chips Preview */}
                {sectionCitations.length > 0 && (
                  <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="text-xs font-medium text-purple-900 mb-2">Citations in this section (click to verify):</div>
                    <CitationChipGroup
                      citations={sectionCitations}
                      onClickCitation={handleCitationClick}
                    />
                  </div>
                )}

                {/* Section-specific guidance */}
                {activeSection === 'methods' && manifest.manuscriptStructure.methods.statisticalPlan && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm font-medium text-blue-900 mb-2">Statistical Plan Reference</div>
                    <div className="text-sm text-blue-800">
                      <strong>Software:</strong> {manifest.manuscriptStructure.methods.statisticalPlan.software}
                    </div>
                    <div className="text-sm text-blue-800 mt-1">
                      <strong>Primary Test:</strong> {manifest.manuscriptStructure.methods.statisticalPlan.primaryTest}
                    </div>
                    <div className="text-sm text-blue-800 mt-1">
                      <strong>Rationale:</strong> {manifest.manuscriptStructure.methods.statisticalPlan.rationale}
                    </div>
                  </div>
                )}

                {/* Textarea Controls */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowCitationInput(true)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 border border-purple-300 rounded-lg transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Insert Citation (@)
                    </button>
                  </div>
                  
                  {/* Tracked Changes Controls */}
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-slate-500 mr-2">
                      Track changes for review collaboration
                    </div>
                    
                    <button
                      onClick={() => trackedChanges.setIsTrackingEnabled(!trackedChanges.isTrackingEnabled)}
                      className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        trackedChanges.isTrackingEnabled
                          ? 'bg-green-50 text-green-700 border border-green-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-300'
                      }`}
                      title={trackedChanges.isTrackingEnabled ? 'Change tracking is ON - edits will be recorded for review' : 'Change tracking is OFF - edits are made directly'}
                    >
                      <GitBranch className="w-4 h-4" />
                      {trackedChanges.isTrackingEnabled ? 'Tracking ON' : 'Tracking OFF'}
                    </button>

                    <button
                      onClick={() => trackedChanges.setShowChanges(!trackedChanges.showChanges)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
                      title={trackedChanges.showChanges ? 'Hide tracked changes markup' : 'Show tracked changes markup'}
                    >
                      {trackedChanges.showChanges ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      {trackedChanges.showChanges ? 'Hide' : 'Show'}
                    </button>

                    <select
                      value={trackedChanges.viewMode}
                      onChange={(e) => trackedChanges.setViewMode(e.target.value as ViewMode)}
                      className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Choose how to display the document"
                    >
                      <option value="markup">Markup View</option>
                      <option value="clean">Clean View</option>
                      <option value="original">Original View</option>
                    </select>

                    {trackedChanges.getPendingCount() > 0 && (
                      <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded" title={`${trackedChanges.getPendingCount()} changes awaiting review`}>
                        {trackedChanges.getPendingCount()} pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Textarea with Serif Font */}
                <textarea
                  ref={textareaRef}
                  value={manifest.manuscriptContent[activeSection]}
                  onChange={(e) => onContentChange(activeSection, e.target.value)}
                  placeholder={`Write your ${activeSection} here...`}
                  className="w-full min-h-[600px] p-6 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  style={{
                    fontFamily: 'Georgia, Merriweather, serif',
                    fontSize: '16px',
                    lineHeight: '1.8'
                  }}
                />

                {/* Word Count */}
                <div className="mt-4 text-sm text-slate-500 text-right">
                  {wordCount(manifest.manuscriptContent[activeSection])} words
                </div>
              </div>
            </div>

            {/* Citation Input Modal */}
            {showCitationInput && (
              <CitationChipInput
                sources={sources}
                onInsertCitation={handleInsertCitation}
              />
            )}

            {/* Evidence Card */}
            {selectedEvidence && (
              <EvidenceCard
                verification={selectedEvidence}
                onClose={() => setSelectedEvidence(null)}
                onFix={handleFixCitation}
              />
            )}

            {/* Footer Stats */}
            <div className="px-8 py-4 border-t border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <div>
                  Total Words: {Object.values(manifest.manuscriptContent).reduce((sum, content) => sum + wordCount(content), 0)}
                </div>
                <div>
                  Last Modified: {new Date(manifest.projectMeta.modifiedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}