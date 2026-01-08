/**
 * Live Budget Tracker
 * Research Factory - Phase 4: Journal Constraints
 * 
 * Status bar that appears at the bottom of the Editor (Pane B)
 * Turns RED when user exceeds journal word count
 */

import { AlertTriangle, CheckCircle2, FileText, Image, Table } from 'lucide-react';
import type { ManuscriptBudget, BudgetStatus } from '../../types/accountability';

interface LiveBudgetTrackerProps {
  budget: ManuscriptBudget;
  currentSection?: string;
}

export function LiveBudgetTracker({ budget, currentSection }: LiveBudgetTrackerProps) {
  // Find current section budget
  const activeSectionBudget = currentSection 
    ? budget.sections.find(s => s.section === currentSection)
    : null;

  return (
    <div className="fixed bottom-0 left-60 right-0 h-12 bg-white border-t border-slate-200 z-20 shadow-lg">
      <div className="h-full flex items-center justify-between px-8">
        {/* Left: Current Section Status */}
        <div className="flex items-center gap-6">
          {activeSectionBudget ? (
            <div className="flex items-center gap-2">
              <FileText className={`w-4 h-4 ${
                activeSectionBudget.status === 'exceeded' ? 'text-red-600' :
                activeSectionBudget.status === 'warning' ? 'text-amber-600' :
                'text-green-600'
              }`} />
              <span className="text-sm font-medium text-slate-700">
                {activeSectionBudget.section}:
              </span>
              <span className={`text-sm font-semibold ${
                activeSectionBudget.status === 'exceeded' ? 'text-red-600' :
                activeSectionBudget.status === 'warning' ? 'text-amber-600' :
                'text-slate-900'
              }`}>
                {activeSectionBudget.current} / {activeSectionBudget.limit} words
              </span>
              <div className="flex items-center gap-1">
                {activeSectionBudget.status === 'exceeded' && (
                  <span className="text-xs text-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Over limit
                  </span>
                )}
                {activeSectionBudget.status === 'warning' && (
                  <span className="text-xs text-amber-600">
                    ({activeSectionBudget.percentage}%)
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500">
              Select a section to see budget
            </div>
          )}
        </div>

        {/* Center: Overall Status */}
        <div className="flex items-center gap-4">
          {/* References */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600">Refs:</span>
            <span className={`text-sm font-medium ${
              budget.references.status === 'exceeded' ? 'text-red-600' :
              budget.references.status === 'warning' ? 'text-amber-600' :
              'text-slate-700'
            }`}>
              {budget.references.current}/{budget.references.limit}
            </span>
          </div>

          {/* Figures */}
          <div className="flex items-center gap-2">
            <Image className="w-3 h-3 text-slate-400" />
            <span className={`text-sm font-medium ${
              budget.figures.status === 'exceeded' ? 'text-red-600' :
              budget.figures.status === 'warning' ? 'text-amber-600' :
              'text-slate-700'
            }`}>
              {budget.figures.current}/{budget.figures.limit}
            </span>
          </div>

          {/* Tables */}
          <div className="flex items-center gap-2">
            <Table className="w-3 h-3 text-slate-400" />
            <span className={`text-sm font-medium ${
              budget.tables.status === 'exceeded' ? 'text-red-600' :
              budget.tables.status === 'warning' ? 'text-amber-600' :
              'text-slate-700'
            }`}>
              {budget.tables.current}/{budget.tables.limit}
            </span>
          </div>
        </div>

        {/* Right: Compliance Badge */}
        <div className="flex items-center gap-2">
          {budget.overallCompliance ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">
                Compliant with {budget.journal}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-red-700">
                Exceeds {budget.journal} limits
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
