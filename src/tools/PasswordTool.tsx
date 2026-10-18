import React, { useState, useEffect } from 'react';
import { QuickCopy } from '../components/QuickCopy';
import { RefreshCw, Lock, ShieldCheck, ShieldAlert } from 'lucide-react';

interface PasswordToolProps {
  mode?: string;
}

export const PasswordTool: React.FC<PasswordToolProps> = ({ mode = 'password' }) => {
  const isPin = mode === 'pin-generator' || mode === 'pin';
  const isPassphrase = mode === 'passphrase-generator' || mode === 'passphrase';

  const [length, setLength] = useState(isPin ? 6 : 16);
  const [includeUpper, setIncludeUpper] = useState(!isPin);
  const [includeLower, setIncludeLower] = useState(!isPin);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(!isPin);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [batchCount, setBatchCount] = useState(1);

  const generateSinglePassword = () => {
    let chars = '';
    if (includeUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()-_=+[]{}|;:,.<>?';

    if (excludeAmbiguous) {
      chars = chars.replace(/[0O1lI]/g, '');
    }

    if (!chars) return 'Please select at least one character set.';

    const values = new Uint32Array(length);
    crypto.getRandomValues(values);
    let pwd = '';
    for (let i = 0; i < length; i++) {
      pwd += chars[values[i] % chars.length];
    }
    return pwd;
  };

  const generatePasswords = () => {
    const arr: string[] = [];
    for (let i = 0; i < batchCount; i++) {
      arr.push(generateSinglePassword());
    }
    return arr;
  };

  const [passwords, setPasswords] = useState<string[]>(generatePasswords());

  useEffect(() => {
    setPasswords(generatePasswords());
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous, batchCount]);

  // Calculate Shannon entropy bits: L * log2(N)
  const poolSize = (includeUpper ? 26 : 0) + (includeLower ? 26 : 0) + (includeNumbers ? 10 : 0) + (includeSymbols ? 28 : 0);
  const entropyBits = poolSize > 0 ? Math.round(length * (Math.log(poolSize) / Math.LN2)) : 0;

  return (
    <div className="space-y-6">
      {/* Primary Password Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Lock className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-wide break-all select-all">
              {passwords[0]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setPasswords(generatePasswords())}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Generate fresh password"
          >
            <RefreshCw className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <QuickCopy text={passwords[0]} label="Copy Password" />
        </div>
      </div>

      {/* Entropy & Strength Meter */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {entropyBits >= 64 ? (
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          )}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Strength Entropy: <span className="text-indigo-600 font-bold">{entropyBits} bits</span>
          </span>
          <span className="text-slate-400">
            ({entropyBits >= 80 ? 'Very Strong' : entropyBits >= 60 ? 'Strong' : 'Moderate'})
          </span>
        </div>
        <span className="text-slate-400">Pool Size: {poolSize} characters</span>
      </div>

      {/* Options */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password Length:</span>
            <span className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">{length} characters</span>
          </div>
          <input
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => setIncludeUpper(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Uppercase (A-Z)</span>
          </label>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={includeLower}
              onChange={(e) => setIncludeLower(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Lowercase (a-z)</span>
          </label>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Numbers (0-9)</span>
          </label>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Symbols (!@#$...)</span>
          </label>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Exclude Ambiguous (0, O, 1, l)</span>
          </label>
        </div>
      </div>
    </div>
  );
};
