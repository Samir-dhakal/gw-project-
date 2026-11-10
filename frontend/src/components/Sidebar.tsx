import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Shield,
  Building2,
  Database,
  Activity,
  TrendingDown,
  FileCheck2,
  AlertTriangle,
  Lightbulb,
  Sliders,
  CheckSquare,
  FileSpreadsheet,
  CalendarClock,
  History,
  BarChart3,
  Settings
} from 'lucide-react';

interface NavItem {
  name: string;
  to: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const navigation: NavGroup[] = [
    {
      group: 'Overview & Portfolio',
      items: [
        { name: 'Executive Dashboard', to: '/', icon: <LayoutDashboard className="w-4 h-4" /> },
        { name: 'Policy Portfolio', to: '/portfolio', icon: <Shield className="w-4 h-4" /> },
        { name: 'Property Intelligence', to: '/properties', icon: <Building2 className="w-4 h-4" /> },
      ],
    },
    {
      group: 'Intelligence & Evidence',
      items: [
        { name: 'Data Integration Centre', to: '/integrations', icon: <Database className="w-4 h-4" /> },
        { name: 'Monitoring Centre', to: '/monitoring', icon: <Activity className="w-4 h-4" /> },
        { name: 'ITV Drift Analysis', to: '/drift', icon: <TrendingDown className="w-4 h-4" /> },
        { name: 'Evidence Intelligence', to: '/evidence', icon: <FileCheck2 className="w-4 h-4" /> },
        { name: 'Confidence & Abstention', to: '/abstention', icon: <AlertTriangle className="w-4 h-4" /> },
      ],
    },
    {
      group: 'Decisions & Workflows',
      items: [
        { name: 'Recommendation Centre', to: '/recommendations', icon: <Lightbulb className="w-4 h-4" /> },
        { name: 'Scenario Simulator', to: '/simulator', icon: <Sliders className="w-4 h-4" /> },
        { name: 'Underwriter Workspace', to: '/workspace', icon: <CheckSquare className="w-4 h-4" /> },
        { name: 'Midterm Management', to: '/midterm', icon: <FileSpreadsheet className="w-4 h-4" /> },
        { name: 'Renewal Management', to: '/renewal', icon: <CalendarClock className="w-4 h-4" /> },
      ],
    },
    {
      group: 'Governance & Outcomes',
      items: [
        { name: 'Audit History', to: '/audit', icon: <History className="w-4 h-4" /> },
        { name: 'Portfolio Analytics', to: '/analytics', icon: <BarChart3 className="w-4 h-4" /> },
        { name: 'Administration', to: '/admin', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 min-h-screen border-r border-slate-800">
      <div className="p-4 border-b border-slate-800">
        <div className="text-[11px] font-bold uppercase tracking-wider text-sky-400">System Architecture</div>
        <div className="text-xs text-slate-400 mt-0.5">Guidewire Capstone Module</div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigation.map((group) => (
          <div key={group.group}>
            <h3 className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {group.group}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <span className="text-slate-400 group-hover:text-slate-200">{item.icon}</span>
                  <span className="flex-1 truncate">{item.name}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-slate-800 text-slate-300">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-500">
        <div className="flex items-center justify-between font-mono">
          <span>Engine Status</span>
          <span className="inline-flex items-center text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
            ACTIVE
          </span>
        </div>
        <div className="mt-1 text-slate-600">v1.0.0-PROD-PROTOTYPE</div>
      </div>
    </aside>
  );
};
