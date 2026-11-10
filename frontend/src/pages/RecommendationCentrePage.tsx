import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, ArrowRight, Sliders, CheckSquare, AlertTriangle, ShieldCheck } from 'lucide-react';
import { policyApi } from '../services/api';
import { PolicySummary } from '../types';
import { ItvBadge } from '../components/ItvBadge';
import { ConfidenceBadge } from '../components/ConfidenceBadge';

export const RecommendationCentrePage: React.FC = () => {
  const [policies, setPolicies] = useState<PolicySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await policyApi.getPolicies();
        setPolicies(data);
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Recommendation & Resolution Guidance Centre</h1>
        <p className="text-xs text-slate-500 mt-1">
          Explainable, evidence-backed underwriting decision support for in-force dwelling coverage alignment
        </p>
      </div>

      {/* Recommendations Feed */}
      <div className="space-y-4">
        {policies.map((p) => (
          <div
            key={p.id}
            className={`bg-white rounded-xl border p-5 shadow-sm space-y-4 transition-all ${
              p.itvClassification === 'CRITICAL'
                ? 'border-rose-300 bg-rose-50/20'
                : p.abstentionTriggered
                ? 'border-purple-300 bg-purple-50/20'
                : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-sm font-bold text-sky-700">{p.policyNumber}</span>
                <span className="text-xs font-semibold text-slate-800">{p.policyholderName}</span>
                <span className="text-xs text-slate-500">({p.city}, {p.state})</span>
              </div>
              <div className="flex items-center space-x-2">
                <ItvBadge classification={p.itvClassification} size="sm" />
                <ConfidenceBadge
                  category={p.confidenceCategory}
                  score={p.confidenceScore}
                  abstentionTriggered={p.abstentionTriggered}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8 space-y-2">
                <div className="flex items-center space-x-4 text-xs font-mono">
                  <span>Bound: <strong>₹{(p.currentCoverageLimit / 100000).toFixed(1)}L</strong></span>
                  <span>Estimate: <strong>₹{(p.latestRebuildingCost / 100000).toFixed(1)}L</strong></span>
                  <span>ITV: <strong className={p.currentItvRatio < 80 ? 'text-rose-600' : 'text-slate-900'}>{p.currentItvRatio}%</strong></span>
                  <span>Gap: <strong className="text-rose-600">₹{(p.potentialCoverageGap / 100000).toFixed(1)}L</strong></span>
                  <span>Drift: <strong className={p.itvDrift < 0 ? 'text-rose-600' : 'text-slate-600'}>{p.itvDrift}%</strong></span>
                </div>

                <div className="text-xs text-slate-700">
                  {p.abstentionTriggered ? (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-900 flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Recommendation Suspended (Hard Abstention):</span> Evidence sources contradict each other or lack critical integrity. An evidence verification request has been dispatched.
                      </div>
                    </div>
                  ) : p.itvClassification === 'CRITICAL' ? (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 flex items-start space-x-2">
                      <ShieldCheck className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Critical Action Recommended:</span> Propose policy endorsement to restore coverage to 95% ITV benchmark (₹{(p.latestRebuildingCost * 0.95 / 100000).toFixed(1)} Lakh), closing ₹{(p.potentialCoverageGap / 100000).toFixed(1)} Lakh shortfall.
                      </div>
                    </div>
                  ) : p.itvClassification === 'WARNING' ? (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-900">
                      <span className="font-bold">Warning Action Recommended:</span> Schedule midterm review or prepare renewal adjustment. Coverage shortfall ₹{(p.potentialCoverageGap / 100000).toFixed(1)} Lakh detected.
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900">
                      <span className="font-bold">Optimal Condition:</span> Dwelling coverage is adequate within verified construction benchmarks. Continue scheduled continuous daily monitoring.
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col space-y-2">
                <Link
                  to={`/simulator?policyId=${p.id}`}
                  className="w-full py-2 px-3 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Simulate Resolution Scenarios</span>
                </Link>
                <Link
                  to="/workspace"
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Review in Underwriter Workspace</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
