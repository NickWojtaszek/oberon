// AI Mode Controller - Pilot/Co-Pilot Toggle

import { useState } from 'react';
import { Plane, Eye, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { AIMode, EditorState } from '../../types/aiMode';

interface AIModeControllerProps {
  editorState: EditorState;
  onModeChange: (mode: AIMode) => void;
  onSupervisionToggle: () => void;
  onLogicCheck: () => void;
  claimConflicts: number;
  isCheckingLogic: boolean;
}

export function AIModeController({ 
  editorState, 
  onModeChange, 
  onSupervisionToggle,
  onLogicCheck,
  claimConflicts,
  isCheckingLogic
}: AIModeControllerProps) {
  const isPilotMode = editorState.aiMode === 'pilot';

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-200">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Mode Toggle */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-600">AI MODE</span>
              <button
                onClick={() => onModeChange(isPilotMode ? 'co-pilot' : 'pilot')}
                className={`relative w-20 h-9 rounded-full transition-all duration-300 ${
                  isPilotMode 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                    : 'bg-slate-300'
                }`}
              >
                <div className={`absolute top-1 left-1 w-7 h-7 bg-white rounded-full transition-transform duration-300 flex items-center justify-center ${
                  isPilotMode ? 'translate-x-11' : 'translate-x-0'
                }`}>
                  {isPilotMode ? (
                    <Plane className="w-4 h-4 text-purple-600" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-600" />
                  )}
                </div>
              </button>
              <div className="flex flex-col">
                <span className={`text-sm font-medium ${isPilotMode ? 'text-purple-700' : 'text-slate-700'}`}>
                  {isPilotMode ? 'Pilot Mode' : 'Co-Pilot Mode'}
                </span>
                <span className="text-xs text-slate-500">
                  {isPilotMode ? 'AI generates drafts' : 'AI supervises and checks'}
                </span>
              </div>
            </div>

            {/* Supervision Indicator */}
            {!isPilotMode && editorState.supervisionActive && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-100 border border-green-300 rounded-lg">
                <div className="relative">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <div className="absolute inset-0 animate-ping">
                    <CheckCircle2 className="w-4 h-4 text-green-400 opacity-75" />
                  </div>
                </div>
                <span className="text-xs font-medium text-green-700">
                  Supervision Active
                </span>
              </div>
            )}

            {/* Claim Conflicts Badge */}
            {claimConflicts > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-100 border border-red-300 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-red-700">
                  {claimConflicts} Claim{claimConflicts !== 1 ? 's' : ''} Need Review
                </span>
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onLogicCheck}
              disabled={isCheckingLogic}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              {isCheckingLogic ? 'Checking...' : 'Run Logic Check'}
            </button>
          </div>
        </div>

        {/* Mode Description */}
        <div className="mt-3 p-3 bg-white/50 border border-purple-200 rounded-lg">
          <div className="text-xs text-slate-700">
            {isPilotMode ? (
              <>
                <strong>Pilot Mode:</strong> AI will generate draft paragraphs based on your Statistical Manifest. 
                Use the "Generate" button in each section to create content. You can then edit and refine the AI-generated text.
              </>
            ) : (
              <>
                <strong>Co-Pilot Mode:</strong> AI monitors your writing in real-time and highlights claims that contradict 
                the Statistical Manifest. Perfect for teaching students or ensuring accuracy when you want full control.
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
