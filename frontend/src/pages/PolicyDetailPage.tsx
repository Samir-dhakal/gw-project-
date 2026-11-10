import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Shield,
  Building,
  Calendar,
  Layers,
  Activity,
  History,
  FileCheck2,
  Sliders,
  Play,
  RefreshCw,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { policyApi, monitoringApi } from '../services/api';
import { PolicyDetail } from '../types';
import { ItvBadge } from '../components/ItvBadge';
import { ConfidenceBadge } from '../components/ConfidenceBadge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

export const PolicyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [policy, setPolicy] = useState<PolicyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);

  const fetchPolicy = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await policyApi.getPolicyDetail(Number(id));
      setPolicy(data);
    } catch (err) {
      console.error('Failed to load policy details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, [id]);

  const handleTriggerReassessment = async () => {
    if (!id) return;
    try {
      setEvaluating(true);
      await monitoringApi.evaluatePolicy(Number(id), 'MANUAL_REASSESSMENT');
      await fetchPolicy();
    } catch (err) {
      console.error('Reassessment failed:', err);
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-8 h-8 text-sky-600 animate-spin" />
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Policy not found.</p>
        <Link to="/portfolio" className="text-sky-600 font-medium hover:underline mt-2 inline-block">
          Return to portfolio
        </Link>
      </div>
    );
  }

  const latestEval = policy.evaluationHistory && policy.evaluationHistory.length > 0
    ? policy.evaluationHistory[policy.evaluationHistory.length - 1]
    : null;

  const chartData = policy.evaluationHistory?.map((e) => ({
    timestamp: e.evaluationTimestamp.substring(0, 10),
    itvRatio: e.itvRatio,
    drift: e.itvDrift,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Back and Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/portfolio"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleTriggerReassessment}
            disabled={evaluating}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
          >
            {evaluating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
            ) : (
              <Play className="w-3.5 h-3.5 text-sky-600 fill-current" />
            )}
            <span>{evaluating ? 'Re-evaluating...' : 'Trigger Reassessment'}</span>
          </button>
          <Link
            to={`/simulator?policyId=${policy.id}`}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Launch Scenario Simulator</span>
          </Link>
        </div>
      </div>

      {/* Main Policy Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xl font-bold text-slate-900">{policy.policyNumber}</span>
              {latestEval && <ItvBadge classification={latestEval.itvClassification} size="lg" />}
              {latestEval && (
                <ConfidenceBadge
                  category={latestEval.confidenceCategory}
                  score={latestEval.confidenceScore}
                  abstentionTriggered={latestEval.abstentionTriggered}
                />
              )}
            </div>
            <div className="text-sm font-medium text-slate-600 mt-1">
              Policyholder: <span className="font-semibold text-slate-900">{policy.policyholderName}</span> • {policy.property.city}, {policy.property.state}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Inception: {policy.inceptionDate} • Expiry: {policy.expiryDate} • Status: <span className="font-semibold text-slate-700">{policy.policyStatus}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-500">Current Coverage</div>
              <div className="text-base font-bold text-slate-900">
                ₹{(policy.currentCoverageLimit / 100000).toFixed(2)} Lakh
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-500">Rebuilding Estimate</div>
              <div className="text-base font-bold text-slate-900">
                ₹{latestEval ? (latestEval.rebuildingCost / 100000).toFixed(2) : 0} Lakh
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-500">ITV Ratio</div>
              <div className={`text-base font-bold ${latestEval && latestEval.itvRatio < 80 ? 'text-rose-600' : 'text-slate-900'}`}>
                {latestEval ? `${latestEval.itvRatio}%` : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-500">Coverage Deficit</div>
              <div className={`text-base font-bold ${latestEval && latestEval.potentialCoverageGap > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                ₹{latestEval ? (latestEval.potentialCoverageGap / 100000).toFixed(2) : 0} Lakh
              </div>
            </div>
          </div>
        </div>

        {/* Abstention Banner if triggered */}
        {latestEval?.abstentionTriggered && (
          <div className="mt-4 p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs">
            <div className="flex items-center space-x-2 font-bold text-purple-800 mb-1">
              <AlertTriangle className="w-4 h-4 text-purple-600" />
              <span>Hard Abstention Condition Active — Decision Recommendations Suspended</span>
            </div>
            <p>{latestEval.abstentionReasons}</p>
          </div>
        )}
      </div>

      {/* Property Details Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-slate-500" />
            <h2 className="text-sm font-bold text-slate-900">Physical Property Intelligence & Characteristics</h2>
          </div>
          <span className="font-mono text-xs font-semibold text-slate-500">{policy.property.propertyCode}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block">Address</span>
            <span className="font-medium text-slate-900">{policy.property.addressLine1}</span>
          </div>
          <div>
            <span className="text-slate-500 block">District / PIN</span>
            <span className="font-medium text-slate-900">{policy.property.district} - {policy.property.postalCode}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Construction Structural Type</span>
            <span className="font-medium text-slate-900">{policy.property.constructionType}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Year Built / Storeys</span>
            <span className="font-medium text-slate-900">{policy.property.yearBuilt} ({policy.property.numberOfFloors} Floors)</span>
          </div>
          <div>
            <span className="text-slate-500 block">Total Built-up Area</span>
            <span className="font-semibold text-slate-900">{policy.property.builtUpAreaSqm} sq. meters (~{(policy.property.builtUpAreaSqm * 10.764).toFixed(0)} sqft)</span>
          </div>
          <div>
            <span className="text-slate-500 block">Ground Footprint Area</span>
            <span className="font-medium text-slate-900">{policy.property.groundFootprintSqm} sq. meters</span>
          </div>
          <div>
            <span className="text-slate-500 block">GPS Centroid</span>
            <span className="font-mono font-medium text-slate-700">{policy.property.latitude}, {policy.property.longitude}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Renovation Declared</span>
            <span className="font-medium text-slate-900">{policy.property.hasRecentRenovation ? 'YES' : 'NONE'}</span>
          </div>
        </div>

        {policy.property.renovationDetails && (
          <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
            <span className="font-semibold">Renovation Notes:</span> {policy.property.renovationDetails}
          </div>
        )}
      </div>

      {/* Historical ITV Drift Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Historical Insurance-to-Value Drift Timeline</h2>
            <p className="text-xs text-slate-500">Tracking post-bind replacement cost inflation against static dwelling limit</p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="w-3 h-0.5 bg-emerald-500"></span>
            <span className="text-slate-500">95% Adequate Floor</span>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="timestamp" tick={{ fontSize: 11 }} />
              <YAxis domain={[50, 110]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                formatter={(val: any) => [`${val}%`, 'ITV Ratio']}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <ReferenceLine y={95} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Adequate 95%', position: 'insideTopRight', fill: '#10b981', fontSize: 10 }} />
              <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Critical 80%', position: 'insideBottomRight', fill: '#ef4444', fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="itvRatio"
                stroke="#0284c7"
                strokeWidth={3}
                dot={{ r: 4, fill: '#0284c7' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rebuilding Cost Estimates & Evidence Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estimates Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-3">Rebuilding Cost Estimates History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Estimate</th>
                  <th className="py-2 px-3">Rate/sqm</th>
                  <th className="py-2 px-3">Source & Provenance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {policy.estimateHistory?.map((e) => (
                  <tr key={e.id}>
                    <td className="py-2.5 px-3 font-mono">{e.estimateDate}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      ₹{(e.estimatedCost / 100000).toFixed(2)}L {e.isPrimary && <span className="text-[10px] text-sky-600 uppercase font-semibold">(Primary)</span>}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">₹{e.costPerSqm.toFixed(0)}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-900">{e.sourceName}</div>
                      <span className="text-[10px] font-mono text-slate-500">{e.provenanceCategory}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coverage Snapshots Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-3">Immutable Coverage Snapshots</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                  <th className="py-2 px-3">Effective Date</th>
                  <th className="py-2 px-3">Coverage Limit</th>
                  <th className="py-2 px-3">Endorsement Ref</th>
                  <th className="py-2 px-3">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {policy.coverageHistory?.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2.5 px-3 font-mono">{s.effectiveDate}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">₹{(s.coverageLimit / 100000).toFixed(2)}L</td>
                    <td className="py-2.5 px-3 font-mono text-sky-600">{s.endorsementNumber || 'ORIGINAL'}</td>
                    <td className="py-2.5 px-3 text-slate-600">{s.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
