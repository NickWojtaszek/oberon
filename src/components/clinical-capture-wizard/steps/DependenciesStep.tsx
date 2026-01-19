/**
 * Dependencies Step
 * Visual display and management of field dependencies within wizard workflow
 * Uses the existing DependencyGraph component from Protocol Workbench
 */

import { useState } from 'react';
import { GitBranch, CheckCircle, AlertTriangle, ArrowRight, Info } from 'lucide-react';
import type { SchemaBlock } from '../../protocol-workbench/types';
import { DependencyGraph } from '../../protocol-workbench/components/DependencyGraph';

interface DependenciesStepProps {
  onComplete: () => void;
  onBack?: () => void;
  schemaBlocks: SchemaBlock[];
  onSelectBlock?: (blockId: string) => void;
}

export function DependenciesStep({
  onComplete,
  onBack,
  schemaBlocks,
  onSelectBlock
}: DependenciesStepProps) {
  // Count dependencies for summary
  const countDependencies = (blocks: SchemaBlock[]): number => {
    let count = 0;
    for (const block of blocks) {
      if (block.conditionalDependencies) {
        count += block.conditionalDependencies.length;
      }
      if (block.children) {
        count += countDependencies(block.children);
      }
    }
    return count;
  };

  const dependencyCount = countDependencies(schemaBlocks);
  const hasNoDependencies = dependencyCount === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <GitBranch className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Field Dependencies
            </h2>
            <p className="text-slate-600">
              Review the conditional logic between your schema fields. Dependencies control
              when fields are shown, hidden, required, or disabled based on other field values.
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{dependencyCount}</div>
            <div className="text-xs text-slate-600">
              {dependencyCount === 1 ? 'Dependency' : 'Dependencies'}
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      {hasNoDependencies && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">No Dependencies Configured</h3>
            <p className="text-sm text-amber-700 mt-1">
              Your schema doesn't have any conditional dependencies yet. This step is optional -
              you can add dependencies later in the Protocol Workbench, or continue without them.
            </p>
          </div>
        </div>
      )}

      {!hasNoDependencies && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800">Dependencies Overview</h3>
            <p className="text-sm text-blue-700 mt-1">
              Click on any variable to navigate to it in the Schema Builder.
              You can edit dependencies by returning to the previous step.
            </p>
          </div>
        </div>
      )}

      {/* Dependency Graph */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        <DependencyGraph
          schemaBlocks={schemaBlocks}
          onSelectBlock={onSelectBlock}
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 text-slate-600 hover:text-slate-900 font-medium transition-colors"
        >
          Back to Schema Builder
        </button>

        <div className="flex items-center gap-4">
          {hasNoDependencies && (
            <span className="text-sm text-slate-500 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Optional step - safe to continue
            </span>
          )}
          <button
            onClick={onComplete}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
