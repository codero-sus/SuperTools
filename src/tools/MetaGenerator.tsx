import React, { useState, useMemo } from 'react';
import { QuickCopy } from '../components/QuickCopy';
import { Globe, Share2 } from 'lucide-react';

export const MetaGenerator: React.FC = () => {
  const [title, setTitle] = useState('SuperTools — 370+ Pure Web Utilities');
  const [description, setDescription] = useState('Comprehensive suite of developer, math, design, and productivity utilities running 100% in your browser.');
  const [url, setUrl] = useState('https://supertools.app');
  const [imageUrl, setImageUrl] = useState('https://supertools.app/og-cover.png');
  const [author, setAuthor] = useState('SuperTools Community');

  const metaTagsCode = useMemo(() => {
    return `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />
<meta name="author" content="${author}" />

<!-- Open Graph / Facebook / LinkedIn -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${imageUrl}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />
<meta property="twitter:image" content="${imageUrl}" />`;
  }, [title, description, url, imageUrl, author]);

  return (
    <div className="space-y-8">
      {/* Input Fields */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Page Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Canonical URL:</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Social Preview Image URL:</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono"
            />
          </div>
        </div>
      </div>

      {/* Live Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Search Preview */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-4">
            Google Search Preview
          </span>
          <div className="space-y-1">
            <span className="text-xs text-slate-500 block font-mono truncate">{url}</span>
            <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1">
              {title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Social Card Preview */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-4">
            Facebook / Twitter / LinkedIn Card
          </span>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800">
            <div className="h-32 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 text-xs">
              Preview Image: {imageUrl.split('/').pop()}
            </div>
            <div className="p-3">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">
                {url.replace(/https?:\/\//, '')}
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                {title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Code */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            HTML Meta Tags Code
          </span>
          <QuickCopy text={metaTagsCode} label="Copy HTML Meta Tags" />
        </div>
        <pre className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 overflow-x-auto leading-relaxed">
          {metaTagsCode}
        </pre>
      </div>
    </div>
  );
};
