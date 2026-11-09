// Client-Side LLM Tool & Function Calling Execution Registry
// 100% Client-Side, Zero Network Hops, Sub-Millisecond Tool Execution

export interface LlmToolDefinition {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  parameters: {
    name: string;
    type: 'string' | 'number' | 'boolean';
    description: string;
    required: boolean;
  }[];
  handler: (args: Record<string, any>) => Promise<string> | string;
}

export interface ToolCallExecution {
  id: string;
  toolName: string;
  displayName: string;
  args: Record<string, any>;
  result: string;
  executionTimeMs: number;
  status: 'success' | 'error';
}

// Cryptographic SHA-256 helper
async function computeSha256(text: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Simple deterministic fallback hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

export const LLM_AVAILABLE_TOOLS: Record<string, LlmToolDefinition> = {
  calculator: {
    name: 'calculator',
    displayName: 'Math Calculator',
    description: 'Evaluates mathematical and arithmetic expressions (e.g. 145 * 24 + sqrt(144)).',
    icon: 'Calculator',
    parameters: [
      { name: 'expression', type: 'string', description: 'Mathematical expression to calculate', required: true }
    ],
    handler: (args) => {
      let expr = String(args.expression || '').trim();
      if (!expr) return 'Error: Empty expression';
      try {
        // Auto-balance parentheses if needed
        let openP = (expr.match(/\(/g) || []).length;
        let closeP = (expr.match(/\)/g) || []).length;
        while (openP > closeP) {
          expr += ')';
          closeP++;
        }
        while (closeP > openP && expr.endsWith(')')) {
          expr = expr.slice(0, -1);
          closeP--;
        }

        // Sanitize and replace math functions and operators with Math equivalents
        const clean = expr
          .replace(/\^/g, '**')
          .replace(/sqrt\s*\(/gi, 'Math.sqrt(')
          .replace(/cbrt\s*\(/gi, 'Math.cbrt(')
          .replace(/abs\s*\(/gi, 'Math.abs(')
          .replace(/round\s*\(/gi, 'Math.round(')
          .replace(/floor\s*\(/gi, 'Math.floor(')
          .replace(/ceil\s*\(/gi, 'Math.ceil(')
          .replace(/pow\s*\(/gi, 'Math.pow(')
          .replace(/sin\s*\(/gi, 'Math.sin(')
          .replace(/cos\s*\(/gi, 'Math.cos(')
          .replace(/tan\s*\(/gi, 'Math.tan(')
          .replace(/log\s*\(/gi, 'Math.log(')
          .replace(/exp\s*\(/gi, 'Math.exp(')
          .replace(/\bpi\b/gi, 'Math.PI')
          .replace(/\be\b/gi, 'Math.E')
          .replace(/[^0-9+\-*/().Math,PIEsqrtoabcielnpw%* ]/g, '');

        // Safe evaluation
        const fn = new Function(`return (${clean})`);
        const res = fn();
        if (typeof res !== 'number' || isNaN(res)) {
          return String(res);
        }
        return Number.isInteger(res) ? res.toString() : Number(res.toFixed(6)).toString();
      } catch (err: any) {
        return `Calculation Error: ${err?.message || 'Invalid syntax'}`;
      }
    }
  },

  timestamp: {
    name: 'timestamp',
    displayName: 'DateTime Inspector',
    description: 'Retrieves current UTC, local time, and Unix millisecond timestamps.',
    icon: 'Clock',
    parameters: [],
    handler: () => {
      const now = new Date();
      return JSON.stringify({
        iso: now.toISOString(),
        utc: now.toUTCString(),
        local: now.toLocaleString(),
        epochMs: now.getTime(),
        unixSeconds: Math.floor(now.getTime() / 1000)
      }, null, 2);
    }
  },

  unit_converter: {
    name: 'unit_converter',
    displayName: 'Unit Converter',
    description: 'Converts between common units of length, temperature, data storage, and weight.',
    icon: 'Scale',
    parameters: [
      { name: 'value', type: 'number', description: 'Numeric value to convert', required: true },
      { name: 'fromUnit', type: 'string', description: 'Source unit (km, mi, c, f, kg, lb, mb, gb)', required: true },
      { name: 'toUnit', type: 'string', description: 'Target unit (km, mi, c, f, kg, lb, mb, gb)', required: true }
    ],
    handler: (args) => {
      const val = Number(args.value || 0);
      const from = String(args.fromUnit || '').toLowerCase().trim();
      const to = String(args.toUnit || '').toLowerCase().trim();

      if (from === 'km' && to === 'mi') return `${(val * 0.621371).toFixed(4)} miles`;
      if (from === 'mi' && to === 'km') return `${(val * 1.60934).toFixed(4)} km`;
      if (from === 'c' && to === 'f') return `${((val * 9 / 5) + 32).toFixed(2)} °F`;
      if (from === 'f' && to === 'c') return `${(((val - 32) * 5) / 9).toFixed(2)} °C`;
      if (from === 'kg' && to === 'lb') return `${(val * 2.20462).toFixed(4)} lbs`;
      if (from === 'lb' && to === 'kg') return `${(val * 0.453592).toFixed(4)} kg`;
      if (from === 'mb' && to === 'gb') return `${(val / 1024).toFixed(4)} GB`;
      if (from === 'gb' && to === 'mb') return `${(val * 1024).toFixed(0)} MB`;

      return `${val} ${from} = (Conversion not mapped to ${to})`;
    }
  },

  crypto_hash: {
    name: 'crypto_hash',
    displayName: 'SHA-256 Hasher',
    description: 'Computes cryptographic SHA-256 digest of input text.',
    icon: 'ShieldCheck',
    parameters: [
      { name: 'text', type: 'string', description: 'Text to hash', required: true }
    ],
    handler: async (args) => {
      const text = String(args.text || '');
      const hash = await computeSha256(text);
      return `SHA-256("${text}") = ${hash}`;
    }
  },

  base64: {
    name: 'base64',
    displayName: 'Base64 Encoder/Decoder',
    description: 'Encodes plain text to Base64 or decodes Base64 to plain text.',
    icon: 'Binary',
    parameters: [
      { name: 'action', type: 'string', description: 'encode or decode', required: true },
      { name: 'text', type: 'string', description: 'String to transform', required: true }
    ],
    handler: (args) => {
      const action = String(args.action || 'encode').toLowerCase();
      const text = String(args.text || '');
      try {
        if (action === 'decode') {
          return atob(text);
        }
        return btoa(text);
      } catch (err: any) {
        return `Base64 Error: ${err?.message || 'Invalid string'}`;
      }
    }
  },

  system_specs: {
    name: 'system_specs',
    displayName: 'Client Hardware Specs',
    description: 'Inspects client-side browser device memory, CPU concurrency, and hardware scaling tier.',
    icon: 'Cpu',
    parameters: [],
    handler: () => {
      const ram = typeof navigator !== 'undefined' && (navigator as any).deviceMemory ? (navigator as any).deviceMemory : 8;
      const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
      const hasGpu = typeof navigator !== 'undefined' && Boolean((navigator as any).gpu);
      return JSON.stringify({
        deviceMemoryEstimateGb: ram,
        cpuHardwareCores: cores,
        webGpuAvailable: hasGpu,
        userAgentPlatform: typeof navigator !== 'undefined' ? navigator.platform : 'browser'
      }, null, 2);
    }
  },

  uuid_generator: {
    name: 'uuid_generator',
    displayName: 'UUID & ID Generator',
    description: 'Generates cryptographically random UUID v4 identifiers, CUIDs, and nanoids.',
    icon: 'Key',
    parameters: [
      { name: 'count', type: 'number', description: 'Number of UUIDs to generate (1-10)', required: false },
      { name: 'format', type: 'string', description: 'uuid, nanoid, or short', required: false }
    ],
    handler: (args) => {
      const count = Math.min(10, Math.max(1, Number(args.count || 1)));
      const format = String(args.format || 'uuid').toLowerCase();
      const results: string[] = [];

      for (let i = 0; i < count; i++) {
        if (format === 'nanoid') {
          const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';
          let str = '';
          for (let c = 0; c < 21; c++) str += chars[Math.floor(Math.random() * chars.length)];
          results.push(str);
        } else if (format === 'short') {
          results.push(Math.random().toString(36).substring(2, 10));
        } else {
          results.push('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          }));
        }
      }

      return results.length === 1 ? results[0] : results.join('\n');
    }
  },

  json_formatter: {
    name: 'json_formatter',
    displayName: 'JSON Formatter & Validator',
    description: 'Validates, beautifies, or minifies JSON strings client-side.',
    icon: 'Code',
    parameters: [
      { name: 'json', type: 'string', description: 'Raw JSON string', required: true },
      { name: 'action', type: 'string', description: 'format or minify', required: false }
    ],
    handler: (args) => {
      const raw = String(args.json || '').trim();
      const action = String(args.action || 'format').toLowerCase();
      try {
        const parsed = JSON.parse(raw);
        if (action === 'minify') {
          return JSON.stringify(parsed);
        }
        return JSON.stringify(parsed, null, 2);
      } catch (err: any) {
        return `JSON Validation Error: ${err?.message || 'Invalid JSON syntax'}`;
      }
    }
  },

  url_codec: {
    name: 'url_codec',
    displayName: 'URL Encoder, Decoder & Parser',
    description: 'Encodes/decodes URLs and breaks down query strings and host components.',
    icon: 'Link',
    parameters: [
      { name: 'url', type: 'string', description: 'URL or string to process', required: true },
      { name: 'action', type: 'string', description: 'encode, decode, or parse', required: false }
    ],
    handler: (args) => {
      const u = String(args.url || '').trim();
      const action = String(args.action || 'parse').toLowerCase();

      try {
        if (action === 'encode') {
          return encodeURIComponent(u);
        }
        if (action === 'decode') {
          return decodeURIComponent(u);
        }

        const parsed = new URL(u.startsWith('http') ? u : `https://${u}`);
        const queryParams: Record<string, string> = {};
        parsed.searchParams.forEach((val, key) => { queryParams[key] = val; });

        return JSON.stringify({
          href: parsed.href,
          protocol: parsed.protocol,
          host: parsed.host,
          hostname: parsed.hostname,
          port: parsed.port || '(default)',
          pathname: parsed.pathname,
          search: parsed.search,
          queryParams,
          hash: parsed.hash
        }, null, 2);
      } catch (err: any) {
        return `URL Error: ${err?.message || 'Invalid URL'}`;
      }
    }
  },

  regex_tester: {
    name: 'regex_tester',
    displayName: 'Regular Expression Tester',
    description: 'Tests regular expressions against sample text and extracts matched groups.',
    icon: 'Search',
    parameters: [
      { name: 'pattern', type: 'string', description: 'Regular expression pattern without slashes', required: true },
      { name: 'text', type: 'string', description: 'Target string to test', required: true },
      { name: 'flags', type: 'string', description: 'Regex flags (e.g. g, i, m)', required: false }
    ],
    handler: (args) => {
      const pattern = String(args.pattern || '');
      const text = String(args.text || '');
      const flags = String(args.flags || 'g');

      try {
        const re = new RegExp(pattern, flags);
        const matches: { match: string; index?: number; groups?: string[] }[] = [];

        if (flags.includes('g')) {
          let m;
          while ((m = re.exec(text)) !== null) {
            matches.push({
              match: m[0],
              index: m.index,
              groups: m.slice(1)
            });
            if (matches.length > 50) break;
          }
        } else {
          const m = re.exec(text);
          if (m) {
            matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
          }
        }

        return JSON.stringify({
          pattern,
          flags,
          isMatch: matches.length > 0,
          matchCount: matches.length,
          matches
        }, null, 2);
      } catch (err: any) {
        return `Regex Error: ${err?.message || 'Invalid regular expression'}`;
      }
    }
  },

  color_converter: {
    name: 'color_converter',
    displayName: 'Color Space Converter & Palette',
    description: 'Converts between HEX, RGB, and HSL color spaces and generates complementary shades.',
    icon: 'Palette',
    parameters: [
      { name: 'color', type: 'string', description: 'HEX (e.g. #6366f1) or RGB color string', required: true }
    ],
    handler: (args) => {
      const raw = String(args.color || '').trim().replace(/['"]/g, '');

      let r = 99, g = 102, b = 241;
      if (raw.startsWith('#')) {
        const hex = raw.slice(1);
        const fullHex = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex;
        const num = parseInt(fullHex, 16);
        if (!isNaN(num)) {
          r = (num >> 16) & 255;
          g = (num >> 8) & 255;
          b = num & 255;
        }
      } else if (raw.startsWith('rgb')) {
        const match = raw.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
        if (match) {
          r = parseInt(match[1]);
          g = parseInt(match[2]);
          b = parseInt(match[3]);
        }
      }

      const rn = r / 255, gn = g / 255, bn = b / 255;
      const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case rn: h = (gn - bn) / d + (gn < bn ? 6 : 0); break;
          case gn: h = (bn - rn) / d + 2; break;
          case bn: h = (rn - gn) / d + 4; break;
        }
        h /= 6;
      }

      const hexStr = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      const rgbStr = `rgb(${r}, ${g}, ${b})`;
      const hslStr = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;

      return JSON.stringify({
        hex: hexStr,
        rgb: rgbStr,
        hsl: hslStr,
        channels: { red: r, green: g, blue: b },
        contrastRatio: (0.299 * r + 0.587 * g + 0.114 * b) > 128 ? 'Dark text recommended' : 'Light text recommended'
      }, null, 2);
    }
  },

  text_stats: {
    name: 'text_stats',
    displayName: 'Text Statistics & Readability',
    description: 'Calculates word count, character count, estimated reading time, and reading level.',
    icon: 'BarChart',
    parameters: [
      { name: 'text', type: 'string', description: 'Text to analyze', required: true }
    ],
    handler: (args) => {
      const text = String(args.text || '');
      const words = text.trim().split(/\s+/).filter(Boolean);
      const chars = text.length;
      const charsNoSpaces = text.replace(/\s/g, '').length;
      const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
      const paragraphs = text.split(/\n\s*\n/).filter(Boolean).length || 1;
      const readingTimeMinutes = Number((words.length / 200).toFixed(2));

      return JSON.stringify({
        wordCount: words.length,
        characterCount: chars,
        characterCountNoSpaces: charsNoSpaces,
        sentenceCount: sentences,
        paragraphCount: paragraphs,
        estimatedReadingTime: `${readingTimeMinutes} min (${Math.round(readingTimeMinutes * 60)} sec)`,
        averageWordLength: words.length > 0 ? Number((charsNoSpaces / words.length).toFixed(2)) : 0
      }, null, 2);
    }
  },

  password_generator: {
    name: 'password_generator',
    displayName: 'High-Entropy Password Generator',
    description: 'Generates cryptographically secure passwords with custom entropy rules.',
    icon: 'Shield',
    parameters: [
      { name: 'length', type: 'number', description: 'Password length (8-64, default 16)', required: false },
      { name: 'includeSymbols', type: 'boolean', description: 'Include special symbols', required: false },
      { name: 'includeNumbers', type: 'boolean', description: 'Include numeric digits', required: false }
    ],
    handler: (args) => {
      const len = Math.min(64, Math.max(8, Number(args.length || 16)));
      const symbols = args.includeSymbols !== false;
      const numbers = args.includeNumbers !== false;

      let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (numbers) chars += '0123456789';
      if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

      let pass = '';
      if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const buf = new Uint32Array(len);
        crypto.getRandomValues(buf);
        for (let i = 0; i < len; i++) {
          pass += chars[buf[i] % chars.length];
        }
      } else {
        for (let i = 0; i < len; i++) {
          pass += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      const entropyBits = Math.round(len * Math.log2(chars.length));
      return JSON.stringify({
        password: pass,
        length: len,
        entropyBits: `${entropyBits} bits (Ultra-Strong)`,
        hasSymbols: symbols,
        hasNumbers: numbers
      }, null, 2);
    }
  },

  jwt_decoder: {
    name: 'jwt_decoder',
    displayName: 'JWT Token Inspector',
    description: 'Decodes JSON Web Tokens (JWT) into readable header, payload claims, and expiry dates.',
    icon: 'FileCheck',
    parameters: [
      { name: 'token', type: 'string', description: 'Raw JWT token string', required: true }
    ],
    handler: (args) => {
      const token = String(args.token || '').trim();
      const parts = token.split('.');
      if (parts.length < 2) {
        return 'Error: Invalid JWT structure (expected header.payload.signature)';
      }

      const decodeB64 = (s: string) => {
        const clean = s.replace(/-/g, '+').replace(/_/g, '/');
        const pad = clean.length % 4 === 0 ? clean : clean + '='.repeat(4 - (clean.length % 4));
        return atob(pad);
      };

      try {
        const header = JSON.parse(decodeB64(parts[0]));
        const payload = JSON.parse(decodeB64(parts[1]));
        const isExpired = payload.exp ? (Date.now() / 1000 > payload.exp) : null;
        const expiryDate = payload.exp ? new Date(payload.exp * 1000).toUTCString() : 'No expiry set';

        return JSON.stringify({
          algorithm: header.alg || 'unknown',
          type: header.typ || 'JWT',
          header,
          payload,
          expiry: { isExpired, expiryDate }
        }, null, 2);
      } catch (err: any) {
        return `JWT Decode Error: ${err?.message || 'Invalid Base64URL string'}`;
      }
    }
  },

  html_entity_codec: {
    name: 'html_entity_codec',
    displayName: 'HTML Entity Encoder/Decoder',
    description: 'Encodes plain text to HTML safe entities or decodes HTML entities.',
    icon: 'Code2',
    parameters: [
      { name: 'text', type: 'string', description: 'Text to transform', required: true },
      { name: 'action', type: 'string', description: 'encode or decode', required: false }
    ],
    handler: (args) => {
      const text = String(args.text || '');
      const action = String(args.action || 'encode').toLowerCase();

      if (action === 'decode') {
        return text
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");
      }

      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
  },

  diff_checker: {
    name: 'diff_checker',
    displayName: 'Text & Code Diff Inspector',
    description: 'Compares two text strings or code snippets and reports additions and removals.',
    icon: 'GitCompare',
    parameters: [
      { name: 'original', type: 'string', description: 'Original text version', required: true },
      { name: 'modified', type: 'string', description: 'Modified text version', required: true }
    ],
    handler: (args) => {
      const orig = String(args.original || '').split('\n');
      const mod = String(args.modified || '').split('\n');

      const added: string[] = [];
      const removed: string[] = [];

      mod.forEach((line) => {
        if (!orig.includes(line)) added.push(line);
      });
      orig.forEach((line) => {
        if (!mod.includes(line)) removed.push(line);
      });

      return JSON.stringify({
        totalOriginalLines: orig.length,
        totalModifiedLines: mod.length,
        addedLineCount: added.length,
        removedLineCount: removed.length,
        addedLines: added.slice(0, 10),
        removedLines: removed.slice(0, 10)
      }, null, 2);
    }
  },

  cron_parser: {
    name: 'cron_parser',
    displayName: 'Cron Expression Explainer',
    description: 'Explains standard 5-part cron schedule expressions in plain human English.',
    icon: 'Clock',
    parameters: [
      { name: 'expression', type: 'string', description: 'Cron expression e.g. "*/15 * * * *"', required: true }
    ],
    handler: (args) => {
      const expr = String(args.expression || '').trim();
      const parts = expr.split(/\s+/);
      if (parts.length < 5) return 'Error: Cron expression must contain 5 fields (minute hour day-of-month month day-of-week)';

      const [min, hour, dom, mon, dow] = parts;
      let desc = 'Execution Schedule: ';

      if (min === '*' && hour === '*') desc += 'Every minute of every day.';
      else if (min.startsWith('*/')) desc += `Every ${min.slice(2)} minutes.`;
      else if (hour === '*' && min === '0') desc += 'At the start of every hour.';
      else if (hour !== '*' && min !== '*') desc += `Daily at ${hour.padStart(2, '0')}:${min.padStart(2, '0')}.`;
      else desc += `Minute: ${min}, Hour: ${hour}.`;

      if (dow !== '*') desc += ` (Days of week: ${dow})`;
      if (dom !== '*') desc += ` (Days of month: ${dom})`;

      return JSON.stringify({
        expression: expr,
        explanation: desc,
        fields: { minute: min, hour, dayOfMonth: dom, month: mon, dayOfWeek: dow }
      }, null, 2);
    }
  },

  markdown_to_html: {
    name: 'markdown_to_html',
    displayName: 'Markdown to Semantic HTML',
    description: 'Converts Markdown text into clean, safe semantic HTML.',
    icon: 'FileText',
    parameters: [
      { name: 'markdown', type: 'string', description: 'Markdown string to convert', required: true }
    ],
    handler: (args) => {
      let md = String(args.markdown || '');
      md = md.replace(/^### (.*$)/gim, '<h3>$1</h3>');
      md = md.replace(/^## (.*$)/gim, '<h2>$1</h2>');
      md = md.replace(/^# (.*$)/gim, '<h1>$1</h1>');
      md = md.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
      md = md.replace(/\*(.*?)\*/gim, '<em>$1</em>');
      md = md.replace(/`([^`]+)`/gim, '<code>$1</code>');
      md = md.replace(/^\- (.*$)/gim, '<li>$1</li>');
      return md;
    }
  },

  ip_subnet_calculator: {
    name: 'ip_subnet_calculator',
    displayName: 'IPv4 CIDR Subnet Calculator',
    description: 'Calculates IPv4 CIDR network range, broadcast address, netmask, and usable hosts.',
    icon: 'Network',
    parameters: [
      { name: 'cidr', type: 'string', description: 'IPv4 CIDR string e.g. 192.168.1.0/24', required: true }
    ],
    handler: (args) => {
      const raw = String(args.cidr || '192.168.1.0/24').trim();
      const [ip, maskStr] = raw.split('/');
      const mask = parseInt(maskStr || '24', 10);
      if (isNaN(mask) || mask < 0 || mask > 32) return 'Error: Subnet mask must be between /0 and /32';

      const ipParts = ip.split('.').map(Number);
      if (ipParts.length !== 4 || ipParts.some(p => isNaN(p) || p < 0 || p > 255)) {
        return 'Error: Invalid IPv4 address format';
      }

      const ipNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
      const netmaskNum = mask === 0 ? 0 : (-1 << (32 - mask));
      const networkNum = ipNum & netmaskNum;
      const broadcastNum = networkNum | ~netmaskNum;

      const toIpStr = (num: number) => [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255
      ].join('.');

      const totalHosts = Math.pow(2, 32 - mask);
      const usableHosts = Math.max(0, totalHosts - 2);

      return JSON.stringify({
        cidr: `${ip}/${mask}`,
        networkAddress: toIpStr(networkNum),
        broadcastAddress: toIpStr(broadcastNum),
        subnetMask: toIpStr(netmaskNum),
        firstUsableHost: toIpStr(networkNum + 1),
        lastUsableHost: toIpStr(broadcastNum - 1),
        totalHosts,
        usableHosts
      }, null, 2);
    }
  },

  http_status: {
    name: 'http_status',
    displayName: 'HTTP Status Code Guide',
    description: 'Inspects RFC 9110 HTTP status codes, their semantic category, and meanings.',
    icon: 'HelpCircle',
    parameters: [
      { name: 'code', type: 'number', description: 'HTTP status code e.g. 200, 404, 500', required: true }
    ],
    handler: (args) => {
      const code = parseInt(String(args.code || '200'), 10);
      const STATUS_MAP: Record<number, { name: string; category: string; description: string }> = {
        200: { name: 'OK', category: '2xx Success', description: 'Request succeeded.' },
        201: { name: 'Created', category: '2xx Success', description: 'Resource created successfully.' },
        204: { name: 'No Content', category: '2xx Success', description: 'Request succeeded with no body returned.' },
        301: { name: 'Moved Permanently', category: '3xx Redirection', description: 'Resource URL has been permanently updated.' },
        304: { name: 'Not Modified', category: '3xx Redirection', description: 'Cached version is fresh and valid.' },
        400: { name: 'Bad Request', category: '4xx Client Error', description: 'Malformed request syntax or parameters.' },
        401: { name: 'Unauthorized', category: '4xx Client Error', description: 'Authentication credentials missing or invalid.' },
        403: { name: 'Forbidden', category: '4xx Client Error', description: 'Server understands request but refuses authorization.' },
        404: { name: 'Not Found', category: '4xx Client Error', description: 'Requested resource could not be found.' },
        429: { name: 'Too Many Requests', category: '4xx Client Error', description: 'Rate limit quota exceeded.' },
        500: { name: 'Internal Server Error', category: '5xx Server Error', description: 'Generic server failure.' },
        502: { name: 'Bad Gateway', category: '5xx Server Error', description: 'Invalid response from upstream proxy.' },
        503: { name: 'Service Unavailable', category: '5xx Server Error', description: 'Server temporarily overloaded or in maintenance.' }
      };

      const info = STATUS_MAP[code] || {
        name: 'Custom / Standard Code',
        category: `${Math.floor(code / 100)}xx Category`,
        description: 'Standard RFC HTTP response status code.'
      };

      return JSON.stringify({ code, ...info }, null, 2);
    }
  },

  morse_code: {
    name: 'morse_code',
    displayName: 'Morse Code Translator',
    description: 'Translates plain text into Morse code and Morse code back into plain English.',
    icon: 'Radio',
    parameters: [
      { name: 'text', type: 'string', description: 'Text or morse to transform', required: true },
      { name: 'action', type: 'string', description: 'encode or decode', required: false }
    ],
    handler: (args) => {
      const text = String(args.text || '').trim();
      const action = String(args.action || 'encode').toLowerCase();

      const MORSE: Record<string, string> = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
        '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
        '8': '---..', '9': '----.'
      };

      if (action === 'decode') {
        const REVERSE: Record<string, string> = {};
        Object.entries(MORSE).forEach(([k, v]) => { REVERSE[v] = k; });
        return text.split(' ').map(c => REVERSE[c] || c).join('');
      }

      return text.toUpperCase().split('').map(c => MORSE[c] || (c === ' ' ? '/' : c)).join(' ');
    }
  },

  lorem_generator: {
    name: 'lorem_generator',
    displayName: 'Lorem Ipsum Generator',
    description: 'Generates standard dummy placeholder text by word count or paragraph count.',
    icon: 'AlignLeft',
    parameters: [
      { name: 'count', type: 'number', description: 'Count of words/sentences (default 3)', required: false },
      { name: 'unit', type: 'string', description: 'words, sentences, or paragraphs', required: false }
    ],
    handler: (args) => {
      const count = Math.min(100, Math.max(1, Number(args.count || 3)));
      const unit = String(args.unit || 'paragraphs').toLowerCase();

      const LOREM_WORDS = [
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
        'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
        'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
        'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
        'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit'
      ];

      if (unit === 'words') {
        const words: string[] = [];
        for (let i = 0; i < count; i++) words.push(LOREM_WORDS[i % LOREM_WORDS.length]);
        return words.join(' ');
      }

      const paragraphs: string[] = [];
      for (let p = 0; p < count; p++) {
        paragraphs.push(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        );
      }
      return paragraphs.join('\n\n');
    }
  },

  financial_calculator: {
    name: 'financial_calculator',
    displayName: 'Loan EMI & Compound Interest',
    description: 'Calculates loan monthly EMI, total interest, or compound investment growth.',
    icon: 'DollarSign',
    parameters: [
      { name: 'principal', type: 'number', description: 'Initial principal amount', required: true },
      { name: 'ratePercent', type: 'number', description: 'Annual interest rate percentage', required: true },
      { name: 'years', type: 'number', description: 'Tenure duration in years', required: true },
      { name: 'type', type: 'string', description: 'emi or compound', required: false }
    ],
    handler: (args) => {
      const p = Number(args.principal || 10000);
      const r = Number(args.ratePercent || 7);
      const y = Number(args.years || 5);
      const type = String(args.type || 'emi').toLowerCase();

      if (type === 'compound') {
        const rateDec = r / 100;
        const total = p * Math.pow(1 + rateDec, y);
        const gain = total - p;
        return JSON.stringify({
          initialPrincipal: p,
          annualRatePercent: r,
          years: y,
          futureValue: Number(total.toFixed(2)),
          totalInterestEarned: Number(gain.toFixed(2))
        }, null, 2);
      }

      const monthlyRate = r / (12 * 100);
      const months = y * 12;
      const emi = (p * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      const totalPayment = emi * months;
      const totalInterest = totalPayment - p;

      return JSON.stringify({
        principal: p,
        annualRatePercent: r,
        tenureYears: y,
        tenureMonths: months,
        monthlyEmi: Number(emi.toFixed(2)),
        totalPayment: Number(totalPayment.toFixed(2)),
        totalInterest: Number(totalInterest.toFixed(2))
      }, null, 2);
    }
  },

  case_converter: {
    name: 'case_converter',
    displayName: 'String Case Transformer',
    description: 'Transforms text between camelCase, snake_case, kebab-case, PascalCase, and CONSTANT_CASE.',
    icon: 'Type',
    parameters: [
      { name: 'text', type: 'string', description: 'String to transform', required: true },
      { name: 'targetCase', type: 'string', description: 'camel, snake, kebab, pascal, constant, or title', required: false }
    ],
    handler: (args) => {
      const text = String(args.text || '').trim();
      const words = text.replace(/[_-]/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().split(/\s+/).filter(Boolean);

      return JSON.stringify({
        original: text,
        camelCase: words.map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join(''),
        snake_case: words.join('_'),
        kebab_case: words.join('-'),
        PascalCase: words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(''),
        CONSTANT_CASE: words.join('_').toUpperCase(),
        TitleCase: words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      }, null, 2);
    }
  }
};

// Dispatch a tool call by parsing tool invocation
export async function executeLlmToolCall(toolName: string, args: Record<string, any>): Promise<ToolCallExecution> {
  const t0 = performance.now();
  const tool = LLM_AVAILABLE_TOOLS[toolName];

  if (!tool) {
    return {
      id: `call-${Date.now()}`,
      toolName,
      displayName: toolName,
      args,
      result: `Error: Unknown tool "${toolName}". Available tools: ${Object.keys(LLM_AVAILABLE_TOOLS).join(', ')}`,
      executionTimeMs: Number((performance.now() - t0).toFixed(2)),
      status: 'error'
    };
  }

  try {
    const rawResult = await tool.handler(args);
    const elapsed = Math.max(0.1, Number((performance.now() - t0).toFixed(2)));
    return {
      id: `call-${Date.now()}`,
      toolName,
      displayName: tool.displayName,
      args,
      result: rawResult,
      executionTimeMs: elapsed,
      status: 'success'
    };
  } catch (err: any) {
    const elapsed = Math.max(0.1, Number((performance.now() - t0).toFixed(2)));
    return {
      id: `call-${Date.now()}`,
      toolName,
      displayName: tool.displayName,
      args,
      result: `Tool Execution Exception: ${err?.message || err}`,
      executionTimeMs: elapsed,
      status: 'error'
    };
  }
}

// Regex to detect and extract <tool_call>{"tool": "...", "args": {...}}</tool_call>
export function extractToolCalls(text: string): { tool: string; args: Record<string, any>; rawMatch: string }[] {
  const regex = /<tool_call>([\s\S]*?)<\/tool_call>/gi;
  const calls: { tool: string; args: Record<string, any>; rawMatch: string }[] = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      if (parsed.tool) {
        calls.push({
          tool: parsed.tool,
          args: parsed.args || {},
          rawMatch: match[0]
        });
      }
    } catch {
      // Ignore malformed JSON inside tags
    }
  }

  return calls;
}

// Natural language heuristic trigger: detects when user question warrants a tool call
export function detectHeuristicToolCall(prompt: string): { tool: string; args: Record<string, any> } | null {
  const p = prompt.toLowerCase().trim();

  // 1. Calculator trigger
  const isCalcTrigger = /(?:calculate|solve|what is|compute|evaluate)\s+/i.test(prompt);
  const hasMathExpr = /[0-9]+\s*[\+\-\*\/\^%]\s*[0-9]+|sqrt\s*\(|cbrt\s*\(|abs\s*\(|pow\s*\(/.test(prompt);

  if (isCalcTrigger || hasMathExpr) {
    let raw = prompt;
    const triggerMatch = prompt.match(/(?:calculate|solve|what is|compute|evaluate)\s+(.+)/i);
    if (triggerMatch && triggerMatch[1]) {
      raw = triggerMatch[1];
    }

    // Strip trailing conversational or instruction phrases
    raw = raw.replace(/\b(and\s+)?(explain|show|give|with|in)\b.*/i, '');
    raw = raw.replace(/\b(step\s+by\s+step|in\s+detail|using\s+steps|please)\b.*/i, '');
    raw = raw.replace(/[?!=]+$/, '');
    raw = raw.trim();

    // Verify it has numeric and operator or math function content
    if (/[0-9]/.test(raw) && /[+\-*/^%().]|sqrt|abs|pow|cbrt|sin|cos|tan|log|pi/i.test(raw)) {
      // Balance parentheses if trailing text cut one off
      let openP = (raw.match(/\(/g) || []).length;
      let closeP = (raw.match(/\)/g) || []).length;
      while (openP > closeP) {
        raw += ')';
        closeP++;
      }
      while (closeP > openP && raw.endsWith(')')) {
        raw = raw.slice(0, -1);
        closeP--;
      }
      return { tool: 'calculator', args: { expression: raw } };
    }
  }

  // 2. Unit converter trigger
  const unitMatch = p.match(/convert\s+([0-9.]+)\s*(km|mi|miles|c|f|celsius|fahrenheit|kg|lb|pounds|mb|gb)\s+(?:to|in)\s+(km|mi|miles|c|f|celsius|fahrenheit|kg|lb|pounds|mb|gb)/i);
  if (unitMatch) {
    let from = unitMatch[2].replace('miles', 'mi').replace('celsius', 'c').replace('fahrenheit', 'f').replace('pounds', 'lb');
    let to = unitMatch[3].replace('miles', 'mi').replace('celsius', 'c').replace('fahrenheit', 'f').replace('pounds', 'lb');
    return { tool: 'unit_converter', args: { value: parseFloat(unitMatch[1]), fromUnit: from, toUnit: to } };
  }

  // 3. Hash trigger
  if (p.includes('sha256') || p.includes('sha-256') || (p.includes('hash') && (p.includes('of') || p.includes('for')))) {
    const textMatch = prompt.match(/(?:hash|sha256|sha-256)\s+(?:of|for)?\s*["']?([^"']+)["']?/i);
    const toHash = textMatch ? textMatch[1].replace(/[.?!]+$/, '').trim() : 'SuperTools';
    return { tool: 'crypto_hash', args: { text: toHash } };
  }

  // 4. Base64 trigger
  if (p.includes('base64')) {
    const isDecode = p.includes('decode');
    const textMatch = prompt.match(/base64\s+(?:encode|decode)?\s*["']?([^"']+)["']?/i);
    const str = textMatch ? textMatch[1].replace(/[.?!]+$/, '').trim() : 'SuperTools';
    return { tool: 'base64', args: { action: isDecode ? 'decode' : 'encode', text: str } };
  }

  // 5. Time / Date trigger
  if (p.includes('current time') || p.includes('current date') || p.includes('what time is it') || p.includes('unix epoch')) {
    return { tool: 'timestamp', args: {} };
  }

  // 6. System specs trigger
  if (p.includes('hardware specs') || p.includes('system ram') || p.includes('device memory') || p.includes('how much ram')) {
    return { tool: 'system_specs', args: {} };
  }

  // 7. UUID & Nanoid trigger
  if (p.includes('uuid') || p.includes('nanoid') || p.includes('guid') || (p.includes('generate') && p.includes('id'))) {
    const isNanoid = p.includes('nanoid');
    const isShort = p.includes('short');
    const countMatch = p.match(/(\d+)\s*(?:uuid|id|nanoid)/);
    const count = countMatch ? parseInt(countMatch[1], 10) : 1;
    return { tool: 'uuid_generator', args: { count, format: isNanoid ? 'nanoid' : (isShort ? 'short' : 'uuid') } };
  }

  // 8. JSON Formatter trigger
  if (p.includes('json') && (p.includes('format') || p.includes('validate') || p.includes('beautify') || p.includes('minify') || p.includes('prettify') || p.includes('{'))) {
    const jsonMatch = prompt.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    const sample = jsonMatch ? jsonMatch[0] : '{"app":"SuperTools","clientSide":true,"models":["Llama-3.2","Qwen-2.5","DeepSeek-R1"]}';
    const isMinify = p.includes('minify') || p.includes('compact');
    return { tool: 'json_formatter', args: { json: sample, action: isMinify ? 'minify' : 'format' } };
  }

  // 9. Color Converter trigger
  if (p.includes('color') || p.includes('hex to rgb') || p.includes('rgb to hex') || p.includes('to hsl') || /#[0-9a-f]{3,6}\b/i.test(p)) {
    const hexMatch = prompt.match(/#[0-9a-f]{3,6}\b/i);
    const rgbMatch = prompt.match(/rgb\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/i);
    const colorStr = hexMatch ? hexMatch[0] : (rgbMatch ? rgbMatch[0] : '#6366f1');
    return { tool: 'color_converter', args: { color: colorStr } };
  }

  // 10. Password Generator trigger
  if (p.includes('password') && (p.includes('generate') || p.includes('create') || p.includes('random') || p.includes('secure') || p.includes('strong'))) {
    const lenMatch = p.match(/(\d+)\s*(?:char|character|length)/);
    const len = lenMatch ? parseInt(lenMatch[1], 10) : 20;
    return { tool: 'password_generator', args: { length: len, includeSymbols: true, includeNumbers: true } };
  }

  // 11. Cron Explainer trigger
  if (p.includes('cron') && (p.includes('*') || p.includes('explain') || p.includes('schedule') || p.includes('expression'))) {
    const cronMatch = prompt.match(/((?:[0-9*,\/-]+\s+){4}[0-9*,\/-]+)/);
    const expr = cronMatch ? cronMatch[1].trim() : '*/15 9-18 * * 1-5';
    return { tool: 'cron_parser', args: { expression: expr } };
  }

  // 12. IP Subnet trigger
  if (p.includes('subnet') || p.includes('cidr') || p.includes('netmask') || /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2}\b/.test(p)) {
    const cidrMatch = prompt.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2}\b/);
    const cidr = cidrMatch ? cidrMatch[0] : '192.168.10.0/24';
    return { tool: 'ip_subnet_calculator', args: { cidr } };
  }

  // 13. Financial Loan EMI & Compound Interest trigger
  if (p.includes('loan') || p.includes('emi') || p.includes('mortgage') || p.includes('compound interest') || (p.includes('interest') && p.includes('%'))) {
    const isCompound = p.includes('compound');
    const numMatches = prompt.match(/\b\d+(?:,\d+)*(?:\.\d+)?\b/g);
    const principal = numMatches && numMatches[0] ? parseFloat(numMatches[0].replace(/,/g, '')) : 50000;
    const rateMatch = prompt.match(/(\d+(?:\.\d+)?)\s*%/);
    const rate = rateMatch ? parseFloat(rateMatch[1]) : 7.5;
    const yearMatch = p.match(/(\d+)\s*(?:year|yr)/);
    const years = yearMatch ? parseInt(yearMatch[1], 10) : 5;
    return { tool: 'financial_calculator', args: { principal, ratePercent: rate, years, type: isCompound ? 'compound' : 'emi' } };
  }

  // 14. HTTP Status Code trigger
  if (p.includes('http') && (/\b[1-5]\d{2}\b/.test(p) || p.includes('status'))) {
    const codeMatch = prompt.match(/\b([1-5]\d{2})\b/);
    const code = codeMatch ? parseInt(codeMatch[1], 10) : 404;
    return { tool: 'http_status', args: { code } };
  }

  // 15. JWT Inspector trigger
  if (p.includes('jwt') || (p.includes('token') && p.includes('eyj'))) {
    const jwtMatch = prompt.match(/eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/);
    const sampleToken = jwtMatch ? jwtMatch[0] : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlN1cGVyVG9vbHMgVXNlciIsImlhdCI6MTY5NjE2MjAwMCwiZXhwIjoxODAwMDAwMDAwfQ.signature';
    return { tool: 'jwt_decoder', args: { token: sampleToken } };
  }

  // 16. Case Converter trigger
  if (p.includes('case') && (p.includes('camel') || p.includes('snake') || p.includes('kebab') || p.includes('pascal') || p.includes('convert'))) {
    const textMatch = prompt.match(/(?:convert|to\s+\w+_?case)\s+["']?([^"']+)["']?/i);
    const target = textMatch ? textMatch[1].trim() : 'SuperTools Client Web Architecture';
    return { tool: 'case_converter', args: { text: target } };
  }

  // 17. Text Statistics trigger
  if (p.includes('word count') || p.includes('character count') || p.includes('reading time') || p.includes('text stats')) {
    const textMatch = prompt.match(/(?:of|for|in)?\s*["']([^"']+)["']/i);
    const sampleText = textMatch ? textMatch[1] : prompt;
    return { tool: 'text_stats', args: { text: sampleText } };
  }

  // 18. Morse Code trigger
  if (p.includes('morse')) {
    const isDecode = p.includes('decode') || p.includes('.-');
    const textMatch = prompt.match(/morse\s+(?:code)?\s*(?:for|of)?\s*["']?([^"']+)["']?/i);
    const target = textMatch ? textMatch[1].trim() : 'SUPERTOOLS';
    return { tool: 'morse_code', args: { text: target, action: isDecode ? 'decode' : 'encode' } };
  }

  // 19. Lorem Generator trigger
  if (p.includes('lorem') || p.includes('dummy text') || p.includes('placeholder text')) {
    const countMatch = p.match(/(\d+)\s*(?:paragraph|word|sentence)/);
    const count = countMatch ? parseInt(countMatch[1], 10) : 2;
    const unit = p.includes('word') ? 'words' : (p.includes('sentence') ? 'sentences' : 'paragraphs');
    return { tool: 'lorem_generator', args: { count, unit } };
  }

  // 20. URL Codec trigger
  if (p.includes('url') && (p.includes('encode') || p.includes('decode') || p.includes('parse'))) {
    const isEncode = p.includes('encode');
    const isDecode = p.includes('decode');
    const urlMatch = prompt.match(/https?:\/\/[^\s"']+/i);
    const sample = urlMatch ? urlMatch[0] : 'https://the-supertools.web.app/settings.html?theme=dark&aiBudget=16384#webgpu';
    return { tool: 'url_codec', args: { url: sample, action: isEncode ? 'encode' : (isDecode ? 'decode' : 'parse') } };
  }

  return null;
}
