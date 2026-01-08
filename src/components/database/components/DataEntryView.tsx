import { Edit } from 'lucide-react';
import { DataEntryForm } from '../../DataEntryForm';
import type { DatabaseTable } from '../utils/schemaGenerator';

interface DataEntryViewProps {
  tables: DatabaseTable[];
  protocolNumber?: string;
  protocolVersion?: string;
  onSave?: () => void;
}

export function DataEntryView({ tables, protocolNumber, protocolVersion, onSave }: DataEntryViewProps) {
  if (tables.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
        <Edit className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-slate-900 mb-2">No Protocol Selected</h3>
        <p className="text-slate-600 text-sm">
          Select a protocol and version to begin data entry
        </p>
      </div>
    );
  }

  return (
    <DataEntryForm
      tables={tables}
      protocolNumber={protocolNumber || ''}
      protocolVersion={protocolVersion || ''}
      onSave={onSave}
    />
  );
}
