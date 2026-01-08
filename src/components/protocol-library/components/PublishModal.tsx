import { CheckCircle2, AlertCircle } from 'lucide-react';

interface PublishModalProps {
  isOpen: boolean;
  changeLog: string;
  onChangeLogUpdate: (log: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PublishModal({
  isOpen,
  changeLog,
  onChangeLogUpdate,
  onConfirm,
  onCancel
}: PublishModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl text-slate-900">Publish Version</h2>
          <p className="text-sm text-slate-600 mt-1">
            Confirm publication and add a changelog entry
          </p>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Changelog (Optional)
            </label>
            <textarea
              value={changeLog}
              onChange={(e) => onChangeLogUpdate(e.target.value)}
              placeholder="Describe changes in this version..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <strong>Publishing this version will:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Mark it as the current published version</li>
                  <li>Make it immutable (cannot be edited directly)</li>
                  <li>Create an audit trail entry</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Publish Version
          </button>
        </div>
      </div>
    </div>
  );
}
