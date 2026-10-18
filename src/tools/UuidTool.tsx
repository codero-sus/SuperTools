import React, { useState, useMemo } from 'react';
import { QuickCopy } from '../components/QuickCopy';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface UuidToolProps {
  mode?: string;
}

export const UuidTool: React.FC<UuidToolProps> = ({ mode = 'v4' }) => {
  const [version, setVersion] = useState<'v4' | 'v1' | 'v7' | 'nanoid'>(
    mode === 'v1' ? 'v1' : mode === 'v7' ? 'v7' : mode === 'nanoid' ? 'nanoid' : 'v4'
  );
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [validateInput, setValidateInput] = useState('c56a4180-65aa-42ec-a945-5fd21dec0538');

  const generateUuidV4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const generateUuidV1 = () => {
    const now = Date.now();
    const timeHex = now.toString(16).padStart(12, '0');
    return `${timeHex.slice(4)}-${timeHex.slice(0, 4)}-1xxx-8xxx-xxxxxxxxxxxx`.replace(/[x]/g, () =>
      ((Math.random() * 16) | 0).toString(16)
    );
  };

  const generateUuidV7 = () => {
    const value = new Uint8Array(16);
    crypto.getRandomValues(value);
    const timestamp = Date.now();
    value[0] = (timestamp >> 40) & 0xff;
    value[1] = (timestamp >> 32) & 0xff;
    value[2] = (timestamp >> 24) & 0xff;
    value[3] = (timestamp >> 16) & 0xff;
    value[4] = (timestamp >> 8) & 0xff;
    value[5] = timestamp & 0xff;
    value[6] = (value[6] & 0x0f) | 0x70; // version 7
    value[8] = (value[8] & 0x3f) | 0x80; // variant
    const hex = Array.from(value, b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  };

  const generateNanoId = (len: number = 21) => {
    const alphabet = 'useandom-26T1983_40PX75pxJACKVERYMINDBUSHWOLFGQZbfghjklqvwyzrict';
    let id = '';
    const bytes = new Uint8Array(len);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < len; i++) {
      id += alphabet[bytes[i] & 63];
    }
    return id;
  };

  const generateIds = () => {
    const arr: string[] = [];
    for (let i = 0; i < count; i++) {
      let id = '';
      if (version === 'v4') id = generateUuidV4();
      else if (version === 'v1') id = generateUuidV1();
      else if (version === 'v7') id = generateUuidV7();
      else id = generateNanoId();

      if (version !== 'nanoid' && !hyphens) id = id.replace(/-/g, '');
      if (uppercase) id = id.toUpperCase();
      arr.push(id);
    }
    return arr;
  };

  const [ids, setIds] = useState<string[]>(generateIds());

  const handleRegenerate = () => {
    setIds(generateIds());
  };

  // Validator logic
  const validation = useMemo(() => {
    const trimmed = validateInput.trim();
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-([1-8])[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const match = trimmed.match(regex);
    if (match) {
      return {
        valid: true,
        version: match[1],
        message: `Valid RFC 4122 UUID Version ${match[1]}`
      };
    }
    return {
      valid: false,
      message: 'Invalid UUID format.'
    };
  }, [validateInput]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Format:</span>
            <div className="inline-flex rounded-lg p-1 bg-slate-100 dark:bg-slate-800">
              {(['v4', 'v7', 'v1', 'nanoid'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => { setVersion(v); setIds(generateIds()); }}
                  className={`px-3 py-1 text-xs font-semibold rounded-md uppercase transition-all ${
                    version === v
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Count:</span>
              <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                className="w-16 px-2.5 py-1 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Uppercase</span>
            </label>

            {version !== 'nanoid' && (
              <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={hyphens}
                  onChange={(e) => setHyphens(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Hyphens</span>
              </label>
            )}

            <button
              onClick={handleRegenerate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Generate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Generated IDs Output List */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Generated Identifiers ({ids.length})
          </span>
          <QuickCopy text={ids.join('\n')} label="Copy All IDs" />
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {ids.map((id, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-400 transition-colors"
            >
              <span className="font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 select-all">
                {id}
              </span>
              <QuickCopy text={id} size="sm" />
            </div>
          ))}
        </div>
      </div>

      {/* UUID Validator Section */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
          Validate Existing UUID:
        </span>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={validateInput}
            onChange={(e) => setValidateInput(e.target.value)}
            placeholder="Paste UUID to validate..."
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm focus:outline-none"
          />
          <div className="shrink-0">
            {validation.valid ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{validation.message}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 text-xs font-semibold">
                <AlertCircle className="w-4 h-4" />
                <span>{validation.message}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
