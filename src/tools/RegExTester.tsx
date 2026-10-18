import React, { useState, useMemo } from 'react';
import { QuickCopy } from '../components/QuickCopy';
import { Search, AlertCircle, CheckCircle2 } from 'lucide-react';

export const RegExTester: React.FC = () => {
  const [pattern, setPattern] = useState('(\\w+)@([\\w\\.-]+)\\.([a-z\\.]{2,6})');
  const [flags, setFlags] = useState({ g: true, i: true, m: false, s: false });
  const [testString, setTestString] = useState('Contact our team at support@supertools.app or sales@company.org anytime!\nYou can also email ceo@tech.io for partnership inquiries.');

  const flagStr = useMemo(() => {
    let s = '';
    if (flags.g) s += 'g';
    if (flags.i) s += 'i';
    if (flags.m) s += 'm';
    if (flags.s) s += 's';
    return s;
  }, [flags]);

  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [], error: null };
    try {
      const regex = new RegExp(pattern, flagStr);
      const mList: { match: string; index: number; groups: string[] }[] = [];

      if (flags.g) {
        let match;
        while ((match = regex.exec(testString)) !== null) {
          mList.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          if (match.index === regex.lastIndex) regex.lastIndex++; // Prevent infinite loop
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          mList.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }

      return { matches: mList, error: null };
    } catch (err: any) {
      return { matches: [], error: err.message };
    }
  }, [pattern, flagStr, testString, flags.g]);

  return (
    <div className="space-y-6">
      {/* Pattern & Flags Bar */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
            Regular Expression Pattern:
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xl font-mono text-slate-400">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g. [a-z0-9_]+"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm text-indigo-600 dark:text-indigo-400 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <span className="text-xl font-mono text-slate-400">/{flagStr}</span>
          </div>
        </div>

        {/* Flag toggles */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Flags:</span>
          {(['g', 'i', 'm', 's'] as const).map(f => (
            <label key={f} className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={flags[f]}
                onChange={(e) => setFlags({ ...flags, [f]: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-mono font-bold">-{f}</span>
              <span className="text-slate-400 text-[11px]">
                {f === 'g' ? '(global)' : f === 'i' ? '(case-insensitive)' : f === 'm' ? '(multiline)' : '(dotAll)'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Invalid Regex: {error}</span>
        </div>
      )}

      {/* Test String */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
            Test String
          </label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            rows={10}
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Matches Overview */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Matches Found ({matches.length})
              </span>
              <QuickCopy text={matches.map(m => m.match).join('\n')} label="Copy All Matches" size="sm" />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2.5">
              {matches.length > 0 ? (
                matches.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 font-mono text-xs">
                    <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-semibold mb-1">
                      <span>Match #{idx + 1}</span>
                      <span className="text-[11px] text-slate-400">Index {m.index}</span>
                    </div>
                    <div className="text-slate-800 dark:text-slate-200 font-bold break-all">
                      "{m.match}"
                    </div>
                    {m.groups.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-200/40 dark:border-slate-700/40 text-[11px] text-slate-500 space-y-0.5">
                        {m.groups.map((g, gi) => (
                          <div key={gi}>Group {gi + 1}: <span className="text-slate-700 dark:text-slate-300 font-semibold">"{g}"</span></div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-sm text-slate-400">
                  No matches found for current pattern and flags.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
