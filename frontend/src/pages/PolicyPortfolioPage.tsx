import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, RefreshCw, ArrowUpDown, Sliders, ExternalLink } from 'lucide-react';
import { policyApi } from '../services/api';
import { PolicySummary } from '../types';
import { ItvBadge } from '../components/ItvBadge';
import { ConfidenceBadge } from '../components/ConfidenceBadge';

export const PolicyPortfolioPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [policies, setPolicies] = useState<PolicySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [classFilter, setClassFilter] = useState(searchParams.get('classification') || '');

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const data = await policyApi.getPolicies(
        statusFilter || undefined,
        classFilter || undefined,
        searchQuery || undefined
      );
      setPolicies(data);
    } catch (err) {
      console.error('Error fetching policies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, [statusFilter, classFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadPolicies();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Active Homeowners Policy Portfolio</h1>
          <p className="text-xs text-slate-500 mt-1">
            Continuous in-force monitoring of dwelling coverage limits against real construction baselines
          </p>
        </div>
        <button
          onClick={loadPolicies}
          className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium shadow-sm transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Portfolio</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by policy number, policyholder, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">All ITV Classifications</option>
              <option value="ADEQUATE">Adequate (&ge;95%)</option>
              <option value="WATCH">Watch (90-94%)</option>
              <option value="WARNING">Warning (80-89%)</option>
              <option value="CRITICAL">Critical (&lt;80%)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="PENDING_RENEWAL">PENDING RENEWAL</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex space-x-2">
            <button
              type="submit"
              className="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              Filter
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('');
                setClassFilter('');
                setSearchParams({});
              }}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Policies Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Policy #</th>
                <th className="py-3 px-4">Policyholder</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Dwelling Coverage</th>
                <th className="py-3 px-4">Rebuilding Estimate</th>
                <th className="py-3 px-4">ITV Ratio</th>
                <th className="py-3 px-4">Coverage Gap</th>
                <th className="py-3 px-4">Drift</th>
                <th className="py-3 px-4">Evidence Confidence</th>
                <th className="py-3 px-4">Renewal Horizon</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-sky-600 mb-2" />
                    <span>Loading in-force policies...</span>
                  </td>
                </tr>
              ) : policies.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    No matching policies found for the selected criteria.
                  </td>
                </tr>
              ) : (
                policies.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-sky-600">
                      <Link to={`/policies/${p.id}`} className="hover:underline flex items-center space-x-1">
                        <span>{p.policyNumber}</span>
                      </Link>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">{p.policyholderName}</td>
                    <td className="py-3 px-4 text-slate-500">{p.city}, {p.state}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      ₹{(p.currentCoverageLimit / 100000).toFixed(2)}L
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      ₹{(p.latestRebuildingCost / 100000).toFixed(2)}L
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold">{p.currentItvRatio}%</span>
                        <ItvBadge classification={p.itvClassification} size="sm" />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {p.potentialCoverageGap > 0 ? (
                        <span className="text-rose-600">₹{(p.potentialCoverageGap / 100000).toFixed(2)}L</span>
                      ) : (
                        <span className="text-emerald-600">₹0 (Adequate)</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className={p.itvDrift < 0 ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                        {p.itvDrift < 0 ? `${p.itvDrift}%` : `+${p.itvDrift}%`}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <ConfidenceBadge
                        category={p.confidenceCategory}
                        score={p.confidenceScore}
                        abstentionTriggered={p.abstentionTriggered}
                      />
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {p.expiryDate}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center space-x-1">
                        <Link
                          to={`/policies/${p.id}`}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-medium text-[11px] transition-colors"
                        >
                          Details
                        </Link>
                        <Link
                          to={`/simulator?policyId=${p.id}`}
                          className="px-2 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium text-[11px] transition-colors"
                        >
                          Simulate
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

