import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sliders,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Info,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { scenarioApi, policyApi } from '../services/api';
import { ScenarioProjection, PolicySummary } from '../types';
import { ItvBadge } from '../components/ItvBadge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const ScenarioSimulatorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialPolicyId = searchParams.get('policyId') ? Number(searchParams.get('policyId')) : 1;

  const [policies, setPolicies] = useState<PolicySummary[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<number>(initialPolicyId);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [projection, setProjection] = useState<ScenarioProjection | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPolicyList = async () => {
      try {
        const data = await policyApi.getPolicies();
        setPolicies(data);
      } catch (err) {
        console.error('Failed to load policies:', err);
      }
    };
    loadPolicyList();
  }, []);

  const runSimulation = async (policyId: number, customVal?: number) => {
    try {
      setLoading(true);
      const data = await scenarioApi.simulateScenarios(policyId, customVal);
      setProjection(data);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPolicyId) {
      runSimulation(selectedPolicyId, customAmount ? Number(customAmount) : undefined);
    }
  }, [selectedPolicyId]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAmount || isNaN(Number(customAmount))) return;
    runSimulation(selectedPolicyId, Number(customAmount));
  };

  const chartData = projection?.scenarios.map((s) => ({
    name: s.scenarioKey,
    proposed: s.proposedCoverage / 100000,
    gap: s.remainingGap / 100000,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Coverage Scenario Simulator</h1>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Zero Policy Mutation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compare hypothetical resolution coverage scenarios without modifying live policy records
          </p>
        </div>

        {/* Policy Selector */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-600">Active Policy:</label>
          <select
            value={selectedPolicyId}
            onChange={(e) => setSelectedPolicyId(Number(e.target.value))}
            className="py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {policies.map((p) => (
              <option key={p.id} value={p.id}>
                {p.policyNumber} ({p.policyholderName} - ₹{(p.currentCoverageLimit / 100000).toFixed(0)}L)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Safety Invariant Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-amber-900">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Regulatory Safety Invariant:</span> All coverage projections evaluated below are strictly hypothetical simulations. They do not alter policyholder contracts, liability bounds, or premium rating files. Actual coverage adjustments require formal human underwriter endorsement authorization.
        </div>
      </div>

      {/* Baseline Overview Grid */}
      {projection && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Existing Coverage</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">
                ₹{(projection.currentCoverage / 100000).toFixed(2)} Lakh
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Rebuilding Cost Benchmark</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">
                ₹{(projection.rebuildingCostEstimate / 100000).toFixed(2)} Lakh
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Baseline ITV Ratio</div>
              <div className={`text-lg font-bold mt-0.5 ${projection.currentItvRatio < 80 ? 'text-rose-600' : 'text-slate-900'}`}>
                {projection.currentItvRatio}%
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Current Coverage Gap</div>
              <div className={`text-lg font-bold mt-0.5 ${projection.currentGap > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                ₹{(projection.currentGap / 100000).toFixed(2)} Lakh
              </div>
            </div>
          </div>

          {/* Custom Coverage Proposal Input */}
          <form onSubmit={handleCustomSubmit} className="mt-4 pt-4 border-t border-slate-100 flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-700">Test Custom Limit:</span>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">₹</span>
              <input
                type="number"
                placeholder="e.g. 5800000"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="pl-7 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 w-48 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              Simulate Custom
            </button>
          </form>
        </div>
      )}

      {/* Comparison Grid & Table */}
      {projection && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-900">Coverage Limit Resolution Scenarios</h2>
            <p className="text-xs text-slate-500">Comparative trade-off analysis across standard coinsurance and full-replacement thresholds</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                  <th className="py-3 px-4">Scenario</th>
                  <th className="py-3 px-4">Proposed Coverage</th>
                  <th className="py-3 px-4">Projected ITV Ratio</th>
                  <th className="py-3 px-4">Remaining Deficit</th>
                  <th className="py-3 px-4">Coverage &Delta; (Adjustment)</th>
                  <th className="py-3 px-4">Analytical Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projection.scenarios.map((s) => (
                  <tr key={s.scenarioKey} className={s.scenarioKey === 'PCT_95' ? 'bg-sky-50/40 font-medium' : 'hover:bg-slate-50/60'}>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center space-x-1.5">
                        <span>{s.label}</span>
                        {s.scenarioKey === 'PCT_95' && (
                          <span className="text-[10px] uppercase font-bold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
                            Recommended
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ₹{(s.proposedCoverage / 100000).toFixed(2)} Lakh
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">{s.projectedItvRatio}%</span>
                        <ItvBadge classification={s.classification} size="sm" />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {s.remainingGap > 0 ? (
                        <span className="text-rose-600 font-bold">₹{(s.remainingGap / 100000).toFixed(2)} Lakh</span>
                      ) : (
                        <span className="text-emerald-600 font-bold">₹0 (Fully Covered)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold">
                      {s.coverageDelta > 0 ? (
                        <span className="text-sky-700">+₹{(s.coverageDelta / 100000).toFixed(2)}L</span>
                      ) : s.coverageDelta < 0 ? (
                        <span className="text-slate-500">-₹{(Math.abs(s.coverageDelta) / 100000).toFixed(2)}L</span>
                      ) : (
                        <span className="text-slate-400">₹0 (No change)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">{s.rationale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Visual Simulation Comparison Chart */}
      {projection && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900">Scenario Financial Comparison (₹ in Lakhs)</h2>
            <p className="text-xs text-slate-500">Proposed coverage limit vs. remaining potential shortfall</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="L" />
                <Tooltip
                  formatter={(val: any) => [`₹${val} Lakh`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="proposed" name="Proposed Coverage" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gap" name="Remaining Shortfall" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
