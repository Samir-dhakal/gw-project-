import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckSquare,
  AlertCircle,
  Clock,
  CheckCircle,
  FileText,
  UserCheck,
  Send,
  XCircle,
  RefreshCw,
  Search,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { workflowApi } from '../services/api';
import { ReviewCase, UnderwriterDecisionRequest } from '../types';

export const UnderwriterWorkspacePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || '';

  const [cases, setCases] = useState<ReviewCase[]>([]);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [selectedCase, setSelectedCase] = useState<ReviewCase | null>(null);
  const [loading, setLoading] = useState(true);

  // Decision Modal State
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<'APPROVE_ENDORSEMENT' | 'REJECT_CHANGE' | 'ESCALATE' | 'REQUEST_FIELD_INSPECTION'>('APPROVE_ENDORSEMENT');
  const [approvedLimit, setApprovedLimit] = useState<string>('');
  const [decisionNotes, setDecisionNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadCases = async () => {
    try {
      setLoading(true);
      const data = await workflowApi.getCases(statusFilter || undefined);
      setCases(data);
      if (data.length > 0 && !selectedCase) {
        setSelectedCase(data[0]);
      } else if (selectedCase) {
        const updated = data.find((c) => c.id === selectedCase.id);
        if (updated) setSelectedCase(updated);
      }
    } catch (err) {
      console.error('Failed to load review cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, [statusFilter]);

  const handleOpenDecisionModal = (c: ReviewCase, type: typeof decisionType) => {
    setSelectedCase(c);
    setDecisionType(type);
    if (type === 'APPROVE_ENDORSEMENT') {
      // Suggest 95% adequate limit
      const target95 = Math.round(c.latestRebuildingCost * 0.95);
      setApprovedLimit(target95.toString());
      setDecisionNotes('Approved revised dwelling endorsement to 95% ITV benchmark based on verified CPWD Plinth Area Rates 2025.');
    } else if (type === 'REJECT_CHANGE') {
      setApprovedLimit('');
      setDecisionNotes('Underwriter reviewed evidence; coverage remains acceptable under current policyholder terms.');
    } else if (type === 'REQUEST_FIELD_INSPECTION') {
      setApprovedLimit('');
      setDecisionNotes('Dispatched physical engineering inspection request to resolve contradictory building metrics.');
    } else {
      setApprovedLimit('');
      setDecisionNotes('Escalating complex valuation gap to Principal Chief Underwriter for review.');
    }
    setIsDecisionModalOpen(true);
  };

  const handleRecordDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    try {
      setSubmitting(true);
      const req: UnderwriterDecisionRequest = {
        caseId: selectedCase.id,
        decisionType,
        approvedCoverageLimit: approvedLimit ? Number(approvedLimit) : undefined,
        decisionNotes,
      };

      await workflowApi.recordDecision(req);
      setActionSuccess(`Decision '${decisionType}' successfully persisted and applied.`);
      setIsDecisionModalOpen(false);
      await loadCases();
    } catch (err: any) {
      alert('Error recording decision: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Underwriter Review & Resolution Workspace</h1>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative human-in-the-loop governance for in-force dwelling coverage endorsements
          </p>
        </div>
        <button
          onClick={loadCases}
          className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-600 hover:underline text-[11px]">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Workspace Layout (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cases Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-600">Review Queue ({cases.length})</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">OPEN</option>
              <option value="UNDER_REVIEW">UNDER REVIEW</option>
              <option value="EVIDENCE_REQUESTED">EVIDENCE REQUESTED</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {loading ? (
              <div className="p-8 text-center text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-sky-600 mb-2" />
                <span>Loading review queue...</span>
              </div>
            ) : cases.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
                No cases matching status filter.
              </div>
            ) : (
              cases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedCase?.id === c.id
                      ? 'bg-sky-50/70 border-sky-300 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-sky-700">{c.caseNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'EVIDENCE_REQUESTED'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <div className="font-semibold text-xs text-slate-900">{c.policyholderName}</div>
                  <div className="text-[11px] text-slate-500 truncate">{c.propertyAddress}</div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">ITV: </span>
                      <span className="font-bold text-slate-900">{c.currentItvRatio}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Gap: </span>
                      <span className="font-bold text-rose-600">₹{(c.coverageGap / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Case Inspection & Action Console */}
        <div className="lg:col-span-7">
          {selectedCase ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              {/* Case Header */}
              <div className="border-b border-slate-100 pb-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="font-mono text-lg font-bold text-slate-900">{selectedCase.caseNumber}</h2>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border">
                      {selectedCase.caseType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Associated Policy: <Link to={`/policies/${selectedCase.policyId}`} className="text-sky-600 font-semibold hover:underline">{selectedCase.policyNumber}</Link>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Queue Opened</div>
                  <div className="text-xs font-mono text-slate-600">{selectedCase.createdAt.substring(0, 10)}</div>
                </div>
              </div>

              {/* Policyholder & Property Synopsis */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Policyholder</span>
                  <span className="font-bold text-slate-900">{selectedCase.policyholderName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Location</span>
                  <span className="font-medium text-slate-800">{selectedCase.propertyAddress}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Current Bound Coverage</span>
                  <span className="font-bold text-slate-900">₹{(selectedCase.currentCoverageLimit / 100000).toFixed(2)} Lakh</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Replacement Estimate</span>
                  <span className="font-bold text-slate-900">₹{(selectedCase.latestRebuildingCost / 100000).toFixed(2)} Lakh</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Underinsurance Deficit</span>
                  <span className="font-bold text-rose-600">₹{(selectedCase.coverageGap / 100000).toFixed(2)} Lakh</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Assigned Reviewer</span>
                  <span className="font-semibold text-sky-700">{selectedCase.assignedUnderwriterName || 'Unassigned Queue'}</span>
                </div>
              </div>

              {/* Resolution Workflow Action Controls */}
              {selectedCase.status !== 'RESOLVED' && selectedCase.status !== 'CLOSED' ? (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Underwriting Actions</h3>
                    <Link
                      to={`/simulator?policyId=${selectedCase.policyId}`}
                      className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center space-x-1"
                    >
                      <Sliders className="w-3.5 h-3.5 mr-1" />
                      <span>Launch Scenario Simulator</span>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <button
                      onClick={() => handleOpenDecisionModal(selectedCase, 'APPROVE_ENDORSEMENT')}
                      className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors flex flex-col items-center justify-center space-y-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Approve Endorsement</span>
                    </button>

                    <button
                      onClick={() => handleOpenDecisionModal(selectedCase, 'REJECT_CHANGE')}
                      className="p-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition-colors flex flex-col items-center justify-center space-y-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Adjustment</span>
                    </button>

                    <button
                      onClick={() => handleOpenDecisionModal(selectedCase, 'REQUEST_FIELD_INSPECTION')}
                      className="p-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm transition-colors flex flex-col items-center justify-center space-y-1.5"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Request Inspection</span>
                    </button>

                    <button
                      onClick={() => handleOpenDecisionModal(selectedCase, 'ESCALATE')}
                      className="p-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-colors flex flex-col items-center justify-center space-y-1.5"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Escalate Case</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <div className="flex items-center space-x-2 font-bold text-slate-900 mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Case Concluded — Status: {selectedCase.status}</span>
                  </div>
                  <p>Resolved at {selectedCase.resolvedAt}. Endorsement record and audit trail have been frozen.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs shadow-sm">
              Select a review case from the left queue to inspect details and authorize underwriting decisions.
            </div>
          )}
        </div>
      </div>

      {/* Decision Modal */}
      {isDecisionModalOpen && selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Record Underwriter Decision: <span className="font-mono text-sky-600">{decisionType}</span>
              </h3>
              <button
                onClick={() => setIsDecisionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleRecordDecision} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Policy / Case Reference</label>
                <div className="font-mono bg-slate-50 p-2 rounded border border-slate-200 text-slate-800">
                  {selectedCase.caseNumber} ({selectedCase.policyNumber})
                </div>
              </div>

              {decisionType === 'APPROVE_ENDORSEMENT' && (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Approved Dwelling Coverage Limit (INR ₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={approvedLimit}
                    onChange={(e) => setApprovedLimit(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    placeholder="e.g. 5700000"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Calculated 95% adequate benchmark: ₹{Math.round(selectedCase.latestRebuildingCost * 0.95)}
                  </span>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Regulatory & Underwriting Justification Rationale (Mandatory Audit Requirement)
                </label>
                <textarea
                  required
                  rows={4}
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none text-xs"
                  placeholder="Detail the rationale, verified rate schedules, and customer agreement notes..."
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsDecisionModalOpen(false)}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Applying Endorsement...' : 'Authorize & Sign Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

