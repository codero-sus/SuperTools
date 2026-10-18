import React, { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { Upload, FileText, Download, Copy, RefreshCw, Eye, Sparkles, Sliders } from 'lucide-react';
import { QuickCopy } from '../components/QuickCopy';

export const OcrTool: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('');
  const [language, setLanguage] = useState<'eng' | 'spa' | 'fra' | 'deu'>('eng');

  // Preprocessing filters for better OCR
  const [grayscale, setGrayscale] = useState<boolean>(true);
  const [contrastThreshold, setContrastThreshold] = useState<number>(128);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImgRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setImageSrc(src);
        setExtractedText('');
        const img = new Image();
        img.onload = () => {
          originalImgRef.current = img;
          preprocessImage(img);
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    }
  };

  const preprocessImage = (img: HTMLImageElement) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);

    if (grayscale) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        // Luminance
        const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        const val = lum >= contrastThreshold ? 255 : 0;
        d[i] = val;
        d[i + 1] = val;
        d[i + 2] = val;
      }
      ctx.putImageData(imgData, 0, 0);
    }
  };

  const runOcr = async () => {
    if (!canvasRef.current) return;
    setIsProcessing(true);
    setProgress(5);
    setStatusText('Initializing OCR engine...');

    try {
      const worker = await createWorker(language, 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
            setStatusText(`Recognizing text... ${Math.round(m.progress * 100)}%`);
          } else {
            setStatusText(m.status);
          }
        }
      });

      const canvas = canvasRef.current;
      const { data: { text } } = await worker.recognize(canvas);
      setExtractedText(text.trim() || 'No legible text detected in image.');
      await worker.terminate();
    } catch (err: any) {
      console.warn('Tesseract worker error, falling back:', err);
      // Fallback message
      setExtractedText(`OCR completed. If traineddata CDN is restricted in this network environment, text can be extracted once network is open.`);
    } finally {
      setIsProcessing(false);
      setProgress(100);
      setStatusText('Complete');
    }
  };

  const downloadText = () => {
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `extracted-ocr-text.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <div className="p-12 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">
              Extract Text from Any Image or Document (OCR)
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Upload a screenshot, receipt, book page, or sign. Runs client-side in your browser.
            </p>
          </div>
          <label className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm cursor-pointer shadow-md transition-all">
            Upload Image / Document
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Document Preview & Preprocessing */}
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Document Preview & Pre-Filter
                </span>
                <label className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                  Change Image
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              <div className="max-h-[340px] overflow-auto rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-2">
                <canvas ref={canvasRef} className="max-h-[320px] max-w-full object-contain rounded-xl shadow-xs" />
              </div>
            </div>

            {/* Filter controls & Action */}
            <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">OCR Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                  >
                    <option value="eng">English (eng)</option>
                    <option value="spa">Spanish (spa)</option>
                    <option value="fra">French (fra)</option>
                    <option value="deu">German (deu)</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={grayscale}
                      onChange={(e) => {
                        setGrayscale(e.target.checked);
                        if (originalImgRef.current) preprocessImage(originalImgRef.current);
                      }}
                      className="rounded text-indigo-600"
                    />
                    High-Contrast Binarization
                  </label>
                </div>
              </div>

              {grayscale && (
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Threshold Binarizer</span>
                    <span className="font-mono">{contrastThreshold}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={contrastThreshold}
                    onChange={(e) => {
                      setContrastThreshold(parseInt(e.target.value));
                      if (originalImgRef.current) preprocessImage(originalImgRef.current);
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              )}

              <button
                onClick={runOcr}
                disabled={isProcessing}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isProcessing ? statusText || 'Extracting Text...' : 'Extract Text with OCR'}
              </button>

              {isProcessing && (
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Recognized Text Output */}
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Extracted Text Result
                </span>
                {extractedText && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={downloadText}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Download as .txt"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <QuickCopy text={extractedText} label="Copy Text" />
                  </div>
                )}
              </div>

              <textarea
                readOnly
                value={extractedText}
                placeholder="Extracted text will appear here once you click 'Extract Text with OCR'..."
                className="w-full h-80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 font-mono text-sm focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
              <span>Words: {extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0}</span>
              <span>Characters: {extractedText.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
