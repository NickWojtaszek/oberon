import { User, Target, Zap, CheckCircle2 } from 'lucide-react';
import type { StatisticianPersonaTemplate } from '../../../types/studyDesigns';

interface StatisticianPreviewProps {
  template: StatisticianPersonaTemplate;
}

export function StatisticianPreview({ template }: StatisticianPreviewProps) {
  // Focus color mapping
  const focusColors: Record<string, { bg: string; text: string; border: string }> = {
    'bias-reduction': {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    'descriptive-depth': {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
    },
    'temporal-analysis': {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    'measurement-precision': {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
    },
    'narrative-synthesis': {
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-200',
    },
  };

  const colors = focusColors[template.focus] || focusColors['narrative-synthesis'];

  return (
    <div className="border-2 border-slate-200 rounded-lg bg-white overflow-hidden">
      {/* Header */}
      <div className={`p-4 ${colors.bg} border-b-2 ${colors.border}`}>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
            <User className={`w-6 h-6 ${colors.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 mb-1">
              Statistician Persona
            </h3>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 ${colors.bg} ${colors.text} text-xs font-semibold rounded border ${colors.border}`}>
                {template.role}
              </span>
              <span className="text-xs text-slate-600">
                Auto-assigned to your project
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Profile */}
        <div>
          <div className="font-medium text-slate-900 mb-1">{template.name}</div>
          <p className="text-sm text-slate-600">{template.description}</p>
        </div>

        {/* Locked Focus */}
        <div className={`p-3 ${colors.bg} border ${colors.border} rounded-lg`}>
          <div className="flex items-center gap-2 mb-2">
            <Target className={`w-4 h-4 ${colors.text}`} />
            <span className={`text-sm font-semibold ${colors.text}`}>
              Locked Focus
            </span>
          </div>
          <div className="text-sm font-medium text-slate-900">
            {template.focus
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </div>
        </div>

        {/* Key Responsibilities */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-semibold text-slate-700">
              Key Responsibilities
            </span>
          </div>
          <ul className="space-y-1.5">
            {template.keyResponsibilities.slice(0, 3).map((responsibility, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{responsibility}</span>
              </li>
            ))}
          </ul>
          {template.keyResponsibilities.length > 3 && (
            <p className="text-xs text-slate-500 mt-2">
              +{template.keyResponsibilities.length - 3} more responsibilities
            </p>
          )}
        </div>

        {/* Recommended Analyses */}
        <div>
          <div className="text-sm font-semibold text-slate-700 mb-2">
            Recommended Analyses
          </div>
          <div className="flex flex-wrap gap-1.5">
            {template.recommendedAnalyses.slice(0, 3).map((analysis, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded"
              >
                {analysis}
              </span>
            ))}
            {template.recommendedAnalyses.length > 3 && (
              <span className="px-2 py-1 bg-slate-50 text-slate-500 text-xs rounded">
                +{template.recommendedAnalyses.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
        <p className="text-xs text-slate-600">
          This persona will be automatically created and assigned to your project when
          you click "Create Project"
        </p>
      </div>
    </div>
  );
}
