import React, { useState, useMemo } from 'react';
import { QuickCopy } from '../components/QuickCopy';
import { Trash2, ArrowRightLeft, Sparkles, Sliders } from 'lucide-react';

interface TextToolsProps {
  mode?: string;
}

export const TextTools: React.FC<TextToolsProps> = ({ mode = 'word-counter' }) => {
  const [input, setInput] = useState('SuperTools makes everyday web tasks delightfully fast, 100% offline and secure.');
  const [param1, setParam1] = useState('');
  const [param2, setParam2] = useState('');
  const [caesarShift, setCaesarShift] = useState(3);
  const [repeatCount, setRepeatCount] = useState(5);
  const [repeatSep, setRepeatSep] = useState('\\n');
  const [wrapCols, setWrapCols] = useState(40);
  const [truncateLen, setTruncateLen] = useState(50);

  // Conversion / calculation logic based on mode
  const output = useMemo(() => {
    if (!input) return '';

    switch (mode) {
      case 'case-upper':
        return input.toUpperCase();
      case 'case-lower':
        return input.toLowerCase();
      case 'case-title':
        return input.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
      case 'case-sentence':
        return input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
      case 'case-camel': {
        const words = input.replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(/\s+/);
        return words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
      }
      case 'case-snake':
        return input.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
      case 'case-kebab':
        return input.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
      case 'case-pascal': {
        const words = input.replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(/\s+/);
        return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
      }
      case 'case-constant':
        return input.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toUpperCase();
      case 'case-dot':
        return input.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[^a-zA-Z0-9]+/g, '.').replace(/^\.+|\.+$/g, '').toLowerCase();
      case 'case-path':
        return input.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[^a-zA-Z0-9]+/g, '/').replace(/^\/+|\/+$/g, '').toLowerCase();
      case 'case-swap':
        return input.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
      case 'slugify':
        return input.toString().toLowerCase().trim()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '');
      case 'reverse-chars':
        return Array.from(input).reverse().join('');
      case 'reverse-words':
        return input.split(/(\s+)/).reverse().join('');
      case 'reverse-lines':
        return input.split('\n').reverse().join('\n');
      case 'palindrome': {
        const clean = input.toLowerCase().replace(/[^a-z0-9]/g, '');
        const rev = clean.split('').reverse().join('');
        const isPal = clean.length > 0 && clean === rev;
        return isPal ? `YES, IT'S A PALINDROME!\n\nOriginal normalized: "${clean}"\nReversed: "${rev}"` : `NO, NOT A PALINDROME.\n\nOriginal normalized: "${clean}"\nReversed: "${rev}"`;
      }
      case 'sort-az':
        return input.split('\n').sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).join('\n');
      case 'sort-za':
        return input.split('\n').sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' })).join('\n');
      case 'sort-length':
        return input.split('\n').sort((a, b) => a.length - b.length).join('\n');
      case 'dedup': {
        const seen = new Set<string>();
        const lines = input.split('\n').filter(l => {
          if (seen.has(l)) return false;
          seen.add(l);
          return true;
        });
        return lines.join('\n');
      }
      case 'remove-empty':
        return input.split('\n').filter(l => l.trim().length > 0).join('\n');
      case 'trim':
        return input.split('\n').map(l => l.trim()).join('\n');
      case 'collapse-spaces':
        return input.replace(/[ \t]+/g, ' ');
      case 'line-numbers':
        return input.split('\n').map((l, i) => `${i + 1}. ${l}`).join('\n');
      case 'prefix-suffix': {
        const p = param1 || '';
        const s = param2 || '';
        return input.split('\n').map(l => `${p}${l}${s}`).join('\n');
      }
      case 'quote-lines':
        return input.split('\n').map(l => `"${l.replace(/"/g, '\\"')}"`).join('\n');
      case 'add-commas':
        return input.split('\n').map((l, i, arr) => i < arr.length - 1 ? `${l},` : l).join('\n');
      case 'center-align': {
        const width = wrapCols || 60;
        return input.split('\n').map(l => {
          if (l.length >= width) return l;
          const pad = Math.floor((width - l.length) / 2);
          return ' '.repeat(pad) + l;
        }).join('\n');
      }
      case 'right-align': {
        const width = wrapCols || 60;
        return input.split('\n').map(l => {
          if (l.length >= width) return l;
          return ' '.repeat(width - l.length) + l;
        }).join('\n');
      }
      case 'leading-spaces':
        return input.split('\n').map(l => l.replace(/^\s+/, '')).join('\n');
      case 'trailing-spaces':
        return input.split('\n').map(l => l.replace(/\s+$/, '')).join('\n');
      case 'repeat': {
        const sep = repeatSep.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        return Array(Math.max(1, Math.min(1000, repeatCount))).fill(input).join(sep);
      }
      case 'char-frequency': {
        const map: Record<string, number> = {};
        for (const ch of input) {
          map[ch] = (map[ch] || 0) + 1;
        }
        const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
        const total = input.length;
        return entries.map(([char, count]) => {
          const displayChar = char === ' ' ? '[space]' : char === '\n' ? '[newline]' : char === '\t' ? '[tab]' : char;
          const pct = ((count / total) * 100).toFixed(2);
          return `${displayChar.padEnd(10)}: ${count.toString().padStart(5)} times (${pct}%)`;
        }).join('\n');
      }
      case 'word-frequency': {
        const words = input.toLowerCase().match(/\b[a-z0-9_'-]+\b/g) || [];
        const map: Record<string, number> = {};
        for (const w of words) {
          map[w] = (map[w] || 0) + 1;
        }
        const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
        const total = words.length;
        return `Total Words: ${total}\nUnique Words: ${entries.length}\n\n` +
          entries.map(([w, c]) => `${w.padEnd(16)}: ${c.toString().padStart(4)} (${((c/total)*100).toFixed(1)}%)`).join('\n');
      }
      case 'vowels-consonants': {
        const vowels = (input.match(/[aeiou]/gi) || []).length;
        const consonants = (input.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;
        const digits = (input.match(/[0-9]/g) || []).length;
        const spaces = (input.match(/\s/g) || []).length;
        const other = input.length - (vowels + consonants + digits + spaces);
        return `Vowels:      ${vowels}\nConsonants:  ${consonants}\nDigits:      ${digits}\nWhitespace:  ${spaces}\nPunctuation: ${other}\nTotal Chars: ${input.length}`;
      }
      case 'extract-emails': {
        const emails = input.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
        return Array.from(new Set(emails)).join('\n') || 'No email addresses found.';
      }
      case 'extract-urls': {
        const urls = input.match(/https?:\/\/[^\s/$.?#].[^\s]*/gi) || [];
        return Array.from(new Set(urls)).join('\n') || 'No URLs found.';
      }
      case 'extract-phones': {
        const phones = input.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g) || [];
        return Array.from(new Set(phones)).join('\n') || 'No phone numbers found.';
      }
      case 'extract-numbers': {
        const nums = input.match(/-?\d+(\.\d+)?/g) || [];
        return nums.join('\n') || 'No numbers found.';
      }
      case 'extract-hashtags': {
        const tags = input.match(/#[a-zA-Z0-9_]+/g) || [];
        return Array.from(new Set(tags)).join('\n') || 'No hashtags found.';
      }
      case 'extract-mentions': {
        const mentions = input.match(/@[a-zA-Z0-9_]+/g) || [];
        return Array.from(new Set(mentions)).join('\n') || 'No user mentions found.';
      }
      case 'extract-ipv4': {
        const ips = input.match(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g) || [];
        return Array.from(new Set(ips)).join('\n') || 'No IPv4 addresses found.';
      }
      case 'remove-punct':
        return input.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '');
      case 'remove-numbers':
        return input.replace(/[0-9]/g, '');
      case 'remove-accents':
        return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      case 'find-replace': {
        if (!param1) return input;
        try {
          const reg = new RegExp(param1, 'g');
          return input.replace(reg, param2 || '');
        } catch {
          return input.split(param1).join(param2 || '');
        }
      }
      case 'rot13':
        return input.replace(/[a-zA-Z]/g, c => {
          const base = c <= 'Z' ? 65 : 97;
          return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
        });
      case 'rot47':
        return input.split('').map(c => {
          const code = c.charCodeAt(0);
          if (code >= 33 && code <= 126) {
            return String.fromCharCode(33 + ((code - 33 + 47) % 94));
          }
          return c;
        }).join('');
      case 'caesar': {
        const shift = ((caesarShift % 26) + 26) % 26;
        return input.replace(/[a-zA-Z]/g, c => {
          const base = c <= 'Z' ? 65 : 97;
          return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
        });
      }
      case 'atbash': {
        return input.replace(/[a-zA-Z]/g, c => {
          if (c >= 'a' && c <= 'z') return String.fromCharCode(122 - (c.charCodeAt(0) - 97));
          if (c >= 'A' && c <= 'Z') return String.fromCharCode(90 - (c.charCodeAt(0) - 65));
          return c;
        });
      }
      case 'morse-encode': {
        const morseMap: Record<string, string> = {
          A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
          I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
          Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
          Y: '-.--', Z: '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
          '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
          ' ': '/'
        };
        return input.toUpperCase().split('').map(c => morseMap[c] || c).join(' ');
      }
      case 'morse-decode': {
        const reverseMorse: Record<string, string> = {
          '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G', '....': 'H',
          '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P',
          '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
          '-.--': 'Y', '--..': 'Z', '.----': '1', '..---': '2', '...--': '3', '....-': '4',
          '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9', '-----': '0',
          '/': ' '
        };
        return input.split(/\s+/).map(m => reverseMorse[m] || m).join('');
      }
      case 'bin-to-text': {
        try {
          const bins = input.trim().split(/\s+/);
          return bins.map(b => String.fromCharCode(parseInt(b, 2))).join('');
        } catch {
          return 'Invalid binary string.';
        }
      }
      case 'text-to-bin': {
        return input.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
      }
      case 'hex-to-text': {
        try {
          const cleanHex = input.replace(/\s+/g, '');
          let str = '';
          for (let i = 0; i < cleanHex.length; i += 2) {
            str += String.fromCharCode(parseInt(cleanHex.substr(i, 2), 16));
          }
          return str;
        } catch {
          return 'Invalid hex string.';
        }
      }
      case 'text-to-hex': {
        return input.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
      }
      case 'nato': {
        const natoMap: Record<string, string> = {
          A: 'Alpha', B: 'Bravo', C: 'Charlie', D: 'Delta', E: 'Echo', F: 'Foxtrot', G: 'Golf',
          H: 'Hotel', I: 'India', J: 'Juliett', K: 'Kilo', L: 'Lima', M: 'Mike', N: 'November',
          O: 'Oscar', P: 'Papa', Q: 'Quebec', R: 'Romeo', S: 'Sierra', T: 'Tango', U: 'Uniform',
          V: 'Victor', W: 'Whiskey', X: 'X-ray', Y: 'Yankee', Z: 'Zulu',
          '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four', '5': 'Five',
          '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine'
        };
        return input.toUpperCase().split('').map(c => natoMap[c] || c).join(' ');
      }
      case 'zalgo': {
        const diacritics = ['\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0306', '\u0307', '\u0308', '\u0309', '\u030A', '\u030B', '\u030C', '\u030D', '\u030E', '\u030F', '\u0310'];
        return input.split('').map(c => {
          if (c === ' ') return c;
          let res = c;
          for (let i = 0; i < 4; i++) {
            res += diacritics[Math.floor(Math.random() * diacritics.length)];
          }
          return res;
        }).join('');
      }
      case 'upside-down': {
        const flipTable: Record<string, string> = {
          a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ', k: 'ʞ',
          l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ',
          w: 'ʍ', x: 'x', y: 'ʎ', z: 'z', A: '∀', B: '𐐒', C: 'Ɔ', D: '◖', E: 'Ǝ', F: 'Ⅎ', G: '⅁',
          H: 'H', I: 'I', J: 'ſ', K: 'ʞ', L: '˥', M: 'W', N: 'N', O: 'O', P: 'Ԁ', Q: 'Ό', R: 'ᴚ',
          S: 'S', T: '⊥', U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
          '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '0': '0',
          '?': '¿', '!': '¡', '.': '˙', ',': '\'', '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{'
        };
        return input.split('').reverse().map(c => flipTable[c] || c).join('');
      }
      case 'leetspeak': {
        const leet: Record<string, string> = {
          A: '4', a: '4', B: '8', b: '8', E: '3', e: '3', G: '6', g: '9', I: '1', i: '1',
          L: '1', l: '1', O: '0', o: '0', S: '5', s: '5', T: '7', t: '7', Z: '2', z: '2'
        };
        return input.split('').map(c => leet[c] || c).join('');
      }
      case 'braille': {
        const brailleMap: Record<string, string> = {
          a: '⠁', b: '⠃', c: '⠉', d: '⠙', e: '⠑', f: '⠋', g: '⠛', h: '⠓', i: '⠊', j: '⠚',
          k: '⠅', l: '⠇', m: '⠍', n: '⠝', o: '⠕', p: '⠏', q: '⠟', r: '⠗', s: '⠎', t: '⠞',
          u: '⠥', v: '⠧', w: '⠺', x: '⠭', y: '⠽', z: '⠵', ' ': ' ',
          '1': '⠂', '2': '⠆', '3': '⠒', '4': '⠲', '5': '⠢', '6': '⠖', '7': '⠶', '8': '⠦', '9': '⠔', '0': '⠴'
        };
        return input.toLowerCase().split('').map(c => brailleMap[c] || c).join('');
      }
      case 'html-encode':
        return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
      case 'html-decode': {
        const doc = new DOMParser().parseFromString(input, 'text/html');
        return doc.documentElement.textContent || '';
      }
      case 'strip-html':
        return input.replace(/<[^>]*>?/gm, '');
      case 'lines-to-csv':
        return input.split('\n').filter(Boolean).join(', ');
      case 'csv-to-lines':
        return input.split(/,\s*/).join('\n');
      case 'shuffle-lines': {
        const arr = input.split('\n');
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('\n');
      }
      case 'truncate': {
        const len = truncateLen || 50;
        return input.length > len ? input.slice(0, len) + '...' : input;
      }
      case 'word-wrap': {
        const cols = wrapCols || 40;
        const regex = new RegExp(`(?![^\\n]{1,${cols}}$)([^\\n]{1,${cols}})\\s`, 'g');
        return input.replace(regex, '$1\n');
      }
      default:
        return input;
    }
  }, [input, mode, param1, param2, caesarShift, repeatCount, repeatSep, wrapCols, truncateLen]);

  // Statistics for word counter
  const stats = useMemo(() => {
    const chars = input.length;
    const charsNoSpaces = input.replace(/\s/g, '').length;
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const sentences = input.trim() ? (input.match(/[.!?]+(\s|$)/g) || []).length || 1 : 0;
    const paragraphs = input.trim() ? input.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    const readingTimeMin = (words / 200).toFixed(1);
    const speakingTimeMin = (words / 130).toFixed(1);

    return { chars, charsNoSpaces, words, sentences, paragraphs, readingTimeMin, speakingTimeMin };
  }, [input]);

  const isWordCounter = mode === 'word-counter';

  return (
    <div className="space-y-6">
      {/* Word Counter Detailed Stats Header */}
      {isWordCounter && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: 'Words', val: stats.words },
            { label: 'Characters', val: stats.chars },
            { label: 'No Spaces', val: stats.charsNoSpaces },
            { label: 'Sentences', val: stats.sentences },
            { label: 'Paragraphs', val: stats.paragraphs },
            { label: 'Read Time', val: `${stats.readingTimeMin} m` },
            { label: 'Speak Time', val: `${stats.speakingTimeMin} m` }
          ].map(s => (
            <div key={s.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">{s.label}</span>
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 block">{s.val}</span>
            </div>
          ))}
        </div>
      )}

      {/* Dynamic Controls based on tool mode */}
      {mode === 'caesar' && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Caesar Shift Amount:</label>
          <input
            type="number"
            value={caesarShift}
            onChange={(e) => setCaesarShift(parseInt(e.target.value) || 0)}
            className="w-20 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
          />
        </div>
      )}

      {mode === 'find-replace' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Find (Plain text or RegEx pattern):</label>
            <input
              type="text"
              value={param1}
              onChange={(e) => setParam1(e.target.value)}
              placeholder="e.g. foo or \d+"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Replace With:</label>
            <input
              type="text"
              value={param2}
              onChange={(e) => setParam2(e.target.value)}
              placeholder="e.g. bar"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            />
          </div>
        </div>
      )}

      {mode === 'prefix-suffix' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Prefix (Prepended to each line):</label>
            <input
              type="text"
              value={param1}
              onChange={(e) => setParam1(e.target.value)}
              placeholder="e.g. - or const "
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Suffix (Appended to each line):</label>
            <input
              type="text"
              value={param2}
              onChange={(e) => setParam2(e.target.value)}
              placeholder="e.g. , or ;"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            />
          </div>
        </div>
      )}

      {mode === 'repeat' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Repeat Count:</label>
            <input
              type="number"
              min="1"
              max="500"
              value={repeatCount}
              onChange={(e) => setRepeatCount(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Separator (\n for newlines, \t for tab):</label>
            <input
              type="text"
              value={repeatSep}
              onChange={(e) => setRepeatSep(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            />
          </div>
        </div>
      )}

      {(mode === 'word-wrap' || mode === 'center-align' || mode === 'right-align') && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Column Character Width:</label>
          <input
            type="number"
            min="10"
            max="200"
            value={wrapCols}
            onChange={(e) => setWrapCols(parseInt(e.target.value) || 40)}
            className="w-24 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
          />
        </div>
      )}

      {mode === 'truncate' && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Character Truncate Limit:</label>
          <input
            type="number"
            min="5"
            max="1000"
            value={truncateLen}
            onChange={(e) => setTruncateLen(parseInt(e.target.value) || 50)}
            className="w-24 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
          />
        </div>
      )}

      {/* Dual Panel: Input and Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Input Text
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInput('')}
                className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1"
                title="Clear input"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste your text here..."
            rows={12}
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y shadow-xs"
          />
          <div className="mt-2 text-right text-xs text-slate-400">
            {input.length} characters • {input.trim() ? input.trim().split(/\s+/).length : 0} words
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {isWordCounter ? 'Formatted Preview' : 'Result / Output'}
            </span>
            <div className="flex items-center gap-2">
              <QuickCopy text={output} />
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Result will appear here..."
            rows={12}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono text-sm focus:outline-none resize-y shadow-xs"
          />
          <div className="mt-2 text-right text-xs text-slate-400">
            {output.length} characters
          </div>
        </div>
      </div>
    </div>
  );
};
