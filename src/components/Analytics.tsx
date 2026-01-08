import { useState, useEffect, useMemo } from 'react';
import { BarChart3, LineChart, ScatterChart, PieChart, TrendingUp, Filter, Download, Settings, Users, Calendar, FlaskConical, Activity } from 'lucide-react';
import { DatabaseTable, DatabaseField } from './database/utils/schemaGenerator';
import { getAllRecords, getRecordsByProtocol, ClinicalDataRecord } from '../utils/dataStorage';
import { BarChart, Bar, LineChart as RechartsLineChart, Line, ScatterChart as RechartsScatterChart, Scatter, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsProps {
  tables: DatabaseTable[];
  protocolNumber?: string;
  protocolVersion?: string;
}

type AnalysisType = 'summary' | 'distribution' | 'correlation' | 'comparison' | 'trend';
type ChartType = 'bar' | 'line' | 'scatter' | 'pie';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export function Analytics({ tables, protocolNumber, protocolVersion }: AnalyticsProps) {
  const [records, setRecords] = useState<ClinicalDataRecord[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [selectedField1, setSelectedField1] = useState<string>('');
  const [selectedField2, setSelectedField2] = useState<string>('');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('summary');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [groupBy, setGroupBy] = useState<string>('');

  // Load records
  useEffect(() => {
    loadRecords();
  }, [protocolNumber, protocolVersion]);

  // Auto-select first table
  useEffect(() => {
    if (tables.length > 0 && !selectedTable) {
      setSelectedTable(tables[0].tableName);
    }
  }, [tables]);

  const loadRecords = () => {
    let loadedRecords: ClinicalDataRecord[];
    
    if (protocolNumber) {
      loadedRecords = getRecordsByProtocol(protocolNumber, protocolVersion);
    } else {
      loadedRecords = getAllRecords();
    }
    
    setRecords(loadedRecords.filter(r => r.status === 'complete'));
  };

  // Get current table and its fields
  const currentTable = tables.find(t => t.tableName === selectedTable);
  const availableFields = currentTable?.fields.filter(f => f.category !== 'Structural') || [];

  // Extract data from records for the selected table
  const tableData = useMemo(() => {
    if (!currentTable) return [];
    
    return records.map(record => {
      const data: any = {
        recordId: record.recordId,
        subjectId: record.subjectId,
        visitNumber: record.visitNumber,
        enrollmentDate: record.enrollmentDate,
        ...record.data[currentTable.tableName]
      };
      return data;
    }).filter(d => Object.keys(d).length > 4); // Has actual data beyond base fields
  }, [records, currentTable]);

  // Summary Statistics
  const summaryStats = useMemo(() => {
    if (!currentTable || tableData.length === 0) return null;

    const stats: any = {
      totalRecords: tableData.length,
      uniqueSubjects: new Set(tableData.map(d => d.subjectId)).size,
      categories: {}
    };

    availableFields.forEach(field => {
      const values = tableData
        .map(d => d[field.fieldName])
        .filter(v => v !== undefined && v !== null && v !== '');

      if (values.length === 0) return;

      const fieldStats: any = {
        count: values.length,
        missing: tableData.length - values.length
      };

      if (field.dataType === 'Continuous') {
        const numericValues = values.map(v => parseFloat(v)).filter(v => !isNaN(v));
        if (numericValues.length > 0) {
          fieldStats.mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
          fieldStats.min = Math.min(...numericValues);
          fieldStats.max = Math.max(...numericValues);
          fieldStats.median = numericValues.sort((a, b) => a - b)[Math.floor(numericValues.length / 2)];
          const variance = numericValues.reduce((sum, val) => sum + Math.pow(val - fieldStats.mean, 2), 0) / numericValues.length;
          fieldStats.std = Math.sqrt(variance);
        }
      } else if (field.dataType === 'Categorical' || field.dataType === 'Boolean') {
        const freq: any = {};
        values.forEach(v => {
          freq[v] = (freq[v] || 0) + 1;
        });
        fieldStats.frequencies = freq;
        fieldStats.mode = Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b);
      }

      stats.categories[field.displayName] = fieldStats;
    });

    return stats;
  }, [tableData, currentTable, availableFields]);

  // Distribution Data
  const distributionData = useMemo(() => {
    if (!selectedField1 || tableData.length === 0) return [];

    const field = availableFields.find(f => f.fieldName === selectedField1);
    if (!field) return [];

    if (field.dataType === 'Continuous') {
      // Create histogram bins
      const values = tableData
        .map(d => parseFloat(d[selectedField1]))
        .filter(v => !isNaN(v));
      
      if (values.length === 0) return [];

      const min = Math.min(...values);
      const max = Math.max(...values);
      const binCount = Math.min(10, Math.ceil(Math.sqrt(values.length)));
      const binSize = (max - min) / binCount;

      const bins: any[] = [];
      for (let i = 0; i < binCount; i++) {
        const binStart = min + i * binSize;
        const binEnd = binStart + binSize;
        const count = values.filter(v => v >= binStart && (i === binCount - 1 ? v <= binEnd : v < binEnd)).length;
        bins.push({
          range: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`,
          count,
          percentage: (count / values.length * 100).toFixed(1)
        });
      }
      return bins;
    } else {
      // Categorical frequency
      const freq: any = {};
      tableData.forEach(d => {
        const value = d[selectedField1];
        if (value !== undefined && value !== null && value !== '') {
          freq[value] = (freq[value] || 0) + 1;
        }
      });

      return Object.entries(freq).map(([name, count]) => ({
        name,
        count,
        percentage: ((count as number) / tableData.length * 100).toFixed(1)
      }));
    }
  }, [selectedField1, tableData, availableFields]);

  // Correlation/Comparison Data
  const comparisonData = useMemo(() => {
    if (!selectedField1 || !selectedField2 || tableData.length === 0) return [];

    const field1 = availableFields.find(f => f.fieldName === selectedField1);
    const field2 = availableFields.find(f => f.fieldName === selectedField2);
    
    if (!field1 || !field2) return [];

    const data = tableData
      .map(d => ({
        x: d[selectedField1],
        y: d[selectedField2],
        subjectId: d.subjectId
      }))
      .filter(d => d.x !== undefined && d.x !== null && d.x !== '' && d.y !== undefined && d.y !== null && d.y !== '');

    // If both are continuous, return scatter data
    if (field1.dataType === 'Continuous' && field2.dataType === 'Continuous') {
      return data.map(d => ({
        x: parseFloat(d.x),
        y: parseFloat(d.y),
        subjectId: d.subjectId
      }));
    }

    // If one is categorical, group by it
    if (field1.dataType === 'Categorical' || field1.dataType === 'Boolean') {
      const grouped: any = {};
      data.forEach(d => {
        if (!grouped[d.x]) grouped[d.x] = [];
        grouped[d.x].push(parseFloat(d.y));
      });

      return Object.entries(grouped).map(([category, values]: [string, any]) => ({
        category,
        mean: values.reduce((a: number, b: number) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length
      }));
    }

    return [];
  }, [selectedField1, selectedField2, tableData, availableFields]);

  // Cross-table analysis
  const crossTableStats = useMemo(() => {
    if (tables.length === 0 || records.length === 0) return null;

    const stats = {
      totalSubjects: new Set(records.map(r => r.subjectId)).size,
      totalRecords: records.length,
      byTable: tables.map(table => {
        const tableRecords = records.filter(r => r.data[table.tableName] && Object.keys(r.data[table.tableName]).length > 0);
        return {
          tableName: table.displayName,
          recordCount: tableRecords.length,
          subjectCount: new Set(tableRecords.map(r => r.subjectId)).size,
          completionRate: (tableRecords.length / records.length * 100).toFixed(1)
        };
      })
    };

    return stats;
  }, [tables, records]);

  const exportAnalysis = () => {
    // Export current analysis as CSV
    let csvData = '';
    let filename = 'analytics';

    if (analysisType === 'summary' && summaryStats) {
      csvData = 'Field,Count,Missing\n';
      Object.entries(summaryStats.categories).forEach(([field, stats]: [string, any]) => {
        csvData += `${field},${stats.count},${stats.missing}\n`;
      });
      filename = 'summary-statistics';
    } else if (analysisType === 'distribution' && distributionData.length > 0) {
      const headers = Object.keys(distributionData[0]).join(',');
      csvData = headers + '\n';
      distributionData.forEach(row => {
        csvData += Object.values(row).join(',') + '\n';
      });
      filename = 'distribution-analysis';
    } else if (analysisType === 'comparison' && comparisonData.length > 0) {
      const headers = Object.keys(comparisonData[0]).join(',');
      csvData = headers + '\n';
      comparisonData.forEach(row => {
        csvData += Object.values(row).join(',') + '\n';
      });
      filename = 'comparison-analysis';
    }

    if (csvData) {
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-slate-900">Clinical Data Analytics</h2>
            <p className="text-sm text-slate-600 mt-1">
              Cross-category analysis and visualization from protocol-generated data
            </p>
          </div>
          <button
            onClick={exportAnalysis}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700"
          >
            <Download className="w-4 h-4" />
            Export Analysis
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      {crossTableStats && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-slate-600">Total Subjects</div>
                <div className="text-2xl font-semibold text-slate-900">{crossTableStats.totalSubjects}</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-slate-600">Total Records</div>
                <div className="text-2xl font-semibold text-slate-900">{crossTableStats.totalRecords}</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-slate-600">Data Categories</div>
                <div className="text-2xl font-semibold text-slate-900">{tables.length}</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-sm text-slate-600">Avg. Completion</div>
                <div className="text-2xl font-semibold text-slate-900">
                  {crossTableStats.byTable.length > 0
                    ? (crossTableStats.byTable.reduce((sum, t) => sum + parseFloat(t.completionRate), 0) / crossTableStats.byTable.length).toFixed(0)
                    : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Configuration */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-slate-600" />
          <h3 className="text-slate-900">Analysis Configuration</h3>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {/* Analysis Type */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Analysis Type
            </label>
            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value as AnalysisType)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="summary">Summary Statistics</option>
              <option value="distribution">Distribution</option>
              <option value="comparison">Comparison</option>
              <option value="correlation">Correlation</option>
            </select>
          </div>

          {/* Data Category */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Data Category
            </label>
            <select
              value={selectedTable}
              onChange={(e) => {
                setSelectedTable(e.target.value);
                setSelectedField1('');
                setSelectedField2('');
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {tables.map(table => (
                <option key={table.tableName} value={table.tableName}>
                  {table.displayName}
                </option>
              ))}
            </select>
          </div>

          {/* Primary Variable */}
          {analysisType !== 'summary' && (
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Primary Variable
              </label>
              <select
                value={selectedField1}
                onChange={(e) => setSelectedField1(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select variable...</option>
                {availableFields.map(field => (
                  <option key={field.fieldName} value={field.fieldName}>
                    {field.displayName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Secondary Variable (for comparison) */}
          {(analysisType === 'comparison' || analysisType === 'correlation') && (
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Secondary Variable
              </label>
              <select
                value={selectedField2}
                onChange={(e) => setSelectedField2(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select variable...</option>
                {availableFields.filter(f => f.fieldName !== selectedField1).map(field => (
                  <option key={field.fieldName} value={field.fieldName}>
                    {field.displayName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Chart Type */}
          {analysisType !== 'summary' && (
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Visualization
              </label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as ChartType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                {analysisType === 'comparison' && <option value="scatter">Scatter Plot</option>}
                {analysisType === 'distribution' && <option value="pie">Pie Chart</option>}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      <div className="grid grid-cols-2 gap-6">
        {/* Summary Statistics */}
        {analysisType === 'summary' && summaryStats && (
          <>
            <div className="bg-white border border-slate-200 rounded-xl p-6 col-span-2">
              <h3 className="text-slate-900 mb-4">Summary Statistics - {currentTable?.displayName}</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(summaryStats.categories).map(([field, stats]: [string, any]) => (
                  <div key={field} className="border border-slate-200 rounded-lg p-4">
                    <div className="font-medium text-slate-900 mb-3">{field}</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Count:</span>
                        <span className="font-medium text-slate-900">{stats.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Missing:</span>
                        <span className="font-medium text-slate-900">{stats.missing}</span>
                      </div>
                      {stats.mean !== undefined && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Mean:</span>
                            <span className="font-medium text-slate-900">{stats.mean.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Std Dev:</span>
                            <span className="font-medium text-slate-900">{stats.std.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Range:</span>
                            <span className="font-medium text-slate-900">{stats.min.toFixed(2)} - {stats.max.toFixed(2)}</span>
                          </div>
                        </>
                      )}
                      {stats.mode !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Most Common:</span>
                          <span className="font-medium text-slate-900">{stats.mode}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Completion by Category */}
            {crossTableStats && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 col-span-2">
                <h3 className="text-slate-900 mb-4">Data Completion by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={crossTableStats.byTable}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="tableName" tick={{ fill: '#64748B' }} />
                    <YAxis tick={{ fill: '#64748B' }} />
                    <Tooltip />
                    <Bar dataKey="recordCount" fill="#2563EB" name="Records" />
                    <Bar dataKey="subjectCount" fill="#10B981" name="Subjects" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}

        {/* Distribution Analysis */}
        {analysisType === 'distribution' && distributionData.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 col-span-2">
            <h3 className="text-slate-900 mb-4">
              Distribution Analysis - {availableFields.find(f => f.fieldName === selectedField1)?.displayName}
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              {chartType === 'bar' ? (
                <BarChart data={distributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey={distributionData[0].range ? 'range' : 'name'} tick={{ fill: '#64748B' }} />
                  <YAxis tick={{ fill: '#64748B' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563EB">
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              ) : chartType === 'pie' ? (
                <RechartsPieChart>
                  <Pie
                    data={distributionData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={(entry) => `${entry.name}: ${entry.percentage}%`}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              ) : (
                <RechartsLineChart data={distributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey={distributionData[0].range ? 'range' : 'name'} tick={{ fill: '#64748B' }} />
                  <YAxis tick={{ fill: '#64748B' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2} />
                </RechartsLineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}

        {/* Comparison Analysis */}
        {(analysisType === 'comparison' || analysisType === 'correlation') && comparisonData.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 col-span-2">
            <h3 className="text-slate-900 mb-4">
              Comparison - {availableFields.find(f => f.fieldName === selectedField1)?.displayName} vs {availableFields.find(f => f.fieldName === selectedField2)?.displayName}
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              {chartType === 'scatter' ? (
                <RechartsScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="x" name={availableFields.find(f => f.fieldName === selectedField1)?.displayName} tick={{ fill: '#64748B' }} />
                  <YAxis dataKey="y" name={availableFields.find(f => f.fieldName === selectedField2)?.displayName} tick={{ fill: '#64748B' }} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={comparisonData} fill="#2563EB" />
                </RechartsScatterChart>
              ) : chartType === 'bar' ? (
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="category" tick={{ fill: '#64748B' }} />
                  <YAxis tick={{ fill: '#64748B' }} />
                  <Tooltip />
                  <Bar dataKey="mean" fill="#2563EB" name="Mean" />
                </BarChart>
              ) : (
                <RechartsLineChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="category" tick={{ fill: '#64748B' }} />
                  <YAxis tick={{ fill: '#64748B' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="mean" stroke="#2563EB" strokeWidth={2} />
                </RechartsLineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Empty State */}
      {records.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <div className="text-slate-900 mb-2">No Data Available for Analysis</div>
          <div className="text-sm text-slate-600">
            Complete data records are required to generate analytics. Start collecting data in the Data Entry tab.
          </div>
        </div>
      )}
    </div>
  );
}