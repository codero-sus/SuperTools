import React, { useState } from 'react';
import { Delete, RotateCcw } from 'lucide-react';

export const ScientificCalc: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number>(0);
  const [isRad, setIsRad] = useState(true);

  const handleDigit = (d: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(d);
    } else {
      setDisplay(display + d);
    }
  };

  const handleOp = (op: string) => {
    setDisplay(display + ' ' + op + ' ');
  };

  const handleClear = () => {
    setDisplay('0');
  };

  const handleDelete = () => {
    if (display.length <= 1 || display === 'Error') {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1).trimEnd());
    }
  };

  const handleEquals = () => {
    try {
      // Clean up expression
      let expr = display
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, `${Math.PI}`)
        .replace(/e/g, `${Math.E}`)
        .replace(/\^/g, '**');

      // Safe evaluation of mathematical expression
      // eslint-disable-next-line no-eval
      const res = Function(`"use strict"; return (${expr})`)();
      if (typeof res === 'number' && !isNaN(res)) {
        setDisplay(parseFloat(res.toFixed(10)).toString());
      } else {
        setDisplay('Error');
      }
    } catch {
      setDisplay('Error');
    }
  };

  const handleFunc = (fn: string) => {
    try {
      const val = parseFloat(display);
      if (isNaN(val)) return;

      let res = 0;
      const angle = isRad ? val : (val * Math.PI) / 180;

      switch (fn) {
        case 'sin': res = Math.sin(angle); break;
        case 'cos': res = Math.cos(angle); break;
        case 'tan': res = Math.tan(angle); break;
        case 'asin': res = isRad ? Math.asin(val) : (Math.asin(val) * 180) / Math.PI; break;
        case 'acos': res = isRad ? Math.acos(val) : (Math.acos(val) * 180) / Math.PI; break;
        case 'atan': res = isRad ? Math.atan(val) : (Math.atan(val) * 180) / Math.PI; break;
        case 'ln': res = Math.log(val); break;
        case 'log': res = Math.log10(val); break;
        case 'sqrt': res = Math.sqrt(val); break;
        case 'sqr': res = Math.pow(val, 2); break;
        case 'cube': res = Math.pow(val, 3); break;
        case '1/x': res = 1 / val; break;
        case 'fact': {
          let f = 1;
          for (let i = 2; i <= Math.min(val, 170); i++) f *= i;
          res = f;
          break;
        }
      }

      setDisplay(parseFloat(res.toFixed(10)).toString());
    } catch {
      setDisplay('Error');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-800 space-y-4">
        {/* Display Screen */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-right font-mono flex flex-col justify-between h-24 overflow-hidden">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <button
              onClick={() => setIsRad(!isRad)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-400 font-bold"
            >
              {isRad ? 'RAD' : 'DEG'}
            </button>
            <span>{memory !== 0 ? `M: ${memory}` : ''}</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-wider overflow-x-auto scrollbar-none">
            {display}
          </div>
        </div>

        {/* Keypad Grid */}
        <div className="grid grid-cols-5 gap-2 text-sm sm:text-base font-semibold">
          {/* Row 1 */}
          <button onClick={() => handleFunc('sin')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">sin</button>
          <button onClick={() => handleFunc('cos')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">cos</button>
          <button onClick={() => handleFunc('tan')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">tan</button>
          <button onClick={handleClear} className="p-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300">C</button>
          <button onClick={handleDelete} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 flex items-center justify-center"><Delete className="w-4 h-4" /></button>

          {/* Row 2 */}
          <button onClick={() => handleFunc('ln')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">ln</button>
          <button onClick={() => handleFunc('log')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">log</button>
          <button onClick={() => handleFunc('sqrt')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">√</button>
          <button onClick={() => handleOp('^')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">xʸ</button>
          <button onClick={() => handleOp('÷')} className="p-2.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-800 text-indigo-300">÷</button>

          {/* Row 3 */}
          <button onClick={() => handleFunc('sqr')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">x²</button>
          <button onClick={() => handleDigit('7')} className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700">7</button>
          <button onClick={() => handleDigit('8')} className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700">8</button>
          <button onClick={() => handleDigit('9')} className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700">9</button>
          <button onClick={() => handleOp('×')} className="p-2.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-800 text-indigo-300">×</button>

          {/* Row 4 */}
          <button onClick={() => handleFunc('1/x')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">1/x</button>
          <button onClick={() => handleDigit('4')} className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700">4</button>
          <button onClick={() => handleDigit('5')} className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700">5</button>
          <button onClick={() => handleDigit('6')} className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700">6</button>
          <button onClick={() => handleOp('-')} className="p-2.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-800 text-indigo-300">-</button>

          {/* Row 5 */}
          <button onClick={() => handleFunc('fact')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">n!</button>
          <button onClick={() => handleDigit('1')} className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700">1</button>
          <button onClick={() => handleDigit('2')} className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700">2</button>
          <button onClick={() => handleDigit('3')} className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700">3</button>
          <button onClick={() => handleOp('+')} className="p-2.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-800 text-indigo-300">+</button>

          {/* Row 6 */}
          <button onClick={() => handleDigit('π')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">π</button>
          <button onClick={() => handleDigit('0')} className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700">0</button>
          <button onClick={() => handleDigit('.')} className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700">.</button>
          <button onClick={() => handleDigit('e')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">e</button>
          <button onClick={handleEquals} className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold">=</button>
        </div>
      </div>
    </div>
  );
};
