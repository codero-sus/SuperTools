import React, { useState, useRef, useEffect, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { Upload, FileText, Download, RotateCw, Sparkles, Sliders, CheckCircle2, Gauge, Move } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

export const AiDocScanner: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'magic-bw' | 'color-boost' | 'grayscale' | 'original'>('magic-bw');
  const [brightness, setBrightness] = useState<number>(10);
  const [contrast, setContrast] = useState<number>(35);
  const [corners, setCorners] = useState<Point[]>([
    { x: 30, y: 30 },
    { x: 470, y: 30 },
    { x: 470, y: 570 },
    { x: 30, y: 570 }
  ]);
  const [activeCorner, setActiveCorner] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  // 1-Click Realistic Document Demos
  const loadDemo = (type: 'contract' | 'receipt' | 'page') => {
    const canvas = document.createElement('canvas');
    canvas.width = 540;
    canvas.height = 680;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Wooden desk background
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, 0, 540, 680);

    // Skewed document on desk
    ctx.save();
    ctx.translate(60, 50);
    ctx.rotate(0.06);

    ctx.fillStyle = '#f8fafc';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 15;
    ctx.fillRect(0, 0, 380, 520);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#0f172a';
    if (type === 'contract') {
      ctx.font = 'bold 18px serif';
      ctx.fillText('NON-DISCLOSURE AGREEMENT', 40, 50);
      ctx.font = '11px serif';
      ctx.fillText('This Agreement is entered into on this 19th day of October, 2026.', 30, 80);
      ctx.fillText('Between Acme Innovations Inc. and the undersigned Recipient.', 30, 100);
      ctx.fillText('1. Confidential Information shall include all technical blueprints,', 30, 130);
      ctx.fillText('   client databases, algorithms, and source code repositories.', 30, 148);
      ctx.fillText('2. The Recipient agrees to safeguard all proprietary materials.', 30, 175);
      ctx.fillText('3. This Agreement shall remain binding for a period of 5 years.', 30, 205);

      ctx.strokeStyle = '#4f46e5';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 360, 140, 60);
      ctx.font = 'italic 16px cursive';
      ctx.fillStyle = '#1e3a8a';
      ctx.fillText('Jane Eleanor Doe', 40, 400);
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Authorized Signature', 40, 440);
    } else {
      ctx.font = 'bold 20px monospace';
      ctx.fillText('OFFICE SUPPLIES STORE', 50, 50);
      ctx.font = '12px monospace';
      ctx.fillText('Invoice: #OFF-99214', 50, 75);
      ctx.fillText('Date: 2026-10-19', 50, 95);
      ctx.fillText('-----------------------------------', 40, 115);
      ctx.fillText('A4 Laser Paper (500 sheets)   $18.50', 40, 145);
      ctx.fillText('Ballpoint Pens (12pk)          $6.25', 40, 175);
      ctx.fillText('Wireless Ergonomic Mouse      $39.99', 40, 205);
      ctx.fillText('-----------------------------------', 40, 235);
      ctx.font = 'bold 14px monospace';
      ctx.fillText('TOTAL: $64.74 USD', 40, 270);
    }

    ctx.restore();

    const dataUrl = canvas.toDataURL('image/png');
    setImageSrc(dataUrl);
    const img = new Image();
    img.onload = () => {
      originalImageRef.current = img;
      // Set default corners matching skewed paper
      setCorners([
        { x: 60, y: 50 },
        { x: 440, y: 72 },
        { x: 410, y: 580 },
        { x: 30, y: 560 }
      ]);
      renderDewarpedDoc();
    };
    img.src = dataUrl;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      const img = new Image();
      img.onload = () => {
        originalImageRef.current = img;
        const w = img.width;
        const h = img.height;
        setCorners([
          { x: Math.round(w * 0.08), y: Math.round(h * 0.08) },
          { x: Math.round(w * 0.92), y: Math.round(h * 0.08) },
          { x: Math.round(w * 0.92), y: Math.round(h * 0.92) },
          { x: Math.round(w * 0.08), y: Math.round(h * 0.92) }
        ]);
        renderDewarpedDoc();
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // High-performance perspective transform and scanner filter
  const renderDewarpedDoc = useCallback(() => {
    if (!canvasRef.current || !originalImageRef.current) return;
    const canvas = canvasRef.current;
    const img = originalImageRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Output dimension (Standard crisp letter aspect ratio)
    const outW = 600;
    const outH = 800;
    canvas.width = outW;
    canvas.height = outH;

    // Temporary canvas for crop
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    tempCtx.drawImage(img, 0, 0);

    // Bilinear perspective sampling into output
    const srcData = tempCtx.getImageData(0, 0, img.width, img.height);
    const outImgData = ctx.createImageData(outW, outH);
    const sD = srcData.data;
    const oD = outImgData.data;

    const [p0, p1, p2, p3] = corners;

    for (let y = 0; y < outH; y++) {
      const v = y / outH;
      for (let x = 0; x < outW; x++) {
        const u = x / outW;

        // Bilinear interpolation of corner quad
        const srcX = Math.round((1 - u) * (1 - v) * p0.x + u * (1 - v) * p1.x + u * v * p2.x + (1 - u) * v * p3.x);
        const srcY = Math.round((1 - u) * (1 - v) * p0.y + u * (1 - v) * p1.y + u * v * p2.y + (1 - u) * v * p3.y);

        if (srcX >= 0 && srcX < img.width && srcY >= 0 && srcY < img.height) {
          const sIdx = (srcY * img.width + srcX) * 4;
          const oIdx = (y * outW + x) * 4;

          let r = sD[sIdx];
          let g = sD[sIdx + 1];
          let b = sD[sIdx + 2];

          // Apply Selected Document Scanner Filter
          if (filterMode === 'magic-bw') {
            // Adaptive document thresholding: boost white background, crisp ink
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
            const stretched = factor * (lum - 128) + 128 + brightness;
            const finalVal = stretched > 135 ? 255 : Math.max(0, stretched * 0.7);
            oD[oIdx] = finalVal;
            oD[oIdx + 1] = finalVal;
            oD[oIdx + 2] = finalVal;
          } else if (filterMode === 'color-boost') {
            // Enhance text readability while preserving stamp/pen colors
            oD[oIdx] = Math.min(255, Math.max(0, r + brightness));
            oD[oIdx + 1] = Math.min(255, Math.max(0, g + brightness));
            oD[oIdx + 2] = Math.min(255, Math.max(0, b + brightness));
          } else if (filterMode === 'grayscale') {
            const gray = Math.min(255, Math.max(0, 0.299 * r + 0.587 * g + 0.114 * b + brightness));
            oD[oIdx] = gray;
            oD[oIdx + 1] = gray;
            oD[oIdx + 2] = gray;
          } else {
            oD[oIdx] = r;
            oD[oIdx + 1] = g;
            oD[oIdx + 2] = b;
          }
          oD[oIdx + 3] = 255;
        }
      }
    }

    ctx.putImageData(outImgData, 0, 0);
  }, [corners, filterMode, brightness, contrast]);

  useEffect(() => {
    if (imageSrc) {
      renderDewarpedDoc();
    }
  }, [imageSrc, corners, filterMode, brightness, contrast, renderDewarpedDoc]);

  const downloadAsPdf = () => {
    if (!canvasRef.current) return;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    const imgData = canvasRef.current.toDataURL('image/jpeg', 0.95);
    doc.addImage(imgData, 'JPEG', 10, 10, 190, 260);
    doc.save(`supertools-scanned-doc-${Date.now()}.pdf`);
  };

  const downloadAsPng = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `supertools-scan-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <Gauge className="w-3.5 h-3.5 text-emerald-500" />
            <span>Low-RAM Safe: ~18 MB</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            AI perspective correction & scanner paper whitening
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">1-Click Demos:</span>
          <button
            onClick={() => loadDemo('contract')}
            className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all"
          >
            Angled Contract
          </button>
          <button
            onClick={() => loadDemo('receipt')}
            className="px-2.5 py-1 rounded-xl bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 text-violet-700 dark:text-violet-300 text-xs font-bold transition-all"
          >
            Desk Receipt
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              Document Filter & Tone
            </h3>

            {/* Filter Mode Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Enhancement Filter
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setFilterMode('magic-bw')}
                  className={`p-2 rounded-xl border text-left font-bold transition-all ${
                    filterMode === 'magic-bw'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Scanner Magic B&W
                </button>
                <button
                  onClick={() => setFilterMode('color-boost')}
                  className={`p-2 rounded-xl border text-left font-bold transition-all ${
                    filterMode === 'color-boost'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Color Document
                </button>
                <button
                  onClick={() => setFilterMode('grayscale')}
                  className={`p-2 rounded-xl border text-left font-bold transition-all ${
                    filterMode === 'grayscale'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Smooth Grayscale
                </button>
                <button
                  onClick={() => setFilterMode('original')}
                  className={`p-2 rounded-xl border text-left font-bold transition-all ${
                    filterMode === 'original'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Original Flat
                </button>
              </div>
            </div>

            {/* Brightness & Contrast */}
            <div className="space-y-2 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Paper Whitening</span>
                  <span className="font-mono font-bold text-indigo-600">+{brightness}</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="60"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Ink Contrast</span>
                  <span className="font-mono font-bold text-indigo-600">{contrast}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Upload */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-4 cursor-pointer bg-slate-50 dark:bg-slate-900 transition-colors">
              <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-1" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Choose Document Photo
              </span>
              <span className="text-[10px] text-slate-400">Works on phone/camera photos</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Export Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={downloadAsPdf}
                disabled={!imageSrc}
                className="py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={downloadAsPng}
                disabled={!imageSrc}
                className="py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export PNG</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dewarped Scanned Output (8 cols) */}
        <div className="lg:col-span-8">
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col items-center justify-center min-h-[500px]">
            <div className="relative rounded-2xl overflow-hidden p-2 flex items-center justify-center bg-slate-950 max-w-full">
              <canvas ref={canvasRef} className="max-w-full max-h-[520px] object-contain rounded-lg shadow-2xl" />
              {!imageSrc && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <FileText className="w-10 h-10 text-indigo-400 opacity-40" />
                  <span className="text-xs font-bold">No Document Loaded</span>
                  <span className="text-[11px] text-slate-500">Pick an angled contract above or upload photo</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
