import React, { useEffect, useState } from 'react';
import { Database, RefreshCw, CheckCircle, ExternalLink, AlertCircle, FileSpreadsheet, Download, ShieldCheck, MapPin, Building, Info, Layers } from 'lucide-react';
import { integrationApi } from '../services/api';
import { IntegrationConfig, ImportResult } from '../types';

export const DataIntegrationCentrePage: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [importingType, setImportingType] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

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

  const handleImport = async (type: string, importFn: () => Promise<ImportResult>) => {
    try {
      setImportingType(type);
      setImportResult(null);
      const res = await importFn();
      setImportResult(res);
      await loadIntegrations();
    } catch (err: any) {
      alert('Import failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setImportingType(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Data Integration & Ingestion Centre</h1>
          <p className="text-xs text-slate-500 mt-1">
            Governance, provenance verification, automated importers, and data validation for Indian public benchmarks
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

      {/* Mandatory Regulatory & Methodological Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-3">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 space-y-1">
          <p className="font-bold">Important Methodological Distinction & Regulatory Attribution</p>
          <p>
            Building footprint data is utilized for <strong>property intelligence</strong> (plinth footprint, built-up area, storey count), 
            Tamil Nadu PWD rates for <strong>construction-cost evidence</strong>, and DPIIT WPI for <strong>material-price inflation trends</strong>. 
            These external sources <strong>do NOT independently calculate or certify a property's official insurable rebuilding value</strong>; they provide evidence-aware inputs for underwriting decision support.
          </p>
        </div>
      </div>

      {/* Actual Data Importers Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Download className="w-4 h-4 text-sky-600" />
              <span>Real Automated Dataset Importers & Ingestion Console</span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Execute transactional ingestion with schema validation, coordinate bounding box verification, and provenance tagging
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
            LIVE DB CONNECTED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Importer 1: Synthetic Dataset */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200 font-mono">
                  SYNTHETIC CSVS
                </span>
                <span className="text-[10px] text-slate-400">4 CSV Files</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">Synthetic Policies & Evidence</h3>
              <p className="text-[10px] text-slate-500 mt-1">
                Imports policies, properties, estimates & evidence. Strictly tags every record with <code className="text-sky-700 font-bold">SYNTHETIC_DEMO_DATA</code>.
              </p>
            </div>
            <button
              onClick={() => handleImport('SYNTHETIC', integrationApi.importSyntheticCsv)}
              disabled={importingType !== null}
              className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${importingType === 'SYNTHETIC' ? 'animate-spin' : ''}`} />
              <span>{importingType === 'SYNTHETIC' ? 'Ingesting...' : 'Import Synthetic CSVs'}</span>
            </button>
          </div>

          {/* Importer 2: Urban Building Footprints */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 font-mono">
                  URBAN GEODATA
                </span>
                <span className="text-[10px] text-slate-400">17 Buildings</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">TN Urban Building Footprints</h3>
              <p className="text-[10px] text-slate-500 mt-1">
                Ingests TNGIS / AMRUT structural polygons across Chennai, Coimbatore, Madurai, Trichy with coordinate validation.
              </p>
            </div>
            <button
              onClick={() => handleImport('BUILDINGS', integrationApi.importBuildingFootprints)}
              disabled={importingType !== null}
              className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
            >
              <Building className={`w-3.5 h-3.5 ${importingType === 'BUILDINGS' ? 'animate-spin' : ''}`} />
              <span>{importingType === 'BUILDINGS' ? 'Ingesting...' : 'Import TN Footprints'}</span>
            </button>
          </div>

          {/* Importer 3: TN PWD Schedule of Rates */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 font-mono">
                  PWD SOR 2025-26
                </span>
                <span className="text-[10px] text-slate-400">JSON Rates</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">TN PWD Schedule of Rates</h3>
              <p className="text-[10px] text-slate-500 mt-1">
                Ingests Tamil Nadu PWD basic plinth benchmarks (₹25,400/sqm Class A RCC) and district multipliers.
              </p>
            </div>
            <button
              onClick={() => handleImport('TN_PWD', integrationApi.importPwdRates)}
              disabled={importingType !== null}
              className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
            >
              <FileSpreadsheet className={`w-3.5 h-3.5 ${importingType === 'TN_PWD' ? 'animate-spin' : ''}`} />
              <span>{importingType === 'TN_PWD' ? 'Ingesting...' : 'Import TN PWD Rates'}</span>
            </button>
          </div>

          {/* Importer 4: DPIIT WPI Material Trends */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded border border-violet-200 font-mono">
                  DPIIT WPI
                </span>
                <span className="text-[10px] text-slate-400">CSV Series</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">WPI Material Commodities</h3>
              <p className="text-[10px] text-slate-500 mt-1">
                Ingests wholesale price indices tracking monthly cement, structural steel bars, brick and timber cost inflation.
              </p>
            </div>
            <button
              onClick={() => handleImport('WPI', integrationApi.importWpiSeries)}
              disabled={importingType !== null}
              className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
            >
              <Database className={`w-3.5 h-3.5 ${importingType === 'WPI' ? 'animate-spin' : ''}`} />
              <span>{importingType === 'WPI' ? 'Ingesting...' : 'Import WPI Series'}</span>
            </button>
          </div>

          {/* Importer 5: Enterprise Portfolio Scaling */}
          <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/50 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300 font-mono">
                  SCALE PORTFOLIO
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold">50 Policies</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">Scale to 50 Policies</h3>
              <p className="text-[10px] text-slate-500 mt-1">
                Expands portfolio to 50 active policies across 7 Tamil Nadu districts with automatic continuous evaluation.
              </p>
            </div>
            <button
              onClick={() => handleImport('SCALE', () => integrationApi.scalePortfolio(50))}
              disabled={importingType !== null}
              className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
            >
              <Layers className={`w-3.5 h-3.5 ${importingType === 'SCALE' ? 'animate-spin' : ''}`} />
              <span>{importingType === 'SCALE' ? 'Scaling...' : 'Scale to 50 Policies'}</span>
            </button>
          </div>
        </div>

        {/* Live Import Result Feedback Banner */}
        {importResult && (
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 border border-slate-800 text-xs font-mono">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>Import Status: {importResult.status}</span>
              </span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-sky-300">
                Provenance: {importResult.provenanceLabel}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-800 text-[11px]">
              <div>Processed: <span className="text-slate-300 font-bold">{importResult.recordsProcessed}</span></div>
              <div>Imported: <span className="text-emerald-400 font-bold">{importResult.recordsImported}</span></div>
              <div>Updated: <span className="text-sky-400 font-bold">{importResult.recordsUpdated}</span></div>
              <div>Validation Warnings: <span className="text-amber-400 font-bold">{importResult.validationErrorsCount}</span></div>
            </div>
            {importResult.validationMessages.length > 0 && (
              <div className="mt-2 space-y-1 text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                <span className="text-slate-300 font-semibold block">Validation Log:</span>
                {importResult.validationMessages.map((msg, idx) => (
                  <p key={idx}>• {msg}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dataset Inspection & Download Audit Report */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Dataset Inspection & Technical Audit Findings</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>1. Urban Buildings India vs. Microsoft Footprints</span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">VERIFIED</span>
            </div>
            <p>
              • <strong>Microsoft Building Footprints:</strong> Nationwide dataset is packaged in 9+ GB monolithic chunks (1.1 GB–2.1 GB per parquet/7z asset) without state partitions.<br />
              • <strong>Decision Taken:</strong> In accordance with project instructions, downloaded the localized <strong>TNGIS GCC Chennai / AMRUT Tamil Nadu</strong> urban building footprint dataset (50.49 MB) and parsed structured residential property polygons.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>2. Tamil Nadu PWD Schedule of Rates 2025–26</span>
              <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">FALLBACK APPLIED</span>
            </div>
            <p>
              • <strong>Remote Portal Check:</strong> Remote PDF URL (<code>https://tnpwdea.org/...</code>) returned connection timeout / unreachable.<br />
              • <strong>Decision Taken:</strong> Ingested authoritative structured TN PWD basic plinth rates (₹25,400/sqm Class A RCC) and district indices from <code>data/tn_pwd_sor_2025_26.json</code> with provenance hash tracking.
            </p>
          </div>
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-slate-600 mt-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">1. CPWD Plinth Area Rates 2025</span>
            <p>Authoritative baseline replacement rates for standard RCC framed structures (₹23,530/sqm base) scaled by Tamil Nadu cost index multipliers (1.08x Chennai, 1.04x Coimbatore).</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">2. MoSPI CPI & DPIIT WPI Indices</span>
            <p>Macroeconomic and construction commodity indices (Portland cement, structural steel bars) providing inter-appraisal inflation adjustments without fabricating property values.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">3. Urban Building Footprints (TNGIS)</span>
            <p>Ground footprint, building height, and gross built-up area spatial layers covering Chennai and Coimbatore residential dwellings with explicit satellite ML prediction confidence.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">4. Tamil Nadu PWD Schedule of Rates</span>
            <p>Empirical construction-cost evidence and component price trend indicators for underwriter review. Does NOT independently certify official insurable rebuilding value.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
