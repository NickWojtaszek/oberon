// Autonomy Slider - 3-Position AI Control (Phase 4)

import { Shield, UserCheck, Sparkles } from 'lucide-react';
import type { AIMode } from '../../types/aiMode';

interface AutonomySliderProps {
  mode: AIMode;
  onModeChange: (mode: AIMode) => void;
}

export function AutonomySlider({ mode, onModeChange }: AutonomySliderProps) {
  const modes: Array<{ id: AIMode; label: string; icon: typeof Shield; description: string; color: string }> = [
    {
      id: 'audit',
      label: 'Audit Mode',
      icon: Shield,
      description: 'AI monitors for errors only',
      color: 'blue'
    },
    {
      id: 'co-pilot',
      label: 'Co-Pilot',
      icon: UserCheck,
      description: 'AI assists with flow & grounding',
      color: 'purple'
    },
    {
      id: 'pilot',
      label: 'Pilot',
      icon: Sparkles,
      description: 'AI drafts full sections',
      color: 'indigo'
    }
  ];

  const currentIndex = modes.findIndex(m => m.id === mode);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <label className="block text-xs font-medium text-slate-700 mb-3">AI Autonomy Level</label>
      
      {/* Slider Track */}
      <div className="relative mb-4">
        <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200 rounded-full" />
        <div 
          className="absolute top-6 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${(currentIndex / (modes.length - 1)) * 100}%` }}
        />
        
        {/* Mode Buttons */}
        <div className="relative flex justify-between">
          {modes.map((m, index) => {
            const Icon = m.icon;
            const isActive = mode === m.id;
            const isPast = index < currentIndex;
            
            return (
              <button
                key={m.id}
                onClick={() => onModeChange(m.id)}
                className={`flex flex-col items-center transition-all ${
                  isActive ? 'scale-110' : 'scale-100'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    isActive
                      ? `bg-${m.color}-600 border-${m.color}-600 text-white shadow-lg`
                      : isPast
                      ? `bg-${m.color}-100 border-${m.color}-300 text-${m.color}-600`
                      : 'bg-white border-slate-300 text-slate-400 hover:border-slate-400'
                  }`}
                  style={{
                    backgroundColor: isActive 
                      ? m.color === 'blue' ? '#2563EB' : m.color === 'purple' ? '#9333EA' : '#4F46E5'
                      : isPast
                      ? m.color === 'blue' ? '#DBEAFE' : m.color === 'purple' ? '#F3E8FF' : '#E0E7FF'
                      : '#ffffff',
                    borderColor: isActive
                      ? m.color === 'blue' ? '#2563EB' : m.color === 'purple' ? '#9333EA' : '#4F46E5'
                      : isPast
                      ? m.color === 'blue' ? '#93C5FD' : m.color === 'purple' ? '#D8B4FE' : '#C7D2FE'
                      : '#CBD5E1',
                    color: isActive
                      ? '#ffffff'
                      : isPast
                      ? m.color === 'blue' ? '#2563EB' : m.color === 'purple' ? '#9333EA' : '#4F46E5'
                      : '#94A3B8'
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-xs font-medium ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                    {m.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 max-w-[100px]">
                    {m.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Mode Description */}
      <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <div className="text-xs text-slate-700">
          {mode === 'audit' && (
            <div>
              <span className="font-medium">Audit Mode Active:</span> AI will not modify your text. 
              It only monitors for statistical mismatches and citation errors against your Statistical Manifest.
            </div>
          )}
          {mode === 'co-pilot' && (
            <div>
              <span className="font-medium">Co-Pilot Active:</span> AI assists with sentence flow, 
              suggests grounding citations from your Source Library, and highlights weak claims.
            </div>
          )}
          {mode === 'pilot' && (
            <div>
              <span className="font-medium">Pilot Active:</span> AI can draft complete sections 
              based on your Recursive Schema and Statistical Manifest. All drafts require PI review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
