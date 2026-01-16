import { CheckCircle, Database, ArrowRight, X } from 'lucide-react';

interface PostPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeployToDatabase: () => void;
  protocolTitle: string;
}

export function PostPublishModal({
  isOpen,
  onClose,
  onDeployToDatabase,
  protocolTitle
}: PostPublishModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Protocol Published!</h2>
                <p className="text-sm text-slate-600">Your protocol has been published successfully</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-sm font-medium text-slate-700 mb-1">Published Protocol</p>
            <p className="text-base font-semibold text-slate-900">{protocolTitle}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                  Next Step: Deploy to Database
                </h3>
                <p className="text-sm text-blue-800">
                  Your protocol schema is ready to generate data collection forms in the Database module.
                  Deploy now to start collecting patient data according to your defined variables.
                </p>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            You can also deploy later by clicking the "Deploy to Database" button in the Protocol Workbench.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Skip for Now
          </button>
          <button
            onClick={() => {
              onDeployToDatabase();
              onClose();
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            Deploy to Database
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
