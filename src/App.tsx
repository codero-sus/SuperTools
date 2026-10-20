import React, { useState, useEffect, useMemo } from 'react';
import { TOOLS_DATA as TOOLS } from './data/toolsData';
import type { ToolItem, Category } from './types';

// Components
import { Navbar } from './components/Navbar';
import { SearchModal } from './components/SearchModal';
import { ToolCard } from './components/ToolCard';
import { ToolHeader } from './components/ToolHeader';
import { CheatsheetView } from './components/CheatsheetView';
import { AmbientBackground, AmbientEffect } from './components/effects/AmbientBackground';
import { CategoryHub } from './components/CategoryHub';
import { HardwareScalingModal } from './components/HardwareScalingModal';
import { detectSystemHardware } from './utils/hardwareScaling';

// Core Powerhouse Tools
import { AutoPhotoProcessor } from './tools/AutoPhotoProcessor';
import { UniversalFileConverter } from './tools/UniversalFileConverter';
import { UnifiedTextForge } from './tools/UnifiedTextForge';
import { OcrTool } from './tools/OcrTool';
import { FileTransformer } from './tools/FileTransformer';
import { VideoDownloaderHelper } from './tools/VideoDownloaderHelper';
import { PrivacyVault } from './tools/PrivacyVault';
import { ScreenRecorder } from './tools/ScreenRecorder';
import { AudioStudio } from './tools/AudioStudio';
import { AiBackgroundRemover } from './tools/AiBackgroundRemover';
import { AiDocScanner } from './tools/AiDocScanner';
import { AiTextSummarizer } from './tools/AiTextSummarizer';
import { AiSmartRedactor } from './tools/AiSmartRedactor';
import { AiImageUpscaler } from './tools/AiImageUpscaler';
import { AiPaletteExtractor } from './tools/AiPaletteExtractor';
import { AiImageColorizer } from './tools/AiImageColorizer';
import { AiSpeechTranscriber } from './tools/AiSpeechTranscriber';

// Supporting Suite Tools
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

import { Sparkles, ArrowLeft, Heart, ShieldCheck, Layers, LayoutGrid, AppWindow, ArrowRight, Cpu } from 'lucide-react';

export const App: React.FC = () => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('supertools_theme') === 'dark' ||
      (!('supertools_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Silent visual ambient atmosphere mode ('leaves' | 'stars' | 'rain' | 'fireflies' | 'off')
  const [ambientEffect, setAmbientEffect] = useState<AmbientEffect>(() => {
    return (localStorage.getItem('supertools_ambient_mode') as AmbientEffect) || 'leaves';
  });

  // Dynamic Hardware & AI Resource Scaling Tier (Level 1 to Level 10, 2GB to 256GB RAM)
  const systemHw = useMemo(() => detectSystemHardware(), []);
  const [hardwareLevel, setHardwareLevel] = useState<number>(() => {
    const saved = localStorage.getItem('supertools_hw_level');
    if (saved) return Number(saved);
    return detectSystemHardware().detectedLevel;
  });
  const [isAutoHwMode, setIsAutoHwMode] = useState<boolean>(() => {
    return localStorage.getItem('supertools_hw_auto') !== 'false';
  });
  const [hwModalOpen, setHwModalOpen] = useState<boolean>(false);

  const handleSelectHwLevel = (lvl: number) => {
    setHardwareLevel(lvl);
    localStorage.setItem('supertools_hw_level', String(lvl));
    setIsAutoHwMode(false);
    localStorage.setItem('supertools_hw_auto', 'false');
  };

  const handleToggleAutoHwMode = () => {
    if (!isAutoHwMode) {
      const detected = systemHw.detectedLevel;
      setHardwareLevel(detected);
      localStorage.setItem('supertools_hw_level', String(detected));
      localStorage.setItem('supertools_hw_auto', 'true');
      setIsAutoHwMode(true);
    } else {
      localStorage.setItem('supertools_hw_auto', 'false');
      setIsAutoHwMode(false);
    }
  };

  // Navigation state (active tool ID, or null for catalog view)
  const [activeToolId, setActiveToolId] = useState<string | null>(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    return hash || null;
  });

  // Hub vs Category view
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<'hub' | 'grid'>('hub');

  // Search & Filter state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('supertools_favorites');
      return saved ? JSON.parse(saved) : ['auto-photo-processor', 'universal-file-converter', 'unified-text-forge', 'ocr-tool', 'video-downloader-helper'];
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

  const cycleAmbient = () => {
    const modes: AmbientEffect[] = ['leaves', 'stars', 'rain', 'fireflies', 'off'];
    const nextIdx = (modes.indexOf(ambientEffect) + 1) % modes.length;
    const nextMode = modes[nextIdx];
    setAmbientEffect(nextMode);
    localStorage.setItem('supertools_ambient_mode', nextMode);
  };

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
    setActiveCategoryFilter(null);
    setShowFavoritesOnly(false);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRandomTool = () => {
    const random = TOOLS[Math.floor(Math.random() * TOOLS.length)];
    navigateToTool(random);
  };

  const activeTool = useMemo(() => {
    return TOOLS.find(t => t.id === activeToolId);
  }, [activeToolId]);

  // Filtered tools when in category filter or search or favorites
  const filteredTools = useMemo(() => {
    return TOOLS.filter((t: ToolItem) => {
      if (showFavoritesOnly && !favorites.includes(t.id)) return false;
      if (activeCategoryFilter && t.category !== activeCategoryFilter) return false;
      if (selectedBadge && t.badge !== selectedBadge) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesDesc = t.description.toLowerCase().includes(q);
        const matchesTag = t.tags.some((tag: string) => tag.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTag) return false;
      }
      return true;
    });
  }, [activeCategoryFilter, selectedBadge, showFavoritesOnly, searchQuery, favorites]);

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

    // Direct High-Priority Power Tools
    if (id === 'ai-bg-remover') return <AiBackgroundRemover hardwareLevel={hardwareLevel} />;
    if (id === 'ai-doc-scanner') return <AiDocScanner hardwareLevel={hardwareLevel} />;
    if (id === 'ai-text-summarizer') return <AiTextSummarizer hardwareLevel={hardwareLevel} />;
    if (id === 'ai-smart-redactor') return <AiSmartRedactor hardwareLevel={hardwareLevel} />;
    if (id === 'ai-image-upscaler') return <AiImageUpscaler hardwareLevel={hardwareLevel} />;
    if (id === 'ai-palette-extractor') return <AiPaletteExtractor hardwareLevel={hardwareLevel} />;
    if (id === 'ai-image-colorizer') return <AiImageColorizer hardwareLevel={hardwareLevel} />;
    if (id === 'ai-speech-transcriber') return <AiSpeechTranscriber hardwareLevel={hardwareLevel} />;
    if (id === 'auto-photo-processor') return <AutoPhotoProcessor />;
    if (id === 'universal-file-converter') return <UniversalFileConverter />;
    if (id === 'unified-text-forge') return <UnifiedTextForge />;
    if (id === 'ocr-tool') return <OcrTool hardwareLevel={hardwareLevel} />;
    if (id === 'file-transformer') return <FileTransformer />;
    if (id === 'video-downloader-helper') return <VideoDownloaderHelper />;
    if (id === 'screen-recorder') return <ScreenRecorder />;
    if (id === 'privacy-vault') return <PrivacyVault />;
    if (id === 'audio-studio') return <AudioStudio />;

    // Cheatsheets
    if (activeTool.category === 'Cheatsheets & Guides' || id.startsWith('cheatsheet-')) {
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

    // Media & Studio Suite
    if (id === 'qr-generator') return <QrGenerator />;
    if (id === 'barcode-generator') return <BarcodeGenerator />;
    if (id === 'qr-scanner') return <QrScanner />;
    if (id === 'image-resizer') return <MediaTools mode="resizer" />;
    if (id === 'aspect-ratio-calc') return <MediaTools mode="aspect" />;
    if (id === 'screen-detector') return <MediaTools mode="screen" />;

    // Text & Crypto Forge Suite
    if (id === 'text-diff') return <TextDiffTool />;
    if (id === 'lorem-ipsum') return <LoremGenerator />;
    if (id === 'password-generator') return <PasswordTool mode="password" />;
    if (id === 'password-strength') return <PasswordStrengthTool />;
    if (id === 'crypto-hashes') return <CryptoTools mode="sha256" />;
    if (id === 'rsa-key-generator') return <RsaTool />;
    if (id === 'totp-generator') return <TotpTool />;
    if (id === 'file-checksum') return <FileChecksumTool />;

    // Code & Web Lab Suite
    if (id === 'json-formatter') return <CodeTools mode="json-formatter" />;
    if (id === 'jwt-decoder') return <JwtDecoder />;
    if (id === 'cron-helper') return <CronTool />;
    if (id === 'chmod-calculator') return <ChmodTool />;
    if (id === 'regex-tester') return <RegExTester />;
    if (id === 'uuid-v4') return <UuidTool mode="uuid-v4" />;
    if (id === 'keycode-inspector') return <KeycodeInspector />;
    if (id === 'meta-tag-generator') return <MetaGenerator />;
    if (id === 'curl-to-fetch') return <CodeTools mode="curl-to-fetch" />;
    if (id === 'sql-formatter') return <CodeTools mode="sql-formatter" />;

    // Math & Engineering Suite
    if (id === 'scientific-calc') return <ScientificCalc />;
    if (id === 'number-base') return <NumberBaseTool />;
    if (id === 'roman-converter') return <RomanConverter />;
    if (id === 'dice-roller') return <DiceTool />;
    if (id === 'percentage-calc') return <MathTools mode="percentage-calc" />;
    if (id === 'statistics-calc') return <MathTools mode="statistics-calc" />;
    if (id === 'quadratic-calc') return <MathTools mode="quadratic-calc" />;
    if (id === 'ohms-law') return <MathTools mode="ohms-law" />;

    // Unit Converters Suite
    if (id === 'unit-converter') return <UnitConverterTool />;
    if (activeTool.category === 'Unit Converters') {
      return <QuickUnitTool mode={mode || id} />;
    }

    // Finance & Money Suite
    if (id === 'loan-calc') return <LoanCalculator />;
    if (id === 'compound-interest') return <CompoundInterestTool />;
    if (id === 'tip-calc') return <TipCalculator />;
    if (activeTool.category === 'Finance & Money') {
      return <FinanceTools mode={mode || id} />;
    }

    // Date, Time & World Suite
    if (id === 'world-clock') return <WorldClockTool />;
    if (id === 'stopwatch') return <TimerTools mode="stopwatch" />;
    if (id === 'pomodoro') return <TimerTools mode="pomodoro" />;
    if (activeTool.category === 'Date, Time & World') {
      return <DateTimeTools mode={mode || id} />;
    }

    // Color & Palette Suite
    if (id === 'contrast-checker') return <ColorTools mode="contrast" />;
    if (id === 'gradient-generator') return <ColorTools mode="gradient" />;
    if (id === 'shades-tints') return <ColorTools mode="shades" />;
    if (activeTool.category === 'Color & Palette') {
      return <ColorTools mode="converter" />;
    }

    // Fallback default
    return <AutoPhotoProcessor />;
  };

  const isBrowsingSpecificCategory = Boolean(activeCategoryFilter || searchQuery.trim() || showFavoritesOnly || viewMode === 'grid');

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#090d16] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 relative selection:bg-indigo-500 selection:text-white">
      {/* Silent Visual Peaceful Ambient Canvas (Leaves / Stars / Rain / Fireflies) */}
      <AmbientBackground effect={ambientEffect} isDark={isDarkMode} />

      {/* Global Quick Search Modal (⌘K) */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        tools={TOOLS}
        onSelectTool={navigateToTool}
      />

      {/* Hardware & AI Resource Scaling Studio Modal (Lvl 1 - 2GB to Lvl 10 - 256GB) */}
      <HardwareScalingModal
        isOpen={hwModalOpen}
        onClose={() => setHwModalOpen(false)}
        currentLevel={hardwareLevel}
        onSelectLevel={handleSelectHwLevel}
        isAutoMode={isAutoHwMode}
        onToggleAutoMode={handleToggleAutoHwMode}
        detectedRamGb={systemHw.detectedRamGb}
        detectedCores={systemHw.detectedCores}
      />

      {/* Top Sticky Navbar */}
      <Navbar
        darkMode={isDarkMode}
        onToggleDarkMode={toggleTheme}
        onOpenSearch={() => setSearchModalOpen(true)}
        onRandomTool={handleRandomTool}
        favoritesCount={favorites.length}
        showOnlyFavorites={showFavoritesOnly}
        onToggleShowFavorites={() => {
          setShowFavoritesOnly(!showFavoritesOnly);
          setActiveCategoryFilter(null);
          setActiveToolId(null);
        }}
        onGoHome={navigateHome}
        ambientEffect={ambientEffect}
        onCycleAmbient={cycleAmbient}
        hardwareLevel={hardwareLevel}
        onOpenHardwareModal={() => setHwModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {activeTool ? (
          /* SINGLE TOOL VIEW */
          <div className="space-y-6">
            <ToolHeader
              tool={activeTool}
              isFavorite={favorites.includes(activeTool.id)}
              onToggleFavorite={() => toggleFavorite(activeTool.id)}
              onBack={navigateHome}
            />

            {/* Render Selected Tool Interactive Component */}
            <div className="pt-2">
              {renderActiveToolComponent()}
            </div>

            {/* Related Tools Suggestions */}
            {relatedTools.length > 0 && (
              <div className="pt-10 border-t border-slate-200/60 dark:border-slate-800/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    More in {activeTool.category}
                  </h3>
                  <button
                    onClick={() => {
                      setActiveCategoryFilter(activeTool.category);
                      setActiveToolId(null);
                    }}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View category &rarr;
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
          /* CATALOG EXPLORATION HOME VIEW */
          <div className="space-y-8">
            {/* Atmospheric Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-[#0e1628] text-white p-8 sm:p-12 shadow-2xl border border-indigo-500/20">
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-bold tracking-wide">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Zero Backend • 100% Client-Side • Safe & Private
                  </div>
                  <a
                    href="./settings.html"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold tracking-wide transition-all shadow-xs"
                    title="Adjust RAM Budgets and AI Model Selection in Dedicated Settings Dashboard"
                  >
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                    <span>AI Settings &amp; Hardware Tier &rarr;</span>
                  </a>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  SuperTools
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400 font-extrabold text-2xl sm:text-4xl mt-1">
                    Your All-in-One Powerhouse Toolkit
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                  Automatic photo processing studio, universal multi-format file converter (XLSX, CSV, PDF, WebP, ICO), 1000X precision OCR, audio tools, video stream grabber, and 1337 text forge.
                </p>

                {/* Instant Search Bar */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-lg">
                  <div
                    onClick={() => setSearchModalOpen(true)}
                    className="flex-1 flex items-center justify-between px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md cursor-pointer transition-all text-slate-300 text-sm shadow-inner"
                  >
                    <span>Search any tool, converter, or guide...</span>
                    <kbd className="px-2 py-0.5 rounded-lg text-[11px] font-mono bg-white/20 text-white font-bold">
                      ⌘K
                    </kbd>
                  </div>
                  <button
                    onClick={handleRandomTool}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    Surprise Me
                  </button>
                </div>
              </div>

              {/* Decorative background glows */}
              <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
              <div className="absolute right-40 bottom-0 -mb-20 w-80 h-80 rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />
            </div>

            {/* Recently Visited Quick Access Bar */}
            {recentTools.length > 0 && !showFavoritesOnly && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recently Used
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {recentTools.map((id: string) => {
                    const t = TOOLS.find((x: ToolItem) => x.id === id);
                    if (!t) return null;
                    return (
                      <button
                        key={t.id}
                        onClick={() => navigateToTool(t)}
                        className="px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-indigo-400 whitespace-nowrap shadow-2xs transition-all"
                      >
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* USER'S SKETCH ORGANIZATION SYSTEM: CATEGORY HUBS (C1, C2, C3, C4, C5, C6...) */}
            {!isBrowsingSpecificCategory ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      Browse by Category Hub
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Organized cleanly into functional studios with instant subcategory shortcuts.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-indigo-400 flex items-center gap-1.5 transition-all"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      View All Tools
                    </button>
                  </div>
                </div>

                {/* THE C1, C2, C3, C4, C5, C6 GRID DISPLAY */}
                <CategoryHub
                  tools={TOOLS}
                  onSelectTool={navigateToTool}
                  onSelectCategory={(cat) => setActiveCategoryFilter(cat)}
                />
              </div>
            ) : (
              /* DETAILED VIEW: INSIDE A SPECIFIC CATEGORY OR SEARCH/FAVORITES */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setActiveCategoryFilter(null);
                        setShowFavoritesOnly(false);
                        setSearchQuery('');
                        setViewMode('hub');
                      }}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                      title="Back to Category Hub"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h2 className="text-lg font-black text-slate-900 dark:text-white">
                        {showFavoritesOnly ? 'Bookmarked Favorites' : activeCategoryFilter || (searchQuery ? `Search: "${searchQuery}"` : 'All Tools')}
                      </h2>
                      <span className="text-xs text-slate-400">
                        Showing {filteredTools.length} utilities
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveCategoryFilter(null);
                        setShowFavoritesOnly(false);
                        setSearchQuery('');
                        setViewMode('hub');
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <span>Category Hub (C1-C9)</span>
                      <AppWindow className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Grid of Tools */}
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
                  <div className="p-16 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-center space-y-3">
                    <Layers className="w-10 h-10 text-slate-400 mx-auto" />
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                      No matching tools found
                    </h3>
                    <button
                      onClick={() => {
                        setActiveCategoryFilter(null);
                        setShowFavoritesOnly(false);
                        setSearchQuery('');
                        setViewMode('hub');
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                    >
                      Back to Category Hub
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Global Clean Footer */}
      <footer className="mt-16 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md py-8 text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-black text-slate-900 dark:text-white">SuperTools</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Client-Side Studio</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold">
              100% Private • 0 Backend
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
