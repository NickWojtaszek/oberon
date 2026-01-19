import { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Trash2, FileText, Calendar, User, Hash, CheckCircle2, Clock, History, X, Beaker, Loader2 } from 'lucide-react';
import { getAllRecords, getRecordsByProtocol, deleteRecord, ClinicalDataRecord, AuditEntry } from '../utils/dataStorage';
import { loadMockData, isMockDataLoaded, clearMockData } from '../utils/mockDataLoader';
import { DatabaseTable } from './database/utils/schemaGenerator';

interface DataBrowserProps {
  protocolNumber?: string;
  protocolVersion?: string;
  onViewRecord: (record: ClinicalDataRecord) => void;
  tables?: DatabaseTable[];
}

type SortColumn = 'subjectId' | 'visitNumber' | 'enrollmentDate' | 'collectedAt' | 'status';
type SortDirection = 'asc' | 'desc';

export function DataBrowser({ protocolNumber, protocolVersion, onViewRecord, tables = [] }: DataBrowserProps) {
  const [records, setRecords] = useState<ClinicalDataRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<ClinicalDataRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'complete'>('all');
  const [sortColumn, setSortColumn] = useState<SortColumn>('collectedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  // Audit trail modal state
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditRecord, setAuditRecord] = useState<ClinicalDataRecord | null>(null);
  // Mock data loading state
  const [isLoadingMockData, setIsLoadingMockData] = useState(false);
  const [hasMockData, setHasMockData] = useState(false);

  // Load records
  useEffect(() => {
    loadRecords();
  }, [protocolNumber, protocolVersion]);

  // Filter and sort records
  useEffect(() => {
    let filtered = [...records];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((record) =>
        record.subjectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.recordId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.collectedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((record) => record.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortColumn];
      let bValue: any = b[sortColumn];

      // Handle visit number (can be null)
      if (sortColumn === 'visitNumber') {
        aValue = a.visitNumber || '0';
        bValue = b.visitNumber || '0';
      }

      // Convert to comparable values
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredRecords(filtered);
  }, [records, searchTerm, statusFilter, sortColumn, sortDirection]);

  const loadRecords = () => {
    let loadedRecords: ClinicalDataRecord[];

    if (protocolNumber) {
      loadedRecords = getRecordsByProtocol(protocolNumber, protocolVersion);
      // Check if mock data exists
      setHasMockData(isMockDataLoaded(protocolNumber));
    } else {
      loadedRecords = getAllRecords();
    }

    setRecords(loadedRecords);
    console.log('📊 Loaded records:', loadedRecords.length);
  };

  // Load mock data for testing
  const handleLoadMockData = async () => {
    if (!protocolNumber || !protocolVersion) {
      alert('Please select a protocol and version first');
      return;
    }

    if (!tables || tables.length === 0) {
      alert('No schema tables available. Please ensure the protocol has a defined schema.');
      return;
    }

    if (hasMockData) {
      if (!confirm('Mock data already exists. Do you want to clear it and reload?')) {
        return;
      }
      clearMockData(protocolNumber);
    }

    setIsLoadingMockData(true);

    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = loadMockData(protocolNumber, protocolVersion, tables);

    setIsLoadingMockData(false);

    if (result.success) {
      loadRecords();
      alert(`Successfully loaded ${result.count} mock patient records with ${tables.length} data tables!`);
    } else {
      alert(`Failed to load mock data: ${result.error}`);
    }
  };

  // Clear mock data
  const handleClearMockData = () => {
    if (!protocolNumber) return;

    if (confirm('Are you sure you want to remove all mock data (MOCK-xxx records)?')) {
      const count = clearMockData(protocolNumber);
      loadRecords();
      alert(`Removed ${count} mock records`);
    }
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleDeleteRecord = (recordId: string) => {
    if (confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      const result = deleteRecord(recordId);
      if (result.success) {
        loadRecords();
        console.log('✅ Record deleted:', recordId);
      } else {
        alert(`Failed to delete record: ${result.error}`);
      }
    }
  };

  const handleViewRecord = (record: ClinicalDataRecord) => {
    setSelectedRecordId(record.recordId);
    onViewRecord(record);
  };

  const exportToCSV = () => {
    if (filteredRecords.length === 0) {
      alert('No records to export');
      return;
    }

    // Build CSV header
    const headers = ['Subject ID', 'Visit', 'Enrollment Date', 'Status', 'Collected At', 'Collected By'];
    
    // Build CSV rows
    const rows = filteredRecords.map((record) => [
      record.subjectId,
      record.visitNumber || 'Baseline',
      record.enrollmentDate,
      record.status,
      new Date(record.collectedAt).toLocaleString(),
      record.collectedBy,
    ]);

    // Combine
    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinical-data-${protocolNumber || 'all'}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFieldCount = (record: ClinicalDataRecord): number => {
    let count = 0;
    Object.values(record.data).forEach((tableData) => {
      count += Object.keys(tableData).length;
    });
    return count;
  };

  const formatDate = (isoDate: string): string => {
    return new Date(isoDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (isoDate: string): string => {
    return new Date(isoDate).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleShowAuditTrail = (record: ClinicalDataRecord) => {
    setAuditRecord(record);
    setShowAuditModal(true);
  };

  const getAuditActionColor = (action: AuditEntry['action']) => {
    switch (action) {
      case 'created': return 'bg-green-100 text-green-800';
      case 'updated': return 'bg-blue-100 text-blue-800';
      case 'status_changed': return 'bg-purple-100 text-purple-800';
      case 'deleted': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-slate-900">Clinical Data Browser</h2>
            <p className="text-sm text-slate-600 mt-1">
              {protocolNumber 
                ? `Viewing data for Protocol ${protocolNumber} ${protocolVersion ? `• Version ${protocolVersion}` : ''}`
                : 'Viewing all collected clinical data'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-600">
              {filteredRecords.length} {filteredRecords.length === 1 ? 'record' : 'records'}
            </div>
            {/* Mock Data Button for Testing */}
            {protocolNumber && (
              <div className="flex items-center gap-2">
                {hasMockData && (
                  <button
                    onClick={handleClearMockData}
                    className="px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 text-sm"
                    title="Remove mock test data"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear Mock
                  </button>
                )}
                <button
                  onClick={handleLoadMockData}
                  disabled={isLoadingMockData}
                  className="px-3 py-2 border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
                  title="Load 20 mock patients for testing Analytics"
                >
                  {isLoadingMockData ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Beaker className="w-4 h-4" />
                  )}
                  {hasMockData ? 'Reload Mock' : 'Load Mock Data'}
                </button>
              </div>
            )}
            <button
              onClick={exportToCSV}
              disabled={filteredRecords.length === 0}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-3 gap-4">
          {/* Search */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Subject ID, Record ID, or Collector..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Status
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'draft' | 'complete')}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft Only</option>
                <option value="complete">Complete Only</option>
              </select>
              <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <div className="text-slate-600">
              {records.length === 0 
                ? 'No clinical data collected yet'
                : 'No records match your search criteria'}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              {records.length === 0 
                ? 'Start collecting data in the Data Entry tab'
                : 'Try adjusting your filters or search term'}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th
                    onClick={() => handleSort('subjectId')}
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Subject ID
                      {sortColumn === 'subjectId' && (
                        <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('visitNumber')}
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Visit
                      {sortColumn === 'visitNumber' && (
                        <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('enrollmentDate')}
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Enrollment
                      {sortColumn === 'enrollmentDate' && (
                        <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('status')}
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Status
                      {sortColumn === 'status' && (
                        <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Fields
                  </th>
                  <th
                    onClick={() => handleSort('collectedAt')}
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Collected At
                      {sortColumn === 'collectedAt' && (
                        <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Collected By
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRecords.map((record) => (
                  <tr
                    key={record.recordId}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                      selectedRecordId === record.recordId ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleViewRecord(record)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900">{record.subjectId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-700">{record.visitNumber || 'Baseline'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-700">{formatDate(record.enrollmentDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.status === 'complete' ? (
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full w-fit">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          <span className="text-xs font-medium text-green-700">Complete</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full w-fit">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span className="text-xs font-medium text-amber-700">Draft</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600">{getFieldCount(record)} fields</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600">{formatDateTime(record.collectedAt)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600">{record.collectedBy}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewRecord(record);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View/Edit Record"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowAuditTrail(record);
                          }}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="View Audit Trail"
                        >
                          <History className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRecord(record.recordId);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Audit Trail Modal */}
      {showAuditModal && auditRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-600" />
                  Audit Trail
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Record: {auditRecord.subjectId} • Visit {auditRecord.visitNumber || 'Baseline'}
                </p>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {(!auditRecord.auditTrail || auditRecord.auditTrail.length === 0) ? (
                <div className="text-center py-8 text-slate-500">
                  <History className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No audit trail available for this record.</p>
                  <p className="text-sm mt-1">Changes will be tracked from now on.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {auditRecord.auditTrail.slice().reverse().map((entry, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-purple-500" />
                      <div className="flex-1 pb-4 border-b border-slate-100 last:border-b-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getAuditActionColor(entry.action)}`}>
                            {entry.action.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-500">
                            {formatDateTime(entry.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700">{entry.details}</p>
                        <p className="text-xs text-slate-500 mt-1">By: {entry.user}</p>
                        {entry.changedFields && entry.changedFields.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-slate-500 mb-1">Changed fields:</p>
                            <div className="flex flex-wrap gap-1">
                              {entry.changedFields.slice(0, 10).map((field, i) => (
                                <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                                  {field}
                                </span>
                              ))}
                              {entry.changedFields.length > 10 && (
                                <span className="text-xs text-slate-500">
                                  +{entry.changedFields.length - 10} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
