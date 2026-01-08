import type { DatabaseTable } from '../utils/schemaGenerator';

interface QueryViewProps {
  tables: DatabaseTable[];
}

export function QueryView({ tables }: QueryViewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-slate-900 mb-4">SQL Query Builder</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-700 mb-2">Select Table</label>
            <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Choose a table...</option>
              {tables.map(table => (
                <option key={table.tableName} value={table.tableName}>{table.displayName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-2">Query</label>
            <textarea
              className="w-full h-48 px-4 py-3 border border-slate-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="SELECT * FROM subjects_..."
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500">
              Read-only mode • Changes require audit approval
            </div>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Execute Query
            </button>
          </div>
        </div>
      </div>

      {/* Query Results Placeholder */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-slate-900 mb-4">Query Results</h3>
        <div className="text-center py-12 text-slate-400">
          Execute a query to see results
        </div>
      </div>
    </div>
  );
}
