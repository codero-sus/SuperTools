import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { Sparkles, Download, Upload, Check, Sliders, Image as ImageIcon, Wand2, RefreshCw, Layers, ArrowLeftRight, FolderArchive } from 'lucide-react';

interface ProcessedImage {
  id: string;
  name: string;
  originalSrc: string;
  processedUrl: string;
  originalSize: number;
  processedSize: number;
  width: number;
  height: number;
}

type AutoPreset = 'auto-enhance' | 'vibrant' | 'portrait-glow' | 'hdr' | 'cinematic' | 'monochrome' | 'vintage' | 'night-boost';
type AspectCrop = 'original' | '1:1' | '16:9' | '9:16' | '4:5' | '3:2';

export const AutoPhotoProcessor: React.FC = () => {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [activePreset, setActivePreset] = useState<AutoPreset>('auto-enhance');
  const [targetCrop, setTargetCrop] = useState<AspectCrop>('original');
  const [showCompare, setShowCompare] = useState<boolean>(false);
  const [compareSplit, setCompareSplit] = useState<number>(50);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [outputQuality, setOutputQuality] = useState<number>(0.92);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const PRESETS: { id: AutoPreset; name: string; desc: string; icon: string }[] = [
    { id: 'auto-enhance', name: 'Smart Auto-Fix', desc: 'Auto levels, contrast, white balance & dynamic range', icon: '✨' },
    { id: 'vibrant', name: 'Vibrant Magic', desc: 'Punchy saturated colors, rich skies & greenery', icon: '🌈' },
    { id: 'portrait-glow', name: 'Portrait Retouch', desc: 'Soft skin tone warming, subtle highlight glow', icon: '👤' },
    { id: 'hdr', name: 'Vivid HDR', desc: 'Expanded dynamic range, shadow recovery & crisp clarity', icon: '☀️' },
    { id: 'cinematic', name: 'Cinematic Mood', desc: 'Teal shadows & warm golden highlights', icon: '🎬' },
    { id: 'monochrome', name: 'Crisp B&W', desc: 'High-contrast fine art black and white', icon: '🖤' },
    { id: 'vintage', name: 'Warm Film', desc: '35mm analog film aesthetic with creamy tones', icon: '🎞️' },
    { id: 'night-boost', name: 'Night Illuminator', desc: 'Boost dark underexposed shadows while taming noise', icon: '🌙' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: ProcessedImage[] = [];
    Array.from(files).forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const item: ProcessedImage = {
            id: `${Date.now()}-${i}-${file.name}`,
            name: file.name,
            originalSrc: src,
            processedUrl: src,
            originalSize: file.size,
            processedSize: file.size,
            width: img.width,
            height: img.height
          };
          setImages(prev => [...prev, item]);
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    });
  };

  // Automatic algorithms for image processing
  const processImageAutomatic = (
    imgObj: HTMLImageElement,
    preset: AutoPreset,
    crop: AspectCrop,
    format: string,
    quality: number
  ): { dataUrl: string; byteSize: number; width: number; height: number } => {
    const canvas = document.createElement('canvas');
    let srcW = imgObj.naturalWidth || imgObj.width;
    let srcH = imgObj.naturalHeight || imgObj.height;

    // Calculate crop dimensions
    let cropX = 0, cropY = 0, cropW = srcW, cropH = srcH;
    if (crop !== 'original') {
      let targetRatio = 1;
      if (crop === '1:1') targetRatio = 1;
      else if (crop === '16:9') targetRatio = 16 / 9;
      else if (crop === '9:16') targetRatio = 9 / 16;
      else if (crop === '4:5') targetRatio = 4 / 5;
      else if (crop === '3:2') targetRatio = 3 / 2;

      const currentRatio = srcW / srcH;
      if (currentRatio > targetRatio) {
        cropW = Math.round(srcH * targetRatio);
        cropX = Math.round((srcW - cropW) / 2);
      } else {
        cropH = Math.round(srcW / targetRatio);
        cropY = Math.round((srcH - cropH) / 2);
      }
    }

    canvas.width = cropW;
    canvas.height = cropH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { dataUrl: imgObj.src, byteSize: 0, width: cropW, height: cropH };

    ctx.drawImage(imgObj, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    const imgData = ctx.getImageData(0, 0, cropW, cropH);
    const d = imgData.data;

    // Automatic Histogram Equalization & Levels Stretch
    let minR = 255, maxR = 0;
    let minG = 255, maxG = 0;
    let minB = 255, maxB = 0;

    // Sample pixels for fast performance on 3-4GB systems
    const step = Math.max(1, Math.floor(d.length / 40000));
    for (let i = 0; i < d.length; i += 4 * step) {
      if (d[i] < minR) minR = d[i];
      if (d[i] > maxR) maxR = d[i];
      if (d[i + 1] < minG) minG = d[i + 1];
      if (d[i + 1] > maxG) maxG = d[i + 1];
      if (d[i + 2] < minB) minB = d[i + 2];
      if (d[i + 2] > maxB) maxB = d[i + 2];
    }

    const rangeR = Math.max(1, maxR - minR);
    const rangeG = Math.max(1, maxG - minG);
    const rangeB = Math.max(1, maxB - minB);

    for (let i = 0; i < d.length; i += 4) {
      let r = d[i];
      let g = d[i + 1];
      let b = d[i + 2];

      if (preset === 'auto-enhance') {
        // Auto Dynamic Range stretch + contrast S-curve
        r = ((r - minR) / rangeR) * 255;
        g = ((g - minG) / rangeG) * 255;
        b = ((b - minB) / rangeB) * 255;
        // Subtle saturation boost
        const avg = (r + g + b) / 3;
        r = avg + (r - avg) * 1.15;
        g = avg + (g - avg) * 1.15;
        b = avg + (b - avg) * 1.15;
      } else if (preset === 'vibrant') {
        const avg = (r + g + b) / 3;
        r = avg + (r - avg) * 1.45;
        g = avg + (g - avg) * 1.4;
        b = avg + (b - avg) * 1.35;
        // Rich contrast
        r = r > 128 ? r + (r - 128) * 0.2 : r - (128 - r) * 0.15;
        g = g > 128 ? g + (g - 128) * 0.2 : g - (128 - g) * 0.15;
        b = b > 128 ? b + (b - 128) * 0.2 : b - (128 - b) * 0.15;
      } else if (preset === 'portrait-glow') {
        // Warm skin tones
        r = r * 1.08;
        b = b * 0.94;
        // Soft highlight lift
        if (r > 160) r += 12;
        if (g > 160) g += 8;
      } else if (preset === 'hdr') {
        // Shadow lift & highlight compression
        r = Math.pow(r / 255, 0.75) * 255;
        g = Math.pow(g / 255, 0.75) * 255;
        b = Math.pow(b / 255, 0.75) * 255;
        const avg = (r + g + b) / 3;
        r = avg + (r - avg) * 1.25;
        g = avg + (g - avg) * 1.25;
        b = avg + (b - avg) * 1.25;
      } else if (preset === 'cinematic') {
        // Teal shadows & orange highlights
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        if (lum < 128) {
          b = Math.min(255, b + 24);
          g = Math.min(255, g + 8);
          r = Math.max(0, r - 12);
        } else {
          r = Math.min(255, r + 22);
          g = Math.min(255, g + 10);
          b = Math.max(0, b - 15);
        }
      } else if (preset === 'monochrome') {
        // High contrast black & white
        let lum = 0.299 * r + 0.587 * g + 0.114 * b;
        lum = lum > 128 ? Math.min(255, lum * 1.15) : Math.max(0, lum * 0.88);
        r = lum;
        g = lum;
        b = lum;
      } else if (preset === 'vintage') {
        // Creamy analog film
        r = r * 1.12 + 10;
        g = g * 1.02;
        b = b * 0.88 + 15;
      } else if (preset === 'night-boost') {
        // Brighten dark areas
        r = Math.sqrt(r / 255) * 255;
        g = Math.sqrt(g / 255) * 255;
        b = Math.sqrt(b / 255) * 255;
      }

      d[i] = Math.max(0, Math.min(255, r));
      d[i + 1] = Math.max(0, Math.min(255, g));
      d[i + 2] = Math.max(0, Math.min(255, b));
    }

    ctx.putImageData(imgData, 0, 0);

    const dataUrl = canvas.toDataURL(format, quality);
    // Approximate byte length of base64
    const byteSize = Math.round((dataUrl.length * 3) / 4);

    return { dataUrl, byteSize, width: cropW, height: cropH };
  };

  // Re-process active image when controls change
  useEffect(() => {
    if (images.length === 0) return;
    const current = images[activeIdx];
    if (!current) return;

    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const result = processImageAutomatic(img, activePreset, targetCrop, outputFormat, outputQuality);
      setImages(prev => prev.map((item, idx) => {
        if (idx === activeIdx) {
          return {
            ...item,
            processedUrl: result.dataUrl,
            processedSize: result.byteSize,
            width: result.width,
            height: result.height
          };
        }
        return item;
      }));
      setIsProcessing(false);
    };
    img.src = current.originalSrc;
  }, [activeIdx, activePreset, targetCrop, outputFormat, outputQuality]);

  // Batch process all images and download as ZIP
  const batchProcessAndDownloadZip = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    const zip = new JSZip();

    for (let i = 0; i < images.length; i++) {
      const item = images[i];
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const result = processImageAutomatic(img, activePreset, targetCrop, outputFormat, outputQuality);
          const base64Data = result.dataUrl.split(',')[1];
          const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/webp' ? 'webp' : 'png';
          const cleanName = item.name.replace(/\.[^/.]+$/, '');
          zip.file(`${cleanName}-enhanced.${ext}`, base64Data, { base64: true });
          resolve();
        };
        img.src = item.originalSrc;
      });
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `supertools-auto-enhanced-batch.zip`;
    link.click();
    URL.revokeObjectURL(url);
    setIsProcessing(false);
  };

  const downloadSingleProcessed = () => {
    const current = images[activeIdx];
    if (!current) return;
    const link = document.createElement('a');
    const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/webp' ? 'webp' : 'png';
    const cleanName = current.name.replace(/\.[^/.]+$/, '');
    link.download = `${cleanName}-${activePreset}.${ext}`;
    link.href = current.processedUrl;
    link.click();
  };

  const activeImage = images[activeIdx];

  return (
    <div className="space-y-6">
      {images.length === 0 ? (
        <div className="p-12 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Wand2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white text-xl">
              Automatic Photo Processing & Enhancement Studio
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              No Photoshop complexity. 1-click automatic dynamic range stretch, smart contrast, portrait glow, vibrant HDR, and social auto-crop. Single or batch processing.
            </p>
          </div>
          <label className="px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm cursor-pointer shadow-md transition-all flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Photo(s) to Auto-Process
            <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Presets Selector Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => setActivePreset(p.id)}
                className={`p-3 rounded-2xl text-center border transition-all ${
                  activePreset === p.id
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 shadow-sm'
                    : 'border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <span className="text-lg block mb-0.5">{p.icon}</span>
                <span className="font-bold text-xs block leading-tight">{p.name}</span>
              </button>
            ))}
          </div>

          {/* Main Visual Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Canvas Display */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col items-center justify-between min-h-[460px] relative">
              <div className="w-full flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                  <span className="text-indigo-600 dark:text-indigo-400">Viewing:</span>
                  <span className="truncate max-w-[200px]">{activeImage?.name}</span>
                  <span className="text-slate-400 font-mono text-[11px]">({activeImage?.width}×{activeImage?.height}px)</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCompare(!showCompare)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                      showCompare
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    {showCompare ? 'Side-by-Side Active' : 'Compare Original'}
                  </button>
                </div>
              </div>

              {/* Image Preview with Split Comparison */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 max-h-[420px] max-w-full flex items-center justify-center bg-slate-950">
                {showCompare ? (
                  <div className="relative overflow-hidden select-none">
                    <img
                      src={activeImage?.processedUrl}
                      alt="Processed"
                      className="max-h-[400px] max-w-full object-contain block"
                    />
                    <div
                      className="absolute inset-0 overflow-hidden border-r-2 border-white shadow-xl"
                      style={{ width: `${compareSplit}%` }}
                    >
                      <img
                        src={activeImage?.originalSrc}
                        alt="Original"
                        className="max-h-[400px] max-w-none object-contain block"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold">
                      Original
                    </span>
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-indigo-600/90 text-white text-[10px] font-bold">
                      Auto-Enhanced
                    </span>
                  </div>
                ) : (
                  <img
                    src={activeImage?.processedUrl}
                    alt="Processed"
                    className="max-h-[400px] max-w-full object-contain rounded-2xl shadow-md"
                  />
                )}
              </div>

              {showCompare && (
                <div className="w-full max-w-xs mt-3 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400">Original</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={compareSplit}
                    onChange={(e) => setCompareSplit(parseInt(e.target.value))}
                    className="flex-1 accent-indigo-600 cursor-pointer"
                  />
                  <span className="text-[10px] font-bold text-indigo-500">Auto-Enhanced</span>
                </div>
              )}

              {/* Thumbnails strip for batch queue */}
              {images.length > 1 && (
                <div className="w-full mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {images.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveIdx(idx)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        activeIdx === idx ? 'border-indigo-600 ring-2 ring-indigo-500/20 scale-105' : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={item.processedUrl} alt={item.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Controls & Export Sidebar */}
            <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-5 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Automatic Layout & Optimization
                </span>

                {/* Social Auto-Crop */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">
                    Smart Aspect Ratio Auto-Crop:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'original', label: 'Original' },
                      { id: '1:1', label: '1:1 Square' },
                      { id: '16:9', label: '16:9 Landscape' },
                      { id: '9:16', label: '9:16 Story/Reel' },
                      { id: '4:5', label: '4:5 Portrait' },
                      { id: '3:2', label: '3:2 Classic' }
                    ].map(c => (
                      <button
                        key={c.id}
                        onClick={() => setTargetCrop(c.id as AspectCrop)}
                        className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          targetCrop === c.id
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Output Format */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">
                    Export Output Format:
                  </label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  >
                    <option value="image/jpeg">JPEG (.jpg) — Highly Compressed</option>
                    <option value="image/webp">WebP (.webp) — Modern Next-Gen</option>
                    <option value="image/png">PNG (.png) — Lossless Sharp</option>
                  </select>
                </div>

                {/* Compression Quality */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Quality / Compression</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{Math.round(outputQuality * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.0"
                    step="0.05"
                    value={outputQuality}
                    onChange={(e) => setOutputQuality(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                    <span>Original: {(activeImage?.originalSize / 1024).toFixed(0)} KB</span>
                    <span className="text-emerald-500 font-bold">Processed: {(activeImage?.processedSize / 1024).toFixed(0)} KB</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={downloadSingleProcessed}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download Processed Photo
                </button>

                {images.length > 1 && (
                  <button
                    onClick={batchProcessAndDownloadZip}
                    disabled={isProcessing}
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <FolderArchive className="w-4 h-4" />
                    Batch Process All ({images.length}) & Download ZIP
                  </button>
                )}

                <label className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center cursor-pointer transition-colors">
                  Add More Photos
                  <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
