import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import type { PersonaState } from '../core/personaTypes';

interface PersonaStatusBadgeProps {
  persona: PersonaState;
  style?: 'icon' | 'text' | 'score' | 'progress';
  size?: 'sm' | 'md' | 'lg';
}

export function PersonaStatusBadge({ 
  persona, 
  style = 'icon',
  size = 'md' 
}: PersonaStatusBadgeProps) {
  const validation = persona.lastValidation;
  const isValidating = persona.isValidating;

  // Size classes
  const sizeClasses = {
    sm: { icon: 'w-3 h-3', text: 'text-xs', badge: 'px-1.5 py-0.5' },
    md: { icon: 'w-4 h-4', text: 'text-sm', badge: 'px-2 py-1' },
    lg: { icon: 'w-5 h-5', text: 'text-base', badge: 'px-3 py-1.5' }
  };

  const classes = sizeClasses[size];

  // Loading state
  if (isValidating) {
    return (
      <div className={`flex items-center gap-1.5 ${classes.badge} bg-slate-100 rounded`}>
        <Loader2 className={`${classes.icon} animate-spin text-slate-600`} />
        {style !== 'icon' && (
          <span className={`${classes.text} text-slate-700 font-medium`}>
            Validating...
          </span>
        )}
      </div>
    );
  }

  // No validation yet
  if (!validation) {
    return style === 'icon' ? (
      <div className={`${classes.icon} rounded-full bg-slate-200`} />
    ) : null;
  }

  // Determine status
  const hasCritical = validation.criticalCount > 0;
  const hasWarning = validation.warningCount > 0;
  const isPerfect = validation.totalIssues === 0;

  // Icon style
  if (style === 'icon') {
    if (hasCritical) {
      return <XCircle className={`${classes.icon} text-red-600`} />;
    } else if (hasWarning) {
      return <AlertTriangle className={`${classes.icon} text-amber-600`} />;
    } else {
      return <CheckCircle className={`${classes.icon} text-green-600`} />;
    }
  }

  // Text style
  if (style === 'text') {
    if (hasCritical) {
      return (
        <span className={`${classes.text} font-medium text-red-700`}>
          {validation.criticalCount} Critical
        </span>
      );
    } else if (hasWarning) {
      return (
        <span className={`${classes.text} font-medium text-amber-700`}>
          {validation.warningCount} Warning{validation.warningCount > 1 ? 's' : ''}
        </span>
      );
    } else {
      return (
        <span className={`${classes.text} font-medium text-green-700`}>
          All Clear
        </span>
      );
    }
  }

  // Score style
  if (style === 'score') {
    const scoreColor = validation.complianceScore >= 90 ? 'text-green-700' :
                      validation.complianceScore >= 70 ? 'text-blue-700' :
                      validation.complianceScore >= 50 ? 'text-amber-700' : 'text-red-700';
    
    const bgColor = validation.complianceScore >= 90 ? 'bg-green-50' :
                   validation.complianceScore >= 70 ? 'bg-blue-50' :
                   validation.complianceScore >= 50 ? 'bg-amber-50' : 'bg-red-50';

    return (
      <div className={`${classes.badge} ${bgColor} rounded flex items-center gap-1.5`}>
        {hasCritical ? (
          <XCircle className={`${classes.icon} text-red-600`} />
        ) : hasWarning ? (
          <AlertTriangle className={`${classes.icon} text-amber-600`} />
        ) : (
          <CheckCircle className={`${classes.icon} text-green-600`} />
        )}
        <span className={`${classes.text} font-bold ${scoreColor}`}>
          {validation.complianceScore}
        </span>
        <span className={`${classes.text} ${scoreColor} opacity-70`}>/ 100</span>
      </div>
    );
  }

  // Progress style
  if (style === 'progress') {
    const totalChecks = validation.criticalCount + validation.warningCount + validation.infoCount;
    const passedChecks = totalChecks - validation.criticalCount - validation.warningCount;
    const percentage = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;

    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all ${
              hasCritical ? 'bg-red-500' : 
              hasWarning ? 'bg-amber-500' : 
              'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={`${classes.text} font-medium text-slate-700`}>
          {percentage}%
        </span>
      </div>
    );
  }

  return null;
}
