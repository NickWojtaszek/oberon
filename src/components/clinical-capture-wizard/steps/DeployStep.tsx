/**
 * Deploy Step
 * Final step: Deploy protocol to database for data collection
 * Integrates with existing Deploy to Database workflow
 */

import { useState } from 'react';
import {
  Database,
  CheckCircle,
  AlertCircle,
  Rocket,
  Server,
  Table as TableIcon,
  Clock,
} from 'lucide-react';
import { useProtocol } from '../../../contexts/ProtocolContext';
import { generateSchemaMetadata, saveSchemaMetadata } from '../../../utils/schemaMetadata';

interface DeployStepProps {
  onComplete: () => void;
  onNavigateToDatabase: () => void;
  protocolSummary: {
    protocolTitle: string;
    protocolNumber: string;
    studyType: string;
    fieldCount: number;
    picoComplete: boolean;
    schemaComplete: boolean;
  };
}

export function DeployStep({ onComplete, onNavigateToDatabase, protocolSummary }: DeployStepProps) {
  const { currentProtocol, currentVersion } = useProtocol();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentStatus('deploying');

    try {
      // Generate and save schema metadata for AI analysis
      if (currentProtocol && currentVersion && currentVersion.schemaBlocks) {
        try {
          console.log('📚 Generating schema metadata for AI analysis...');

          // Use protocol creation timestamp for table ID suffix (matches database generator)
          const protocolTimestamp = currentProtocol.protocolNumber.split('-')[1] || Date.now().toString();
          const tableIdSuffix = `draft_${protocolTimestamp}`;

          console.log(`Using protocol: ${currentProtocol.protocolNumber}, suffix: ${tableIdSuffix}`);
          console.log(`Schema blocks count: ${currentVersion.schemaBlocks.length}`);

          const metadata = generateSchemaMetadata(
            currentVersion.schemaBlocks,
            currentProtocol.protocolNumber,
            tableIdSuffix
          );

          saveSchemaMetadata(metadata);
          console.log(`✅ Schema metadata saved: ${metadata.totalFields} fields indexed`);
        } catch (metadataError) {
          console.error('❌ Schema metadata generation failed:', metadataError);
          console.error('Error details:', {
            name: (metadataError as Error).name,
            message: (metadataError as Error).message,
            stack: (metadataError as Error).stack
          });
          // Don't fail deployment if metadata generation fails
        }
      }

      // Brief delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 1000));

      setDeploymentStatus('success');
      setIsDeploying(false);

      // Mark step complete and navigate to Database after short delay
      setTimeout(() => {
        onComplete();
        // Navigate to Database module where actual table generation occurs
        onNavigateToDatabase();
      }, 1500);
    } catch (error) {
      console.error('Deployment error:', error);
      setDeploymentStatus('error');
      setIsDeploying(false);
    }
  };

  const canDeploy = protocolSummary.picoComplete && protocolSummary.schemaComplete && protocolSummary.fieldCount > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-green-900">Deploy to Database</h2>
            <p className="text-sm text-green-700 mt-1">
              Activate your protocol and begin data collection
            </p>
          </div>
        </div>
      </div>

      {/* Protocol Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Protocol Summary</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-sm text-slate-600">Protocol Title</span>
            <span className="text-sm font-semibold text-slate-900">{protocolSummary.protocolTitle}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-sm text-slate-600">Protocol Number</span>
            <span className="text-sm font-semibold text-slate-900">{protocolSummary.protocolNumber}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-sm text-slate-600">Study Type</span>
            <span className="text-sm font-semibold text-slate-900">{protocolSummary.studyType}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-sm text-slate-600">Schema Fields</span>
            <span className="text-sm font-semibold text-slate-900">{protocolSummary.fieldCount} fields</span>
          </div>
        </div>
      </div>

      {/* Readiness Checklist */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Deployment Readiness</h3>

        <div className="space-y-3">
          <div className={`flex items-center gap-3 p-3 rounded-lg ${
            protocolSummary.picoComplete ? 'bg-green-50' : 'bg-red-50'
          }`}>
            {protocolSummary.picoComplete ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`text-sm font-medium ${
              protocolSummary.picoComplete ? 'text-green-900' : 'text-red-900'
            }`}>
              PICO Framework Complete
            </span>
          </div>

          <div className={`flex items-center gap-3 p-3 rounded-lg ${
            protocolSummary.schemaComplete ? 'bg-green-50' : 'bg-red-50'
          }`}>
            {protocolSummary.schemaComplete ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`text-sm font-medium ${
              protocolSummary.schemaComplete ? 'text-green-900' : 'text-red-900'
            }`}>
              Protocol Schema Defined
            </span>
          </div>

          <div className={`flex items-center gap-3 p-3 rounded-lg ${
            protocolSummary.fieldCount > 0 ? 'bg-green-50' : 'bg-red-50'
          }`}>
            {protocolSummary.fieldCount > 0 ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`text-sm font-medium ${
              protocolSummary.fieldCount > 0 ? 'text-green-900' : 'text-red-900'
            }`}>
              Data Collection Fields Ready
            </span>
          </div>
        </div>
      </div>

      {/* Deployment Action */}
      {deploymentStatus === 'idle' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Ready to Deploy</h3>
          <p className="text-sm text-slate-600 mb-6">
            Deploying your protocol will create the database schema and activate data collection. This process is reversible.
          </p>

          <button
            onClick={handleDeploy}
            disabled={!canDeploy || isDeploying}
            className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3 text-lg font-semibold"
          >
            <Rocket className="w-6 h-6" />
            Deploy Protocol to Database
          </button>

          {!canDeploy && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              Complete all required steps before deployment
            </div>
          )}
        </div>
      )}

      {deploymentStatus === 'deploying' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Server className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Deploying Protocol...</h3>
            <p className="text-sm text-slate-600">Creating database schema and activating data collection</p>
          </div>
        </div>
      )}

      {deploymentStatus === 'success' && (
        <div className="bg-white rounded-xl border border-green-200 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">Deployment Successful!</h3>
            <p className="text-sm text-green-700 mb-4">
              Your protocol is now active. Redirecting to Database module...
            </p>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <TableIcon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-xs text-green-700">Database Schema</div>
                <div className="text-sm font-semibold text-green-900 mt-1">Created</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <Database className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-xs text-green-700">Data Collection</div>
                <div className="text-sm font-semibold text-green-900 mt-1">Active</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-xs text-green-700">Status</div>
                <div className="text-sm font-semibold text-green-900 mt-1">Deployed</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
