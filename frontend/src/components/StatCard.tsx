import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
  color?: 'blue' | 'emerald' | 'amber' | 'rose' | 'purple' | 'slate';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendPositive,
  color = 'slate',
}) => {
  const colorMaps = {
    blue: 'border-blue-200 bg-blue-50/40 text-blue-700',
    emerald: 'border-emerald-200 bg-emerald-50/40 text-emerald-700',
    amber: 'border-amber-200 bg-amber-50/40 text-amber-700',
    rose: 'border-rose-200 bg-rose-50/40 text-rose-700',
    purple: 'border-purple-200 bg-purple-50/40 text-purple-700',
    slate: 'border-slate-200 bg-slate-50/40 text-slate-700',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        <div className={`p-2 rounded-lg border ${colorMaps[color]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {trend && (
          <span className={`text-xs font-medium ${trendPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
};
