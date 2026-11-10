import React, { useEffect, useState } from 'react';
import { Activity, Play, RefreshCw, Layers, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { monitoringApi, policyApi } from '../services/api';
import { MonitoringEvaluation, PolicySummary } from '../types';
import { ItvBadge } from '../components/ItvBadge';
import { ConfidenceBadge } from '../components/ConfidenceBadge';

export const MonitoringCentrePage: React.FC = () => {
  const [policies, setPolicies] = useState<PolicySummary[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<number>(1);
  const [evaluations, setEvaluations] = useState<MonitoringEvaluation[]>([]);
  const [running, setRunning] = useState(false);
  const [triggerType, setTriggerType] = useState<string>('SCHEDULED_DAILY');

  const loadData = async () => {
    try {
      const policyList = await policyApi.getPolicies();
      setPolicies(policyList);
      if (policyList.length > 0) {
        const evals = await monitoringApi.getEvaluationsForPolicy(selectedPolicyId);
        setEvaluations(evals.reverse()); // most recent first
      }
    } catch (err) {
      console.error('Error loading monitoring data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedPolicyId]);

  const handleRunEvaluation = async (type: string) => {
    try {
      setRunning(true);
      await monitoringApi.evaluatePolicy(selectedPolicyId, type);
      await loadData();
    } catch (err: any) {
      alert('Monitoring evaluation failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setRunning(false);
    }
  };

  const handleBatchScan = async () => {
    try {
      setRunning(true);
      await monitoringApi.runBatchScan('MANUAL_BATCH_TRIGGER');
      await loadData();
    } catch (err: any) {
      alert('Batch scan failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Continuous In-Force Monitoring Centre</h1>
          <p className="text-xs text-slate-500 mt-1">
            Multi-modal evaluation pipeline: Scheduled Daily scans, Event-Driven triggers, and Manual Underwriter audits
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleBatchScan}
            disabled={running}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
          >
            {running ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>Execute Batch In-Force Scan</span>
          </button>
        </div>
      </div>

      {/* Monitoring Execution Console */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">Event-Driven & Manual Trigger Console</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5">
            <label className="text-xs text-slate-500 block mb-1">Target Active Policy</label>
            <select
              value={selectedPolicyId}
              onChange={(e) => setSelectedPolicyId(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {policies.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.policyNumber} ({p.policyholderName} - ₹{(p.currentCoverageLimit / 100000).toFixed(0)}L)
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="text-xs text-slate-500 block mb-1">Simulation Trigger Type</label>
            <select
              value={triggerType}
              onChange={(e) => setTriggerType(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="SCHEDULED_DAILY">SCHEDULED_DAILY (2:00 AM Cron)</option>
              <option value="EVENT_DRIVEN">EVENT_DRIVEN (External Rate Table Imported)</option>
              <option value="MANUAL_REASSESSMENT">MANUAL_REASSESSMENT (Underwriter Trigger)</option>
            </select>
          </div>

          <div className="md:col-span-3 pt-5">
            <button
              onClick={() => handleRunEvaluation(triggerType)}
              disabled={running}
              className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              {running ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>Trigger Evaluation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Monitoring Evaluation Audit Trail */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Historical In-Force Evaluation Snapshots</h2>
            <p className="text-xs text-slate-500">Append-only audit record of temporal ITV evaluations for selected policy</p>
          </div>
          <span className="text-xs font-mono font-medium text-slate-400">Total Evaluations: {evaluations.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Trigger</th>
                <th className="py-3 px-4">Dwelling Coverage</th>
                <th className="py-3 px-4">Rebuilding Cost</th>
                <th className="py-3 px-4">ITV Ratio</th>
                <th className="py-3 px-4">Coverage Gap</th>
                <th className="py-3 px-4">Drift</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Recommendation / Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {evaluations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No evaluations recorded for this policy yet.
                  </td>
                </tr>
              ) : (
                evaluations.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-700">{e.evaluationTimestamp}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{e.triggerType}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">₹{(e.dwellingCoverage / 100000).toFixed(2)}L</td>
                    <td className="py-3 px-4 font-bold text-slate-700">₹{(e.rebuildingCost / 100000).toFixed(2)}L</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold">{e.itvRatio}%</span>
                        <ItvBadge classification={e.itvClassification} size="sm" />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-rose-600">
                      ₹{(e.potentialCoverageGap / 100000).toFixed(2)}L
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className={e.itvDrift < 0 ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                        {e.itvDrift < 0 ? `${e.itvDrift}%` : `+${e.itvDrift}%`}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <ConfidenceBadge
                        category={e.confidenceCategory}
                        score={e.confidenceScore}
                        abstentionTriggered={e.abstentionTriggered}
                      />
                    </td>
                    <td className="py-3 px-4 max-w-sm text-slate-600">{e.recommendationText}</td>
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

