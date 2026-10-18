import React, { useState, useMemo } from 'react';
import { QuickCopy } from '../components/QuickCopy';
import { ArrowRightLeft } from 'lucide-react';

export const RomanConverter: React.FC = () => {
  const [arabic, setArabic] = useState<string>('2026');
  const [roman, setRoman] = useState<string>('MMXXVI');

  const romanNumerals = [
    { val: 1000, sym: 'M' },
    { val: 900, sym: 'CM' },
    { val: 500, sym: 'D' },
    { val: 400, sym: 'CD' },
    { val: 100, sym: 'C' },
    { val: 90, sym: 'XC' },
    { val: 50, sym: 'L' },
    { val: 40, sym: 'XL' },
    { val: 10, sym: 'X' },
    { val: 9, sym: 'IX' },
    { val: 5, sym: 'V' },
    { val: 4, sym: 'IV' },
    { val: 1, sym: 'I' }
  ];

  const toRoman = (num: number): string => {
    if (isNaN(num) || num < 1 || num > 3999999) return 'Enter a number between 1 and 3,999,999';
    let res = '';
    for (const item of romanNumerals) {
      while (num >= item.val) {
        res += item.sym;
        num -= item.val;
      }
    }
    return res;
  };

  const toArabic = (str: string): number => {
    const map: Record<string, number> = {
      I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000
    };
    let total = 0;
    const s = str.toUpperCase().trim();
    for (let i = 0; i < s.length; i++) {
      const current = map[s[i]];
      const next = map[s[i + 1]];
      if (next && current < next) {
        total += next - current;
        i++;
      } else {
        total += current || 0;
      }
    }
    return total;
  };

  const handleArabicChange = (v: string) => {
    setArabic(v);
    const n = parseInt(v, 10);
    if (!isNaN(n)) {
      setRoman(toRoman(n));
    } else {
      setRoman('');
    }
  };

  const handleRomanChange = (v: string) => {
    setRoman(v);
    const n = toArabic(v);
    if (n > 0) {
      setArabic(n.toString());
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Arabic Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Arabic Integer (1 - 3999)
            </label>
            <input
              type="number"
              value={arabic}
              onChange={(e) => handleArabicChange(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-2xl font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Roman Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                Roman Numerals
              </label>
              <QuickCopy text={roman} size="sm" />
            </div>
            <input
              type="text"
              value={roman}
              onChange={(e) => handleRomanChange(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 font-mono text-2xl font-black text-indigo-600 dark:text-indigo-400 focus:outline-none uppercase"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block mb-2">Numeral Values:</span>
          <div className="grid grid-cols-7 gap-2 text-center font-mono text-xs">
            {[
              { sym: 'I', val: 1 },
              { sym: 'V', val: 5 },
              { sym: 'X', val: 10 },
              { sym: 'L', val: 50 },
              { sym: 'C', val: 100 },
              { sym: 'D', val: 500 },
              { sym: 'M', val: 1000 }
            ].map(item => (
              <div key={item.sym} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block">{item.sym}</span>
                <span className="text-[11px] text-slate-400">{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
