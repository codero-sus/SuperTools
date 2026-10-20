import React from 'react';
import { 
  X, Cpu, Zap, Gauge, Server, Laptop, ShieldCheck, CheckCircle2, 
  Sparkles, Layers, Sliders, Activity, Info 
} from 'lucide-react';
import { HARDWARE_TIERS, HardwareTier, getTierByLevel } from '../utils/hardwareScaling';

interface HardwareScalingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  onSelectLevel: (level: number) => void;
  isAutoMode: boolean;
  onToggleAutoMode: () => void;
  detectedRamGb: number;
  detectedCores: number;
}

export const HardwareScalingModal: React.FC<HardwareScalingModalProps> = ({
  isOpen,
  onClose,
  currentLevel,
  onSelectLevel,
  isAutoMode,
  onToggleAutoMode,
  detectedRamGb,
  detectedCores
}) => {
  if (!isOpen) return null;

  const activeTier: HardwareTier = getTierByLevel(currentLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-600/25">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Hardware & AI Scaling Studio
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  Lvl 1 [2GB] &rarr; Lvl 10 [256GB]
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Automatically adapts neural precision, canvas dimensions, worker threads & memory bounds to match your machine's exact specs.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Active Status Banner */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Currently Active Scaling Tier
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {activeTier.name}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  {activeTier.targetRamGb} GB Target
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {activeTier.recommendedFor}
              </p>
            </div>

            {/* Auto vs Manual Mode Switch */}
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-right">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {isAutoMode ? 'Hardware Auto-Detect' : 'Manual Override'}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Detected ~{detectedRamGb} GB RAM, {detectedCores} Cores
                </span>
              </div>
              <button
                onClick={onToggleAutoMode}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isAutoMode
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-indigo-600 text-white shadow-xs'
                }`}
              >
                {isAutoMode ? 'Auto: Active' : 'Manual Mode'}
              </button>
            </div>
          </div>

          {/* Real-Time Spec Matrix for Current Tier */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Max RAM Budget</span>
              <p className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                &le; {activeTier.maxRamBudgetMb >= 1000 ? `${(activeTier.maxRamBudgetMb / 1000).toFixed(1)} GB` : `${activeTier.maxRamBudgetMb} MB`}
              </p>
              <span className="text-[10px] text-slate-400">Memory safe ceiling</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Canvas Resolution</span>
              <p className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                {activeTier.maxCanvasDim} px
              </p>
              <span className="text-[10px] text-slate-400">Max dimension cap</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Parallel Web Workers</span>
              <p className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                {activeTier.workerThreads} Threads
              </p>
              <span className="text-[10px] text-slate-400">Concurrent pipelines</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Neural Precision</span>
              <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                {activeTier.ocrModelAccuracy}
              </p>
              <span className="text-[10px] text-slate-400">Inference accuracy</span>
            </div>
          </div>

          {/* Interactive Tier Slider */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Adjust Resource Scale Tier (1 &rarr; 10):
              </span>
              <span className="font-mono font-bold text-indigo-600">
                Level {currentLevel} of 10 ({activeTier.targetRamGb} GB RAM)
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={currentLevel}
              onChange={(e) => {
                onSelectLevel(Number(e.target.value));
              }}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 px-1">
              <span>Lvl 1 (2GB)</span>
              <span>Lvl 3 (6GB)</span>
              <span>Lvl 5 (16GB)</span>
              <span>Lvl 7 (64GB)</span>
              <span>Lvl 10 (256GB)</span>
            </div>
          </div>

          {/* All 10 Tiers Cards Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Select or Preview Hardware Tiers:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {HARDWARE_TIERS.map(tier => {
                const isSelected = tier.level === currentLevel;
                return (
                  <button
                    key={tier.level}
                    onClick={() => onSelectLevel(tier.level)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-slate-900 dark:text-white">
                          {tier.shortLabel}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {tier.name.split(':')[1]}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {tier.recommendedFor}
                      </p>
                      <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-slate-400">
                        <span>Limit: &le;{tier.maxRamBudgetMb >= 1000 ? `${(tier.maxRamBudgetMb / 1000).toFixed(1)}GB` : `${tier.maxRamBudgetMb}MB`}</span>
                        <span>•</span>
                        <span>{tier.maxCanvasDim}px</span>
                        <span>•</span>
                        <span>{tier.workerThreads} worker{tier.workerThreads > 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Settings persist automatically in local storage across sessions.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-sm"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
