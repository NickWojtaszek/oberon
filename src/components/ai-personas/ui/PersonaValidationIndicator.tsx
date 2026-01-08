import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { usePersonas } from '../core/personaContext';
import type { PersonaId } from '../core/personaTypes';

interface PersonaValidationIndicatorProps {
  personaId: PersonaId;
  compact?: boolean;
}

export function PersonaValidationIndicator({ personaId, compact = false }: PersonaValidationIndicatorProps) {
  const { state } = usePersonas();
  const personaState = state.personas[personaId];
  
  if (!personaState?.active) {
    return null; // Don't show indicator if persona is inactive
  }

  const validation = personaState.lastValidation;
  
  // No validation run yet
  if (!validation) {
    if (compact) {
      return (
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs">
          <Clock className="w-3 h-3" />
          <span>Not validated</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
        <Clock className="w-4 h-4 text-slate-600" />
        <div className="text-xs text-slate-600">Awaiting validation</div>
      </div>
    );
  }

  const score = validation.complianceScore;
  const hasIssues = validation.criticalCount > 0 || validation.warningCount > 0;
  
  // Get status based on score
  const getStatus = () => {
    if (score >= 90) return { icon: CheckCircle2, color: 'green', label: 'Excellent' };
    if (score >= 75) return { icon: CheckCircle2, color: 'amber', label: 'Good' };
    if (score >= 50) return { icon: AlertTriangle, color: 'orange', label: 'Needs Attention' };
    return { icon: XCircle, color: 'red', label: 'Critical Issues' };
  };
  
  const status = getStatus();
  const Icon = status.icon;
  
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded bg-${status.color}-50 text-${status.color}-700 text-xs font-medium`}>
        <Icon className="w-3 h-3" />
        <span>{score}%</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-${status.color}-50 border-2 border-${status.color}-200`}>
      <Icon className={`w-4 h-4 text-${status.color}-600`} />
      <div>
        <div className={`text-sm font-semibold text-${status.color}-900`}>
          {score}% - {status.label}
        </div>
        {hasIssues && (
          <div className={`text-xs text-${status.color}-700`}>
            {validation.criticalCount > 0 && `${validation.criticalCount} critical`}
            {validation.criticalCount > 0 && validation.warningCount > 0 && ', '}
            {validation.warningCount > 0 && `${validation.warningCount} warnings`}
          </div>
        )}
      </div>
    </div>
  );
}
