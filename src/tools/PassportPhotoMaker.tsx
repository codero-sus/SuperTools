import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, ZoomIn, ZoomOut, RotateCcw, Printer, Sparkles, UserCheck, Move } from 'lucide-react';

interface PassportStandard {
  id: string;
  name: string;
  country: string;
  widthMm: number;
  heightMm: number;
  widthPx: number; // at 300 DPI
  heightPx: number;
  bgDefault: string;
}

const PASSPORT_STANDARDS: PassportStandard[] = [
  { id: 'us', name: 'US Passport & Visa (2x2")', country: 'United States', widthMm: 51, heightMm: 51, widthPx: 600, heightPx: 600, bgDefault: '#ffffff' },
  { id: 'uk_eu', name: 'UK & Schengen Europe (35x45mm)', country: 'UK / EU / Schengen', widthMm: 35, heightMm: 45, widthPx: 413, heightPx: 531, bgDefault: '#ffffff' },
  { id: 'in', name: 'India Passport & Visa (3.5x4.5cm)', country: 'India', widthMm: 35, heightMm: 45, widthPx: 413, heightPx: 531, bgDefault: '#ffffff' },
  { id: 'ca', name: 'Canada Passport (50x70mm)', country: 'Canada', widthMm: 50, heightMm: 70, widthPx: 590, heightPx: 826, bgDefault: '#ffffff' },
  { id: 'cn', name: 'China Passport (33x48mm)', country: 'China', widthMm: 33, heightMm: 48, widthPx: 390, heightPx: 567, bgDefault: '#ffffff' },
  { id: 'au', name: 'Australia Passport (35x45mm)', country: 'Australia', widthMm: 35, heightMm: 45, widthPx: 413, heightPx: 531, bgDefault: '#ffffff' }
];

export const PassportPhotoMaker: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<PassportStandard>(PASSPORT_STANDARDS[0]);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [removeBg, setRemoveBg] = useState<boolean>(false);
  const [bgTolerance, setBgTolerance] = useState<number>(25);

  // Transform controls
  const [zoom, setZoom] = useState<number>(1.0);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);

  const [tiledPrintSheet, setTiledPrintSheet] = useState<boolean>(false);

  const singleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setImageSrc(src);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          imageObjRef.current = img;
          setZoom(1.0);
          setPanX(0);
          setPanY(0);
          setRotation(0);
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    }
  };

  const drawPhoto = () => {
    if (!singleCanvasRef.current || !imageObjRef.current) return;
    const canvas = singleCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const targetW = selectedStandard.widthPx;
    const targetH = selectedStandard.heightPx;
    canvas.width = targetW;
    canvas.height = targetH;

    // Background fill
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, targetW, targetH);

    const img = imageObjRef.current;

    // Draw user image centered with zoom, pan, and rotation
    ctx.save();
    ctx.translate(targetW / 2 + panX, targetH / 2 + panY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Maintain aspect ratio while covering target area
    const scale = Math.max(targetW / img.width, targetH / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // Optional background keying if active
    if (removeBg) {
      const imgData = ctx.getImageData(0, 0, targetW, targetH);
      const data = imgData.data;
      // sample top left pixel
      const tr = data[0];
      const tg = data[1];
      const tb = data[2];
      const tolSq = (bgTolerance * 2.55) ** 2;

      // Replace keyed background with selected passport bgColor
      const hexToRgb = (hex: string) => {
        const n = parseInt(hex.replace('#', ''), 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
      };
      const [nr, ng, nb] = hexToRgb(bgColor);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const distSq = (r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2;
        if (distSq <= tolSq) {
          data[i] = nr;
          data[i + 1] = ng;
          data[i + 2] = nb;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }
  };

  useEffect(() => {
    if (imageSrc) {
      drawPhoto();
    }
  }, [imageSrc, selectedStandard, bgColor, removeBg, bgTolerance, zoom, panX, panY, rotation]);

  const downloadSinglePhoto = () => {
    if (!singleCanvasRef.current) return;
    const link = document.createElement('a');
    link.download = `passport-photo-${selectedStandard.id}.jpg`;
    link.href = singleCanvasRef.current.toDataURL('image/jpeg', 0.95);
    link.click();
  };

  const downloadPrintableSheet = () => {
    if (!singleCanvasRef.current) return;
    // Standard 4x6 inch photo paper at 300 DPI = 1200 x 1800 px
    const sheetCanvas = document.createElement('canvas');
    sheetCanvas.width = 1800; // 6 inches
    sheetCanvas.height = 1200; // 4 inches
    const ctx = sheetCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);

    const singleW = singleCanvasRef.current.width;
    const singleH = singleCanvasRef.current.height;

    // Tile 6 photos (2 rows of 3, or 2 rows of 2 for 2x2")
    const cols = selectedStandard.id === 'us' ? 2 : 3;
    const rows = 2;
    const gapX = 60;
    const gapY = 60;

    const startX = (sheetCanvas.width - (cols * singleW + (cols - 1) * gapX)) / 2;
    const startY = (sheetCanvas.height - (rows * singleH + (rows - 1) * gapY)) / 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * (singleW + gapX);
        const y = startY + r * (singleH + gapY);

        // Draw thin cut guide line around photo
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 1, y - 1, singleW + 2, singleH + 2);

        ctx.drawImage(singleCanvasRef.current, x, y, singleW, singleH);
      }
    }

    const link = document.createElement('a');
    link.download = `passport-4x6-print-sheet.jpg`;
    link.href = sheetCanvas.toDataURL('image/jpeg', 0.98);
    link.click();
  };

  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <div className="p-12 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
            <UserCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">
              Create Official Passport & Visa Photos in Seconds
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Preset country sizes (US 2x2", UK/Schengen 35x45mm, India, etc.), background replacement, biometric guide, and printable 4x6" tiling.
            </p>
          </div>
          <label className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm cursor-pointer shadow-md transition-all">
            Choose Portrait Photo
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Canvas & Biometric Guide Overlay */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col items-center justify-center min-h-[460px] relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700">
              <canvas ref={singleCanvasRef} className="max-h-[420px] max-w-full block" />

              {/* Biometric Oval Guide Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center border-2 border-dashed border-indigo-400/30 rounded-2xl">
                <div className="w-3/5 h-4/5 rounded-full border-2 border-indigo-500/40 relative flex items-center justify-center">
                  {/* Eye line guide */}
                  <div className="absolute top-[38%] left-0 right-0 border-b border-indigo-400/40" />
                  {/* Chin guide */}
                  <div className="absolute bottom-[10%] left-1/4 right-1/4 border-b border-indigo-400/40" />
                </div>
              </div>
            </div>

            <span className="text-[11px] text-slate-400 mt-3 font-medium">
              Biometric guide: Align eyes with upper line and chin with bottom curve.
            </span>
          </div>

          {/* Controls */}
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-5 shadow-sm">
            {/* Standard Country Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">
                Country & Photo Standard:
              </label>
              <select
                value={selectedStandard.id}
                onChange={(e) => {
                  const s = PASSPORT_STANDARDS.find(x => x.id === e.target.value);
                  if (s) setSelectedStandard(s);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs"
              >
                {PASSPORT_STANDARDS.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.widthMm}x{s.heightMm}mm)
                  </option>
                ))}
              </select>
            </div>

            {/* Background Color */}
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">
                Background Color:
              </label>
              <div className="flex items-center gap-2">
                {[
                  { name: 'White', hex: '#ffffff' },
                  { name: 'Light Blue', hex: '#dbeafe' },
                  { name: 'Light Gray', hex: '#f1f5f9' },
                  { name: 'Red', hex: '#fee2e2' }
                ].map(c => (
                  <button
                    key={c.hex}
                    onClick={() => setBgColor(c.hex)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      bgColor === c.hex
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    <span className="text-slate-800 text-[11px]">{c.name}</span>
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-2 mt-2 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={removeBg}
                  onChange={(e) => setRemoveBg(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                Auto Replace Existing Background
              </label>
            </div>

            {/* Zoom, Pan, Rotate sliders */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                  <span>Zoom / Scale</span>
                  <span className="font-mono">{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                  <span>Position Vertical (Y)</span>
                  <span className="font-mono">{panY}px</span>
                </div>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  value={panY}
                  onChange={(e) => setPanY(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                  <span>Position Horizontal (X)</span>
                  <span className="font-mono">{panX}px</span>
                </div>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  value={panX}
                  onChange={(e) => setPanX(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                onClick={downloadSinglePhoto}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                Download Single Photo (300 DPI)
              </button>

              <button
                onClick={downloadPrintableSheet}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Printer className="w-4 h-4" />
                Download 4×6" Printable Sheet (6 Photos)
              </button>

              <label className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center cursor-pointer transition-colors">
                Change Portrait
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
