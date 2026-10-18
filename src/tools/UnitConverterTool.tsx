import React, { useState, useMemo } from 'react';
import { UNIT_DIMENSIONS } from '../data/unitData';
import { QuickCopy } from '../components/QuickCopy';
import { ArrowRightLeft } from 'lucide-react';

interface UnitConverterToolProps {
  mode?: string;
}

export const UnitConverterTool: React.FC<UnitConverterToolProps> = ({ mode = 'length' }) => {
  const [currentDimensionId, setCurrentDimensionId] = useState(
    UNIT_DIMENSIONS[mode] ? mode : 'length'
  );

  const dimension = UNIT_DIMENSIONS[currentDimensionId] || UNIT_DIMENSIONS.length;

  const [fromUnit, setFromUnit] = useState(dimension.units[0].id);
  const [toUnit, setToUnit] = useState(dimension.units[1] ? dimension.units[1].id : dimension.units[0].id);
  const [fromValue, setFromValue] = useState<number>(1);

  // When dimension changes, reset unit selections
  const handleDimensionChange = (id: string) => {
    setCurrentDimensionId(id);
    const d = UNIT_DIMENSIONS[id];
    setFromUnit(d.units[0].id);
    setToUnit(d.units[1] ? d.units[1].id : d.units[0].id);
  };

  // Conversion logic (special casing temperature)
  const convertedValue = useMemo(() => {
    if (isNaN(fromValue)) return 0;

    if (currentDimensionId === 'temperature') {
      // Celsius base
      let celsius = fromValue;
      if (fromUnit === 'f') celsius = (fromValue - 32) * (5 / 9);
      else if (fromUnit === 'k') celsius = fromValue - 273.15;
      else if (fromUnit === 'r') celsius = (fromValue - 491.67) * (5 / 9);

      if (toUnit === 'c') return celsius;
      if (toUnit === 'f') return celsius * (9 / 5) + 32;
      if (toUnit === 'k') return celsius + 273.15;
      if (toUnit === 'r') return (celsius + 273.15) * (9 / 5);
      return celsius;
    }

    const uFrom = dimension.units.find(u => u.id === fromUnit);
    const uTo = dimension.units.find(u => u.id === toUnit);

    if (!uFrom || !uTo) return fromValue;

    // Convert to base unit then to target unit
    const baseValue = fromValue * uFrom.factor;
    const targetValue = baseValue / uTo.factor;
    return targetValue;
  }, [fromValue, fromUnit, toUnit, currentDimensionId, dimension]);

  // All conversions in dimension
  const allConversions = useMemo(() => {
    if (isNaN(fromValue)) return [];

    return dimension.units.map(u => {
      let val = 0;
      if (currentDimensionId === 'temperature') {
        let celsius = fromValue;
        if (fromUnit === 'f') celsius = (fromValue - 32) * (5 / 9);
        else if (fromUnit === 'k') celsius = fromValue - 273.15;
        else if (fromUnit === 'r') celsius = (fromValue - 491.67) * (5 / 9);

        if (u.id === 'c') val = celsius;
        else if (u.id === 'f') val = celsius * (9 / 5) + 32;
        else if (u.id === 'k') val = celsius + 273.15;
        else if (u.id === 'r') val = (celsius + 273.15) * (9 / 5);
      } else {
        const uFrom = dimension.units.find(item => item.id === fromUnit);
        if (uFrom) {
          const base = fromValue * uFrom.factor;
          val = base / u.factor;
        }
      }

      // Format nicely
      const formatted = Math.abs(val) < 0.0001 || Math.abs(val) > 10000000 ? val.toExponential(4) : parseFloat(val.toFixed(6)).toString();

      return {
        unit: u,
        value: formatted
      };
    });
  }, [fromValue, fromUnit, currentDimensionId, dimension]);

  return (
    <div className="space-y-6">
      {/* Category / Dimension selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {Object.values(UNIT_DIMENSIONS).map(d => (
          <button
            key={d.id}
            onClick={() => handleDimensionChange(d.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              currentDimensionId === d.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* Main Interactive Conversion Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* FROM */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              From
            </label>
            <input
              type="number"
              value={fromValue}
              onChange={(e) => setFromValue(parseFloat(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
            >
              {dimension.units.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* TO */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                To
              </label>
              <button
                type="button"
                onClick={() => {
                  const tmp = fromUnit;
                  setFromUnit(toUnit);
                  setToUnit(tmp);
                }}
                className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Swap Units</span>
              </button>
            </div>
            <div className="w-full px-4 py-3 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 font-mono text-xl font-bold text-indigo-600 dark:text-indigo-400 overflow-x-auto select-all flex items-center justify-between">
              <span>{parseFloat(convertedValue.toFixed(6)).toString()}</span>
              <QuickCopy text={parseFloat(convertedValue.toFixed(6)).toString()} size="sm" />
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
            >
              {dimension.units.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Complete Equivalent Conversion Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-4">
          All Equivalents in {dimension.name}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allConversions.map(item => (
            <div
              key={item.unit.id}
              className={`p-3 rounded-xl border flex items-center justify-between ${
                item.unit.id === toUnit
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60'
              }`}
            >
              <div className="min-w-0 pr-2">
                <span className="text-xs text-slate-500 block truncate">{item.unit.name}</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono truncate block mt-0.5">
                  {item.value}
                </span>
              </div>
              <QuickCopy text={item.value} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
