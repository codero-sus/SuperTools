import React, { useState, useMemo } from 'react';
import { QuickCopy } from '../components/QuickCopy';
import { Users, DollarSign, Receipt } from 'lucide-react';

export const TipCalculator: React.FC = () => {
  const [billAmount, setBillAmount] = useState<number>(85.50);
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [peopleCount, setPeopleCount] = useState<number>(2);

  const { tipTotal, grandTotal, tipPerPerson, totalPerPerson } = useMemo(() => {
    const tip = (billAmount * tipPercent) / 100;
    const total = billAmount + tip;
    const people = Math.max(1, peopleCount);
    return {
      tipTotal: tip,
      grandTotal: total,
      tipPerPerson: tip / people,
      totalPerPerson: total / people
    };
  }, [billAmount, tipPercent, peopleCount]);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Bill amount */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Bill Total ($):
          </label>
          <input
            type="number"
            step="0.01"
            value={billAmount}
            onChange={(e) => setBillAmount(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-2xl font-black text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        {/* Tip percentage buttons */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
            Select Tip Percentage:
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[10, 15, 18, 20, 25].map(pct => (
              <button
                key={pct}
                onClick={() => setTipPercent(pct)}
                className={`py-2 rounded-xl text-sm font-bold transition-all ${
                  tipPercent === pct
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Number of people */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Split Between Number of Guests:
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="50"
              value={peopleCount}
              onChange={(e) => setPeopleCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold text-slate-900 dark:text-white"
            />
            <div className="flex items-center gap-1 text-slate-400 text-xs shrink-0">
              <Users className="w-4 h-4" />
              <span>{peopleCount} {peopleCount === 1 ? 'person' : 'people'}</span>
            </div>
          </div>
        </div>

        {/* Results Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white space-y-4 shadow-lg shadow-indigo-500/20">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-400/40">
            <span className="text-sm font-medium opacity-90">Total Per Person:</span>
            <span className="font-mono text-3xl font-black">
              ${totalPerPerson.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono opacity-90">
            <div>
              <span className="block opacity-75">Tip Per Person:</span>
              <span className="text-base font-bold mt-0.5 block">${tipPerPerson.toFixed(2)}</span>
            </div>
            <div className="text-right">
              <span className="block opacity-75">Grand Total Bill:</span>
              <span className="text-base font-bold mt-0.5 block">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
