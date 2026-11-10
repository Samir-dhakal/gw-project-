import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Play, RefreshCw, LogOut, User as UserIcon } from 'lucide-react';
import { monitoringApi } from '../services/api';

interface NavbarProps {
  onRefresh?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRefresh }) => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const storedUser = localStorage.getItem('itv_user');
  const user = storedUser ? JSON.parse(storedUser) : { username: 'underwriter', fullName: 'Ananya Krishnan', role: 'UNDERWRITER' };

  const handleLogout = () => {
    localStorage.removeItem('itv_token');
    localStorage.removeItem('itv_user');
    navigate('/login');
  };

  const handleTriggerDailyScan = async () => {
    try {
      setScanning(true);
      await monitoringApi.runBatchScan('MANUAL_NAVBAR_TRIGGER');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Scan failed:', err);
    } finally {
      setScanning(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-sky-600 to-blue-700 flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 tracking-tight text-base">Continuous ITV Intelligence Engine</span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                Guidewire Capstone
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">In-Force Underinsurance Monitoring • Tamil Nadu, India (INR ₹)</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={handleTriggerDailyScan}
          disabled={scanning}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 disabled:opacity-50 transition-colors"
          title="Run continuous batch evaluation across all active policies"
        >
          {scanning ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current text-sky-600" />
          )}
          <span>{scanning ? 'Evaluating In-Force...' : 'Run Continuous Daily Scan'}</span>
        </button>

        <div className="h-5 w-px bg-slate-200" />

        <div className="flex items-center space-x-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600">
            <UserIcon className="w-4 h-4" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-slate-900 leading-none">{user.fullName || user.username}</div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{user.role}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Log out of system"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

