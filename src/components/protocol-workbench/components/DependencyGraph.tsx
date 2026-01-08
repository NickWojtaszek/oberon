import { GitBranch, ArrowRight, Eye, EyeOff, Lock, Ban, BookOpen, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import type { SchemaBlock } from '../types';
import { ContentContainer } from '../../ui/ContentContainer';
import { DependencyHelpSidebar } from './DependencyHelpSidebar';

interface DependencyGraphProps {
  schemaBlocks: SchemaBlock[];
  onSelectBlock?: (blockId: string) => void;
}

export function DependencyGraph({ schemaBlocks, onSelectBlock }: DependencyGraphProps) {
  // Get flat list of all blocks
  const flattenBlocks = (blocks: SchemaBlock[]): SchemaBlock[] => {
    const result: SchemaBlock[] = [];
    for (const b of blocks) {
      result.push(b);
      if (b.children) {
        result.push(...flattenBlocks(b.children));
      }
    }
    return result;
  };

  const allBlocks = flattenBlocks(schemaBlocks);

  // Get blocks with dependencies
  const blocksWithDependencies = allBlocks.filter(
    (block) => block.conditionalDependencies && block.conditionalDependencies.length > 0
  );

  // Get all unique blocks involved in dependencies
  const involvedBlockIds = new Set<string>();
  blocksWithDependencies.forEach((block) => {
    involvedBlockIds.add(block.id);
    block.conditionalDependencies?.forEach((dep) => {
      involvedBlockIds.add(dep.targetBlockId);
    });
  });

  const involvedBlocks = allBlocks.filter((b) => involvedBlockIds.has(b.id));

  const getBlockById = (id: string) => allBlocks.find((b) => b.id === id);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'show':
        return <Eye className="w-3 h-3" />;
      case 'hide':
        return <EyeOff className="w-3 h-3" />;
      case 'require':
        return <Lock className="w-3 h-3" />;
      case 'disable':
        return <Ban className="w-3 h-3" />;
      default:
        return <ArrowRight className="w-3 h-3" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'show':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'hide':
        return 'text-slate-600 bg-slate-50 border-slate-200';
      case 'require':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'disable':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  if (blocksWithDependencies.length === 0) {
    return (
      <div className="flex-1 flex bg-slate-50 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <GitBranch className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">No Dependencies Yet</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Create conditional dependencies between variables to see the dependency graph here.
              Click the link icon on any variable to add conditional logic.
            </p>
          </div>
        </div>

        {/* Right Sidebar - Permanent */}
        <div className="w-[400px] border-l border-slate-200 bg-white overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-slate-900">Dependency Guidance</h3>
            </div>
            
            <DependencyHelpSidebar isEmpty={true} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex bg-slate-50 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <ContentContainer>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Dependency Graph</h3>
            <p className="text-sm text-slate-600">
              Visual representation of conditional logic between variables
            </p>
          </div>

          <div className="space-y-6">
            {blocksWithDependencies.map((sourceBlock) => (
              <div
                key={sourceBlock.id}
                className="bg-white border-2 border-slate-200 rounded-lg p-5"
              >
                {/* Source Block */}
                <div
                  className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-blue-50 p-3 rounded-lg -m-3 mb-1 transition-colors"
                  onClick={() => onSelectBlock?.(sourceBlock.id)}
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <GitBranch className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{sourceBlock.variable.name}</div>
                    <div className="text-xs text-slate-500">
                      {sourceBlock.dataType} • {sourceBlock.conditionalDependencies?.length} rule
                      {sourceBlock.conditionalDependencies?.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    Source
                  </div>
                </div>

                {/* Dependencies */}
                <div className="ml-7 space-y-3 mt-4">
                  {sourceBlock.conditionalDependencies?.map((dep) => {
                    const targetBlock = getBlockById(dep.targetBlockId);
                    if (!targetBlock) return null;

                    return (
                      <div key={dep.id} className="flex items-start gap-3">
                        {/* Connector Line */}
                        <div className="flex flex-col items-center pt-2">
                          <div className="w-px h-4 bg-slate-300" />
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </div>

                        {/* Rule Card */}
                        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3">
                          {/* Condition */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                              If
                            </span>
                            <div className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700">
                              {dep.condition.operator.replace('-', ' ')}
                            </div>
                            {dep.condition.value && (
                              <div className="px-2 py-0.5 bg-purple-100 border border-purple-200 rounded text-xs font-medium text-purple-700">
                                "{dep.condition.value}"
                              </div>
                            )}
                          </div>

                          {/* Action + Target */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                              Then
                            </span>
                            <div
                              className={`flex items-center gap-1.5 px-2 py-0.5 border rounded text-xs font-medium ${getActionColor(
                                dep.action
                              )}`}
                            >
                              {getActionIcon(dep.action)}
                              {dep.action}
                            </div>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                            <div
                              className="px-2 py-0.5 bg-green-100 border border-green-200 rounded text-xs font-medium text-green-700 cursor-pointer hover:bg-green-200 transition-colors"
                              onClick={() => onSelectBlock?.(targetBlock.id)}
                            >
                              {targetBlock.variable.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Action Types</h4>
            <div className="grid grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded text-xs font-medium text-green-600">
                  <Eye className="w-3 h-3" />
                  Show
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-600">
                  <EyeOff className="w-3 h-3" />
                  Hide
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs font-medium text-blue-600">
                  <Lock className="w-3 h-3" />
                  Require
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 rounded text-xs font-medium text-red-600">
                  <Ban className="w-3 h-3" />
                  Disable
                </div>
              </div>
            </div>
          </div>
        </ContentContainer>
      </div>

      {/* Right Sidebar - Permanent */}
      <div className="w-[400px] border-l border-slate-200 bg-white overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-slate-900">Dependency Guidance</h3>
          </div>
          
          <DependencyHelpSidebar isEmpty={false} />
        </div>
      </div>
    </div>
  );
}