import React, { useState, useMemo } from 'react';
import { QuickCopy } from '../components/QuickCopy';
import { Palette, CheckCircle, XCircle, Sliders, Eye } from 'lucide-react';

interface ColorToolsProps {
  mode?: 'converter' | 'palette' | 'contrast' | 'gradient' | 'shades';
}

export const ColorTools: React.FC<ColorToolsProps> = ({ mode = 'converter' }) => {
  // Common color state
  const [hexColor, setHexColor] = useState('#6366f1');
  const [bgHex, setBgHex] = useState('#ffffff');
  const [fgHex, setFgHex] = useState('#0f172a');

  // Gradient state
  const [gradColor1, setGradColor1] = useState('#4f46e5');
  const [gradColor2, setGradColor2] = useState('#ec4899');
  const [gradAngle, setGradAngle] = useState(135);

  // Helper conversions
  const hexToRgb = (hex: string) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    }
    const num = parseInt(clean, 16) || 0;
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, Math.min(m, y));
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    c = Math.round(((c - k) / (1 - k)) * 100);
    m = Math.round(((m - k) / (1 - k)) * 100);
    y = Math.round(((y - k) / (1 - k)) * 100);
    k = Math.round(k * 100);
    return { c, m, y, k };
  };

  // Luminance & Contrast
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const contrastRatio = useMemo(() => {
    const rgbFg = hexToRgb(fgHex);
    const rgbBg = hexToRgb(bgHex);
    const l1 = getLuminance(rgbFg.r, rgbFg.g, rgbFg.b);
    const l2 = getLuminance(rgbBg.r, rgbBg.g, rgbBg.b);
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return ((brightest + 0.05) / (darkest + 0.05)).toFixed(2);
  }, [fgHex, bgHex]);

  // Conversions for active hex
  const activeRgb = hexToRgb(hexColor);
  const activeHsl = rgbToHsl(activeRgb.r, activeRgb.g, activeRgb.b);
  const activeCmyk = rgbToCmyk(activeRgb.r, activeRgb.g, activeRgb.b);

  // Palettes (Complementary, Triadic, Analogous)
  const palette = useMemo(() => {
    const hslToHex = (h: number, s: number, l: number) => {
      l /= 100;
      const a = s * Math.min(l, 1 - l) / 100;
      const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    };

    const h = activeHsl.h;
    const s = activeHsl.s;
    const l = activeHsl.l;

    return {
      complementary: [hexColor, hslToHex((h + 180) % 360, s, l)],
      analogous: [hslToHex((h + 330) % 360, s, l), hexColor, hslToHex((h + 30) % 360, s, l)],
      triadic: [hexColor, hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)],
      tetradic: [hexColor, hslToHex((h + 90) % 360, s, l), hslToHex((h + 180) % 360, s, l), hslToHex((h + 270) % 360, s, l)]
    };
  }, [hexColor, activeHsl]);

  // Shades and tints
  const shadesAndTints = useMemo(() => {
    const tints = [];
    const shades = [];
    for (let i = 1; i <= 5; i++) {
      const tintFactor = i * 0.16;
      tints.push({
        label: `Tint ${i * 15}%`,
        r: Math.round(activeRgb.r + (255 - activeRgb.r) * tintFactor),
        g: Math.round(activeRgb.g + (255 - activeRgb.g) * tintFactor),
        b: Math.round(activeRgb.b + (255 - activeRgb.b) * tintFactor)
      });
      const shadeFactor = 1 - (i * 0.16);
      shades.push({
        label: `Shade ${i * 15}%`,
        r: Math.round(activeRgb.r * shadeFactor),
        g: Math.round(activeRgb.g * shadeFactor),
        b: Math.round(activeRgb.b * shadeFactor)
      });
    }
    const toHex = (r: number, g: number, b: number) =>
      `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    return {
      tints: tints.map(t => ({ ...t, hex: toHex(t.r, t.g, t.b) })),
      shades: shades.map(s => ({ ...s, hex: toHex(s.r, s.g, s.b) }))
    };
  }, [activeRgb]);

  const gradientCss = `linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2})`;

  return (
    <div className="space-y-6">
      {/* Mode: Color Converter */}
      {(mode === 'converter' || mode === 'shades') && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center gap-6">
            <input
              type="color"
              value={hexColor}
              onChange={(e) => setHexColor(e.target.value)}
              className="w-24 h-24 rounded-2xl cursor-pointer border-0 p-0 bg-transparent"
            />
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Select or type hex code</span>
              <input
                type="text"
                value={hexColor}
                onChange={(e) => setHexColor(e.target.value)}
                className="w-full max-w-xs px-4 py-2 rounded-xl font-mono text-xl font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 uppercase"
              />
            </div>
          </div>

          {/* Color Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">HEX</span>
                <span className="text-sm font-mono font-bold block mt-0.5">{hexColor.toUpperCase()}</span>
              </div>
              <QuickCopy text={hexColor.toUpperCase()} size="sm" />
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">RGB</span>
                <span className="text-sm font-mono font-bold block mt-0.5">rgb({activeRgb.r}, {activeRgb.g}, {activeRgb.b})</span>
              </div>
              <QuickCopy text={`rgb(${activeRgb.r}, ${activeRgb.g}, ${activeRgb.b})`} size="sm" />
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">HSL</span>
                <span className="text-sm font-mono font-bold block mt-0.5">hsl({activeHsl.h}, {activeHsl.s}%, {activeHsl.l}%)</span>
              </div>
              <QuickCopy text={`hsl(${activeHsl.h}, ${activeHsl.s}%, ${activeHsl.l}%)`} size="sm" />
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CMYK</span>
                <span className="text-sm font-mono font-bold block mt-0.5">cmyk({activeCmyk.c}%, {activeCmyk.m}%, {activeCmyk.y}%, {activeCmyk.k}%)</span>
              </div>
              <QuickCopy text={`cmyk(${activeCmyk.c}%, ${activeCmyk.m}%, ${activeCmyk.y}%, ${activeCmyk.k}%)`} size="sm" />
            </div>
          </div>

          {/* Shades & Tints */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Tints (Lighter) & Shades (Darker)
            </span>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {shadesAndTints.tints.map((t, idx) => (
                <button
                  key={`tint-${idx}`}
                  onClick={() => setHexColor(t.hex)}
                  style={{ backgroundColor: t.hex }}
                  className="h-16 rounded-xl border border-black/10 flex flex-col justify-end p-1 text-[9px] font-mono text-black font-semibold text-center truncate hover:scale-105 transition-transform"
                >
                  {t.hex}
                </button>
              ))}
              {shadesAndTints.shades.map((s, idx) => (
                <button
                  key={`shade-${idx}`}
                  onClick={() => setHexColor(s.hex)}
                  style={{ backgroundColor: s.hex }}
                  className="h-16 rounded-xl border border-black/10 flex flex-col justify-end p-1 text-[9px] font-mono text-white font-semibold text-center truncate hover:scale-105 transition-transform"
                >
                  {s.hex}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mode: Contrast Checker */}
      {mode === 'contrast' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <input
                type="color"
                value={fgHex}
                onChange={(e) => setFgHex(e.target.value)}
                className="w-14 h-14 rounded-xl cursor-pointer border-0"
              />
              <div>
                <span className="text-xs font-semibold text-slate-400 block">Foreground / Text Color</span>
                <input
                  type="text"
                  value={fgHex}
                  onChange={(e) => setFgHex(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm font-bold mt-1 uppercase"
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <input
                type="color"
                value={bgHex}
                onChange={(e) => setBgHex(e.target.value)}
                className="w-14 h-14 rounded-xl cursor-pointer border-0"
              />
              <div>
                <span className="text-xs font-semibold text-slate-400 block">Background Color</span>
                <input
                  type="text"
                  value={bgHex}
                  onChange={(e) => setBgHex(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm font-bold mt-1 uppercase"
                />
              </div>
            </div>
          </div>

          {/* Contrast Ratio & WCAG Card */}
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6"
               style={{ backgroundColor: bgHex, color: fgHex }}>
            <div className="space-y-1">
              <h3 className="text-2xl font-black">Live Contrast Text Sample</h3>
              <p className="text-sm opacity-90 max-w-md">
                Good typography requires adequate contrast between text and background for legibility and visual ergonomics.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md text-center min-w-[140px]">
              <span className="text-xs font-bold uppercase tracking-wider block opacity-75">Contrast Ratio</span>
              <span className="font-mono text-3xl font-black block mt-0.5">{contrastRatio}:1</span>
            </div>
          </div>

          {/* WCAG Pass/Fail Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">WCAG AA Normal</span>
              {parseFloat(contrastRatio) >= 4.5 ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-sm">
                  <CheckCircle className="w-4 h-4" /> PASS
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-rose-500 font-bold text-sm">
                  <XCircle className="w-4 h-4" /> FAIL
                </span>
              )}
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">WCAG AA Large</span>
              {parseFloat(contrastRatio) >= 3.0 ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-sm">
                  <CheckCircle className="w-4 h-4" /> PASS
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-rose-500 font-bold text-sm">
                  <XCircle className="w-4 h-4" /> FAIL
                </span>
              )}
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">WCAG AAA Normal</span>
              {parseFloat(contrastRatio) >= 7.0 ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-sm">
                  <CheckCircle className="w-4 h-4" /> PASS
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-rose-500 font-bold text-sm">
                  <XCircle className="w-4 h-4" /> FAIL
                </span>
              )}
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">WCAG AAA Large</span>
              {parseFloat(contrastRatio) >= 4.5 ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-sm">
                  <CheckCircle className="w-4 h-4" /> PASS
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-rose-500 font-bold text-sm">
                  <XCircle className="w-4 h-4" /> FAIL
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode: CSS Gradient Generator */}
      {mode === 'gradient' && (
        <div className="space-y-6">
          <div className="h-56 rounded-3xl shadow-md border border-slate-200/80 dark:border-slate-800"
               style={{ background: gradientCss }} />

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={gradColor1}
                  onChange={(e) => setGradColor1(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer"
                />
                <div>
                  <span className="text-xs text-slate-400 block">Color 1</span>
                  <span className="font-mono text-sm font-bold">{gradColor1}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={gradColor2}
                  onChange={(e) => setGradColor2(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer"
                />
                <div>
                  <span className="text-xs text-slate-400 block">Color 2</span>
                  <span className="font-mono text-sm font-bold">{gradColor2}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                  <span>Angle</span>
                  <span className="font-mono text-indigo-600">{gradAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={gradAngle}
                  onChange={(e) => setGradAngle(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <code className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-lg">
                background: {gradientCss};
              </code>
              <QuickCopy text={`background: ${gradientCss};`} label="Copy CSS" />
            </div>
          </div>
        </div>
      )}

      {/* Mode: Palette Generator */}
      {mode === 'palette' && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <input
              type="color"
              value={hexColor}
              onChange={(e) => setHexColor(e.target.value)}
              className="w-12 h-12 rounded-xl cursor-pointer border-0"
            />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Base Color: <code className="font-mono text-indigo-600">{hexColor}</code></span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Complementary Palette</span>
              <div className="grid grid-cols-2 gap-2">
                {palette.complementary.map((c, i) => (
                  <div key={i} style={{ backgroundColor: c }} className="h-20 rounded-xl p-2 flex items-end justify-between font-mono text-xs font-bold text-white shadow-xs">
                    <span className="drop-shadow-md">{c}</span>
                    <QuickCopy text={c} size="sm" />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Analogous Harmony</span>
              <div className="grid grid-cols-3 gap-2">
                {palette.analogous.map((c, i) => (
                  <div key={i} style={{ backgroundColor: c }} className="h-20 rounded-xl p-2 flex items-end justify-between font-mono text-xs font-bold text-white shadow-xs">
                    <span className="drop-shadow-md">{c}</span>
                    <QuickCopy text={c} size="sm" />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Triadic Palette</span>
              <div className="grid grid-cols-3 gap-2">
                {palette.triadic.map((c, i) => (
                  <div key={i} style={{ backgroundColor: c }} className="h-20 rounded-xl p-2 flex items-end justify-between font-mono text-xs font-bold text-white shadow-xs">
                    <span className="drop-shadow-md">{c}</span>
                    <QuickCopy text={c} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
