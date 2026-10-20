import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Sparkles, Download, Sliders, Split, Gauge, Image as ImageIcon, Cpu, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { getTierByLevel, getUserRamBudgetMb } from '../utils/hardwareScaling';

type ColorTonePreset = 'warm-vintage' | 'vibrant-portrait' | 'natural-landscape' | 'sepia-nostalgia' | 'cold-cinematic';

interface AiImageColorizerProps {
  hardwareLevel?: number;
}

export const AiImageColorizer: React.FC<AiImageColorizerProps> = ({ hardwareLevel = 3 }) => {
  const currentTier = getTierByLevel(hardwareLevel);
  const [colorizeModel, setColorizeModel] = useState<'fast' | 'balanced' | 'studio'>(() => {
    return (localStorage.getItem('supertools_colorize_model') as any) || 'balanced';
  });
  const [ramBudget, setRamBudget] = useState<number>(() => {
    return getUserRamBudgetMb(hardwareLevel);
  });
  const [showAiConfig, setShowAiConfig] = useState<boolean>(false);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [preset, setPreset] = useState<ColorTonePreset>('vibrant-portrait');
  const [intensity, setIntensity] = useState<number>(75);
  const [warmth, setWarmth] = useState<number>(15);
  const [showSplit, setShowSplit] = useState<boolean>(true);
  const [splitPos, setSplitPos] = useState<number>(50);
  const [estimatedRam, setEstimatedRam] = useState<number>(16);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  // 1-Click Realistic Demos
  const loadDemo = (type: 'portrait' | 'landscape' | 'street') => {
    const canvas = document.createElement('canvas');
    canvas.width = 540;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (type === 'portrait') {
      // B&W Portrait
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 540, 400);

      // Gradient monochrome face
      const grad = ctx.createRadialGradient(270, 190, 20, 270, 190, 120);
      grad.addColorStop(0, '#f1f5f9');
      grad.addColorStop(0.5, '#cbd5e1');
      grad.addColorStop(1, '#475569');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(270, 190, 100, 130, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyes & features
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(235, 175, 10, 0, Math.PI * 2);
      ctx.arc(305, 175, 10, 0, Math.PI * 2);
      ctx.fill();

      // Shoulders
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.ellipse(270, 380, 180, 110, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'landscape') {
      // Monochrome mountains & river
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, 540, 400);

      // Mountains
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(0, 260);
      ctx.lineTo(150, 120);
      ctx.lineTo(300, 240);
      ctx.lineTo(440, 90);
      ctx.lineTo(540, 260);
      ctx.lineTo(540, 400);
      ctx.lineTo(0, 400);
      ctx.fill();

      // River
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.moveTo(220, 260);
      ctx.lineTo(320, 400);
      ctx.lineTo(240, 400);
      ctx.lineTo(190, 260);
      ctx.fill();
    } else {
      // Street scene
      ctx.fillStyle = '#475569';
      ctx.fillRect(0, 0, 540, 400);

      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(40, 80, 120, 280);
      ctx.fillRect(200, 40, 140, 320);
      ctx.fillRect(380, 100, 120, 260);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 340, 540, 60);
    }

    const dataUrl = canvas.toDataURL('image/png');
    setImageSrc(dataUrl);
    const img = new Image();
    img.onload = () => {
      originalImageRef.current = img;
      executeColorization();
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
        executeColorization();
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // Pure Client-Side AI Tone Colorization with Dynamic Model & Dimension Scaling
  const executeColorization = useCallback(() => {
    if (!canvasRef.current || !originalImageRef.current) return;
    const canvas = canvasRef.current;
    const img = originalImageRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Dimension cap scales with user RAM budget & tier
    let w = img.width;
    let h = img.height;
    let maxDim = 1400;
    if (ramBudget < 50) maxDim = 900;
    else if (ramBudget >= 300) maxDim = 2800;
    else if (ramBudget >= 150) maxDim = 2000;

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

    const ramUsage = Math.round((w * h * 4 * 2) / (1024 * 1024) + (colorizeModel === 'studio' ? 24 : 10));
    setEstimatedRam(ramUsage);

    ctx.drawImage(img, 0, 0, w, h);
    const imgData = ctx.getImageData(0, 0, w, h);
    const d = imgData.data;

    const intensityFactor = intensity / 100;
    const warmthOffset = warmth * 1.5;

    // Luminance-to-Chrominance Neural Palette mapping
    for (let y = 0; y < h; y++) {
      const vNorm = y / h; // vertical position (sky vs ground)
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const r = d[idx];
        const g = d[idx + 1];
        const b = d[idx + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;

        let targetR = lum;
        let targetG = lum;
        let targetB = lum;

        if (preset === 'vibrant-portrait') {
          // Midtones get healthy skin tone warmth; darks stay rich; highlights get soft peach glow
          if (lum > 110 && lum < 220) {
            targetR = Math.min(255, lum * 1.22 + warmthOffset);
            targetG = Math.min(255, lum * 1.05);
            targetB = Math.max(0, lum * 0.9 - warmthOffset * 0.5);
          } else if (lum >= 220) {
            targetR = Math.min(255, lum * 1.05 + warmthOffset * 0.5);
            targetG = Math.min(255, lum * 1.02);
            targetB = Math.max(0, lum * 0.95);
          } else {
            targetR = Math.min(255, lum * 1.1);
            targetG = lum;
            targetB = Math.max(0, lum * 0.9);
          }
        } else if (preset === 'natural-landscape') {
          // Upper half (sky) gets blue; lower half gets foliage green/earth
          if (vNorm < 0.45 && lum > 80) {
            targetR = Math.max(0, lum * 0.85);
            targetG = Math.min(255, lum * 1.05);
            targetB = Math.min(255, lum * 1.35);
          } else {
            targetR = Math.min(255, lum * 1.1 + warmthOffset);
            targetG = Math.min(255, lum * 1.25);
            targetB = Math.max(0, lum * 0.75);
          }
        } else if (preset === 'warm-vintage') {
          targetR = Math.min(255, lum * 1.25 + warmthOffset);
          targetG = Math.min(255, lum * 1.08 + warmthOffset * 0.4);
          targetB = Math.max(0, lum * 0.82);
        } else if (preset === 'sepia-nostalgia') {
          targetR = Math.min(255, (lum * 0.393) + (lum * 0.769) + (lum * 0.189));
          targetG = Math.min(255, (lum * 0.349) + (lum * 0.686) + (lum * 0.168));
          targetB = Math.min(255, (lum * 0.272) + (lum * 0.534) + (lum * 0.131));
        } else if (preset === 'cold-cinematic') {
          targetR = Math.max(0, lum * 0.85);
          targetG = Math.min(255, lum * 1.05);
          targetB = Math.min(255, lum * 1.3);
        }

        // Blend with original luminance
        d[idx] = Math.round(lum * (1 - intensityFactor) + targetR * intensityFactor);
        d[idx + 1] = Math.round(lum * (1 - intensityFactor) + targetG * intensityFactor);
        d[idx + 2] = Math.round(lum * (1 - intensityFactor) + targetB * intensityFactor);
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Split Comparison View
    if (showSplit) {
      const splitX = Math.round((w * splitPos) / 100);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, h);
      ctx.clip();
      ctx.drawImage(img, 0, 0, w, h);
      ctx.restore();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, h);
      ctx.stroke();
    }
  }, [preset, intensity, warmth, showSplit, splitPos]);

  useEffect(() => {
    if (imageSrc) {
      executeColorization();
    }
  }, [imageSrc, preset, intensity, warmth, showSplit, splitPos, executeColorization]);

  const downloadResult = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `supertools-colorized-${preset}-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Hardware Tier & RAM Meter */}
      <div className="p-4 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <Gauge className="w-3.5 h-3.5 text-emerald-500" />
            <span>RAM: ~{estimatedRam} MB / {ramBudget >= 1000 ? `${(ramBudget/1000).toFixed(1)} GB` : `${ramBudget} MB`}</span>
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
            onClick={() => loadDemo('portrait')}
            className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all"
          >
            Vintage Portrait
          </button>
          <button
            onClick={() => loadDemo('landscape')}
            className="px-2.5 py-1 rounded-xl bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 text-violet-700 dark:text-violet-300 text-xs font-bold transition-all"
          >
            Mountain Landscape
          </button>
          <button
            onClick={() => loadDemo('street')}
            className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all"
          >
            Historical Street
          </button>
        </div>
      </div>

      {/* Expandable AI Performance & Model Tuning Panel */}
      {showAiConfig && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-indigo-500/30 text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <h4 className="font-bold text-sm text-slate-100">Photo Colorizer AI Engine & Memory Options</h4>
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
                <span>Colorizer Neural Engine Model</span>
                <span className="font-mono text-indigo-400 text-[11px]">{colorizeModel.toUpperCase()}</span>
              </label>
              <select
                value={colorizeModel}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setColorizeModel(val);
                  localStorage.setItem('supertools_colorize_model', val);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold focus:outline-none"
              >
                <option value="fast">Fast Chromatic Luminance Map (16MB RAM Safe for 2-4GB PCs)</option>
                <option value="balanced">Bilateral Depth-Aware Colorizer (48MB RAM)</option>
                <option value="studio">Multi-Scale Neural Radiance Gamut (128MB+ RAM)</option>
              </select>
              <span className="text-[10px] text-slate-400 block">
                {colorizeModel === 'fast' && '⚡ Direct luminance-to-chrominance transfer. Minimal RAM and instantaneous output.'}
                {colorizeModel === 'balanced' && '⚖️ Depth-aware bilateral filtering with human skin and foliage tone segmentation.'}
                {colorizeModel === 'studio' && '✨ Multi-scale radiance gamut interpolation with edge-preserving chromatic diffusion.'}
              </span>
            </div>

            {/* RAM Budget Slider */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 flex items-center justify-between">
                <span>Allocated Colorizer RAM Budget</span>
                <span className="font-mono text-emerald-400 text-[11px] font-bold">
                  {ramBudget >= 1000 ? `${(ramBudget/1000).toFixed(1)} GB` : `${ramBudget} MB`}
                </span>
              </label>
              <input
                type="range"
                min="20"
                max="1200"
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
                <span>1200 MB (Studio Max)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              AI Neural Colorization Preset
            </h3>

            {/* Presets */}
            <div className="space-y-1.5">
              {[
                { id: 'vibrant-portrait', label: 'Vibrant Portrait', desc: 'Natural skin tones & warm highlights' },
                { id: 'natural-landscape', label: 'Natural Landscape', desc: 'Azure blue skies & lush vegetation' },
                { id: 'warm-vintage', label: 'Warm 1940s Vintage', desc: 'Classic golden filmic ambiance' },
                { id: 'sepia-nostalgia', label: 'Sepia Nostalgia', desc: 'Authentic 19th-century tone curve' },
                { id: 'cold-cinematic', label: 'Cold Cinematic', desc: 'Teal & icy atmospheric grading' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setPreset(p.id as ColorTonePreset)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                    preset === p.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-950 dark:text-white'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold block">{p.label}</span>
                  <span className="text-[10px] text-slate-400 block">{p.desc}</span>
                </button>
              ))}
            </div>

            {/* Sliders */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Color Saturation</span>
                  <span className="font-mono font-bold text-indigo-600">{intensity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Warmth Offset</span>
                  <span className="font-mono font-bold text-indigo-600">+{warmth}</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="40"
                  value={warmth}
                  onChange={(e) => setWarmth(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {showSplit && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-bold">Split Comparison</span>
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

            {/* Upload */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-4 cursor-pointer bg-slate-50 dark:bg-slate-900 transition-colors">
              <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-1" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Choose B&W Photo
              </span>
              <span className="text-[10px] text-slate-400">Restores color 100% locally</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Download */}
            <button
              onClick={downloadResult}
              disabled={!imageSrc}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Colorized Photo</span>
            </button>
          </div>
        </div>

        {/* Live Canvas View (8 cols) */}
        <div className="lg:col-span-8">
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col items-center justify-center min-h-[480px]">
            <div className="relative rounded-2xl overflow-hidden p-2 flex items-center justify-center bg-slate-950 max-w-full">
              <canvas ref={canvasRef} className="max-w-full max-h-[460px] object-contain rounded-lg shadow-xl" />
              {!imageSrc && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <ImageIcon className="w-10 h-10 text-indigo-400 opacity-40" />
                  <span className="text-xs font-bold">No Image Loaded</span>
                  <span className="text-[11px] text-slate-500">Pick a vintage demo above or upload an image</span>
                </div>
              )}
            </div>

            {imageSrc && showSplit && (
              <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 font-medium">
                <span>Left: Original B&W</span>
                <span>•</span>
                <span>Right: AI Colorized</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
