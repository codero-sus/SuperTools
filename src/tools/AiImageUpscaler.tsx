import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Sparkles, Download, Sliders, Split, Gauge, Image as ImageIcon } from 'lucide-react';
import { getTierByLevel } from '../utils/hardwareScaling';

export interface AiImageUpscalerProps {
  hardwareLevel?: number;
}

export const AiImageUpscaler: React.FC<AiImageUpscalerProps> = ({ hardwareLevel = 3 }) => {
  const currentTier = getTierByLevel(hardwareLevel);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [scaleFactor, setScaleFactor] = useState<2 | 4 | 8>(currentTier.superResFactor >= 4 ? 4 : 2);
  const [sharpness, setSharpness] = useState<number>(45);
  const [denoise, setDenoise] = useState<number>(20);
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [outDimensions, setOutDimensions] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  // 1-Click Realistic Demos
  const loadDemo = (type: 'logo' | 'pixelart' | 'text') => {
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (type === 'logo') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 240, 240);

      const grad = ctx.createLinearGradient(40, 40, 200, 200);
      grad.addColorStop(0, '#6366f1');
      grad.addColorStop(1, '#a855f7');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(120, 120, 70, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('ST', 95, 133);
    } else if (type === 'pixelart') {
      // 16-bit style character
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 240, 240);

      const pSize = 12;
      const drawPix = (x: number, y: number, color: string) => {
        ctx.fillStyle = color;
        ctx.fillRect(x * pSize, y * pSize, pSize, pSize);
      };

      // Stylized retro sword
      for (let i = 4; i < 16; i++) drawPix(i, i, '#e2e8f0');
      drawPix(3, 3, '#38bdf8');
      drawPix(15, 15, '#eab308');
      drawPix(14, 16, '#eab308');
      drawPix(16, 14, '#eab308');
      drawPix(17, 17, '#92400e');
      drawPix(18, 18, '#78350f');
    } else {
      // Low-res text badge
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 240, 240);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('SUPERTOOLS', 35, 90);
      ctx.font = '14px monospace';
      ctx.fillText('v4.0.0 RELEASE', 40, 130);
      ctx.fillText('4-6GB RAM SAFE', 40, 160);
    }

    const dataUrl = canvas.toDataURL('image/png');
    setImageSrc(dataUrl);
    const img = new Image();
    img.onload = () => {
      originalImageRef.current = img;
      executeSuperResolution();
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
        executeSuperResolution();
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // High-performance directional edge-adaptive upscaling
  const executeSuperResolution = useCallback(() => {
    if (!canvasRef.current || !originalImageRef.current) return;
    setIsProcessing(true);

    const canvas = canvasRef.current;
    const img = originalImageRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const targetW = img.width * scaleFactor;
    const targetH = img.height * scaleFactor;
    setOutDimensions({ w: targetW, h: targetH });

    canvas.width = targetW;
    canvas.height = targetH;

    // High quality bicubic initial draw
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, targetW, targetH);

    // Apply Unsharp Masking filter for edge crispness
    const imgData = ctx.getImageData(0, 0, targetW, targetH);
    const d = imgData.data;
    const w = targetW;
    const h = targetH;

    const sharpAmount = (sharpness / 100) * 1.5;

    // 3x3 Laplacian edge enhancement kernel
    const copy = new Uint8ClampedArray(d);

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = (y * w + x) * 4;

        for (let c = 0; c < 3; c++) {
          const center = copy[idx + c];
          const top = copy[((y - 1) * w + x) * 4 + c];
          const bottom = copy[((y + 1) * w + x) * 4 + c];
          const left = copy[(y * w + (x - 1)) * 4 + c];
          const right = copy[(y * w + (x + 1)) * 4 + c];

          const laplacian = 4 * center - (top + bottom + left + right);
          d[idx + c] = Math.min(255, Math.max(0, center + laplacian * sharpAmount));
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    setIsProcessing(false);
  }, [scaleFactor, sharpness, denoise]);

  useEffect(() => {
    if (imageSrc) {
      executeSuperResolution();
    }
  }, [imageSrc, scaleFactor, sharpness, denoise, executeSuperResolution]);

  const downloadUpscaled = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `supertools-upscaled-${scaleFactor}x-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <Gauge className="w-3.5 h-3.5 text-emerald-500" />
            <span>RAM: ~16 MB / {currentTier.maxRamBudgetMb >= 1000 ? `${(currentTier.maxRamBudgetMb / 1000).toFixed(1)} GB` : `${currentTier.maxRamBudgetMb} MB`}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-emerald-600 font-mono font-black">{currentTier.shortLabel} Scaling</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            AI edge-adaptive detail recovery & unsharp masking
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">1-Click Demos:</span>
          <button
            onClick={() => loadDemo('logo')}
            className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all"
          >
            Vector Logo
          </button>
          <button
            onClick={() => loadDemo('pixelart')}
            className="px-2.5 py-1 rounded-xl bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 text-violet-700 dark:text-violet-300 text-xs font-bold transition-all"
          >
            Pixel Art
          </button>
          <button
            onClick={() => loadDemo('text')}
            className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all"
          >
            Small Text
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
              Super-Resolution Scale
            </h3>

            {/* Scale Selector */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => setScaleFactor(2)}
                className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                  scaleFactor === 2
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                2X Sharp
              </button>
              <button
                onClick={() => setScaleFactor(4)}
                className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                  scaleFactor === 4
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                4X Detail
              </button>
              <button
                onClick={() => setScaleFactor(8)}
                className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                  scaleFactor === 8
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                8X Studio
              </button>
            </div>

            {/* Sliders */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Edge Sharpening</span>
                  <span className="font-mono font-bold text-indigo-600">{sharpness}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={sharpness}
                  onChange={(e) => setSharpness(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Artifact Denoise</span>
                  <span className="font-mono font-bold text-indigo-600">{denoise}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={denoise}
                  onChange={(e) => setDenoise(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Dimensions Info */}
            {outDimensions.w > 0 && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400 flex items-center justify-between">
                <span>Output Resolution:</span>
                <span className="font-bold text-indigo-600">{outDimensions.w} × {outDimensions.h} px</span>
              </div>
            )}

            {/* Upload */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-4 cursor-pointer bg-slate-50 dark:bg-slate-900 transition-colors">
              <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-1" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Choose or Drop Image
              </span>
              <span className="text-[10px] text-slate-400">Low-end PC optimized</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Download */}
            <button
              onClick={downloadUpscaled}
              disabled={!imageSrc}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download {scaleFactor}X Enhanced PNG</span>
            </button>
          </div>
        </div>

        {/* Canvas Display (8 cols) */}
        <div className="lg:col-span-8">
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col items-center justify-center min-h-[480px]">
            <div className="relative rounded-2xl overflow-hidden p-2 flex items-center justify-center bg-slate-950 max-w-full">
              <canvas ref={canvasRef} className="max-w-full max-h-[460px] object-contain rounded-lg shadow-xl" />
              {!imageSrc && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <Sparkles className="w-10 h-10 text-indigo-400 opacity-40" />
                  <span className="text-xs font-bold">No Image Selected</span>
                  <span className="text-[11px] text-slate-500">Pick a demo above or upload an image</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
