import React, { useState, useMemo } from 'react';
import yaml from 'js-yaml';
import Papa from 'papaparse';
import { QuickCopy } from '../components/QuickCopy';
import { Trash2, AlertCircle, CheckCircle2, Play, Code } from 'lucide-react';

interface CodeToolsProps {
  mode?: string;
}

export const CodeTools: React.FC<CodeToolsProps> = ({ mode = 'json-format' }) => {
  const defaultSample = useMemo(() => {
    if (mode.includes('yaml')) {
      return 'server:\n  host: 0.0.0.0\n  port: 8080\n  debug: true\nfeatures:\n  - auth\n  - metrics\n  - webhooks';
    }
    if (mode.includes('csv')) {
      return 'id,name,role,email\n1,Alice,Admin,alice@example.com\n2,Bob,Developer,bob@example.com\n3,Charlie,Designer,charlie@example.com';
    }
    if (mode.includes('sql')) {
      return 'select u.id, u.username, count(o.id) as total_orders, sum(o.amount) as revenue from users u left join orders o on u.id = o.user_id where u.active = 1 group by u.id, u.username having count(o.id) > 2 order by revenue desc limit 50;';
    }
    if (mode.includes('xml')) {
      return '<users><user id="1"><name>Alice</name><role>Admin</role></user><user id="2"><name>Bob</name><role>Editor</role></user></users>';
    }
    if (mode.includes('curl')) {
      return 'curl -X POST https://api.example.com/v1/users \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer my_token_123" \\\n  -d \'{"name": "Alice", "role": "admin"}\'';
    }
    if (mode.includes('url-parse')) {
      return 'https://user:pass@subdomain.example.com:8443/api/v1/search?category=tools&sort=desc&page=2#results';
    }
    if (mode.includes('svg')) {
      return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
    }
    if (mode.includes('user-agent')) {
      return typeof navigator !== 'undefined' ? navigator.userAgent : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
    }
    if (mode.includes('semver')) {
      return '1.4.2';
    }
    // Default JSON
    return '{\n  "appName": "SuperTools",\n  "version": "1.0.0",\n  "standalone": true,\n  "offlineSupport": true,\n  "modules": ["text", "crypto", "units", "dev"]\n}';
  }, [mode]);

  const [input, setInput] = useState(defaultSample);
  const [error, setError] = useState<string | null>(null);

  // SemVer extra state
  const [semverBump, setSemverBump] = useState<'major' | 'minor' | 'patch' | 'prerelease'>('patch');

  // Query builder extra state
  const [urlBase, setUrlBase] = useState('https://api.example.com/items');
  const [queryParams, setQueryParams] = useState<{ key: string; value: string }[]>([
    { key: 'category', value: 'electronics' },
    { key: 'limit', value: '25' },
    { key: 'available', value: 'true' }
  ]);

  const result = useMemo(() => {
    setError(null);
    if (!input.trim()) return '';

    try {
      switch (mode) {
        case 'json-format': {
          const parsed = JSON.parse(input);
          return JSON.stringify(parsed, null, 2);
        }
        case 'json-minify': {
          const parsed = JSON.parse(input);
          return JSON.stringify(parsed);
        }
        case 'json-validate': {
          JSON.parse(input);
          return 'Valid JSON syntax! No errors detected.';
        }
        case 'json-to-yaml': {
          const parsed = JSON.parse(input);
          return yaml.dump(parsed, { indent: 2 });
        }
        case 'yaml-to-json': {
          const parsed = yaml.load(input);
          return JSON.stringify(parsed, null, 2);
        }
        case 'json-to-csv': {
          const parsed = JSON.parse(input);
          const data = Array.isArray(parsed) ? parsed : [parsed];
          return Papa.unparse(data);
        }
        case 'csv-to-json': {
          const res = Papa.parse(input, { header: true, skipEmptyLines: true });
          return JSON.stringify(res.data, null, 2);
        }
        case 'json-to-ts': {
          const parsed = JSON.parse(input);
          const generateTypes = (obj: any, name: string = 'RootObject'): string => {
            if (Array.isArray(obj)) {
              const itemType = obj.length > 0 ? typeof obj[0] : 'any';
              return `export type ${name} = ${itemType}[];`;
            }
            if (typeof obj !== 'object' || obj === null) {
              return `export type ${name} = ${typeof obj};`;
            }
            const lines = [`export interface ${name} {`];
            for (const key of Object.keys(obj)) {
              const val = obj[key];
              const t = val === null ? 'any' : Array.isArray(val) ? (val.length ? `${typeof val[0]}[]` : 'any[]') : typeof val;
              lines.push(`  ${key}: ${t};`);
            }
            lines.push('}');
            return lines.join('\n');
          };
          return generateTypes(parsed);
        }
        case 'xml-format': {
          let formatted = '';
          let indent = 0;
          const reg = /(>)(<)(\/*)/g;
          const xml = input.replace(reg, '$1\r\n$2$3');
          xml.split('\r\n').forEach(node => {
            if (node.match(/^\/\w/)) indent--;
            let pad = '';
            for (let i = 0; i < indent; i++) pad += '  ';
            formatted += pad + node + '\r\n';
            if (node.match(/^<\w[^>]*[^\/]>.*$/)) indent++;
          });
          return formatted.trim();
        }
        case 'xml-minify':
          return input.replace(/>\s+</g, '><').trim();
        case 'html-format':
        case 'html-minify':
          return mode === 'html-minify' ? input.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim() : input;
        case 'css-format':
          return input.replace(/\{/g, ' {\n  ').replace(/\}/g, '\n}\n').replace(/;/g, ';\n  ').trim();
        case 'css-minify':
          return input.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').trim();
        case 'js-minify':
          return input.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '').replace(/\s+/g, ' ').trim();
        case 'sql-format': {
          const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'AND', 'OR'];
          let formatted = input;
          keywords.forEach(kw => {
            const re = new RegExp(`\\b${kw}\\b`, 'gi');
            formatted = formatted.replace(re, `\n${kw}`);
          });
          return formatted.trim();
        }
        case 'curl-fetch': {
          const urlMatch = input.match(/curl\s+(?:-X\s+[A-Z]+\s+)?['"]?([^'"\s\\]+)/);
          const url = urlMatch ? urlMatch[1] : 'https://api.example.com';
          const methodMatch = input.match(/-X\s+([A-Z]+)/);
          const method = methodMatch ? methodMatch[1] : 'GET';
          const headerMatches = Array.from(input.matchAll(/-H\s+['"]([^'"]+)['"]/g));
          const headers: Record<string, string> = {};
          headerMatches.forEach(m => {
            const parts = m[1].split(':');
            if (parts.length >= 2) headers[parts[0].trim()] = parts.slice(1).join(':').trim();
          });
          const bodyMatch = input.match(/(?:-d|--data(?:-raw)?)\s+['"]([\s\S]*?)['"]\s*(?:\\|$)/);
          const body = bodyMatch ? bodyMatch[1] : undefined;

          return `fetch('${url}', {\n  method: '${method}',\n  headers: ${JSON.stringify(headers, null, 2).replace(/\n/g, '\n  ')}${body ? `,\n  body: JSON.stringify(${body})` : ''}\n})\n.then(res => res.json())\n.then(data => console.log(data))\n.catch(err => console.error(err));`;
        }
        case 'user-agent': {
          const ua = input;
          let browser = 'Unknown';
          if (ua.includes('Chrome')) browser = 'Google Chrome / Chromium';
          else if (ua.includes('Safari')) browser = 'Apple Safari';
          else if (ua.includes('Firefox')) browser = 'Mozilla Firefox';
          else if (ua.includes('Edge')) browser = 'Microsoft Edge';

          let os = 'Unknown OS';
          if (ua.includes('Macintosh')) os = 'macOS';
          else if (ua.includes('Windows')) os = 'Microsoft Windows';
          else if (ua.includes('Android')) os = 'Android OS';
          else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'Apple iOS';
          else if (ua.includes('Linux')) os = 'Linux';

          return `Browser: ${browser}\nOperating System: ${os}\nRaw User-Agent:\n${ua}`;
        }
        case 'url-parse': {
          const parsedUrl = new URL(input);
          const params: Record<string, string> = {};
          parsedUrl.searchParams.forEach((v, k) => { params[k] = v; });
          return JSON.stringify({
            href: parsedUrl.href,
            origin: parsedUrl.origin,
            protocol: parsedUrl.protocol,
            username: parsedUrl.username,
            password: parsedUrl.password,
            host: parsedUrl.host,
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || '(default)',
            pathname: parsedUrl.pathname,
            search: parsedUrl.search,
            searchParams: params,
            hash: parsedUrl.hash
          }, null, 2);
        }
        case 'semver': {
          const match = input.trim().match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/);
          if (!match) return 'Invalid SemVer format. Expected major.minor.patch (e.g. 1.2.3)';
          let major = parseInt(match[1]);
          let minor = parseInt(match[2]);
          let patch = parseInt(match[3]);
          if (semverBump === 'major') { major++; minor = 0; patch = 0; }
          else if (semverBump === 'minor') { minor++; patch = 0; }
          else if (semverBump === 'patch') { patch++; }
          else if (semverBump === 'prerelease') { return `${major}.${minor}.${patch}-beta.1`; }
          return `${major}.${minor}.${patch}`;
        }
        case 'robots-txt':
          return `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://example.com/sitemap.xml`;
        case 'sitemap-xml':
          return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://example.com/</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>`;
        case 'htaccess':
          return `# Enforce HTTPS\nRewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n\n# Single Page App routing fallback\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule ^(.*)$ /index.html [L]`;
        case 'nginx':
          return `server {\n    listen 80;\n    listen [::]:80;\n    server_name example.com www.example.com;\n    return 301 https://$host$request_uri;\n}\n\nserver {\n    listen 443 ssl http2;\n    server_name example.com;\n    root /var/www/dist;\n    index index.html;\n    location / {\n        try_files $uri $uri/ /index.html;\n    }\n}`;
        case 'svg-data-uri': {
          const encoded = encodeURIComponent(input.trim())
            .replace(/'/g, '%27')
            .replace(/"/g, '%22');
          return `background-image: url("data:image/svg+xml,${encoded}");`;
        }
        case 'base64-data-uri':
          return `data:text/plain;base64,${btoa(input)}`;
        case 'csp-builder':
          return `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-ancestors 'none';`;
        case 'gitignore':
          return `# Node.js\nnode_modules/\ndist/\n.env\n.env.local\n*.log\nnpm-debug.log*\n\n# macOS\n.DS_Store\n\n# IDE\n.vscode/\n.idea/`;
        default:
          return input;
      }
    } catch (err: any) {
      setError(err?.message || 'Syntax parse error');
      return '';
    }
  }, [input, mode, semverBump]);

  // Query Builder Output
  const queryBuilderOutput = useMemo(() => {
    if (mode !== 'query-builder') return '';
    try {
      const u = new URL(urlBase);
      queryParams.forEach(p => {
        if (p.key.trim()) u.searchParams.set(p.key.trim(), p.value.trim());
      });
      return u.toString();
    } catch {
      return `${urlBase}?${queryParams.map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join('&')}`;
    }
  }, [mode, urlBase, queryParams]);

  if (mode === 'query-builder') {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Base URL:</label>
            <input
              type="text"
              value={urlBase}
              onChange={(e) => setUrlBase(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Query Parameters:</label>
              <button
                type="button"
                onClick={() => setQueryParams([...queryParams, { key: '', value: '' }])}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
              >
                + Add Parameter
              </button>
            </div>
            <div className="space-y-2">
              {queryParams.map((param, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Key"
                    value={param.key}
                    onChange={(e) => {
                      const updated = [...queryParams];
                      updated[idx].key = e.target.value;
                      setQueryParams(updated);
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-mono"
                  />
                  <span className="text-slate-400">=</span>
                  <input
                    type="text"
                    placeholder="Value"
                    value={param.value}
                    onChange={(e) => {
                      const updated = [...queryParams];
                      updated[idx].value = e.target.value;
                      setQueryParams(updated);
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-mono"
                  />
                  <button
                    onClick={() => setQueryParams(queryParams.filter((_, i) => i !== idx))}
                    className="p-1.5 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Generated URL</span>
            <QuickCopy text={queryBuilderOutput} />
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-sm text-slate-900 dark:text-slate-100 break-all select-all">
            {queryBuilderOutput}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Optional Mode Controls */}
      {mode === 'semver' && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bump Version:</span>
          <div className="inline-flex rounded-lg p-1 bg-slate-100 dark:bg-slate-800">
            {(['patch', 'minor', 'major', 'prerelease'] as const).map(b => (
              <button
                key={b}
                onClick={() => setSemverBump(b)}
                className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all ${
                  semverBump === b
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dual Panel Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Editor */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Source Input
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
            rows={14}
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y shadow-xs"
          />
        </div>

        {/* Output Viewer */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Converted Result
              </span>
              {error ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-rose-500 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Syntax Error
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Valid
                </span>
              )}
            </div>
            <QuickCopy text={result} />
          </div>

          {error ? (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 font-mono text-xs overflow-auto">
              <span className="font-bold block mb-1">Error:</span>
              {error}
            </div>
          ) : (
            <textarea
              readOnly
              value={result}
              rows={14}
              placeholder="Output will appear here..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none resize-y shadow-xs"
            />
          )}
        </div>
      </div>
    </div>
  );
};
