import React, { useEffect, useState } from 'react';
import { Database, RefreshCw, CheckCircle, ExternalLink, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { integrationApi } from '../services/api';
import { IntegrationConfig } from '../types';

export const DataIntegrationCentrePage: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const data = await integrationApi.getAllIntegrations();
      setIntegrations(data);
    } catch (err) {
      console.error('Failed to load integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIntegrations();
  }, []);

  const handleSync = async (sourceId: string) => {
    try {
      setSyncingId(sourceId);
      await integrationApi.syncIntegration(sourceId);
      await loadIntegrations();
    } catch (err: any) {
      alert('Sync failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Data Integration Centre</h1>
          <p className="text-xs text-slate-500 mt-1">
            Governance, provenance verification, and status monitoring for external Indian public benchmarks
          </p>
        </div>
        <button
          onClick={loadIntegrations}
          className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Integrations</span>
        </button>
      </div>

      {/* Integration Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((i) => (
          <div key={i.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] font-bold text-sky-700 px-2 py-0.5 rounded bg-sky-50 border border-sky-200">
                  {i.sourceId}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                  {i.status}
                </span>
              </div>

              <h2 className="text-sm font-bold text-slate-900">{i.sourceName}</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Type: {i.sourceType}</p>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Provenance:</span>
                  <span className="font-semibold text-slate-800">{i.provenanceCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Records Ingested:</span>
                  <span className="font-semibold text-slate-800">{i.recordCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Synced:</span>
                  <span className="text-slate-800">{i.lastSyncAt ? i.lastSyncAt.substring(0, 16) : 'Pending'}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              {i.baseUrl ? (
                <a
                  href={i.baseUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-[11px] font-semibold text-sky-600 hover:underline"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-[11px] text-slate-400">Local Dataset</span>
              )}

              <button
                onClick={() => handleSync(i.sourceId)}
                disabled={syncingId === i.sourceId}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
              >
                {syncingId === i.sourceId ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                <span>{syncingId === i.sourceId ? 'Ingesting...' : 'Ingest & Sync'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Integration Principles and Governance Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 mb-2">Indian Public Data Governance & Provenance Rubric</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 mt-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">1. CPWD Plinth Area Rates 2025</span>
            <p>Authoritative baseline building replacement rates for standard RCC framed and masonry structures (₹23,530/sqm base) scaled by Tamil Nadu cost index multipliers (1.08x).</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">2. MoSPI CPI & DPIIT WPI Indices</span>
            <p>Macroeconomic and construction commodity indices (Portland cement, structural steel bars) providing inter-appraisal inflation adjustments without fabricating property values.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">3. AEEE Geospatial Building Stack (GOBS)</span>
            <p>Ground footprint, building height, and gross built-up area spatial layers covering Chennai and Coimbatore residential dwellings with explicit satellite ML prediction confidence.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

