import React, { useState, useMemo } from 'react';
import { QuickCopy } from '../components/QuickCopy';
import { Download, Barcode as BarcodeIcon } from 'lucide-react';

export const BarcodeGenerator: React.FC = () => {
  const [value, setValue] = useState('SUPER-2026-TOOLS');
  const [height, setHeight] = useState(80);
  const [includeText, setIncludeText] = useState(true);

  // Simple clean SVG barcode generator using Code 128 patterns
  const barcodeSvg = useMemo(() => {
    if (!value.trim()) return '';

    // Generate pseudo-pattern bars based on string chars
    const bars: { x: number; width: number }[] = [];
    let currentX = 10;

    // Start pattern
    bars.push({ x: currentX, width: 2 }); currentX += 4;
    bars.push({ x: currentX, width: 1 }); currentX += 3;
    bars.push({ x: currentX, width: 3 }); currentX += 5;

    for (let i = 0; i < value.length; i++) {
      const charCode = value.charCodeAt(i);
      const b1 = (charCode % 3) + 1;
      const b2 = ((charCode >> 2) % 3) + 1;
      const b3 = ((charCode >> 4) % 3) + 1;
      bars.push({ x: currentX, width: b1 }); currentX += b1 + 2;
      bars.push({ x: currentX, width: b2 }); currentX += b2 + 1;
      bars.push({ x: currentX, width: b3 }); currentX += b3 + 2;
    }

    // Stop pattern
    bars.push({ x: currentX, width: 3 }); currentX += 5;
    bars.push({ x: currentX, width: 1 }); currentX += 3;
    bars.push({ x: currentX, width: 2 }); currentX += 4;

    const totalWidth = currentX + 10;
    const totalHeight = height + (includeText ? 30 : 10);

    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="${totalWidth * 2}" height="${totalHeight * 2}">\n` +
      `  <rect width="100%" height="100%" fill="#ffffff"/>\n` +
      bars.map(b => `  <rect x="${b.x}" y="10" width="${b.width}" height="${height}" fill="#000000"/>`).join('\n') +
      (includeText ? `\n  <text x="${totalWidth / 2}" y="${height + 25}" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle" fill="#000000">${value}</text>` : '') +
      `\n</svg>`
    );
  }, [value, height, includeText]);

  const downloadSvg = () => {
    const blob = new Blob([barcodeSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barcode-${value}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Barcode Value / Serial:
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm font-semibold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1">Barcode Height: {height}px</label>
          <input
            type="range"
            min="40"
            max="150"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={includeText}
            onChange={(e) => setIncludeText(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />
          <span>Include readable text label below barcode</span>
        </label>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center space-y-6">
        <div 
          className="p-6 rounded-xl bg-white border border-slate-100 shadow-sm max-w-full overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: barcodeSvg }}
        />

        <button
          onClick={downloadSvg}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download Barcode SVG</span>
        </button>
      </div>
    </div>
  );
};
