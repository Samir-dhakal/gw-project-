import React, { useEffect, useState } from 'react';
import { TrendingDown, ArrowDownRight, RefreshCw, AlertCircle, Layers } from 'lucide-react';
import { policyApi, monitoringApi } from '../services/api';
import { PolicySummary, MonitoringEvaluation } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';

export const ItvDriftAnalysisPage: React.FC = () => {
  const [policies, setPolicies] = useState<PolicySummary[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<number>(1);
  const [evaluations, setEvaluations] = useState<MonitoringEvaluation[]>([]);
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

  const loadEvaluations = async (policyId: number) => {
    try {
      setLoading(true);
      const data = await monitoringApi.getEvaluationsForPolicy(policyId);
      setEvaluations(data);
    } catch (err) {
      console.error('Failed to load drift evaluations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPolicyId) {
      loadEvaluations(selectedPolicyId);
    }
  }, [selectedPolicyId]);

  const chartData = evaluations.map((e) => ({
    timestamp: e.evaluationTimestamp.substring(0, 10),
    itvRatio: e.itvRatio,
    rebuildingCost: e.rebuildingCost / 100000,
    coverage: e.dwellingCoverage / 100000,
  }));

  const selectedPolicy = policies.find((p) => p.id === selectedPolicyId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">ITV Drift & Deterioration Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">
            Quantifying temporal coverage erosion: &Delta;ITV = ITV<sub>current</sub> &minus; ITV<sub>prior</sub>
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

      {/* Scenario A Callout Banner */}
      {selectedPolicy?.policyNumber === 'POL-IN-2025-00101' && (
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-sky-900">
          <AlertCircle className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Scenario A Walkthrough Target:</span> Policy <code>POL-IN-2025-00101</code> demonstrates gradual post-bind underinsurance drift. Coverage was bound at 100% ITV (₹50 Lakh). Over subsequent months, replacement costs increased to ₹65 Lakh while dwelling limits remained unchanged, driving a -23.08% ITV drift into the Critical underinsurance tier.
          </div>
        </div>
      )}

      {/* Drift Chart Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Temporal Insurance-to-Value Trajectory</h2>
            <p className="text-xs text-slate-500">Historical snapshots tracking coverage vs rebuilding cost inflation</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500">Current Drift: </span>
            <span className="font-mono text-sm font-bold text-rose-600">
              {selectedPolicy ? `${selectedPolicy.itvDrift}%` : 'N/A'}
            </span>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 15, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="timestamp" tick={{ fontSize: 11 }} />
              <YAxis domain={[50, 110]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                formatter={(val: any, name: string) => [
                  name === 'itvRatio' ? `${val}%` : `₹${val}L`,
                  name === 'itvRatio' ? 'ITV Ratio' : name
                ]}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <ReferenceLine y={95} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Adequate 95%', position: 'insideTopRight', fill: '#10b981', fontSize: 10 }} />
              <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Critical 80%', position: 'insideBottomRight', fill: '#ef4444', fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="itvRatio"
                name="ITV Ratio (%)"
                stroke="#0284c7"
                strokeWidth={3}
                dot={{ r: 5, fill: '#0284c7' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

