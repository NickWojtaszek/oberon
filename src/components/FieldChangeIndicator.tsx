import { Sparkles, Lock, AlertTriangle } from 'lucide-react';

type FieldStatus = 'normal' | 'modified' | 'new' | 'deprecated';

interface FieldChangeIndicatorProps {
  status: FieldStatus;
  changeDescription?: string;
  versionAdded?: string;
  versionModified?: string;
  versionDeprecated?: string;
}

export function FieldChangeIndicator({ status, changeDescription, versionAdded, versionModified, versionDeprecated }: FieldChangeIndicatorProps) {
  if (status === 'normal') return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'modified':
        return {
          badge: 'MODIFIED',
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-700',
          icon: AlertTriangle,
          iconColor: 'text-amber-600'
        };
      case 'new':
        return {
          badge: 'NEW',
          bgColor: 'bg-green-100',
          textColor: 'text-green-700',
          icon: Sparkles,
          iconColor: 'text-green-600'
        };
      case 'deprecated':
        return {
          badge: 'DEPRECATED',
          bgColor: 'bg-red-100',
          textColor: 'text-red-700',
          icon: Lock,
          iconColor: 'text-red-600'
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className="group relative inline-flex items-center gap-1">
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${config.bgColor} ${config.textColor}`}>
        <Icon className={`w-3 h-3 ${config.iconColor}`} />
        {config.badge}
      </span>
      
      {/* Tooltip */}
      <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {status === 'modified' && (
          <>
            <div className="font-medium mb-1">Field Modified {versionModified && `in ${versionModified}`}</div>
            <div className="text-slate-300">{changeDescription || 'Field properties changed between versions'}</div>
          </>
        )}
        {status === 'new' && (
          <>
            <div className="font-medium mb-1">New Field {versionAdded && `in ${versionAdded}`}</div>
            <div className="text-slate-300">This field was added in a later protocol version. Historical records will not have data for this field.</div>
          </>
        )}
        {status === 'deprecated' && (
          <>
            <div className="font-medium mb-1">Deprecated {versionDeprecated && `in ${versionDeprecated}`}</div>
            <div className="text-slate-300">This field was removed from the protocol but historical data is preserved for audit compliance.</div>
          </>
        )}
      </div>
    </div>
  );
}
