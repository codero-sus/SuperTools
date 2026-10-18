import React, { useState, useEffect, useMemo } from 'react';
import { QuickCopy } from '../components/QuickCopy';
import { Clock, Calendar, PartyPopper } from 'lucide-react';

interface DateTimeToolsProps {
  mode?: string;
}

export const DateTimeTools: React.FC<DateTimeToolsProps> = ({ mode = 'timestamp' }) => {
  // Current live timestamp
  const [currentEpoch, setCurrentEpoch] = useState(Math.floor(Date.now() / 1000));
  const [customTimestamp, setCustomTimestamp] = useState<number>(Math.floor(Date.now() / 1000));
  const [customIso, setCustomIso] = useState<string>(new Date().toISOString().slice(0, 16));

  // Date diff inputs
  const [date1, setDate1] = useState('2026-01-01');
  const [date2, setDate2] = useState(new Date().toISOString().slice(0, 10));

  // Add/Subtract inputs
  const [baseDate, setBaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [addDays, setAddDays] = useState(30);

  // Age input
  const [birthDate, setBirthDate] = useState('1998-05-15');

  // Time card inputs
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:30');
  const [lunchMinutes, setLunchMinutes] = useState(45);
  const [hourlyWage, setHourlyWage] = useState(35);

  // Raw seconds / minutes inputs
  const [rawSeconds, setRawSeconds] = useState(3665);
  const [rawMinutes, setRawMinutes] = useState(175);
  const [rawDecimalHours, setRawDecimalHours] = useState(7.75);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const results = useMemo(() => {
    switch (mode) {
      case 'timestamp': {
        const d = new Date(customTimestamp * 1000);
        return {
          title: 'Epoch Timestamp Conversion',
          items: [
            { label: 'Current Live Unix Epoch', val: currentEpoch.toString() },
            { label: 'UTC Date String', val: d.toUTCString() },
            { label: 'Local Date String', val: d.toLocaleString() },
            { label: 'ISO 8601 Format', val: d.toISOString() }
          ]
        };
      }
      case 'date-diff': {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffMs = Math.abs(d2.getTime() - d1.getTime());
        const totalDays = Math.floor(diffMs / (1000 * 3600 * 24));
        const weeks = Math.floor(totalDays / 7);
        const remDays = totalDays % 7;
        const totalHours = Math.floor(diffMs / (1000 * 3600));
        return {
          title: `Difference between ${date1} and ${date2}`,
          items: [
            { label: 'Total Days', val: `${totalDays.toLocaleString()} days` },
            { label: 'Weeks & Days', val: `${weeks} weeks, ${remDays} days` },
            { label: 'Total Hours', val: `${totalHours.toLocaleString()} hours` }
          ]
        };
      }
      case 'date-add': {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + addDays);
        return {
          title: `${baseDate} ${addDays >= 0 ? '+' : '-'} ${Math.abs(addDays)} days`,
          items: [
            { label: 'Calculated Target Date', val: d.toISOString().slice(0, 10) },
            { label: 'Full Day Name', val: d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }
          ]
        };
      }
      case 'age': {
        const b = new Date(birthDate);
        const now = new Date();
        const diffMs = now.getTime() - b.getTime();
        const totalSeconds = Math.floor(diffMs / 1000);
        const totalHours = Math.floor(totalSeconds / 3600);
        const totalDays = Math.floor(totalHours / 24);

        let years = now.getFullYear() - b.getFullYear();
        let months = now.getMonth() - b.getMonth();
        let days = now.getDate() - b.getDate();
        if (days < 0) {
          months--;
          days += 30;
        }
        if (months < 0) {
          years--;
          months += 12;
        }

        return {
          title: `Age from Birthday (${birthDate})`,
          items: [
            { label: 'Precise Age', val: `${years} years, ${months} months, ${days} days` },
            { label: 'Total Days Lived', val: `${totalDays.toLocaleString()} days` },
            { label: 'Total Hours Lived', val: `${totalHours.toLocaleString()} hours` },
            { label: 'Total Seconds Lived', val: `${totalSeconds.toLocaleString()} seconds` }
          ]
        };
      }
      case 'business-days': {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        let count = 0;
        const cur = new Date(Math.min(d1.getTime(), d2.getTime()));
        const end = new Date(Math.max(d1.getTime(), d2.getTime()));
        while (cur <= end) {
          const day = cur.getDay();
          if (day !== 0 && day !== 6) count++;
          cur.setDate(cur.getDate() + 1);
        }
        return {
          title: `Business Days between ${date1} and ${date2}`,
          items: [
            { label: 'Working Days (Excluding Weekends)', val: `${count} business days` }
          ]
        };
      }
      case 'time-card': {
        const [sh, sm] = startTime.split(':').map(Number);
        const [eh, em] = endTime.split(':').map(Number);
        let minutesWorked = (eh * 60 + em) - (sh * 60 + sm) - lunchMinutes;
        if (minutesWorked < 0) minutesWorked += 24 * 60;
        const hoursWorked = minutesWorked / 60;
        const grossPay = hoursWorked * hourlyWage;
        return {
          title: 'Daily Timesheet & Pay Calculation',
          items: [
            { label: 'Total Net Hours Worked', val: `${hoursWorked.toFixed(2)} hours` },
            { label: 'Gross Daily Pay', val: `$${grossPay.toFixed(2)}` }
          ]
        };
      }
      case 'sec-to-hms': {
        const h = Math.floor(rawSeconds / 3600);
        const m = Math.floor((rawSeconds % 3600) / 60);
        const s = rawSeconds % 60;
        return {
          title: `${rawSeconds} Seconds Conversion`,
          items: [
            { label: 'HH:MM:SS Formatted', val: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` },
            { label: 'In Minutes', val: `${(rawSeconds / 60).toFixed(2)} minutes` },
            { label: 'In Hours', val: `${(rawSeconds / 3600).toFixed(4)} hours` }
          ]
        };
      }
      case 'min-to-hm': {
        const h = Math.floor(rawMinutes / 60);
        const m = rawMinutes % 60;
        return {
          title: `${rawMinutes} Minutes Conversion`,
          items: [
            { label: 'Hours & Minutes', val: `${h} hours and ${m} minutes` },
            { label: 'Decimal Hours', val: `${(rawMinutes / 60).toFixed(2)} hours` }
          ]
        };
      }
      case 'dec-to-time': {
        const h = Math.floor(rawDecimalHours);
        const m = Math.round((rawDecimalHours - h) * 60);
        return {
          title: `${rawDecimalHours} Decimal Hours`,
          items: [
            { label: 'Clock Time', val: `${h} hours, ${m} minutes` }
          ]
        };
      }
      case 'weekend-cd': {
        const now = new Date();
        const day = now.getDay();
        // Friday is day 5
        let daysUntilFriday = (5 - day + 7) % 7;
        const friday = new Date(now);
        friday.setDate(now.getDate() + daysUntilFriday);
        friday.setHours(17, 0, 0, 0);
        if (now > friday) {
          friday.setDate(friday.getDate() + 7);
        }
        const diffHours = Math.round((friday.getTime() - now.getTime()) / (1000 * 3600));
        return {
          title: 'Weekend Countdown Clock',
          items: [
            { label: 'Hours until Friday 5:00 PM', val: `${diffHours} hours remaining` }
          ]
        };
      }
      case 'century': {
        const yr = parseInt(baseDate.slice(0, 4)) || 2026;
        const cent = Math.ceil(yr / 100);
        const mil = Math.ceil(yr / 1000);
        return {
          title: `Century for Year ${yr}`,
          items: [
            { label: 'Century', val: `${cent}th Century` },
            { label: 'Millennium', val: `${mil}rd Millennium` }
          ]
        };
      }
      default:
        return {
          title: 'Date & Time',
          items: [{ label: 'Current Time', val: new Date().toLocaleString() }]
        };
    }
  }, [mode, currentEpoch, customTimestamp, date1, date2, baseDate, addDays, birthDate, startTime, endTime, lunchMinutes, hourlyWage, rawSeconds, rawMinutes, rawDecimalHours]);

  return (
    <div className="space-y-6">
      {/* Dynamic Input Control Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        {mode === 'timestamp' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Unix Timestamp (Seconds):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={customTimestamp}
                  onChange={(e) => setCustomTimestamp(parseInt(e.target.value) || 0)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold"
                />
                <button
                  onClick={() => setCustomTimestamp(Math.floor(Date.now() / 1000))}
                  className="px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                >
                  Set to Now
                </button>
              </div>
            </div>
          </div>
        )}

        {(mode === 'date-diff' || mode === 'business-days') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Start Date:</label>
              <input
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">End Date:</label>
              <input
                type="date"
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
              />
            </div>
          </div>
        )}

        {mode === 'date-add' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Base Date:</label>
              <input
                type="date"
                value={baseDate}
                onChange={(e) => setBaseDate(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Days to Add (+) or Subtract (-):</label>
              <input
                type="number"
                value={addDays}
                onChange={(e) => setAddDays(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
              />
            </div>
          </div>
        )}

        {mode === 'age' && (
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Select Birthday:</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full max-w-sm px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
            />
          </div>
        )}

        {mode === 'time-card' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Clock In:</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Clock Out:</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Lunch (Mins):</label>
              <input
                type="number"
                value={lunchMinutes}
                onChange={(e) => setLunchMinutes(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Hourly Rate ($):</label>
              <input
                type="number"
                value={hourlyWage}
                onChange={(e) => setHourlyWage(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono"
              />
            </div>
          </div>
        )}

        {mode === 'sec-to-hms' && (
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Total Seconds:</label>
            <input
              type="number"
              value={rawSeconds}
              onChange={(e) => setRawSeconds(parseInt(e.target.value) || 0)}
              className="w-full max-w-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold"
            />
          </div>
        )}

        {mode === 'min-to-hm' && (
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Total Minutes:</label>
            <input
              type="number"
              value={rawMinutes}
              onChange={(e) => setRawMinutes(parseInt(e.target.value) || 0)}
              className="w-full max-w-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold"
            />
          </div>
        )}

        {mode === 'dec-to-time' && (
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Decimal Hours (e.g. 7.75):</label>
            <input
              type="number"
              step="0.05"
              value={rawDecimalHours}
              onChange={(e) => setRawDecimalHours(parseFloat(e.target.value) || 0)}
              className="w-full max-w-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold"
            />
          </div>
        )}
      </div>

      {/* Results Cards */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
          {results.title}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {results.items.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between"
            >
              <div className="min-w-0 pr-2">
                <span className="text-xs text-slate-500 block">{item.label}</span>
                <span className="text-base font-bold text-slate-900 dark:text-white font-mono mt-0.5 block truncate">
                  {item.val}
                </span>
              </div>
              <QuickCopy text={item.val} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
