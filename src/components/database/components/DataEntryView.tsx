import { Edit, Lock, AlertCircle } from 'lucide-react';
import { DataEntryForm } from '../../DataEntryForm';
import type { DatabaseTable } from '../utils/schemaGenerator';

interface DataEntryViewProps {
  tables: DatabaseTable[];
  protocolNumber?: string;
  protocolVersion?: string;
  protocolStatus?: 'draft' | 'published' | 'archived';
  onSave?: () => void;
}

export function DataEntryView({ tables, protocolNumber, protocolVersion, protocolStatus, onSave }: DataEntryViewProps) {
  // Show message if no tables
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

  // Show message if protocol is not published
  if (protocolStatus === 'draft') {
    return (
      <div className="bg-white border border-amber-200 rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="text-amber-900 font-semibold mb-2">Protocol Not Published</h3>
        <p className="text-amber-700 text-sm mb-4">
          Data entry is only available for published protocols.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 inline-block">
          <div className="flex items-start gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">To enable data entry:</p>
              <ol className="list-decimal ml-4 space-y-1">
                <li>Complete all required wizard steps</li>
                <li>Fill in protocol details</li>
                <li>Publish the protocol in the Review & Publish step</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show message if protocol is archived
  if (protocolStatus === 'archived') {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-slate-700 font-semibold mb-2">Protocol Archived</h3>
        <p className="text-slate-600 text-sm">
          This protocol has been archived. Data entry is no longer available.
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
