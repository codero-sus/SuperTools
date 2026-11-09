import React, { useMemo } from 'react';
import { Wrench, Check, Copy, Code, Sparkles, Terminal } from 'lucide-react';
import { QuickCopy } from './QuickCopy';

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  isStreaming = false,
  className = ''
}) => {
  // Parse inline text tokens (bold, italic, inline code)
  const renderInline = (text: string): React.ReactNode => {
    // Regex splits by: `code`, **bold**, *italic*
    const tokens: React.ReactNode[] = [];
    const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
    const parts = text.split(regex);

    parts.forEach((part, idx) => {
      if (!part) return;

      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        tokens.push(
          <code
            key={idx}
            className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-800/90 text-indigo-300 border border-slate-700/80 font-mono text-[11px] font-semibold"
          >
            {part.slice(1, -1)}
          </code>
        );
      } else if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        tokens.push(
          <strong key={idx} className="font-bold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      } else if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
        tokens.push(
          <em key={idx} className="italic text-slate-300">
            {part.slice(1, -1)}
          </em>
        );
      } else {
        tokens.push(<span key={idx}>{part}</span>);
      }
    });

    return tokens.length > 0 ? tokens : text;
  };

  // Parse blocks: Tool notices, Code blocks, Headings, Ordered lists, Bullet lists, Paragraphs
  const renderedBlocks = useMemo(() => {
    if (!content.trim()) return null;

    const lines = content.split('\n');
    const blocks: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeBuffer: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // 1. Code Block Fence (```lang)
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.trim().slice(3).trim() || 'code';
          codeBuffer = [];
          continue;
        } else {
          inCodeBlock = false;
          const codeText = codeBuffer.join('\n');
          blocks.push(
            <div key={`code-${i}`} className="my-2.5 rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden text-xs font-mono shadow-sm">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/60 border-b border-slate-800 text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-300">
                  <Code className="w-3 h-3 text-indigo-400" />
                  <span>{codeLanguage}</span>
                </div>
                <QuickCopy text={codeText} label="Copy Code" />
              </div>
              <pre className="p-3 overflow-x-auto text-slate-200 leading-relaxed font-mono select-text">
                <code>{codeText}</code>
              </pre>
            </div>
          );
          codeBuffer = [];
          continue;
        }
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      const trimmed = line.trim();
      if (!trimmed) {
        continue;
      }

      // 2. Tool Invocation Notice e.g. [Tool Invoked: Math Calculator → 4063] or > [Tool Invoked: ...]
      const toolMatch = trimmed.match(/^>?\s*\[Tool Invoked:\s*([^→]+)→\s*([^\]]+)\]/i);
      if (toolMatch) {
        const toolName = toolMatch[1].trim();
        const toolRes = toolMatch[2].trim();
        blocks.push(
          <div
            key={`tool-${i}`}
            className="my-2 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 flex items-center justify-between gap-3 text-xs font-mono shadow-xs"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">Tool Invoked</span>
                <span className="font-semibold text-white">{toolName}</span>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-black/40 border border-emerald-500/20 text-emerald-300 font-bold shrink-0 text-right">
              {toolRes}
            </div>
          </div>
        );
        continue;
      }

      // 3. Headings (# H1, ## H2, ### H3)
      if (trimmed.startsWith('### ')) {
        blocks.push(
          <h4 key={`h3-${i}`} className="text-xs font-bold uppercase tracking-wider text-indigo-300 mt-3 mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
            <span>{trimmed.slice(4)}</span>
          </h4>
        );
        continue;
      }
      if (trimmed.startsWith('## ')) {
        blocks.push(
          <h3 key={`h2-${i}`} className="text-sm font-bold text-white mt-3.5 mb-1.5 flex items-center gap-2">
            <span>{trimmed.slice(3)}</span>
          </h3>
        );
        continue;
      }
      if (trimmed.startsWith('# ')) {
        blocks.push(
          <h2 key={`h1-${i}`} className="text-base font-black text-indigo-400 border-b border-indigo-500/20 pb-1 mt-4 mb-2">
            {trimmed.slice(2)}
          </h2>
        );
        continue;
      }

      // 4. Final Result Highlight Callout
      if (trimmed.includes('**Final Result:**') || trimmed.includes('**Result:**')) {
        blocks.push(
          <div
            key={`res-${i}`}
            className="my-3 p-3 rounded-xl bg-gradient-to-r from-emerald-950/60 to-indigo-950/40 border border-emerald-500/40 text-white shadow-sm flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-xs leading-relaxed">
                {renderInline(trimmed)}
              </div>
            </div>
          </div>
        );
        continue;
      }

      // 5. Ordered Step List (1. **Step**: ...)
      const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (orderedMatch) {
        const stepNum = orderedMatch[1];
        const stepText = orderedMatch[2];
        blocks.push(
          <div key={`step-${i}`} className="flex items-start gap-2.5 my-1.5 text-xs text-slate-200">
            <span className="w-5 h-5 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              {stepNum}
            </span>
            <div className="flex-1 leading-relaxed">
              {renderInline(stepText)}
            </div>
          </div>
        );
        continue;
      }

      // 6. Bullet List (• or - or *)
      if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const bulletText = trimmed.slice(2);
        blocks.push(
          <div key={`bullet-${i}`} className="flex items-start gap-2.5 my-1 text-xs text-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
            <div className="flex-1 leading-relaxed">
              {renderInline(bulletText)}
            </div>
          </div>
        );
        continue;
      }

      // 7. Standard Paragraph
      blocks.push(
        <p key={`p-${i}`} className="my-1.5 text-xs leading-relaxed text-slate-200 font-sans">
          {renderInline(trimmed)}
        </p>
      );
    }

    // Unclosed code block during active streaming
    if (inCodeBlock && codeBuffer.length > 0) {
      const codeText = codeBuffer.join('\n');
      blocks.push(
        <div key="code-unclosed" className="my-2.5 rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden text-xs font-mono">
          <pre className="p-3 overflow-x-auto text-slate-200 leading-relaxed font-mono select-text">
            <code>{codeText}</code>
          </pre>
        </div>
      );
    }

    return blocks;
  }, [content]);

  return (
    <div className={`space-y-1 font-sans ${className}`}>
      {renderedBlocks}
      {isStreaming && (
        <span className="inline-block w-2 h-4 ml-1 bg-indigo-400 animate-pulse align-middle" />
      )}
    </div>
  );
};
