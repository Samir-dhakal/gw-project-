import React, { useState } from 'react';
import { Settings, Users, Database, Shield, CheckCircle, RefreshCw, Terminal } from 'lucide-react';

export const AdministrationPage: React.FC = () => {
  const [cronExpression, setCronExpression] = useState('0 0 2 * * ?');
  const [autoCreateCases, setAutoCreateCases] = useState(true);

  const users = [
    { id: 1, username: 'admin', fullName: 'Dr. Ramesh Sundaram', role: 'ADMIN', email: 'admin@guidewire-itv.in', active: true },
    { id: 2, username: 'underwriter', fullName: 'Ananya Krishnan', role: 'UNDERWRITER', email: 'underwriter@guidewire-itv.in', active: true },
    { id: 3, username: 'reviewer', fullName: 'Siddharth Iyer', role: 'REVIEWER', email: 'reviewer@guidewire-itv.in', active: true },
    { id: 4, username: 'viewer', fullName: 'Kavitha Natarajan', role: 'VIEWER', email: 'viewer@guidewire-itv.in', active: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Administration & Security Configuration</h1>
        <p className="text-xs text-slate-500 mt-1">
          User access control, scheduler parameters, database migration status, and demonstration environments
        </p>
      </div>

      {/* Database & Runtime Health */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
          <Database className="w-4 h-4 text-sky-600" />
          <span>Database &amp; Engine Environment</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Active Relational Store</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">MySQL 8 / ANSI Relational Engine</span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Flyway Schema Migration v2 Verified</span>
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Backend Framework</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">Java 21 LTS • Spring Boot 3.3.5</span>
            <span className="text-[11px] text-slate-500 mt-1 block">Stateless JWT HMAC-SHA256 Auth</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Continuous Engine</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">Spring Scheduler @Scheduled</span>
            <span className="text-[11px] text-sky-600 font-mono mt-1 block">{cronExpression} (2:00 AM IST)</span>
          </div>
        </div>
      </div>

      {/* Role-Based Access Control User Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC) Accounts</h2>
            <p className="text-xs text-slate-500">Configured operator accounts and functional permission scopes</p>
          </div>
          <span className="text-xs font-mono text-slate-400">Total Users: {users.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Permitted Scope</th>
                <th className="py-3 px-4">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">{u.username}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{u.fullName}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      u.role === 'ADMIN' ? 'bg-emerald-100 text-emerald-800' :
                      u.role === 'UNDERWRITER' ? 'bg-sky-100 text-sky-800' :
                      u.role === 'REVIEWER' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {u.role === 'ADMIN' && 'Full system governance, integration sync, audit access'}
                    {u.role === 'UNDERWRITER' && 'Case review, coverage endorsements, resolution approval'}
                    {u.role === 'REVIEWER' && 'Evidence inspection, quality verification, escalations'}
                    {u.role === 'VIEWER' && 'Read-only dashboard and analytics observation'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center text-emerald-700 font-semibold text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
