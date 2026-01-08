import { Check, AlertTriangle, X } from 'lucide-react';

interface Claim {
  id: string;
  text: string;
  inferenceType: string;
  state: 'cited' | 'heuristic' | 'suppressed';
  suppressionReason?: string;
}

interface LivePreviewPanelProps {
  allowedInferences: string[];
  disallowedInferences: string[];
}

export function LivePreviewPanel({ allowedInferences, disallowedInferences }: LivePreviewPanelProps) {
  // Mock claims that respond to persona constraints
  const claims: Claim[] = [
    {
      id: '1',
      text: 'Primary endpoint showed a 12% improvement compared to the historical benchmark of 45%',
      inferenceType: 'Benchmark Comparison',
      state: allowedInferences.includes('benchmark') ? 'cited' : 'suppressed',
      suppressionReason: 'Suppressed due to persona constraints: Benchmark Comparison is not allowed',
    },
    {
      id: '2',
      text: 'Adverse event rates decreased progressively across the 24-week treatment period',
      inferenceType: 'Descriptive Trend Analysis',
      state: allowedInferences.includes('trend') ? 'heuristic' : 'suppressed',
      suppressionReason: 'Suppressed due to persona constraints: Descriptive Trend Analysis is not allowed',
    },
    {
      id: '3',
      text: 'This treatment demonstrates superior efficacy and is recommended for Phase III trials',
      inferenceType: 'Efficacy Claims',
      state: disallowedInferences.includes('efficacy') ? 'suppressed' : 'cited',
      suppressionReason: 'Suppressed due to persona constraints: Efficacy Claims are explicitly disallowed',
    },
    {
      id: '4',
      text: '15 subjects had protocol deviations related to visit window compliance',
      inferenceType: 'Protocol Deviation Highlighting',
      state: allowedInferences.includes('deviation') ? 'cited' : 'suppressed',
      suppressionReason: 'Suppressed due to persona constraints: Protocol Deviation Highlighting is not allowed',
    },
  ];

  return (
    <div className="sticky top-0">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg text-slate-900">Live Preview</h3>
            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
              Mock Data
            </span>
          </div>
          <p className="text-sm text-slate-600">
            See how persona constraints affect AI output
          </p>
        </div>

        {/* Mock Study Summary */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-3">
          <div className="text-sm font-medium text-slate-900">Primary Efficacy Endpoint</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-slate-600">Outcome Value</div>
              <div className="text-slate-900">57.3%</div>
            </div>
            <div>
              <div className="text-xs text-slate-600">Benchmark</div>
              <div className="text-slate-900">45.0%</div>
            </div>
            <div>
              <div className="text-xs text-slate-600">Sample Size</div>
              <div className="text-slate-900">N = 234</div>
            </div>
            <div>
              <div className="text-xs text-slate-600">p-value</div>
              <div className="text-slate-900">0.0047</div>
            </div>
          </div>
        </div>

        {/* AI-Generated Claims */}
        <div>
          <div className="text-sm font-medium text-slate-900 mb-3">AI-Generated Claims</div>
          <div className="space-y-3">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className={`p-3 rounded-lg border-2 ${
                  claim.state === 'cited'
                    ? 'border-green-300 bg-green-50'
                    : claim.state === 'heuristic'
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                {/* Claim Header */}
                <div className="flex items-start gap-2 mb-2">
                  {claim.state === 'cited' && (
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  )}
                  {claim.state === 'heuristic' && (
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  )}
                  {claim.state === 'suppressed' && (
                    <X className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div
                      className={`text-xs ${
                        claim.state === 'suppressed'
                          ? 'line-through text-slate-400'
                          : claim.state === 'cited'
                          ? 'text-green-900'
                          : 'text-yellow-900'
                      }`}
                    >
                      {claim.text}
                    </div>
                  </div>
                </div>

                {/* Inference Type Tag */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block px-2 py-0.5 bg-white rounded text-xs text-slate-600 border border-slate-200">
                    {claim.inferenceType}
                  </span>
                  {claim.state === 'cited' && (
                    <span className="text-xs font-medium text-green-700">CITED</span>
                  )}
                  {claim.state === 'heuristic' && (
                    <span className="text-xs font-medium text-yellow-700">HEURISTIC</span>
                  )}
                  {claim.state === 'suppressed' && (
                    <span className="text-xs font-medium text-slate-500">SUPPRESSED</span>
                  )}
                </div>

                {/* Warning/Suppression Message */}
                {claim.state === 'heuristic' && (
                  <div className="text-xs text-yellow-800 bg-yellow-100 rounded p-2">
                    No supporting document found
                  </div>
                )}
                {claim.state === 'suppressed' && claim.suppressionReason && (
                  <div className="text-xs text-red-800 bg-red-100 rounded p-2">
                    {claim.suppressionReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-600">
            Changes to inference rules update this preview in real-time
          </p>
        </div>
      </div>
    </div>
  );
}