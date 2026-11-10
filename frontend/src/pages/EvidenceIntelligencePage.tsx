import React, { useEffect, useState } from 'react';
import { FileCheck2, Database, ExternalLink, RefreshCw, AlertCircle, Shield } from 'lucide-react';
import { policyApi, evidenceApi } from '../services/api';
import { PolicySummary, EvidenceRecord } from '../types';

export const EvidenceIntelligencePage: React.FC = () => {
  const [policies, setPolicies] = useState<PolicySummary[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<number>(1);
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const list = await policyApi.getPolicies();
        setPolicies(list);
      } catch (err) {
        console.error('Failed to load policies:', err);
      }
    };
    loadPolicies();
  }, []);

  const loadEvidence = async (policyId: number) => {
    try {
      setLoading(true);
      const detail = await policyApi.getPolicyDetail(policyId);
      setEvidenceList(detail.evidenceRecords || []);
    } catch (err) {
      console.error('Failed to load evidence records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPolicyId) {
      loadEvidence(selectedPolicyId);
    }
  }, [selectedPolicyId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Evidence Intelligence & Provenance Tracking</h1>
          <p className="text-xs text-slate-500 mt-1">
            Inspection of supporting external documents, APIs, publication timestamps, and component reliability
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-600">Select Policy:</label>
          <select
            value={selectedPolicyId}
            onChange={(e) => setSelectedPolicyId(Number(e.target.value))}
            className="py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {policies.map((p) => (
              <option key={p.id} value={p.id}>
                {p.policyNumber} ({p.policyholderName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Evidence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {evidenceList.length === 0 ? (
          <div className="md:col-span-2 p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            No evidence records linked to this property yet.
          </div>
        ) : (
          evidenceList.map((e) => (
            <div key={e.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="font-mono text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                    {e.sourceId}
                  </span>
                  <h2 className="text-sm font-bold text-slate-900 mt-1.5">{e.sourceName}</h2>
                </div>
                <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {e.provenanceCategory}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Reliability</span>
                  <span className="font-bold text-slate-900 text-sm">{e.sourceReliabilityScore}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Freshness</span>
                  <span className="font-bold text-slate-900 text-sm">{e.freshnessScore}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Completeness</span>
                  <span className="font-bold text-slate-900 text-sm">{e.completenessScore}%</span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600 font-mono bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Publication Date:</span>
                  <span className="font-semibold text-slate-800">{e.publicationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ingestion Timestamp:</span>
                  <span className="text-slate-800">{e.retrievalDate.substring(0, 16)}</span>
                </div>
              </div>

              {e.rawPayload && (
                <div className="text-[11px] font-mono bg-slate-900 text-slate-200 p-2.5 rounded-lg overflow-x-auto">
                  <pre>{e.rawPayload}</pre>
                </div>
              )}

              {e.sourceUrl && (
                <div className="pt-2 border-t border-slate-100">
                  <a
                    href={e.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-sky-600 hover:underline"
                  >
                    <span>View Official Government Publication</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

