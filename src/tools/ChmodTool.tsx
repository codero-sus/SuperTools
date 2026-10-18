import React, { useState } from 'react';
import { QuickCopy } from '../components/QuickCopy';
import { Shield, Terminal } from 'lucide-react';

export const ChmodTool: React.FC = () => {
  // Permission state: [r, w, x]
  const [owner, setOwner] = useState({ r: true, w: true, x: true }); // 7
  const [group, setGroup] = useState({ r: true, w: false, x: true }); // 5
  const [other, setOther] = useState({ r: true, w: false, x: true }); // 5

  const calculateDigit = (p: { r: boolean; w: boolean; x: boolean }) => {
    return (p.r ? 4 : 0) + (p.w ? 2 : 0) + (p.x ? 1 : 0);
  };

  const calculateSymbolic = (p: { r: boolean; w: boolean; x: boolean }) => {
    return `${p.r ? 'r' : '-'}${p.w ? 'w' : '-'}${p.x ? 'x' : '-'}`;
  };

  const octal = `${calculateDigit(owner)}${calculateDigit(group)}${calculateDigit(other)}`;
  const symbolic = `-${calculateSymbolic(owner)}${calculateSymbolic(group)}${calculateSymbolic(other)}`;
  const chmodCommand = `chmod ${octal} <file>`;

  const applyPreset = (o: number, g: number, ot: number) => {
    const parse = (n: number) => ({
      r: (n & 4) !== 0,
      w: (n & 2) !== 0,
      x: (n & 1) !== 0
    });
    setOwner(parse(o));
    setGroup(parse(g));
    setOther(parse(ot));
  };

  return (
    <div className="space-y-6">
      {/* Octal & Symbolic Results Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Octal Mode
          </span>
          <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
            {octal}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Symbolic Notation
          </span>
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-200 font-mono tracking-wider">
            {symbolic}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Linux Command
          </span>
          <div className="flex items-center justify-between">
            <code className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {chmodCommand}
            </code>
            <QuickCopy text={chmodCommand} size="sm" />
          </div>
        </div>
      </div>

      {/* Permission Grid */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="grid grid-cols-3 gap-6">
          {/* Owner */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Owner (User)
            </h3>
            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={owner.r}
                onChange={(e) => setOwner({ ...owner, r: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Read (4)</span>
            </label>
            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={owner.w}
                onChange={(e) => setOwner({ ...owner, w: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Write (2)</span>
            </label>
            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={owner.x}
                onChange={(e) => setOwner({ ...owner, x: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Execute (1)</span>
            </label>
          </div>

          {/* Group */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Group
            </h3>
            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={group.r}
                onChange={(e) => setGroup({ ...group, r: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Read (4)</span>
            </label>
            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={group.w}
                onChange={(e) => setGroup({ ...group, w: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Write (2)</span>
            </label>
            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={group.x}
                onChange={(e) => setGroup({ ...group, x: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Execute (1)</span>
            </label>
          </div>

          {/* Other / Public */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Public (Others)
            </h3>
            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={other.r}
                onChange={(e) => setOther({ ...other, r: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Read (4)</span>
            </label>
            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={other.w}
                onChange={(e) => setOther({ ...other, w: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Write (2)</span>
            </label>
            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={other.x}
                onChange={(e) => setOther({ ...other, x: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Execute (1)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Common Presets */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Standard Permission Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '755 (Standard Web Executable / Dir)', o: 7, g: 5, ot: 5 },
            { label: '644 (Standard Web File / HTML / CSS)', o: 6, g: 4, ot: 4 },
            { label: '700 (Private Executable / SSH dir)', o: 7, g: 0, ot: 0 },
            { label: '600 (Private SSH Key / Config)', o: 6, g: 0, ot: 0 },
            { label: '777 (Full Read/Write/Exec to all)', o: 7, g: 7, ot: 7 }
          ].map(p => (
            <button
              key={p.label}
              onClick={() => applyPreset(p.o, p.g, p.ot)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
