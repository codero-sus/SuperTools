import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { QuickCopy } from '../components/QuickCopy';
import { FileCheck, Upload, CheckCircle2, AlertCircle, File } from 'lucide-react';

interface FileChecksumToolProps {
  mode?: string;
}

export const FileChecksumTool: React.FC<FileChecksumToolProps> = () => {
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [sha256, setSha256] = useState<string>('');
  const [md5, setMd5] = useState<string>('');
  const [expectedHash, setExpectedHash] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const processFile = async (file: File) => {
    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');
    setLoading(true);
    setSha256('');
    setMd5('');

    try {
      const buffer = await file.arrayBuffer();

      // Compute SHA-256 via native browser Web Crypto API
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const sha256Hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setSha256(sha256Hex);

      // Compute MD5 via CryptoJS
      const wordArray = CryptoJS.lib.WordArray.create(buffer as any);
      const md5Hex = CryptoJS.MD5(wordArray).toString();
      setMd5(md5Hex);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const isMatching = expectedHash.trim() && (
    expectedHash.trim().toLowerCase() === sha256.toLowerCase() ||
    expectedHash.trim().toLowerCase() === md5.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* File Dropzone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.onchange = (e: any) => {
            if (e.target.files && e.target.files[0]) {
              processFile(e.target.files[0]);
            }
          };
          input.click();
        }}
        className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-center flex flex-col items-center justify-center space-y-3 cursor-pointer transition-colors shadow-xs"
      >
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <Upload className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            {fileName ? fileName : 'Choose or Drag & Drop Any Local File'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {fileSize ? `File Size: ${fileSize}` : 'Processed 100% locally in browser memory — zero uploads to any server'}
          </p>
        </div>
      </div>

      {loading && (
        <div className="p-4 text-center font-semibold text-sm text-indigo-600 animate-pulse">
          Hashing file contents in browser memory...
        </div>
      )}

      {/* Hash Results */}
      {sha256 && (
        <div className="space-y-4">
          {/* SHA-256 Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                SHA-256 Hash Checksum
              </span>
              <QuickCopy text={sha256} />
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 break-all select-all font-semibold">
              {sha256}
            </div>
          </div>

          {/* MD5 Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                MD5 Hash Checksum
              </span>
              <QuickCopy text={md5} />
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 break-all select-all font-semibold">
              {md5}
            </div>
          </div>

          {/* Compare with Expected Hash */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
              Verify / Compare against Expected Checksum:
            </label>
            <input
              type="text"
              value={expectedHash}
              onChange={(e) => setExpectedHash(e.target.value)}
              placeholder="Paste author's published SHA-256 or MD5 hash..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs sm:text-sm focus:outline-none"
            />
            {expectedHash.trim() && (
              <div>
                {isMatching ? (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Exact Match! The file checksum is genuine and verified.</span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Mismatch! The file hash does not match your expected checksum.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
