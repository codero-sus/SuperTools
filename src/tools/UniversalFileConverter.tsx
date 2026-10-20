import React, { useState } from 'react';
import { readSheet } from 'read-excel-file/browser';
import writeXlsxFile from 'write-excel-file/browser';
import Papa from 'papaparse';
import yaml from 'js-yaml';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { Upload, Download, ArrowRight, FileCheck, RefreshCw, FileCode, Database, Image as ImageIcon, FileArchive, Check } from 'lucide-react';
import { QuickCopy } from '../components/QuickCopy';

// Helpers for safe, modern client-side Excel conversion
const parseXlsxToJson = async (fileBlob: Blob | File): Promise<any[]> => {
  try {
    const rows = await readSheet(fileBlob);
    if (!rows || rows.length === 0) return [];
    const headers = rows[0].map((h: any) => String(h ?? '').trim());
    return rows.slice(1).map((row: any[]) => {
      const obj: Record<string, any> = {};
      headers.forEach((h: string, i: number) => {
        if (h) obj[h] = row[i] !== undefined && row[i] !== null ? row[i] : '';
      });
      return obj;
    });
  } catch (err) {
    console.error('Error reading Excel spreadsheet:', err);
    return [];
  }
};

const createXlsxBlob = async (data: any[]): Promise<Blob> => {
  if (!data || data.length === 0) {
    return await writeXlsxFile([[{ value: 'Empty' }]]).toBlob();
  }
  const headers = Object.keys(data[0] || {});
  const headerRow = headers.map(h => ({
    value: String(h),
    fontWeight: 'bold' as const,
    backgroundColor: '#e2e8f0'
  }));
  const contentRows = data.map((item: any) =>
    headers.map(h => {
      const val = item[h];
      if (val === null || val === undefined) return { value: '' };
      if (typeof val === 'number') return { value: val };
      if (typeof val === 'boolean') return { value: val ? 'true' : 'false' };
      return { value: String(val) };
    })
  );
  return await writeXlsxFile([headerRow, ...contentRows]).toBlob();
};

type FileCategory = 'image' | 'data' | 'document' | 'archive' | 'unknown';

interface ConversionOption {
  format: string;
  label: string;
  ext: string;
}

export const UniversalFileConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<FileCategory>('unknown');
  const [targetFormat, setTargetFormat] = useState<string>('');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>('');
  const [convertedTextPreview, setConvertedTextPreview] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>('');

  // Quick Direct Paste Converter tab
  const [pasteMode, setPasteMode] = useState<boolean>(false);
  const [pasteInput, setPasteInput] = useState<string>('[{"id": 1, "product": "Laptop", "price": 999}, {"id": 2, "product": "Headphones", "price": 149}]');
  const [pasteFrom, setPasteFrom] = useState<'json' | 'csv' | 'yaml' | 'markdown'>('json');
  const [pasteTo, setPasteTo] = useState<'csv' | 'json' | 'yaml' | 'xlsx' | 'html' | 'pdf'>('csv');

  const detectCategory = (f: File): { cat: FileCategory; defaultTarget: string } => {
    const ext = f.name.split('.').pop()?.toLowerCase() || '';

    if (['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif', 'svg'].includes(ext)) {
      return { cat: 'image', defaultTarget: ext === 'png' ? 'jpg' : 'png' };
    }
    if (['csv', 'xlsx', 'xls', 'json', 'yaml', 'yml', 'xml', 'tsv'].includes(ext)) {
      return { cat: 'data', defaultTarget: ext === 'json' ? 'csv' : 'json' };
    }
    if (['txt', 'md', 'html', 'htm', 'rtf'].includes(ext)) {
      return { cat: 'document', defaultTarget: 'pdf' };
    }
    if (['zip', 'tar', 'gz'].includes(ext)) {
      return { cat: 'archive', defaultTarget: 'extract' };
    }
    return { cat: 'unknown', defaultTarget: 'zip' };
  };

  const getAvailableTargets = (cat: FileCategory, currentExt: string): ConversionOption[] => {
    switch (cat) {
      case 'image':
        return [
          { format: 'png', label: 'PNG Image (.png)', ext: 'png' },
          { format: 'jpg', label: 'JPEG Image (.jpg)', ext: 'jpg' },
          { format: 'webp', label: 'WebP Next-Gen (.webp)', ext: 'webp' },
          { format: 'ico', label: 'ICO Favicon 32x32 (.ico)', ext: 'ico' },
          { format: 'bmp', label: 'BMP Bitmap (.bmp)', ext: 'bmp' },
          { format: 'pdf', label: 'PDF Document (.pdf)', ext: 'pdf' }
        ].filter(opt => opt.format !== currentExt);

      case 'data':
        return [
          { format: 'json', label: 'JSON Data (.json)', ext: 'json' },
          { format: 'csv', label: 'CSV Comma-Separated (.csv)', ext: 'csv' },
          { format: 'xlsx', label: 'Excel Spreadsheet (.xlsx)', ext: 'xlsx' },
          { format: 'yaml', label: 'YAML Format (.yaml)', ext: 'yaml' },
          { format: 'tsv', label: 'TSV Tab-Separated (.tsv)', ext: 'tsv' },
          { format: 'html-table', label: 'HTML Table Code (.html)', ext: 'html' }
        ].filter(opt => opt.format !== currentExt);

      case 'document':
        return [
          { format: 'pdf', label: 'PDF Document (.pdf)', ext: 'pdf' },
          { format: 'html', label: 'HTML Webpage (.html)', ext: 'html' },
          { format: 'txt', label: 'Plain Text (.txt)', ext: 'txt' },
          { format: 'md', label: 'Markdown (.md)', ext: 'md' }
        ].filter(opt => opt.format !== currentExt);

      case 'archive':
        return [
          { format: 'extract', label: 'Extract All Files (.zip)', ext: 'zip' }
        ];

      default:
        return [
          { format: 'zip', label: 'Compress to ZIP (.zip)', ext: 'zip' }
        ];
    }
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    const { cat, defaultTarget } = detectCategory(selected);
    setCategory(cat);
    setTargetFormat(defaultTarget);
    setDownloadUrl(null);
    setConvertedTextPreview(null);
    setStatusMsg('');
  };

  const executeConversion = async () => {
    if (!file) return;
    setIsConverting(true);
    setStatusMsg('Processing conversion...');

    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const srcExt = file.name.split('.').pop()?.toLowerCase() || '';

    try {
      // 1. IMAGE CONVERSIONS
      if (category === 'image') {
        const srcUrl = URL.createObjectURL(file);
        const img = new Image();

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = srcUrl;
        });

        if (targetFormat === 'pdf') {
          const doc = new jsPDF({
            orientation: img.width > img.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [img.width, img.height]
          });
          doc.addImage(img, 'JPEG', 0, 0, img.width, img.height);
          const pdfBlob = doc.output('blob');
          const url = URL.createObjectURL(pdfBlob);
          setDownloadUrl(url);
          setDownloadName(`${baseName}.pdf`);
        } else {
          const canvas = document.createElement('canvas');
          if (targetFormat === 'ico') {
            canvas.width = 32;
            canvas.height = 32;
          } else {
            canvas.width = img.width;
            canvas.height = img.height;
          }
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const mimeType = targetFormat === 'jpg' ? 'image/jpeg' : targetFormat === 'webp' ? 'image/webp' : 'image/png';
          const dataUrl = canvas.toDataURL(mimeType, 0.92);
          setDownloadUrl(dataUrl);
          setDownloadName(`${baseName}.${targetFormat}`);
        }
        URL.revokeObjectURL(srcUrl);
      }

      // 2. DATA / SPREADSHEET CONVERSIONS
      else if (category === 'data') {
        let rawData: any[] = [];

        if (srcExt === 'xlsx' || srcExt === 'xls') {
          rawData = await parseXlsxToJson(file);
        } else if (srcExt === 'csv' || srcExt === 'tsv') {
          const text = await file.text();
          const parsed = Papa.parse(text, { header: true, dynamicTyping: true });
          rawData = parsed.data;
        } else if (srcExt === 'json') {
          const text = await file.text();
          rawData = JSON.parse(text);
          if (!Array.isArray(rawData)) rawData = [rawData];
        } else if (srcExt === 'yaml' || srcExt === 'yml') {
          const text = await file.text();
          rawData = yaml.load(text) as any[];
          if (!Array.isArray(rawData)) rawData = [rawData];
        }

        // Output to target
        if (targetFormat === 'xlsx') {
          const blob = await createXlsxBlob(rawData);
          setDownloadUrl(URL.createObjectURL(blob));
          setDownloadName(`${baseName}.xlsx`);
        } else if (targetFormat === 'csv') {
          const csvText = Papa.unparse(rawData);
          const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8' });
          setDownloadUrl(URL.createObjectURL(blob));
          setDownloadName(`${baseName}.csv`);
          setConvertedTextPreview(csvText.slice(0, 1500));
        } else if (targetFormat === 'json') {
          const jsonText = JSON.stringify(rawData, null, 2);
          const blob = new Blob([jsonText], { type: 'application/json;charset=utf-8' });
          setDownloadUrl(URL.createObjectURL(blob));
          setDownloadName(`${baseName}.json`);
          setConvertedTextPreview(jsonText.slice(0, 1500));
        } else if (targetFormat === 'yaml') {
          const yamlText = yaml.dump(rawData);
          const blob = new Blob([yamlText], { type: 'text/yaml;charset=utf-8' });
          setDownloadUrl(URL.createObjectURL(blob));
          setDownloadName(`${baseName}.yaml`);
          setConvertedTextPreview(yamlText.slice(0, 1500));
        } else if (targetFormat === 'tsv') {
          const tsvText = Papa.unparse(rawData, { delimiter: '\t' });
          const blob = new Blob([tsvText], { type: 'text/tab-separated-values;charset=utf-8' });
          setDownloadUrl(URL.createObjectURL(blob));
          setDownloadName(`${baseName}.tsv`);
          setConvertedTextPreview(tsvText.slice(0, 1500));
        } else if (targetFormat === 'html-table') {
          const headers = Object.keys(rawData[0] || {});
          let tableHtml = `<table border="1"><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>`;
          rawData.forEach(row => {
            tableHtml += `<tr>${headers.map(h => `<td>${row[h] !== undefined ? row[h] : ''}</td>`).join('')}</tr>`;
          });
          tableHtml += '</tbody></table>';
          const blob = new Blob([tableHtml], { type: 'text/html;charset=utf-8' });
          setDownloadUrl(URL.createObjectURL(blob));
          setDownloadName(`${baseName}.html`);
          setConvertedTextPreview(tableHtml.slice(0, 1500));
        }
      }

      // 3. DOCUMENT CONVERSIONS
      else if (category === 'document') {
        const text = await file.text();

        if (targetFormat === 'pdf') {
          const doc = new jsPDF({ unit: 'mm', format: 'a4' });
          doc.setFontSize(10);
          const lines = doc.splitTextToSize(text, 180);
          doc.text(lines, 15, 20);
          const blob = doc.output('blob');
          setDownloadUrl(URL.createObjectURL(blob));
          setDownloadName(`${baseName}.pdf`);
        } else if (targetFormat === 'html') {
          const htmlContent = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${baseName}</title></head><body style="font-family:sans-serif;max-width:800px;margin:2rem auto;line-height:1.6"><pre>${text}</pre></body></html>`;
          const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
          setDownloadUrl(URL.createObjectURL(blob));
          setDownloadName(`${baseName}.html`);
          setConvertedTextPreview(htmlContent.slice(0, 1500));
        } else {
          const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
          setDownloadUrl(URL.createObjectURL(blob));
          setDownloadName(`${baseName}.${targetFormat}`);
          setConvertedTextPreview(text.slice(0, 1500));
        }
      }

      // 4. ARCHIVE ZIP
      else if (category === 'archive') {
        const zip = await JSZip.loadAsync(file);
        let preview = `Archive contents (${Object.keys(zip.files).length} files):\n`;
        Object.keys(zip.files).forEach(f => { preview += `- ${f}\n`; });
        setConvertedTextPreview(preview);
        const blob = await zip.generateAsync({ type: 'blob' });
        setDownloadUrl(URL.createObjectURL(blob));
        setDownloadName(`extracted-${baseName}.zip`);
      }

      setStatusMsg('Conversion finished successfully!');
    } catch (err: any) {
      console.error(err);
      setStatusMsg(`Conversion failed: ${err.message}`);
    } finally {
      setIsConverting(false);
    }
  };

  // Convert Direct Pasted Text/Data
  const handleDirectPasteConversion = () => {
    try {
      let data: any = pasteInput;
      if (pasteFrom === 'json') {
        data = JSON.parse(pasteInput);
        if (!Array.isArray(data)) data = [data];
      } else if (pasteFrom === 'csv') {
        data = Papa.parse(pasteInput, { header: true }).data;
      } else if (pasteFrom === 'yaml') {
        data = yaml.load(pasteInput);
        if (!Array.isArray(data)) data = [data];
      }

      if (pasteTo === 'xlsx') {
        createXlsxBlob(data).then(blob => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'converted-data.xlsx';
          link.click();
          setStatusMsg('Excel (.xlsx) generated and download started!');
        }).catch(err => {
          setConvertedTextPreview(`Excel export error: ${err.message}`);
        });
      } else if (pasteTo === 'csv') {
        const res = Papa.unparse(data);
        setConvertedTextPreview(res);
      } else if (pasteTo === 'json') {
        const res = JSON.stringify(data, null, 2);
        setConvertedTextPreview(res);
      } else if (pasteTo === 'yaml') {
        const res = yaml.dump(data);
        setConvertedTextPreview(res);
      } else if (pasteTo === 'html') {
        const headers = Object.keys(data[0] || {});
        let tbl = `<table border="1"><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
        data.forEach((r: any) => { tbl += `<tr>${headers.map(h => `<td>${r[h]}</td>`).join('')}</tr>`; });
        tbl += '</table>';
        setConvertedTextPreview(tbl);
      }
    } catch (err: any) {
      setConvertedTextPreview(`Error: ${err.message}`);
    }
  };

  const currentExt = file ? (file.name.split('.').pop()?.toLowerCase() || '') : '';
  const availableTargets = file ? getAvailableTargets(category, currentExt) : [];

  return (
    <div className="space-y-6">
      {/* Top Toggle: Upload File vs Paste Data */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 max-w-sm mx-auto shadow-2xs">
        <button
          onClick={() => setPasteMode(false)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            !pasteMode ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Convert Uploaded File
        </button>
        <button
          onClick={() => setPasteMode(true)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            pasteMode ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Paste Raw Data / Code
        </button>
      </div>

      {!pasteMode ? (
        /* MODE 1: FILE DRAG & DROP MULTI-FORMAT CONVERTER */
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
            {!file ? (
              <label className="w-full py-12 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-950/40">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner mb-3">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg">
                  Drop Any File to Convert Format
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md text-center">
                  Supports Images (PNG, JPG, WEBP, ICO, BMP), Spreadsheets (Excel .xlsx, CSV, TSV), Documents (JSON, YAML, XML, Markdown, TXT, HTML, PDF), and Archives.
                </p>
                <span className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm">
                  Choose File from Computer
                </span>
                <input type="file" onChange={handleFileSelection} className="hidden" />
              </label>
            ) : (
              <div className="space-y-6">
                {/* File Info Bar */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-bold text-xs uppercase">
                      {currentExt}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[280px]">
                        {file.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono">
                        {(file.size / 1024).toFixed(1)} KB • Category: {category.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                    Change File
                    <input type="file" onChange={handleFileSelection} className="hidden" />
                  </label>
                </div>

                {/* Target Format Options Matrix */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Choose Desired Output Format:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {availableTargets.map(opt => (
                      <button
                        key={opt.format}
                        onClick={() => {
                          setTargetFormat(opt.format);
                          setDownloadUrl(null);
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          targetFormat === opt.format
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                            : 'border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <span className="font-bold text-xs block">{opt.label}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">.{opt.ext}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conversion Trigger & Download Result */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    onClick={executeConversion}
                    disabled={isConverting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    {isConverting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    {isConverting ? 'Converting File...' : `Convert to .${targetFormat.toUpperCase()}`}
                  </button>

                  {downloadUrl && (
                    <a
                      href={downloadUrl}
                      download={downloadName}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all animate-bounce"
                    >
                      <Download className="w-4 h-4" />
                      Download {downloadName}
                    </a>
                  )}
                </div>

                {statusMsg && (
                  <p className="text-xs font-semibold text-center text-slate-600 dark:text-slate-300">{statusMsg}</p>
                )}

                {convertedTextPreview && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Converted Content Preview</span>
                    <textarea
                      readOnly
                      value={convertedTextPreview}
                      className="w-full h-44 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-xs resize-none"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* MODE 2: DIRECT PASTE CONVERTER */
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">From:</span>
              <select
                value={pasteFrom}
                onChange={(e) => setPasteFrom(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="yaml">YAML</option>
              </select>

              <ArrowRight className="w-4 h-4 text-slate-400 mx-1" />

              <span className="text-xs font-bold text-slate-500">To:</span>
              <select
                value={pasteTo}
                onChange={(e) => setPasteTo(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
              >
                <option value="csv">CSV (.csv)</option>
                <option value="json">JSON (.json)</option>
                <option value="xlsx">Excel Spreadsheet (.xlsx)</option>
                <option value="yaml">YAML (.yaml)</option>
                <option value="html">HTML Table (.html)</option>
              </select>
            </div>

            <button
              onClick={handleDirectPasteConversion}
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
            >
              Convert Now
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400">Input Data ({pasteFrom.toUpperCase()}):</span>
              <textarea
                value={pasteInput}
                onChange={(e) => setPasteInput(e.target.value)}
                className="w-full h-72 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 font-mono text-xs resize-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-500">Output ({pasteTo.toUpperCase()}):</span>
                {convertedTextPreview && <QuickCopy text={convertedTextPreview} size="sm" />}
              </div>
              <textarea
                readOnly
                value={convertedTextPreview || 'Converted output will display here (or trigger instant .xlsx download)...'}
                className="w-full h-72 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 font-mono text-xs resize-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
