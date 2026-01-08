// Bibliography Tab - Auto-Generated References

import { useState, useMemo } from 'react';
import { Copy, Check, Plus, Trash2, BookOpen, Download } from 'lucide-react';
import type { BibliographyEntry, CitationStyle } from '../../types/aiMode';
import type { SourceDocument } from '../../types/manuscript';
import { copyToClipboard } from '../../utils/clipboard';

interface BibliographyTabProps {
  usedCitations: { citationKey: string; count: number }[];
  sources: SourceDocument[];
  citationStyle: CitationStyle;
  onStyleChange: (style: CitationStyle) => void;
}

export function BibliographyTab({ 
  usedCitations, 
  sources,
  citationStyle,
  onStyleChange 
}: BibliographyTabProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Build bibliography entries from used citations
  const bibliographyEntries: BibliographyEntry[] = usedCitations
    .map(citation => {
      const source = sources.find(s => s.citationKey === citation.citationKey);
      if (!source) return null;

      // Mock bibliographic data (in real app, this would come from source metadata)
      return {
        id: source.id,
        citationKey: source.citationKey,
        sourceId: source.id,
        authors: extractAuthors(source.fileName),
        title: source.fileName.replace(/\.pdf$/i, ''),
        journal: extractJournal(source.fileName),
        year: extractYear(source.fileName),
        volume: undefined,
        pages: undefined,
        doi: undefined,
        url: undefined,
        timesUsed: citation.count
      };
    })
    .filter(Boolean) as BibliographyEntry[];

  const formatCitation = (entry: BibliographyEntry, style: CitationStyle, index: number): string => {
    const authorStr = formatAuthors(entry.authors, style);
    
    switch (style) {
      case 'vancouver':
        return `${index + 1}. ${authorStr}. ${entry.title}. ${entry.journal || 'Unknown Journal'}. ${entry.year}.`;
      
      case 'ama':
        return `${index + 1}. ${authorStr}. ${entry.title}. ${entry.journal || 'Unknown Journal'}. ${entry.year}.`;
      
      case 'apa':
        return `${authorStr} (${entry.year}). ${entry.title}. ${entry.journal || 'Unknown Journal'}.`;
      
      default:
        return `${authorStr}. ${entry.title}. ${entry.journal || 'Unknown Journal'}. ${entry.year}.`;
    }
  };

  const handleCopy = async (text: string, index: number) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      alert('Failed to copy to clipboard. Please copy manually.');
    }
  };

  const handleCopyAll = async () => {
    const allCitations = bibliographyEntries
      .map((entry, idx) => formatCitation(entry, citationStyle, idx))
      .join('\n\n');
    const success = await copyToClipboard(allCitations);
    if (!success) {
      alert('Failed to copy all citations. Please copy manually.');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-slate-900 mb-1">References</h2>
            <div className="text-sm text-slate-600">
              {bibliographyEntries.length} source{bibliographyEntries.length !== 1 ? 's' : ''} cited in this manuscript
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy All
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Citation Style Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-slate-600">CITATION STYLE</label>
          <div className="flex gap-2">
            {(['vancouver', 'ama', 'apa'] as CitationStyle[]).map(style => (
              <button
                key={style}
                onClick={() => onStyleChange(style)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  citationStyle === style
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {style.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bibliography List */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {bibliographyEntries.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <div className="text-sm">No citations yet</div>
            <div className="text-xs mt-1">Citations will appear here as you reference sources in your manuscript</div>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl">
            {bibliographyEntries.map((entry, index) => {
              const formattedCitation = formatCitation(entry, citationStyle, index);
              
              return (
                <div key={entry.id} className="p-4 border border-slate-200 rounded-lg hover:border-purple-300 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="text-sm text-slate-900 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                        {formattedCitation}
                      </div>
                      <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                        <span className="px-2 py-0.5 bg-slate-100 rounded font-mono">
                          @{entry.citationKey}
                        </span>
                        <span>
                          Used {entry.timesUsed} time{entry.timesUsed !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(formattedCitation, index)}
                      className="p-2 hover:bg-slate-100 rounded transition-colors"
                      title="Copy citation"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {bibliographyEntries.length > 0 && (
        <div className="px-8 py-4 border-t border-slate-200 bg-slate-50">
          <div className="text-xs text-slate-600">
            References are auto-synchronized from citations in your manuscript
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function extractAuthors(fileName: string): string[] {
  // Try to extract authors from filename (e.g., "Smith_2024_Guidelines.pdf")
  const parts = fileName.replace(/\.pdf$/i, '').split('_');
  if (parts.length > 0 && /^[A-Z]/.test(parts[0])) {
    return [parts[0] + ' et al'];
  }
  return ['Author Unknown'];
}

function extractJournal(fileName: string): string | undefined {
  // Try to extract journal from filename
  const lower = fileName.toLowerCase();
  if (lower.includes('jama')) return 'JAMA';
  if (lower.includes('nejm')) return 'New England Journal of Medicine';
  if (lower.includes('lancet')) return 'The Lancet';
  return undefined;
}

function extractYear(fileName: string): number {
  // Try to extract year from filename
  const match = fileName.match(/20\d{2}/);
  return match ? parseInt(match[0]) : new Date().getFullYear();
}

function formatAuthors(authors: string[], style: CitationStyle): string {
  if (authors.length === 0) return 'Unknown';
  
  switch (style) {
    case 'vancouver':
    case 'ama':
      return authors.join(', ');
    case 'apa':
      if (authors.length === 1) return authors[0];
      if (authors.length === 2) return authors.join(' & ');
      return authors[0] + ', et al.';
    default:
      return authors.join(', ');
  }
}