import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { authApi } from '../services/api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('underwriter');
  const [password, setPassword] = useState('Underwriter@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authApi.login(username, password);
      localStorage.setItem('itv_token', res.token);
      localStorage.setItem('itv_user', JSON.stringify({
        username: res.username,
        role: res.role,
        fullName: res.fullName
      }));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const selectDemoRole = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-xl mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Continuous ITV Intelligence Engine</h2>
        <p className="mt-1 text-xs text-slate-400">
          An Evidence-Aware, Explainable In-Force Underinsurance System
        </p>
        <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-950 text-sky-400 border border-sky-800">
          <span>Guidewire Capstone Review Prototype • Tamil Nadu, India</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-800 border border-slate-700 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/80 border border-rose-800 flex items-center space-x-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg shadow-sm text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Operations Portal'}
              {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
              One-Click Evaluator Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => selectDemoRole('underwriter', 'Underwriter@123')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-200 text-left border border-slate-600 transition-colors"
              >
                <div className="font-semibold text-sky-400">Underwriter</div>
                <div className="text-[10px] text-slate-400">underwriter / Underwriter@123</div>
              </button>
              <button
                type="button"
                onClick={() => selectDemoRole('admin', 'Admin@123')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-200 text-left border border-slate-600 transition-colors"
              >
                <div className="font-semibold text-emerald-400">System Admin</div>
                <div className="text-[10px] text-slate-400">admin / Admin@123</div>
              </button>
              <button
                type="button"
                onClick={() => selectDemoRole('reviewer', 'Reviewer@123')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-200 text-left border border-slate-600 transition-colors"
              >
                <div className="font-semibold text-amber-400">Reviewer</div>
                <div className="text-[10px] text-slate-400">reviewer / Reviewer@123</div>
              </button>
              <button
                type="button"
                onClick={() => selectDemoRole('viewer', 'Viewer@123')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-200 text-left border border-slate-600 transition-colors"
              >
                <div className="font-semibold text-purple-400">Viewer</div>
                <div className="text-[10px] text-slate-400">viewer / Viewer@123</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

