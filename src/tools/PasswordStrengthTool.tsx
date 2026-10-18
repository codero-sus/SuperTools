import React, { useState, useMemo } from 'react';
import { ShieldCheck, ShieldAlert, Check, X, Clock, AlertTriangle } from 'lucide-react';

export const PasswordStrengthTool: React.FC = () => {
  const [password, setPassword] = useState('MyTr0ngP@ssw0rd!');

  const analysis = useMemo(() => {
    const len = password.length;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    let pool = 0;
    if (hasUpper) pool += 26;
    if (hasLower) pool += 26;
    if (hasNumber) pool += 10;
    if (hasSymbol) pool += 33;

    const entropy = pool > 0 && len > 0 ? Math.round(len * (Math.log(pool) / Math.LN2)) : 0;

    // Crack time estimation (assuming 10 billion guesses/sec modern RTX 4090 cluster)
    const combinations = pool > 0 ? Math.pow(pool, len) : 0;
    const seconds = combinations / 10000000000;

    let crackTime = 'Instant';
    if (seconds < 1) crackTime = 'Instant (< 1 second)';
    else if (seconds < 60) crackTime = `${Math.round(seconds)} seconds`;
    else if (seconds < 3600) crackTime = `${Math.round(seconds / 60)} minutes`;
    else if (seconds < 86400) crackTime = `${Math.round(seconds / 3600)} hours`;
    else if (seconds < 31536000) crackTime = `${Math.round(seconds / 86400)} days`;
    else if (seconds < 31536000000) crackTime = `${Math.round(seconds / 31536000)} years`;
    else crackTime = 'Centuries (Virtually uncrackable)';

    let score = 0;
    if (len >= 8) score++;
    if (len >= 12) score++;
    if (hasUpper && hasLower) score++;
    if (hasNumber) score++;
    if (hasSymbol) score++;

    return {
      entropy,
      crackTime,
      score, // 0 to 5
      checks: [
        { label: 'At least 12 characters', pass: len >= 12 },
        { label: 'Contains uppercase letter', pass: hasUpper },
        { label: 'Contains lowercase letter', pass: hasLower },
        { label: 'Contains digit', pass: hasNumber },
        { label: 'Contains special symbol', pass: hasSymbol }
      ]
    };
  }, [password]);

  const scoreColors = ['bg-rose-500', 'bg-rose-500', 'bg-amber-500', 'bg-yellow-500', 'bg-emerald-500', 'bg-emerald-600'];
  const scoreLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];

  return (
    <div className="space-y-6">
      {/* Password Input */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
          Enter Password to Evaluate:
        </label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type a password..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />

        {/* Strength Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-500">Security Strength:</span>
            <span className="text-indigo-600 dark:text-indigo-400">{scoreLabels[analysis.score]}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`flex-1 transition-all ${
                  analysis.score >= level ? scoreColors[analysis.score] : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Information Entropy
          </span>
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
            {analysis.entropy} bits
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Estimated Brute-Force Crack Time
          </span>
          <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            {analysis.crackTime}
          </span>
        </div>
      </div>

      {/* Checklist */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
          Resilience Checklist
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {analysis.checks.map(c => (
            <div key={c.label} className="flex items-center gap-2 text-sm">
              <span className={`p-1 rounded-full ${c.pass ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {c.pass ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              </span>
              <span className={c.pass ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-400 line-through'}>
                {c.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
