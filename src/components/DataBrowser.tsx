import { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Trash2, FileText, Calendar, User, Hash, CheckCircle2, Clock } from 'lucide-react';
import { getAllRecords, getRecordsByProtocol, deleteRecord, ClinicalDataRecord } from '../utils/dataStorage';

interface DataBrowserProps {
  protocolNumber?: string;
  protocolVersion?: string;
  onViewRecord: (record: ClinicalDataRecord) => void;
}

type SortColumn = 'subjectId' | 'visitNumber' | 'enrollmentDate' | 'collectedAt' | 'status';
type SortDirection = 'asc' | 'desc';

export function DataBrowser({ protocolNumber, protocolVersion, onViewRecord }: DataBrowserProps) {
  const [records, setRecords] = useState<ClinicalDataRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<ClinicalDataRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'complete'>('all');
  const [sortColumn, setSortColumn] = useState<SortColumn>('collectedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

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
    } else {
      loadedRecords = getAllRecords();
    }
    
    setRecords(loadedRecords);
    console.log('📊 Loaded records:', loadedRecords.length);
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
    </div>
  );
}
