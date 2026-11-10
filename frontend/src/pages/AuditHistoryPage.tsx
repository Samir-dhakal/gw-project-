import React, { useEffect, useState } from 'react';
import { History, Shield, RefreshCw, Search, CheckCircle, FileText } from 'lucide-react';
import { auditApi } from '../services/api';
import { AuditLog } from '../types';

export const AuditHistoryPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await auditApi.getRecentLogs();
      setLogs(data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((l) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      l.action.toLowerCase().includes(q) ||
      l.username.toLowerCase().includes(q) ||
      l.entityType.toLowerCase().includes(q) ||
      l.entityId.toLowerCase().includes(q) ||
      (l.details && l.details.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">System-Wide Regulatory Audit Trail</h1>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border">
              Append-Only Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-proof chronological record of evaluations, underwriter decisions, endorsements, and integration events
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Audit Trail</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by username, action, entity, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operator / Principal</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity Type</th>
                <th className="py-3 px-4">Entity ID</th>
                <th className="py-3 px-4">Audit Details &amp; Operational Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-sans">
                    Loading audit trail...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-sans">
                    No matching audit log records.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{l.timestamp}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800 font-sans">{l.username}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                        {l.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{l.entityType}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{l.entityId}</td>
                    <td className="py-3 px-4 text-slate-700 font-sans text-xs max-w-md">{l.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

