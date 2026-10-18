import React, { useState } from 'react';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import Papa from 'papaparse';
import yaml from 'js-yaml';
import { Upload, Download, FileArchive, FileText, Image as ImageIcon, Database, Check, Trash2 } from 'lucide-react';
import { QuickCopy } from '../components/QuickCopy';

type Mode = 'images-to-pdf' | 'text-to-pdf' | 'csv-json' | 'zip-manager';

export const FileTransformer: React.FC = () => {
  const [activeMode, setActiveMode] = useState<Mode>('images-to-pdf');

  // Images to PDF state
  const [uploadedImages, setUploadedImages] = useState<{ name: string; dataUrl: string; width: number; height: number }[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  const [imageOrientation, setImageOrientation] = useState<'portrait' | 'landscape'>('portrait');

  // Text to PDF state
  const [docTitle, setDocTitle] = useState('My Document');
  const [docContent, setDocContent] = useState('Welcome to SuperTools File Transformer.\n\nThis document was generated 100% client-side directly in the browser with zero external server dependencies.');

  // Data converter state
  const [dataInput, setDataInput] = useState('[{"name":"Alice","role":"Developer","city":"Berlin"},{"name":"Bob","role":"Designer","city":"London"}]');
  const [dataOutput, setDataOutput] = useState('');
  const [conversionType, setConversionType] = useState<'json-to-csv' | 'csv-to-json' | 'json-to-yaml' | 'yaml-to-json'>('json-to-csv');

  // ZIP manager state
  const [zipFiles, setZipFiles] = useState<{ name: string; file: File }[]>([]);
  const [extractedZipEntries, setExtractedZipEntries] = useState<{ name: string; size: string; content?: string }[]>([]);

  // Images to PDF handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        const img = new Image();
        img.onload = () => {
          setUploadedImages(prev => [...prev, {
            name: file.name,
            dataUrl: src,
            width: img.width,
            height: img.height
          }]);
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    });
  };

  const generateImagesPdf = () => {
    if (uploadedImages.length === 0) return;
    const doc = new jsPDF({
      orientation: imageOrientation,
      unit: 'mm',
      format: pageSize
    });

    uploadedImages.forEach((img, index) => {
      if (index > 0) doc.addPage(pageSize, imageOrientation);

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      const maxW = pageWidth - margin * 2;
      const maxH = pageHeight - margin * 2;

      const ratio = Math.min(maxW / img.width, maxH / img.height);
      const w = img.width * ratio;
      const h = img.height * ratio;
      const x = (pageWidth - w) / 2;
      const y = (pageHeight - h) / 2;

      doc.addImage(img.dataUrl, 'JPEG', x, y, w, h);
    });

    doc.save('supertools-compiled.pdf');
  };

  // Text to PDF handler
  const generateTextPdf = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(docTitle, 15, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const splitText = doc.splitTextToSize(docContent, 180);
    doc.text(splitText, 15, 32);

    doc.save(`${docTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  // Data format conversion
  const handleConvertData = () => {
    try {
      if (conversionType === 'json-to-csv') {
        const parsed = JSON.parse(dataInput);
        const csv = Papa.unparse(parsed);
        setDataOutput(csv);
      } else if (conversionType === 'csv-to-json') {
        const result = Papa.parse(dataInput, { header: true });
        setDataOutput(JSON.stringify(result.data, null, 2));
      } else if (conversionType === 'json-to-yaml') {
        const parsed = JSON.parse(dataInput);
        setDataOutput(yaml.dump(parsed));
      } else if (conversionType === 'yaml-to-json') {
        const parsed = yaml.load(dataInput);
        setDataOutput(JSON.stringify(parsed, null, 2));
      }
    } catch (err: any) {
      setDataOutput(`Error: ${err.message}`);
    }
  };

  // ZIP compression
  const createZipArchive = async () => {
    if (zipFiles.length === 0) return;
    const zip = new JSZip();
    zipFiles.forEach(({ name, file }) => {
      zip.file(name, file);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `supertools-archive.zip`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ZIP extraction
  const handleZipExtraction = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const zip = await JSZip.loadAsync(file);
      const entries: { name: string; size: string; content?: string }[] = [];
      for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
        if (!zipEntry.dir) {
          const text = await zipEntry.async('string').catch(() => '[Binary file]');
          entries.push({
            name: relativePath,
            size: `${(text.length / 1024).toFixed(1)} KB`,
            content: text.slice(0, 1000)
          });
        }
      }
      setExtractedZipEntries(entries);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Modes Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'images-to-pdf', name: 'Images to PDF', icon: ImageIcon },
          { id: 'text-to-pdf', name: 'Text to PDF', icon: FileText },
          { id: 'csv-json', name: 'CSV ⇄ JSON ⇄ YAML', icon: Database },
          { id: 'zip-manager', name: 'ZIP Create & Extract', icon: FileArchive }
        ].map(m => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMode(m.id as Mode)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeMode === m.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{m.name}</span>
            </button>
          );
        })}
      </div>

      {/* MODE 1: Images to PDF */}
      {activeMode === 'images-to-pdf' && (
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                Compile Photos into a Clean PDF Document
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload scans, photos, or receipts to stitch them into a single PDF.
              </p>
            </div>
            <label className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer flex items-center justify-center gap-2 shadow-xs">
              <Upload className="w-4 h-4" />
              Add Images
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {uploadedImages.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 aspect-square">
                    <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 p-1 rounded-md bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-1 left-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-white">
                      Page {idx + 1}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-medium">Page Size:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value as any)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  >
                    <option value="a4">A4 Standard</option>
                    <option value="letter">US Letter</option>
                  </select>

                  <select
                    value={imageOrientation}
                    onChange={(e) => setImageOrientation(e.target.value as any)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>

                <button
                  onClick={generateImagesPdf}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  Generate & Download PDF ({uploadedImages.length} Pages)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: Text to PDF */}
      {activeMode === 'text-to-pdf' && (
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-4 shadow-sm">
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Document Title:</label>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Body Text Content:</label>
            <textarea
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              className="w-full h-56 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans text-sm focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <button
            onClick={generateTextPdf}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download Formatted PDF Document
          </button>
        </div>
      )}

      {/* MODE 3: Data Converter */}
      {activeMode === 'csv-json' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Conversion:</span>
              <select
                value={conversionType}
                onChange={(e) => setConversionType(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
              >
                <option value="json-to-csv">JSON to CSV</option>
                <option value="csv-to-json">CSV to JSON</option>
                <option value="json-to-yaml">JSON to YAML</option>
                <option value="yaml-to-json">YAML to JSON</option>
              </select>
            </div>

            <button
              onClick={handleConvertData}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
            >
              Convert Data Now
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Source Input</span>
              <textarea
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
                className="w-full h-64 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 font-mono text-xs resize-none focus:outline-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Converted Output</span>
                {dataOutput && <QuickCopy text={dataOutput} size="sm" />}
              </div>
              <textarea
                readOnly
                value={dataOutput}
                placeholder="Converted data will appear here..."
                className="w-full h-64 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 font-mono text-xs resize-none focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODE 4: ZIP Archiver & Extractor */}
      {activeMode === 'zip-manager' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create ZIP */}
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-4 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                Create & Compress ZIP Archive
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 mb-3">
                Select multiple files to compress them into a .zip archive client-side.
              </p>

              <label className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 flex flex-col items-center justify-center cursor-pointer transition-colors">
                <Upload className="w-6 h-6 text-indigo-500 mb-1" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Choose Files to Archive</span>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      setZipFiles(Array.from(files).map(f => ({ name: f.name, file: f })));
                    }
                  }}
                  className="hidden"
                />
              </label>

              {zipFiles.length > 0 && (
                <div className="mt-3 max-h-40 overflow-y-auto space-y-1 text-xs font-mono">
                  {zipFiles.map((f, i) => (
                    <div key={i} className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="truncate max-w-[200px]">{f.name}</span>
                      <span className="text-slate-400">{(f.file.size / 1024).toFixed(1)} KB</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={createZipArchive}
              disabled={zipFiles.length === 0}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <FileArchive className="w-4 h-4" />
              Compress & Download .zip ({zipFiles.length} files)
            </button>
          </div>

          {/* Extract ZIP */}
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-4 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                Extract & Inspect ZIP Archive
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 mb-3">
                Unpack any .zip file directly in browser memory without third-party software.
              </p>

              <label className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 flex flex-col items-center justify-center cursor-pointer transition-colors">
                <FileArchive className="w-6 h-6 text-emerald-500 mb-1" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Upload .ZIP Archive to Extract</span>
                <input type="file" accept=".zip" onChange={handleZipExtraction} className="hidden" />
              </label>

              {extractedZipEntries.length > 0 && (
                <div className="mt-3 max-h-48 overflow-y-auto space-y-2 text-xs">
                  {extractedZipEntries.map((entry, i) => (
                    <div key={i} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="font-mono truncate max-w-[200px]">{entry.name}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{entry.size}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
