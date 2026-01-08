// Regulatory Assistant - Context-Aware Compliance Q&A (Pane C Utility)

import { useState } from 'react';
import { Shield, BookOpen, Send, Sparkles, AlertTriangle, Check } from 'lucide-react';
import { REGULATORY_KNOWLEDGE_BASE, QUICK_ACTIONS, searchRegulatoryKnowledge, getQuestionById } from '../../data/regulatoryKnowledge';
import type { RegulatoryQuestion, RegulatoryContext } from '../../types/ethics';

interface RegulatoryAssistantProps {
  context: RegulatoryContext;
}

interface ChatMessage {
  id: string;
  type: 'question' | 'answer';
  content: string;
  question?: RegulatoryQuestion;
  timestamp: string;
}

export function RegulatoryAssistant({ context }: RegulatoryAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      type: 'answer',
      content: `Hello! I'm your Regulatory Assistant for ${context.country} clinical research.\n\nI can help you understand compliance requirements for ${context.studyType} studies (Phase ${context.studyPhase}).\n\nUse the Quick Actions below or ask a question.`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuickAction = (questionId: string) => {
    const question = getQuestionById(questionId);
    if (!question) return;

    addMessage(question.question, 'question');
    setTimeout(() => {
      addMessage(question.answer, 'answer', question);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    const query = inputValue.trim();
    addMessage(query, 'question');
    setInputValue('');
    setIsProcessing(true);

    setTimeout(() => {
      const results = searchRegulatoryKnowledge(query, context.country);
      
      if (results.length > 0) {
        addMessage(results[0].answer, 'answer', results[0]);
      } else {
        addMessage(
          `I couldn't find specific guidance for "${query}" in my knowledge base.\n\nPlease consult your institution's IRB/Ethics Committee for case-specific advice.\n\nYou can also try rephrasing your question or use the Quick Actions below.`,
          'answer'
        );
      }
      setIsProcessing(false);
    }, 500);
  };

  const addMessage = (content: string, type: 'question' | 'answer', question?: RegulatoryQuestion) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      type,
      content,
      question,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-blue-200 bg-blue-600">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-white" />
          <div>
            <h3 className="text-white font-medium">Regulatory Assistant</h3>
            <p className="text-blue-100 text-xs mt-0.5">
              {context.country} · Phase {context.studyPhase} · {context.studyType}
            </p>
          </div>
        </div>
      </div>

      {/* Context Badge */}
      <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-800">
          <strong>Disclaimer:</strong> This assistant provides general guidance only. Always consult your institution's IRB/Ethics Committee for binding decisions.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={msg.type === 'question' ? 'flex justify-end' : 'flex justify-start'}>
            <div className={`max-w-[90%] ${msg.type === 'question' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200'} rounded-lg px-4 py-3`}>
              {msg.type === 'answer' && (
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">Regulatory Assistant</span>
                </div>
              )}
              <div className={`text-sm whitespace-pre-wrap ${msg.type === 'answer' ? 'text-slate-700' : 'text-white'}`}>
                {msg.content}
              </div>

              {/* Citation Box */}
              {msg.question && msg.question.citations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-blue-100">
                  <div className="flex items-start gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-blue-600 mb-1">Sources:</div>
                      <ul className="text-xs text-slate-600 space-y-1">
                        {msg.question.citations.map((citation, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{citation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-2 text-xs opacity-60">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-xs text-slate-600 ml-2">Searching regulations...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
        <div className="text-xs font-medium text-slate-600 mb-2">Quick Actions</div>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              onClick={() => handleQuickAction(action.questionId)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-slate-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about regulations, timelines, requirements..."
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isProcessing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
