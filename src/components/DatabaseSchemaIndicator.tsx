import { AlertTriangle, CheckCircle2, Lock, Info } from 'lucide-react';
import type { ProtocolVersion } from '../types/shared';

interface DatabaseSchemaIndicatorProps {
  protocolNumber: string;
  protocolVersion: ProtocolVersion;
  onMigrationNeeded?: () => void;
}

export function DatabaseSchemaIndicator({
  protocolNumber,
  protocolVersion,
  onMigrationNeeded,
}: DatabaseSchemaIndicatorProps) {
  const isLocked = protocolVersion.locked;
  const hasData = protocolVersion.dataRecordCount && protocolVersion.dataRecordCount > 0;

  // Determine status
  let status: 'locked' | 'active' | 'warning';
  let icon: React.ReactNode;
  let title: string;
  let description: string;
  let bgColor: string;
  let borderColor: string;
  let textColor: string;

  if (isLocked && hasData) {
    status = 'locked';
    icon = <Lock className="w-4 h-4" />;
    title = 'Schema Locked';
    description = `${protocolVersion.dataRecordCount} records • Version ${protocolVersion.versionNumber}`;
    bgColor = 'bg-green-50';
    borderColor = 'border-green-200';
    textColor = 'text-green-900';
  } else if (!isLocked && hasData) {
    status = 'warning';
    icon = <AlertTriangle className="w-4 h-4" />;
    title = 'Lock Recommended';
    description = `${protocolVersion.dataRecordCount} records collected • Should lock schema`;
    bgColor = 'bg-amber-50';
    borderColor = 'border-amber-200';
    textColor = 'text-amber-900';
  } else {
    status = 'active';
    icon = <Info className="w-4 h-4" />;
    title = 'Draft Schema';
    description = `Version ${protocolVersion.versionNumber} • No data collected yet`;
    bgColor = 'bg-blue-50';
    borderColor = 'border-blue-200';
    textColor = 'text-blue-900';
  }

  return (
    <div className={`flex items-start gap-3 p-4 ${bgColor} border ${borderColor} rounded-lg`}>
      <div className={`${textColor} mt-0.5`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-sm font-semibold ${textColor}`}>{title}</span>
          {isLocked && (
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
              Production
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${textColor.replace('900', '800')}`}>
            {description}
          </span>
        </div>
        {status === 'locked' && (
          <div className="mt-2 text-xs text-green-700">
            <CheckCircle2 className="w-3 h-3 inline mr-1" />
            Data integrity protected - schema cannot be modified
          </div>
        )}
      </div>
    </div>
  );
}
