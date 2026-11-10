import React, { useEffect, useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle, HelpCircle, Layers, ArrowRight } from 'lucide-react';
import { evidenceApi, policyApi } from '../services/api';
import { ConfidenceBreakdown, PolicySummary } from '../types';
import { ConfidenceBadge } from '../components/ConfidenceBadge';

export const ConfidenceAbstentionPage: React.FC = () => {
  const [policies, setPolicies] = useState<PolicySummary[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<number>(4); // Default to Scenario B policy 4!
  const [confidence, setConfidence] = useState<ConfidenceBreakdown | null>(null);
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

  const loadConfidence = async (policyId: number) => {
    try {
      setLoading(true);
      const data = await evidenceApi.getConfidenceBreakdown(policyId);
      setConfidence(data);
    } catch (err) {
      console.error('Failed to load confidence breakdown:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPolicyId) {
      loadConfidence(selectedPolicyId);
    }
  }, [selectedPolicyId]);

  const selectedPolicy = policies.find((p) => p.id === selectedPolicyId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Evidence Confidence & Hard Abstention Engine</h1>
          <p className="text-xs text-slate-500 mt-1">
            Explainable uncertainty quantification: C = (0.30 &times; S) + (0.25 &times; F) + (0.20 &times; K) + (0.25 &times; A)
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

      {/* Scenario B Walkthrough Banner */}
      {selectedPolicy?.policyNumber === 'POL-IN-2025-00104' && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-purple-900 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Scenario B Walkthrough Target (Conflicting Evidence & Hard Abstention):</span>
            <p className="mt-1">
              Policy <code>POL-IN-2025-00104</code> (Coimbatore Villa) has two contradictory estimates: Local Contractor Appraisal (₹70 Lakh) vs Derived CPWD 2025 Plinth Rate (₹92 Lakh), creating a 31.43% disagreement that exceeds the 20% tolerance limit.
            </p>
            <p className="mt-1 font-semibold text-purple-800">
              The engine refuses to guess or average the conflicting figures. It triggers Hard Abstention, suppresses automated endorsement recommendations, and creates an Evidence Verification Request for field engineering inspection.
            </p>
          </div>
        </div>
      )}

      {/* Main Confidence Breakdown Card */}
      {confidence && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Aggregate Confidence Result</div>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-3xl font-extrabold text-slate-900">{confidence.overallScore}%</span>
                <ConfidenceBadge
                  category={confidence.category}
                  abstentionTriggered={confidence.abstentionTriggered}
                />
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500 block">Abstention Condition</span>
              <span className={`text-xs font-bold ${confidence.abstentionTriggered ? 'text-purple-600' : 'text-emerald-600'}`}>
                {confidence.abstentionTriggered ? 'HARD ABSTENTION ACTIVE' : 'NONE (NORMAL WORKFLOW)'}
              </span>
            </div>
          </div>

          {/* Component Scores Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Source Reliability S */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold uppercase">Source Reliability (S)</span>
                <span className="font-mono font-bold">Weight: 30%</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{confidence.sourceReliabilityScore}%</div>
              <p className="text-[11px] text-slate-500 mt-1">Government gazettes vs unverified contractor estimates</p>
            </div>

            {/* Freshness F */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold uppercase">Freshness Score (F)</span>
                <span className="font-mono font-bold">Weight: 25%</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{confidence.freshnessScore}%</div>
              <p className="text-[11px] text-slate-500 mt-1">Days latency from publication with half-life decay</p>
            </div>

            {/* Completeness K */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold uppercase">Completeness Score (K)</span>
                <span className="font-mono font-bold">Weight: 20%</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{confidence.completenessScore}%</div>
              <p className="text-[11px] text-slate-500 mt-1">Presence of built-up area, storeys, structural typology</p>
            </div>

            {/* Agreement A */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold uppercase">Agreement Score (A)</span>
                <span className="font-mono font-bold">Weight: 25%</span>
              </div>
              <div className={`text-2xl font-bold ${confidence.agreementScore < 60 ? 'text-rose-600' : 'text-slate-900'}`}>
                {confidence.agreementScore}%
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Correlation &amp; variance across independent estimators</p>
            </div>
          </div>

          {/* Hard Abstention Explanations */}
          {confidence.abstentionTriggered && (
            <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200 space-y-2">
              <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4 text-purple-600" />
                <span>Explicit Abstention Rationale</span>
              </h3>
              <ul className="list-disc list-inside text-xs text-purple-800 space-y-1">
                {confidence.abstentionReasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommended Verification Action */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <span className="font-bold text-slate-900 uppercase block mb-1">Recommended Verification Protocol:</span>
            <p>{confidence.recommendedVerificationAction}</p>
          </div>
        </div>
      )}
    </div>
  );
};

