import { Shield, Building2, TrendingUp, ShieldCheck, Scale, AlertTriangle, Target, FileEdit } from 'lucide-react';
import type { StudyType } from './ai-personas/core/personaTypes';
import { getPersonasForStudyType, getRequiredPersonasForStudyType } from './ai-personas/core/personaRegistry';

interface PersonaAssignmentDisplayProps {
  studyType: StudyType | string;
  compact?: boolean;
}

const PERSONA_ICONS: Record<string, any> = {
  'protocol-auditor': Shield,
  'schema-architect': Building2,
  'statistical-advisor': TrendingUp,
  'data-quality-sentinel': ShieldCheck,
  'ethics-compliance': Scale,
  'safety-vigilance': AlertTriangle,
  'endpoint-validator': Target,
  'amendment-advisor': FileEdit,
};

export function PersonaAssignmentDisplay({ studyType, compact = false }: PersonaAssignmentDisplayProps) {
  const applicablePersonas = getPersonasForStudyType(studyType);
  const requiredPersonas = getRequiredPersonasForStudyType(studyType);
  const requiredIds = new Set(requiredPersonas.map(p => p.id));

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {applicablePersonas.map((persona) => {
          const Icon = PERSONA_ICONS[persona.id];
          const isRequired = requiredIds.has(persona.id);
          
          return (
            <div
              key={persona.id}
              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${persona.color.bg} ${persona.color.text}`}
            >
              {Icon && <Icon className="w-3 h-3" />}
              <span>{persona.name}</span>
              {isRequired && (
                <span className="text-[10px] font-bold bg-white/60 px-1 rounded">REQUIRED</span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Shield className="w-4 h-4" />
        <span className="font-medium">AI Personas Active for This Study Type</span>
      </div>
      
      <div className="grid gap-2">
        {applicablePersonas.map((persona) => {
          const Icon = PERSONA_ICONS[persona.id];
          const isRequired = requiredIds.has(persona.id);
          
          return (
            <div
              key={persona.id}
              className={`flex items-start gap-3 p-3 rounded-lg border-2 ${
                isRequired 
                  ? `${persona.color.border} ${persona.color.bg}` 
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isRequired ? persona.color.icon.replace('text-', 'bg-') : 'bg-slate-200'
              }`}>
                {Icon && <Icon className={`w-4 h-4 ${
                  isRequired ? 'text-white' : 'text-slate-600'
                }`} />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`text-sm font-medium ${
                    isRequired ? persona.color.text : 'text-slate-900'
                  }`}>
                    {persona.name}
                  </h4>
                  {isRequired && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                      REQUIRED
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-slate-600 mb-1">
                  {persona.description}
                </p>
                
                {persona.studyTypeDescription && (
                  <p className="text-xs text-slate-500 italic">
                    {persona.studyTypeDescription}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {persona.modules.map((module) => (
                    <span
                      key={module}
                      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-white/60 text-slate-600"
                    >
                      {module.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-900">
          <strong>Note:</strong> Required personas cannot be deactivated. They ensure regulatory compliance and data integrity for your study type.
        </p>
      </div>
    </div>
  );
}
