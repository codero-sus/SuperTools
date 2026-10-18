import React, { useState, useMemo } from 'react';
import * as Diff from 'diff';
import { QuickCopy } from '../components/QuickCopy';
import { ArrowLeftRight, Trash2 } from 'lucide-react';

export const TextDiffTool: React.FC = () => {
  const [original, setOriginal] = useState('{\n  "name": "SuperTools",\n  "version": "1.0.0",\n  "backend": false\n}');
  const [modified, setModified] = useState('{\n  "name": "SuperTools Pro",\n  "version": "1.0.1",\n  "backend": false,\n  "offline": true\n}');
  const [diffMode, setDiffMode] = useState<'lines' | 'words' | 'chars'>('lines');

  const diffResult = useMemo(() => {
    if (diffMode === 'lines') {
      return Diff.diffLines(original, modified);
    } else if (diffMode === 'words') {
      return Diff.diffWords(original, modified);
    } else {
      return Diff.diffChars(original, modified);
    }
  }, [original, modified, diffMode]);

  const patchText = useMemo(() => {
    return Diff.createPatch('file', original, modified);
  }, [original, modified]);

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Diff Granularity:</span>
          <div className="inline-flex rounded-lg p-1 bg-slate-100 dark:bg-slate-800">
            {(['lines', 'words', 'chars'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setDiffMode(mode)}
                className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all ${
                  diffMode === mode
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <QuickCopy text={patchText} label="Copy Git Patch" />
          <button
            onClick={() => {
              const tmp = original;
              setOriginal(modified);
              setModified(tmp);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Swap Texts</span>
          </button>
        </div>
      </div>

      {/* Inputs Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">
              Original Text (Left)
            </span>
            <button
              onClick={() => setOriginal('')}
              className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            rows={8}
            className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
              Modified Text (Right)
            </span>
            <button
              onClick={() => setModified('')}
              className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            rows={8}
            className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      {/* Difference Output Visualization */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              Red: Removed
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Green: Added
            </span>
          </div>
          <span className="text-xs text-slate-400">
            {diffResult.length} chunks analyzed
          </span>
        </div>

        <pre className="p-4 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text">
          {diffResult.map((part, index) => {
            const color = part.added
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold'
              : part.removed
              ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 line-through'
              : 'text-slate-700 dark:text-slate-300';
            return (
              <span key={index} className={`rounded px-1 py-0.5 ${color}`}>
                {part.value}
              </span>
            );
          })}
        </pre>
      </div>
    </div>
  );
};
