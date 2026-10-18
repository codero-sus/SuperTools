import React, { useState, useEffect, useMemo } from 'react';
import { TOOLS_DATA as TOOLS } from './data/toolsData';
import type { ToolItem, Category } from './types';

// Components
import { Navbar } from './components/Navbar';
import { SearchModal } from './components/SearchModal';
import { ToolCard } from './components/ToolCard';
import { ToolHeader } from './components/ToolHeader';
import { CheatsheetView } from './components/CheatsheetView';

// Tool suites
import { TextTools } from './tools/TextTools';
import { TextDiffTool } from './tools/TextDiffTool';
import { LoremGenerator } from './tools/LoremGenerator';
import { CodeTools } from './tools/CodeTools';
import { JwtDecoder } from './tools/JwtDecoder';
import { CronTool } from './tools/CronTool';
import { ChmodTool } from './tools/ChmodTool';
import { RegExTester } from './tools/RegExTester';
import { UuidTool } from './tools/UuidTool';
import { QrGenerator } from './tools/QrGenerator';
import { BarcodeGenerator } from './tools/BarcodeGenerator';
import { QrScanner } from './tools/QrScanner';
import { KeycodeInspector } from './tools/KeycodeInspector';
import { MetaGenerator } from './tools/MetaGenerator';
import { CryptoTools } from './tools/CryptoTools';
import { PasswordTool } from './tools/PasswordTool';
import { PasswordStrengthTool } from './tools/PasswordStrengthTool';
import { RsaTool } from './tools/RsaTool';
import { TotpTool } from './tools/TotpTool';
import { FileChecksumTool } from './tools/FileChecksumTool';
import { UnitConverterTool } from './tools/UnitConverterTool';
import { QuickUnitTool } from './tools/QuickUnitTool';
import { NumberBaseTool } from './tools/NumberBaseTool';
import { RomanConverter } from './tools/RomanConverter';
import { ScientificCalc } from './tools/ScientificCalc';
import { DiceTool } from './tools/DiceTool';
import { MathTools } from './tools/MathTools';
import { LoanCalculator } from './tools/LoanCalculator';
import { CompoundInterestTool } from './tools/CompoundInterestTool';
import { TipCalculator } from './tools/TipCalculator';
import { FinanceTools } from './tools/FinanceTools';
import { DateTimeTools } from './tools/DateTimeTools';
import { WorldClockTool } from './tools/WorldClockTool';
import { TimerTools } from './tools/TimerTools';
import { ColorTools } from './tools/ColorTools';
import { MediaTools } from './tools/MediaTools';

import { Sparkles, ArrowLeft, Heart, ShieldCheck, Layers } from 'lucide-react';

const CATEGORY_LIST = [
  { id: 'all', name: 'All Tools' },
  { id: 'Text & Content', name: 'Text & Content' },
  { id: 'Code & Web Dev', name: 'Code & Web Dev' },
  { id: 'Crypto & Security', name: 'Crypto & Security' },
  { id: 'Unit Converters', name: 'Unit Converters' },
  { id: 'Math & Science', name: 'Math & Science' },
  { id: 'Finance & Money', name: 'Finance & Money' },
  { id: 'Date & Time', name: 'Date & Time' },
  { id: 'Color & Design', name: 'Color & Design' },
  { id: 'Image & Media', name: 'Image & Media' },
  { id: 'Productivity', name: 'Productivity' },
  { id: 'Cheatsheets', name: 'Cheatsheets' }
];

export const App: React.FC = () => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('supertools_theme') === 'dark' ||
      (!('supertools_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Navigation state (active tool ID, or null for catalog view)
  const [activeToolId, setActiveToolId] = useState<string | null>(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    return hash || null;
  });

  // Search & Filter state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('supertools_favorites');
      return saved ? JSON.parse(saved) : ['json-formatter', 'uuid-v4', 'qr-generator', 'password-generator', 'unit-converter'];
    } catch {
      return [];
    }
  });

  // Recent tools state
  const [recentTools, setRecentTools] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('supertools_recents');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('supertools_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('supertools_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync Hash URL navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      setActiveToolId(hash || null);
      if (hash) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('supertools_favorites', JSON.stringify(next));
      return next;
    });
  };

  const navigateToTool = (tool: ToolItem) => {
    window.location.hash = `/${tool.id}`;
    setActiveToolId(tool.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track recents
    setRecentTools(prev => {
      const updated = [tool.id, ...prev.filter(x => x !== tool.id)].slice(0, 8);
      localStorage.setItem('supertools_recents', JSON.stringify(updated));
      return updated;
    });
  };

  const navigateHome = () => {
    window.location.hash = '';
    setActiveToolId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRandomTool = () => {
    const random = TOOLS[Math.floor(Math.random() * TOOLS.length)];
    navigateToTool(random);
  };

  const activeTool = useMemo(() => {
    return TOOLS.find(t => t.id === activeToolId);
  }, [activeToolId]);

  // Catalog filtering
  const filteredTools = useMemo(() => {
    return TOOLS.filter((t: ToolItem) => {
      if (showFavoritesOnly && !favorites.includes(t.id)) return false;
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesDesc = t.description.toLowerCase().includes(q);
        const matchesTag = t.tags.some((tag: string) => tag.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTag) return false;
      }
      return true;
    });
  }, [selectedCategory, showFavoritesOnly, searchQuery, favorites]);

  // Related tools for the active tool
  const relatedTools = useMemo(() => {
    if (!activeTool) return [];
    return TOOLS.filter((t: ToolItem) => t.category === activeTool.category && t.id !== activeTool.id).slice(0, 4);
  }, [activeTool]);

  // Dynamic component renderer for any tool
  const renderActiveToolComponent = () => {
    if (!activeTool) return null;

    const id = activeTool.id;
    const mode = activeTool.mode;

    // Cheatsheets
    if (activeTool.category === 'Cheatsheets' || id.startsWith('cheatsheet-')) {
      const sheetSlug = id.replace('cheatsheet-', '');
      return (
        <CheatsheetView
          sheetId={sheetSlug}
          onSelectSheet={(s) => {
            const found = TOOLS.find(t => t.id === `cheatsheet-${s}`);
            if (found) navigateToTool(found);
          }}
        />
      );
    }

    // Text & Content Suite
    if (id === 'text-diff') return <TextDiffTool />;
    if (id === 'lorem-ipsum') return <LoremGenerator />;
    if (activeTool.category === 'Text & Content' || mode?.startsWith('cipher-') || mode?.startsWith('extract-')) {
      return <TextTools mode={mode || id} />;
    }

    // Code & Dev Suite
    if (id === 'jwt-decoder') return <JwtDecoder />;
    if (id === 'cron-helper' || id === 'cron-generator') return <CronTool />;
    if (id === 'chmod-calculator') return <ChmodTool />;
    if (id === 'regex-tester') return <RegExTester />;
    if (activeTool.category === 'Code & Web Dev' || id.startsWith('json-') || id.startsWith('yaml-') || id.startsWith('csv-') || id === 'url-encoder' || id === 'html-entity-encoder' || id === 'curl-to-fetch' || id.endsWith('-beautifier') || id.endsWith('-formatter') || id.endsWith('-validator') || id.endsWith('-generator')) {
      return <CodeTools mode={mode || id} />;
    }

    // Web & Network Suite
    if (id.startsWith('uuid-') || id === 'nanoid-generator') return <UuidTool mode={mode || id} />;
    if (id === 'qr-generator') return <QrGenerator />;
    if (id === 'barcode-generator') return <BarcodeGenerator />;
    if (id === 'qr-scanner') return <QrScanner />;
    if (id === 'keycode-inspector') return <KeycodeInspector />;
    if (id.includes('og-') || id.includes('twitter-') || id.includes('meta-tag')) return <MetaGenerator />;

    // Crypto & Security Suite
    if (id === 'password-generator' || id === 'passphrase-generator' || id === 'pin-generator') return <PasswordTool mode={mode || id} />;
    if (id === 'password-strength') return <PasswordStrengthTool />;
    if (id === 'rsa-key-generator') return <RsaTool />;
    if (id === 'totp-generator') return <TotpTool />;
    if (id === 'file-checksum') return <FileChecksumTool mode={mode} />;
    if (activeTool.category === 'Crypto & Security' || id.includes('hash') || id.includes('hmac') || id.includes('aes') || id.includes('base64') || id.includes('random-')) {
      return <CryptoTools mode={mode || id} />;
    }

    // Unit Converters Suite
    if (id === 'unit-converter') return <UnitConverterTool />;
    if (id === 'number-base') return <NumberBaseTool />;
    if (id === 'roman-converter') return <RomanConverter />;
    if (id === 'scientific-calc') return <ScientificCalc />;
    if (id === 'dice-roller') return <DiceTool />;
    if (activeTool.category === 'Unit Converters' || id.endsWith('-converter')) {
      return <QuickUnitTool mode={mode || id} />;
    }

    // Math & Numbers Suite
    if (activeTool.category === 'Math & Science') {
      return <MathTools mode={mode || id} />;
    }

    // Finance & Money Suite
    if (id === 'loan-calc') return <LoanCalculator />;
    if (id === 'compound-interest') return <CompoundInterestTool />;
    if (id === 'tip-calc') return <TipCalculator />;
    if (activeTool.category === 'Finance & Money') {
      return <FinanceTools mode={mode || id} />;
    }

    // Date & Time Suite
    if (id === 'world-clock') return <WorldClockTool />;
    if (id === 'stopwatch') return <TimerTools mode="stopwatch" />;
    if (id === 'countdown-timer') return <TimerTools mode="countdown" />;
    if (id === 'pomodoro') return <TimerTools mode="pomodoro" />;
    if (activeTool.category === 'Date & Time') {
      return <DateTimeTools mode={mode || id} />;
    }

    // Color & Design Suite
    if (id === 'contrast-checker') return <ColorTools mode="contrast" />;
    if (id === 'gradient-generator') return <ColorTools mode="gradient" />;
    if (id === 'color-palette') return <ColorTools mode="palette" />;
    if (id === 'shades-tints') return <ColorTools mode="shades" />;
    if (activeTool.category === 'Color & Design') {
      return <ColorTools mode="converter" />;
    }

    // Media & Image Suite
    if (id === 'image-filter-studio') return <MediaTools mode="filter" />;
    if (id === 'aspect-ratio-calc') return <MediaTools mode="aspect" />;
    if (id === 'screen-detector') return <MediaTools mode="screen" />;
    if (activeTool.category === 'Image & Media') {
      return <MediaTools mode="resizer" />;
    }

    // Fallback default
    return <TextTools mode="case-converter" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        tools={TOOLS}
        onSelectTool={navigateToTool}
      />

      {/* Top Navbar */}
      <Navbar
        darkMode={isDarkMode}
        onToggleDarkMode={toggleTheme}
        onOpenSearch={() => setSearchModalOpen(true)}
        onRandomTool={handleRandomTool}
        favoritesCount={favorites.length}
        showOnlyFavorites={showFavoritesOnly}
        onToggleShowFavorites={() => {
          setShowFavoritesOnly(!showFavoritesOnly);
          setActiveToolId(null);
        }}
        onGoHome={navigateHome}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTool ? (
          /* SINGLE TOOL VIEW */
          <div className="space-y-6">
            {/* Tool Header Card */}
            <ToolHeader
              tool={activeTool}
              isFavorite={favorites.includes(activeTool.id)}
              onToggleFavorite={() => toggleFavorite(activeTool.id)}
              onBack={navigateHome}
            />

            {/* Tool Interactive Component */}
            <div className="pt-2">
              {renderActiveToolComponent()}
            </div>

            {/* Related Tools Section */}
            {relatedTools.length > 0 && (
              <div className="pt-10 border-t border-slate-200/80 dark:border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    More in {activeTool.category}
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedCategory(activeTool.category);
                      navigateHome();
                    }}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View all
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {relatedTools.map((tool: ToolItem) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      isFavorite={favorites.includes(tool.id)}
                      onToggleFavorite={toggleFavorite}
                      onSelect={navigateToTool}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* TOOL CATALOG / EXPLORATION HOME VIEW */
          <div className="space-y-8">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 shadow-xl border border-indigo-500/20">
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  100% Client-Side • Zero Backend • Offline Ready
                </div>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  SuperTools
                  <span className="block text-indigo-400 font-extrabold text-2xl sm:text-3xl mt-1">
                    365+ Pure Web Developer & Everyday Utilities
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                  Fast, private, and powerful Swiss Army Knife for developers, designers, and creators. All calculations, conversions, hashes, and formatting execute entirely in your browser memory.
                </p>

                {/* Quick Action search bar inside hero */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-lg">
                  <div
                    onClick={() => setSearchModalOpen(true)}
                    className="flex-1 flex items-center justify-between px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md cursor-pointer transition-all text-slate-300 text-sm shadow-inner"
                  >
                    <span>Search all 365+ utilities...</span>
                    <kbd className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/20 text-white font-bold">
                      ⌘K
                    </kbd>
                  </div>
                  <button
                    onClick={handleRandomTool}
                    className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    Surprise Me
                  </button>
                </div>
              </div>

              {/* Decorative background glows */}
              <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
              <div className="absolute right-40 bottom-0 -mb-20 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
            </div>

            {/* Recents strip if any */}
            {recentTools.length > 0 && !showFavoritesOnly && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recently Visited
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {recentTools.map((id: string) => {
                    const t = TOOLS.find((x: ToolItem) => x.id === id);
                    if (!t) return null;
                    return (
                      <button
                        key={t.id}
                        onClick={() => navigateToTool(t)}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-400 whitespace-nowrap shadow-2xs"
                      >
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Category Filter Pills Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Explore by Category
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Showing {filteredTools.length} of {TOOLS.length} tools
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORY_LIST.map((cat) => {
                  const isSelected = selectedCategory === cat.id && !showFavoritesOnly;
                  const count = cat.id === 'all'
                    ? TOOLS.length
                    : TOOLS.filter((t: ToolItem) => t.category === cat.id).length;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setShowFavoritesOnly(false);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected
                          ? 'bg-indigo-700 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}

                {/* Favorites filter pill */}
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                    showFavoritesOnly
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-current' : 'text-rose-500'}`} />
                  Favorites ({favorites.length})
                </button>
              </div>
            </div>

            {/* Tools Grid */}
            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredTools.map((tool: ToolItem) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    isFavorite={favorites.includes(tool.id)}
                    onToggleFavorite={toggleFavorite}
                    onSelect={navigateToTool}
                  />
                ))}
              </div>
            ) : (
              <div className="p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <Layers className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                  No matching tools found
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting your search terms or clearing the active category filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setShowFavoritesOnly(false);
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Global Footer */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900 dark:text-white">SuperTools</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>365+ Pure Web Utilities</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-medium">
              100% Client-Side
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Press <kbd className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-[10px] text-slate-600 dark:text-slate-300 font-bold">⌘K</kbd> to search anytime</span>
            <span>•</span>
            <a
              href="https://github.com/codero-sus/SuperTools"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
