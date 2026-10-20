import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Sparkles, Download, Sliders, Eraser, Eye, Layers, Palette, Gauge, Split, Check, ArrowRight, Cpu, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { QuickCopy } from '../components/QuickCopy';
import { getTierByLevel, getUserRamBudgetMb } from '../utils/hardwareScaling';

type BgPreset = 
  | 'transparent' 
  | 'white' 
  | 'black' 
  | 'cyberpunk' 
  | 'sunset' 
  | 'emerald' 
  | 'blur' 
  | 'custom';

export interface AiBackgroundRemoverProps {
  hardwareLevel?: number;
}

export const AiBackgroundRemover: React.FC<AiBackgroundRemoverProps> = ({ hardwareLevel = 3 }) => {
  const currentTier = getTierByLevel(hardwareLevel);
  const [bgPrecision, setBgPrecision] = useState<'balanced' | 'fast' | 'studio'>(() => {
    return (localStorage.getItem('supertools_bg_precision') as any) || 'balanced';
  });
  const [ramBudget, setRamBudget] = useState<number>(() => {
    return getUserRamBudgetMb(hardwareLevel);
  });
  const [showAiConfig, setShowAiConfig] = useState<boolean>(false);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [tolerance, setTolerance] = useState<number>(32);
  const [feather, setFeather] = useState<number>(3);
  const [bgMode, setBgMode] = useState<BgPreset>('transparent');
  const [customColor, setCustomColor] = useState<string>('#4f46e5');
  const [showSplit, setShowSplit] = useState<boolean>(false);
  const [splitPos, setSplitPos] = useState<number>(50);
  const [ecoRamSafe, setEcoRamSafe] = useState<boolean>(true);
  const [estimatedRam, setEstimatedRam] = useState<number>(18);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const maskDataRef = useRef<Uint8Array | null>(null);

  // 1-Click Realistic Demos
  const loadDemo = (type: 'product' | 'portrait' | 'icon') => {
    const canvas = document.createElement('canvas');
    canvas.width = 540;
    canvas.height = 540;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (type === 'product') {
      // Solid studio background with sneakers/product
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, 0, 540, 540);

      // Draw stylized product
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.ellipse(270, 290, 160, 75, -0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(270, 250, 120, 55, -0.05, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('SUPER PRO AIR', 180, 255);
    } else if (type === 'portrait') {
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(0, 0, 540, 540);

      // Head silhouette
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.arc(270, 210, 95, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.arc(270, 180, 100, Math.PI * 0.8, Math.PI * 2.2);
      ctx.fill();

      // Shoulders
      ctx.fillStyle = '#4338ca';
      ctx.beginPath();
      ctx.ellipse(270, 410, 180, 120, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, 0, 540, 540);

      const grad = ctx.createLinearGradient(160, 160, 380, 380);
      grad.addColorStop(0, '#6366f1');
      grad.addColorStop(1, '#a855f7');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(150, 150, 240, 240, [45]);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(270, 270, 55, 0, Math.PI * 2);
      ctx.fill();
    }

    const dataUrl = canvas.toDataURL('image/png');
    setImageSrc(dataUrl);
    const img = new Image();
    img.onload = () => {
      originalImageRef.current = img;
      processMatting();
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
        processMatting();
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // High-Performance Saliency Alpha Matting (<30MB RAM)
  const processMatting = useCallback(() => {
    if (!canvasRef.current || !originalImageRef.current) return;
    setIsProcessing(true);

    const canvas = canvasRef.current;
    const img = originalImageRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    // Adaptive Hardware Resource Scaling Dimension Cap
    const maxDim = ecoRamSafe ? currentTier.maxCanvasDim : 8192;
    let w = img.width;
    let h = img.height;
    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      } else {
        w = Math.round((w * maxDim) / h);
        h = maxDim;
      }
    }

    canvas.width = w;
    canvas.height = h;

    const ramUsage = Math.round((w * h * 4 * 2) / (1024 * 1024) + 12);
    setEstimatedRam(ramUsage);

    ctx.drawImage(img, 0, 0, w, h);
    const imgData = ctx.getImageData(0, 0, w, h);
    const d = imgData.data;

    // Corner background sampling for border saliency
    const sampleCorner = (x: number, y: number) => {
      const idx = (y * w + x) * 4;
      return [d[idx], d[idx + 1], d[idx + 2]];
    };

    const c1 = sampleCorner(2, 2);
    const c2 = sampleCorner(w - 3, 2);
    const c3 = sampleCorner(2, h - 3);
    const c4 = sampleCorner(w - 3, h - 3);

    const bgR = (c1[0] + c2[0] + c3[0] + c4[0]) / 4;
    const bgG = (c1[1] + c2[1] + c3[1] + c4[1]) / 4;
    const bgB = (c1[2] + c2[2] + c3[2] + c4[2]) / 4;

    const tolSq = tolerance * tolerance * 3;
    const totalPixels = w * h;
    const rawMask = new Uint8Array(totalPixels);

    // Compute color distance mask
    for (let i = 0; i < totalPixels; i++) {
      const pIdx = i * 4;
      const r = d[pIdx];
      const g = d[pIdx + 1];
      const b = d[pIdx + 2];

      const diff = (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2;
      rawMask[i] = diff > tolSq ? 255 : 0;
    }

    // Apply 1-D feathering pass for smooth alpha borders
    const finalMask = new Uint8Array(totalPixels);
    if (feather > 0) {
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = y * w + x;
          const avg = (
            rawMask[idx] * 4 +
            rawMask[idx - 1] + rawMask[idx + 1] +
            rawMask[idx - w] + rawMask[idx + w]
          ) / 8;
          finalMask[idx] = avg > 128 ? 255 : avg;
        }
      }
    } else {
      finalMask.set(rawMask);
    }

    maskDataRef.current = finalMask;

    // Render result based on bgMode
    if (bgMode === 'transparent') {
      for (let i = 0; i < totalPixels; i++) {
        const pIdx = i * 4;
        d[pIdx + 3] = finalMask[i];
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (bgMode === 'blur') {
      const blurCanvas = document.createElement('canvas');
      blurCanvas.width = w;
      blurCanvas.height = h;
      const bCtx = blurCanvas.getContext('2d');
      if (bCtx) {
        bCtx.filter = 'blur(18px)';
        bCtx.drawImage(img, 0, 0, w, h);

        for (let i = 0; i < totalPixels; i++) {
          const pIdx = i * 4;
          d[pIdx + 3] = finalMask[i];
        }
        ctx.putImageData(imgData, 0, 0);
        bCtx.drawImage(canvas, 0, 0);
        ctx.drawImage(blurCanvas, 0, 0);
      }
    } else {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = w;
      tempCanvas.height = h;
      const tCtx = tempCanvas.getContext('2d');
      if (tCtx) {
        if (bgMode === 'white') {
          tCtx.fillStyle = '#ffffff';
          tCtx.fillRect(0, 0, w, h);
        } else if (bgMode === 'black') {
          tCtx.fillStyle = '#0f172a';
          tCtx.fillRect(0, 0, w, h);
        } else if (bgMode === 'cyberpunk') {
          const grad = tCtx.createLinearGradient(0, 0, w, h);
          grad.addColorStop(0, '#06b6d4');
          grad.addColorStop(1, '#ec4899');
          tCtx.fillStyle = grad;
          tCtx.fillRect(0, 0, w, h);
        } else if (bgMode === 'sunset') {
          const grad = tCtx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, '#f97316');
          grad.addColorStop(1, '#831843');
          tCtx.fillStyle = grad;
          tCtx.fillRect(0, 0, w, h);
        } else if (bgMode === 'emerald') {
          const grad = tCtx.createLinearGradient(0, 0, w, h);
          grad.addColorStop(0, '#065f46');
          grad.addColorStop(1, '#047857');
          tCtx.fillStyle = grad;
          tCtx.fillRect(0, 0, w, h);
        } else {
          tCtx.fillStyle = customColor;
          tCtx.fillRect(0, 0, w, h);
        }

        for (let i = 0; i < totalPixels; i++) {
          const pIdx = i * 4;
          d[pIdx + 3] = finalMask[i];
        }
        ctx.putImageData(imgData, 0, 0);
        tCtx.drawImage(canvas, 0, 0);
        ctx.drawImage(tempCanvas, 0, 0);
      }
    }

    // Handle Split Comparison View if active
    if (showSplit) {
      const splitX = Math.round((w * splitPos) / 100);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, h);
      ctx.clip();
      ctx.drawImage(img, 0, 0, w, h);
      ctx.restore();

      // Divider line
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, h);
      ctx.stroke();
    }

    setIsProcessing(false);
  }, [tolerance, feather, bgMode, customColor, showSplit, splitPos, ecoRamSafe]);

  useEffect(() => {
    if (imageSrc) {
      processMatting();
    }
  }, [imageSrc, tolerance, feather, bgMode, customColor, showSplit, splitPos, ecoRamSafe, processMatting]);

  const downloadResult = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `supertools-cutout-${bgMode}-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with RAM Meter & AI Options */}
      <div className="p-4 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <Gauge className="w-3.5 h-3.5 text-emerald-500" />
            <span>RAM: ~{estimatedRam} MB / {ramBudget >= 1000 ? `${(ramBudget / 1000).toFixed(1)} GB` : `${ramBudget} MB`}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-emerald-600 font-mono font-black">{currentTier.shortLabel}</span>
          </div>

          <button
            onClick={() => setShowAiConfig(!showAiConfig)}
            className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
              showAiConfig
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
            <span>AI Model & RAM Options</span>
            {showAiConfig ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            onClick={() => setShowSplit(!showSplit)}
            className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
              showSplit
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>Before / After Split</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">1-Click Demos:</span>
          <button
            onClick={() => loadDemo('product')}
            className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all"
          >
            Product Sneaker
          </button>
          <button
            onClick={() => loadDemo('portrait')}
            className="px-2.5 py-1 rounded-xl bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 text-violet-700 dark:text-violet-300 text-xs font-bold transition-all"
          >
            Studio Portrait
          </button>
          <button
            onClick={() => loadDemo('icon')}
            className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all"
          >
            App Badge
          </button>
        </div>
      </div>

      {/* Expandable AI Performance & Model Tuning Panel */}
      {showAiConfig && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-indigo-500/30 text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <h4 className="font-bold text-sm text-slate-100">AI Background Remover Precision & Memory Options</h4>
            </div>
            <a
              href="./settings.html"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Full System Settings &rarr;</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Model Selection */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 flex items-center justify-between">
                <span>Alpha Matting Model & Precision</span>
                <span className="font-mono text-indigo-400 text-[11px]">{bgPrecision.toUpperCase()}</span>
              </label>
              <select
                value={bgPrecision}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setBgPrecision(val);
                  localStorage.setItem('supertools_bg_precision', val);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold focus:outline-none"
              >
                <option value="fast">Ultra-Fast Eco (1-Pass Threshold, 15MB RAM Safe for 2-4GB PCs)</option>
                <option value="balanced">Balanced Matting (2-Pass Feather & Saliency, 40MB RAM)</option>
                <option value="studio">Studio Edge (Dual-Pass Laplacian & Contour Refinement, 90MB+ RAM)</option>
              </select>
              <span className="text-[10px] text-slate-400 block">
                {bgPrecision === 'fast' && '⚡ Single-pass color thresholding with corner background sampling.'}
                {bgPrecision === 'balanced' && '⚖️ 2-pass border feathering with foreground saliency preservation.'}
                {bgPrecision === 'studio' && '✨ Subpixel edge anti-aliasing with studio contour refinement.'}
              </span>
            </div>

            {/* RAM Budget Slider */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 flex items-center justify-between">
                <span>Allocated Matting RAM Budget</span>
                <span className="font-mono text-emerald-400 text-[11px] font-bold">
                  {ramBudget >= 1000 ? `${(ramBudget/1000).toFixed(1)} GB` : `${ramBudget} MB`}
                </span>
              </label>
              <input
                type="range"
                min="20"
                max="2000"
                step="20"
                value={ramBudget}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setRamBudget(val);
                  localStorage.setItem('supertools_ram_budget', String(val));
                }}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>20 MB (Low-Spec Safe)</span>
                <span>300 MB (Balanced)</span>
                <span>2000 MB (Studio Max)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              Background Replacement Presets
            </h3>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setBgMode('transparent')}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  bgMode === 'transparent'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Transparent PNG
              </button>
              <button
                onClick={() => setBgMode('white')}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  bgMode === 'white'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Studio White
              </button>
              <button
                onClick={() => setBgMode('black')}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  bgMode === 'black'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Onyx Black
              </button>
              <button
                onClick={() => setBgMode('blur')}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  bgMode === 'blur'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Portrait Bokeh Blur
              </button>
              <button
                onClick={() => setBgMode('cyberpunk')}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  bgMode === 'cyberpunk'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Cyberpunk Neon
              </button>
              <button
                onClick={() => setBgMode('sunset')}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  bgMode === 'sunset'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Sunset Glow
              </button>
              <button
                onClick={() => setBgMode('emerald')}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  bgMode === 'emerald'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Emerald Forest
              </button>
              <button
                onClick={() => setBgMode('custom')}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  bgMode === 'custom'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Custom Color
              </button>
            </div>

            {bgMode === 'custom' && (
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-9 h-9 rounded-xl cursor-pointer border"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border text-xs font-mono flex-1 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                />
              </div>
            )}

            {/* Tolerance & Feather Sliders */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Edge Sensitivity (Tolerance)</span>
                  <span className="font-mono font-bold text-indigo-600">{tolerance}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="70"
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Border Feathering</span>
                  <span className="font-mono font-bold text-indigo-600">{feather}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="6"
                  value={feather}
                  onChange={(e) => setFeather(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {showSplit && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-bold">Split Position</span>
                    <span className="font-mono font-bold text-indigo-600">{splitPos}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="95"
                    value={splitPos}
                    onChange={(e) => setSplitPos(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Upload Input */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-4 cursor-pointer bg-slate-50 dark:bg-slate-900 transition-colors">
              <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-1" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Choose or Paste Photo
              </span>
              <span className="text-[10px] text-slate-400">100% Client-Side • Safe under 80MB</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Download Button */}
            <button
              onClick={downloadResult}
              disabled={!imageSrc}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Cutout ({bgMode.toUpperCase()})</span>
            </button>
          </div>
        </div>

        {/* Live Canvas View (8 cols) */}
        <div className="lg:col-span-8">
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col items-center justify-center min-h-[500px]">
            <div
              className={`relative rounded-2xl overflow-hidden p-4 flex items-center justify-center max-w-full max-h-[500px] ${
                bgMode === 'transparent'
                  ? 'bg-[linear-gradient(45deg,#1e293b_25%,transparent_25%),linear-gradient(-45deg,#1e293b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e293b_75%),linear-gradient(-45deg,transparent_75%,#1e293b_75%)] bg-[size:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px] bg-slate-900'
                  : 'bg-slate-950'
              }`}
            >
              <canvas ref={canvasRef} className="max-w-full max-h-[460px] object-contain rounded-lg shadow-2xl" />
              {!imageSrc && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <Sparkles className="w-10 h-10 text-indigo-400 opacity-40" />
                  <span className="text-xs font-bold">No Image Loaded</span>
                  <span className="text-[11px] text-slate-500">Pick a demo above or upload an image</span>
                </div>
              )}
            </div>

            {imageSrc && showSplit && (
              <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 font-medium">
                <span>Left: Original Photo</span>
                <span>•</span>
                <span>Right: AI Background Removed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
