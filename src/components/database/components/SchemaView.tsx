import { FileSpreadsheet, Lock } from 'lucide-react';
import type { DatabaseTable, DatabaseField } from '../utils/schemaGenerator';

interface SchemaViewProps {
  tables: DatabaseTable[];
  showFieldFilter: {
    normal: boolean;
    modified: boolean;
    new: boolean;
    deprecated: boolean;
  };
  onFilterChange: (filter: any) => void;
}

function FieldChangeIndicator({ 
  status, 
  changeDescription, 
  versionAdded, 
  versionModified, 
  versionDeprecated 
}: {
  status: 'normal' | 'modified' | 'new' | 'deprecated';
  changeDescription?: string;
  versionAdded?: string;
  versionModified?: string;
  versionDeprecated?: string;
}) {
  if (status === 'normal') {
    return <span className="text-xs text-slate-500">—</span>;
  }

  if (status === 'new') {
    return (
      <div className="flex items-center gap-2">
        <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
          NEW
        </span>
        {versionAdded && (
          <span className="text-xs text-slate-500">v{versionAdded}</span>
        )}
      </div>
    );
  }

  if (status === 'modified') {
    return (
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-medium">
            MODIFIED
          </span>
          {versionModified && (
            <span className="text-xs text-slate-500">v{versionModified}</span>
          )}
        </div>
        {changeDescription && (
          <div className="text-xs text-slate-600 mt-1">{changeDescription}</div>
        )}
      </div>
    );
  }

  if (status === 'deprecated') {
    return (
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium">
            DEPRECATED
          </span>
          {versionDeprecated && (
            <span className="text-xs text-slate-500">v{versionDeprecated}</span>
          )}
        </div>
        {changeDescription && (
          <div className="text-xs text-slate-600 mt-1">{changeDescription}</div>
        )}
      </div>
    );
  }

  return null;
}

export function SchemaView({ tables, showFieldFilter, onFilterChange }: SchemaViewProps) {
  const filterFields = (fields: DatabaseField[]) => {
    return fields.filter(field => showFieldFilter[field.status]);
  };

  if (tables.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
        <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-slate-900 mb-2">No Database Schema Generated</h3>
        <p className="text-slate-600 text-sm">
          Select a protocol and version to view its database schema.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Field Status Filter */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-700">Show Fields:</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFieldFilter.normal}
                onChange={(e) => onFilterChange({ ...showFieldFilter, normal: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Normal</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFieldFilter.modified}
                onChange={(e) => onFilterChange({ ...showFieldFilter, modified: e.target.checked })}
                className="w-4 h-4 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-sm text-slate-700">Modified</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFieldFilter.new}
                onChange={(e) => onFilterChange({ ...showFieldFilter, new: e.target.checked })}
                className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
              />
              <span className="text-sm text-slate-700">New</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFieldFilter.deprecated}
                onChange={(e) => onFilterChange({ ...showFieldFilter, deprecated: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500"
              />
              <span className="text-sm text-slate-700">Deprecated</span>
            </label>
          </div>
        </div>
      </div>

      {/* Generated Tables */}
      {tables.map((table) => {
        const filteredFields = filterFields(table.fields);
        
        return (
          <div key={table.tableName} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                    <h3 className="text-slate-900 font-mono text-sm">{table.tableName}</h3>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{table.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-slate-600">
                    {filteredFields.length} fields
                  </div>
                  <div
                    className="p-2 text-slate-400 cursor-help"
                    title="Schema is read-only. Edit fields in Protocol Workbench."
                  >
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">
                      Field Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">
                      Data Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">
                      SQL Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">
                      Constraints
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredFields.map((field) => {
                    const isDeprecated = field.status === 'deprecated';
                    const isModified = field.status === 'modified';
                    const isNew = field.status === 'new';
                    
                    const rowClass = isDeprecated 
                      ? 'bg-slate-100 opacity-60'
                      : isModified
                      ? 'bg-amber-50 border-l-4 border-l-amber-500'
                      : isNew
                      ? 'bg-green-50 border-l-4 border-l-green-500'
                      : 'hover:bg-slate-50';

                    return (
                      <tr key={field.id} className={`transition-colors ${rowClass}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {isDeprecated && <Lock className="w-4 h-4 text-slate-400" />}
                            <span className={`font-mono text-sm ${isDeprecated ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                              {field.fieldName}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">{field.displayName}</div>
                        </td>
                        <td className={`px-6 py-4 text-sm ${isDeprecated ? 'text-slate-500' : 'text-slate-700'}`}>
                          {field.dataType}
                          {field.unit && <span className="text-slate-500 ml-1">({field.unit})</span>}
                        </td>
                        <td className={`px-6 py-4 text-sm font-mono ${isDeprecated ? 'text-slate-500' : 'text-slate-700'}`}>
                          {field.sqlType}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {field.isRequired && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                REQUIRED
                              </span>
                            )}
                            {field.endpointTier && (
                              <span className={`px-2 py-1 rounded text-xs ${
                                field.endpointTier === 'primary' ? 'bg-purple-50 text-purple-700' :
                                field.endpointTier === 'secondary' ? 'bg-blue-50 text-blue-700' :
                                'bg-slate-50 text-slate-700'
                              }`}>
                                {field.endpointTier.toUpperCase()}
                              </span>
                            )}
                            {field.minValue !== undefined && field.maxValue !== undefined && (
                              <span className="px-2 py-1 bg-slate-50 text-slate-700 rounded text-xs">
                                {field.minValue}-{field.maxValue}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <FieldChangeIndicator
                            status={field.status}
                            changeDescription={field.changeDescription}
                            versionAdded={field.versionAdded}
                            versionModified={field.versionModified}
                            versionDeprecated={field.versionDeprecated}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
