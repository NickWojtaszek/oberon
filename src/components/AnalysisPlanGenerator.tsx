import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface Protocol {
  id: string;
  name: string;
  status: string;
}

interface Persona {
  id: string;
  name: string;
  status: 'locked' | 'draft';
}

export function AnalysisPlanGenerator() {
  const [selectedProtocol, setSelectedProtocol] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const protocols: Protocol[] = [
    { id: '1', name: 'PROTO-2024-001: Phase II Oncology Trial', status: 'Active' },
    { id: '2', name: 'PROTO-2024-002: Cardiovascular Safety Study', status: 'Active' },
    { id: '3', name: 'PROTO-2023-045: Long-term Follow-up Study', status: 'Completed' },
  ];

  const personas: Persona[] = [
    { id: 'system-statistician', name: 'Clinical Statistician (System-Built)', status: 'locked' },
    { id: '1', name: 'Clinical Safety Reviewer', status: 'locked' },
    { id: '2', name: 'Efficacy Analyst', status: 'locked' },
    { id: '3', name: 'Statistical Validator', status: 'draft' },
  ];

  const lockedPersonas = personas.filter((p) => p.status === 'locked');
  const hasNoLockedPersonas = lockedPersonas.length === 0;
  const canGenerate = selectedProtocol && selectedPersona && !isGenerating;

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
      // In a real app, this would navigate to the results view
    }, 2000);
  };

  return (
    <div className="p-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-[1600px] mx-auto">
        <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-slate-900 mb-2">Generate Analysis Plan</h1>
            <p className="text-slate-600">
              Create a structured analysis plan driven by protocol specifications and persona constraints
            </p>
          </div>

          {/* Warning for no locked personas */}
          {hasNoLockedPersonas && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-yellow-900">No Locked Personas Available</div>
                <div className="text-yellow-800 text-sm mt-1">
                  Analysis plans require a locked persona to ensure reproducibility. Please lock at
                  least one persona before generating an analysis plan.
                </div>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Protocol Selector */}
            <div>
              <label className="block text-slate-900 mb-2">
                Select Protocol
                <span className="text-red-600 ml-1">*</span>
              </label>
              <select
                value={selectedProtocol}
                onChange={(e) => setSelectedProtocol(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a protocol...</option>
                {protocols.map((protocol) => (
                  <option key={protocol.id} value={protocol.id}>
                    {protocol.name}
                  </option>
                ))}
              </select>
              <p className="text-slate-600 text-sm mt-2">
                Select the clinical trial protocol for which you want to generate an analysis plan
              </p>
            </div>

            {/* Persona Selector */}
            <div>
              <label className="block text-slate-900 mb-2">
                Select Persona
                <span className="text-red-600 ml-1">*</span>
              </label>
              <select
                value={selectedPersona}
                onChange={(e) => setSelectedPersona(e.target.value)}
                disabled={hasNoLockedPersonas}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <option value="">Choose a persona...</option>
                {lockedPersonas.map((persona) => (
                  <option key={persona.id} value={persona.id}>
                    {persona.name} (Locked)
                  </option>
                ))}
              </select>
              <p className="text-slate-600 text-sm mt-2">
                Only locked personas are available to ensure analysis plan reproducibility
              </p>
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-6 border-t border-slate-200">
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Analysis Plan...</span>
                </>
              ) : (
                'Generate Analysis Plan'
              )}
            </button>
            <p className="text-slate-600 text-sm mt-3 text-center">
              Generation typically takes 30-60 seconds
            </p>
          </div>

          {/* Info Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <div className="text-blue-900 mb-2">What will be generated?</div>
            <ul className="text-blue-800 space-y-1 ml-4 list-disc">
              <li>Study objectives and endpoints</li>
              <li>Statistical analysis methods</li>
              <li>Assumptions and constraints</li>
              <li>Persona-driven interpretation guidelines</li>
              <li>Citation and reference framework</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}