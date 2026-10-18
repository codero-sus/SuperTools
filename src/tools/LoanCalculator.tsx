import React, { useState, useMemo } from 'react';
import { QuickCopy } from '../components/QuickCopy';
import { Home, DollarSign, Calendar } from 'lucide-react';

export const LoanCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(300000);
  const [annualRate, setAnnualRate] = useState<number>(6.5);
  const [termYears, setTermYears] = useState<number>(30);

  const { emi, totalPayment, totalInterest, schedule } = useMemo(() => {
    const P = loanAmount;
    const r = annualRate / 12 / 100;
    const n = termYears * 12;

    if (P <= 0 || r <= 0 || n <= 0) {
      return { emi: 0, totalPayment: 0, totalInterest: 0, schedule: [] };
    }

    // Monthly EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emiVal = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPay = emiVal * n;
    const totalInt = totalPay - P;

    // Amortization schedule (first 12 months preview)
    let balance = P;
    const sched = [];
    for (let month = 1; month <= Math.min(n, 12); month++) {
      const interestForMonth = balance * r;
      const principalForMonth = emiVal - interestForMonth;
      balance -= principalForMonth;
      sched.push({
        month,
        principal: principalForMonth.toFixed(2),
        interest: interestForMonth.toFixed(2),
        balance: Math.max(0, balance).toFixed(2)
      });
    }

    return {
      emi: emiVal,
      totalPayment: totalPay,
      totalInterest: totalInt,
      schedule: sched
    };
  }, [loanAmount, annualRate, termYears]);

  const principalPct = totalPayment > 0 ? (loanAmount / totalPayment) * 100 : 50;
  const interestPct = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 50;

  return (
    <div className="space-y-6">
      {/* Input controls */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Loan Amount ($):
            </label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Annual Interest Rate (%):
            </label>
            <input
              type="number"
              step="0.1"
              value={annualRate}
              onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Loan Term (Years):
            </label>
            <input
              type="number"
              value={termYears}
              onChange={(e) => setTermYears(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Output Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
            Monthly Payment (EMI)
          </span>
          <span className="text-3xl sm:text-4xl font-black text-indigo-700 dark:text-indigo-300 font-mono">
            ${emi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Total Interest Paid
          </span>
          <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
            ${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Total Loan Cost
          </span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            ${totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Visual Balance Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Payment Breakdown: Principal vs Interest
        </span>
        <div className="h-4 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800">
          <div
            style={{ width: `${principalPct}%` }}
            className="bg-indigo-600 transition-all"
            title={`Principal: ${principalPct.toFixed(1)}%`}
          />
          <div
            style={{ width: `${interestPct}%` }}
            className="bg-amber-500 transition-all"
            title={`Interest: ${interestPct.toFixed(1)}%`}
          />
        </div>
        <div className="flex justify-between text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            Principal: {principalPct.toFixed(1)}%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Total Interest: {interestPct.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* First 12 Months Amortization Preview */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Amortization Preview (First 12 Months)
        </span>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase">
                <th className="py-2">Month</th>
                <th className="py-2">Principal</th>
                <th className="py-2">Interest</th>
                <th className="py-2">Remaining Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {schedule.map(s => (
                <tr key={s.month}>
                  <td className="py-2 text-slate-500">{s.month}</td>
                  <td className="py-2 text-indigo-600 dark:text-indigo-400 font-semibold">${s.principal}</td>
                  <td className="py-2 text-amber-600 dark:text-amber-400">${s.interest}</td>
                  <td className="py-2 text-slate-700 dark:text-slate-300 font-bold">${s.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
