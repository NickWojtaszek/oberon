import { Target, Tag, Link } from 'lucide-react';
import type { SchemaBlock } from '../../types';

interface BlockBadgesProps {
  block: SchemaBlock;
}

export function BlockBadges({ block }: BlockBadgesProps) {
  const hasConditionalDependencies = block.conditionalDependencies && block.conditionalDependencies.length > 0;

  return (
    <div className="flex items-center gap-2">
      {/* Conditional Dependencies Badge */}
      {hasConditionalDependencies && (
        <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium border border-purple-200">
          <Link className="w-3 h-3" />
          {block.conditionalDependencies.length}
        </div>
      )}

      {/* Endpoint Tier Badge */}
      {block.endpointTier && (
        <div
          className={`px-2 py-1 rounded text-xs font-medium ${
            block.endpointTier === 'primary'
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : block.endpointTier === 'secondary'
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-purple-100 text-purple-700 border border-purple-200'
          }`}
        >
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            {block.endpointTier}
          </div>
        </div>
      )}

      {/* Version Tag */}
      {block.versionTag && (
        <div
          className={`px-2 py-1 rounded text-xs font-medium border ${
            block.versionColor === 'blue'
              ? 'bg-blue-100 text-blue-700 border-blue-200'
              : block.versionColor === 'green'
              ? 'bg-green-100 text-green-700 border-green-200'
              : block.versionColor === 'purple'
              ? 'bg-purple-100 text-purple-700 border-purple-200'
              : 'bg-amber-100 text-amber-700 border-amber-200'
          }`}
        >
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {block.versionTag}
          </div>
        </div>
      )}
    </div>
  );
}