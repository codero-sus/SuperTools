import React, { useState, useEffect } from 'react';
import { Keyboard, History } from 'lucide-react';

interface KeyEventInfo {
  key: string;
  code: string;
  which: number;
  location: number;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  timestamp: string;
}

export const KeycodeInspector: React.FC = () => {
  const [currentKey, setCurrentKey] = useState<KeyEventInfo | null>(null);
  const [history, setHistory] = useState<KeyEventInfo[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is focusing an input in other components
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') && target.id !== 'keycode-capture') {
        return;
      }

      e.preventDefault();
      const info: KeyEventInfo = {
        key: e.key,
        code: e.code,
        which: e.which || e.keyCode,
        location: e.location,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
        timestamp: new Date().toLocaleTimeString()
      };
      setCurrentKey(info);
      setHistory(prev => [info, ...prev.slice(0, 19)]);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="space-y-6">
      {/* Interactive prompt / active key display */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-indigo-50/50 to-white dark:from-slate-900 dark:to-slate-950 border border-slate-200/80 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
        <Keyboard className="w-8 h-8 text-indigo-500 animate-pulse" />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Press any key on your keyboard to inspect
        </p>

        {currentKey ? (
          <div className="space-y-4">
            <div className="inline-block px-8 py-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-500 text-4xl sm:text-6xl font-black text-indigo-600 dark:text-indigo-400 shadow-xl font-mono">
              {currentKey.key === ' ' ? 'Space' : currentKey.key}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {[
                { label: 'Ctrl', active: currentKey.ctrlKey },
                { label: 'Shift', active: currentKey.shiftKey },
                { label: 'Alt / Option', active: currentKey.altKey },
                { label: 'Meta / Cmd / Win', active: currentKey.metaKey }
              ].map(m => (
                <span
                  key={m.label}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    m.active
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {m.label}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-2xl font-bold text-slate-300 dark:text-slate-700 py-6">
            Waiting for keystroke...
          </div>
        )}
      </div>

      {/* Breakdown Details */}
      {currentKey && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
            <span className="text-xs font-medium text-slate-400 block mb-1">event.key</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">{currentKey.key}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
            <span className="text-xs font-medium text-slate-400 block mb-1">event.code</span>
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 font-mono">{currentKey.code}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
            <span className="text-xs font-medium text-slate-400 block mb-1">event.which (keyCode)</span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">{currentKey.which}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
            <span className="text-xs font-medium text-slate-400 block mb-1">event.location</span>
            <span className="text-lg font-bold text-slate-700 dark:text-slate-300 font-mono">{currentKey.location}</span>
          </div>
        </div>
      )}

      {/* History table */}
      {history.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <History className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recent Keypress History
            </span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs max-h-48 overflow-y-auto">
            {history.map((h, i) => (
              <div key={i} className="py-2 flex items-center justify-between">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 w-24">
                  {h.key === ' ' ? 'Space' : h.key}
                </span>
                <span className="text-slate-500">code: {h.code}</span>
                <span className="text-emerald-600">which: {h.which}</span>
                <span className="text-slate-400 text-[11px]">{h.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
