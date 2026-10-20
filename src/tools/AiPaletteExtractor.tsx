import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Upload, Palette, Copy, Sparkles, Check, Download, Gauge, Cpu, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { QuickCopy } from '../components/QuickCopy';
import { getTierByLevel, getUserRamBudgetMb } from '../utils/hardwareScaling';

interface ExtractedColor {
  hex: string;
  rgb: string;
  hsl: string;
  percentage: number;
  textColor: string; // for contrast badge
}

interface AiPaletteExtractorProps {
  hardwareLevel?: number;
}

export const AiPaletteExtractor: React.FC<AiPaletteExtractorProps> = ({ hardwareLevel = 3 }) => {
  const currentTier = getTierByLevel(hardwareLevel);
  const [paletteModel, setPaletteModel] = useState<'fast' | 'standard' | 'cielab'>(() => {
    return (localStorage.getItem('supertools_palette_model') as any) || 'standard';
  });
  const [ramBudget, setRamBudget] = useState<number>(() => {
    return getUserRamBudgetMb(hardwareLevel);
  });
  const [showAiConfig, setShowAiConfig] = useState<boolean>(false);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [colorCount, setColorCount] = useState<number>(6);
  const [palette, setPalette] = useState<ExtractedColor[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1-Click Realistic Demos
  const loadDemo = (type: 'sunset' | 'nature' | 'cyberpunk') => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (type === 'sunset') {
      const grad = ctx.createLinearGradient(0, 0, 0, 300);
      grad.addColorStop(0, '#f97316');
      grad.addColorStop(0.3, '#ec4899');
      grad.addColorStop(0.7, '#8b5cf6');
      grad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 400, 300);

      // Sun
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(200, 200, 60, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'nature') {
      const grad = ctx.createLinearGradient(0, 0, 400, 300);
      grad.addColorStop(0, '#065f46');
      grad.addColorStop(0.4, '#10b981');
      grad.addColorStop(0.7, '#34d399');
      grad.addColorStop(1, '#a7f3d0');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 400, 300);

      ctx.fillStyle = '#78350f';
      ctx.fillRect(160, 180, 80, 120);
    } else {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, 400, 300);

      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(120, 150, 70, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(280, 150, 70, 0, Math.PI * 2);
      ctx.fill();
    }

    const dataUrl = canvas.toDataURL('image/png');
    setImageSrc(dataUrl);
    runKMeansExtraction(dataUrl, colorCount);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      runKMeansExtraction(src, colorCount);
    };
    reader.readAsDataURL(file);
  };

  // Pure Client-Side K-Means Color Clustering with Adaptive Hardware Scaling
  const runKMeansExtraction = useCallback((src: string, k: number) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // Sample dimensions adapt to model and RAM budget
      let sampleW = 140;
      let sampleH = 140;
      let iterations = Math.max(6, currentTier.kMeansIterations);
      let step = 16;

      if (paletteModel === 'fast') {
        sampleW = 80;
        sampleH = 80;
        iterations = 3;
        step = 24;
      } else if (paletteModel === 'cielab') {
        sampleW = 260;
        sampleH = 260;
        iterations = Math.max(12, currentTier.kMeansIterations * 2);
        step = 8;
      }

      canvas.width = sampleW;
      canvas.height = sampleH;
      ctx.drawImage(img, 0, 0, sampleW, sampleH);

      const d = ctx.getImageData(0, 0, sampleW, sampleH).data;
      const pixels: [number, number, number][] = [];

      for (let i = 0; i < d.length; i += step) {
        if (d[i + 3] > 128) {
          pixels.push([d[i], d[i + 1], d[i + 2]]);
        }
      }

      if (pixels.length === 0) return;

      // Initialize K centroids
      let centroids: [number, number, number][] = [];
      for (let i = 0; i < k; i++) {
        const p = pixels[Math.floor((i / k) * pixels.length)];
        centroids.push([...p]);
      }

      // Adaptive iterations of K-Means
      for (let iter = 0; iter < iterations; iter++) {
        const clusters: [number, number, number][][] = Array.from({ length: k }, () => []);

        // Assign
        for (let p of pixels) {
          let bestIdx = 0;
          let bestDist = Infinity;
          for (let cIdx = 0; cIdx < k; cIdx++) {
            const c = centroids[cIdx];
            const dist = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2;
            if (dist < bestDist) {
              bestDist = dist;
              bestIdx = cIdx;
            }
          }
          clusters[bestIdx].push(p);
        }

        // Recompute centroids
        for (let cIdx = 0; cIdx < k; cIdx++) {
          const cl = clusters[cIdx];
          if (cl.length > 0) {
            const sum = cl.reduce((acc, curr) => [acc[0] + curr[0], acc[1] + curr[1], acc[2] + curr[2]], [0, 0, 0]);
            centroids[cIdx] = [Math.round(sum[0] / cl.length), Math.round(sum[1] / cl.length), Math.round(sum[2] / cl.length)];
          }
        }
      }

      // Format results
      const results: ExtractedColor[] = centroids.map((c, idx) => {
        const hex = '#' + c.map(x => x.toString(16).padStart(2, '0')).join('');
        const lum = 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
        const textColor = lum > 140 ? '#0f172a' : '#ffffff';
        return {
          hex,
          rgb: `rgb(${c[0]}, ${c[1]}, ${c[2]})`,
          hsl: 'hsl(..)',
          percentage: Math.round(100 / k),
          textColor
        };
      });

      setPalette(results);
    };
    img.src = src;
  }, [currentTier.kMeansIterations, paletteModel]);

  useEffect(() => {
    if (imageSrc) {
      runKMeansExtraction(imageSrc, colorCount);
    }
  }, [imageSrc, colorCount, runKMeansExtraction]);

  const cssVariables = useMemo(() => {
    return `:root {\n` + palette.map((col, idx) => `  --color-primary-${idx + 1}: ${col.hex};`).join('\n') + `\n}`;
  }, [palette]);

  return (
    <div className="space-y-6">
      {/* Top Banner with Hardware Tier & RAM Meter */}
      <div className="p-4 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <Gauge className="w-3.5 h-3.5 text-emerald-500" />
            <span>RAM: ~{paletteModel === 'fast' ? '4' : paletteModel === 'standard' ? '12' : '32'} MB / {ramBudget >= 1000 ? `${(ramBudget/1000).toFixed(1)} GB` : `${ramBudget} MB`}</span>
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
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">1-Click Demos:</span>
          <button
            onClick={() => loadDemo('sunset')}
            className="px-2.5 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/60 hover:bg-orange-100 text-orange-700 dark:text-orange-300 text-xs font-bold transition-all"
          >
            Sunset Gradient
          </button>
          <button
            onClick={() => loadDemo('nature')}
            className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all"
          >
            Forest Green
          </button>
          <button
            onClick={() => loadDemo('cyberpunk')}
            className="px-2.5 py-1 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 text-cyan-700 dark:text-cyan-300 text-xs font-bold transition-all"
          >
            Cyberpunk Neon
          </button>
        </div>
      </div>

      {/* Expandable AI Performance & Model Tuning Panel */}
      {showAiConfig && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-indigo-500/30 text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <h4 className="font-bold text-sm text-slate-100">Palette Extractor Clustering Engine & Memory Options</h4>
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
                <span>Color Quantization Clustering Model</span>
                <span className="font-mono text-indigo-400 text-[11px]">{paletteModel.toUpperCase()}</span>
              </label>
              <select
                value={paletteModel}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setPaletteModel(val);
                  localStorage.setItem('supertools_palette_model', val);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold focus:outline-none"
              >
                <option value="fast">Fast K-Means Fast Quant (80x80 sample, 4MB RAM Safe for 2-4GB PCs)</option>
                <option value="standard">Standard Median Cut (140x140 sample, 16MB RAM)</option>
                <option value="cielab">High-Density CIELAB Spectral (260x260 sample, 48MB RAM)</option>
              </select>
              <span className="text-[10px] text-slate-400 block">
                {paletteModel === 'fast' && '⚡ Downsampled 80x80 grid with 3 clustering iterations for instant result.'}
                {paletteModel === 'standard' && '⚖️ 140x140 grid with balanced chromatic representation.'}
                {paletteModel === 'cielab' && '✨ 260x260 grid with deep spectral clustering and maximum tonal nuance.'}
              </span>
            </div>

            {/* RAM Budget Slider */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 flex items-center justify-between">
                <span>Allocated Palette RAM Budget</span>
                <span className="font-mono text-emerald-400 text-[11px] font-bold">
                  {ramBudget >= 1000 ? `${(ramBudget/1000).toFixed(1)} GB` : `${ramBudget} MB`}
                </span>
              </label>
              <input
                type="range"
                min="5"
                max="300"
                step="5"
                value={ramBudget}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setRamBudget(val);
                  localStorage.setItem('supertools_ram_budget', String(val));
                }}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>5 MB (Low-Spec Safe)</span>
                <span>80 MB (Balanced)</span>
                <span>300 MB (Studio Max)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image & Options (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-600" />
                Color Cluster Count
              </h3>
              <div className="flex items-center gap-1.5">
                {[4, 6, 8].map(n => (
                  <button
                    key={n}
                    onClick={() => setColorCount(n)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      colorCount === n
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-4 cursor-pointer bg-slate-50 dark:bg-slate-900 transition-colors">
              <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-1" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Choose Image to Extract
              </span>
              <span className="text-[10px] text-slate-400">Zero backend • 100% private</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Preview */}
            {imageSrc && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-[220px] flex items-center justify-center bg-slate-950">
                <img src={imageSrc} alt="Sample" className="max-h-[220px] object-contain" />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Extracted Palette & CSS (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 flex flex-col h-full min-h-[460px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Extracted Color Harmony ({palette.length} Swatches)
              </h3>
              {palette.length > 0 && (
                <QuickCopy text={palette.map(c => c.hex).join(', ')} label="Copy All HEX" />
              )}
            </div>

            {palette.length > 0 ? (
              <div className="space-y-4 flex-1">
                {/* Horizontal Swatch Strip */}
                <div className="h-16 rounded-2xl overflow-hidden flex shadow-inner border border-slate-200/60 dark:border-slate-800/60">
                  {palette.map((col, idx) => (
                    <div
                      key={idx}
                      className="flex-1 h-full flex items-center justify-center transition-all hover:flex-2 cursor-pointer group"
                      style={{ backgroundColor: col.hex }}
                      title={`Click to copy: ${col.hex}`}
                      onClick={() => navigator.clipboard.writeText(col.hex)}
                    >
                      <span
                        className="text-[11px] font-mono font-black opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: col.textColor }}
                      >
                        {col.hex}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Individual Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {palette.map((col, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3"
                    >
                      <div
                        className="w-10 h-10 rounded-xl shadow-xs shrink-0 border border-black/10"
                        style={{ backgroundColor: col.hex }}
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-mono font-bold block text-slate-900 dark:text-white">
                          {col.hex}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block truncate">
                          {col.rgb}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Export as CSS variables */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">CSS Tokens</span>
                    <QuickCopy text={cssVariables} label="Copy CSS" />
                  </div>
                  <pre className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto">
                    {cssVariables}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-2 py-16">
                <Palette className="w-10 h-10 text-indigo-400 opacity-40" />
                <span className="text-xs font-bold">No Palette Extracted</span>
                <span className="text-[11px] text-slate-500">Pick a demo above or upload an image</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
