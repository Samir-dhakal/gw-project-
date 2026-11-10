import React from 'react';

interface ConfidenceBadgeProps {
  category: string;
  score?: number;
  abstentionTriggered?: boolean;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ category, score, abstentionTriggered }) => {
  if (abstentionTriggered) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-300">
        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-purple-600 animate-ping"></span>
        ABSTAIN ({score ? `${score}%` : 'TRIGGERED'})
      </span>
    );
  }

  let colorStyles = 'bg-slate-100 text-slate-700 border-slate-300';

  switch (category?.toUpperCase()) {
    case 'HIGH':
      colorStyles = 'bg-blue-50 text-blue-800 border-blue-300';
      break;
    case 'MEDIUM':
      colorStyles = 'bg-amber-50 text-amber-800 border-amber-300';
      break;
    case 'LOW':
      colorStyles = 'bg-rose-50 text-rose-800 border-rose-300';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colorStyles}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75"></span>
      {category} {score !== undefined && `(${score}%)`}
    </span>
  );
};

