import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingDown, Layers, ShieldCheck, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { analyticsApi } from '../services/api';
import { PortfolioAnalytics } from '../types';
import { StatCard } from '../components/StatCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const PortfolioAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<PortfolioAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const data = await analyticsApi.getPortfolioAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  const classData = analytics ? [
    { name: 'Adequate (>=95%)', count: analytics.adequateCount, fill: '#10b981' },
    { name: 'Watch (90-94%)', count: analytics.watchCount, fill: '#f59e0b' },
    { name: 'Warning (80-89%)', count: analytics.warningCount, fill: '#f97316' },
    { name: 'Critical (<80%)', count: analytics.criticalCount, fill: '#ef4444' },
  ] : [];

  const confData = analytics ? [
    { name: 'High (>=80%)', count: analytics.confidenceDistribution?.['HIGH'] || 0, fill: '#0284c7' },
    { name: 'Medium (60-79%)', count: analytics.confidenceDistribution?.['MEDIUM'] || 0, fill: '#f59e0b' },
    { name: 'Low / Abstain (<60%)', count: analytics.lowConfidenceAbstentionsCount || 0, fill: '#a855f7' },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Portfolio Underwriting Outcome Analytics</h1>
        <p className="text-xs text-slate-500 mt-1">
          Measurable operational metrics, resolution effectiveness, and portfolio vulnerability distributions
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored In-Force Policies"
          value={analytics?.totalPoliciesMonitored || 0}
          subtitle="Continuous daily batch scan"
          icon={<Layers className="w-5 h-5 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Portfolio Coverage Gap"
          value={`₹${((analytics?.totalPortfolioCoverageGap || 0) / 100000).toFixed(1)} Lakh`}
          subtitle="Net dwelling underinsurance"
          icon={<TrendingDown className="w-5 h-5 text-rose-600" />}
          color="rose"
        />
        <StatCard
          title="Underwriter Resolution Rate"
          value={`${analytics?.resolutionRatePercent || 0}%`}
          subtitle={`${analytics?.resolvedCasesCount || 0} resolved of ${((analytics?.openCasesCount || 0) + (analytics?.resolvedCasesCount || 0))} cases`}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          color="emerald"
        />
        <StatCard
          title="Abstentions / Verifications"
          value={analytics?.lowConfidenceAbstentionsCount || 0}
          subtitle="Contradictory or stale evidence"
          icon={<AlertTriangle className="w-5 h-5 text-purple-600" />}
          color="purple"
        />
      </div>

      {/* Analytics Visual Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classification Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900">ITV Health Tier Distribution</h2>
            <p className="text-xs text-slate-500">Number of policies across discrete insurance-to-value tiers</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${val} Policies`, 'Count']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {classData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evidence Confidence Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900">Evidence Reliability Confidence Distribution</h2>
            <p className="text-xs text-slate-500">Heuristic score tiers based on Source, Freshness, Completeness, and Agreement</p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={confData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {confData.map((entry, index) => (
                    <Cell key={`conf-cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} Policies`, 'Count']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 text-xs text-slate-600 mt-2">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
              <span>High Confidence</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Medium Confidence</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span>Low / Abstain</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
