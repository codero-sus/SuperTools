import React from 'react';
import { ToolItem, Category } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { ArrowRight, Sparkles, Folder, CheckCircle2 } from 'lucide-react';

interface SubcategoryGroup {
  name: string;
  toolIds: string[];
}

interface CategoryCardData {
  code: string; // C1, C2, C3...
  id: Category;
  name: string;
  icon: string;
  description: string;
  gradient: string;
  subcategories: SubcategoryGroup[];
}

interface CategoryHubProps {
  tools: ToolItem[];
  onSelectTool: (tool: ToolItem) => void;
  onSelectCategory: (category: Category) => void;
}

export const CATEGORY_HUBS: CategoryCardData[] = [
  {
    code: 'C1',
    id: 'Media & Studio',
    name: 'Automatic Photo & Media Studio',
    icon: 'Wand2',
    description: '1-click smart auto-enhancement, stream grabber, screen recorder, QR studio & barcode generator.',
    gradient: 'from-indigo-600/20 via-violet-600/10 to-transparent',
    subcategories: [
      {
        name: 'Auto Photo & Video',
        toolIds: ['auto-photo-processor', 'video-downloader-helper', 'screen-recorder']
      },
      {
        name: 'QR & Barcode Utilities',
        toolIds: ['qr-generator', 'qr-scanner', 'barcode-generator']
      },
      {
        name: 'Dimensions & Display',
        toolIds: ['image-resizer', 'aspect-ratio-calc', 'screen-detector']
      }
    ]
  },
  {
    code: 'C2',
    id: 'Files & Documents',
    name: 'Universal Files & Documents',
    icon: 'FileArchive',
    description: 'Multi-format converter (XLSX, CSV, PDF, WebP, ICO), high-precision OCR, and images to PDF.',
    gradient: 'from-emerald-600/20 via-teal-600/10 to-transparent',
    subcategories: [
      {
        name: 'File & Format Conversion',
        toolIds: ['universal-file-converter', 'file-transformer']
      },
      {
        name: 'Optical Character Recognition',
        toolIds: ['ocr-tool']
      }
    ]
  },
  {
    code: 'C3',
    id: 'Text & Crypto Forge',
    name: 'Text & Crypto Security Forge',
    icon: 'Sparkles',
    description: '1337 Leet Speak, Base64, Hex, AES encryption, steganography, passwords, and RSA key pairs.',
    gradient: 'from-amber-600/20 via-orange-600/10 to-transparent',
    subcategories: [
      {
        name: 'Unified Text Transformation',
        toolIds: ['unified-text-forge', 'text-diff', 'lorem-ipsum']
      },
      {
        name: 'Privacy & Security Vault',
        toolIds: ['privacy-vault', 'password-generator', 'password-strength']
      },
      {
        name: 'Hashes & Authenticator',
        toolIds: ['crypto-hashes', 'rsa-key-generator', 'totp-generator', 'file-checksum']
      }
    ]
  },
  {
    code: 'C4',
    id: 'Code & Web Lab',
    name: 'Developer & Web Lab',
    icon: 'Code2',
    description: 'JSON formatter, JWT inspector, Linux permissions chmod, cron studio, live regex tester, and UUIDs.',
    gradient: 'from-cyan-600/20 via-blue-600/10 to-transparent',
    subcategories: [
      {
        name: 'Data & Tokens',
        toolIds: ['json-formatter', 'jwt-decoder', 'uuid-v4']
      },
      {
        name: 'System & Scheduling',
        toolIds: ['cron-helper', 'chmod-calculator', 'curl-to-fetch']
      },
      {
        name: 'Testing & Social SEO',
        toolIds: ['regex-tester', 'keycode-inspector', 'meta-tag-generator', 'sql-formatter']
      }
    ]
  },
  {
    code: 'C5',
    id: 'Math & Engineering',
    name: 'Math, Physics & Converters',
    icon: 'Calculator',
    description: 'Scientific calculator, 16-dimension unit converter, number base radix, and electrical formulas.',
    gradient: 'from-rose-600/20 via-pink-600/10 to-transparent',
    subcategories: [
      {
        name: 'Calculators & Radix',
        toolIds: ['scientific-calc', 'number-base', 'roman-converter']
      },
      {
        name: 'Units & Dimensions',
        toolIds: ['unit-converter', 'length-converter', 'temperature-converter', 'data-converter']
      },
      {
        name: 'Physics & Formulas',
        toolIds: ['ohms-law', 'quadratic-calc', 'percentage-calc', 'statistics-calc', 'dice-roller']
      }
    ]
  },
  {
    code: 'C6',
    id: 'Finance & Money',
    name: 'Finance & Money Studio',
    icon: 'TrendingUp',
    description: 'Mortgage loan EMI schedule, compound interest wealth projector, 50/30/20 budget, and profit margins.',
    gradient: 'from-emerald-600/20 via-indigo-600/10 to-transparent',
    subcategories: [
      {
        name: 'Loans & Investing',
        toolIds: ['loan-calc', 'compound-interest', 'budget-50-30-20']
      },
      {
        name: 'Everyday Calculations',
        toolIds: ['tip-calc', 'discount-calc', 'sales-tax', 'margin-markup', 'inflation-calc', 'salary-hourly']
      }
    ]
  },
  {
    code: 'C7',
    id: 'Date, Time & World',
    name: 'Date, Time & World Hub',
    icon: 'Clock',
    description: 'Live ticking world clocks, millisecond stopwatch, Pomodoro focus, business days, and timesheets.',
    gradient: 'from-purple-600/20 via-indigo-600/10 to-transparent',
    subcategories: [
      {
        name: 'Clocks & Productivity',
        toolIds: ['world-clock', 'stopwatch', 'pomodoro']
      },
      {
        name: 'Calendar & Time Math',
        toolIds: ['unix-timestamp', 'date-diff', 'business-days', 'time-card', 'age-calculator']
      }
    ]
  },
  {
    code: 'C8',
    id: 'Color & Palette',
    name: 'Color & Accessibility Studio',
    icon: 'Palette',
    description: 'HEX/RGB/HSL/CMYK color converter, WCAG contrast checker, CSS gradients, and tints/shades generator.',
    gradient: 'from-fuchsia-600/20 via-purple-600/10 to-transparent',
    subcategories: [
      {
        name: 'Color Palettes & Formats',
        toolIds: ['color-converter', 'contrast-checker']
      },
      {
        name: 'Gradients & Scales',
        toolIds: ['gradient-generator', 'shades-tints']
      }
    ]
  },
  {
    name: 'Quick Reference Cheatsheets',
    code: 'C9',
    id: 'Cheatsheets & Guides',
    icon: 'FileText',
    description: 'Interactive cheatsheets for Git, HTTP codes, RegEx, Linux terminal, SQL queries, Docker, and ports.',
    gradient: 'from-slate-600/20 via-indigo-600/10 to-transparent',
    subcategories: [
      {
        name: 'Developer CLI Guides',
        toolIds: ['cheatsheet-git', 'cheatsheet-linux', 'cheatsheet-docker']
      },
      {
        name: 'Code & Syntax',
        toolIds: ['cheatsheet-regex', 'cheatsheet-sql', 'cheatsheet-markdown']
      },
      {
        name: 'Protocols & Tables',
        toolIds: ['cheatsheet-http', 'cheatsheet-ports', 'cheatsheet-ascii']
      }
    ]
  }
];

export const CategoryHub: React.FC<CategoryHubProps> = ({
  tools,
  onSelectTool,
  onSelectCategory
}) => {
  return (
    <div className="space-y-6">
      {/* Category Grid (C1, C2, C3, C4, C5, C6...) directly matching user's layout sketch */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORY_HUBS.map(cat => {
          const categoryTools = tools.filter(t => t.category === cat.id);

          return (
            <div
              key={cat.code}
              className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/60 dark:hover:border-indigo-400/60 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-mono font-black text-sm flex items-center justify-center shadow-md shadow-indigo-600/20">
                      {cat.code}
                    </span>
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white text-base tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {cat.name}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {categoryTools.length} Utilities Available
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {cat.description}
                </p>

                {/* Subcategories & Tools List */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  {cat.subcategories.map((sub, sIdx) => {
                    const subTools = sub.toolIds
                      .map(id => tools.find(t => t.id === id))
                      .filter((t): t is ToolItem => Boolean(t));

                    return (
                      <div key={sIdx} className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          {sub.name}
                        </span>

                        <div className="grid grid-cols-1 gap-1">
                          {subTools.map(tool => (
                            <button
                              key={tool.id}
                              onClick={() => onSelectTool(tool)}
                              className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all flex items-center justify-between group/tool"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="text-slate-400 group-hover/tool:text-indigo-600 dark:group-hover/tool:text-indigo-400 transition-colors shrink-0">
                                  <DynamicIcon name={tool.icon} className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate group-hover/tool:text-indigo-600 dark:group-hover/tool:text-indigo-400">
                                  {tool.name}
                                </span>
                              </div>

                              {tool.badge && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
                                  {tool.badge}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Quick Browse Action */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  onClick={() => onSelectCategory(cat.id)}
                  className="w-full py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Explore All {cat.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
