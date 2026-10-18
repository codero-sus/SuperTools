import React from 'react';
import { Star, Sparkles, Shield, Flame } from 'lucide-react';
import { ToolItem } from '../types';
import { DynamicIcon } from './DynamicIcon';

interface ToolCardProps {
  tool: ToolItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelect: (tool: ToolItem) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  isFavorite,
  onToggleFavorite,
  onSelect
}) => {
  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'Popular':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'New':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'AI / Canvas':
        return 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30';
      case 'Privacy':
        return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30';
      default:
        return null;
    }
  };

  return (
    <div
      onClick={() => onSelect(tool)}
      className="group relative flex flex-col justify-between p-5 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 hover:border-indigo-500/60 dark:hover:border-indigo-400/60 shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer text-left hover:-translate-y-0.5"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100/60 dark:border-indigo-900/40 flex items-center justify-center group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-2xs">
            <DynamicIcon name={tool.icon} className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.badge && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle(tool.badge)}`}>
                {tool.badge}
              </span>
            )}
            <button
              type="button"
              onClick={(e) => onToggleFavorite(tool.id, e)}
              className={`p-1.5 rounded-xl transition-colors ${
                isFavorite
                  ? 'text-amber-500 hover:text-amber-600'
                  : 'text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400'
              }`}
              title={isFavorite ? 'Remove favorite' : 'Add favorite'}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 text-base tracking-tight">
          {tool.name}
        </h3>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <span className="font-medium text-[11px] text-slate-400 dark:text-slate-500">
          {tool.category}
        </span>
        <span className="text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-0.5 transition-transform">
          Open &rarr;
        </span>
      </div>
    </div>
  );
};
