import { AlertTriangle, CheckCircle2, Sparkles, GitBranch, Shield, Book } from 'lucide-react';

interface DependencyHelpSidebarProps {
  isEmpty: boolean;
}

export function DependencyHelpSidebar({ isEmpty }: DependencyHelpSidebarProps) {
  if (isEmpty) {
    return (
      <div className="space-y-6">
        {/* Getting Started */}
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
          <div className="flex items-start gap-3">
            <GitBranch className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-indigo-900 mb-2">Getting Started with Dependencies</h4>
              <p className="text-sm text-indigo-800 leading-relaxed">
                Dependencies define conditional logic between variables in your protocol. Use them to:
              </p>
              <ul className="text-sm text-indigo-800 mt-2 space-y-1 ml-4 list-disc">
                <li>Show/hide fields based on previous answers</li>
                <li>Create branching logic for different patient cohorts</li>
                <li>Enforce data collection order</li>
                <li>Implement protocol-specific validation rules</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How to Add */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <Book className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">How to Add Dependencies</h4>
              <ol className="text-sm text-blue-800 space-y-2 ml-4 list-decimal">
                <li>Navigate to the <strong>Schema Builder</strong> tab</li>
                <li>Click the <strong>link icon</strong> (🔗) on any variable</li>
                <li>Select the target variable to create a relationship</li>
                <li>Define the condition (equals, contains, etc.)</li>
                <li>Choose the action (show, hide, require, disable)</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-emerald-900 mb-2">Best Practices</h4>
              <ul className="text-sm text-emerald-800 space-y-2">
                <li>• Start simple - add complexity gradually</li>
                <li>• Test each dependency before adding more</li>
                <li>• Document the reasoning for complex logic</li>
                <li>• Avoid circular dependencies (A → B → A)</li>
                <li>• Keep rules aligned with protocol requirements</li>
              </ul>
            </div>
          </div>
        </div>

        {/* AI Verification Suggestion */}
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-purple-900 mb-2">AI Protocol Verification</h4>
              <p className="text-sm text-purple-800 leading-relaxed mb-3">
                Consider enabling an <strong>AI Governance Persona</strong> to automatically:
              </p>
              <ul className="text-sm text-purple-800 space-y-1 ml-4 list-disc">
                <li>Validate dependency logic for consistency</li>
                <li>Check for circular dependencies</li>
                <li>Suggest missing conditional rules</li>
                <li>Verify compliance with protocol requirements</li>
              </ul>
              <button className="mt-3 w-full px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
                Enable AI Verification
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dependency Analysis */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <GitBranch className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Understanding Your Graph</h4>
            <p className="text-sm text-blue-800 leading-relaxed mb-2">
              The dependency graph visualizes conditional relationships between variables:
            </p>
            <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
              <li><strong>Source</strong> - Variable with conditional logic</li>
              <li><strong>Target</strong> - Variable affected by the condition</li>
              <li><strong>If/Then</strong> - Conditional rule structure</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Types Guide */}
      <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-emerald-900 mb-2">Action Types Explained</h4>
            <div className="space-y-2 text-sm text-emerald-800">
              <div>
                <span className="font-medium">Show:</span> Display target variable when condition is met
              </div>
              <div>
                <span className="font-medium">Hide:</span> Conceal target variable when condition is met
              </div>
              <div>
                <span className="font-medium">Require:</span> Make target variable mandatory
              </div>
              <div>
                <span className="font-medium">Disable:</span> Prevent target variable from being edited
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Governance Warnings */}
      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-900 mb-2">Governance Checks</h4>
            <p className="text-sm text-amber-800 leading-relaxed mb-2">
              Ensure your dependency logic meets regulatory standards:
            </p>
            <ul className="text-sm text-amber-800 space-y-1 ml-4 list-disc">
              <li>All critical safety fields must be visible</li>
              <li>Avoid hiding required regulatory endpoints</li>
              <li>Document complex branching logic in protocol</li>
              <li>Test all dependency paths before locking</li>
              <li>Ensure adverse event fields are never disabled</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Circular Dependency Warning */}
      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900 mb-2">Avoid Circular Dependencies</h4>
            <p className="text-sm text-red-800 leading-relaxed">
              Circular dependencies create logical impossibilities. Examples to avoid:
            </p>
            <ul className="text-sm text-red-800 mt-2 space-y-1 ml-4 list-disc">
              <li>Field A shows Field B, Field B shows Field A</li>
              <li>Field A requires Field B, Field B requires Field C, Field C requires Field A</li>
            </ul>
            <p className="text-sm text-red-800 mt-2 italic">
              The system prevents some circular patterns but always review your logic carefully.
            </p>
          </div>
        </div>
      </div>

      {/* AI Governance Persona */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-purple-900 mb-2">AI Protocol Auditor</h4>
            <p className="text-sm text-purple-800 leading-relaxed mb-3">
              Enable automated governance review to validate:
            </p>
            <ul className="text-sm text-purple-800 space-y-1 ml-4 list-disc">
              <li>✓ No circular dependencies detected</li>
              <li>✓ Safety-critical fields always visible</li>
              <li>✓ Logic consistency across branches</li>
              <li>✓ ICH-GCP compliance for data flow</li>
              <li>✓ Complete dependency documentation</li>
            </ul>
            <button className="mt-3 w-full px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              Run AI Audit
            </button>
          </div>
        </div>
      </div>

      {/* Regulatory Compliance */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Regulatory Requirements</h4>
            <p className="text-sm text-slate-700 leading-relaxed mb-2">
              <strong>ICH E6(R2) GCP:</strong> All protocol deviations and conditional logic must be:
            </p>
            <ul className="text-sm text-slate-700 space-y-1 ml-4 list-disc">
              <li>Documented in the protocol or amendment</li>
              <li>Reviewed and approved by the IRB/EC</li>
              <li>Traceable in the audit trail</li>
              <li>Validated before database lock</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
