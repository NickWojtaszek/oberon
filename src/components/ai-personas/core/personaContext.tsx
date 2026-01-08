import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { 
  PersonaManagerState, 
  PersonaState, 
  PersonaAction, 
  PersonaId, 
  StudyType,
  RegulatoryFramework,
  ValidationResult,
  ValidationContext
} from './personaTypes';
import { PERSONA_REGISTRY, getRequiredPersonasForStudyType } from './personaRegistry';
import { globalValidationEngine } from './validationEngine';

// Initial state
const initialState: PersonaManagerState = {
  personas: Object.entries(PERSONA_REGISTRY).reduce((acc, [id, config]) => {
    acc[id as PersonaId] = {
      personaId: id as PersonaId,
      active: config.defaultActive,
      isValidating: false,
      autoValidateEnabled: config.realTimeValidation,
      config
    };
    return acc;
  }, {} as Record<PersonaId, PersonaState>),
  regulatoryFrameworks: ['FDA', 'ICH-GCP'],
  globalValidationEnabled: true
};

// Reducer
function personaReducer(state: PersonaManagerState, action: PersonaAction): PersonaManagerState {
  switch (action.type) {
    case 'ACTIVATE_PERSONA':
      return {
        ...state,
        personas: {
          ...state.personas,
          [action.personaId]: {
            ...state.personas[action.personaId],
            active: true
          }
        }
      };

    case 'DEACTIVATE_PERSONA':
      // Check if persona is required for current study type
      const persona = state.personas[action.personaId];
      if (
        state.studyType &&
        persona.config.requiredForStudyTypes?.includes(state.studyType)
      ) {
        console.warn(
          `Cannot deactivate ${action.personaId} - required for ${state.studyType} studies`
        );
        return state;
      }

      return {
        ...state,
        personas: {
          ...state.personas,
          [action.personaId]: {
            ...state.personas[action.personaId],
            active: false
          }
        }
      };

    case 'SET_STUDY_TYPE':
      // Auto-activate required personas for this study type
      const requiredPersonas = getRequiredPersonasForStudyType(action.studyType);
      const updatedPersonas = { ...state.personas };

      requiredPersonas.forEach(config => {
        updatedPersonas[config.id] = {
          ...updatedPersonas[config.id],
          active: true
        };
      });

      return {
        ...state,
        studyType: action.studyType,
        personas: updatedPersonas
      };

    case 'ADD_REGULATORY_FRAMEWORK':
      if (state.regulatoryFrameworks.includes(action.framework)) {
        return state;
      }
      return {
        ...state,
        regulatoryFrameworks: [...state.regulatoryFrameworks, action.framework]
      };

    case 'REMOVE_REGULATORY_FRAMEWORK':
      return {
        ...state,
        regulatoryFrameworks: state.regulatoryFrameworks.filter(
          f => f !== action.framework
        )
      };

    case 'UPDATE_VALIDATION_RESULT':
      return {
        ...state,
        personas: {
          ...state.personas,
          [action.personaId]: {
            ...state.personas[action.personaId],
            lastValidation: action.result,
            isValidating: false
          }
        }
      };

    case 'START_VALIDATION':
      return {
        ...state,
        personas: {
          ...state.personas,
          [action.personaId]: {
            ...state.personas[action.personaId],
            isValidating: true
          }
        }
      };

    case 'TOGGLE_AUTO_VALIDATE':
      return {
        ...state,
        personas: {
          ...state.personas,
          [action.personaId]: {
            ...state.personas[action.personaId],
            autoValidateEnabled: !state.personas[action.personaId].autoValidateEnabled
          }
        }
      };

    case 'ENABLE_ALL_PERSONAS':
      return {
        ...state,
        personas: Object.entries(state.personas).reduce((acc, [id, persona]) => {
          acc[id as PersonaId] = { ...persona, active: true };
          return acc;
        }, {} as Record<PersonaId, PersonaState>)
      };

    case 'DISABLE_ALL_PERSONAS':
      // Keep required personas active
      return {
        ...state,
        personas: Object.entries(state.personas).reduce((acc, [id, persona]) => {
          const isRequired = state.studyType && 
            persona.config.requiredForStudyTypes?.includes(state.studyType);
          acc[id as PersonaId] = { 
            ...persona, 
            active: isRequired || false 
          };
          return acc;
        }, {} as Record<PersonaId, PersonaState>)
      };

    case 'RESET_PERSONAS':
      return initialState;

    default:
      return state;
  }
}

// Context
const PersonaContext = createContext<{
  state: PersonaManagerState;
  dispatch: React.Dispatch<PersonaAction>;
  activatePersona: (personaId: PersonaId) => void;
  deactivatePersona: (personaId: PersonaId) => void;
  validatePersona: (personaId: PersonaId, context: ValidationContext) => Promise<ValidationResult>;
  validateAllActive: (context: ValidationContext) => Promise<Record<PersonaId, ValidationResult>>;
  getActivePersonas: () => PersonaState[];
  getPersonaState: (personaId: PersonaId) => PersonaState | undefined;
} | undefined>(undefined);

// Provider
export function PersonaProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(personaReducer, initialState);

  // Validate a single persona
  const validatePersona = async (
    personaId: PersonaId,
    context: ValidationContext
  ): Promise<ValidationResult> => {
    dispatch({ type: 'START_VALIDATION', personaId });

    return new Promise((resolve) => {
      // Simulate async validation
      setTimeout(() => {
        const result = globalValidationEngine.validateForPersona(
          personaId,
          {
            ...context,
            studyDesign: {
              ...context.studyDesign,
              type: state.studyType || context.studyDesign?.type || 'rct'
            },
            regulatoryFrameworks: state.regulatoryFrameworks
          }
        );

        dispatch({ type: 'UPDATE_VALIDATION_RESULT', personaId, result });
        resolve(result);
      }, 100);
    });
  };

  // Validate all active personas
  const validateAllActive = async (
    context: ValidationContext
  ): Promise<Record<PersonaId, ValidationResult>> => {
    const activePersonas = Object.values(state.personas).filter(p => p.active);
    const results: Record<string, ValidationResult> = {};

    for (const persona of activePersonas) {
      results[persona.personaId] = await validatePersona(persona.personaId, context);
    }

    return results as Record<PersonaId, ValidationResult>;
  };

  // Get active personas
  const getActivePersonas = (): PersonaState[] => {
    return Object.values(state.personas).filter(p => p.active);
  };

  // Get specific persona state
  const getPersonaState = (personaId: PersonaId): PersonaState | undefined => {
    return state.personas[personaId];
  };

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('ai-personas-state');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.studyType) {
          dispatch({ type: 'SET_STUDY_TYPE', studyType: parsed.studyType });
        }
        if (parsed.regulatoryFrameworks) {
          parsed.regulatoryFrameworks.forEach((framework: RegulatoryFramework) => {
            dispatch({ type: 'ADD_REGULATORY_FRAMEWORK', framework });
          });
        }
      } catch (error) {
        console.error('Failed to load persona state:', error);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    const toSave = {
      studyType: state.studyType,
      regulatoryFrameworks: state.regulatoryFrameworks
    };
    localStorage.setItem('ai-personas-state', JSON.stringify(toSave));
  }, [state.studyType, state.regulatoryFrameworks]);

  return (
    <PersonaContext.Provider
      value={{
        state,
        dispatch,
        activatePersona: (personaId: PersonaId) => dispatch({ type: 'ACTIVATE_PERSONA', personaId }),
        deactivatePersona: (personaId: PersonaId) => dispatch({ type: 'DEACTIVATE_PERSONA', personaId }),
        validatePersona,
        validateAllActive,
        getActivePersonas,
        getPersonaState
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
}

// Hook
export function usePersonas() {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersonas must be used within PersonaProvider');
  }
  return context;
}

// Convenience hooks for specific personas
export function usePersona(personaId: PersonaId) {
  const { state, validatePersona, getPersonaState } = usePersonas();
  const personaState = getPersonaState(personaId);

  return {
    persona: personaState,
    isActive: personaState?.active || false,
    isValidating: personaState?.isValidating || false,
    lastValidation: personaState?.lastValidation,
    validate: (context: ValidationContext) => validatePersona(personaId, context)
  };
}

// Hook for study-type-specific personas
export function useStudyTypePersonas() {
  const { state, getActivePersonas } = usePersonas();
  
  return {
    studyType: state.studyType,
    activePersonas: getActivePersonas(),
    requiredPersonas: state.studyType 
      ? getRequiredPersonasForStudyType(state.studyType)
      : []
  };
}