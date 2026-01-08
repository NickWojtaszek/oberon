import { usePersonas } from '../core/personaContext';
import { getPersonasForModule } from '../core/personaRegistry';
import { PersonaBadge } from './PersonaBadge';
import type { PersonaModule } from '../core/personaTypes';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface ActivePersonasBarProps {
  module: PersonaModule;
  compact?: boolean;
}

export function ActivePersonasBar({ module, compact = false }: ActivePersonasBarProps) {
  const { state } = usePersonas();
  
  // Get personas applicable to this module
  const modulePersonas = getPersonasForModule(module);
  
  // Filter to only active personas
  const activePersonas = modulePersonas.filter(persona => 
    state.personas[persona.id]?.active
  );

  if (activePersonas.length === 0) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {activePersonas.map(persona => (
          <PersonaBadge
            key={persona.id}
            personaId={persona.id}
            size="sm"
            showName={false}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-200">
      <div className="flex items-center gap-1.5 mr-2">
        <Sparkles className="w-4 h-4 text-purple-600" />
        <span className="text-xs font-semibold text-purple-900">Active AI Assistants:</span>
      </div>
      {activePersonas.map(persona => (
        <div key={persona.id} className="relative">
          <PersonaBadge
            personaId={persona.id}
            size="sm"
            showName={true}
          />
          {/* Active indicator pulse */}
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        </div>
      ))}
      <div className="ml-auto flex items-center gap-1.5 px-2 py-1 bg-green-100 rounded-full">
        <CheckCircle2 className="w-3 h-3 text-green-600" />
        <span className="text-xs font-medium text-green-700">{activePersonas.length} Active</span>
      </div>
    </div>
  );
}