import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RefreshCw, Eraser, Check, Eye, Pipette, Sparkles, Sliders } from 'lucide-react';
import { QuickCopy } from '../components/QuickCopy';

export const BackgroundRemover: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [targetColor, setTargetColor] = useState<{ r: number; g: number; b: number } | null>(null);
  const [tolerance, setTolerance] = useState<number>(30);
  const [feather, setFeather] = useState<number>(2);
  const [bgColor, setBgColor] = useState<'transparent' | 'white' | 'blue' | 'custom'>('transparent');
  const [customBgHex, setCustomBgHex] = useState<string>('#ffffff');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEyedropperActive, setIsEyedropperActive] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

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
          originalImageRef.current = img;
          // Auto sample top-left corner color as default background
          sampleCornerColor(img);
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    }
  };

  const sampleCornerColor = (img: HTMLImageElement) => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const p = ctx.getImageData(2, 2, 1, 1).data;
    setTargetColor({ r: p[0], g: p[1], b: p[2] });
  };

  const processRemoval = () => {
    if (!originalImageRef.current || !canvasRef.current || !targetColor) return;
    setIsProcessing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = originalImageRef.current;
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    const { r: tr, g: tg, b: tb } = targetColor;
    const tolSq = (tolerance * 2.55) ** 2;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Euclidean color distance in RGB space
      const distSq = (r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2;

      if (distSq <= tolSq) {
        // Pixel matches background target within tolerance
        if (feather > 0) {
          const ratio = Math.sqrt(distSq) / (tolerance * 2.55);
          data[i + 3] = Math.round(255 * (ratio ** (feather + 1)));
        } else {
          data[i + 3] = 0;
        }
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // If non-transparent background chosen
    if (bgColor !== 'transparent') {
      ctx.fillStyle = bgColor === 'white' ? '#ffffff' : bgColor === 'blue' ? '#3b82f6' : customBgHex;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Put keyed image data
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.putImageData(imgData, 0, 0);
      ctx.drawImage(tempCanvas, 0, 0);
    }

    setIsProcessing(false);
  };

  useEffect(() => {
    if (imageSrc && targetColor) {
      processRemoval();
    }
  }, [imageSrc, targetColor, tolerance, feather, bgColor, customBgHex]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isEyedropperActive || !canvasRef.current || !originalImageRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.drawImage(originalImageRef.current, 0, 0);
    const p = tempCtx.getImageData(x, y, 1, 1).data;
    setTargetColor({ r: p[0], g: p[1], b: p[2] });
    setIsEyedropperActive(false);
  };

  const downloadResult = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `supertools-bg-removed.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <div className="p-12 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">
              Upload Photo for Instant Background Removal
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Runs 100% inside your browser. No photos are uploaded to any server. Completely private and safe.
            </p>
          </div>
          <label className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm cursor-pointer shadow-md transition-all">
            Choose Photo
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Canvas Canvas */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden">
            {/* Checkerboard transparent background preview */}
            <div
              className="max-w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200/60 dark:border-slate-800/60"
              style={{
                backgroundImage:
                  bgColor === 'transparent'
                    ? 'repeating-conic-gradient(#cbd5e1 0% 25%, #f1f5f9 0% 50%) 50% / 16px 16px'
                    : 'none'
              }}
            >
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className={`max-h-[480px] max-w-full object-contain block ${
                  isEyedropperActive ? 'cursor-crosshair' : 'cursor-default'
                }`}
              />
            </div>

            {isEyedropperActive && (
              <div className="mt-3 px-4 py-1.5 rounded-full bg-amber-500 text-white text-xs font-semibold animate-pulse shadow-md">
                Click on the background color in the photo above to remove it
              </div>
            )}
          </div>

          {/* Sidebar Controls */}
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-500" />
                Adjust Keying & Edges
              </span>
              <button
                onClick={() => originalImageRef.current && sampleCornerColor(originalImageRef.current)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Auto
              </button>
            </div>

            {/* Target Sample Color */}
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-2">Key Background Color:</span>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-700 shadow-inner"
                  style={{
                    backgroundColor: targetColor
                      ? `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`
                      : '#ffffff'
                  }}
                />
                <button
                  onClick={() => setIsEyedropperActive(!isEyedropperActive)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    isEyedropperActive
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Pipette className="w-3.5 h-3.5" />
                  {isEyedropperActive ? 'Click Image to Pick' : 'Pick from Image'}
                </button>
              </div>
            </div>

            {/* Tolerance Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                <span>Color Tolerance</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{tolerance}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                value={tolerance}
                onChange={(e) => setTolerance(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Edge Feather */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                <span>Edge Softness / Feather</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{feather}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                value={feather}
                onChange={(e) => setFeather(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Replace Background Option */}
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-2">New Background:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setBgColor('transparent')}
                  className={`py-2 rounded-xl text-xs font-bold border ${
                    bgColor === 'transparent'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Transparent
                </button>
                <button
                  onClick={() => setBgColor('white')}
                  className={`py-2 rounded-xl text-xs font-bold border ${
                    bgColor === 'white'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  White
                </button>
                <button
                  onClick={() => setBgColor('blue')}
                  className={`py-2 rounded-xl text-xs font-bold border ${
                    bgColor === 'blue'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Passport Blue
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2">
              <button
                onClick={downloadResult}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                Download Transparent PNG
              </button>

              <label className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center cursor-pointer transition-colors">
                Choose Different Photo
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
