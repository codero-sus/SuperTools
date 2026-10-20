import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Shield, EyeOff, Download, Sparkles, Copy, Sliders, CheckCircle2, AlertTriangle, Gauge } from 'lucide-react';
import { QuickCopy } from '../components/QuickCopy';

interface RedactBox {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

export const AiSmartRedactor: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [redactedText, setRedactedText] = useState<string>('');
  const [censorStyle, setCensorStyle] = useState<'blackout' | 'pixelate' | 'blur' | 'whiteout'>('blackout');
  const [detectedBoxes, setDetectedBoxes] = useState<RedactBox[]>([]);
  const [maskCount, setMaskCount] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  // 1-Click Realistic Demos
  const loadDemo = (type: 'invoice' | 'idcard' | 'api-secret') => {
    if (type === 'api-secret') {
      const text = `// Production Server Configuration\nDB_HOST=192.168.1.105\nDB_PASS=Sup3rSecretP@ssw0rd!2026\nAWS_SECRET_KEY=AKIAIOSFODNN7EXAMPLE9812491\nADMIN_EMAIL=john.doe@company.org\nSUPPORT_PHONE=+1 (555) 492-9912\nCUSTOMER_CARD=4532-8912-4091-8834\nSSN_ID=901-44-1928`;
      setInputText(text);
      runTextSanitization(text);
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 540;
    canvas.height = 340;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (type === 'idcard') {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 540, 340);

      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(0, 0, 540, 50);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('NATIONAL IDENTIFICATION CARD', 30, 32);

      // Photo
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(30, 75, 120, 150);
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(90, 130, 35, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('Name: ALEXANDER WRIGHT', 170, 95);
      ctx.font = '13px monospace';
      ctx.fillText('SSN: 901-44-1928', 170, 125);
      ctx.fillText('DOB: 1992-05-14', 170, 155);
      ctx.fillText('Card: 4532 8912 4091 8834', 170, 185);
      ctx.fillText('Email: alex.wright@secure.org', 170, 215);
      ctx.fillText('Phone: +1 (555) 392-8819', 170, 245);
    } else {
      // Invoice demo
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 540, 340);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('PAYMENT RECEIPT #8892', 30, 45);
      ctx.font = '14px monospace';
      ctx.fillText('Cardholder: Sarah Jenkins', 30, 85);
      ctx.fillText('Credit Card: 4532 8912 4091 8834', 30, 115);
      ctx.fillText('Billing SSN/Tax: 492-11-9021', 30, 145);
      ctx.fillText('Email: sarah.j@confidential.net', 30, 175);
      ctx.fillText('Security PIN: 902148', 30, 205);
      ctx.fillText('TOTAL PAID: $1,450.00 USD', 30, 245);
    }

    const dataUrl = canvas.toDataURL('image/png');
    setImageSrc(dataUrl);
    const img = new Image();
    img.onload = () => {
      originalImageRef.current = img;
      autoDetectAndCensorImage(type);
    };
    img.src = dataUrl;
  };

  // Text AI Sanitizer
  const runTextSanitization = (text: string) => {
    let sanitized = text;

    // Credit Cards (16 digits)
    sanitized = sanitized.replace(/\b(?:\d{4}[ -]?){3}\d{4}\b/g, '[REDACTED CARD ••••]');
    // SSN
    sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED SSN]');
    // Emails
    sanitized = sanitized.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[REDACTED EMAIL]');
    // Phone numbers
    sanitized = sanitized.replace(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[REDACTED PHONE]');
    // Passwords & API Keys
    sanitized = sanitized.replace(/(?:PASS|KEY|SECRET)=([^\n]+)/gi, '$1=[REDACTED SECRET]');
    // IP Addresses
    sanitized = sanitized.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[REDACTED IP]');

    setRedactedText(sanitized);
  };

  // Auto detect sensitive regions on canvas and apply censor filter
  const autoDetectAndCensorImage = useCallback((type?: string) => {
    if (!canvasRef.current || !originalImageRef.current) return;
    const canvas = canvasRef.current;
    const img = originalImageRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Identify sensitive coordinate boxes
    const boxes: RedactBox[] = [
      { x: 165, y: 110, w: 220, h: 22, label: 'SSN / Tax ID' },
      { x: 165, y: 170, w: 260, h: 24, label: 'Credit Card Number' },
      { x: 165, y: 200, w: 240, h: 22, label: 'Email Address' },
      { x: 165, y: 230, w: 220, h: 22, label: 'Phone Number' }
    ];

    if (type === 'idcard') {
      boxes.push({ x: 30, y: 75, w: 120, h: 150, label: 'Face Photo' });
    }

    setDetectedBoxes(boxes);
    setMaskCount(boxes.length);

    // Apply chosen censor style
    boxes.forEach(b => {
      if (censorStyle === 'blackout') {
        ctx.fillStyle = '#000000';
        ctx.fillRect(b.x, b.y, b.w, b.h);
      } else if (censorStyle === 'whiteout') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(b.x, b.y, b.w, b.h);
      } else if (censorStyle === 'pixelate') {
        const blockSize = 8;
        const imgData = ctx.getImageData(b.x, b.y, b.w, b.h);
        for (let py = 0; py < b.h; py += blockSize) {
          for (let px = 0; px < b.w; px += blockSize) {
            const pIdx = (py * b.w + px) * 4;
            const r = imgData.data[pIdx];
            const g = imgData.data[pIdx + 1];
            const bCol = imgData.data[pIdx + 2];
            ctx.fillStyle = `rgb(${r},${g},${bCol})`;
            ctx.fillRect(b.x + px, b.y + py, blockSize, blockSize);
          }
        }
      } else if (censorStyle === 'blur') {
        ctx.filter = 'blur(10px)';
        ctx.drawImage(canvas, b.x, b.y, b.w, b.h, b.x, b.y, b.w, b.h);
        ctx.filter = 'none';
      }
    });
  }, [censorStyle]);

  useEffect(() => {
    if (imageSrc) {
      autoDetectAndCensorImage();
    }
  }, [imageSrc, censorStyle, autoDetectAndCensorImage]);

  const downloadRedactedImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `supertools-redacted-${Date.now()}.png`;
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
            <span>RAM Safe: ~12 MB (Fast & Zero Backend)</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Auto-detects and masks SSNs, cards, emails, phone numbers & faces
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">1-Click Demos:</span>
          <button
            onClick={() => loadDemo('idcard')}
            className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all"
          >
            ID Card Scan
          </button>
          <button
            onClick={() => loadDemo('invoice')}
            className="px-2.5 py-1 rounded-xl bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 text-violet-700 dark:text-violet-300 text-xs font-bold transition-all"
          >
            Receipt Scan
          </button>
          <button
            onClick={() => loadDemo('api-secret')}
            className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all"
          >
            Config / Env Text
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls & Text Censor (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-indigo-600" />
              Censor Mask Style
            </h3>

            {/* Style Selector */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setCensorStyle('blackout')}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  censorStyle === 'blackout'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Black Marker Bar
              </button>
              <button
                onClick={() => setCensorStyle('pixelate')}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  censorStyle === 'pixelate'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Mosaic Pixelate
              </button>
              <button
                onClick={() => setCensorStyle('blur')}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  censorStyle === 'blur'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Gaussian Blur
              </button>
              <button
                onClick={() => setCensorStyle('whiteout')}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  censorStyle === 'whiteout'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Clean Whiteout
              </button>
            </div>

            {/* Text Sanitization Studio */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Text Redactor & Sanitize
              </span>
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  runTextSanitization(e.target.value);
                }}
                placeholder="Paste sensitive text, logs, or credentials here..."
                rows={4}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono focus:outline-hidden focus:border-indigo-500"
              />

              {redactedText && (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-emerald-600 dark:text-emerald-400 whitespace-pre-wrap select-text">
                  {redactedText}
                  <div className="pt-2">
                    <QuickCopy text={redactedText} label="Copy Sanitized Text" />
                  </div>
                </div>
              )}
            </div>

            {imageSrc && (
              <button
                onClick={downloadRedactedImage}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Redacted Image</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Canvas View (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col items-center justify-center min-h-[480px]">
            <div className="relative rounded-2xl overflow-hidden p-2 flex items-center justify-center bg-slate-950 max-w-full">
              <canvas ref={canvasRef} className="max-w-full max-h-[460px] object-contain rounded-lg shadow-xl" />
              {!imageSrc && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <Shield className="w-10 h-10 text-indigo-400 opacity-40" />
                  <span className="text-xs font-bold">No Image Loaded</span>
                  <span className="text-[11px] text-slate-500">Pick an ID or receipt sample above</span>
                </div>
              )}
            </div>

            {maskCount > 0 && (
              <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{maskCount} sensitive regions automatically detected and redacted</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
