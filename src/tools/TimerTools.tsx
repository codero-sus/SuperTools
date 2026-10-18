import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Play, Pause, RotateCcw, Flag, Bell, Coffee, Brain } from 'lucide-react';

interface TimerToolsProps {
  mode?: 'stopwatch' | 'countdown' | 'pomodoro';
}

export const TimerTools: React.FC<TimerToolsProps> = ({ mode = 'stopwatch' }) => {
  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  // Countdown state
  const [countdownDuration, setCountdownDuration] = useState(300); // 5 min default
  const [countdownRemaining, setCountdownRemaining] = useState(300);
  const [cdRunning, setCdRunning] = useState(false);

  // Pomodoro state
  const [pomoType, setPomoType] = useState<'focus' | 'break' | 'long-break'>('focus');
  const [pomoRemaining, setPomoRemaining] = useState(25 * 60);
  const [pomoRunning, setPomoRunning] = useState(false);
  const [pomoRounds, setPomoRounds] = useState(0);

  // Stopwatch interval
  useEffect(() => {
    let timer: any;
    if (swRunning) {
      const start = Date.now() - stopwatchTime;
      timer = setInterval(() => {
        setStopwatchTime(Date.now() - start);
      }, 10);
    }
    return () => clearInterval(timer);
  }, [swRunning]);

  // Countdown interval
  useEffect(() => {
    let timer: any;
    if (cdRunning && countdownRemaining > 0) {
      timer = setInterval(() => {
        setCountdownRemaining(prev => {
          if (prev <= 1) {
            setCdRunning(false);
            confetti({ particleCount: 80, spread: 60 });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cdRunning, countdownRemaining]);

  // Pomodoro interval
  useEffect(() => {
    let timer: any;
    if (pomoRunning && pomoRemaining > 0) {
      timer = setInterval(() => {
        setPomoRemaining(prev => {
          if (prev <= 1) {
            setPomoRunning(false);
            confetti({ particleCount: 100, spread: 80 });
            if (pomoType === 'focus') {
              setPomoRounds(r => r + 1);
              setPomoType('break');
              return 5 * 60;
            } else {
              setPomoType('focus');
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [pomoRunning, pomoRemaining, pomoType]);

  const formatStopwatch = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
  };

  const formatSeconds = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {mode === 'stopwatch' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-6">
          <span className="font-mono text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatStopwatch(stopwatchTime)}
          </span>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setSwRunning(!swRunning)}
              className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${
                swRunning ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {swRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {swRunning ? 'Pause' : 'Start'}
            </button>

            {swRunning && (
              <button
                onClick={() => setLaps([stopwatchTime, ...laps])}
                className="px-5 py-3 rounded-2xl font-bold text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <Flag className="w-4 h-4" />
                Lap
              </button>
            )}

            <button
              onClick={() => {
                setSwRunning(false);
                setStopwatchTime(0);
                setLaps([]);
              }}
              className="px-5 py-3 rounded-2xl font-bold text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {laps.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 max-h-48 overflow-y-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Lap Times ({laps.length})
              </span>
              {laps.map((lap, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs font-mono py-1 border-b border-slate-50 dark:border-slate-800/40">
                  <span className="text-slate-400">Lap {laps.length - idx}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatStopwatch(lap)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {mode === 'countdown' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-6">
          <span className="font-mono text-5xl sm:text-6xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
            {formatSeconds(countdownRemaining)}
          </span>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {[60, 180, 300, 600, 900, 1800].map(sec => (
              <button
                key={sec}
                onClick={() => {
                  setCdRunning(false);
                  setCountdownDuration(sec);
                  setCountdownRemaining(sec);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                  countdownDuration === sec
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setCdRunning(!cdRunning)}
              className="px-6 py-3 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
            >
              {cdRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {cdRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={() => {
                setCdRunning(false);
                setCountdownRemaining(countdownDuration);
              }}
              className="px-5 py-3 rounded-2xl font-bold text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      )}

      {mode === 'pomodoro' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-6">
          <div className="flex justify-center gap-2">
            <button
              onClick={() => {
                setPomoType('focus');
                setPomoRemaining(25 * 60);
                setPomoRunning(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                pomoType === 'focus' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              Focus (25m)
            </button>
            <button
              onClick={() => {
                setPomoType('break');
                setPomoRemaining(5 * 60);
                setPomoRunning(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                pomoType === 'break' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              Short Break (5m)
            </button>
            <button
              onClick={() => {
                setPomoType('long-break');
                setPomoRemaining(15 * 60);
                setPomoRunning(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                pomoType === 'long-break' ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              Long Break (15m)
            </button>
          </div>

          <span className="font-mono text-6xl font-black text-slate-900 dark:text-white tracking-tight block">
            {formatSeconds(pomoRemaining)}
          </span>

          <div className="text-xs font-medium text-slate-400">
            Completed Pomodoros Today: <strong className="text-indigo-600 dark:text-indigo-400">{pomoRounds}</strong>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setPomoRunning(!pomoRunning)}
              className="px-6 py-3 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
            >
              {pomoRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {pomoRunning ? 'Pause' : 'Start Focus Session'}
            </button>
            <button
              onClick={() => {
                setPomoRunning(false);
                setPomoRemaining(pomoType === 'focus' ? 25 * 60 : pomoType === 'break' ? 5 * 60 : 15 * 60);
              }}
              className="px-5 py-3 rounded-2xl font-bold text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
