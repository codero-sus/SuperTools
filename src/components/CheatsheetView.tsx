import React, { useState, useMemo } from 'react';
import { CHEATSHEETS, CheatsheetSection, CheatsheetItem } from '../data/cheatsheetsData';
import { QuickCopy } from './QuickCopy';
import { Search } from 'lucide-react';

interface CheatsheetViewProps {
  sheetId?: string;
  onSelectSheet?: (id: string) => void;
}

export const CheatsheetView: React.FC<CheatsheetViewProps> = ({ sheetId = 'git', onSelectSheet }) => {
  const [selectedId, setSelectedId] = useState(sheetId);
  const [search, setSearch] = useState('');

  const sheetEntries = useMemo(() => {
    return Object.entries(CHEATSHEETS).map(([key, data]) => ({
      id: key,
      ...data
    }));
  }, []);

  const activeSheet = useMemo(() => {
    return CHEATSHEETS[selectedId] || CHEATSHEETS['git'] || sheetEntries[0];
  }, [selectedId, sheetEntries]);

  const filteredSections = useMemo(() => {
    if (!search.trim()) return activeSheet.sections;
    const q = search.toLowerCase();
    return activeSheet.sections.map((sec: CheatsheetSection) => {
      const matchingItems = sec.items.filter((item: CheatsheetItem) =>
        item.title.toLowerCase().includes(q) ||
        (item.code && item.code.toLowerCase().includes(q)) ||
        item.desc.toLowerCase().includes(q)
      );
      return {
        ...sec,
        items: matchingItems
      };
    }).filter((sec: CheatsheetSection) => sec.items.length > 0);
  }, [activeSheet, search]);

  return (
    <div className="space-y-6">
      {/* Cheatsheet Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {sheetEntries.map(sheet => (
          <button
            key={sheet.id}
            onClick={() => {
              setSelectedId(sheet.id);
              if (onSelectSheet) onSelectSheet(sheet.id);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedId === sheet.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80'
            }`}
          >
            {sheet.title}
          </button>
        ))}
      </div>

      {/* Sheet Details & Search */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {activeSheet.title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeSheet.subtitle}
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Filter ${activeSheet.title}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
          />
        </div>
      </div>

      {/* Cheatsheet Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSections.map((section: CheatsheetSection, sIdx: number) => (
          <div
            key={sIdx}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
          >
            <h3 className="font-bold text-sm uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              {section.sectionTitle}
            </h3>

            <div className="space-y-2.5">
              {section.items.map((item: CheatsheetItem, iIdx: number) => (
                <div
                  key={iIdx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 group hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      {item.title}
                    </span>
                    {item.code && (
                      <code className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40 px-2 py-0.5 rounded mt-1 inline-block break-all">
                        {item.code}
                      </code>
                    )}
                    {item.desc && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                        {item.desc}
                      </span>
                    )}
                  </div>
                  {item.code && <QuickCopy text={item.code} size="sm" />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
