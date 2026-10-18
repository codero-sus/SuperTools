import React, { useState, useMemo } from 'react';
import { QuickCopy } from '../components/QuickCopy';
import { TrendingUp, DollarSign } from 'lucide-react';

export const CompoundInterestTool: React.FC = () => {
  const [initialPrincipal, setInitialPrincipal] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [annualRate, setAnnualRate] = useState<number>(8);
  const [years, setYears] = useState<number>(20);
  const [compoundFreq, setCompoundFreq] = useState<number>(12); // monthly

  const { finalBalance, totalContributions, totalInterest, yearlyData } = useMemo(() => {
    let balance = initialPrincipal;
    let totalContrib = initialPrincipal;
    const r = annualRate / 100;
    const yearly = [];

    for (let yr = 1; yr <= years; yr++) {
      for (let m = 1; m <= 12; m++) {
        balance += monthlyContribution;
        totalContrib += monthlyContribution;
        // compound interest for 1 month
        balance *= Math.pow(1 + r / compoundFreq, compoundFreq / 12);
      }
      yearly.push({
        year: yr,
        balance: Math.round(balance),
        contributions: Math.round(totalContrib),
        interest: Math.round(balance - totalContrib)
      });
    }

    return {
      finalBalance: balance,
      totalContributions: totalContrib,
      totalInterest: balance - totalContrib,
      yearlyData: yearly
    };
  }, [initialPrincipal, monthlyContribution, annualRate, years, compoundFreq]);

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Initial Principal ($):
            </label>
            <input
              type="number"
              value={initialPrincipal}
              onChange={(e) => setInitialPrincipal(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Monthly Deposit ($):
            </label>
            <input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Annual Interest (%):
            </label>
            <input
              type="number"
              step="0.5"
              value={annualRate}
              onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Investment Horizon (Years):
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm font-bold"
            />
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
            Total Future Value
          </span>
          <span className="text-3xl sm:text-4xl font-black text-indigo-700 dark:text-indigo-300 font-mono">
            ${Math.round(finalBalance).toLocaleString()}
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Total Principal Invested
          </span>
          <span className="text-2xl font-extrabold text-slate-700 dark:text-slate-300 font-mono">
            ${Math.round(totalContributions).toLocaleString()}
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 block mb-1">
            Total Compound Interest
          </span>
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            +${Math.round(totalInterest).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Year-by-Year Growth Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Year-by-Year Wealth Progression
        </span>
        <div className="overflow-x-auto max-h-80">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase">
                <th className="py-2">Year</th>
                <th className="py-2">Principal Invested</th>
                <th className="py-2">Interest Earned</th>
                <th className="py-2">Total Portfolio Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {yearlyData.map(d => (
                <tr key={d.year}>
                  <td className="py-2 text-slate-500">Year {d.year}</td>
                  <td className="py-2 text-slate-700 dark:text-slate-300">${d.contributions.toLocaleString()}</td>
                  <td className="py-2 text-emerald-600 dark:text-emerald-400 font-semibold">+${d.interest.toLocaleString()}</td>
                  <td className="py-2 text-indigo-600 dark:text-indigo-400 font-bold">${d.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
