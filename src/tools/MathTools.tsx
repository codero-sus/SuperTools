import React, { useState, useMemo } from 'react';
import { QuickCopy } from '../components/QuickCopy';
import { Sparkles, Calculator, CheckCircle2 } from 'lucide-react';

interface MathToolsProps {
  mode?: string;
}

export const MathTools: React.FC<MathToolsProps> = ({ mode = 'percentage' }) => {
  // General numeric inputs
  const [num1, setNum1] = useState<number>(25);
  const [num2, setNum2] = useState<number>(100);
  const [num3, setNum3] = useState<number>(0);
  const [datasetText, setDatasetText] = useState('12, 15, 18, 22, 25, 25, 29, 34, 40');
  const [coinFlips, setCoinFlips] = useState<{ heads: number; tails: number; history: string[] }>({
    heads: 0,
    tails: 0,
    history: []
  });

  const flipCoin = () => {
    const isHeads = Math.random() >= 0.5;
    const res = isHeads ? 'H' : 'T';
    setCoinFlips(prev => ({
      heads: prev.heads + (isHeads ? 1 : 0),
      tails: prev.tails + (!isHeads ? 1 : 0),
      history: [res, ...prev.history.slice(0, 29)]
    }));
  };

  // Compute results based on mode
  const output = useMemo(() => {
    switch (mode) {
      case 'percentage': {
        const xOfY = (num1 * num2) / 100;
        const xIsWhatPctOfY = num2 !== 0 ? (num1 / num2) * 100 : 0;
        const pctChange = num1 !== 0 ? ((num2 - num1) / Math.abs(num1)) * 100 : 0;
        return {
          title: 'Percentage Calculations',
          items: [
            { label: `${num1}% of ${num2}`, val: xOfY.toFixed(4) },
            { label: `${num1} is what % of ${num2}`, val: `${xIsWhatPctOfY.toFixed(2)}%` },
            { label: `Change from ${num1} to ${num2}`, val: `${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(2)}%` }
          ]
        };
      }
      case 'fractions': {
        const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b));
        const n = Math.round(num1);
        const d = Math.round(num2) || 1;
        const div = gcd(Math.abs(n), Math.abs(d));
        const simN = n / div;
        const simD = d / div;
        const dec = n / d;
        const whole = Math.floor(Math.abs(simN) / Math.abs(simD));
        const rem = Math.abs(simN) % Math.abs(simD);
        const mixed = whole > 0 && rem > 0 ? `${(simN < 0 ? '-' : '')}${whole} ${rem}/${Math.abs(simD)}` : '';

        return {
          title: 'Fraction Simplification',
          items: [
            { label: 'Simplified Fraction', val: `${simN} / ${simD}` },
            { label: 'Decimal Equivalent', val: dec.toString() },
            { label: 'Mixed Number', val: mixed || 'N/A' },
            { label: 'Reciprocal', val: `${simD} / ${simN}` }
          ]
        };
      }
      case 'gcd-lcm': {
        const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b));
        const a = Math.round(num1);
        const b = Math.round(num2);
        const g = gcd(a, b);
        const l = g !== 0 ? Math.abs(a * b) / g : 0;
        return {
          title: 'GCD & LCM',
          items: [
            { label: `Greatest Common Divisor (GCD) of ${a} & ${b}`, val: g.toString() },
            { label: `Least Common Multiple (LCM) of ${a} & ${b}`, val: l.toString() }
          ]
        };
      }
      case 'prime-check': {
        const n = Math.round(num1);
        let isPrime = n > 1;
        for (let i = 2; i * i <= n; i++) {
          if (n % i === 0) {
            isPrime = false;
            break;
          }
        }
        return {
          title: 'Prime Number Verification',
          items: [
            { label: `Is ${n} a prime number?`, val: isPrime ? 'YES (Prime)' : 'NO (Composite / Not Prime)' }
          ]
        };
      }
      case 'prime-factors': {
        let n = Math.round(num1);
        const factors: number[] = [];
        let d = 2;
        while (d * d <= n) {
          while (n % d === 0) {
            factors.push(d);
            n /= d;
          }
          d++;
        }
        if (n > 1) factors.push(n);
        return {
          title: 'Prime Factorization',
          items: [
            { label: 'Prime Factors', val: factors.join(' × ') || '1' },
            { label: 'Distinct Prime Factors', val: Array.from(new Set(factors)).join(', ') || 'None' }
          ]
        };
      }
      case 'statistics': {
        const nums = datasetText.split(/[,\s]+/).map(parseFloat).filter(n => !isNaN(n));
        if (nums.length === 0) return { title: 'Statistics', items: [{ label: 'Error', val: 'No valid numbers' }] };

        const count = nums.length;
        const sum = nums.reduce((a, b) => a + b, 0);
        const mean = sum / count;

        const sorted = [...nums].sort((a, b) => a - b);
        const median = count % 2 === 0 ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2 : sorted[Math.floor(count / 2)];
        const min = sorted[0];
        const max = sorted[count - 1];
        const range = max - min;

        // Variance & standard deviation
        const variance = nums.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
        const stdDev = Math.sqrt(variance);

        return {
          title: 'Summary Statistics',
          items: [
            { label: 'Count (N)', val: count.toString() },
            { label: 'Sum', val: sum.toString() },
            { label: 'Mean (Average)', val: mean.toFixed(4) },
            { label: 'Median', val: median.toString() },
            { label: 'Standard Deviation (σ)', val: stdDev.toFixed(4) },
            { label: 'Variance (σ²)', val: variance.toFixed(4) },
            { label: 'Minimum', val: min.toString() },
            { label: 'Maximum', val: max.toString() },
            { label: 'Range', val: range.toString() }
          ]
        };
      }
      case 'quadratic': {
        const a = num1;
        const b = num2;
        const c = num3;
        const disc = b * b - 4 * a * c;
        let rootDesc = '';

        if (disc > 0) {
          const r1 = (-b + Math.sqrt(disc)) / (2 * a);
          const r2 = (-b - Math.sqrt(disc)) / (2 * a);
          rootDesc = `Two Real Roots: x₁ = ${r1.toFixed(4)}, x₂ = ${r2.toFixed(4)}`;
        } else if (disc === 0) {
          const r = -b / (2 * a);
          rootDesc = `One Double Root: x = ${r.toFixed(4)}`;
        } else {
          const real = (-b / (2 * a)).toFixed(4);
          const imag = (Math.sqrt(-disc) / (2 * a)).toFixed(4);
          rootDesc = `Complex Roots: ${real} ± ${imag}i`;
        }

        return {
          title: `Quadratic: ${a}x² + ${b}x + ${c} = 0`,
          items: [
            { label: 'Discriminant (Δ = b² - 4ac)', val: disc.toString() },
            { label: 'Roots', val: rootDesc }
          ]
        };
      }
      case 'perm-comb': {
        const fact = (n: number): number => {
          if (n < 0) return 0;
          let res = 1;
          for (let i = 2; i <= n; i++) res *= i;
          return res;
        };
        const n = Math.round(num1);
        const r = Math.round(num2);
        const nPr = n >= r && r >= 0 ? fact(n) / fact(n - r) : 0;
        const nCr = n >= r && r >= 0 ? fact(n) / (fact(r) * fact(n - r)) : 0;

        return {
          title: `Permutations & Combinations (n = ${n}, r = ${r})`,
          items: [
            { label: `Permutations: nPr = n! / (n - r)!`, val: nPr.toString() },
            { label: `Combinations: nCr = n! / (r! · (n - r)!)`, val: nCr.toString() }
          ]
        };
      }
      case 'fibonacci': {
        const terms = Math.min(50, Math.max(1, Math.round(num1)));
        const seq: number[] = [0, 1];
        for (let i = 2; i < terms; i++) {
          seq.push(seq[i - 1] + seq[i - 2]);
        }
        return {
          title: `First ${terms} Fibonacci Numbers`,
          items: [
            { label: 'Sequence', val: seq.slice(0, terms).join(', ') }
          ]
        };
      }
      case 'golden-ratio': {
        const phi = 1.618033988749895;
        const val = num1;
        return {
          title: `Golden Ratio φ (1.6180339...) from Base ${val}`,
          items: [
            { label: 'Longer Section (A = X · φ)', val: (val * phi).toFixed(4) },
            { label: 'Shorter Section (B = X / φ)', val: (val / phi).toFixed(4) },
            { label: 'Total Harmony (A + B)', val: (val * phi + val / phi).toFixed(4) }
          ]
        };
      }
      case 'rule-of-three': {
        // if num1 -> num2, then num3 -> ?
        const res = num1 !== 0 ? (num2 * num3) / num1 : 0;
        return {
          title: `Rule of Three: If ${num1} gives ${num2}, then ${num3} gives...`,
          items: [
            { label: 'Direct Proportion Result', val: res.toFixed(4) },
            { label: 'Inverse Proportion Result', val: (num1 !== 0 && num3 !== 0 ? (num1 * num2) / num3 : 0).toFixed(4) }
          ]
        };
      }
      case 'num-to-words': {
        const toWords = (n: number): string => {
          if (n === 0) return 'Zero';
          const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
          const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
          const numStr = n.toString();
          if (n < 20) return a[n];
          if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
          if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + toWords(n % 100) : '');
          if (n < 1000000) return toWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + toWords(n % 1000) : '');
          return toWords(Math.floor(n / 1000000)) + ' Million' + (n % 1000000 !== 0 ? ' ' + toWords(n % 1000000) : '');
        };
        return {
          title: 'Number Spelled Out',
          items: [
            { label: 'Spelled Words', val: toWords(Math.abs(Math.round(num1))) }
          ]
        };
      }
      case 'bitwise': {
        const a = Math.round(num1);
        const b = Math.round(num2);
        return {
          title: `Bitwise Operations between ${a} and ${b}`,
          items: [
            { label: 'AND (a & b)', val: `${a & b} (${(a & b).toString(2)})` },
            { label: 'OR (a | b)', val: `${a | b} (${(a | b).toString(2)})` },
            { label: 'XOR (a ^ b)', val: `${a ^ b} (${(a ^ b).toString(2)})` },
            { label: 'NOT (~a)', val: `${(~a)}` },
            { label: 'Left Shift (a << 1)', val: `${a << 1}` },
            { label: 'Right Shift (a >> 1)', val: `${a >> 1}` }
          ]
        };
      }
      case 'ohms-law': {
        // V = I * R, P = V * I
        const v = num1;
        const i = num2;
        const r = i !== 0 ? v / i : 0;
        const p = v * i;
        return {
          title: `Ohm's Law: Voltage ${v}V, Current ${i}A`,
          items: [
            { label: 'Resistance (R = V / I)', val: `${r.toFixed(4)} Ω` },
            { label: 'Power (P = V · I)', val: `${p.toFixed(4)} W` }
          ]
        };
      }
      case 'kinetic-energy': {
        // E_k = 0.5 * m * v^2
        const m = num1;
        const v = num2;
        const ek = 0.5 * m * Math.pow(v, 2);
        return {
          title: `Kinetic Energy: Mass = ${m} kg, Velocity = ${v} m/s`,
          items: [
            { label: 'Kinetic Energy (E_k = ½mv²)', val: `${ek.toFixed(4)} Joules (J)` },
            { label: 'In Kilojoules (kJ)', val: `${(ek / 1000).toFixed(4)} kJ` }
          ]
        };
      }
      case 'circle': {
        const r = num1;
        const d = r * 2;
        const c = 2 * Math.PI * r;
        const a = Math.PI * Math.pow(r, 2);
        return {
          title: `Circle with Radius r = ${r}`,
          items: [
            { label: 'Diameter', val: d.toFixed(4) },
            { label: 'Circumference (2πr)', val: c.toFixed(4) },
            { label: 'Area (πr²)', val: a.toFixed(4) }
          ]
        };
      }
      case 'triangle': {
        // base num1, height num2
        const area = 0.5 * num1 * num2;
        return {
          title: `Triangle: Base = ${num1}, Height = ${num2}`,
          items: [
            { label: 'Area (½ · base · height)', val: area.toFixed(4) }
          ]
        };
      }
      case 'hypotenuse': {
        const c = Math.sqrt(Math.pow(num1, 2) + Math.pow(num2, 2));
        return {
          title: `Right Triangle Hypotenuse: a = ${num1}, b = ${num2}`,
          items: [
            { label: 'Hypotenuse (c = √(a² + b²))', val: c.toFixed(4) }
          ]
        };
      }
      case 'sphere': {
        const r = num1;
        const v = (4 / 3) * Math.PI * Math.pow(r, 3);
        const a = 4 * Math.PI * Math.pow(r, 2);
        return {
          title: `Sphere with Radius r = ${r}`,
          items: [
            { label: 'Volume (4/3 πr³)', val: v.toFixed(4) },
            { label: 'Surface Area (4πr²)', val: a.toFixed(4) }
          ]
        };
      }
      case 'cylinder': {
        const r = num1;
        const h = num2;
        const v = Math.PI * Math.pow(r, 2) * h;
        const a = 2 * Math.PI * r * (r + h);
        return {
          title: `Cylinder: Radius = ${r}, Height = ${h}`,
          items: [
            { label: 'Volume (πr²h)', val: v.toFixed(4) },
            { label: 'Surface Area (2πr(r+h))', val: a.toFixed(4) }
          ]
        };
      }
      default:
        return {
          title: 'Math Result',
          items: [{ label: 'Result', val: (num1 + num2).toString() }]
        };
    }
  }, [mode, num1, num2, num3, datasetText]);

  return (
    <div className="space-y-6">
      {/* Coin flipper interactive view */}
      {mode === 'coin-flip' ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md text-center flex flex-col items-center justify-center space-y-6">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 border-4 border-amber-500 shadow-xl flex items-center justify-center text-4xl font-black text-amber-950 font-serif">
            {coinFlips.history[0] || '?'}
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-xs text-center font-mono">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-xs text-slate-400 block">Heads (H)</span>
              <span className="text-xl font-bold text-amber-500">{coinFlips.heads}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-xs text-slate-400 block">Tails (T)</span>
              <span className="text-xl font-bold text-slate-700 dark:text-slate-300">{coinFlips.tails}</span>
            </div>
          </div>

          <button
            onClick={flipCoin}
            className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
          >
            Flip Coin!
          </button>
        </div>
      ) : mode === 'statistics' ? (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
            Enter Numbers (separated by commas or spaces):
          </label>
          <textarea
            value={datasetText}
            onChange={(e) => setDatasetText(e.target.value)}
            rows={3}
            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm focus:outline-none"
          />
        </div>
      ) : (
        /* Standard 2-3 Number inputs */
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">
                {mode === 'circle' ? 'Radius (r)' : mode === 'triangle' ? 'Base' : mode === 'ohms-law' ? 'Voltage (V)' : mode === 'rule-of-three' ? 'Value A' : 'Input A'}:
              </label>
              <input
                type="number"
                value={num1}
                onChange={(e) => setNum1(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold focus:outline-none"
              />
            </div>

            {mode !== 'circle' && mode !== 'sphere' && mode !== 'prime-check' && mode !== 'prime-factors' && mode !== 'fibonacci' && mode !== 'golden-ratio' && mode !== 'num-to-words' && (
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  {mode === 'triangle' ? 'Height' : mode === 'ohms-law' ? 'Current (I)' : mode === 'rule-of-three' ? 'Value B' : 'Input B'}:
                </label>
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold focus:outline-none"
                />
              </div>
            )}

            {(mode === 'quadratic' || mode === 'rule-of-three') && (
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  {mode === 'quadratic' ? 'Coefficient c' : 'Value C'}:
                </label>
                <input
                  type="number"
                  value={num3}
                  onChange={(e) => setNum3(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Cards */}
      {output && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
            {output.title}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {output.items.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <span className="text-xs text-slate-500 block">{item.label}</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5 block truncate">
                    {item.val}
                  </span>
                </div>
                <QuickCopy text={item.val} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
