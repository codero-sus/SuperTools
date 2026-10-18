import React from 'react';
import { ArrowLeft, Star, Share2, ShieldCheck } from 'lucide-react';
import { ToolItem } from '../types';

interface ToolHeaderProps {
  tool: ToolItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onBack: () => void;
  onShare?: () => void;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({
  tool,
  isFavorite,
  onToggleFavorite,
  onBack,
  onShare
}) => {
  return (
    <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Utilities</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Client-Side • No Backend</span>
          </span>

          <button
            onClick={() => onToggleFavorite(tool.id)}
            className={`p-2 rounded-lg border transition-all ${
              isFavorite
                ? 'bg-amber-50 text-amber-500 border-amber-300 dark:bg-amber-950/40 dark:border-amber-700'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>

          {onShare && (
            <button
              onClick={onShare}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all"
              title="Share or copy URL"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {tool.category}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {tool.name}
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            {tool.description}
          </p>
        </div>
      </div>
    </div>
  );
};
