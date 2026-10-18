import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Dices, RotateCcw } from 'lucide-react';

export const DiceTool: React.FC = () => {
  const [selectedDie, setSelectedDie] = useState<number>(20);
  const [diceCount, setDiceCount] = useState<number>(1);
  const [modifier, setModifier] = useState<number>(0);
  const [results, setResults] = useState<number[]>([20]);
  const [history, setHistory] = useState<{ die: number; rolls: number[]; mod: number; total: number; timestamp: string }[]>([]);

  const dice = [
    { name: 'd4', sides: 4 },
    { name: 'd6', sides: 6 },
    { name: 'd8', sides: 8 },
    { name: 'd10', sides: 10 },
    { name: 'd12', sides: 12 },
    { name: 'd20', sides: 20 },
    { name: 'd100', sides: 100 }
  ];

  const rollDice = () => {
    const rolls: number[] = [];
    for (let i = 0; i < diceCount; i++) {
      rolls.push(Math.floor(Math.random() * selectedDie) + 1);
    }
    setResults(rolls);

    const sum = rolls.reduce((a, b) => a + b, 0) + modifier;
    const entry = {
      die: selectedDie,
      rolls,
      mod: modifier,
      total: sum,
      timestamp: new Date().toLocaleTimeString()
    };
    setHistory(prev => [entry, ...prev.slice(0, 19)]);

    // Confetti on natural 20 or max roll on d100!
    if ((selectedDie === 20 && rolls.includes(20)) || (selectedDie === 100 && rolls.includes(100))) {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    }
  };

  const total = results.reduce((a, b) => a + b, 0) + modifier;

  return (
    <div className="space-y-6">
      {/* Dice Selection */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Select Die Type:
        </span>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {dice.map(d => (
            <button
              key={d.name}
              onClick={() => setSelectedDie(d.sides)}
              className={`p-3 rounded-xl border text-center font-bold text-sm transition-all ${
                selectedDie === d.sides
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Number of Dice:</label>
            <input
              type="number"
              min="1"
              max="20"
              value={diceCount}
              onChange={(e) => setDiceCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Modifier (+/-):</label>
            <input
              type="number"
              value={modifier}
              onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Main Roll Stage */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-slate-900 dark:to-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-md text-center flex flex-col items-center justify-center space-y-6">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Rolling {diceCount}d{selectedDie}{modifier !== 0 ? (modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`) : ''}
        </span>

        {/* Big Total */}
        <div className="text-6xl sm:text-8xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
          {total}
        </div>

        {/* Individual Dice */}
        <div className="flex flex-wrap justify-center gap-2 max-w-md">
          {results.map((r, i) => (
            <span
              key={i}
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm shadow-xs ${
                r === selectedDie
                  ? 'bg-amber-400 text-slate-950 font-black animate-bounce'
                  : r === 1
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {r}
            </span>
          ))}
          {modifier !== 0 && (
            <span className="h-10 px-2 rounded-xl flex items-center justify-center font-mono font-bold text-xs text-slate-500">
              {modifier > 0 ? `+${modifier}` : modifier}
            </span>
          )}
        </div>

        <button
          onClick={rollDice}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
        >
          <Dices className="w-5 h-5" />
          <span>Roll Dice!</span>
        </button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Roll History Log
          </span>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-48 overflow-y-auto text-xs font-mono">
            {history.map((h, i) => (
              <div key={i} className="py-2 flex items-center justify-between">
                <span className="text-slate-500">{h.timestamp}</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {h.rolls.length}d{h.die} [{h.rolls.join(', ')}]{h.mod !== 0 ? ` (${h.mod > 0 ? '+' : ''}${h.mod})` : ''}
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                  = {h.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
