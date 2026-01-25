import { Target, Tag, Link, Sparkles, CheckCircle } from 'lucide-react';
import type { SchemaBlock, StatisticalRole } from '../../types';

// Statistical role display labels
const STATISTICAL_ROLE_LABELS: Record<StatisticalRole, string> = {
  primary_endpoint: 'Primary',
  secondary_endpoint: 'Secondary',
  safety_endpoint: 'Safety',
  baseline_covariate: 'Covariate',
  confounder: 'Confounder',
  subgroup_variable: 'Subgroup',
  treatment_indicator: 'Treatment',
  time_variable: 'Time',
  excluded: 'Excluded',
};

// Statistical role colors
const STATISTICAL_ROLE_COLORS: Record<StatisticalRole, { bg: string; text: string; border: string }> = {
  primary_endpoint: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  secondary_endpoint: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  safety_endpoint: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  baseline_covariate: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  confounder: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  subgroup_variable: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
  treatment_indicator: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  time_variable: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
  excluded: { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200' },
};

interface BlockBadgesProps {
  block: SchemaBlock;
}

export function BlockBadges({ block }: BlockBadgesProps) {
  const hasConditionalDependencies = block.conditionalDependencies && block.conditionalDependencies.length > 0;

  // AI Statistical Role (confirmed or suggested)
  const statisticalRole = block.statisticalRole || block.aiSuggestedRole;
  const isRoleConfirmed = block.roleConfirmed;

  return (
    <div className="flex items-center gap-2">
      {/* AI Statistical Role Badge */}
      {statisticalRole && statisticalRole !== 'excluded' && (
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${
            STATISTICAL_ROLE_COLORS[statisticalRole].bg
          } ${STATISTICAL_ROLE_COLORS[statisticalRole].text} ${
            STATISTICAL_ROLE_COLORS[statisticalRole].border
          } ${!isRoleConfirmed ? 'opacity-70' : ''}`}
          title={
            isRoleConfirmed
              ? `Statistical role: ${STATISTICAL_ROLE_LABELS[statisticalRole]} (confirmed)`
              : `AI suggests: ${STATISTICAL_ROLE_LABELS[statisticalRole]} (click to confirm)`
          }
        >
          {isRoleConfirmed ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          {STATISTICAL_ROLE_LABELS[statisticalRole]}
        </div>
      )}

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