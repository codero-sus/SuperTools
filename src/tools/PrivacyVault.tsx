import React, { useState, useRef } from 'react';
import CryptoJS from 'crypto-js';
import { ShieldCheck, Lock, Unlock, EyeOff, FileText, Image as ImageIcon, Download, Upload, CheckCircle2 } from 'lucide-react';
import { QuickCopy } from '../components/QuickCopy';

type VaultTab = 'steganography' | 'file-encrypt' | 'exif-stripper';

export const PrivacyVault: React.FC = () => {
  const [activeTab, setActiveTab] = useState<VaultTab>('steganography');

  // Steganography state
  const [stegoImage, setStegoImage] = useState<string | null>(null);
  const [secretMessage, setSecretMessage] = useState('This is top secret classified information.');
  const [decodedMessage, setDecodedMessage] = useState('');
  const [stegoMode, setStegoMode] = useState<'encode' | 'decode'>('encode');
  const [stegoStatus, setStegoStatus] = useState('');

  // File Encryption state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [encPassword, setEncPassword] = useState('');
  const [encStatus, setEncStatus] = useState('');

  // EXIF stripper state
  const [exifImage, setExifImage] = useState<string | null>(null);
  const [exifStrippedUrl, setExifStrippedUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Steganography: Encode message into Least Significant Bits (LSB) of Canvas image data
  const encodeSecret = () => {
    if (!stegoImage || !canvasRef.current || !secretMessage.trim()) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Add a delimiter "###END###"
      const fullText = secretMessage + '###END###';
      let binary = '';
      for (let i = 0; i < fullText.length; i++) {
        binary += fullText.charCodeAt(i).toString(2).padStart(8, '0');
      }

      if (binary.length > data.length / 4) {
        setStegoStatus('Error: Message is too large to fit in this image size.');
        return;
      }

      // Hide in LSB of red channel
      for (let i = 0; i < binary.length; i++) {
        const bit = parseInt(binary[i], 10);
        // Clear last bit and set to secret bit
        data[i * 4] = (data[i * 4] & 0xFE) | bit;
      }

      ctx.putImageData(imgData, 0, 0);
      setStegoStatus('Success: Secret message hidden seamlessly in image pixels!');
    };
    img.src = stegoImage;
  };

  const decodeSecret = () => {
    if (!stegoImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      let binary = '';
      let extracted = '';

      for (let i = 0; i < data.length / 4; i++) {
        binary += (data[i * 4] & 1).toString();
        if (binary.length === 8) {
          const charCode = parseInt(binary, 2);
          extracted += String.fromCharCode(charCode);
          binary = '';
          if (extracted.endsWith('###END###')) {
            const secret = extracted.replace('###END###', '');
            setDecodedMessage(secret);
            setStegoStatus(`Decoded secret: "${secret}"`);
            return;
          }
        }
      }
      setDecodedMessage('No hidden secret message detected in this image.');
    };
    img.src = stegoImage;
  };

  const downloadStegoImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `stego-secret-carrier.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  // File AES Encrypt
  const encryptFile = async () => {
    if (!selectedFile || !encPassword) return;
    setEncStatus('Encrypting file...');
    try {
      const buffer = await selectedFile.arrayBuffer();
      const wordArray = CryptoJS.lib.WordArray.create(buffer as any);
      const encrypted = CryptoJS.AES.encrypt(wordArray, encPassword).toString();

      const blob = new Blob([encrypted], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedFile.name}.enc`;
      link.click();
      URL.revokeObjectURL(url);
      setEncStatus('File encrypted and downloaded as .enc!');
    } catch (err: any) {
      setEncStatus(`Encryption error: ${err.message}`);
    }
  };

  // File AES Decrypt
  const decryptFile = async () => {
    if (!selectedFile || !encPassword) return;
    setEncStatus('Decrypting file...');
    try {
      const text = await selectedFile.text();
      const decrypted = CryptoJS.AES.decrypt(text, encPassword);
      const typedArray = convertWordArrayToUint8Array(decrypted);

      const origName = selectedFile.name.replace(/\.enc$/i, '');
      const blob = new Blob([typedArray]);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = origName || 'decrypted-file';
      link.click();
      URL.revokeObjectURL(url);
      setEncStatus('File decrypted successfully!');
    } catch (err: any) {
      setEncStatus('Decryption failed. Check password.');
    }
  };

  const convertWordArrayToUint8Array = (wordArray: any) => {
    const len = wordArray.sigBytes;
    const words = wordArray.words;
    const u8 = new Uint8Array(len);
    let offset = 0;
    for (let i = 0; i < len; i++) {
      const byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
      u8[offset++] = byte;
    }
    return u8;
  };

  // EXIF Metadata Stripper (re-renders purely image pixels onto clean canvas, eliminating metadata)
  const stripExif = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setExifImage(src);
      const img = new Image();
      img.onload = () => {
        const cleanCanvas = document.createElement('canvas');
        cleanCanvas.width = img.width;
        cleanCanvas.height = img.height;
        const ctx = cleanCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const cleanDataUrl = cleanCanvas.toDataURL('image/jpeg', 0.95);
          setExifStrippedUrl(cleanDataUrl);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'steganography', name: 'Image Steganography', icon: EyeOff },
          { id: 'file-encrypt', name: 'File AES Encrypt / Decrypt', icon: Lock },
          { id: 'exif-stripper', name: 'EXIF Metadata Stripper', icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as VaultTab)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Steganography */}
      {activeTab === 'steganography' && (
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-6 shadow-sm">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
              Image Steganography (Hide Text Inside Image Pixels)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Encodes secret messages invisibly into image RGB bits. To human eyes, the picture looks 100% normal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="w-full py-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 dark:bg-slate-950/40">
                <ImageIcon className="w-8 h-8 text-indigo-500 mb-2" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {stegoImage ? 'Change Carrier Photo' : 'Upload Carrier Photo'}
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => setStegoImage(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </label>

              {stegoImage && (
                <div className="flex justify-center">
                  <canvas ref={canvasRef} className="max-h-56 max-w-full rounded-2xl shadow-md border border-slate-200 dark:border-slate-800" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setStegoMode('encode')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                    stegoMode === 'encode' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  Hide Secret (Encode)
                </button>
                <button
                  onClick={() => setStegoMode('decode')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                    stegoMode === 'decode' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  Reveal Secret (Decode)
                </button>
              </div>

              {stegoMode === 'encode' ? (
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-500 block">Secret Message to Embed:</label>
                  <textarea
                    value={secretMessage}
                    onChange={(e) => setSecretMessage(e.target.value)}
                    className="w-full h-32 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono resize-none"
                    placeholder="Enter confidential secret..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={encodeSecret}
                      disabled={!stegoImage}
                      className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs shadow-sm"
                    >
                      Hide in Image Pixels
                    </button>
                    <button
                      onClick={downloadStegoImage}
                      disabled={!stegoImage}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" /> Save PNG
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={decodeSecret}
                    disabled={!stegoImage}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs shadow-sm"
                  >
                    Extract Hidden Message
                  </button>
                  {decodedMessage && (
                    <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 font-mono text-xs">
                      <span className="text-slate-400 block mb-1 font-sans font-bold">Extracted Hidden Secret:</span>
                      <span className="text-indigo-950 dark:text-indigo-200 break-all">{decodedMessage}</span>
                    </div>
                  )}
                </div>
              )}

              {stegoStatus && (
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{stegoStatus}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: File AES Encryptor */}
      {activeTab === 'file-encrypt' && (
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-6 shadow-sm max-w-xl mx-auto">
          <div className="text-center">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
              Client-Side File AES Encryption & Decryption
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Lock any file (PDF, photo, document, zip) with AES-256 password encryption before sharing.
            </p>
          </div>

          <label className="w-full py-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 dark:bg-slate-950/40">
            <Lock className="w-8 h-8 text-indigo-500 mb-2" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {selectedFile ? selectedFile.name : 'Select File to Encrypt or Decrypt'}
            </span>
            <span className="text-[10px] text-slate-400 mt-1">
              {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Any file format'}
            </span>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>

          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">
              Secret Passphrase / Password:
            </label>
            <input
              type="password"
              value={encPassword}
              onChange={(e) => setEncPassword(e.target.value)}
              placeholder="Enter strong encryption password..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={encryptFile}
              disabled={!selectedFile || !encPassword}
              className="py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Lock className="w-3.5 h-3.5" />
              Encrypt to .enc
            </button>
            <button
              onClick={decryptFile}
              disabled={!selectedFile || !encPassword}
              className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Unlock className="w-3.5 h-3.5" />
              Decrypt File
            </button>
          </div>

          {encStatus && (
            <p className="text-xs font-medium text-center text-slate-600 dark:text-slate-300">{encStatus}</p>
          )}
        </div>
      )}

      {/* TAB 3: EXIF Metadata Stripper */}
      {activeTab === 'exif-stripper' && (
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-6 shadow-sm max-w-xl mx-auto text-center">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
              EXIF & GPS Location Metadata Stripper
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Remove hidden GPS coordinates, phone serials, camera model, and timestamps from photos before uploading online.
            </p>
          </div>

          <label className="w-full py-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 dark:bg-slate-950/40">
            <ShieldCheck className="w-10 h-10 text-emerald-500 mb-2" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Upload Photo to Strip Metadata
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) stripExif(f);
              }}
              className="hidden"
            />
          </label>

          {exifStrippedUrl && (
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 space-y-3">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                All GPS Coordinates & Device EXIF Purged Completely!
              </span>
              <a
                href={exifStrippedUrl}
                download="clean-photo-no-exif.jpg"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download Sanitized Photo (.jpg)
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
