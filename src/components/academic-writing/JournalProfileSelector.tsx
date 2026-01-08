// Journal Profile Selector - Target Journal Configuration (Phase 4)

import { useState } from 'react';
import { BookOpen, TrendingUp, CheckCircle2, AlertTriangle, Plus, Settings } from 'lucide-react';
import { JOURNAL_PROFILES, getJournalsByImpact } from '../../config/journalRules';
import type { JournalProfile } from '../../types/journalProfile';
import { CustomJournalDialog } from '../unified-workspace/CustomJournalDialog';
import { GenericJournalEditor } from '../unified-workspace/GenericJournalEditor';
import { getGenericJournal, updateGenericJournal } from '../../data/journalLibrary';
import type { JournalProfile as NewJournalProfile } from '../../types/accountability';

interface JournalProfileSelectorProps {
  selectedJournalId: string | null;
  onJournalChange: (journalId: string | null) => void;
  complianceScore?: number;
}

export function JournalProfileSelector({ 
  selectedJournalId, 
  onJournalChange,
  complianceScore
}: JournalProfileSelectorProps) {
  const sortedJournals = getJournalsByImpact();
  const selectedJournal = selectedJournalId ? JOURNAL_PROFILES[selectedJournalId] : null;
  
  // Dialog states
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [genericEditorOpen, setGenericEditorOpen] = useState(false);
  const [genericJournal, setGenericJournal] = useState<NewJournalProfile>(getGenericJournal());

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
          <BookOpen className="w-4 h-4" />
          Target Journal
        </label>
        {selectedJournal && complianceScore !== undefined && (
          <div className="flex items-center gap-1">
            {complianceScore >= 90 ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
            <span className={`text-xs font-medium ${
              complianceScore >= 90 ? 'text-green-600' : 'text-amber-600'
            }`}>
              {complianceScore}% Compliant
            </span>
          </div>
        )}
      </div>

      {/* Journal Dropdown */}
      <select
        value={selectedJournalId || ''}
        onChange={(e) => onJournalChange(e.target.value || null)}
        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">No journal selected (generic limits)</option>
        {sortedJournals.map(journal => (
          <option key={journal.id} value={journal.id}>
            {journal.name} ({journal.abbreviation}) 
            {journal.impactFactor ? ` - IF: ${journal.impactFactor}` : ''}
          </option>
        ))}
      </select>
      
      {/* Action Buttons - Always Visible */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setCustomDialogOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
          title="Create a custom journal profile"
        >
          <Plus className="w-4 h-4" />
          Create Custom
        </button>
        
        <button
          onClick={() => setGenericEditorOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors"
          title="Edit generic journal defaults"
        >
          <Settings className="w-4 h-4" />
          Edit Generic
        </button>
      </div>

      {/* Selected Journal Info */}
      {selectedJournal && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="text-sm font-medium text-blue-900">{selectedJournal.name}</div>
              <div className="text-xs text-blue-700 mt-0.5">{selectedJournal.specialty}</div>
            </div>
            {selectedJournal.impactFactor && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium">
                <TrendingUp className="w-3 h-3" />
                IF: {selectedJournal.impactFactor}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mt-3">
            <div>
              <div className="text-blue-600 font-medium mb-1">Word Limits</div>
              <div className="space-y-0.5 text-blue-700">
                <div>Abstract: {selectedJournal.wordLimits.abstract} words</div>
                <div>Total: {selectedJournal.wordLimits.totalMain || 'N/A'} words</div>
              </div>
            </div>
            <div>
              <div className="text-blue-600 font-medium mb-1">Constraints</div>
              <div className="space-y-0.5 text-blue-700">
                <div>Max Citations: {selectedJournal.citationLimit}</div>
                <div>Style: {selectedJournal.citationStyle.toUpperCase()}</div>
              </div>
            </div>
          </div>

          {selectedJournal.requiredSections.length > 0 && (
            <div className="mt-2 pt-2 border-t border-blue-200">
              <div className="text-xs text-blue-600 font-medium mb-1">Required Sections</div>
              <div className="flex flex-wrap gap-1">
                {selectedJournal.requiredSections.map(section => (
                  <span
                    key={section}
                    className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                  >
                    {section}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Journal Dialog */}
      <CustomJournalDialog
        isOpen={customDialogOpen}
        onClose={() => setCustomDialogOpen(false)}
        onSave={(journal) => {
          console.log('Custom journal created:', journal);
          alert(`Custom journal "${journal.name}" created! This will be fully integrated in the next update.`);
          setCustomDialogOpen(false);
        }}
      />
      
      {/* Generic Journal Editor */}
      <GenericJournalEditor
        isOpen={genericEditorOpen}
        onClose={() => setGenericEditorOpen(false)}
        currentConstraints={genericJournal.constraints}
        onSave={(constraints) => {
          const updated = updateGenericJournal(constraints);
          setGenericJournal(updated);
          alert('Generic journal defaults updated and saved!');
          setGenericEditorOpen(false);
        }}
      />
    </div>
  );
}