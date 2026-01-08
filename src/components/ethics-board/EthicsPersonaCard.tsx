import { useState } from 'react';
import { 
  Scale,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Zap,
  Shield,
  BookOpen
} from 'lucide-react';
import { usePersonas } from '../ai-personas/core/personaContext';
import { getAllPersonas } from '../ai-personas/core/personaRegistry';

export function EthicsPersonaCard() {
  const { state } = usePersonas();
  const [isExpanded, setIsExpanded] = useState(true);

  // Get the ethics-compliance persona
  const allPersonas = getAllPersonas();
  const persona = allPersonas.find(p => p.id === 'ethics-compliance');
  
  if (!persona || !state.personas[persona.id]?.active) {
    return null;
  }

  const personaState = state.personas[persona.id];
  const validation = personaState?.lastValidation;

  // Get validation status
  const getValidationStatus = () => {
    if (!validation) {
      return { icon: Clock, color: 'slate', label: 'Not validated', score: null };
    }
    const score = validation.complianceScore;
    if (score >= 90) {
      return { icon: CheckCircle2, color: 'green', label: 'Excellent', score };
    }
    if (score >= 75) {
      return { icon: CheckCircle2, color: 'amber', label: 'Good', score };
    }
    if (score >= 50) {
      return { icon: AlertCircle, color: 'orange', label: 'Needs work', score };
    }
    return { icon: XCircle, color: 'red', label: 'Critical', score };
  };

  const status = getValidationStatus();
  const StatusIcon = status.icon;

  return (
    <div
      className={`rounded-lg border-2 transition-all ${
        isExpanded 
          ? `${persona.color.border} ${persona.color.bg}` 
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      {/* Persona Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left"
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isExpanded ? 'bg-white/50' : persona.color.bg
          }`}>
            <Scale className={`w-5 h-5 ${persona.color.icon}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="text-sm font-semibold text-slate-900">
                {persona.name}
              </h4>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
              )}
            </div>

            {/* Status Badge */}
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-${status.color}-100 text-${status.color}-700`}>
              <StatusIcon className="w-3 h-3" />
              {status.score !== null ? `${status.score}%` : status.label}
            </div>
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-slate-200">
          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed pt-4">
            {persona.description}
          </p>

          {/* Validation Details */}
          {validation && (
            <div className="bg-white/50 rounded-lg p-3 space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Validation Status
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-slate-500">Critical Issues</div>
                  <div className="text-lg font-semibold text-red-600">{validation.criticalCount}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Warnings</div>
                  <div className="text-lg font-semibold text-amber-600">{validation.warningCount}</div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <div className="text-xs text-slate-500">Last validated</div>
                <div className="text-xs text-slate-700 mt-1">
                  {new Date(validation.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Competencies */}
          {persona.sidebar?.sections && persona.sidebar.sections.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Key Competencies
              </div>
              <div className="space-y-2">
                {persona.sidebar.sections.map((section, idx) => {
                  // Get content (handle both static and dynamic)
                  const content = typeof section.content === 'function' 
                    ? section.content({}) 
                    : section.content;

                  if (!content || content.length === 0) return null;

                  return (
                    <div key={idx} className="bg-white/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        {section.type === 'guidance' && <Shield className="w-3.5 h-3.5 text-indigo-600" />}
                        {section.type === 'best-practices' && <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />}
                        {section.type === 'warnings' && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
                        {section.type === 'examples' && <BookOpen className="w-3.5 h-3.5 text-purple-600" />}
                        <div className="text-xs font-semibold text-slate-700">
                          {section.title}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        {content.slice(0, 3).map((item, itemIdx) => (
                          <div key={itemIdx} className="text-xs text-slate-600 leading-relaxed">
                            • {typeof item === 'string' ? item : String(item)}
                          </div>
                        ))}
                        {content.length > 3 && (
                          <div className="text-xs text-slate-400 italic">
                            +{content.length - 3} more competencies...
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Suggested Actions */}
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Suggested Actions
            </div>
            <div className="space-y-2">
              {persona.realTimeValidation && (
                <div className="flex items-start gap-2 text-xs text-slate-700 bg-white/50 rounded-lg p-3">
                  <Zap className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Real-time validation is active for this module</span>
                </div>
              )}
              {validation && validation.criticalCount > 0 && (
                <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Review {validation.criticalCount} critical issue{validation.criticalCount > 1 ? 's' : ''} immediately</span>
                </div>
              )}
              {validation && validation.warningCount > 0 && (
                <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Address {validation.warningCount} warning{validation.warningCount > 1 ? 's' : ''} before submission</span>
                </div>
              )}
              {(!validation || (validation.criticalCount === 0 && validation.warningCount === 0)) && (
                <div className="flex items-start gap-2 text-xs text-green-700 bg-green-50 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>All compliance checks passed - ready to proceed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
