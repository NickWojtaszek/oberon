// Data Connection Panel
// Shows secure connections between AI writing system and clinical data sources
// Critical for clinical data integrity - makes connections visible and permanent

import { Database, FileText, BarChart3, Shield, Lock, Check, AlertCircle, Clock, ExternalLink } from 'lucide-react';

interface DataConnection {
  source: string;
  type: 'protocol' | 'schema' | 'manifest' | 'references' | 'irb' | 'analytics';
  status: 'connected' | 'disconnected' | 'stale';
  recordCount?: number;
  lastUpdated?: string;
  dataLocked?: boolean;
  fields?: string[];
}

interface DataConnectionPanelProps {
  connections: DataConnection[];
  securityLevel: 'clinical-grade' | 'standard';
  onNavigateToEthics?: () => void; // NEW: Navigate to Ethics Board for IRB approval
}

export function DataConnectionPanel({ connections, securityLevel, onNavigateToEthics }: DataConnectionPanelProps) {
  const getIcon = (type: DataConnection['type']) => {
    switch (type) {
      case 'protocol':
        return FileText;
      case 'schema':
        return Database;
      case 'manifest':
        return BarChart3;
      case 'references':
        return FileText;
      case 'irb':
        return Shield;
      case 'analytics':
        return BarChart3;
      default:
        return Database;
    }
  };

  const getStatusColor = (status: DataConnection['status']) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'disconnected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'stale':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const connectedCount = connections.filter(c => c.status === 'connected').length;
  const totalRecords = connections.reduce((sum, c) => sum + (c.recordCount || 0), 0);

  return (
    <div className="p-4 space-y-4">
      {/* Security Badge */}
      <div className={`p-3 rounded-lg border-2 ${
        securityLevel === 'clinical-grade' 
          ? 'bg-blue-50 border-blue-200' 
          : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <Lock className={`w-4 h-4 ${
            securityLevel === 'clinical-grade' ? 'text-blue-600' : 'text-slate-600'
          }`} />
          <span className={`text-sm font-bold ${
            securityLevel === 'clinical-grade' ? 'text-blue-900' : 'text-slate-900'
          }`}>
            {securityLevel === 'clinical-grade' ? 'Clinical-Grade Security' : 'Standard Security'}
          </span>
        </div>
        <div className="text-xs text-slate-600">
          {securityLevel === 'clinical-grade' 
            ? '🔒 All connections are immutable and audit-logged for regulatory compliance'
            : 'Standard data connections with version tracking'
          }
        </div>
      </div>

      {/* Connection Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-2xl font-bold text-slate-900">{connectedCount}/{connections.length}</div>
          <div className="text-xs text-slate-600 mt-1">Data Sources</div>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-2xl font-bold text-slate-900">{totalRecords.toLocaleString()}</div>
          <div className="text-xs text-slate-600 mt-1">Data Points</div>
        </div>
      </div>

      {/* Connection List */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
          Active Connections
        </div>
        
        {connections.map((connection, index) => {
          const Icon = getIcon(connection.type);
          const statusColor = getStatusColor(connection.status);
          const isIRB = connection.type === 'irb';
          
          return (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                connection.status === 'connected' 
                  ? 'bg-white border-slate-200' 
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  connection.status === 'connected' 
                    ? 'bg-green-50' 
                    : connection.status === 'stale'
                    ? 'bg-amber-50'
                    : 'bg-red-50'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    connection.status === 'connected' 
                      ? 'text-green-600' 
                      : connection.status === 'stale'
                      ? 'text-amber-600'
                      : 'text-red-600'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-medium text-sm text-slate-900">
                      {connection.source}
                    </div>
                    {connection.dataLocked && (
                      <div className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${statusColor}`}>
                      {connection.status === 'connected' && <Check className="w-3 h-3" />}
                      {connection.status === 'stale' && <Clock className="w-3 h-3" />}
                      {connection.status === 'disconnected' && <AlertCircle className="w-3 h-3" />}
                      {connection.status}
                    </span>
                    
                    {connection.recordCount !== undefined && (
                      <span className="text-xs text-slate-600">
                        {connection.recordCount.toLocaleString()} records
                      </span>
                    )}
                  </div>
                  
                  {connection.fields && connection.fields.length > 0 && (
                    <div className="mt-2 text-xs text-slate-600">
                      <span className="font-medium">Fields: </span>
                      {connection.fields.join(', ')}
                    </div>
                  )}
                  
                  {connection.lastUpdated && (
                    <div className="mt-1 text-xs text-slate-500">
                      Last synced: {new Date(connection.lastUpdated).toLocaleString()}
                    </div>
                  )}
                  
                  {/* Cross-Module Navigation: Academic Writing → Ethics Board */}
                  {isIRB && onNavigateToEthics && (
                    <button
                      onClick={onNavigateToEthics}
                      className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-colors border border-blue-200"
                      title="View full IRB submission details in Ethics Board"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View IRB Approval
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {connections.length === 0 && (
        <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-lg">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-slate-700">No Data Connections</div>
          <div className="text-xs text-slate-500 mt-1">
            Configure protocol and statistical manifest to enable AI generation
          </div>
        </div>
      )}

      {/* Data Integrity Notice */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <div className="font-semibold mb-1">Data Integrity Protection</div>
            <div className="text-amber-700">
              All manuscript generation uses immutable snapshots of clinical data. 
              Changes to source data require re-validation.
            </div>
          </div>
        </div>
      </div>

      {/* IRB Approval Notice */}
      {onNavigateToEthics && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900">
              <div className="font-semibold mb-1">IRB Approval Required</div>
              <div className="text-blue-700">
                Ensure your IRB protocol is approved before proceeding with data connections.
              </div>
              <button
                className="mt-1 text-xs text-blue-700 underline"
                onClick={onNavigateToEthics}
              >
                Navigate to Ethics Board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}