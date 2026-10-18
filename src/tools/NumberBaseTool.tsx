import React, { useState } from 'react';
import { QuickCopy } from '../components/QuickCopy';

export const NumberBaseTool: React.FC = () => {
  const [decVal, setDecVal] = useState<string>('2026');
  const [customRadix, setCustomRadix] = useState<number>(36);

  const num = parseInt(decVal, 10);
  const isValid = !isNaN(num);

  const bin = isValid ? num.toString(2) : '';
  const hex = isValid ? num.toString(16).toUpperCase() : '';
  const oct = isValid ? num.toString(8) : '';
  const custom = isValid ? num.toString(customRadix).toUpperCase() : '';

  const handleUpdate = (val: string, base: number) => {
    try {
      const parsed = parseInt(val, base);
      if (!isNaN(parsed)) {
        setDecVal(parsed.toString(10));
      } else if (!val) {
        setDecVal('');
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        {/* Decimal */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Decimal (Base 10):
            </label>
            <QuickCopy text={decVal} size="sm" />
          </div>
          <input
            type="text"
            value={decVal}
            onChange={(e) => setDecVal(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        {/* Hexadecimal */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Hexadecimal (Base 16):
            </label>
            <QuickCopy text={hex} size="sm" />
          </div>
          <input
            type="text"
            value={hex}
            onChange={(e) => handleUpdate(e.target.value, 16)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold text-indigo-600 dark:text-indigo-400 focus:outline-none"
          />
        </div>

        {/* Binary */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Binary (Base 2):
            </label>
            <QuickCopy text={bin} size="sm" />
          </div>
          <textarea
            rows={2}
            value={bin}
            onChange={(e) => handleUpdate(e.target.value, 2)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none"
          />
        </div>

        {/* Octal */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Octal (Base 8):
            </label>
            <QuickCopy text={oct} size="sm" />
          </div>
          <input
            type="text"
            value={oct}
            onChange={(e) => handleUpdate(e.target.value, 8)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold text-amber-600 dark:text-amber-400 focus:outline-none"
          />
        </div>

        {/* Custom Radix */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Custom Radix (Base {customRadix}):
              </label>
              <input
                type="number"
                min="2"
                max="36"
                value={customRadix}
                onChange={(e) => setCustomRadix(Math.max(2, Math.min(36, parseInt(e.target.value) || 2)))}
                className="w-16 px-2 py-0.5 rounded border text-xs font-mono"
              />
            </div>
            <QuickCopy text={custom} size="sm" />
          </div>
          <input
            type="text"
            value={custom}
            onChange={(e) => handleUpdate(e.target.value, customRadix)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold text-purple-600 dark:text-purple-400 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
