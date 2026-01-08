// Source-Aware Chat Interface - Phase 3 Deep Interrogation

import { useState, useRef, useEffect } from 'react';
import { Send, Database, FileText, Globe, Copy, Check, ChevronDown, Sparkles, AlertCircle } from 'lucide-react';
import type { ChatMessage, QueryScope, QuerySession } from '../../types/sourceChat';
import type { SourceDocument } from '../../types/manuscript';
import type { StatisticalManifest } from '../analytics-stats/types';
import { processQuery, generateDraftInsert } from '../../utils/sourceChatService';

interface SourceChatProps {
  sources: SourceDocument[];
  selectedSourceIds: string[];
  manifest?: StatisticalManifest;
  onInsertToDraft: (text: string, section?: string) => void;
}

export function SourceChat({ sources, selectedSourceIds, manifest, onInsertToDraft }: SourceChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [scope, setScope] = useState<QueryScope>('all_sources');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showScopeMenu, setShowScopeMenu] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const manifestLinked = !!manifest;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      const response = processQuery(
        {
          userQuestion: inputValue,
          scope,
          selectedSourceIds: scope === 'selected_sources' ? selectedSourceIds : undefined,
          manifestId: manifest?.manifestMetadata.manifestId,
          conversationHistory: messages
        },
        sources,
        manifest
      );

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: response.answer,
        timestamp: Date.now(),
        contextUsed: response.contextUsed,
        citationsFound: response.citationsFound,
        manifestData: response.manifestData,
        canCopyToManuscript: true,
        suggestedSection: response.suggestedSection
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyToManuscript = (message: ChatMessage) => {
    const draftText = generateDraftInsert(message, message.suggestedSection);
    onInsertToDraft(draftText, message.suggestedSection);
    setCopiedMessageId(message.id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const getScopeLabel = (s: QueryScope) => {
    switch (s) {
      case 'all_sources': return 'All Sources';
      case 'selected_sources': return `Selected Sources (${selectedSourceIds.length})`;
      case 'manifest_only': return 'Manifest Only';
    }
  };

  const getScopeIcon = (type: 'manifest' | 'source' | 'global_knowledge') => {
    switch (type) {
      case 'manifest': return <Database className="w-3 h-3" />;
      case 'source': return <FileText className="w-3 h-3" />;
      case 'global_knowledge': return <Globe className="w-3 h-3" />;
    }
  };

  const getScopeColor = (type: 'manifest' | 'source' | 'global_knowledge') => {
    switch (type) {
      case 'manifest': return 'text-green-700 bg-green-100';
      case 'source': return 'text-blue-700 bg-blue-100';
      case 'global_knowledge': return 'text-slate-600 bg-slate-100';
    }
  };

  const getScopeName = (type: 'manifest' | 'source' | 'global_knowledge') => {
    switch (type) {
      case 'manifest': return 'Your Data';
      case 'source': return 'Literature';
      case 'global_knowledge': return 'Medical Knowledge';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-medium text-slate-900">Intelligence Chat</h3>
          </div>
          {manifestLinked && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
              <Database className="w-3 h-3" />
              <span>Manifest Linked</span>
            </div>
          )}
        </div>

        {/* Scope Selector */}
        <div className="relative">
          <button
            onClick={() => setShowScopeMenu(!showScopeMenu)}
            className="w-full flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <span className="text-xs text-slate-700">{getScopeLabel(scope)}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showScopeMenu && (
            <>
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setShowScopeMenu(false)}
              />
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                <button
                  onClick={() => { setScope('all_sources'); setShowScopeMenu(false); }}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 transition-colors"
                >
                  <div className="font-medium text-slate-900">All Sources</div>
                  <div className="text-slate-600 mt-0.5">Query all {sources.length} PDFs + Manifest</div>
                </button>
                <button
                  onClick={() => { setScope('selected_sources'); setShowScopeMenu(false); }}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 transition-colors border-t border-slate-100"
                  disabled={selectedSourceIds.length === 0}
                >
                  <div className="font-medium text-slate-900">Selected Sources ({selectedSourceIds.length})</div>
                  <div className="text-slate-600 mt-0.5">
                    {selectedSourceIds.length === 0 ? 'Select sources first' : 'Query selected PDFs only'}
                  </div>
                </button>
                <button
                  onClick={() => { setScope('manifest_only'); setShowScopeMenu(false); }}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 transition-colors border-t border-slate-100"
                  disabled={!manifestLinked}
                >
                  <div className="font-medium text-slate-900">Manifest Only</div>
                  <div className="text-slate-600 mt-0.5">
                    {!manifestLinked ? 'No manifest available' : 'Query your study data only'}
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Quick Prompts */}
        {messages.length === 0 && (
          <div className="mt-3 space-y-1.5">
            <div className="text-xs text-slate-600 mb-2">Try asking:</div>
            {[
              'Compare our 30-day mortality with VESTAL results',
              'What does the literature say about age thresholds?',
              'Summarize stroke rates across sources'
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setInputValue(prompt)}
                className="w-full text-left px-2 py-1.5 text-xs text-purple-700 bg-purple-50 rounded hover:bg-purple-100 transition-colors"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 mt-8">
            <Database className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm">Ask questions about your data and sources</p>
            <p className="text-xs mt-1">Responses are grounded in your Statistical Manifest and Source Library</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white rounded-lg px-3 py-2'
                    : 'bg-slate-50 border border-slate-200 rounded-lg'
                }`}>
                  {message.role === 'assistant' && (
                    <>
                      {/* Context Used Badges */}
                      {message.contextUsed && message.contextUsed.length > 0 && (
                        <div className="px-3 pt-2 pb-1 flex flex-wrap gap-1">
                          {message.contextUsed
                            .sort((a, b) => a.priority - b.priority)
                            .map((ctx, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${getScopeColor(ctx.type)}`}
                              >
                                {getScopeIcon(ctx.type)}
                                <span>{getScopeName(ctx.type)}</span>
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Message Content */}
                      <div className="px-3 py-2">
                        <p className="text-sm text-slate-900 leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>

                      {/* Manifest Data Used */}
                      {message.manifestData && message.manifestData.length > 0 && (
                        <div className="px-3 pb-2">
                          <div className="text-xs font-medium text-slate-700 mb-1.5">Data from your study:</div>
                          <div className="space-y-1">
                            {message.manifestData.map((data, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs">
                                <Database className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-700">
                                  <span className="font-mono font-medium">{data.variable}</span>
                                  {' = '}
                                  <span className="font-medium">{typeof data.value === 'number' ? data.value.toFixed(3) : data.value}</span>
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Citations Found */}
                      {message.citationsFound && message.citationsFound.length > 0 && (
                        <div className="px-3 pb-2">
                          <div className="text-xs font-medium text-slate-700 mb-1.5">Sources referenced:</div>
                          <div className="space-y-2">
                            {message.citationsFound.map((citation, idx) => (
                              <div key={idx} className="bg-white border border-slate-200 rounded p-2">
                                <div className="flex items-start gap-2 mb-1">
                                  <FileText className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-slate-900 truncate">
                                      {citation.sourceName}
                                      {citation.page && <span className="text-slate-600 ml-1">(p.{citation.page})</span>}
                                    </div>
                                    <div className="text-xs text-slate-600 mt-1 italic line-clamp-2">
                                      "{citation.snippet}"
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      {message.canCopyToManuscript && (
                        <div className="px-3 pb-2 pt-1 border-t border-slate-200 flex items-center justify-between">
                          <div className="text-xs text-slate-600">
                            {message.suggestedSection && (
                              <span>Suggested: <span className="font-medium capitalize">{message.suggestedSection}</span></span>
                            )}
                          </div>
                          <button
                            onClick={() => handleCopyToManuscript(message)}
                            className="flex items-center gap-1.5 px-2 py-1 text-xs text-purple-700 hover:bg-purple-50 rounded transition-colors"
                          >
                            {copiedMessageId === message.id ? (
                              <>
                                <Check className="w-3 h-3" />
                                Copied to {message.suggestedSection || 'draft'}
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Copy to Manuscript
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {message.role === 'user' && (
                    <p className="text-sm">{message.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span>Analyzing sources...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-slate-200 bg-white">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={manifestLinked ? "Ask about your data or sources..." : "Ask about sources..."}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            rows={2}
            disabled={isProcessing}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs text-slate-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
