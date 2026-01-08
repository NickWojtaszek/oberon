// Regulatory Assistant - Context-Aware Compliance Guidance (Pane C Utility)

import { useState } from 'react';
import { Bot, FileQuestion, AlertCircle, BookOpen, ExternalLink, Sparkles, Calendar } from 'lucide-react';
import type { RegulatoryContext, Country, EthicsCompliance } from '../../types/ethics';

interface RegulatoryAssistantProps {
  context: RegulatoryContext;
  ethicsCompliance?: EthicsCompliance | null;
  onQuestionSelect?: (questionId: string) => void;
}

interface QuickAction {
  id: string;
  label: string;
  question: string;
  icon: typeof FileQuestion;
}

interface KnowledgeEntry {
  question: string;
  answer: string;
  citations: string[];
  relevantFor: Country[];
}

// Pre-indexed regulatory knowledge base (MVP - templated responses)
const REGULATORY_KNOWLEDGE: KnowledgeEntry[] = [
  {
    question: "What documents does Poland require for initial IRB submission?",
    answer: "For initial ethics committee review in Poland, you must submit:\n\n1. **Protocol** (Polish or English version)\n2. **Informed Consent Form** (ICF) - must be in Polish\n3. **PI Curriculum Vitae** and GCP certification\n4. **Insurance certificate** for patient injury coverage\n5. **Ethics application form** (specific to your committee)\n6. **Patient Information Sheet** (Polish language)\n\nFor interventional trials involving medicinal products, additional URPL (Polish pharmaceutical office) documentation is required.",
    citations: [
      "Polish Act on Medicinal Products (2001), Art. 37a",
      "EU Clinical Trials Regulation 536/2014, Art. 25"
    ],
    relevantFor: ['Poland', 'EU']
  },
  {
    question: "What are the review timelines for Poland?",
    answer: "Polish bioethics committees typically operate on the following timelines:\n\n**Initial Review**: 60 calendar days from submission (as per EU CTR harmonization)\n\n**Clock Stops**: Committee may request clarifications - you have 30 days to respond\n\n**Amendments**:\n- Substantial amendments: 38 days\n- Non-substantial amendments: Notification only (no approval needed)\n\n**Continuing Review**: Annual review required for studies lasting >12 months\n\nNote: These are maximum timelines. Many committees respond faster for low-risk studies.",
    citations: [
      "EU Regulation 536/2014, Art. 6-8",
      "Polish Ministry of Health Guidelines 2020"
    ],
    relevantFor: ['Poland', 'EU']
  },
  {
    question: "When is a substantial amendment required?",
    answer: "A substantial amendment filing is **mandatory** when changes could impact:\n\n1. **Safety of participants** (e.g., dose modifications, new safety endpoints)\n2. **Study design** (primary endpoint changes, inclusion/exclusion criteria)\n3. **Informed consent** (adding new procedures, risks, or benefits)\n4. **Study population** (age range, disease severity changes)\n\n**Non-substantial changes** (notification only):\n- Administrative updates (contact information)\n- Minor protocol clarifications\n- Statistical analysis plan refinements (if not affecting safety)\n\n**Warning**: Implementing changes before committee approval is a serious violation under EU CTR.",
    citations: [
      "EU Regulation 536/2014, Art. 14-18",
      "EMA Guideline on Substantial Modifications (2017)"
    ],
    relevantFor: ['Poland', 'EU', 'UK', 'US']
  },
  {
    question: "What are the GDPR requirements for clinical research in Poland?",
    answer: "Under GDPR, clinical research in Poland requires:\n\n**Legal Basis**: Art. 9(2)(j) GDPR - processing necessary for scientific research\n\n**Mandatory Documents**:\n1. **Data Processing Agreement** with sponsor/CRO\n2. **Privacy Notice** in informed consent (must specify data retention, transfer details)\n3. **Data Protection Impact Assessment** (DPIA) for high-risk studies\n\n**Participant Rights**:\n- Right to access data ✅\n- Right to rectification ✅\n- Right to erasure ❌ (limited for research necessity)\n- Right to object ❌ (not applicable to scientific research with public interest)\n\n**Data Retention**: Up to 25 years for medicinal product trials (per GCP), 10 years minimum.\n\n**Cross-border transfers**: Adequacy decision required for non-EU data transfers.",
    citations: [
      "GDPR Regulation 2016/679, Art. 9, 17, 21",
      "Polish Personal Data Protection Act (2018)",
      "ICH-GCP E6(R2), Section 4.9"
    ],
    relevantFor: ['Poland', 'EU']
  },
  {
    question: "How do I report serious adverse events (SAEs) in Poland?",
    answer: "SAE reporting in Poland follows EU CTR timelines:\n\n**Fatal/Life-threatening SAEs**:\n- Initial report: Within **7 days** of awareness\n- Follow-up report: Within **8 additional days** (max 15 days total)\n\n**Other SAEs**:\n- Report within **15 days** of awareness\n\n**Reporting Channels**:\n1. **URPL** (Office for Registration of Medicinal Products) - for drug trials\n2. **Bioethics Committee** that approved your study\n3. **EudraVigilance** for EU multi-center trials\n\n**Documentation Required**:\n- CIOMS Form or equivalent\n- Causality assessment\n- Protocol deviation report (if SAE related to protocol violation)\n\n**Warning**: Failure to report within timelines can result in study suspension.",
    citations: [
      "EU Regulation 536/2014, Art. 41-43",
      "Polish Pharmaceutical Law (2001), Art. 37n",
      "ICH-GCP E6(R2), Section 4.11"
    ],
    relevantFor: ['Poland', 'EU']
  }
];

export function RegulatoryAssistant({ context, ethicsCompliance, onQuestionSelect }: RegulatoryAssistantProps) {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  // Check for IRB expiration
  const isExpired = ethicsCompliance?.expirationDate && 
    new Date(ethicsCompliance.expirationDate).getTime() < Date.now();

  const isRenewalDueSoon = ethicsCompliance?.renewalDueDate && 
    new Date(ethicsCompliance.renewalDueDate).getTime() - Date.now() < (30 * 24 * 60 * 60 * 1000) &&
    !isExpired;

  // Quick Actions based on context
  const getQuickActions = (): QuickAction[] => {
    const actions: QuickAction[] = [
      {
        id: 'timelines',
        label: 'Check Poland Review Timelines',
        question: 'What are the review timelines for Poland?',
        icon: FileQuestion
      },
      {
        id: 'documents',
        label: 'List Mandatory Documents',
        question: 'What documents does Poland require for initial IRB submission?',
        icon: BookOpen
      }
    ];

    if (context.studyType === 'Drug' || context.studyType === 'Device') {
      actions.push({
        id: 'sae',
        label: 'Safety Reporting Rules',
        question: 'How do I report serious adverse events (SAEs) in Poland?',
        icon: AlertCircle
      });
    }

    return actions;
  };

  const handleQuickAction = (question: string) => {
    const entry = REGULATORY_KNOWLEDGE.find(k => k.question === question);
    if (entry) {
      setSelectedQuestionId(question);
    }
  };

  const currentAnswer = selectedQuestionId 
    ? REGULATORY_KNOWLEDGE.find(k => k.question === selectedQuestionId)
    : null;

  const relevantQuestions = REGULATORY_KNOWLEDGE.filter(k => 
    k.relevantFor.includes(context.country) || k.relevantFor.includes('EU')
  );

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-4">
        <div className="flex items-center gap-2 mb-1">
          <Bot className="w-5 h-5 text-purple-200" />
          <h3 className="font-medium text-white">Regulatory Assistant</h3>
        </div>
        <div className="text-xs text-purple-200">
          {context.country} · {context.studyType} · Phase {context.studyPhase}
        </div>
      </div>

      {/* IRB Approval Status Alerts */}
      {isExpired && (
        <div className="bg-red-600 px-4 py-3 border-b border-red-700">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-200 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-medium text-white">IRB Approval Expired</div>
              <div className="text-xs text-red-100 mt-1">
                Ethics approval expired on {ethicsCompliance?.expirationDate && new Date(ethicsCompliance.expirationDate).toLocaleDateString()}. 
                Research activities must cease until renewal is approved.
              </div>
              <button className="mt-2 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-medium transition-colors">
                Submit Renewal
              </button>
            </div>
          </div>
        </div>
      )}

      {isRenewalDueSoon && (
        <div className="bg-amber-600 px-4 py-3 border-b border-amber-700">
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-amber-200 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Continuing Review Due Soon</div>
              <div className="text-xs text-amber-100 mt-1">
                Annual review due by {ethicsCompliance?.renewalDueDate && new Date(ethicsCompliance.renewalDueDate).toLocaleDateString()}
              </div>
              <button className="mt-2 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded text-xs font-medium transition-colors">
                Prepare Renewal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="p-4 bg-white border-b border-slate-200">
        <div className="text-xs font-medium text-slate-700 mb-2 uppercase tracking-wide">
          Quick Actions
        </div>
        <div className="space-y-2">
          {getQuickActions().map(action => {
            const ActionIcon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.question)}
                className="w-full flex items-center gap-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-sm text-purple-900 transition-colors text-left"
              >
                <ActionIcon className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Answer Display */}
      <div className="flex-1 overflow-y-auto p-4">
        {currentAnswer ? (
          <div className="space-y-4">
            {/* Question */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <FileQuestion className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm font-medium text-purple-900">
                  {currentAnswer.question}
                </div>
              </div>
            </div>

            {/* Answer */}
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {currentAnswer.answer}
              </div>
            </div>

            {/* Citations Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <div className="text-xs font-medium text-blue-900 uppercase tracking-wide">
                  Regulatory Citations
                </div>
              </div>
              <div className="space-y-1.5">
                {currentAnswer.citations.map((citation, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-blue-800">
                    <ExternalLink className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>{citation}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-amber-900">
                  <span className="font-medium">Disclaimer:</span> This assistant provides general guidance only. 
                  Consult your institution's IRB/Ethics Committee for binding decisions.
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedQuestionId(null)}
              className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              Ask Another Question
            </button>
          </div>
        ) : (
          <div>
            {/* Browse Questions */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-slate-900">Common Questions</div>
                <button
                  onClick={() => setShowAllQuestions(!showAllQuestions)}
                  className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                >
                  {showAllQuestions ? 'Show Less' : `View All (${relevantQuestions.length})`}
                </button>
              </div>
              <div className="space-y-2">
                {relevantQuestions.slice(0, showAllQuestions ? undefined : 3).map((entry, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedQuestionId(entry.question)}
                    className="w-full text-left px-3 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 transition-colors"
                  >
                    {entry.question}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Feature Teaser */}
            <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-purple-900 mb-1">
                    AI-Powered Search Coming Soon
                  </div>
                  <div className="text-xs text-purple-700 leading-relaxed">
                    Future versions will include natural language queries with RAG-powered retrieval 
                    from EU CTR, GDPR, and local regulations.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}