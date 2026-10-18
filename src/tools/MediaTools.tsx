import React, { useState, useRef, useEffect } from 'react';
import { QuickCopy } from '../components/QuickCopy';
import { Image, Upload, Download, Sliders, RefreshCw } from 'lucide-react';

interface MediaToolsProps {
  mode?: 'resizer' | 'filter' | 'aspect' | 'base64' | 'screen';
}

export const MediaTools: React.FC<MediaToolsProps> = ({ mode = 'resizer' }) => {
  // Common image state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imgWidth, setImgWidth] = useState(800);
  const [imgHeight, setImgHeight] = useState(600);
  const [aspectLocked, setAspectLocked] = useState(true);
  const [exportFormat, setExportFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');

  // Filter studio state
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [blur, setBlur] = useState(0);

  // Aspect ratio state
  const [arWidth, setArWidth] = useState(1920);
  const [arHeight, setArHeight] = useState(1080);
  const [newWidth, setNewWidth] = useState(1280);

  // Screen specs
  const [screenInfo, setScreenInfo] = useState({
    width: window.screen.width,
    height: window.screen.height,
    availWidth: window.screen.availWidth,
    availHeight: window.screen.availHeight,
    colorDepth: window.screen.colorDepth,
    pixelRatio: window.devicePixelRatio,
    orientation: window.screen.orientation?.type || 'landscape-primary'
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setSelectedImage(src);
        const img = new window.Image();
        img.src = src;
        img.onload = () => {
          imageObjRef.current = img;
          setImgWidth(img.width);
          setImgHeight(img.height);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWidthChange = (w: number) => {
    setImgWidth(w);
    if (aspectLocked && imageObjRef.current) {
      const ratio = imageObjRef.current.height / imageObjRef.current.width;
      setImgHeight(Math.round(w * ratio));
    }
  };

  const handleHeightChange = (h: number) => {
    setImgHeight(h);
    if (aspectLocked && imageObjRef.current) {
      const ratio = imageObjRef.current.width / imageObjRef.current.height;
      setImgWidth(Math.round(h * ratio));
    }
  };

  const handleDownloadProcessed = () => {
    if (!selectedImage) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = imgWidth;
    canvas.height = imgHeight;

    if (mode === 'filter') {
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px)`;
    }

    const img = new window.Image();
    img.src = selectedImage;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
      const dataUrl = canvas.toDataURL(exportFormat);
      const a = document.createElement('a');
      a.href = dataUrl;
      const ext = exportFormat === 'image/jpeg' ? 'jpg' : exportFormat === 'image/webp' ? 'webp' : 'png';
      a.download = `supertools-image.${ext}`;
      a.click();
    };
  };

  // Calculate Aspect Ratio GCD
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(arWidth, arHeight);
  const ratioX = divisor > 0 ? arWidth / divisor : 16;
  const ratioY = divisor > 0 ? arHeight / divisor : 9;
  const calculatedHeight = Math.round((newWidth * arHeight) / (arWidth || 1));

  return (
    <div className="space-y-6">
      {/* Resizer & Format Converter */}
      {(mode === 'resizer' || mode === 'filter') && (
        <div className="space-y-6">
          {!selectedImage ? (
            <div className="p-12 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                  Select an image from your computer
                </h3>
                <p className="text-xs text-slate-400">
                  100% Client-Side. No images are ever uploaded to any server.
                </p>
              </div>
              <label className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm cursor-pointer shadow-sm">
                Choose Image File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Preview & Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center min-h-[300px]">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    style={{
                      filter: mode === 'filter' ? `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px)` : 'none',
                      maxHeight: '400px',
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }}
                    className="rounded-2xl shadow-md"
                  />
                  <div className="mt-4 flex gap-3">
                    <label className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                      Change Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Sidebar Controls */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                  {mode === 'resizer' && (
                    <div className="space-y-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                        Dimensions
                      </span>
                      <div>
                        <label className="text-xs font-medium text-slate-500 block mb-1">Width (px)</label>
                        <input
                          type="number"
                          value={imgWidth}
                          onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-500 block mb-1">Height (px)</label>
                        <input
                          type="number"
                          value={imgHeight}
                          onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm font-bold"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={aspectLocked}
                          onChange={(e) => setAspectLocked(e.target.checked)}
                          className="rounded text-indigo-600"
                        />
                        Lock Aspect Ratio
                      </label>
                    </div>
                  )}

                  {mode === 'filter' && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                        Filter Adjustments
                      </span>
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Brightness</span>
                          <span className="font-mono">{brightness}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={brightness}
                          onChange={(e) => setBrightness(parseInt(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Contrast</span>
                          <span className="font-mono">{contrast}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={contrast}
                          onChange={(e) => setContrast(parseInt(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Grayscale</span>
                          <span className="font-mono">{grayscale}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={grayscale}
                          onChange={(e) => setGrayscale(parseInt(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Sepia</span>
                          <span className="font-mono">{sepia}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={sepia}
                          onChange={(e) => setSepia(parseInt(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-500 block mb-1">Output Format</label>
                      <select
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                      >
                        <option value="image/png">PNG (.png)</option>
                        <option value="image/jpeg">JPEG (.jpg)</option>
                        <option value="image/webp">WEBP (.webp)</option>
                      </select>
                    </div>

                    <button
                      onClick={handleDownloadProcessed}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Save & Download Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Aspect Ratio Calculator */}
      {mode === 'aspect' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Original Resolution
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Original Width (px)</label>
                <input
                  type="number"
                  value={arWidth}
                  onChange={(e) => setArWidth(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Original Height (px)</label>
                <input
                  type="number"
                  value={arHeight}
                  onChange={(e) => setArHeight(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold block">Aspect Ratio</span>
                <span className="font-mono text-xl font-black text-indigo-700 dark:text-indigo-300">
                  {ratioX}:{ratioY}
                </span>
              </div>
              <div className="flex gap-2">
                {[[16, 9], [4, 3], [1, 1], [21, 9], [9, 16]].map(([x, y]) => (
                  <button
                    key={`${x}:${y}`}
                    onClick={() => {
                      setArWidth(x * 100);
                      setArHeight(y * 100);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    {x}:{y}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Calculate New Proportional Height
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">New Width (px)</label>
                  <input
                    type="number"
                    value={newWidth}
                    onChange={(e) => setNewWidth(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Calculated Height (px)</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/40 font-mono text-base font-black text-indigo-600 dark:text-indigo-400">
                    {calculatedHeight}px
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen Specs */}
      {mode === 'screen' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400 block">Screen Resolution</span>
            <span className="font-mono text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">
              {screenInfo.width} × {screenInfo.height}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400 block">Available Screen</span>
            <span className="font-mono text-2xl font-black text-slate-800 dark:text-white mt-1 block">
              {screenInfo.availWidth} × {screenInfo.availHeight}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400 block">Device Pixel Ratio (DPR)</span>
            <span className="font-mono text-2xl font-black text-emerald-600 mt-1 block">
              {screenInfo.pixelRatio}x Retina
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400 block">Color Depth</span>
            <span className="font-mono text-2xl font-black text-slate-800 dark:text-white mt-1 block">
              {screenInfo.colorDepth}-bit
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400 block">Orientation</span>
            <span className="font-mono text-xl font-bold text-slate-800 dark:text-white mt-1 block">
              {screenInfo.orientation}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
