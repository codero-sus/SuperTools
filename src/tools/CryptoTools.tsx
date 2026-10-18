import React, { useState, useMemo } from 'react';
import CryptoJS from 'crypto-js';
import { QuickCopy } from '../components/QuickCopy';
import { Trash2, Key, Shield, Hash } from 'lucide-react';

interface CryptoToolsProps {
  mode?: string;
}

export const CryptoTools: React.FC<CryptoToolsProps> = ({ mode = 'sha256' }) => {
  const [input, setInput] = useState('SuperTools secret message');
  const [key, setKey] = useState('SecretKey123!');
  const [hexBytes, setHexBytes] = useState(32);

  const result = useMemo(() => {
    if (!input && mode !== 'random-hex') return '';

    try {
      switch (mode) {
        case 'sha256':
          return CryptoJS.SHA256(input).toString();
        case 'sha512':
          return CryptoJS.SHA512(input).toString();
        case 'sha384':
          return CryptoJS.SHA384(input).toString();
        case 'sha1':
          return CryptoJS.SHA1(input).toString();
        case 'md5':
          return CryptoJS.MD5(input).toString();
        case 'hmac-sha256':
          return CryptoJS.HmacSHA256(input, key).toString();
        case 'hmac-sha512':
          return CryptoJS.HmacSHA512(input, key).toString();
        case 'hmac-md5':
          return CryptoJS.HmacMD5(input, key).toString();
        case 'aes-encrypt':
          return CryptoJS.AES.encrypt(input, key).toString();
        case 'aes-decrypt': {
          const bytes = CryptoJS.AES.decrypt(input, key);
          const decrypted = bytes.toString(CryptoJS.enc.Utf8);
          return decrypted || 'Decryption failed: Invalid key or ciphertext.';
        }
        case 'b64-encode':
          return btoa(unescape(encodeURIComponent(input)));
        case 'b64-decode':
          return decodeURIComponent(escape(atob(input)));
        case 'b64url-encode': {
          const b64 = btoa(unescape(encodeURIComponent(input)));
          return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        }
        case 'b64url-decode': {
          let b64 = input.replace(/-/g, '+').replace(/_/g, '/');
          while (b64.length % 4) b64 += '=';
          return decodeURIComponent(escape(atob(b64)));
        }
        case 'url-encode':
          return encodeURIComponent(input);
        case 'url-decode':
          return decodeURIComponent(input);
        case 'random-hex': {
          const arr = new Uint8Array(hexBytes);
          crypto.getRandomValues(arr);
          return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
        }
        default:
          return CryptoJS.SHA256(input).toString();
      }
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  }, [input, key, mode, hexBytes]);

  const requiresKey = mode.startsWith('hmac') || mode.startsWith('aes');
  const isRandomHex = mode === 'random-hex';

  return (
    <div className="space-y-6">
      {/* Key input for HMAC or AES */}
      {requiresKey && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Secret Key / Passphrase:
          </label>
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-500" />
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm"
              placeholder="Enter encryption or HMAC secret key..."
            />
          </div>
        </div>
      )}

      {isRandomHex && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Byte Length: {hexBytes} bytes ({hexBytes * 2} hex characters, {hexBytes * 8} bits)
          </label>
          <input
            type="range"
            min="8"
            max="128"
            step="8"
            value={hexBytes}
            onChange={(e) => setHexBytes(parseInt(e.target.value))}
            className="flex-1 max-w-xs"
          />
        </div>
      )}

      {/* Input / Output Panels */}
      {!isRandomHex && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Input Text
            </span>
            <button
              onClick={() => setInput('')}
              className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y shadow-xs"
            placeholder="Enter text to process..."
          />
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Cryptographic Output ({result.length} characters)
          </span>
          <QuickCopy text={result} />
        </div>
        <textarea
          readOnly
          value={result}
          rows={isRandomHex ? 4 : 5}
          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 break-all focus:outline-none resize-y shadow-xs select-all"
        />
      </div>
    </div>
  );
};
