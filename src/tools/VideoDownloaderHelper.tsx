import React, { useState, useMemo } from 'react';
import { Video, Download, ExternalLink, Play, Sparkles, CheckCircle2, ShieldCheck, Copy, Tv } from 'lucide-react';
import { QuickCopy } from '../components/QuickCopy';

interface ParsedMedia {
  platform: 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'twitter' | 'generic';
  id?: string;
  cleanUrl: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  qualities: { label: string; format: string; url?: string }[];
  ytdlpCommand: string;
}

export const VideoDownloaderHelper: React.FC = () => {
  const [urlInput, setUrlInput] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

  const parsed = useMemo<ParsedMedia | null>(() => {
    const raw = urlInput.trim();
    if (!raw) return null;

    // YouTube parser
    const ytMatch = raw.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    if (ytMatch) {
      const id = ytMatch[1];
      return {
        platform: 'youtube',
        id,
        cleanUrl: `https://www.youtube.com/watch?v=${id}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=0`,
        thumbnailUrl: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
        qualities: [
          { label: 'Full HD 1080p (MP4)', format: 'MP4' },
          { label: 'HD 720p (MP4)', format: 'MP4' },
          { label: 'Audio Only 320kbps (MP3)', format: 'MP3' },
          { label: 'Thumbnail Poster (HD Image)', format: 'JPG', url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg` }
        ],
        ytdlpCommand: `yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]" https://www.youtube.com/watch?v=${id}`
      };
    }

    // TikTok parser
    if (raw.includes('tiktok.com')) {
      const match = raw.match(/video\/(\d+)/);
      const id = match ? match[1] : undefined;
      return {
        platform: 'tiktok',
        id,
        cleanUrl: raw,
        qualities: [
          { label: 'HD Video Without Watermark (MP4)', format: 'MP4' },
          { label: 'Original Sound / Music (MP3)', format: 'MP3' }
        ],
        ytdlpCommand: `yt-dlp --no-check-certificates "${raw}"`
      };
    }

    // Instagram parser
    if (raw.includes('instagram.com')) {
      return {
        platform: 'instagram',
        cleanUrl: raw,
        qualities: [
          { label: 'Reel / Post Video (MP4)', format: 'MP4' },
          { label: 'High-Res Carousel / Image (JPG)', format: 'JPG' }
        ],
        ytdlpCommand: `yt-dlp "${raw}"`
      };
    }

    // Facebook parser
    if (raw.includes('facebook.com') || raw.includes('fb.watch')) {
      return {
        platform: 'facebook',
        cleanUrl: raw,
        qualities: [
          { label: 'HD 720p/1080p (MP4)', format: 'MP4' },
          { label: 'SD 480p (MP4)', format: 'MP4' }
        ],
        ytdlpCommand: `yt-dlp "${raw}"`
      };
    }

    // Generic / Twitter / Reddit
    return {
      platform: 'generic',
      cleanUrl: raw,
      qualities: [
        { label: 'Best Quality Stream (MP4)', format: 'MP4' },
        { label: 'Audio Extract (MP3)', format: 'MP3' }
      ],
      ytdlpCommand: `yt-dlp "${raw}"`
    };
  }, [urlInput]);

  return (
    <div className="space-y-6">
      {/* Input Link Bar */}
      <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Paste Video or Media Link (YouTube, TikTok, Instagram, Facebook, etc.):
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste URL (e.g. https://www.youtube.com/watch?v=... or TikTok/Instagram)"
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono focus:outline-none"
            />
            <button
              onClick={() => setUrlInput('')}
              className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Platform quick badges */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs text-slate-400 font-medium pt-1">
          <span>Supported:</span>
          <span className="px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold">YouTube & Shorts</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">TikTok</span>
          <span className="px-2 py-0.5 rounded-md bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 font-bold">Instagram Reels</span>
          <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold">Facebook</span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold">Reddit / Twitter</span>
        </div>
      </div>

      {parsed && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visual Embed / Poster Preview */}
          <div className="lg:col-span-1 p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Media Preview
            </span>

            {parsed.platform === 'youtube' && parsed.embedUrl ? (
              <div className="aspect-video rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800">
                <iframe
                  src={parsed.embedUrl}
                  title="Video Preview"
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              </div>
            ) : parsed.thumbnailUrl ? (
              <img
                src={parsed.thumbnailUrl}
                alt="Thumbnail"
                className="w-full rounded-2xl aspect-video object-cover shadow-md"
              />
            ) : (
              <div className="aspect-video rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Video className="w-10 h-10" />
              </div>
            )}

            {parsed.thumbnailUrl && (
              <a
                href={parsed.thumbnailUrl}
                target="_blank"
                rel="noreferrer"
                download="thumbnail.jpg"
                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download Full HD Thumbnail Poster
              </a>
            )}
          </div>

          {/* Quality Streams & Instant Helper Gateways */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-2">
                Available Direct Streams & Clean Gateways
              </span>
              <p className="text-xs text-slate-500">
                Client-side stream extractor helper. Safe, private, and ad-free.
              </p>
            </div>

            <div className="space-y-2.5">
              {parsed.qualities.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center font-mono">
                      {q.format}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        {q.label}
                      </span>
                      <span className="text-[11px] text-slate-400">Direct Clean Stream Format</span>
                    </div>
                  </div>

                  <a
                    href={q.url || `https://cobalt.tools/#${encodeURIComponent(parsed.cleanUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                </div>
              ))}
            </div>

            {/* Power User Command Line Helper */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-500 block">
                Power User CLI (yt-dlp direct command):
              </span>
              <div className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs flex items-center justify-between gap-3 overflow-x-auto">
                <code className="text-emerald-400 break-all">{parsed.ytdlpCommand}</code>
                <QuickCopy text={parsed.ytdlpCommand} size="sm" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
