import React, { useState, useMemo } from 'react';
import { QuickCopy } from '../components/QuickCopy';
import { ArrowRightLeft } from 'lucide-react';

interface QuickUnitToolProps {
  mode?: string;
}

export const QuickUnitTool: React.FC<QuickUnitToolProps> = ({ mode = 'celsius-to-fahrenheit' }) => {
  const [val, setVal] = useState<number>(100);
  const [reversed, setReversed] = useState(false);

  const config = useMemo(() => {
    switch (mode) {
      case 'celsius-to-fahrenheit':
        return {
          fromLabel: 'Celsius (°C)',
          toLabel: 'Fahrenheit (°F)',
          formula: (v: number) => v * (9 / 5) + 32,
          revFormula: (v: number) => (v - 32) * (5 / 9),
          symbol: '°F'
        };
      case 'fahrenheit-to-celsius':
        return {
          fromLabel: 'Fahrenheit (°F)',
          toLabel: 'Celsius (°C)',
          formula: (v: number) => (v - 32) * (5 / 9),
          revFormula: (v: number) => v * (9 / 5) + 32,
          symbol: '°C'
        };
      case 'celsius-to-kelvin':
        return {
          fromLabel: 'Celsius (°C)',
          toLabel: 'Kelvin (K)',
          formula: (v: number) => v + 273.15,
          revFormula: (v: number) => v - 273.15,
          symbol: 'K'
        };
      case 'kelvin-to-celsius':
        return {
          fromLabel: 'Kelvin (K)',
          toLabel: 'Celsius (°C)',
          formula: (v: number) => v - 273.15,
          revFormula: (v: number) => v + 273.15,
          symbol: '°C'
        };
      case 'fahrenheit-to-kelvin':
        return {
          fromLabel: 'Fahrenheit (°F)',
          toLabel: 'Kelvin (K)',
          formula: (v: number) => (v - 32) * (5 / 9) + 273.15,
          revFormula: (v: number) => (v - 273.15) * (9 / 5) + 32,
          symbol: 'K'
        };
      case 'meters-to-feet':
        return {
          fromLabel: 'Meters (m)',
          toLabel: 'Feet (ft)',
          formula: (v: number) => v * 3.28084,
          revFormula: (v: number) => v / 3.28084,
          symbol: 'ft'
        };
      case 'feet-to-meters':
        return {
          fromLabel: 'Feet (ft)',
          toLabel: 'Meters (m)',
          formula: (v: number) => v * 0.3048,
          revFormula: (v: number) => v / 0.3048,
          symbol: 'm'
        };
      case 'km-to-miles':
        return {
          fromLabel: 'Kilometers (km)',
          toLabel: 'Miles (mi)',
          formula: (v: number) => v * 0.621371,
          revFormula: (v: number) => v / 0.621371,
          symbol: 'mi'
        };
      case 'miles-to-km':
        return {
          fromLabel: 'Miles (mi)',
          toLabel: 'Kilometers (km)',
          formula: (v: number) => v * 1.60934,
          revFormula: (v: number) => v / 1.60934,
          symbol: 'km'
        };
      case 'cm-to-inches':
        return {
          fromLabel: 'Centimeters (cm)',
          toLabel: 'Inches (in)',
          formula: (v: number) => v / 2.54,
          revFormula: (v: number) => v * 2.54,
          symbol: 'in'
        };
      case 'inches-to-cm':
        return {
          fromLabel: 'Inches (in)',
          toLabel: 'Centimeters (cm)',
          formula: (v: number) => v * 2.54,
          revFormula: (v: number) => v / 2.54,
          symbol: 'cm'
        };
      case 'mm-to-inches':
        return {
          fromLabel: 'Millimeters (mm)',
          toLabel: 'Inches (in)',
          formula: (v: number) => v / 25.4,
          revFormula: (v: number) => v * 25.4,
          symbol: 'in'
        };
      case 'inches-to-mm':
        return {
          fromLabel: 'Inches (in)',
          toLabel: 'Millimeters (mm)',
          formula: (v: number) => v * 25.4,
          revFormula: (v: number) => v / 25.4,
          symbol: 'mm'
        };
      case 'yards-to-meters':
        return {
          fromLabel: 'Yards (yd)',
          toLabel: 'Meters (m)',
          formula: (v: number) => v * 0.9144,
          revFormula: (v: number) => v / 0.9144,
          symbol: 'm'
        };
      case 'meters-to-yards':
        return {
          fromLabel: 'Meters (m)',
          toLabel: 'Yards (yd)',
          formula: (v: number) => v * 1.09361,
          revFormula: (v: number) => v / 1.09361,
          symbol: 'yd'
        };
      case 'feet-to-inches':
        return {
          fromLabel: 'Feet (ft)',
          toLabel: 'Inches (in)',
          formula: (v: number) => v * 12,
          revFormula: (v: number) => v / 12,
          symbol: 'in'
        };
      case 'inches-to-feet':
        return {
          fromLabel: 'Inches (in)',
          toLabel: 'Feet (ft)',
          formula: (v: number) => v / 12,
          revFormula: (v: number) => v * 12,
          symbol: 'ft'
        };
      case 'yards-to-feet':
        return {
          fromLabel: 'Yards (yd)',
          toLabel: 'Feet (ft)',
          formula: (v: number) => v * 3,
          revFormula: (v: number) => v / 3,
          symbol: 'ft'
        };
      case 'feet-to-yards':
        return {
          fromLabel: 'Feet (ft)',
          toLabel: 'Yards (yd)',
          formula: (v: number) => v / 3,
          revFormula: (v: number) => v * 3,
          symbol: 'yd'
        };
      case 'kg-to-lbs':
        return {
          fromLabel: 'Kilograms (kg)',
          toLabel: 'Pounds (lbs)',
          formula: (v: number) => v * 2.20462,
          revFormula: (v: number) => v / 2.20462,
          symbol: 'lbs'
        };
      case 'lbs-to-kg':
        return {
          fromLabel: 'Pounds (lbs)',
          toLabel: 'Kilograms (kg)',
          formula: (v: number) => v / 2.20462,
          revFormula: (v: number) => v * 2.20462,
          symbol: 'kg'
        };
      case 'grams-to-ounces':
        return {
          fromLabel: 'Grams (g)',
          toLabel: 'Ounces (oz)',
          formula: (v: number) => v / 28.3495,
          revFormula: (v: number) => v * 28.3495,
          symbol: 'oz'
        };
      case 'ounces-to-grams':
        return {
          fromLabel: 'Ounces (oz)',
          toLabel: 'Grams (g)',
          formula: (v: number) => v * 28.3495,
          revFormula: (v: number) => v / 28.3495,
          symbol: 'g'
        };
      case 'kg-to-stones':
        return {
          fromLabel: 'Kilograms (kg)',
          toLabel: 'Stones (st)',
          formula: (v: number) => v / 6.35029,
          revFormula: (v: number) => v * 6.35029,
          symbol: 'st'
        };
      case 'stones-to-kg':
        return {
          fromLabel: 'Stones (st)',
          toLabel: 'Kilograms (kg)',
          formula: (v: number) => v * 6.35029,
          revFormula: (v: number) => v / 6.35029,
          symbol: 'kg'
        };
      case 'liters-to-gallons':
        return {
          fromLabel: 'Liters (L)',
          toLabel: 'Gallons (US gal)',
          formula: (v: number) => v * 0.264172,
          revFormula: (v: number) => v / 0.264172,
          symbol: 'gal'
        };
      case 'gallons-to-liters':
        return {
          fromLabel: 'Gallons (US gal)',
          toLabel: 'Liters (L)',
          formula: (v: number) => v * 3.78541,
          revFormula: (v: number) => v / 3.78541,
          symbol: 'L'
        };
      case 'mb-to-gb':
        return {
          fromLabel: 'Megabytes (MB)',
          toLabel: 'Gigabytes (GB)',
          formula: (v: number) => v / 1000,
          revFormula: (v: number) => v * 1000,
          symbol: 'GB'
        };
      case 'gb-to-tb':
        return {
          fromLabel: 'Gigabytes (GB)',
          toLabel: 'Terabytes (TB)',
          formula: (v: number) => v / 1000,
          revFormula: (v: number) => v * 1000,
          symbol: 'TB'
        };
      case 'bytes-to-kb':
        return {
          fromLabel: 'Bytes (B)',
          toLabel: 'Kilobytes (KB)',
          formula: (v: number) => v / 1000,
          revFormula: (v: number) => v * 1000,
          symbol: 'KB'
        };
      case 'bits-to-bytes':
        return {
          fromLabel: 'Bits (b)',
          toLabel: 'Bytes (B)',
          formula: (v: number) => v / 8,
          revFormula: (v: number) => v * 8,
          symbol: 'B'
        };
      case 'bar-to-psi':
        return {
          fromLabel: 'Bar',
          toLabel: 'PSI',
          formula: (v: number) => v * 14.5038,
          revFormula: (v: number) => v / 14.5038,
          symbol: 'psi'
        };
      case 'psi-to-bar':
        return {
          fromLabel: 'PSI',
          toLabel: 'Bar',
          formula: (v: number) => v / 14.5038,
          revFormula: (v: number) => v * 14.5038,
          symbol: 'bar'
        };
      case 'atm-to-psi':
        return {
          fromLabel: 'Atmospheres (atm)',
          toLabel: 'PSI',
          formula: (v: number) => v * 14.6959,
          revFormula: (v: number) => v / 14.6959,
          symbol: 'psi'
        };
      case 'psi-to-atm':
        return {
          fromLabel: 'PSI',
          toLabel: 'Atmospheres (atm)',
          formula: (v: number) => v / 14.6959,
          revFormula: (v: number) => v * 14.6959,
          symbol: 'atm'
        };
      case 'kw-to-hp':
        return {
          fromLabel: 'Kilowatts (kW)',
          toLabel: 'Horsepower (HP)',
          formula: (v: number) => v * 1.34102,
          revFormula: (v: number) => v / 1.34102,
          symbol: 'HP'
        };
      case 'hp-to-kw':
        return {
          fromLabel: 'Horsepower (HP)',
          toLabel: 'Kilowatts (kW)',
          formula: (v: number) => v / 1.34102,
          revFormula: (v: number) => v * 1.34102,
          symbol: 'kW'
        };
      case 'degrees-to-radians':
        return {
          fromLabel: 'Degrees (°)',
          toLabel: 'Radians (rad)',
          formula: (v: number) => v * (Math.PI / 180),
          revFormula: (v: number) => v * (180 / Math.PI),
          symbol: 'rad'
        };
      case 'radians-to-degrees':
        return {
          fromLabel: 'Radians (rad)',
          toLabel: 'Degrees (°)',
          formula: (v: number) => v * (180 / Math.PI),
          revFormula: (v: number) => v * (Math.PI / 180),
          symbol: '°'
        };
      default:
        return {
          fromLabel: 'Input Value',
          toLabel: 'Output Value',
          formula: (v: number) => v,
          revFormula: (v: number) => v,
          symbol: ''
        };
    }
  }, [mode]);

  const outputVal = useMemo(() => {
    if (isNaN(val)) return 0;
    const res = reversed ? config.revFormula(val) : config.formula(val);
    return parseFloat(res.toFixed(6));
  }, [val, reversed, config]);

  const fromLabel = reversed ? config.toLabel : config.fromLabel;
  const toLabel = reversed ? config.fromLabel : config.toLabel;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Quick Converter
          </span>
          <button
            onClick={() => setReversed(!reversed)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Swap Direction</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              {fromLabel}:
            </label>
            <input
              type="number"
              value={val}
              onChange={(e) => setVal(parseFloat(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-2xl font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block">
                {toLabel}:
              </label>
              <QuickCopy text={outputVal.toString()} size="sm" />
            </div>
            <div className="w-full px-4 py-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 font-mono text-2xl font-black text-indigo-600 dark:text-indigo-400 overflow-x-auto select-all">
              {outputVal}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
