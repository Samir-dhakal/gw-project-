import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileSpreadsheet, ArrowRight, RefreshCw, CheckCircle, Sliders, CheckSquare, AlertCircle } from 'lucide-react';
import { policyApi } from '../services/api';
import { PolicySummary } from '../types';
import { ItvBadge } from '../components/ItvBadge';
import { ConfidenceBadge } from '../components/ConfidenceBadge';

export const MidtermManagementPage: React.FC = () => {
  const [policies, setPolicies] = useState<PolicySummary[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMidtermPolicies = async () => {
    try {
      setLoading(true);
      const data = await policyApi.getPolicies();
      const filtered = data.filter((p) => p.workflowType === 'MIDTERM_REVIEW' || p.itvClassification === 'CRITICAL');
      setPolicies(filtered);
    } catch (err) {
      console.error('Failed to load midterm policies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMidtermPolicies();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Midterm In-Force Endorsement Management</h1>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Active Lifecycle Workflow
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dedicated operational queue for executing midterm dwelling limit endorsements prior to annual policy expiration
          </p>
        </div>
        <button
          onClick={loadMidtermPolicies}
          className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Midterm Queue</span>
        </button>
      </div>

      {/* Midterm Workflow Protocol Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Indian Insurance Midterm Endorsement Protocol</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-slate-600">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">1. Detection</span>
            <p>Continuous monitoring identifies ITV &lt; 80% with high evidence confidence.</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">2. Case Dispatch</span>
            <p>Review case automatically generated with endorsement recommendation.</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">3. Human Sign-Off</span>
            <p>Underwriter verifies rate benchmarks and records mandatory justification notes.</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">4. Endorsement Freeze</span>
            <p>Snapshot logged with endorsement number; policy updated in-force without cancellation.</p>
          </div>
        </div>
      </div>

      {/* Policies in Midterm Review Queue */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Policies in Midterm Review Status</h2>
            <p className="text-xs text-slate-500">In-force contracts needing post-bind coverage adjustment</p>
          </div>
          <span className="text-xs font-mono font-medium text-slate-400">Count: {policies.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                <th className="py-3 px-4">Policy Number</th>
                <th className="py-3 px-4">Policyholder</th>
                <th className="py-3 px-4">Current Coverage</th>
                <th className="py-3 px-4">Latest Estimate</th>
                <th className="py-3 px-4">ITV Ratio</th>
                <th className="py-3 px-4">Coverage Deficit</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">Loading midterm queue...</td>
                </tr>
              ) : policies.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">No active midterm cases.</td>
                </tr>
              ) : (
                policies.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-sky-600">
                      <Link to={`/policies/${p.id}`} className="hover:underline">{p.policyNumber}</Link>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">{p.policyholderName}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">₹{(p.currentCoverageLimit / 100000).toFixed(2)}L</td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">₹{(p.latestRebuildingCost / 100000).toFixed(2)}L</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold">{p.currentItvRatio}%</span>
                        <ItvBadge classification={p.itvClassification} size="sm" />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-rose-600">₹{(p.potentialCoverageGap / 100000).toFixed(2)}L</td>
                    <td className="py-3.5 px-4">
                      <ConfidenceBadge
                        category={p.confidenceCategory}
                        score={p.confidenceScore}
                        abstentionTriggered={p.abstentionTriggered}
                      />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center space-x-1.5">
                        <Link
                          to={`/simulator?policyId=${p.id}`}
                          className="px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium"
                        >
                          Simulate
                        </Link>
                        <Link
                          to="/workspace"
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-medium"
                        >
                          Review Case
                        </Link>
                      </div>
                    </td>
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

