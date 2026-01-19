import { useState, useEffect } from 'react';
import { Lock, Info, AlertTriangle, X, Shield, BookOpen, MessageSquare, Target, Link2, CheckCircle2, BarChart3, FileText, GraduationCap, MessageCircleQuestion, Command, Plus, Star, Search, ExternalLink, TrendingUp, Copy, ArrowRight, Sparkles, User, Brain, Type } from 'lucide-react';
import { LivePreviewPanel } from './LivePreviewPanel';
import { storage } from '../utils/storageService';
import type { UserPersona } from '../types/shared';
import { ContentContainer } from './ui/ContentContainer';
import { useTranslation } from 'react-i18next';
import { SIDEBAR_WIDTH } from '../lib/uiConstants';

type TabType = 'identity' | 'interpretation' | 'language' | 'outcome' | 'citation' | 'validation';
type UserRole = 'CONTRIBUTOR' | 'LEAD_SCIENTIST' | 'ADMIN';

interface InferenceType {
  id: string;
  title: string;
  description: string;
  allowed: boolean;
  disallowed: boolean;
}

export function PersonaEditor() {
  const { t } = useTranslation('personas');
  const [activeTab, setActiveTab] = useState<TabType>('identity');
  const [isLocked, setIsLocked] = useState(false);
  const [lockedAt, setLockedAt] = useState<string | null>(null);
  const [showLockModal, setShowLockModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [personaName, setPersonaName] = useState('');
  const [nameError, setNameError] = useState('');
  const [showNamingAssistant, setShowNamingAssistant] = useState(false);
  const [suggestedNames, setSuggestedNames] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<UserRole>('LEAD_SCIENTIST'); // Mock role - in production from auth
  
  // Right panel state
  const [rightPanelTab, setRightPanelTab] = useState<'role' | 'guidance'>('role');
  
  // Helper to get role translation key
  const getRoleKey = (role: UserRole): string => {
    switch (role) {
      case 'CONTRIBUTOR': return 'contributor';
      case 'LEAD_SCIENTIST': return 'leadScientist';
      case 'ADMIN': return 'admin';
    }
  };
  const [selectedPersonaType, setSelectedPersonaType] = useState('analysis');
  const [therapeuticArea, setTherapeuticArea] = useState('Oncology');
  const [studyPhase, setStudyPhase] = useState('Phase III');
  
  // NEW: Persona management state
  const [savedPersonas, setSavedPersonas] = useState<UserPersona[]>([]);
  const [currentPersonaId, setCurrentPersonaId] = useState<string | null>(null);
  const [isNewPersona, setIsNewPersona] = useState(true);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [showPersonaSelector, setShowPersonaSelector] = useState(false);
  
  // Language Controls state
  const [selectedTone, setSelectedTone] = useState('socratic');
  const [confidenceLevel, setConfidenceLevel] = useState(2); // 1-5 scale, default at 2 (conservative)
  const [neverWriteFullSections, setNeverWriteFullSections] = useState(true);
  const [forbiddenAnthropomorphism, setForbiddenAnthropomorphism] = useState(true);
  const [jargonLevel, setJargonLevel] = useState('peer-review'); // 'peer-review' or 'layperson'
  const [forbiddenPhrases, setForbiddenPhrases] = useState(['Statistically significant', 'Cured', 'Proven treatment']);
  const [newPhrase, setNewPhrase] = useState('');
  
  // Outcome Focus state
  const [primaryEndpoint, setPrimaryEndpoint] = useState('Overall Response Rate (ORR)');
  const [endpointDataType, setEndpointDataType] = useState('Binary');
  const [statisticalGoal, setStatisticalGoal] = useState('superiority');
  const [successThreshold, setSuccessThreshold] = useState('25');
  const [requireCitation, setRequireCitation] = useState(true);
  const [enforceConservativeLanguage, setEnforceConservativeLanguage] = useState(true);
  const [requirePeerReviewed, setRequirePeerReviewed] = useState(true);
  const [prohibitClinicalRecs, setProhibitClinicalRecs] = useState(true);
  
  // Citation Policy state
  const [strictnessLevel, setStrictnessLevel] = useState('strict'); // 'strict', 'balanced', 'exploratory'
  const [requireSourceForClaim, setRequireSourceForClaim] = useState(true);
  const [allowHeuristic, setAllowHeuristic] = useState(false);
  const [maxUncitedSentences, setMaxUncitedSentences] = useState(0);
  const [citationFormat, setCitationFormat] = useState('vancouver');
  const [sourceTypes, setSourceTypes] = useState({
    protocol: true,
    benchmarks: true,
    guidelines: true,
    peerReviewed: true,
  });
  const [knowledgeBaseScope, setKnowledgeBaseScope] = useState('current-project');
  const [citationStrength, setCitationStrength] = useState(4); // 1-5 scale, 1=relaxed, 5=strict
  
  // Validation state
  const [testPrompt, setTestPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [showRuleTrace, setShowRuleTrace] = useState(false);
  const [triggeredRules, setTriggeredRules] = useState<string[]>([]);
  const [showLockConfirmation, setShowLockConfirmation] = useState(false);
  
  // Load personas and current project on mount
  useEffect(() => {
    const projectId = storage.projects.getCurrentId();
    setCurrentProjectId(projectId);
    
    if (projectId) {
      const personas = storage.personas.getAll(projectId);
      setSavedPersonas(personas);
    }
  }, []);
  
  // Load persona data when switching personas
  const loadPersona = (persona: UserPersona) => {
    setCurrentPersonaId(persona.id);
    setIsNewPersona(false);
    setPersonaName(persona.name);
    setIsLocked(true); // Saved personas are locked
    setLockedAt(typeof persona.modifiedAt === 'string' ? persona.modifiedAt : persona.modifiedAt.toISOString());
    
    // Load preferences (all the configuration)
    const prefs = persona.preferences;
    if (prefs.selectedPersonaType) setSelectedPersonaType(prefs.selectedPersonaType);
    if (prefs.therapeuticArea) setTherapeuticArea(prefs.therapeuticArea);
    if (prefs.studyPhase) setStudyPhase(prefs.studyPhase);
    if (prefs.selectedTone) setSelectedTone(prefs.selectedTone);
    if (prefs.confidenceLevel) setConfidenceLevel(prefs.confidenceLevel);
    if (prefs.neverWriteFullSections !== undefined) setNeverWriteFullSections(prefs.neverWriteFullSections);
    if (prefs.forbiddenAnthropomorphism !== undefined) setForbiddenAnthropomorphism(prefs.forbiddenAnthropomorphism);
    if (prefs.jargonLevel) setJargonLevel(prefs.jargonLevel);
    if (prefs.forbiddenPhrases) setForbiddenPhrases(prefs.forbiddenPhrases);
    if (prefs.primaryEndpoint) setPrimaryEndpoint(prefs.primaryEndpoint);
    if (prefs.endpointDataType) setEndpointDataType(prefs.endpointDataType);
    if (prefs.statisticalGoal) setStatisticalGoal(prefs.statisticalGoal);
    if (prefs.successThreshold) setSuccessThreshold(prefs.successThreshold);
    if (prefs.requireCitation !== undefined) setRequireCitation(prefs.requireCitation);
    if (prefs.enforceConservativeLanguage !== undefined) setEnforceConservativeLanguage(prefs.enforceConservativeLanguage);
    if (prefs.requirePeerReviewed !== undefined) setRequirePeerReviewed(prefs.requirePeerReviewed);
    if (prefs.prohibitClinicalRecs !== undefined) setProhibitClinicalRecs(prefs.prohibitClinicalRecs);
    if (prefs.strictnessLevel) setStrictnessLevel(prefs.strictnessLevel);
    if (prefs.requireSourceForClaim !== undefined) setRequireSourceForClaim(prefs.requireSourceForClaim);
    if (prefs.allowHeuristic !== undefined) setAllowHeuristic(prefs.allowHeuristic);
    if (prefs.maxUncitedSentences !== undefined) setMaxUncitedSentences(prefs.maxUncitedSentences);
    if (prefs.citationFormat) setCitationFormat(prefs.citationFormat);
    if (prefs.sourceTypes) setSourceTypes(prefs.sourceTypes);
    if (prefs.knowledgeBaseScope) setKnowledgeBaseScope(prefs.knowledgeBaseScope);
    if (prefs.citationStrength) setCitationStrength(prefs.citationStrength);
    if (prefs.inferenceTypes) setInferenceTypes(prefs.inferenceTypes);
  };
  
  // Create new persona
  const createNewPersona = () => {
    setCurrentPersonaId(null);
    setIsNewPersona(true);
    setIsLocked(false);
    setLockedAt(null);
    setPersonaName('');
    // Reset to defaults
    setSelectedPersonaType('analysis');
    setTherapeuticArea('Oncology');
    setStudyPhase('Phase III');
    setShowPersonaSelector(false);
  };
  
  // Check if persona name is unique
  const isPersonaNameUnique = (name: string): boolean => {
    return !savedPersonas.some(p => 
      p.name.toLowerCase() === name.toLowerCase() && p.id !== currentPersonaId
    );
  };
  
  const [inferenceTypes, setInferenceTypes] = useState<InferenceType[]>([
    {
      id: 'benchmark',
      title: 'Benchmark Comparison',
      description: 'Compare results against pre-specified benchmarks or historical data',
      allowed: true,
      disallowed: false,
    },
    {
      id: 'trend',
      title: 'Descriptive Trend Analysis',
      description: 'Identify patterns and trends in the data without causal interpretation',
      allowed: true,
      disallowed: false,
    },
    {
      id: 'deviation',
      title: 'Protocol Deviation Highlighting',
      description: 'Flag potential deviations from the protocol or analysis plan',
      allowed: false,
      disallowed: false,
    },
    {
      id: 'statistical',
      title: 'Statistical Method Suggestions',
      description: 'Recommend appropriate statistical methods based on data characteristics',
      allowed: false,
      disallowed: false,
    },
  ]);

  const [disallowedTypes, setDisallowedTypes] = useState<InferenceType[]>([
    {
      id: 'efficacy',
      title: 'Efficacy Claims',
      description: 'Making definitive statements about treatment effectiveness',
      allowed: false,
      disallowed: true,
    },
    {
      id: 'safety',
      title: 'Safety Conclusions',
      description: 'Drawing conclusions about safety profiles or adverse events',
      allowed: false,
      disallowed: true,
    },
    {
      id: 'clinical',
      title: 'Clinical Recommendations',
      description: 'Providing clinical guidance or treatment recommendations',
      allowed: false,
      disallowed: true,
    },
    {
      id: 'causal',
      title: 'Causal Inference',
      description: 'Making causal claims about relationships between variables',
      allowed: false,
      disallowed: false,
    },
  ]);

  const toggleAllowed = (id: string) => {
    setInferenceTypes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, allowed: !item.allowed } : item
      )
    );
  };

  const toggleDisallowed = (id: string) => {
    setDisallowedTypes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, disallowed: !item.disallowed } : item
      )
    );
  };

  const hasNoDisallowed = !disallowedTypes.some((item) => item.disallowed);
  const hasConflict = false;

  const addForbiddenPhrase = () => {
    if (newPhrase.trim() && !forbiddenPhrases.includes(newPhrase.trim())) {
      setForbiddenPhrases([...forbiddenPhrases, newPhrase.trim()]);
      setNewPhrase('');
    }
  };

  const removeForbiddenPhrase = (phrase: string) => {
    setForbiddenPhrases(forbiddenPhrases.filter(p => p !== phrase));
  };

  const getConfidenceLevelLabel = () => {
    const labels = ['Highly Conservative', 'Conservative', 'Moderate', 'Exploratory', 'Highly Exploratory'];
    return labels[confidenceLevel - 1];
  };

  const getPreviewText = () => {
    if (confidenceLevel <= 2) {
      return "The data suggests a possible 20% improvement in the treatment arm, which may indicate a positive trend worthy of further investigation.";
    } else if (confidenceLevel === 3) {
      return "The data shows a 20% improvement in the treatment arm, indicating a positive outcome.";
    } else {
      return "The data demonstrates a significant 20% improvement in the treatment arm, proving treatment effectiveness.";
    }
  };

  const handleStrictnessLevelChange = (level: string) => {
    setStrictnessLevel(level);
    if (level === 'strict') {
      setRequireSourceForClaim(true);
      setAllowHeuristic(false);
      setMaxUncitedSentences(0);
    } else if (level === 'balanced') {
      setRequireSourceForClaim(true);
      setAllowHeuristic(false);
      setMaxUncitedSentences(2);
    } else if (level === 'exploratory') {
      setRequireSourceForClaim(false);
      setAllowHeuristic(true);
      setMaxUncitedSentences(5);
    }
  };

  const toggleSourceType = (type: keyof typeof sourceTypes) => {
    setSourceTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const getCitationStrengthLabel = () => {
    if (citationStrength <= 2) {
      return 'Relaxed - Allows general clinical heuristics';
    } else if (citationStrength === 3) {
      return 'Moderate - Balanced approach';
    } else {
      return 'Strict - Requires high-confidence match (>0.8 similarity)';
    }
  };

  const getCitationStrengthColor = () => {
    if (citationStrength <= 2) return 'text-amber-600';
    if (citationStrength === 3) return 'text-blue-600';
    return 'text-green-600';
  };

  // Validation checks
  const getValidationChecks = () => {
    return [
      {
        id: 'disallowed-inference',
        label: 'At least one disallowed inference type selected',
        status: disallowedTypes.some(item => item.disallowed) ? 'pass' : 'fail',
        message: disallowedTypes.some(item => item.disallowed) 
          ? 'Regulatory requirement met' 
          : 'Required for regulatory compliance',
      },
      {
        id: 'primary-outcome',
        label: 'Primary endpoint defined',
        status: primaryEndpoint ? 'pass' : 'fail',
        message: primaryEndpoint 
          ? `Set to: ${primaryEndpoint}` 
          : 'Define in Outcome Focus tab',
      },
      {
        id: 'citation-policy',
        label: 'Citation policy configured',
        status: requireSourceForClaim ? 'pass' : 'warning',
        message: requireSourceForClaim 
          ? 'Mandatory evidence enabled' 
          : 'Consider enabling mandatory evidence',
      },
      {
        id: 'language-controls',
        label: 'Language controls set',
        status: selectedTone ? 'pass' : 'fail',
        message: `Tone: ${selectedTone}, Confidence: ${getConfidenceLevelLabel()}`,
      },
      {
        id: 'benchmarks',
        label: 'Benchmark sources configured',
        status: Object.values(sourceTypes).some(v => v) ? 'pass' : 'warning',
        message: Object.values(sourceTypes).some(v => v)
          ? `${Object.values(sourceTypes).filter(v => v).length} source types enabled`
          : 'No custom benchmarks added; AI will use global library only',
      },
    ];
  };

  const allChecksPassed = () => {
    const checks = getValidationChecks();
    return checks.every(check => check.status === 'pass' || check.status === 'warning');
  };

  const hasCriticalFailures = () => {
    const checks = getValidationChecks();
    return checks.some(check => check.status === 'fail');
  };

  const runTestPrompt = () => {
    // Simulate AI response
    setTriggeredRules([]);
    const rules: string[] = [];
    
    let response = "Based on the clinical data provided";
    
    if (requireSourceForClaim) {
      response += " [1]";
      rules.push('Mandatory Evidence: Citation required');
    }
    
    response += ", the overall response rate suggests";
    
    if (confidenceLevel <= 2) {
      response += " a possible trend";
      rules.push('Conservative Language: Using hedging words');
    } else {
      response += " a significant finding";
    }
    
    if (forbiddenPhrases.some(phrase => phrase.toLowerCase().includes('significant'))) {
      response = response.replace('significant', 'notable');
      rules.push('Forbidden Phrase: Replaced "significant"');
    }
    
    if (disallowedTypes.find(t => t.id === 'clinical' && t.disallowed)) {
      response += ". Further human review is recommended before drawing clinical conclusions.";
      rules.push('Disallowed Inference: Blocked clinical recommendations');
    }
    
    if (requireSourceForClaim) {
      response += "\n\nReferences:\n[1] Smith et al. (2023) J Clin Oncol.";
    }
    
    setAiResponse(response);
    setTriggeredRules(rules);
    setShowRuleTrace(true);
  };

  const validatePersonaName = (): boolean => {
    // Contributors can use informal names, but still need something
    if (userRole === 'CONTRIBUTOR') {
      if (!personaName || personaName.trim().length === 0) {
        setNameError('Name required (informal names like "Draft 1" are okay for Contributors).');
        return false;
      }
      setNameError('');
      return true;
    }
    
    // Lead Scientists and Admins must use professional names
    if (!personaName || personaName.trim().length === 0) {
      setNameError('Naming is required for audit traceability.');
      return false;
    }
    if (personaName.trim().length < 5) {
      setNameError('Name must be at least 5 characters for professional identification.');
      return false;
    }
    
    // Check uniqueness
    if (!isPersonaNameUnique(personaName)) {
      setNameError('A persona with this name already exists. Please choose a unique name.');
      return false;
    }
    
    setNameError('');
    return true;
  };

  const generateNameSuggestions = () => {
    // AI-powered name generation based on configuration
    const suggestions: string[] = [];
    
    const phaseMap: Record<string, string> = {
      'Phase I': 'Phase I',
      'Phase II': 'Phase II',
      'Phase III': 'Phase III',
      'Phase IV': 'Phase IV',
    };
    
    const typeMap: Record<string, string> = {
      'analysis': 'Consistency Reviewer',
      'statistical': 'Statistical Expert',
      'writing': 'Writing Assistant',
    };
    
    // Suggestion 1: Standard format
    suggestions.push(`${phaseMap[studyPhase]} ${therapeuticArea} ${typeMap[selectedPersonaType]}`);
    
    // Suggestion 2: With role emphasis
    suggestions.push(`${therapeuticArea} ${typeMap[selectedPersonaType]} - ${phaseMap[studyPhase]}`);
    
    // Suggestion 3: With endpoint context
    if (primaryEndpoint) {
      const shortEndpoint = primaryEndpoint.split('(')[0].trim();
      suggestions.push(`${therapeuticArea} ${shortEndpoint} Analyst`);
    }
    
    setSuggestedNames(suggestions);
    setShowNamingAssistant(true);
  };

  const handleLockPersona = () => {
    // Validate name before locking
    if (!validatePersonaName()) {
      setShowNamingAssistant(true);
      return;
    }
    
    if (!currentProjectId) {
      alert('No project selected. Please create or select a project first.');
      return;
    }
    
    // Lock the persona with timestamp
    const now = new Date();
    const timestamp = now.toISOString();
    setLockedAt(timestamp);
    setIsLocked(true);
    setShowLockConfirmation(false);
    
    // Build persona object
    const personaId = currentPersonaId || `persona_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const personaData: UserPersona = {
      id: personaId,
      name: personaName,
      role: userRole,
      permissions: [], // Can be expanded based on role
      preferences: {
        selectedPersonaType,
        therapeuticArea,
        studyPhase,
        selectedTone,
        confidenceLevel,
        neverWriteFullSections,
        forbiddenAnthropomorphism,
        jargonLevel,
        forbiddenPhrases,
        primaryEndpoint,
        endpointDataType,
        statisticalGoal,
        successThreshold,
        requireCitation,
        enforceConservativeLanguage,
        requirePeerReviewed,
        prohibitClinicalRecs,
        strictnessLevel,
        requireSourceForClaim,
        allowHeuristic,
        maxUncitedSentences,
        citationFormat,
        sourceTypes,
        knowledgeBaseScope,
        citationStrength,
        inferenceTypes,
      },
      createdAt: isNewPersona ? now : (savedPersonas.find(p => p.id === personaId)?.createdAt || now),
      modifiedAt: now,
    };
    
    // Save to storage
    const updatedPersonas = isNewPersona
      ? [...savedPersonas, personaData]
      : savedPersonas.map(p => p.id === personaId ? personaData : p);
    
    storage.personas.save(updatedPersonas, currentProjectId);
    setSavedPersonas(updatedPersonas);
    setCurrentPersonaId(personaId);
    setIsNewPersona(false);
    
    setShowSuccessToast(true);
    
    // Auto-hide toast after 5 seconds
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  const formatLockedDate = () => {
    if (!lockedAt) return '';
    const date = new Date(lockedAt);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const isLockButtonEnabled = (): boolean => {
    if (isLocked) return false;
    
    // Contributors can't lock at all (they use Request Validation)
    if (userRole === 'CONTRIBUTOR') return false;
    
    // Lead Scientists and Admins need professional names (5+ chars)
    return personaName.trim().length >= 5;
  };

  const handleInitiateLock = () => {
    if (!validatePersonaName()) {
      setShowNamingAssistant(true);
      return;
    }
    setShowLockModal(true);
  };

  const tabs = [
    { id: 'identity' as TabType, label: 'Identity & Scope', icon: User },
    { id: 'interpretation' as TabType, label: 'Interpretation Rules', icon: Brain },
    { id: 'language' as TabType, label: 'Language Controls', icon: MessageSquare },
    { id: 'outcome' as TabType, label: 'Outcome Focus', icon: Target },
    { id: 'citation' as TabType, label: 'Citation Policy', icon: BookOpen },
    { id: 'validation' as TabType, label: 'Validation', icon: CheckCircle2 },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Tab Navigation Bar */}
      <div className="px-6 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between">
          {/* Persona Tab */}
          <div className="flex items-center gap-2">
{tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {savedPersonas.length > 0 && (
              <button
                onClick={() => setShowPersonaSelector(!showPersonaSelector)}
                className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Load ({savedPersonas.length})
              </button>
            )}
            
            {!isLocked && userRole === 'CONTRIBUTOR' && (
              <button 
                onClick={handleInitiateLock}
                disabled={!isLockButtonEnabled()}
                className={`px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2 ${
                  isLockButtonEnabled()
                    ? 'bg-slate-600 hover:bg-slate-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <ArrowRight className="w-4 h-4" />
                Request Validation
              </button>
            )}
            
            {!isLocked && (userRole === 'LEAD_SCIENTIST' || userRole === 'ADMIN') && (
              <button 
                onClick={handleInitiateLock}
                disabled={!isLockButtonEnabled()}
                className={`px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2 ${
                  isLockButtonEnabled()
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Lock className="w-4 h-4" />
                {userRole === 'ADMIN' ? 'Admin Lock' : 'Save & Lock'}
              </button>
            )}
            
            <button
              onClick={createNewPersona}
              disabled={isNewPersona}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New
            </button>
          </div>
        </div>
        
        {/* Persona List Dropdown */}
        {showPersonaSelector && savedPersonas.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div className="text-xs font-medium text-slate-600 mb-3">Saved Personas</div>
            <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto">
              {savedPersonas.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => {
                    loadPersona(persona);
                    setShowPersonaSelector(false);
                  }}
                  className="text-left p-3 rounded-lg border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">{persona.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {persona.preferences.therapeuticArea} • {persona.preferences.studyPhase}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Modified {new Date(persona.modifiedAt).toLocaleDateString()}
                      </div>
                    </div>
                    {currentPersonaId === persona.id && (
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main content area removed role banner from here - now in side panel */}
      
      {/* Locked State Banner */}
      {isLocked && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-green-900">
                Regulatory Record - Read Only
              </div>
              <div className="text-xs text-green-700 mt-0.5">
                This persona configuration is locked and cannot be modified. Create a new version to make changes.
              </div>
            </div>
            <button className="px-3 py-1.5 bg-white border border-green-300 hover:border-green-400 text-green-900 rounded-lg transition-colors text-xs flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              Download Audit PDF
            </button>
          </div>
        </div>
      )}
    
    {/* Main Content */}
    <div className="flex-1 flex bg-slate-50 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto scrollbar-light">
        <ContentContainer className="p-6">
          {/* Persona Card */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'interpretation' && (
                <div className="space-y-6">
                  {/* Intro */}
                  <div>
                    <h3 className="text-lg text-slate-900 mb-2">Interpretation Rules</h3>
                    <p className="text-slate-600">
                      Define what the AI is allowed and forbidden to infer. These rules ensure
                      regulatory compliance and patient safety by constraining AI outputs.
                    </p>
                  </div>

                  {/* Error Banner */}
                  {hasConflict && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-red-900">Configuration Error</div>
                        <div className="text-sm text-red-700 mt-1">
                          The same inference type cannot be both allowed and disallowed
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Warning Banner */}
                  {hasNoDisallowed && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-red-900">Regulatory Requirement Not Met</div>
                        <div className="text-sm text-red-700 mt-1">
                          At least one disallowed inference type must be selected to ensure safe AI operation.
                          This is required for regulatory compliance and to prevent unauthorized clinical claims.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Allowed Inference Types */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Allowed Inference Types
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {inferenceTypes.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => toggleAllowed(item.id)}
                          className={`text-left p-4 rounded-lg border-2 transition-all ${
                            item.allowed
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-slate-200 bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                item.allowed
                                  ? 'bg-blue-600 border-blue-600'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {item.allowed && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-slate-900 mb-1">{item.title}</div>
                              <div className="text-xs text-slate-600">{item.description}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Disallowed Inference Types */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-1 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      Disallowed Inference Types
                    </h4>
                    <p className="text-xs text-red-600 mb-3">Required – at least one must be selected</p>
                    <div className="grid grid-cols-2 gap-3">
                      {disallowedTypes.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => toggleDisallowed(item.id)}
                          className={`text-left p-4 rounded-lg border-2 transition-all ${
                            item.disallowed
                              ? 'border-red-500 bg-red-50'
                              : 'border-slate-200 bg-white hover:border-red-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                item.disallowed
                                  ? 'bg-red-600 border-red-600'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {item.disallowed && (
                                <X className="w-3 h-3 text-white" strokeWidth={3} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-slate-900 mb-1">{item.title}</div>
                              <div className="text-xs text-slate-600">{item.description}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Educational Callout */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-900">
                      <div className="font-medium mb-1">Why are disallowed inference types mandatory?</div>
                      <div className="text-blue-800">
                        Regulatory bodies require explicit constraints on AI systems used in clinical research.
                        By defining what the AI must not infer, you create a safety boundary that prevents
                        unauthorized clinical claims and ensures all conclusions are made by qualified humans.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'identity' && (
                <div className="space-y-6">
                  {/* Intro */}
                  <div>
                    <h3 className="text-lg text-slate-900 mb-2">Identity & Scope</h3>
                    <p className="text-slate-600">
                      Define the persona's identity, role, and scope of application
                    </p>
                  </div>

                  {/* Persona Name */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="block text-sm font-medium text-slate-900">
                        Persona Name
                      </label>
                      {isLocked && (
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={personaName}
                        onChange={(e) => {
                          setPersonaName(e.target.value);
                          if (e.target.value.trim().length >= 5) {
                            setNameError('');
                          }
                        }}
                        disabled={isLocked}
                        className={`flex-1 px-4 py-3 border ${
                          nameError ? 'border-red-500' : 'border-slate-300'
                        } rounded-lg text-slate-900 ${
                          isLocked
                            ? 'bg-slate-100 opacity-60 cursor-not-allowed'
                            : 'bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                        }`}
                        placeholder={
                          userRole === 'CONTRIBUTOR'
                            ? 'e.g., Draft 1, Testing logic, or any informal name'
                            : 'e.g., Phase III Oncology Consistency Reviewer'
                        }
                      />
                      {!isLocked && (
                        <button
                          onClick={generateNameSuggestions}
                          className="px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                          <Sparkles className="w-4 h-4" />
                          Suggest Name
                        </button>
                      )}
                    </div>
                    {nameError && (
                      <div className="mt-2 text-xs text-red-600 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {nameError}
                      </div>
                    )}
                    {!nameError && !isLocked && (
                      <p className="mt-2 text-xs text-slate-500">
                        {userRole === 'CONTRIBUTOR' 
                          ? 'Any name allowed for draft phase. Professional naming required before production lock.'
                          : 'Required for audit traceability. Minimum 5 characters for professional identification.'}
                      </p>
                    )}
                  </div>

                  {/* Version & Status Badges */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Version & Status
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1.5 bg-slate-200 text-slate-900 rounded-md text-sm font-medium">
                        v3.0
                      </div>
                      <div className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                        isLocked 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isLocked ? 'Locked' : 'Draft'}
                      </div>
                    </div>
                  </div>

                  {/* Domain Metadata */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Therapeutic Area
                      </label>
                      <input
                        type="text"
                        value={therapeuticArea}
                        onChange={(e) => setTherapeuticArea(e.target.value)}
                        disabled={isLocked}
                        className={`w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 ${
                          isLocked
                            ? 'bg-slate-100 opacity-60 cursor-not-allowed'
                            : 'bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                        }`}
                        placeholder="e.g., Oncology, Cardiology"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Study Phase
                      </label>
                      <input
                        type="text"
                        value={studyPhase}
                        onChange={(e) => setStudyPhase(e.target.value)}
                        disabled={isLocked}
                        className={`w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 ${
                          isLocked
                            ? 'bg-slate-100 opacity-60 cursor-not-allowed'
                            : 'bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                        }`}
                        placeholder="e.g., Phase III"
                      />
                    </div>
                  </div>

                  {/* Persona Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Persona Type
                    </label>
                    <p className="text-sm text-slate-600 mb-4">
                      Select the functional role this persona will fulfill
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                      {/* Statistical Planning */}
                      <button
                        onClick={() => !isLocked && setSelectedPersonaType('statistical_planning')}
                        disabled={isLocked}
                        className={`text-left p-5 rounded-lg border-2 transition-all ${
                          selectedPersonaType === 'statistical_planning'
                            ? 'border-blue-600 bg-blue-50'
                            : isLocked
                            ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            selectedPersonaType === 'statistical_planning'
                              ? 'bg-blue-600'
                              : 'bg-slate-200'
                          }`}>
                            <BarChart3 className={`w-5 h-5 ${
                              selectedPersonaType === 'statistical_planning'
                                ? 'text-white'
                                : 'text-slate-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900 mb-1">
                              Statistical Planning
                            </div>
                            <div className="text-xs text-slate-600">
                              Supports biostatisticians in creating analysis plans, validating statistical methods, and ensuring methodological rigor
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Analysis */}
                      <button
                        onClick={() => !isLocked && setSelectedPersonaType('analysis')}
                        disabled={isLocked}
                        className={`text-left p-5 rounded-lg border-2 transition-all ${
                          selectedPersonaType === 'analysis'
                            ? 'border-blue-600 bg-blue-50'
                            : isLocked
                            ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            selectedPersonaType === 'analysis'
                              ? 'bg-blue-600'
                              : 'bg-slate-200'
                          }`}>
                            <FileText className={`w-5 h-5 ${
                              selectedPersonaType === 'analysis'
                                ? 'text-white'
                                : 'text-slate-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900 mb-1">
                              Analysis & Review
                            </div>
                            <div className="text-xs text-slate-600">
                              Assists clinical investigators in interpreting results, identifying safety signals, and ensuring regulatory compliance
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Academic Writing Coach */}
                      <button
                        onClick={() => !isLocked && setSelectedPersonaType('academic_writing_coach')}
                        disabled={isLocked}
                        className={`text-left p-5 rounded-lg border-2 transition-all ${
                          selectedPersonaType === 'academic_writing_coach'
                            ? 'border-blue-600 bg-blue-50'
                            : isLocked
                            ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            selectedPersonaType === 'academic_writing_coach'
                              ? 'bg-blue-600'
                              : 'bg-slate-200'
                          }`}>
                            <GraduationCap className={`w-5 h-5 ${
                              selectedPersonaType === 'academic_writing_coach'
                                ? 'text-white'
                                : 'text-slate-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900 mb-1">
                              Academic Writing Coach
                            </div>
                            <div className="text-xs text-slate-600">
                              Guides researchers in drafting manuscripts, ensuring proper citation, and maintaining scientific rigor in publications
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Lock Persona Action */}
                  {!isLocked && (
                    <div className="pt-4 border-t border-slate-200">
                      <button
                        onClick={() => setShowLockModal(true)}
                        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        Lock Persona
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'language' && (
                <div className="grid grid-cols-[1fr,380px] gap-6">
                  {/* Left: Settings */}
                  <div className="space-y-6">
                    {/* Intro */}
                    <div>
                      <h3 className="text-lg text-slate-900 mb-2">Language Controls</h3>
                      <p className="text-slate-600">
                        Configure tone, terminology, and language style guidelines
                      </p>
                    </div>

                    {/* Coaching Tone Selection */}
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Coaching Tone
                      </label>
                      <p className="text-sm text-slate-600 mb-4">
                        Select how the AI communicates feedback
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                        {/* Socratic */}
                        <button
                          onClick={() => !isLocked && setSelectedTone('socratic')}
                          disabled={isLocked}
                          className={`text-left p-4 rounded-lg border-2 transition-all ${
                            selectedTone === 'socratic'
                              ? 'border-blue-600 bg-blue-50'
                              : isLocked
                              ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                              : 'border-slate-200 bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              selectedTone === 'socratic'
                                ? 'bg-blue-600'
                                : 'bg-slate-200'
                            }`}>
                              <MessageCircleQuestion className={`w-5 h-5 ${
                                selectedTone === 'socratic'
                                  ? 'text-white'
                                  : 'text-slate-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-slate-900 mb-1 flex items-center gap-2">
                                Socratic
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">Recommended</span>
                              </div>
                              <div className="text-xs text-slate-600">
                                AI asks guiding questions (e.g., "How does this result align with your initial hypothesis?") rather than rewriting
                              </div>
                            </div>
                          </div>
                        </button>

                        {/* Educational */}
                        <button
                          onClick={() => !isLocked && setSelectedTone('educational')}
                          disabled={isLocked}
                          className={`text-left p-4 rounded-lg border-2 transition-all ${
                            selectedTone === 'educational'
                              ? 'border-blue-600 bg-blue-50'
                              : isLocked
                              ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                              : 'border-slate-200 bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              selectedTone === 'educational'
                                ? 'bg-blue-600'
                                : 'bg-slate-200'
                            }`}>
                              <BookOpen className={`w-5 h-5 ${
                                selectedTone === 'educational'
                                  ? 'text-white'
                                  : 'text-slate-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-slate-900 mb-1">
                                Educational
                              </div>
                              <div className="text-xs text-slate-600">
                                AI explains the why behind a formatting rule (e.g., CONSORT guidelines) with supporting context
                              </div>
                            </div>
                          </div>
                        </button>

                        {/* Directive */}
                        <button
                          onClick={() => !isLocked && setSelectedTone('directive')}
                          disabled={isLocked}
                          className={`text-left p-4 rounded-lg border-2 transition-all ${
                            selectedTone === 'directive'
                              ? 'border-blue-600 bg-blue-50'
                              : isLocked
                              ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                              : 'border-slate-200 bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              selectedTone === 'directive'
                                ? 'bg-blue-600'
                                : 'bg-slate-200'
                            }`}>
                              <Command className={`w-5 h-5 ${
                                selectedTone === 'directive'
                                  ? 'text-white'
                                  : 'text-slate-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-slate-900 mb-1">
                                Directive
                              </div>
                              <div className="text-xs text-slate-600">
                                AI gives straight, technical feedback on compliance errors without additional explanation
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Linguistic Confidence Slider */}
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Linguistic Confidence
                      </label>
                      <p className="text-sm text-slate-600 mb-4">
                        Controls the strength of AI language claims
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Clinical / Conservative</span>
                          <span className="font-medium text-slate-900">{getConfidenceLevelLabel()}</span>
                          <span className="text-slate-600">Academic / Exploratory</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={confidenceLevel}
                          onChange={(e) => !isLocked && setConfidenceLevel(parseInt(e.target.value))}
                          disabled={isLocked}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>1</span>
                          <span>2</span>
                          <span>3</span>
                          <span>4</span>
                          <span>5</span>
                        </div>
                      </div>
                    </div>

                    {/* Guardrail Toggles */}
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-4">
                        Output Constraints
                      </label>
                      <div className="space-y-4">
                        {/* Never Write Full Sections */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                          <div className="flex-1 pr-4">
                            <div className="text-sm font-medium text-slate-900 mb-1">
                              Strict Evidence Only
                            </div>
                            <div className="text-xs text-slate-600">
                              AI is a coach (gives feedback) rather than a ghostwriter (writes full sections)
                            </div>
                          </div>
                          <button
                            onClick={() => !isLocked && setNeverWriteFullSections(!neverWriteFullSections)}
                            disabled={isLocked}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              neverWriteFullSections ? 'bg-blue-600' : 'bg-slate-300'
                            } ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                neverWriteFullSections ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Forbidden Anthropomorphism */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                          <div className="flex-1 pr-4">
                            <div className="text-sm font-medium text-slate-900 mb-1">
                              Avoid First-Person
                            </div>
                            <div className="text-xs text-slate-600">
                              AI blocked from using "I think" or "I feel," forcing "The data indicates" or "Analysis shows"
                            </div>
                          </div>
                          <button
                            onClick={() => !isLocked && setForbiddenAnthropomorphism(!forbiddenAnthropomorphism)}
                            disabled={isLocked}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              forbiddenAnthropomorphism ? 'bg-blue-600' : 'bg-slate-300'
                            } ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                forbiddenAnthropomorphism ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Jargon Level */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                          <div className="flex-1 pr-4">
                            <div className="text-sm font-medium text-slate-900 mb-1">
                              Guideline Compliance Mode
                            </div>
                            <div className="text-xs text-slate-600">
                              {jargonLevel === 'peer-review' ? 'Peer-Review Ready (High Jargon)' : 'Patient/Layperson Summary (Low Jargon)'}
                            </div>
                          </div>
                          <button
                            onClick={() => !isLocked && setJargonLevel(jargonLevel === 'peer-review' ? 'layperson' : 'peer-review')}
                            disabled={isLocked}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              jargonLevel === 'peer-review' ? 'bg-blue-600' : 'bg-slate-300'
                            } ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                jargonLevel === 'peer-review' ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Forbidden Phrases */}
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Forbidden Phrases
                      </label>
                      <p className="text-sm text-slate-600 mb-3">
                        Define specific phrases the AI must never use
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {forbiddenPhrases.map((phrase, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm"
                          >
                            <span>{phrase}</span>
                            {!isLocked && (
                              <button
                                onClick={() => removeForbiddenPhrase(phrase)}
                                className="hover:bg-red-100 rounded p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      {!isLocked && (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newPhrase}
                            onChange={(e) => setNewPhrase(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addForbiddenPhrase()}
                            placeholder="Add forbidden phrase..."
                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          />
                          <button
                            onClick={addForbiddenPhrase}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Live Preview */}
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Info className="w-5 h-5 text-blue-600" />
                        <h4 className="text-sm font-medium text-blue-900">Live Preview</h4>
                      </div>
                      
                      {/* Before */}
                      <div className="mb-4">
                        <div className="text-xs font-medium text-slate-700 mb-2">❌ Before (Uncontrolled)</div>
                        <div className="bg-white rounded-md p-3 text-sm text-slate-900 border border-red-200">
                          The drug cured the patients and proved statistically significant treatment effectiveness with definitive safety benefits.
                        </div>
                      </div>

                      {/* After */}
                      <div>
                        <div className="text-xs font-medium text-slate-700 mb-2">✓ After (Controlled)</div>
                        <div className="bg-white rounded-md p-3 text-sm text-slate-900 border border-green-200">
                          {getPreviewText()}
                        </div>
                      </div>

                      {/* Settings Summary */}
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <div className="text-xs text-blue-800 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                            <span>Tone: {selectedTone === 'socratic' ? 'Socratic' : selectedTone === 'educational' ? 'Educational' : 'Directive'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                            <span>Confidence: {getConfidenceLevelLabel()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                            <span>{forbiddenPhrases.length} forbidden phrase{forbiddenPhrases.length !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'outcome' && (
                <div className="space-y-6">
                  {/* Intro */}
                  <div>
                    <h3 className="text-lg text-slate-900 mb-2">Outcome Focus</h3>
                    <p className="text-slate-600">
                      Configure clinical endpoints, statistical goals, and interpretation guardrails
                    </p>
                  </div>

                  {/* Primary Endpoint Definition Card */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Star className="w-5 h-5 text-white fill-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-900">Primary Endpoint</h4>
                        <p className="text-xs text-slate-600">Highest priority outcome for AI analysis</p>
                      </div>
                      <div className="ml-auto px-3 py-1 bg-blue-600 text-white text-xs rounded-md">
                        Critical
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-2">
                          Endpoint Name
                        </label>
                        <select
                          value={primaryEndpoint}
                          onChange={(e) => !isLocked && setPrimaryEndpoint(e.target.value)}
                          disabled={isLocked}
                          className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 ${
                            isLocked
                              ? 'bg-slate-100 opacity-60 cursor-not-allowed'
                              : 'bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                          }`}
                        >
                          <option>Overall Response Rate (ORR)</option>
                          <option>Overall Survival (OS)</option>
                          <option>Progression-Free Survival (PFS)</option>
                          <option>Complete Response (CR)</option>
                          <option>Partial Response (PR)</option>
                          <option>Disease Control Rate (DCR)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-2">
                          Data Type
                        </label>
                        <select
                          value={endpointDataType}
                          onChange={(e) => !isLocked && setEndpointDataType(e.target.value)}
                          disabled={isLocked}
                          className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 ${
                            isLocked
                              ? 'bg-slate-100 opacity-60 cursor-not-allowed'
                              : 'bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                          }`}
                        >
                          <option>Binary</option>
                          <option>Continuous</option>
                          <option>Time-to-Event</option>
                          <option>Categorical</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Statistical Goal */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-3">
                      Statistical Goal
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => !isLocked && setStatisticalGoal('superiority')}
                        disabled={isLocked}
                        className={`p-4 rounded-lg border-2 text-center transition-all ${
                          statisticalGoal === 'superiority'
                            ? 'border-blue-600 bg-blue-50'
                            : isLocked
                            ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="text-sm font-medium text-slate-900 mb-1">Identify Superiority</div>
                        <div className="text-xs text-slate-600">Demonstrate treatment is better than control</div>
                      </button>
                      <button
                        onClick={() => !isLocked && setStatisticalGoal('safety')}
                        disabled={isLocked}
                        className={`p-4 rounded-lg border-2 text-center transition-all ${
                          statisticalGoal === 'safety'
                            ? 'border-blue-600 bg-blue-50'
                            : isLocked
                            ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="text-sm font-medium text-slate-900 mb-1">Confirm Safety</div>
                        <div className="text-xs text-slate-600">Establish non-inferiority for safety</div>
                      </button>
                      <button
                        onClick={() => !isLocked && setStatisticalGoal('exploratory')}
                        disabled={isLocked}
                        className={`p-4 rounded-lg border-2 text-center transition-all ${
                          statisticalGoal === 'exploratory'
                            ? 'border-blue-600 bg-blue-50'
                            : isLocked
                            ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="text-sm font-medium text-slate-900 mb-1">Exploratory Analysis</div>
                        <div className="text-xs text-slate-600">Generate hypotheses for future studies</div>
                      </button>
                    </div>
                  </div>

                  {/* Success Threshold */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Success Threshold
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={successThreshold}
                        onChange={(e) => !isLocked && setSuccessThreshold(e.target.value)}
                        disabled={isLocked}
                        className={`flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 ${
                          isLocked
                            ? 'bg-slate-100 opacity-60 cursor-not-allowed'
                            : 'bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                        }`}
                        placeholder="e.g., 25"
                      />
                      <span className="text-sm text-slate-600">% to be considered significant</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      AI will flag outcomes that exceed this threshold for human review
                    </p>
                  </div>

                  {/* Statistical Guardrails */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-4">
                      Statistical Guardrails
                    </label>
                    <div className="space-y-3">
                      {/* Enforce Conservative Language */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex-1 pr-4">
                          <div className="text-sm font-medium text-slate-900 mb-1">
                            Enforce Conservative Language
                          </div>
                          <div className="text-xs text-slate-600">
                            AI must use hedging words (suggests, may indicate) for all outcome interpretations
                          </div>
                        </div>
                        <button
                          onClick={() => !isLocked && setEnforceConservativeLanguage(!enforceConservativeLanguage)}
                          disabled={isLocked}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            enforceConservativeLanguage ? 'bg-blue-600' : 'bg-slate-300'
                          } ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              enforceConservativeLanguage ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Require Peer-Reviewed Benchmarks */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex-1 pr-4">
                          <div className="text-sm font-medium text-slate-900 mb-1">
                            Require Peer-Reviewed Benchmarks
                          </div>
                          <div className="text-xs text-slate-600">
                            All outcome comparisons must reference peer-reviewed literature
                          </div>
                        </div>
                        <button
                          onClick={() => !isLocked && setRequirePeerReviewed(!requirePeerReviewed)}
                          disabled={isLocked}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            requirePeerReviewed ? 'bg-blue-600' : 'bg-slate-300'
                          } ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              requirePeerReviewed ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Prohibit Clinical Recommendations */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex-1 pr-4">
                          <div className="text-sm font-medium text-slate-900 mb-1">
                            Prohibit Clinical Recommendations
                          </div>
                          <div className="text-xs text-slate-600">
                            AI cannot suggest treatment changes or clinical actions based on outcomes
                          </div>
                        </div>
                        <button
                          onClick={() => !isLocked && setProhibitClinicalRecs(!prohibitClinicalRecs)}
                          disabled={isLocked}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            prohibitClinicalRecs ? 'bg-blue-600' : 'bg-slate-300'
                          } ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              prohibitClinicalRecs ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Citation Requirement */}
                      <div className="flex items-center justify-between p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                        <div className="flex-1 pr-4">
                          <div className="text-sm font-medium text-slate-900 mb-1 flex items-center gap-2">
                            Force Citation for All Outcome Claims
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded">Required</span>
                          </div>
                          <div className="text-xs text-slate-600">
                            Every claim about this outcome must include a source citation
                          </div>
                        </div>
                        <button
                          onClick={() => !isLocked && setRequireCitation(!requireCitation)}
                          disabled={isLocked}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            requireCitation ? 'bg-blue-600' : 'bg-slate-300'
                          } ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              requireCitation ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Benchmark Integration */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-slate-900">
                        Benchmark Integration
                      </label>
                      <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm">
                        <Search className="w-4 h-4" />
                        Search for Benchmarks
                      </button>
                    </div>

                    {/* Reference Citations */}
                    <div className="space-y-3 mb-4">
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-900 mb-1">
                              Phase III Trial: ORR in Metastatic NSCLC
                            </div>
                            <div className="text-xs text-slate-600 mb-2">
                              Smith et al. (2023) · Journal of Clinical Oncology
                            </div>
                            <div className="text-xs text-slate-700 bg-white border border-slate-200 rounded p-2 mb-2">
                              "...overall response rate of 32% (95% CI: 28-36%) in the treatment arm compared to 18% in the control arm..."
                            </div>
                            <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" />
                              View Source
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-900 mb-1">
                              Meta-Analysis: Response Rates in Advanced Cancers
                            </div>
                            <div className="text-xs text-slate-600 mb-2">
                              Chen et al. (2024) · Lancet Oncology
                            </div>
                            <div className="text-xs text-slate-700 bg-white border border-slate-200 rounded p-2 mb-2">
                              "...pooled ORR of 28% across 12 randomized trials (N=4,892 patients)..."
                            </div>
                            <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" />
                              View Source
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-900 mb-1">
                              Real-World Evidence: ORR in Clinical Practice
                            </div>
                            <div className="text-xs text-slate-600 mb-2">
                              Johnson et al. (2023) · NEJM Evidence
                            </div>
                            <div className="text-xs text-slate-700 bg-white border border-slate-200 rounded p-2 mb-2">
                              "...real-world ORR of 26% (95% CI: 22-30%) observed in unselected patient population..."
                            </div>
                            <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" />
                              View Source
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Target vs Actual Chart */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <h5 className="text-sm font-medium text-slate-900">Target vs. Actual Performance</h5>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-600">Study Target (Success Threshold)</span>
                            <span className="text-xs font-medium text-slate-900">{successThreshold}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-6 relative">
                            <div
                              className="bg-blue-600 h-6 rounded-full flex items-center justify-end px-2"
                              style={{ width: `${successThreshold}%` }}
                            >
                              <span className="text-xs text-white">{successThreshold}%</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-600">Literature Benchmark (Pooled)</span>
                            <span className="text-xs font-medium text-slate-900">28%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-6 relative">
                            <div
                              className="bg-amber-500 h-6 rounded-full flex items-center justify-end px-2"
                              style={{ width: '28%' }}
                            >
                              <span className="text-xs text-white">28%</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-600">Estimated Current (Simulated)</span>
                            <span className="text-xs font-medium text-slate-900">32%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-6 relative">
                            <div
                              className="bg-green-500 h-6 rounded-full flex items-center justify-end px-2"
                              style={{ width: '32%' }}
                            >
                              <span className="text-xs text-white">32%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'citation' && (
                <div className="space-y-6">
                  {/* Intro */}
                  <div>
                    <h3 className="text-lg text-slate-900 mb-2">Citation Policy</h3>
                    <p className="text-slate-600">
                      Configure evidence requirements and citation standards for AI-generated claims
                    </p>
                  </div>

                  {/* Strictness Level Presets */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-3">
                      Evidence Strictness Level
                    </label>
                    <p className="text-sm text-slate-600 mb-4">
                      Select a preset configuration for citation requirements
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      {/* Strict */}
                      <button
                        onClick={() => !isLocked && handleStrictnessLevelChange('strict')}
                        disabled={isLocked}
                        className={`p-5 rounded-lg border-2 transition-all ${
                          strictnessLevel === 'strict'
                            ? 'border-blue-600 bg-blue-50'
                            : isLocked
                            ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
                            strictnessLevel === 'strict'
                              ? 'bg-blue-600'
                              : 'bg-slate-200'
                          }`}>
                            <Shield className={`w-6 h-6 ${
                              strictnessLevel === 'strict'
                                ? 'text-white'
                                : 'text-slate-600'
                            }`} />
                          </div>
                          <div className="text-sm font-medium text-slate-900 mb-1 flex items-center gap-2">
                            Strict
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Recommended</span>
                          </div>
                          <div className="text-xs text-slate-600 mb-2">Clinical Audit</div>
                          <div className="text-xs text-slate-500">
                            Every claim requires a source. Zero uncited sentences allowed.
                          </div>
                        </div>
                      </button>

                      {/* Balanced */}
                      <button
                        onClick={() => !isLocked && handleStrictnessLevelChange('balanced')}
                        disabled={isLocked}
                        className={`p-5 rounded-lg border-2 transition-all ${
                          strictnessLevel === 'balanced'
                            ? 'border-blue-600 bg-blue-50'
                            : isLocked
                            ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
                            strictnessLevel === 'balanced'
                              ? 'bg-blue-600'
                              : 'bg-slate-200'
                          }`}>
                            <BookOpen className={`w-6 h-6 ${
                              strictnessLevel === 'balanced'
                                ? 'text-white'
                                : 'text-slate-600'
                            }`} />
                          </div>
                          <div className="text-sm font-medium text-slate-900 mb-1">Balanced</div>
                          <div className="text-xs text-slate-600 mb-2">Academic Drafting</div>
                          <div className="text-xs text-slate-500">
                            Requires sources for claims. Up to 2 uncited sentences allowed.
                          </div>
                        </div>
                      </button>

                      {/* Exploratory */}
                      <button
                        onClick={() => !isLocked && handleStrictnessLevelChange('exploratory')}
                        disabled={isLocked}
                        className={`p-5 rounded-lg border-2 transition-all ${
                          strictnessLevel === 'exploratory'
                            ? 'border-blue-600 bg-blue-50'
                            : isLocked
                            ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
                            strictnessLevel === 'exploratory'
                              ? 'bg-blue-600'
                              : 'bg-slate-200'
                          }`}>
                            <Search className={`w-6 h-6 ${
                              strictnessLevel === 'exploratory'
                                ? 'text-white'
                                : 'text-slate-600'
                            }`} />
                          </div>
                          <div className="text-sm font-medium text-slate-900 mb-1">Exploratory</div>
                          <div className="text-xs text-slate-600 mb-2">Brainstorming</div>
                          <div className="text-xs text-slate-500">
                            Allows heuristic reasoning. Up to 5 uncited sentences.
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Search & Retrieval Strategy */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Search className="w-5 h-5 text-blue-600" />
                      <h4 className="text-sm font-medium text-slate-900">Search & Retrieval Strategy</h4>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">
                      Configure how the AI searches for evidence and which knowledge bases it can access
                    </p>

                    <div className="grid grid-cols-3 gap-4">
                      {/* Knowledge Base Scope */}
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-2">
                          Knowledge Base Scope
                        </label>
                        <select
                          value={knowledgeBaseScope}
                          onChange={(e) => !isLocked && setKnowledgeBaseScope(e.target.value)}
                          disabled={isLocked}
                          className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 ${
                            isLocked
                              ? 'bg-slate-100 opacity-60 cursor-not-allowed'
                              : 'bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                          }`}
                        >
                          <option value="current-project">Current Project Documents</option>
                          <option value="global-library">Global Clinical Library</option>
                          <option value="hybrid">Hybrid (Prioritize Project)</option>
                        </select>
                        <p className="text-xs text-slate-500 mt-2">
                          {knowledgeBaseScope === 'current-project' && 'AI only searches documents you have uploaded to this project'}
                          {knowledgeBaseScope === 'global-library' && 'AI searches across all uploaded documents in the system'}
                          {knowledgeBaseScope === 'hybrid' && 'AI searches globally but prioritizes project-specific files'}
                        </p>
                      </div>

                      {/* Citation Strength */}
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-slate-700 mb-2">
                          Citation Strength
                        </label>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600">Relaxed</span>
                            <span className={`font-medium ${getCitationStrengthColor()}`}>
                              {getCitationStrengthLabel()}
                            </span>
                            <span className="text-slate-600">Strict</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={citationStrength}
                            onChange={(e) => !isLocked && setCitationStrength(parseInt(e.target.value))}
                            disabled={isLocked}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                          />
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>1</span>
                            <span>2</span>
                            <span>3</span>
                            <span>4</span>
                            <span>5</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Live Search Preview */}
                    <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="relative">
                          <Search className="w-4 h-4 text-blue-600 animate-pulse" />
                        </div>
                        <h5 className="text-xs font-medium text-slate-900">Live Search Preview</h5>
                        <span className="ml-auto px-2 py-0.5 bg-blue-600 text-white text-xs rounded">Active</span>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-white rounded-md p-3 flex items-start gap-3 border border-slate-200">
                          <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-slate-900 mb-1">Protocol_NSCLC_v3.0.pdf</div>
                            <div className="text-xs text-slate-600">Similarity: 0.94 · Page 42 · "Overall response rate definition..."</div>
                          </div>
                          <span className="text-xs text-green-600 font-medium">Match</span>
                        </div>
                        <div className="bg-white rounded-md p-3 flex items-start gap-3 border border-slate-200">
                          <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-slate-900 mb-1">Benchmark_JCO_2023.pdf</div>
                            <div className="text-xs text-slate-600">Similarity: 0.87 · Page 15 · "Historical ORR of 28% reported..."</div>
                          </div>
                          <span className="text-xs text-green-600 font-medium">Match</span>
                        </div>
                        {citationStrength <= 2 && (
                          <div className="bg-white rounded-md p-3 flex items-start gap-3 border border-amber-200">
                            <div className="w-6 h-6 bg-amber-100 rounded flex items-center justify-center flex-shrink-0">
                              <AlertTriangle className="w-4 h-4 text-amber-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-slate-900 mb-1">General Clinical Knowledge</div>
                              <div className="text-xs text-slate-600">Similarity: 0.72 · "Common understanding that response rates..."</div>
                            </div>
                            <span className="text-xs text-amber-600 font-medium">Heuristic</span>
                          </div>
                        )}
                        {citationStrength >= 4 && (
                          <div className="bg-white rounded-md p-3 flex items-start gap-3 border border-red-200 opacity-50">
                            <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                              <X className="w-4 h-4 text-red-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-slate-900 mb-1">Generic_Study_2020.pdf</div>
                              <div className="text-xs text-slate-600">Similarity: 0.68 · Below threshold · Excluded from results</div>
                            </div>
                            <span className="text-xs text-red-600 font-medium">Rejected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Configuration Details */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Mandatory Evidence Toggle */}
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-4">
                          Security & Evidence
                        </label>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                            <div className="flex-1 pr-4">
                              <div className="text-sm font-medium text-slate-900 mb-1">
                                Mandatory Evidence
                              </div>
                              <div className="text-xs text-slate-600">
                                Force AI to provide a verifiable document link for every clinical claim
                              </div>
                            </div>
                            <button
                              onClick={() => !isLocked && setRequireSourceForClaim(!requireSourceForClaim)}
                              disabled={isLocked}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                requireSourceForClaim ? 'bg-green-600' : 'bg-slate-300'
                              } ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  requireSourceForClaim ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex-1 pr-4">
                              <div className="text-sm font-medium text-slate-900 mb-1 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600" />
                                Allow Heuristic Reasoning
                              </div>
                              <div className="text-xs text-slate-600">
                                Permit AI to use general clinical knowledge when direct evidence is missing
                              </div>
                            </div>
                            <button
                              onClick={() => !isLocked && setAllowHeuristic(!allowHeuristic)}
                              disabled={isLocked}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                allowHeuristic ? 'bg-amber-500' : 'bg-slate-300'
                              } ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  allowHeuristic ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Maximum Continuity Slider */}
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-2">
                          Maximum Continuity
                        </label>
                        <p className="text-sm text-slate-600 mb-4">
                          Maximum number of sentences AI can write without a citation
                        </p>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">0 sentences</span>
                            <span className="font-medium text-slate-900 px-3 py-1 bg-blue-100 text-blue-700 rounded">
                              {maxUncitedSentences} sentence{maxUncitedSentences !== 1 ? 's' : ''}
                            </span>
                            <span className="text-slate-600">5 sentences</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="5"
                            value={maxUncitedSentences}
                            onChange={(e) => !isLocked && setMaxUncitedSentences(parseInt(e.target.value))}
                            disabled={isLocked}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                          />
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>0</span>
                            <span>1</span>
                            <span>2</span>
                            <span>3</span>
                            <span>4</span>
                            <span>5</span>
                          </div>
                        </div>
                      </div>

                      {/* Source Type Prioritization */}
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-2">
                          Source Weighting
                        </label>
                        <p className="text-sm text-slate-600 mb-4">
                          Select which document types are prioritized for evidence
                        </p>
                        <div className="space-y-2">
                          <button
                            onClick={() => !isLocked && toggleSourceType('protocol')}
                            disabled={isLocked}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                              sourceTypes.protocol
                                ? 'border-blue-600 bg-blue-50'
                                : isLocked
                                ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                                : 'border-slate-200 bg-white hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  sourceTypes.protocol
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {sourceTypes.protocol && (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path d="M5 13l4 4L19 7"></path>
                                  </svg>
                                )}
                              </div>
                              <span className="text-sm text-slate-900">Internal Protocol</span>
                            </div>
                            <span className="text-xs text-slate-500">Study-specific</span>
                          </button>

                          <button
                            onClick={() => !isLocked && toggleSourceType('benchmarks')}
                            disabled={isLocked}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                              sourceTypes.benchmarks
                                ? 'border-blue-600 bg-blue-50'
                                : isLocked
                                ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                                : 'border-slate-200 bg-white hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  sourceTypes.benchmarks
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {sourceTypes.benchmarks && (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path d="M5 13l4 4L19 7"></path>
                                  </svg>
                                )}
                              </div>
                              <span className="text-sm text-slate-900">Benchmarks</span>
                            </div>
                            <span className="text-xs text-slate-500">Comparative data</span>
                          </button>

                          <button
                            onClick={() => !isLocked && toggleSourceType('guidelines')}
                            disabled={isLocked}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                              sourceTypes.guidelines
                                ? 'border-blue-600 bg-blue-50'
                                : isLocked
                                ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                                : 'border-slate-200 bg-white hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  sourceTypes.guidelines
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {sourceTypes.guidelines && (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path d="M5 13l4 4L19 7"></path>
                                  </svg>
                                )}
                              </div>
                              <span className="text-sm text-slate-900">Global Guidelines</span>
                            </div>
                            <span className="text-xs text-slate-500">Regulatory standards</span>
                          </button>

                          <button
                            onClick={() => !isLocked && toggleSourceType('peerReviewed')}
                            disabled={isLocked}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                              sourceTypes.peerReviewed
                                ? 'border-blue-600 bg-blue-50'
                                : isLocked
                                ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                                : 'border-slate-200 bg-white hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  sourceTypes.peerReviewed
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {sourceTypes.peerReviewed && (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path d="M5 13l4 4L19 7"></path>
                                  </svg>
                                )}
                              </div>
                              <span className="text-sm text-slate-900">PubMed Literature</span>
                            </div>
                            <span className="text-xs text-slate-500">Published research</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Citation Format */}
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-2">
                          Citation Format
                        </label>
                        <p className="text-sm text-slate-600 mb-3">
                          Define how citations will appear in AI-generated output
                        </p>
                        <select
                          value={citationFormat}
                          onChange={(e) => !isLocked && setCitationFormat(e.target.value)}
                          disabled={isLocked}
                          className={`w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 ${
                            isLocked
                              ? 'bg-slate-100 opacity-60 cursor-not-allowed'
                              : 'bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                          }`}
                        >
                          <option value="vancouver">Vancouver (Numbered)</option>
                          <option value="apa">APA 7th Edition</option>
                          <option value="link">Link to PDF (Internal)</option>
                          <option value="inline">Inline (Author, Year)</option>
                        </select>
                      </div>

                      {/* Preview Area */}
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-3">
                          Citation Status Preview
                        </label>
                        <div className="bg-white border border-slate-200 rounded-lg p-4">
                          <div className="text-sm text-slate-900 leading-relaxed space-y-3">
                            <p>
                              The <span className="bg-green-100 text-green-800 px-1 rounded relative">overall response rate<sup className="text-blue-600">[1]</sup></span> was 32% in the treatment arm. <span className="bg-green-100 text-green-800 px-1 rounded relative">This result<sup className="text-blue-600">[2]</sup></span> compares favorably to <span className="bg-green-100 text-green-800 px-1 rounded relative">historical benchmarks<sup className="text-blue-600">[2]</sup></span> of 28%.
                            </p>
                            {allowHeuristic && (
                              <p className="bg-amber-50 border border-amber-200 rounded p-2">
                                <span className="bg-amber-100 text-amber-800 px-1 rounded">These findings suggest potential efficacy</span> <span className="text-xs text-amber-600">[HEURISTIC]</span>
                              </p>
                            )}
                          </div>

                          {/* Legend */}
                          <div className="mt-4 pt-4 border-t border-slate-200">
                            <div className="text-xs text-slate-600 space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded" />
                                <span>CITED - Verified from uploaded documents</span>
                              </div>
                              {allowHeuristic && (
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-amber-100 border border-amber-300 rounded" />
                                  <span>HEURISTIC - AI inference without direct source</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Reference List */}
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-3">
                          Example Reference List
                        </label>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                          <div className="text-xs text-slate-700 space-y-2">
                            {citationFormat === 'vancouver' && (
                              <>
                                <div className="flex gap-2">
                                  <span className="font-medium">[1]</span>
                                  <span>Smith JA, et al. Phase III trial of novel agent. J Clin Oncol. 2023;41(15):2847-2855.</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="font-medium">[2]</span>
                                  <span>Chen L, et al. Meta-analysis of response rates. Lancet Oncol. 2024;25(2):156-167.</span>
                                </div>
                              </>
                            )}
                            {citationFormat === 'apa' && (
                              <>
                                <div>Smith, J. A., Johnson, R., & Lee, K. (2023). Phase III trial of novel therapeutic agent in metastatic NSCLC. <em>Journal of Clinical Oncology</em>, 41(15), 2847-2855.</div>
                                <div>Chen, L., Wang, H., & Martinez, P. (2024). Meta-analysis of overall response rates in advanced cancers. <em>Lancet Oncology</em>, 25(2), 156-167.</div>
                              </>
                            )}
                            {citationFormat === 'link' && (
                              <>
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  <a href="#" className="text-blue-600 hover:underline">Protocol_v3.0.pdf (Page 42)</a>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  <a href="#" className="text-blue-600 hover:underline">Benchmark_Study_2024.pdf (Page 15)</a>
                                </div>
                              </>
                            )}
                            {citationFormat === 'inline' && (
                              <>
                                <div>(Smith et al., 2023)</div>
                                <div>(Chen et al., 2024)</div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Citation Audit Button */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <CheckCircle2 className="w-5 h-5 text-blue-600" />
                          <h5 className="text-sm font-medium text-slate-900">Citation Audit</h5>
                        </div>
                        <p className="text-xs text-slate-600 mb-3">
                          Run a consistency check to verify all AI claims are properly cited and traceable to uploaded documents
                        </p>
                        <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
                          <Shield className="w-4 h-4" />
                          Run Citation Audit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'validation' && (
                <div className="space-y-6">
                  {/* Intro */}
                  <div>
                    <h3 className="text-lg text-slate-900 mb-2">Validation & Review</h3>
                    <p className="text-slate-600">
                      Review configuration, test persona behavior, and prepare for production deployment
                    </p>
                  </div>

                  {/* Global Status Banner */}
                  {!hasCriticalFailures() && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-green-900">This Persona is ready to be locked</div>
                        <div className="text-sm text-green-800 mt-1">
                          All critical requirements have been met. Review the checklist below and test the persona before locking.
                        </div>
                      </div>
                    </div>
                  )}

                  {hasCriticalFailures() && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-red-900">Action required before locking</div>
                        <div className="text-sm text-red-800 mt-1">
                          Please address the failed checks below. Click on any item to navigate to the relevant section.
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-[1fr,400px] gap-6">
                    {/* Left Column - Checklist */}
                    <div className="space-y-6">
                      {/* Pre-flight Checklist */}
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-4">
                          Pre-flight Checklist
                        </label>
                        <div className="space-y-2">
                          {getValidationChecks().map((check) => (
                            <div
                              key={check.id}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                check.status === 'pass'
                                  ? 'border-green-200 bg-green-50'
                                  : check.status === 'warning'
                                  ? 'border-amber-200 bg-amber-50'
                                  : 'border-red-200 bg-red-50'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  check.status === 'pass'
                                    ? 'bg-green-600'
                                    : check.status === 'warning'
                                    ? 'bg-amber-500'
                                    : 'bg-red-600'
                                }`}>
                                  {check.status === 'pass' && (
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                  )}
                                  {check.status === 'warning' && (
                                    <AlertTriangle className="w-4 h-4 text-white" />
                                  )}
                                  {check.status === 'fail' && (
                                    <X className="w-4 h-4 text-white" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className={`text-sm font-medium mb-1 ${
                                    check.status === 'pass'
                                      ? 'text-green-900'
                                      : check.status === 'warning'
                                      ? 'text-amber-900'
                                      : 'text-red-900'
                                  }`}>
                                    {check.label}
                                  </div>
                                  <div className={`text-xs ${
                                    check.status === 'pass'
                                      ? 'text-green-700'
                                      : check.status === 'warning'
                                      ? 'text-amber-700'
                                      : 'text-red-700'
                                  }`}>
                                    {check.message}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Consistency Check */}
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-4">
                          Consistency Check
                        </label>
                        <div className="space-y-2">
                          <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50">
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-green-900 mb-1">
                                  No logic conflicts detected
                                </div>
                                <div className="text-xs text-green-700">
                                  All interpretation rules and language controls are consistent
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50">
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-green-900 mb-1">
                                  Citation policy aligned
                                </div>
                                <div className="text-xs text-green-700">
                                  Evidence requirements match persona strictness level
                                </div>
                              </div>
                            </div>
                          </div>

                          {Object.values(sourceTypes).every(v => !v) && (
                            <div className="p-4 rounded-lg border-2 border-amber-200 bg-amber-50">
                              <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium text-amber-900 mb-1">
                                    No source types enabled
                                  </div>
                                  <div className="text-xs text-amber-700">
                                    AI will default to global library searches. Consider enabling specific source types in Citation Policy.
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Simulation Workbench */}
                    <div className="space-y-6">
                      {/* Persona Sandbox */}
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-3">
                          Persona Sandbox
                        </label>
                        <div className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden">
                          {/* Test Prompt Input */}
                          <div className="p-4 border-b border-slate-200">
                            <label className="block text-xs font-medium text-slate-700 mb-2">
                              Test Prompt
                            </label>
                            <textarea
                              value={testPrompt}
                              onChange={(e) => setTestPrompt(e.target.value)}
                              placeholder="Ask the AI a clinical question to test governance rules..."
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                              rows={3}
                            />
                            <button
                              onClick={runTestPrompt}
                              disabled={!testPrompt.trim()}
                              className="mt-3 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                            >
                              <Search className="w-4 h-4" />
                              Run Test
                            </button>
                          </div>

                          {/* AI Response */}
                          {aiResponse && (
                            <div className="p-4 border-b border-slate-200">
                              <label className="block text-xs font-medium text-slate-700 mb-2">
                                AI Response
                              </label>
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="text-sm text-slate-900 whitespace-pre-wrap">
                                  {aiResponse}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Rule Trace */}
                          {showRuleTrace && triggeredRules.length > 0 && (
                            <div className="p-4 bg-slate-50">
                              <div className="flex items-center gap-2 mb-3">
                                <Shield className="w-4 h-4 text-blue-600" />
                                <label className="text-xs font-medium text-slate-900">
                                  Rule Trace
                                </label>
                              </div>
                              <div className="space-y-2">
                                {triggeredRules.map((rule, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-2 text-xs"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <span className="text-green-700 font-medium">[SUCCESS: RULE ENFORCED]</span>
                                      <div className="text-slate-600 mt-0.5">{rule}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Export Options */}
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-3">
                          Export & Audit
                        </label>
                        <div className="space-y-2">
                          <button className="w-full px-4 py-3 bg-white border-2 border-slate-200 hover:border-blue-300 rounded-lg transition-all flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4 text-slate-600" />
                              <span className="text-slate-900">Download Audit PDF</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                          </button>
                          <button className="w-full px-4 py-3 bg-white border-2 border-slate-200 hover:border-blue-300 rounded-lg transition-all flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4 text-slate-600" />
                              <span className="text-slate-900">Export Configuration JSON</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </div>

                      {/* Regulatory Note */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-blue-900">
                            <div className="font-medium mb-1">Regulatory Requirement</div>
                            <div className="text-blue-800">
                              All AI configurations must be exported and archived for regulatory review. The audit PDF includes a complete record of governance rules, test results, and validation timestamps.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="pt-6 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600">
                        {hasCriticalFailures() ? (
                          <span className="text-red-600 font-medium">Cannot lock: {getValidationChecks().filter(c => c.status === 'fail').length} critical issue(s) remaining</span>
                        ) : (
                          <span className="text-green-600 font-medium">All checks passed • Ready for production</span>
                        )}
                      </div>
                      <button
                        onClick={() => setShowLockConfirmation(true)}
                        disabled={hasCriticalFailures()}
                        className={`px-6 py-3 rounded-lg transition-all flex items-center gap-2 ${
                          hasCriticalFailures()
                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <Lock className="w-4 h-4" />
                        Lock for Production
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ContentContainer>
      </div>

      {/* Right Side Panel - Permanent */}
      {!isLocked && (
        <div className="w-[400px] border-l border-slate-200 bg-white overflow-y-auto flex-shrink-0">
          <div className="p-6 space-y-6">
            {/* Header with Icon */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-medium text-slate-900">Persona Assistant</h3>
              </div>

              {/* Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setRightPanelTab('role')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    rightPanelTab === 'role'
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Role</span>
                  </div>
                </button>
                <button
                  onClick={() => setRightPanelTab('guidance')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    rightPanelTab === 'guidance'
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Guidance</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div>
          {/* Role Information Tab */}
          {rightPanelTab === 'role' && (
            <div>
              {/* Role Badge */}
              <div className={`rounded-lg p-4 mb-4 border ${
                userRole === 'CONTRIBUTOR' 
                  ? 'bg-slate-50 border-slate-200'
                  : userRole === 'LEAD_SCIENTIST'
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-emerald-50 border-emerald-200'
              }`}>
                <div className="flex items-start gap-3">
                  <Info className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    userRole === 'CONTRIBUTOR' 
                      ? 'text-slate-600'
                      : userRole === 'LEAD_SCIENTIST'
                      ? 'text-blue-600'
                      : 'text-emerald-600'
                  }`} />
                  <div className="flex-1">
                    <div className={`text-sm font-semibold mb-2 ${
                      userRole === 'CONTRIBUTOR' 
                        ? 'text-slate-900'
                        : userRole === 'LEAD_SCIENTIST'
                        ? 'text-blue-900'
                        : 'text-emerald-900'
                    }`}>
                      {t(`roles.${getRoleKey(userRole)}.name`)}
                    </div>
                    <p className={`text-sm ${
                      userRole === 'CONTRIBUTOR' 
                        ? 'text-slate-600'
                        : userRole === 'LEAD_SCIENTIST'
                        ? 'text-blue-700'
                        : 'text-emerald-700'
                    }`}>
                      {t(`roles.${getRoleKey(userRole)}.description`)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Additional Role Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                    Permissions
                  </h4>
                  <ul className="space-y-2">
                    {userRole === 'CONTRIBUTOR' && (
                      <>
                        <li className="text-sm text-slate-600 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Create and edit personas
                        </li>
                        <li className="text-sm text-slate-600 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Request validation
                        </li>
                        <li className="text-sm text-slate-400 flex items-start gap-2">
                          <X className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                          Cannot lock personas
                        </li>
                      </>
                    )}
                    {userRole === 'LEAD_SCIENTIST' && (
                      <>
                        <li className="text-sm text-slate-600 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Full persona management
                        </li>
                        <li className="text-sm text-slate-600 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Lock and save personas
                        </li>
                        <li className="text-sm text-slate-600 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Validate contributor personas
                        </li>
                      </>
                    )}
                    {userRole === 'ADMIN' && (
                      <>
                        <li className="text-sm text-slate-600 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          All permissions
                        </li>
                        <li className="text-sm text-slate-600 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Admin lock capability
                        </li>
                        <li className="text-sm text-slate-600 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Override locked personas
                        </li>
                      </>
                    )}
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-slate-200">
                  <button
                    onClick={() => {
                      // Cycle through roles for demo
                      if (userRole === 'CONTRIBUTOR') setUserRole('LEAD_SCIENTIST');
                      else if (userRole === 'LEAD_SCIENTIST') setUserRole('ADMIN');
                      else setUserRole('CONTRIBUTOR');
                    }}
                    className="w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                  >
                    Switch Role (Demo)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Guidance Tab */}
          {rightPanelTab === 'guidance' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-slate-900 mb-2">
                  {t(`guidance.${activeTab}.title`)}
                </h4>
                <p className="text-sm text-slate-600 mb-4">
                  {t(`guidance.${activeTab}.description`)}
                </p>
              </div>
              
              {/* Tips section */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-3">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm font-medium text-blue-900">
                    Best Practices
                  </div>
                </div>
                <ul className="space-y-2">
                  {(t(`guidance.${activeTab}.tips`, { returnObjects: true }) as string[]).map((tip: string, index: number) => (
                    <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Naming Assistant Modal */}
    {showNamingAssistant && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg text-slate-900">Identify Your Expert</h3>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-slate-600 mb-4">
                Professional naming is required for audit traceability and regulatory compliance.
              </p>

              {/* Name Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Persona Name
                </label>
                <input
                  type="text"
                  value={personaName}
                  onChange={(e) => {
                    setPersonaName(e.target.value);
                    if (e.target.value.trim().length >= 5) {
                      setNameError('');
                    }
                  }}
                  className={`w-full px-4 py-3 border ${
                    nameError ? 'border-red-500' : 'border-slate-300'
                  } rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                  placeholder="Enter a professional name"
                  autoFocus
                />
                {nameError && (
                  <div className="mt-2 text-xs text-red-600 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {nameError}
                  </div>
                )}
                <p className="mt-2 text-xs text-slate-500">
                  Minimum 5 characters. Use a descriptive, professional name.
                </p>
              </div>

              {/* AI Suggestions */}
              {suggestedNames.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <label className="text-sm font-medium text-slate-900">
                      AI Suggestions
                    </label>
                  </div>
                  <div className="space-y-2">
                    {suggestedNames.map((name, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setPersonaName(name);
                          setNameError('');
                        }}
                        className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-400 rounded-lg transition-all text-sm text-slate-900"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <div className="font-medium mb-1">Permanent Record</div>
                  <div>
                    Once named and locked, this persona becomes a permanent regulatory record.
                    The name will appear in all audit logs and cannot be changed.
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={() => {
                  setShowNamingAssistant(false);
                  setSuggestedNames([]);
                }}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (validatePersonaName()) {
                    setShowNamingAssistant(false);
                    setSuggestedNames([]);
                  }
                }}
                disabled={!personaName || personaName.trim().length < 5}
                className={`flex-1 px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  personaName && personaName.trim().length >= 5
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm Name
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lock Persona Confirmation Modal */}
      {showLockModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg text-slate-900">Lock Persona</h3>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-slate-600 mb-4">
                Are you sure you want to lock this persona? This action cannot be undone, and any further changes will require creating a new version.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-900">
                  <div className="font-medium mb-1">This is a permanent action</div>
                  <div className="text-amber-800">
                    Once locked, this persona configuration becomes immutable and can be used in production workflows.
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={() => setShowLockModal(false)}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLockModal(false);
                  handleLockPersona();
                }}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Lock Persona
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lock for Production Confirmation Modal */}
      {showLockConfirmation && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg text-slate-900">Lock for Production</h3>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-slate-600 mb-4">
                You are about to lock this persona for production use. This action is permanent and cannot be undone.
              </p>
              
              {/* Validation Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                <div className="text-sm font-medium text-slate-900 mb-3">Validation Summary</div>
                <div className="space-y-2">
                  {getValidationChecks().map((check) => (
                    <div key={check.id} className="flex items-center gap-2 text-xs">
                      {check.status === 'pass' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      )}
                      <span className="text-slate-700">{check.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  <div className="font-medium mb-1">What happens next?</div>
                  <ul className="text-blue-800 space-y-1 text-xs list-disc list-inside">
                    <li>This configuration becomes immutable</li>
                    <li>A complete audit trail is generated</li>
                    <li>The persona can be used in production workflows</li>
                    <li>Future changes require creating a new version</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={() => setShowLockConfirmation(false)}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLockPersona}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Confirm Lock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5">
          <div className="bg-white border-2 border-green-500 rounded-lg shadow-xl p-4 flex items-start gap-3 max-w-md">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-900 mb-1">
                Persona Locked Successfully
              </div>
              <div className="text-xs text-slate-600">
                "{personaName}" is now locked and validated. You can use it in your research projects.
              </div>
            </div>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}