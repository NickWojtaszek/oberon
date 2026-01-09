import { 
  Scan, Blocks, Sigma, Radar, Scale, ShieldAlert, Target, FileDiff, Feather, SearchX,
  Sparkles,
  CheckCircle,
  XCircle,
  AlertCircle as AlertCircleIcon,
  Info
} from 'lucide-react';
import type { PersonaId, PersonaState, ValidationResult } from '../core/personaTypes';

// Icon mapping - function-specific icons
const PERSONA_ICONS: Record<PersonaId, any> = {
  'protocol-auditor': Scan,
  'schema-architect': Blocks,
  'statistical-advisor': Sigma,
  'data-quality-sentinel': Radar,
  'ethics-compliance': Scale,
  'safety-vigilance': ShieldAlert,
  'endpoint-validator': Target,
  'amendment-advisor': FileDiff,
  'academic-writing-coach': Feather,
  'manuscript-reviewer': SearchX,
};

interface PersonaSidebarProps {
  persona: PersonaState;
  validationResult?: ValidationResult;
  children?: React.ReactNode;
  onViewFullReport?: () => void;
}

export function PersonaSidebar({ 
  persona, 
  validationResult,
  children,
  onViewFullReport 
}: PersonaSidebarProps) {
  const Icon = PERSONA_ICONS[persona.personaId];
  const config = persona.config;

  if (!config.sidebar?.enabled) {
    return null;
  }

  const getStatusIcon = () => {
    if (!validationResult) return null;
    
    if (validationResult.criticalCount > 0) {
      return <XCircle className="w-4 h-4 text-red-600" />;
    } else if (validationResult.warningCount > 0) {
      return <AlertCircleIcon className="w-4 h-4 text-amber-600" />;
    } else {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
  };

  const getStatusText = () => {
    if (!validationResult) return 'Not validated';
    
    if (validationResult.criticalCount > 0) {
      return `${validationResult.criticalCount} critical issue${validationResult.criticalCount > 1 ? 's' : ''}`;
    } else if (validationResult.warningCount > 0) {
      return `${validationResult.warningCount} warning${validationResult.warningCount > 1 ? 's' : ''}`;
    } else {
      return 'All checks passed';
    }
  };

  return (
    <div className="space-y-6">
      {/* Persona Header */}
      <div className={`${config.color.bg} rounded-lg p-4 border ${config.color.border}`}>
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`w-5 h-5 ${config.color.icon}`} />
          <h3 className={`font-semibold ${config.color.text}`}>
            {config.sidebar.title}
          </h3>
          <Sparkles className="w-4 h-4 text-purple-500 ml-auto" />
        </div>

        {/* Description */}
        <p className={`text-xs ${config.color.text} opacity-80 leading-relaxed mb-3`}>
          {config.description}
        </p>

        {/* Validation Status */}
        {config.sidebar.showValidationStatus && validationResult && (
          <div className="pt-3 border-t border-current border-opacity-20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium opacity-80">Status:</span>
              <div className="flex items-center gap-1.5">
                {getStatusIcon()}
                <span className="text-xs font-medium">{getStatusText()}</span>
              </div>
            </div>

            {/* Compliance Score */}
            {validationResult.complianceScore !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium opacity-80">Score:</span>
                <span className="text-sm font-bold">
                  {validationResult.complianceScore}/100
                </span>
              </div>
            )}
          </div>
        )}

        {/* View Full Report Link */}
        {onViewFullReport && (
          <button
            onClick={onViewFullReport}
            className={`mt-3 pt-3 border-t border-current border-opacity-20 w-full text-left text-xs font-medium ${config.color.text} hover:opacity-100 opacity-80 transition-opacity flex items-center gap-1`}
          >
            <Shield className="w-3 h-3" />
            View full report →
          </button>
        )}
      </div>

      {/* Sidebar Sections */}
      {config.sidebar.sections && config.sidebar.sections.length > 0 && (
        <div className="space-y-4">
          {config.sidebar.sections.map((section, idx) => {
            const SectionIcon = getSectionIcon(section.type);
            const sectionColor = getSectionColor(section.type);

            // Get content (can be static or dynamic)
            const content = typeof section.content === 'function' 
              ? section.content({}) // TODO: Pass actual context
              : section.content;

            if (content.length === 0) return null;

            return (
              <div
                key={section.id || idx}
                className={`${sectionColor.bg} rounded-lg p-4 border ${sectionColor.border}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <SectionIcon className={`w-4 h-4 ${sectionColor.icon}`} />
                  <h4 className={`text-sm font-medium ${sectionColor.title}`}>
                    {section.title}
                  </h4>
                </div>

                <div className="space-y-2">
                  {content.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className={`text-xs ${sectionColor.text} leading-relaxed`}
                    >
                      {section.type === 'checklist' ? (
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input type="checkbox" className="mt-0.5" />
                          <span>{item}</span>
                        </label>
                      ) : (
                        <p>{item}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Custom Content */}
      {children}
    </div>
  );
}

// Helper functions
function getSectionIcon(type: string) {
  switch (type) {
    case 'guidance':
      return Shield;
    case 'examples':
      return Sparkles;
    case 'best-practices':
      return CheckCircle;
    case 'warnings':
      return AlertCircleIcon;
    case 'checklist':
      return CheckCircle;
    default:
      return Info;
  }
}

function getSectionColor(type: string) {
  switch (type) {
    case 'guidance':
      return {
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        icon: 'text-indigo-600',
        title: 'text-indigo-900',
        text: 'text-indigo-700'
      };
    case 'examples':
      return {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        title: 'text-purple-900',
        text: 'text-purple-700'
      };
    case 'best-practices':
      return {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: 'text-emerald-600',
        title: 'text-emerald-900',
        text: 'text-emerald-700'
      };
    case 'warnings':
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: 'text-amber-600',
        title: 'text-amber-900',
        text: 'text-amber-700'
      };
    case 'checklist':
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        title: 'text-blue-900',
        text: 'text-blue-700'
      };
    default:
      return {
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        icon: 'text-slate-600',
        title: 'text-slate-900',
        text: 'text-slate-700'
      };
  }
}
