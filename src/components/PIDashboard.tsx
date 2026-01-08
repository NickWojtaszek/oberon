// PI Dashboard - God View Oversight (Phase 6)

import { useState, useEffect } from 'react';
import { Shield, TrendingUp, FileText, CheckCircle2, AlertTriangle, Clock, ArrowLeft } from 'lucide-react';
import { storage } from '../utils/storageService';
import type { ManuscriptManifest } from '../types/manuscript';
import type { StatisticalManifest } from './analytics-stats/types';

interface ManuscriptMetrics {
  manuscriptId: string;
  title: string;
  projectId: string;
  manifestIntegrity: number; // % of statistical claims verified
  groundingScore: number; // % of citations with verified evidence
  sprintProgress: number; // word count vs journal target
  lastModified: number;
  status: 'draft' | 'in-review' | 'ready';
  wordCount: number;
  citationCount: number;
  verificationCount: number;
}

interface PIDashboardProps {
  onClose: () => void;
  onSelectManuscript: (manuscriptId: string, projectId: string) => void;
}

export function PIDashboard({ onClose, onSelectManuscript }: PIDashboardProps) {
  const [allMetrics, setAllMetrics] = useState<ManuscriptMetrics[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'integrity' | 'progress'>('date');

  useEffect(() => {
    loadAllManuscripts();
  }, []);

  const loadAllManuscripts = () => {
    const projects = storage.projects.getAll();
    const metrics: ManuscriptMetrics[] = [];

    projects.forEach(project => {
      const manuscripts = storage.manuscripts.getAll(project.id);
      const statisticalManifests = storage.statisticalManifests.getAll(project.id);
      const latestManifest = statisticalManifests.length > 0 
        ? statisticalManifests.sort((a, b) => b.manifestMetadata.generatedAt - a.manifestMetadata.generatedAt)[0]
        : null;

      manuscripts.forEach(manuscript => {
        const metric = calculateMetrics(manuscript, latestManifest);
        metrics.push(metric);
      });
    });

    setAllMetrics(metrics);
  };

  const calculateMetrics = (
    manuscript: ManuscriptManifest, 
    statisticalManifest: StatisticalManifest | null
  ): ManuscriptMetrics => {
    // Count words
    const wordCount = Object.values(manuscript.manuscriptContent)
      .reduce((sum, content) => sum + content.trim().split(/\s+/).filter(w => w.length > 0).length, 0);

    // Count citations
    const citationPattern = /\[@([^\]]+)\]/g;
    const uniqueCitations = new Set<string>();
    Object.values(manuscript.manuscriptContent).forEach(content => {
      const matches = [...content.matchAll(citationPattern)];
      matches.forEach(match => uniqueCitations.add(match[1]));
    });
    const citationCount = uniqueCitations.size;

    // Calculate manifest integrity (simplified)
    const manifestIntegrity = statisticalManifest ? 85 : 0; // Placeholder

    // Calculate grounding score (% of citations with sources)
    const groundingScore = citationCount > 0 
      ? Math.round((manuscript.notebookContext.linkedSources.length / citationCount) * 100)
      : 0;

    // Calculate sprint progress (word count vs target - assuming 3500 target)
    const targetWords = 3500;
    const sprintProgress = Math.min(Math.round((wordCount / targetWords) * 100), 100);

    // Determine status
    let status: 'draft' | 'in-review' | 'ready' = 'draft';
    if (manifestIntegrity >= 90 && groundingScore >= 80 && sprintProgress >= 90) {
      status = 'ready';
    } else if (manifestIntegrity >= 70 || groundingScore >= 60) {
      status = 'in-review';
    }

    return {
      manuscriptId: manuscript.id,
      title: manuscript.projectMeta.studyTitle,
      projectId: manuscript.projectMeta.projectId,
      manifestIntegrity,
      groundingScore,
      sprintProgress,
      lastModified: manuscript.projectMeta.modifiedAt,
      status,
      wordCount,
      citationCount,
      verificationCount: 0 // Placeholder
    };
  };

  const sortedMetrics = [...allMetrics].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return b.lastModified - a.lastModified;
      case 'integrity':
        return b.manifestIntegrity - a.manifestIntegrity;
      case 'progress':
        return b.sprintProgress - a.sprintProgress;
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800 border-green-300';
      case 'in-review': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  const overallStats = {
    totalManuscripts: allMetrics.length,
    avgIntegrity: allMetrics.length > 0 
      ? Math.round(allMetrics.reduce((sum, m) => sum + m.manifestIntegrity, 0) / allMetrics.length)
      : 0,
    avgGrounding: allMetrics.length > 0
      ? Math.round(allMetrics.reduce((sum, m) => sum + m.groundingScore, 0) / allMetrics.length)
      : 0,
    readyCount: allMetrics.filter(m => m.status === 'ready').length
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-slate-900">PI Dashboard</h1>
                    <p className="text-slate-600 text-sm mt-1">Multi-manuscript oversight and audit trail</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'integrity' | 'progress')}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Last Modified</option>
                <option value="integrity">Manifest Integrity</option>
                <option value="progress">Sprint Progress</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-600 mb-1">Total Manuscripts</div>
                <div className="text-3xl font-semibold text-slate-900">{overallStats.totalManuscripts}</div>
              </div>
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-600 mb-1">Avg Manifest Integrity</div>
                <div className={`text-3xl font-semibold ${getScoreColor(overallStats.avgIntegrity)}`}>
                  {overallStats.avgIntegrity}%
                </div>
              </div>
              <Shield className="w-10 h-10 text-blue-400" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-600 mb-1">Avg Grounding Score</div>
                <div className={`text-3xl font-semibold ${getScoreColor(overallStats.avgGrounding)}`}>
                  {overallStats.avgGrounding}%
                </div>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-400" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-600 mb-1">Ready for Submission</div>
                <div className="text-3xl font-semibold text-green-600">{overallStats.readyCount}</div>
              </div>
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Manuscript List */}
      <div className="px-8 pb-8">
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-sm font-semibold text-slate-900">All Manuscripts</h2>
          </div>

          {sortedMetrics.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p>No manuscripts found across all projects</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {sortedMetrics.map(metric => (
                <button
                  key={metric.manuscriptId}
                  onClick={() => onSelectManuscript(metric.manuscriptId, metric.projectId)}
                  className="w-full px-6 py-4 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-start justify-between gap-6">
                    {/* Manuscript Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-slate-900">{metric.title}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded border ${getStatusColor(metric.status)}`}>
                          {metric.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(metric.lastModified).toLocaleDateString()}
                        </div>
                        <div>{metric.wordCount} words</div>
                        <div>{metric.citationCount} citations</div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <div className="text-xs text-slate-600 mb-1">Manifest Integrity</div>
                        <div className={`text-xl font-semibold ${getScoreColor(metric.manifestIntegrity)}`}>
                          {metric.manifestIntegrity}%
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              metric.manifestIntegrity >= 90 ? 'bg-green-500' :
                              metric.manifestIntegrity >= 70 ? 'bg-amber-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${metric.manifestIntegrity}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-600 mb-1">Grounding Score</div>
                        <div className={`text-xl font-semibold ${getScoreColor(metric.groundingScore)}`}>
                          {metric.groundingScore}%
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              metric.groundingScore >= 90 ? 'bg-green-500' :
                              metric.groundingScore >= 70 ? 'bg-amber-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${metric.groundingScore}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-600 mb-1">Sprint Progress</div>
                        <div className={`text-xl font-semibold ${getScoreColor(metric.sprintProgress)}`}>
                          {metric.sprintProgress}%
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              metric.sprintProgress >= 90 ? 'bg-green-500' :
                              metric.sprintProgress >= 70 ? 'bg-amber-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${metric.sprintProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}