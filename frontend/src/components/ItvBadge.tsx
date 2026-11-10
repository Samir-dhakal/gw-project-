import React from 'react';

interface ItvBadgeProps {
  classification: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ItvBadge: React.FC<ItvBadgeProps> = ({ classification, size = 'md' }) => {
  let colorStyles = 'bg-slate-100 text-slate-700 border-slate-300';

  switch (classification?.toUpperCase()) {
    case 'ADEQUATE':
      colorStyles = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      break;
    case 'WATCH':
      colorStyles = 'bg-amber-50 text-amber-800 border-amber-300';
      break;
    case 'WARNING':
      colorStyles = 'bg-orange-50 text-orange-800 border-orange-300';
      break;
    case 'CRITICAL':
      colorStyles = 'bg-rose-50 text-rose-800 border-rose-300 font-bold animate-pulse';
      break;
  }

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${colorStyles} ${sizeStyles}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75"></span>
      {classification || 'UNKNOWN'}
    </span>
  );
};

