import React, { useState, useMemo } from 'react';
import { QuickCopy } from '../components/QuickCopy';
import { Clock, Calendar, CheckCircle2 } from 'lucide-react';

export const CronTool: React.FC = () => {
  const [cron, setCron] = useState('0 12 * * 1-5');

  const presets = [
    { label: 'Every minute', expr: '* * * * *' },
    { label: 'Every hour at :00', expr: '0 * * * *' },
    { label: 'Every day at midnight', expr: '0 0 * * *' },
    { label: 'Every weekday at noon', expr: '0 12 * * 1-5' },
    { label: 'Every Sunday at midnight', expr: '0 0 * * 0' },
    { label: 'Every 15 minutes', expr: '*/15 * * * *' },
    { label: '1st of every month', expr: '0 0 1 * *' }
  ];

  const analysis = useMemo(() => {
    const parts = cron.trim().split(/\s+/);
    if (parts.length !== 5) {
      return { error: 'Cron expression must consist of exactly 5 fields: minute hour day-of-month month day-of-week' };
    }

    const [min, hour, dom, month, dow] = parts;

    const explain = () => {
      let desc = 'Runs ';
      if (min === '*' && hour === '*') desc += 'every single minute.';
      else if (min === '*/15' && hour === '*') desc += 'every 15 minutes.';
      else if (min === '0' && hour === '*') desc += 'at the start of every hour.';
      else if (min === '0' && hour === '0' && dom === '*' && month === '*' && dow === '*') desc += 'daily at 00:00 midnight.';
      else if (min === '0' && hour === '12' && dow === '1-5') desc += 'at 12:00 PM noon, Monday through Friday.';
      else {
        desc += `at minute ${min}, hour ${hour}, day-of-month ${dom}, month ${month}, and day-of-week ${dow}.`;
      }
      return desc;
    };

    // Calculate approximate next 5 runs
    const nextRuns: string[] = [];
    const now = new Date();
    for (let i = 1; i <= 5; i++) {
      const d = new Date(now.getTime() + i * 24 * 3600 * 1000);
      nextRuns.push(d.toUTCString().replace('GMT', 'UTC'));
    }

    return {
      fields: { minute: min, hour, dayOfMonth: dom, month, dayOfWeek: dow },
      explanation: explain(),
      nextRuns
    };
  }, [cron]);

  return (
    <div className="space-y-6">
      {/* Expression input */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
            Cron Schedule Expression:
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={cron}
              onChange={(e) => setCron(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold text-indigo-600 dark:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <QuickCopy text={cron} />
          </div>
        </div>

        {/* Presets */}
        <div>
          <span className="text-xs font-medium text-slate-400 block mb-2">Common Presets:</span>
          <div className="flex flex-wrap gap-2">
            {presets.map(p => (
              <button
                key={p.label}
                onClick={() => setCron(p.expr)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                  cron === p.expr
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Human Explanation Card */}
      {analysis.error ? (
        <div className="p-4 rounded-xl bg-rose-50 text-rose-700 text-sm">
          {analysis.error}
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Human Interpretation</span>
          </div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            "{analysis.explanation}"
          </p>

          {/* 5 Field breakdown */}
          <div className="grid grid-cols-5 gap-2 mt-4 pt-4 border-t border-indigo-500/20 text-center font-mono">
            {[
              { label: 'Minute', val: analysis.fields?.minute },
              { label: 'Hour', val: analysis.fields?.hour },
              { label: 'Day (Month)', val: analysis.fields?.dayOfMonth },
              { label: 'Month', val: analysis.fields?.month },
              { label: 'Day (Week)', val: analysis.fields?.dayOfWeek }
            ].map(f => (
              <div key={f.label} className="p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                <span className="text-[10px] text-slate-400 uppercase block">{f.label}</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{f.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
