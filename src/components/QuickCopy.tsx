import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface QuickCopyProps {
  text: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const QuickCopy: React.FC<QuickCopyProps> = ({ text, label = 'Copy', className = '', size = 'md' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isSmall = size === 'sm';

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 font-medium transition-all rounded-lg active:scale-95 ${
        isSmall ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'
      } ${
        copied
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
      } ${className}`}
      title={copied ? 'Copied to clipboard!' : 'Copy to clipboard'}
    >
      {copied ? <Check className={isSmall ? "w-3 h-3" : "w-4 h-4"} /> : <Copy className={isSmall ? "w-3 h-3" : "w-4 h-4"} />}
      <span>{copied ? 'Copied!' : label}</span>
    </button>
  );
};
