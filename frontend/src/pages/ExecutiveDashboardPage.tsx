import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  TrendingDown,
  Clock,
  Layers,
  ArrowUpRight,
  RefreshCw,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { analyticsApi, policyApi } from '../services/api';
import { PortfolioAnalytics, PolicySummary } from '../types';
import { StatCard } from '../components/StatCard';
import { ItvBadge } from '../components/ItvBadge';
import { ConfidenceBadge } from '../components/ConfidenceBadge';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

export const ExecutiveDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<PortfolioAnalytics | null>(null);
  const [criticalPolicies, setCriticalPolicies] = useState<PolicySummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsData, policiesData] = await Promise.all([
        analyticsApi.getPortfolioAnalytics(),
        policyApi.getPolicies(undefined, 'CRITICAL')
      ]);
      setAnalytics(analyticsData);
      setCriticalPolicies(policiesData);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <RefreshCw className="w-8 h-8 text-sky-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Aggregating live portfolio intelligence...</p>
        </div>
      </div>
    );
  }

  const COLORS = {
    ADEQUATE: '#10b981',
    WATCH: '#f59e0b',
    WARNING: '#f97316',
    CRITICAL: '#ef4444'
  };

  const pieData = analytics ? [
    { name: 'Adequate (>=95%)', value: analytics.adequateCount, color: COLORS.ADEQUATE },
    { name: 'Watch (90-94%)', value: analytics.watchCount, color: COLORS.WATCH },
    { name: 'Warning (80-89%)', value: analytics.warningCount, color: COLORS.WARNING },
    { name: 'Critical (<80%)', value: analytics.criticalCount, color: COLORS.CRITICAL }
  ] : [];

  const barData = analytics ? [
    { name: 'Adequate', count: analytics.adequateCount },
    { name: 'Watch', count: analytics.watchCount },
    { name: 'Warning', count: analytics.warningCount },
    { name: 'Critical', count: analytics.criticalCount }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-sky-900/60 border border-sky-700/60 text-sky-300 text-xs font-semibold mb-2">
            <span>In-Force In-Flight Monitoring Active</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Executive Underinsurance Intelligence Dashboard</h1>
          <p className="text-sm text-slate-300 mt-1">
            Real-time dwelling coverage adequacy tracking across residential portfolios in Tamil Nadu.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-600 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Metrics</span>
          </button>
          <Link
            to="/workspace"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <span>Review Workspace</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Policies"
          value={analytics?.totalPoliciesMonitored || 0}
          subtitle="Active residential homeowners"
          icon={<Layers className="w-5 h-5 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Total Portfolio Coverage Gap"
          value={`₹${((analytics?.totalPortfolioCoverageGap || 0) / 100000).toFixed(1)} Lakh`}
          subtitle="Net dwelling underinsurance deficit"
          icon={<TrendingDown className="w-5 h-5 text-rose-600" />}
          color="rose"
        />
        <StatCard
          title="Critical Policies (<80% ITV)"
          value={analytics?.criticalCount || 0}
          subtitle="Severe underinsurance drift"
          icon={<ShieldAlert className="w-5 h-5 text-rose-600" />}
          color="rose"
        />
        <StatCard
          title="Resolution Rate"
          value={`${analytics?.resolutionRatePercent || 0}%`}
          subtitle={`${analytics?.resolvedCasesCount || 0} resolved of ${((analytics?.openCasesCount || 0) + (analytics?.resolvedCasesCount || 0))} review cases`}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          color="emerald"
        />
      </div>

      {/* Secondary KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Adequate Tier (&ge;95%)</div>
            <div className="text-xl font-bold text-emerald-600 mt-1">{analytics?.adequateCount || 0}</div>
          </div>
          <ShieldCheck className="w-7 h-7 text-emerald-500/30" />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Warning Tier (80-89%)</div>
            <div className="text-xl font-bold text-orange-600 mt-1">{analytics?.warningCount || 0}</div>
          </div>
          <AlertCircle className="w-7 h-7 text-orange-500/30" />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Abstentions / Verifications</div>
            <div className="text-xl font-bold text-purple-600 mt-1">{analytics?.lowConfidenceAbstentionsCount || 0}</div>
          </div>
          <Clock className="w-7 h-7 text-purple-500/30" />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Upcoming Renewals (90d)</div>
            <div className="text-xl font-bold text-sky-600 mt-1">{analytics?.pendingRenewalsCount || 0}</div>
          </div>
          <Layers className="w-7 h-7 text-sky-500/30" />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classification Breakdown Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">ITV Classification Distribution</h2>
              <p className="text-xs text-slate-500">Policy counts by insurance-to-value status tiers</p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-400">Total: {analytics?.totalPoliciesMonitored}</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${val} Policies`, 'Count']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.name === 'Adequate' ? COLORS.ADEQUATE :
                        entry.name === 'Watch' ? COLORS.WATCH :
                        entry.name === 'Warning' ? COLORS.WARNING : COLORS.CRITICAL
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Proportion Pie */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Portfolio Health Composition</h2>
              <p className="text-xs text-slate-500">Proportional risk tier segmentations</p>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} Policies`, 'Count']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mt-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Adequate ({analytics?.adequateCount || 0})</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Watch ({analytics?.watchCount || 0})</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span>Warning ({analytics?.warningCount || 0})</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Critical ({analytics?.criticalCount || 0})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Attention Policies Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Policies Requiring Immediate Underwriting Resolution</h2>
            <p className="text-xs text-slate-500">Active policies currently in Critical Underinsurance tier (&lt;80% ITV)</p>
          </div>
          <Link
            to="/portfolio?classification=CRITICAL"
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center space-x-1"
          >
            <span>View All Critical</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Policy Number</th>
                <th className="py-3 px-4">Policyholder & Location</th>
                <th className="py-3 px-4">Dwelling Coverage</th>
                <th className="py-3 px-4">Rebuilding Cost</th>
                <th className="py-3 px-4">ITV Ratio</th>
                <th className="py-3 px-4">Coverage Gap</th>
                <th className="py-3 px-4">ITV Drift</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {criticalPolicies.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No critical underinsurance policies detected.
                  </td>
                </tr>
              ) : (
                criticalPolicies.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-sky-600">
                      <Link to={`/policies/${p.id}`} className="hover:underline">
                        {p.policyNumber}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{p.policyholderName}</div>
                      <div className="text-[11px] text-slate-500">{p.city}, {p.state}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      ₹{(p.currentCoverageLimit / 100000).toFixed(2)} Lakh
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      ₹{(p.latestRebuildingCost / 100000).toFixed(2)} Lakh
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-rose-600">{p.currentItvRatio}%</span>
                        <ItvBadge classification={p.itvClassification} size="sm" />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-rose-600">
                      ₹{(p.potentialCoverageGap / 100000).toFixed(2)} Lakh
                    </td>
                    <td className="py-3.5 px-4 font-mono text-rose-600">
                      {p.itvDrift < 0 ? `${p.itvDrift}%` : `+${p.itvDrift}%`}
                    </td>
                    <td className="py-3.5 px-4">
                      <ConfidenceBadge
                        category={p.confidenceCategory}
                        score={p.confidenceScore}
                        abstentionTriggered={p.abstentionTriggered}
                      />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/policies/${p.id}`}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-medium text-xs transition-colors"
                      >
                        <Sliders className="w-3.5 h-3.5 mr-1" />
                        <span>Inspect</span>
                      </Link>
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

