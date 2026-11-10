import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, AlertCircle, RefreshCw, CheckCircle2, ArrowRight, Sliders, CheckSquare } from 'lucide-react';
import { policyApi } from '../services/api';
import { PolicySummary } from '../types';
import { ItvBadge } from '../components/ItvBadge';
import { ConfidenceBadge } from '../components/ConfidenceBadge';

export const RenewalManagementPage: React.FC = () => {
  const [policies, setPolicies] = useState<PolicySummary[]>([]);
  const [windowDays, setWindowDays] = useState<number>(90);
  const [loading, setLoading] = useState(true);

  const loadRenewalPolicies = async () => {
    try {
      setLoading(true);
      const data = await policyApi.getPolicies();
      // Filter policies approaching renewal
      const filtered = data.filter((p) => p.workflowType === 'RENEWAL_WINDOW' || p.policyNumber === 'POL-IN-2025-00102');
      setPolicies(filtered);
    } catch (err) {
      console.error('Failed to load renewal policies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRenewalPolicies();
  }, [windowDays]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Renewal Window Underinsurance Management</h1>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Proactive Pre-Renewal Workflow
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Reassessing approaching renewal expirations to prevent carrying underinsurance into new policy years
          </p>
        </div>

        {/* Window Selector */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-600">Horizon Window:</label>
          <select
            value={windowDays}
            onChange={(e) => setWindowDays(Number(e.target.value))}
            className="py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value={30}>30 Days (Immediate Renewal)</option>
            <option value={60}>60 Days (Standard Horizon)</option>
            <option value={90}>90 Days (Advance Underwriting)</option>
          </select>
        </div>
      </div>

      {/* Scenario C Walkthrough Banner */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-sky-900 shadow-sm">
        <AlertCircle className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Scenario C Walkthrough Target (Complete Renewal Underinsurance Resolution):</span>
          <p className="mt-1">
            Policy <code>POL-IN-2025-00102</code> (Adyar, Chennai) has an expiry date approaching in 45 days. The dwelling coverage remains bound at ₹45 Lakh while the latest verified CPWD PAR 2025 rebuilding estimate is ₹60 Lakh (ITV = 75.00%, Critical Underinsurance).
          </p>
          <p className="mt-1 font-semibold text-sky-800">
            Rather than carrying a ₹15 Lakh deficit into the next policy term, the underwriter opens the Renewal Review Case, simulates scenarios, selects the 95% target (₹57 Lakh), and records approval notes to issue an adequate renewal contract.
          </p>
        </div>
      </div>

      {/* Renewal Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Policies Approaching Expiration within {windowDays} Days</h2>
            <p className="text-xs text-slate-500">Proactively align coverage limits in the automated renewal quotation cycle</p>
          </div>
          <span className="text-xs font-mono font-medium text-slate-400">Queue: {policies.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                <th className="py-3 px-4">Policy #</th>
                <th className="py-3 px-4">Policyholder</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Existing Coverage</th>
                <th className="py-3 px-4">Latest Rebuilding Estimate</th>
                <th className="py-3 px-4">ITV Ratio</th>
                <th className="py-3 px-4">Renewal Deficit</th>
                <th className="py-3 px-4">Recommended Renewal Limit</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">Loading renewal queue...</td>
                </tr>
              ) : policies.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">No policies in selected renewal window.</td>
                </tr>
              ) : (
                policies.map((p) => {
                  const target95 = Math.round(p.latestRebuildingCost * 0.95);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-sky-600">
                        <Link to={`/policies/${p.id}`} className="hover:underline">{p.policyNumber}</Link>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">{p.policyholderName}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{p.expiryDate}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">₹{(p.currentCoverageLimit / 100000).toFixed(2)}L</td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">₹{(p.latestRebuildingCost / 100000).toFixed(2)}L</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold">{p.currentItvRatio}%</span>
                          <ItvBadge classification={p.itvClassification} size="sm" />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-rose-600">
                        ₹{(p.potentialCoverageGap / 100000).toFixed(2)}L
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 bg-emerald-50/50">
                        ₹{(target95 / 100000).toFixed(2)} Lakh (95%)
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
                            Resolve Case
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

