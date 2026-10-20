import React, { useState, useMemo } from 'react';
import CryptoJS from '../utils/crypto';
import { QuickCopy } from '../components/QuickCopy';
import { ArrowRightLeft, Download, Trash2, Copy, Sparkles, Lock, Code, Type, Shield, RefreshCw } from 'lucide-react';

type TransformCategory = 'casing' | 'encoding' | 'ciphers' | 'crypto' | 'clean';

export const UnifiedTextForge: React.FC = () => {
  const [inputText, setInputText] = useState('Hello World! Welcome to the Ultimate Text Transformation Forge.');
  const [activeCategory, setActiveCategory] = useState<TransformCategory>('casing');
  const [activeTransform, setActiveTransform] = useState('title-case');

  // Parameters for parameterized transforms
  const [caesarShift, setCaesarShift] = useState(3);
  const [aesKey, setAesKey] = useState('my-secret-key-123');
  const [aesVariant, setAesVariant] = useState<'AES-256' | 'AES-192' | 'AES-128'>('AES-256');
  const [hmacSecret, setHmacSecret] = useState('hmac-secret-pass');

  // Real-time Leet Speak conversion
  const toLeetSpeak = (text: string, advanced: boolean = false) => {
    const basicMap: Record<string, string> = {
      a: '4', A: '4', e: '3', E: '3', i: '1', I: '1', o: '0', O: '0',
      s: '5', S: '5', t: '7', T: '7', b: '8', B: '8', g: '9', G: '9'
    };
    const advMap: Record<string, string> = {
      ...basicMap,
      c: '(', C: '(', d: '|)', D: '|)', h: '|-|', H: '|-|',
      k: '|<', K: '|<', l: '|_', L: '|_', m: '/\\/\\', M: '/\\/\\',
      n: '|\\|', N: '|\\|', u: '|_|', U: '|_|', v: '\\/', V: '\\/',
      w: '\\/\\/', W: '\\/\\/', x: '><', X: '><'
    };
    const map = advanced ? advMap : basicMap;
    return text.split('').map(c => map[c] || c).join('');
  };

  // Morse code dictionary
  const MORSE_MAP: Record<string, string> = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.',
    G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..',
    M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.',
    S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
    Y: '-.--', Z: '--..', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
    '9': '----.', '0': '-----', ' ': '/'
  };

  const toMorse = (text: string) => {
    return text.toUpperCase().split('').map(c => MORSE_MAP[c] || c).join(' ');
  };

  // Zalgo glitch generator
  const toZalgo = (text: string) => {
    const zalgoUp = ['\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310', '\u0352', '\u0357'];
    const zalgoDown = ['\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f', '\u0320', '\u0324'];
    let result = '';
    for (const char of text) {
      result += char;
      if (char !== ' ') {
        result += zalgoUp[Math.floor(Math.random() * zalgoUp.length)];
        result += zalgoDown[Math.floor(Math.random() * zalgoDown.length)];
      }
    }
    return result;
  };

  // Execute active transformation
  const outputText = useMemo(() => {
    if (!inputText) return '';

    try {
      switch (activeTransform) {
        // --- CASING & FORMATTING ---
        case 'uppercase':
          return inputText.toUpperCase();
        case 'lowercase':
          return inputText.toLowerCase();
        case 'title-case':
          return inputText.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        case 'camel-case':
          return inputText
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
        case 'snake-case':
          return inputText
            .toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .trim()
            .replace(/\s+/g, '_');
        case 'kebab-case':
          return inputText
            .toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .trim()
            .replace(/\s+/g, '-');
        case 'pascal-case':
          return inputText
            .toLowerCase()
            .replace(new RegExp('(?:^|\\s|[_-])(\\w)', 'g'), (_, c) => c.toUpperCase())
            .replace(/[^a-zA-Z0-9]/g, '');
        case 'constant-case':
          return inputText
            .toUpperCase()
            .replace(/[^\w\s]/gi, '')
            .trim()
            .replace(/\s+/g, '_');
        case 'dot-case':
          return inputText
            .toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .trim()
            .replace(/\s+/g, '.');

        // --- ENCODING & DECODING ---
        case 'base64-encode':
          return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(inputText));
        case 'base64-decode':
          return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(inputText));
        case 'hex-encode':
          return CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(inputText));
        case 'hex-decode':
          return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Hex.parse(inputText));
        case 'binary-encode':
          return inputText.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
        case 'binary-decode':
          return inputText.split(/\s+/).map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
        case 'url-encode':
          return encodeURIComponent(inputText);
        case 'url-decode':
          return decodeURIComponent(inputText);

        // --- CIPHERS & FUN ---
        case 'leet-basic':
          return toLeetSpeak(inputText, false);
        case 'leet-advanced':
          return toLeetSpeak(inputText, true);
        case 'rot13':
          return inputText.replace(/[a-zA-Z]/g, (c) => {
            const code = c.charCodeAt(0);
            const base = code >= 97 ? 97 : 65;
            return String.fromCharCode(((code - base + 13) % 26) + base);
          });
        case 'caesar':
          return inputText.replace(/[a-zA-Z]/g, (c) => {
            const code = c.charCodeAt(0);
            const base = code >= 97 ? 97 : 65;
            const shift = ((caesarShift % 26) + 26) % 26;
            return String.fromCharCode(((code - base + shift) % 26) + base);
          });
        case 'morse':
          return toMorse(inputText);
        case 'reverse-text':
          return inputText.split('').reverse().join('');
        case 'reverse-words':
          return inputText.split(/\s+/).reverse().join(' ');
        case 'zalgo':
          return toZalgo(inputText);

        // --- CRYPTO & AES ---
        case 'aes-encrypt':
          return CryptoJS.AES.encrypt(inputText, aesKey).toString();
        case 'aes-decrypt':
          try {
            const bytes = CryptoJS.AES.decrypt(inputText, aesKey);
            return bytes.toString(CryptoJS.enc.Utf8) || 'Error: Invalid key or ciphertext';
          } catch {
            return 'Error: Could not decrypt with provided key';
          }
        case 'sha256':
          return CryptoJS.SHA256(inputText).toString();
        case 'sha512':
          return CryptoJS.SHA512(inputText).toString();
        case 'md5':
          return CryptoJS.MD5(inputText).toString();
        case 'hmac-sha256':
          return CryptoJS.HmacSHA256(inputText, hmacSecret).toString();

        // --- CLEAN & STRUCTURE ---
        case 'remove-duplicates':
          return Array.from(new Set(inputText.split('\n'))).join('\n');
        case 'sort-lines':
          return inputText.split('\n').sort().join('\n');
        case 'trim-lines':
          return inputText.split('\n').map(l => l.trim()).filter(Boolean).join('\n');
        case 'strip-html':
          return inputText.replace(/<[^>]*>?/gm, '');

        default:
          return inputText;
      }
    } catch (e: any) {
      return `Transform error: ${e.message}`;
    }
  }, [inputText, activeTransform, caesarShift, aesKey, hmacSecret]);

  // Input statistics
  const stats = useMemo(() => {
    const chars = inputText.length;
    const charsNoSpaces = inputText.replace(/\s/g, '').length;
    const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    const lines = inputText.split('\n').length;
    return { chars, charsNoSpaces, words, lines };
  }, [inputText]);

  const CATEGORIES = [
    { id: 'casing', name: 'Case & Format', icon: Type },
    { id: 'encoding', name: 'Encode / Decode', icon: Code },
    { id: 'ciphers', name: 'Ciphers & Leet', icon: Sparkles },
    { id: 'crypto', name: 'AES & Hashes', icon: Lock },
    { id: 'clean', name: 'Clean & Sort', icon: Shield }
  ];

  const TRANSFORMS_BY_CAT: Record<TransformCategory, { id: string; name: string; desc: string }[]> = {
    casing: [
      { id: 'uppercase', name: 'UPPERCASE', desc: 'ALL CAPITAL LETTERS' },
      { id: 'lowercase', name: 'lowercase', desc: 'all small letters' },
      { id: 'title-case', name: 'Title Case', desc: 'Capitalize Every Word' },
      { id: 'camel-case', name: 'camelCase', desc: 'developerVariableStyle' },
      { id: 'snake-case', name: 'snake_case', desc: 'joined_with_underscores' },
      { id: 'kebab-case', name: 'kebab-case', desc: 'url-friendly-hyphens' },
      { id: 'pascal-case', name: 'PascalCase', desc: 'ClassNameStyle' },
      { id: 'constant-case', name: 'CONSTANT_CASE', desc: 'GLOBAL_CONFIG_STYLE' },
      { id: 'dot-case', name: 'dot.case', desc: 'config.path.style' }
    ],
    encoding: [
      { id: 'base64-encode', name: 'Base64 Encode', desc: 'Convert text to base64 string' },
      { id: 'base64-decode', name: 'Base64 Decode', desc: 'Decode base64 back to text' },
      { id: 'hex-encode', name: 'Hex Encode', desc: 'ASCII to hexadecimal byte stream' },
      { id: 'hex-decode', name: 'Hex Decode', desc: 'Hex bytes back to readable text' },
      { id: 'binary-encode', name: 'Binary (0101)', desc: 'Encode into 8-bit binary bytes' },
      { id: 'binary-decode', name: 'Binary Decode', desc: 'Convert 8-bit binaries back to text' },
      { id: 'url-encode', name: 'URL Encode', desc: 'Percent-encode special URI chars' },
      { id: 'url-decode', name: 'URL Decode', desc: 'Decode %20 and URI entities' }
    ],
    ciphers: [
      { id: 'leet-basic', name: '1337 Leet Speak', desc: 'H4ck3r 5p34k (A->4, E->3, T->7)' },
      { id: 'leet-advanced', name: 'Advanced 1337', desc: 'Deep symbol substitution (|-, /\\/\\)' },
      { id: 'rot13', name: 'ROT13 Cipher', desc: 'Rotate alphabet by 13 positions' },
      { id: 'caesar', name: 'Caesar Cipher', desc: 'Shift alphabet by custom offset' },
      { id: 'morse', name: 'Morse Code', desc: 'Convert to dots and dashes (.-)' },
      { id: 'reverse-text', name: 'Reverse Characters', desc: 'Reverse entire text backwards' },
      { id: 'reverse-words', name: 'Reverse Words', desc: 'Flip word order backwards' },
      { id: 'zalgo', name: 'Zalgo Glitch Text', desc: 'Creepy cursed glitched unicode' }
    ],
    crypto: [
      { id: 'aes-encrypt', name: 'AES Encrypt', desc: 'Military-grade AES encryption' },
      { id: 'aes-decrypt', name: 'AES Decrypt', desc: 'Decrypt ciphertext using secret key' },
      { id: 'sha256', name: 'SHA-256 Hash', desc: '256-bit cryptographic digest' },
      { id: 'sha512', name: 'SHA-512 Hash', desc: '512-bit ultra-secure digest' },
      { id: 'md5', name: 'MD5 Hash', desc: '128-bit legacy checksum hash' },
      { id: 'hmac-sha256', name: 'HMAC-SHA256', desc: 'Keyed-hash authentication code' }
    ],
    clean: [
      { id: 'remove-duplicates', name: 'Remove Duplicate Lines', desc: 'Keep only unique lines' },
      { id: 'sort-lines', name: 'Sort Lines A-Z', desc: 'Alphabetical line sorting' },
      { id: 'trim-lines', name: 'Trim & Strip Empty', desc: 'Clean whitespace & empty lines' },
      { id: 'strip-html', name: 'Strip HTML Tags', desc: 'Remove all <tags> leaving text' }
    ]
  };

  const swapText = () => {
    setInputText(outputText);
  };

  const downloadOutput = () => {
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transformed-text-${activeTransform}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id as TransformCategory);
                setActiveTransform(TRANSFORMS_BY_CAT[cat.id as TransformCategory][0].id);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Category Transforms Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {TRANSFORMS_BY_CAT[activeCategory].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTransform(t.id)}
            className={`p-3 rounded-2xl text-left border transition-all ${
              activeTransform === t.id
                ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-500/80 ring-2 ring-indigo-500/20'
                : 'bg-white/70 dark:bg-slate-900/70 border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <span className={`text-xs font-bold block ${
              activeTransform === t.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'
            }`}>
              {t.name}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5 truncate">
              {t.desc}
            </span>
          </button>
        ))}
      </div>

      {/* Contextual Parameters (AES key, Caesar Shift, etc.) */}
      {(activeTransform === 'caesar' || activeTransform.startsWith('aes-') || activeTransform === 'hmac-sha256') && (
        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40 flex flex-wrap items-center gap-4">
          {activeTransform === 'caesar' && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">Alphabet Shift Offset:</span>
              <input
                type="number"
                min="-25"
                max="25"
                value={caesarShift}
                onChange={(e) => setCaesarShift(parseInt(e.target.value) || 0)}
                className="w-20 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm font-bold"
              />
            </div>
          )}

          {activeTransform.startsWith('aes-') && (
            <div className="flex-1 flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">AES Secret Key / Passphrase:</span>
              <input
                type="text"
                value={aesKey}
                onChange={(e) => setAesKey(e.target.value)}
                placeholder="Enter secret passphrase..."
                className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm"
              />
            </div>
          )}

          {activeTransform === 'hmac-sha256' && (
            <div className="flex-1 flex items-center gap-3">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">HMAC Secret Key:</span>
              <input
                type="text"
                value={hmacSecret}
                onChange={(e) => setHmacSecret(e.target.value)}
                placeholder="Enter secret key..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm"
              />
            </div>
          )}
        </div>
      )}

      {/* Side-by-Side Live Transformation Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Input Text
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setInputText('')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Clear input"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full h-64 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 font-mono text-sm focus:outline-none resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-mono">
            <span>{stats.words} words • {stats.chars} chars • {stats.lines} lines</span>
          </div>
        </div>

        {/* Output Panel */}
        <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Transformed Output ({activeTransform})
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={swapText}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
                title="Use output as next input"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Swap
              </button>
              <button
                onClick={downloadOutput}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Download as .txt"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <QuickCopy text={outputText} label="Copy Output" />
            </div>
          </div>

          <textarea
            readOnly
            value={outputText}
            placeholder="Result will appear here instantly..."
            className="w-full h-64 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/20 dark:bg-indigo-950/20 font-mono text-sm focus:outline-none resize-none leading-relaxed text-indigo-950 dark:text-indigo-100"
          />

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-mono">
            <span>Output length: {outputText.length} characters</span>
          </div>
        </div>
      </div>
    </div>
  );
};
