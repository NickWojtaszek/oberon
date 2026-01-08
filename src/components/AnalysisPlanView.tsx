import { Info, FileText, BarChart3, Target, BookOpen } from 'lucide-react';

export function AnalysisPlanView() {
  return (
    <div className="p-8 bg-slate-50">
      <div className="max-w-[1600px] mx-auto">
        {/* Persona Attribution Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-blue-900 mb-1">
              This analysis plan was generated using the{' '}
              <span className="font-semibold">Clinical Safety Reviewer</span> persona (v3, locked)
            </div>
            <div className="text-blue-800 text-sm">
              All interpretations and recommendations are constrained by the persona's regulatory and
              safety guidelines. Protocol: PROTO-2024-001
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-slate-900 mb-2">Statistical Analysis Plan</h1>
          <div className="text-slate-600">
            PROTO-2024-001: Phase II Oncology Trial
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm text-slate-600">
            <span>Generated: January 2, 2026</span>
            <span>•</span>
            <span>Version 1.0</span>
            <span>•</span>
            <span className="px-2 py-1 bg-green-50 text-green-700 rounded border border-green-300">
              Approved
            </span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Objectives */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-blue-600" />
              <h2 className="text-slate-900">Study Objectives</h2>
            </div>
            <div className="space-y-4 text-slate-900">
              <div>
                <div className="font-medium mb-2">Primary Objective</div>
                <p className="text-slate-600">
                  To evaluate the efficacy of Treatment A compared to placebo in patients with
                  advanced non-small cell lung cancer, as measured by progression-free survival at 24
                  weeks.
                  <sup className="text-blue-600 ml-1 cursor-pointer">[1]</sup>
                </p>
              </div>
              <div>
                <div className="font-medium mb-2">Secondary Objectives</div>
                <ul className="list-disc ml-6 space-y-2 text-slate-600">
                  <li>
                    Assess overall survival at 12 months
                    <sup className="text-blue-600 ml-1 cursor-pointer">[1]</sup>
                  </li>
                  <li>
                    Evaluate objective response rate using RECIST 1.1 criteria
                    <sup className="text-blue-600 ml-1 cursor-pointer">[2]</sup>
                  </li>
                  <li>
                    Characterize safety and tolerability profile
                    <sup className="text-blue-600 ml-1 cursor-pointer">[1]</sup>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Endpoints */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h2 className="text-slate-900">Analysis Endpoints</h2>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-600 pl-4">
                <div className="font-medium text-slate-900 mb-2">Primary Endpoint</div>
                <div className="text-slate-600 mb-2">
                  Progression-free survival (PFS) at 24 weeks, defined as time from randomization to
                  disease progression or death from any cause.
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-medium">Analysis Method:</span> Kaplan-Meier survival analysis
                  with log-rank test
                  <sup className="text-blue-600 ml-1 cursor-pointer">[3]</sup>
                </div>
              </div>

              <div className="border-l-4 border-slate-300 pl-4">
                <div className="font-medium text-slate-900 mb-2">Secondary Endpoints</div>
                <div className="space-y-3 text-slate-600">
                  <div>
                    <div>Overall survival (OS) - Time-to-event analysis</div>
                    <div className="text-sm">
                      Cox proportional hazards regression adjusted for baseline covariates
                    </div>
                  </div>
                  <div>
                    <div>Objective response rate (ORR) - Binary outcome</div>
                    <div className="text-sm">
                      Chi-square test with 95% confidence intervals
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Statistical Methods */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-slate-900">Statistical Methods</h2>
            </div>
            <div className="space-y-4 text-slate-600">
              <div>
                <div className="font-medium text-slate-900 mb-2">Analysis Populations</div>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Intent-to-treat (ITT): All randomized subjects</li>
                  <li>Per-protocol (PP): Subjects without major protocol deviations</li>
                  <li>Safety: All subjects who received at least one dose</li>
                </ul>
              </div>

              <div>
                <div className="font-medium text-slate-900 mb-2">Missing Data Handling</div>
                <p>
                  Missing efficacy data will be handled using multiple imputation with 50 iterations.
                  Sensitivity analyses will compare complete case analysis with imputed results.
                  <sup className="text-blue-600 ml-1 cursor-pointer">[4]</sup>
                </p>
              </div>

              <div>
                <div className="font-medium text-slate-900 mb-2">Significance Level</div>
                <p>
                  Two-sided alpha = 0.05 for primary endpoint. Multiplicity adjustment using
                  Hochberg procedure for secondary endpoints.
                </p>
              </div>
            </div>
          </section>

          {/* Assumptions */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-slate-900">Assumptions and Constraints</h2>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="text-yellow-900 mb-2 font-medium">
                Persona Constraints Applied
              </div>
              <div className="text-yellow-800 text-sm space-y-1">
                <p>• AI will not make efficacy claims or safety conclusions</p>
                <p>• All clinical interpretations require human review and approval</p>
                <p>• Benchmark comparisons are allowed for descriptive purposes only</p>
              </div>
            </div>
            <ul className="list-disc ml-6 space-y-2 text-slate-600">
              <li>Proportional hazards assumption will be tested using Schoenfeld residuals</li>
              <li>Sample size assumes 20% dropout rate and 80% power to detect HR of 0.65</li>
              <li>Interim analyses are planned at 50% and 75% of events</li>
              <li>Data monitoring committee will review unblinded results at interim timepoints</li>
            </ul>
          </section>

          {/* References */}
          <section className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-slate-900 mb-4">References and Citations</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <div>
                <span className="text-blue-600 font-medium">[1]</span> Study Protocol PROTO-2024-001,
                Version 2.3, Section 3.1 (Approved: Dec 15, 2025)
              </div>
              <div>
                <span className="text-blue-600 font-medium">[2]</span> Eisenhauer EA, et al. New
                response evaluation criteria in solid tumours (RECIST 1.1). Eur J Cancer. 2009;45(2):228-247.
              </div>
              <div>
                <span className="text-blue-600 font-medium">[3]</span> FDA Guidance: Clinical Trial
                Endpoints for the Approval of Cancer Drugs and Biologics (2018)
              </div>
              <div>
                <span className="text-blue-600 font-medium">[4]</span> ICH E9(R1): Estimands and
                Sensitivity Analysis in Clinical Trials (2021)
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-center text-sm text-slate-600">
          This analysis plan is generated for regulatory submission and must be reviewed and approved
          by qualified statisticians and clinical investigators before implementation.
        </div>
      </div>
    </div>
  );
}