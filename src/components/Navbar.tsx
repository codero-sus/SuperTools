import React from 'react';
import { Search, Sparkles, Moon, Sun, Star, Wrench, Leaf, CloudRain, Flame } from 'lucide-react';
import { AmbientEffect } from './effects/AmbientBackground';

interface NavbarProps {
  onOpenSearch: () => void;
  onRandomTool: () => void;
  onGoHome: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  showOnlyFavorites: boolean;
  onToggleShowFavorites: () => void;
  favoritesCount: number;
  ambientEffect: AmbientEffect;
  onCycleAmbient: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onRandomTool,
  onGoHome,
  darkMode,
  onToggleDarkMode,
  showOnlyFavorites,
  onToggleShowFavorites,
  favoritesCount,
  ambientEffect,
  onCycleAmbient
}) => {
  const getAmbientLabel = () => {
    switch (ambientEffect) {
      case 'leaves': return '🍂 Leaves';
      case 'stars': return '✨ Stars';
      case 'rain': return '🌧️ Rain';
      case 'fireflies': return '🌟 Fireflies';
      case 'off': return '🚫 Visual FX Off';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div 
          onClick={onGoHome}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-violet-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                Super<span className="text-indigo-600 dark:text-indigo-400">Tools</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                100% Client-Side
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-400 hidden sm:block">
              Privacy First • Zero Backend • Offline Ready
            </p>
          </div>
        </div>

        {/* Search trigger bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-400 dark:text-slate-500 bg-slate-100/70 dark:bg-slate-900/70 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search all tools & utilities...</span>
            </div>
            <kbd className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-2xs font-bold">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Peaceful Ambient Atmosphere Toggle */}
          <button
            onClick={onCycleAmbient}
            className="px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:border-indigo-400 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5 shadow-2xs"
            title="Click to cycle peaceful ambient effect (Leaves, Stars, Rain, Fireflies, Off)"
          >
            <span>{getAmbientLabel()}</span>
          </button>

          {/* Surprise Me Button */}
          <button
            onClick={onRandomTool}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-xl transition-all shadow-2xs"
            title="Open a surprise utility"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Surprise</span>
          </button>

          {/* Favorites Filter */}
          <button
            onClick={onToggleShowFavorites}
            className={`p-2 rounded-xl border transition-all ${
              showOnlyFavorites
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-900/70 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Show saved favorites"
          >
            <div className="relative">
              <Star className={`w-4 h-4 ${showOnlyFavorites ? 'fill-current' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center font-mono">
                  {favoritesCount}
                </span>
              )}
            </div>
          </button>

          {/* Dark / Light Mode Switch */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
