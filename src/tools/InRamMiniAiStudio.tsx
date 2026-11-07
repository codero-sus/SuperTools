import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Cpu, Zap, Brain, Activity, Database, Sparkles, Send, RefreshCw, 
  Download, Upload, Sliders, Check, Copy, ArrowRight, Play, Square,
  Layers, HardDrive, ShieldCheck, Terminal, BookOpen, Search, Plus, 
  Trash2, AlertCircle, BarChart3, HelpCircle, Flame, Gauge, Laptop
} from 'lucide-react';
import { QuickCopy } from '../components/QuickCopy';
import { 
  getInRamNeuralEngine, InRamNeuralEngine, RamMemoryStats, 
  TrainingLossRecord, MemoryBankItem, VectorSearchResult, GenerationTelemetry,
  ModelProfileTier, MODEL_TIER_CONFIGS
} from '../utils/inRamNeuralAi';
import { getWebGpuAiEngine, WebGpuAiEngine, WebGpuBenchmarkResult, WebGpuDeviceInfo } from '../utils/webGpuAiEngine';
import { getTierByLevel, getUserRamBudgetMb } from '../utils/hardwareScaling';

interface InRamMiniAiStudioProps {
  hardwareLevel?: number;
}

type StudioTab = 'generator' | 'vector-rag' | 'trainer' | 'webgpu-bench' | 'inspector';

const PROMPT_PRESETS = [
  { label: '🧠 Neural Logic', text: 'Explain how multi-head attention computes parallel vector weights in browser RAM.' },
  { label: '🚀 WebGPU vs SIMD', text: 'Compare WebGPU WGSL compute shaders with CPU WebAssembly SIMD for tensor multiplication.' },
  { label: '💻 TypeScript Hook', text: 'Provide a resilient React hook using TypedArrays for client-side state caching.' },
  { label: '🛡️ Zero-Trust Security', text: 'Explain the privacy advantage of 100% in-browser client-side execution over cloud APIs.' },
  { label: '📊 Algorithm Profiling', text: 'How do Float32Array loop-unrolled dot products achieve sub-millisecond latency?' }
];

const TRAINING_PRESETS = [
  {
    title: 'SuperTools Client-Side Philosophy',
    text: 'SuperTools runs 100 percent client-side with zero backend and zero telemetry. User data never leaves local browser memory. WebGPU WGSL compute shaders and Web Workers power sub-second neural inference and document processing.'
  },
  {
    title: 'React Performance & TypedArrays',
    text: 'Contiguous Float32Array memory buffers provide cache-friendly linear access patterns for high-throughput browser computation without triggering garbage collection pauses.'
  },
  {
    title: 'WebGPU Compute Acceleration',
    text: 'WebGPU dispatches parallel compute workgroups across hundreds of physical GPU execution cores for massive matrix multiplications and high-dimensional vector embeddings.'
  }
];

export const InRamMiniAiStudio: React.FC<InRamMiniAiStudioProps> = ({ hardwareLevel = 3 }) => {
  const currentTier = getTierByLevel(hardwareLevel);
  const ramBudgetMb = useMemo(() => getUserRamBudgetMb(hardwareLevel), [hardwareLevel]);

  // Engine instances
  const engine = useMemo(() => getInRamNeuralEngine(), []);
  const webGpuEngine = useMemo(() => getWebGpuAiEngine(), []);

  // UI state
  const [activeTab, setActiveTab] = useState<StudioTab>('generator');
  const [ramStats, setRamStats] = useState<RamMemoryStats>(() => engine.getRamStats());
  const [gpuInfo, setGpuInfo] = useState<WebGpuDeviceInfo>(() => webGpuEngine.getDeviceInfo());

  // Generation state
  const [prompt, setPrompt] = useState<string>(PROMPT_PRESETS[0].text);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedOutput, setGeneratedOutput] = useState<string>('');
  const [telemetry, setTelemetry] = useState<GenerationTelemetry | null>(null);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topP, setTopP] = useState<number>(0.9);
  const [maxTokens, setMaxTokens] = useState<number>(64);
  const [enableCoT, setEnableCoT] = useState<boolean>(false);
  const [activeTokenLive, setActiveTokenLive] = useState<string>('');
  const [currentLatencyLiveMs, setCurrentLatencyLiveMs] = useState<number>(0.38);

  // Model Tier selection
  const [selectedTier, setSelectedTier] = useState<ModelProfileTier>(() => {
    if (hardwareLevel <= 2) return 'nano';
    if (hardwareLevel <= 5) return 'core';
    if (hardwareLevel <= 7) return 'powerhouse';
    return 'beast';
  });

  // Vector RAG memory state
  const [memories, setMemories] = useState<MemoryBankItem[]>(() => engine.getMemoryBank());
  const [ragQuery, setRagQuery] = useState<string>('How does WebGPU accelerate in-browser neural computing?');
  const [ragResults, setRagResults] = useState<VectorSearchResult[]>([]);
  const [isSearchingRag, setIsSearchingRag] = useState<boolean>(false);
  const [newMemTitle, setNewMemTitle] = useState<string>('');
  const [newMemContent, setNewMemContent] = useState<string>('');
  const [newMemCategory, setNewMemCategory] = useState<'code' | 'architecture' | 'science' | 'custom'>('custom');
  const [showAddMemModal, setShowAddMemModal] = useState<boolean>(false);

  // Training state
  const [trainingText, setTrainingText] = useState<string>(TRAINING_PRESETS[0].text);
  const [trainEpochs, setTrainEpochs] = useState<number>(6);
  const [learningRate, setLearningRate] = useState<number>(0.05);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingLossHistory, setTrainingLossHistory] = useState<TrainingLossRecord[]>([]);

  // WebGPU Benchmark state
  const [benchSize, setBenchSize] = useState<number>(256);
  const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);
  const [benchResult, setBenchResult] = useState<WebGpuBenchmarkResult | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Probe WebGPU and update info
  useEffect(() => {
    webGpuEngine.init().then(info => {
      setGpuInfo(info);
      setRamStats(engine.getRamStats());
    });
  }, [webGpuEngine, engine]);

  // Periodic RAM refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setRamStats(engine.getRamStats());
      setGpuInfo(webGpuEngine.getDeviceInfo());
    }, 2000);
    return () => clearInterval(timer);
  }, [engine, webGpuEngine]);

  // Handle model tier switch
  const handleSelectTier = (tier: ModelProfileTier) => {
    setSelectedTier(tier);
    engine.setModelTier(tier);
    setRamStats(engine.getRamStats());
  };

  // Handle live generation
  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGeneratedOutput('');
    setActiveTokenLive('');
    setTelemetry(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      let accumulated = '';
      const result = await engine.generateStreaming(prompt, {
        maxTokens,
        temperature,
        topP,
        enableCoT,
        abortSignal: controller.signal,
        onToken: (tok, idx, latMs) => {
          accumulated += (accumulated ? ' ' : '') + tok;
          setGeneratedOutput(accumulated);
          setActiveTokenLive(tok);
          setCurrentLatencyLiveMs(Number(latMs.toFixed(2)));
        }
      });

      setTelemetry(result.telemetry);
      setRamStats(engine.getRamStats());
    } catch (err) {
      console.error('In-RAM inference error:', err);
    } finally {
      setIsGenerating(false);
      setActiveTokenLive('');
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
    }
  };

  // Handle Vector RAG search with WebGPU acceleration
  const handleRagSearch = async () => {
    if (!ragQuery.trim()) return;
    setIsSearchingRag(true);
    const results = await engine.searchMemoryBankAsync(ragQuery, 4);
    setRagResults(results);
    setIsSearchingRag(false);
  };

  // Add custom memory to RAM bank
  const handleAddMemory = () => {
    if (!newMemTitle.trim() || !newMemContent.trim()) return;
    engine.addMemoryToBank({
      id: `mem-${Date.now()}`,
      title: newMemTitle.trim(),
      content: newMemContent.trim(),
      category: newMemCategory
    });
    setMemories([...engine.getMemoryBank()]);
    setNewMemTitle('');
    setNewMemContent('');
    setShowAddMemModal(false);
    setRamStats(engine.getRamStats());
  };

  const handleDeleteMemory = (id: string) => {
    engine.deleteMemory(id);
    setMemories([...engine.getMemoryBank()]);
    setRamStats(engine.getRamStats());
  };

  const handleRagSynthesize = (item: MemoryBankItem) => {
    setPrompt(`According to in-RAM memory "${item.title}": ${item.content}. Explain why this architecture is optimal.`);
    setActiveTab('generator');
  };

  // Handle In-RAM Training
  const handleTrain = async () => {
    if (!trainingText.trim() || isTraining) return;
    setIsTraining(true);
    setTrainingLossHistory([]);

    const history = engine.trainOnText(trainingText, {
      epochs: trainEpochs,
      learningRate,
      onProgress: (rec) => {
        setTrainingLossHistory(prev => [...prev, rec]);
      }
    });

    setTrainingLossHistory(history);
    setIsTraining(false);
    setRamStats(engine.getRamStats());
  };

  // Run WebGPU Benchmark
  const handleRunWebGpuBenchmark = async () => {
    setIsBenchmarking(true);
    try {
      const res = await webGpuEngine.runBenchmark(benchSize);
      setBenchResult(res);
    } catch (err) {
      console.warn('WebGPU Benchmark error:', err);
    } finally {
      setIsBenchmarking(false);
    }
  };

  // Toggle Quantization
  const handleToggleQuantization = (mode: 'FP32' | 'INT8') => {
    engine.setQuantization(mode);
    setRamStats(engine.getRamStats());
  };

  // Export weights snapshot
  const handleExportWeights = () => {
    const jsonStr = engine.exportWeightsSnapshot();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supertools-inram-ai-weights-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Powerhouse Header & Live In-RAM + WebGPU Telemetry HUD */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 text-white shadow-xl border border-indigo-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-inner">
                <Brain className="w-7 h-7 text-indigo-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-white">In-RAM Powerful Neural AI</h1>
                  {gpuInfo.isAvailable ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-400 fill-current" />
                      WebGPU Active
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/40 flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-violet-400" />
                      CPU SIMD RAM
                    </span>
                  )}
                </div>
                <p className="text-sm text-indigo-200/80">
                  {MODEL_TIER_CONFIGS[selectedTier].name} • {ramStats.numHeads}-Head Attention • TypedArrays &amp; WGSL Compute Shaders
                </p>
              </div>
            </div>
          </div>

          {/* Real-Time Live Telemetry HUD */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-semibold">RAM Allocation</span>
              </div>
              <div className="font-mono text-base font-black text-white">
                {ramStats.totalAllocatedMb} <span className="text-xs font-normal text-indigo-300">MB</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                {ramStats.parameterCount.toLocaleString()} params ({ramStats.quantization})
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold">Inference Latency</span>
              </div>
              <div className="font-mono text-base font-black text-amber-300">
                {currentLatencyLiveMs} <span className="text-xs font-normal text-amber-200">ms / tok</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Sub-millisecond execution
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-semibold">Generation Speed</span>
              </div>
              <div className="font-mono text-base font-black text-rose-300">
                {ramStats.tokensPerSecEstimate} <span className="text-xs font-normal text-rose-200">tok/s</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {gpuInfo.isAvailable ? 'WebGPU WGSL Cores' : 'SIMD Unrolled CPU'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">Hardware Bound</span>
              </div>
              <div className="font-mono text-base font-black text-emerald-300">
                Lvl {hardwareLevel} • {currentTier.shortLabel}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Budget: {ramBudgetMb} MB
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'generator'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Neural Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('vector-rag')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'vector-rag'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Vector Memory (RAG)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-400/20 text-indigo-300 font-mono">
              {memories.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('webgpu-bench')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'webgpu-bench'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Gauge className="w-4 h-4 text-emerald-400" />
            <span>WebGPU Hardware Lab</span>
          </button>

          <button
            onClick={() => setActiveTab('trainer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'trainer'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>In-RAM Fine-Tuner</span>
          </button>

          <button
            onClick={() => setActiveTab('inspector')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'inspector'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>RAM Matrix Inspector</span>
          </button>
        </div>
      </div>

      {/* Model Architecture Profile Switcher Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-1">
            Active Neural Architecture in RAM
          </span>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span>{MODEL_TIER_CONFIGS[selectedTier].name}</span>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">
              ({MODEL_TIER_CONFIGS[selectedTier].embedDim}-dim • {MODEL_TIER_CONFIGS[selectedTier].numHeads} Heads)
            </span>
          </div>
        </div>

        {/* Tier Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['nano', 'core', 'powerhouse', 'beast'] as ModelProfileTier[]).map((tierKey) => {
            const t = MODEL_TIER_CONFIGS[tierKey];
            const isSelected = selectedTier === tierKey;
            return (
              <button
                key={tierKey}
                onClick={() => handleSelectTier(tierKey)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="capitalize font-black">{tierKey}</span>
                  <span className="text-[10px] font-mono text-slate-400">{t.ramEstMb}MB</span>
                </div>
                <div className="text-[10px] text-slate-500 font-normal truncate mt-0.5">
                  {t.numHeads} Head{t.numHeads > 1 ? 's' : ''}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: NEURAL GENERATOR */}
      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls & Presets (Left Column) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Inference Hyperparameters</span>
                <Sliders className="w-4 h-4 text-slate-400" />
              </div>

              {/* Chain-of-Thought (CoT) Toggle */}
              <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 block">
                    Chain-of-Thought (CoT)
                  </span>
                  <span className="text-[10px] text-indigo-700/80 dark:text-indigo-400/80">
                    Generates &lt;think&gt; reasoning steps
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={enableCoT}
                  onChange={(e) => setEnableCoT(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Temperature */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>Sampling Temperature</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{temperature.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400 mt-1">Lower = deterministic precision; Higher = creative variance</p>
              </div>

              {/* Top-P Nucleus */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>Top-P (Nucleus Sampling)</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{topP.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={topP}
                  onChange={(e) => setTopP(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Max Tokens */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>Max Tokens in RAM</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{maxTokens}</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="128"
                  step="8"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">Curated Prompts</span>
              <div className="space-y-2">
                {PROMPT_PRESETS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(p.text)}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all flex items-center justify-between group"
                  >
                    <span>{p.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Prompt & Streaming Terminal (Right Column) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Neural Input Prompt</span>
                <span className="text-[11px] text-slate-400 font-mono">{prompt.length} chars</span>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask any logic, coding, architecture, or synthesis question..."
                rows={3}
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-none"
              />

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Terminal className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Sub-millisecond inference in browser memory</span>
                </div>

                <div className="flex items-center gap-2">
                  {isGenerating ? (
                    <button
                      onClick={handleStopGeneration}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop Generation</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleGenerate}
                      disabled={!prompt.trim()}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-md shadow-indigo-600/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Execute In-RAM</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Neural Generation Output Terminal */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 shadow-xl space-y-3 font-mono relative">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 ml-2">In-RAM Tensor Stream</span>
                </div>

                {generatedOutput && (
                  <div className="flex items-center gap-2">
                    <QuickCopy text={generatedOutput} label="Copy Output" />
                  </div>
                )}
              </div>

              {/* Streaming Content */}
              <div className="min-h-[160px] max-h-[340px] overflow-y-auto p-2 text-sm leading-relaxed whitespace-pre-wrap select-text">
                {generatedOutput ? (
                  <>
                    <span className="text-indigo-300 font-bold">{'> '}</span>
                    {generatedOutput}
                    {isGenerating && (
                      <span className="inline-block w-2 h-4 ml-1 bg-indigo-400 animate-pulse align-middle" />
                    )}
                  </>
                ) : (
                  <div className="text-slate-500 italic py-10 text-center">
                    Click "Execute In-RAM" above to run sub-millisecond multi-head token generation.
                  </div>
                )}
              </div>

              {/* Live Telemetry Footer */}
              {telemetry && (
                <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400">
                  <div>
                    <span className="text-slate-500 block">Total Tokens</span>
                    <span className="text-white font-bold">{telemetry.generatedTokens} tok</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Total Runtime</span>
                    <span className="text-indigo-400 font-bold">{telemetry.totalTimeMs} ms</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Latency / Token</span>
                    <span className="text-amber-400 font-bold">{telemetry.timePerTokenMs} ms</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Hardware Backend</span>
                    <span className="text-emerald-400 font-bold truncate block">{telemetry.accelerator}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IN-RAM VECTOR MEMORY (RAG) */}
      {activeTab === 'vector-rag' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Semantic Cosine Vector Search</h3>
                <p className="text-xs text-slate-500">
                  Accelerated via {gpuInfo.isAvailable ? 'WebGPU WGSL Compute Shaders' : 'Float32Array SIMD Kernels'} in &lt; 1ms
                </p>
              </div>
              <button
                onClick={() => setShowAddMemModal(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Memory Note</span>
              </button>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={ragQuery}
                  onChange={(e) => setRagQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRagSearch()}
                  placeholder="Ask a question against your in-RAM memory bank..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={handleRagSearch}
                disabled={isSearchingRag}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition-colors shrink-0 shadow-sm flex items-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSearchingRag ? 'animate-spin' : ''}`} />
                <span>Vector Search</span>
              </button>
            </div>

            {/* Results */}
            {ragResults.length > 0 && (
              <div className="pt-3 space-y-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Ranked Vector Matches (Cosine Similarity)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ragResults.map((res, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-950/30 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-indigo-900 dark:text-indigo-200">{res.item.title}</span>
                        <span className="font-mono text-xs font-black px-2 py-0.5 rounded-full bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300">
                          {(res.similarity * 100).toFixed(1)}% match
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                        {res.item.content}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {res.accelerator} • {res.timeMs}ms
                        </span>
                        <button
                          onClick={() => handleRagSynthesize(res.item)}
                          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <span>Synthesize Answer</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Memory Bank List */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">In-RAM Resident Memory Items</h3>
                <p className="text-xs text-slate-500">Each item is encoded as a Float32Array vector in browser RAM</p>
              </div>
              <span className="font-mono text-xs font-bold text-slate-400">{memories.length} items resident</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {memories.map((mem) => (
                <div
                  key={mem.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2 relative group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {mem.category}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">{mem.title}</h4>
                    </div>
                    <button
                      onClick={() => handleDeleteMemory(mem.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                      title="Delete from RAM"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {mem.content}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-200/60 dark:border-slate-700/60">
                    <span>Float32Array[{mem.vector.length}]</span>
                    <span>{mem.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Memory Modal */}
          {showAddMemModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-lg text-slate-900 dark:text-white">Add In-RAM Knowledge Memory</h3>
                  <button
                    onClick={() => setShowAddMemModal(false)}
                    className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Title</label>
                    <input
                      type="text"
                      value={newMemTitle}
                      onChange={(e) => setNewMemTitle(e.target.value)}
                      placeholder="e.g. Clean Architecture Rule #1"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Knowledge Content</label>
                    <textarea
                      value={newMemContent}
                      onChange={(e) => setNewMemContent(e.target.value)}
                      rows={4}
                      placeholder="Paste guidelines, documentation, or domain rules to be embedded..."
                      className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                    <select
                      value={newMemCategory}
                      onChange={(e) => setNewMemCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="custom">Custom</option>
                      <option value="code">Code & Syntax</option>
                      <option value="architecture">System Architecture</option>
                      <option value="science">Science & Logic</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowAddMemModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMemory}
                    disabled={!newMemTitle.trim() || !newMemContent.trim()}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
                  >
                    Encode into RAM
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: WEBGPU HARDWARE LAB */}
      {activeTab === 'webgpu-bench' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-emerald-500" />
                  WebGPU Hardware Compute Lab &amp; Shader Profiler
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Benchmarks direct WebGPU Shading Language (WGSL) tensor operations on your physical graphics hardware.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  gpuInfo.isAvailable
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${gpuInfo.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  {gpuInfo.isAvailable ? 'Hardware WebGPU Supported' : 'SIMD CPU Fallback Active'}
                </span>
              </div>
            </div>

            {/* GPU Device Properties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Adapter / Device</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white block truncate" title={gpuInfo.adapterName}>
                  {gpuInfo.adapterName}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">{gpuInfo.vendor}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Architecture</span>
                <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400 block">
                  {gpuInfo.architecture}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">{gpuInfo.deviceType}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Max Storage Buffer</span>
                <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400 block">
                  {gpuInfo.maxBufferSizeMb} MB VRAM
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">GPU Compute Heap</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Workgroup Size</span>
                <span className="font-bold text-sm text-rose-600 dark:text-rose-400 block">
                  {gpuInfo.maxComputeWorkgroupSize} Invocations
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">Parallel Shader Threads</span>
              </div>
            </div>

            {/* Interactive Benchmark Runner */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-white">WGSL Tensor Matrix Multiply Benchmark</h4>
                  <p className="text-xs text-slate-400">
                    Calculates 2 * N³ floating-point operations across GPU shader cores.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={benchSize}
                    onChange={(e) => setBenchSize(parseInt(e.target.value))}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="128">128 x 128 Tensor</option>
                    <option value="256">256 x 256 Tensor</option>
                    <option value="512">512 x 512 Tensor</option>
                  </select>

                  <button
                    onClick={handleRunWebGpuBenchmark}
                    disabled={isBenchmarking}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Zap className={`w-3.5 h-3.5 ${isBenchmarking ? 'animate-spin' : ''}`} />
                    <span>{isBenchmarking ? 'Computing...' : 'Run Benchmark'}</span>
                  </button>
                </div>
              </div>

              {/* Benchmark Results Display */}
              {benchResult && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-400 block">Execution Backend</span>
                    <span className="font-bold text-emerald-400 truncate block mt-0.5">{benchResult.backend}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-400 block">Dispatch Latency</span>
                    <span className="font-bold text-amber-300 text-sm mt-0.5 block">{benchResult.timeMs} ms</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-400 block">Throughput Rate</span>
                    <span className="font-bold text-rose-300 text-sm mt-0.5 block">{benchResult.gflops} GFLOPS</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-400 block">Benchmark Timestamp</span>
                    <span className="font-bold text-slate-300 mt-0.5 block">{benchResult.timestamp}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: IN-RAM FINE-TUNER */}
      {activeTab === 'trainer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Backpropagation Hyperparameters</span>
                <Activity className="w-4 h-4 text-slate-400" />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>Training Epochs</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{trainEpochs}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={trainEpochs}
                  onChange={(e) => setTrainEpochs(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>Learning Rate (SGD)</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{learningRate.toFixed(3)}</span>
                </div>
                <input
                  type="range"
                  min="0.005"
                  max="0.2"
                  step="0.005"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Presets</span>
                {TRAINING_PRESETS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setTrainingText(p.text)}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 bg-slate-50/60 dark:bg-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all"
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Corpus for In-RAM Fine-Tuning</span>
                <span className="text-[11px] text-slate-400 font-mono">{trainingText.split(/\s+/).length} words</span>
              </div>
              <textarea
                value={trainingText}
                onChange={(e) => setTrainingText(e.target.value)}
                rows={4}
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-none"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-500">
                  Updates Float32Array weights directly via SGD gradient descent
                </span>
                <button
                  onClick={handleTrain}
                  disabled={isTraining || !trainingText.trim()}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTraining ? 'animate-spin' : ''}`} />
                  <span>{isTraining ? 'Backpropagating...' : 'Train in RAM'}</span>
                </button>
              </div>
            </div>

            {/* Training Loss Curve & Records */}
            {trainingLossHistory.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 shadow-xl space-y-4 font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-400">Cross-Entropy Loss Descent</span>
                  <span className="text-[11px] text-emerald-400">
                    Loss: {trainingLossHistory[0].loss} → {trainingLossHistory[trainingLossHistory.length - 1].loss}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {trainingLossHistory.map((rec) => (
                    <div key={rec.epoch} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                      <div className="text-slate-400 text-[10px]">Epoch {rec.epoch}</div>
                      <div className="text-amber-300 font-bold font-mono text-sm">{rec.loss}</div>
                      <div className="text-slate-500 text-[9px] mt-0.5">{rec.timeMs} ms</div>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-slate-400 pt-1">
                  ✓ Weights updated in RAM buffer. Switch to Neural Generator to test output on newly learned associations!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: RAM MATRIX INSPECTOR */}
      {activeTab === 'inspector' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Resident Memory Buffer Allocations</h3>
                <p className="text-xs text-slate-500">Live breakdown of typed array allocations currently held in browser RAM</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex text-xs font-bold">
                  <button
                    onClick={() => handleToggleQuantization('FP32')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      ramStats.quantization === 'FP32' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    FP32 (4-byte)
                  </button>
                  <button
                    onClick={() => handleToggleQuantization('INT8')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      ramStats.quantization === 'INT8' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    INT8 (1-byte, 4x compression)
                  </button>
                </div>

                <button
                  onClick={handleExportWeights}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors shadow-2xs"
                  title="Export Weights Snapshot"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            {/* Granular Memory Allocation Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-2">Buffer Name</th>
                    <th className="pb-2">TypedArray Representation</th>
                    <th className="pb-2">Dimensions &amp; Heads</th>
                    <th className="pb-2">Memory Footprint</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                  <tr>
                    <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">Weight Matrices (Dense + Attn)</td>
                    <td className="py-2.5 text-indigo-600 dark:text-indigo-400">Float32Array / Int8Array</td>
                    <td className="py-2.5 text-slate-500">{ramStats.numHeads} Heads • [{MODEL_TIER_CONFIGS[selectedTier].embedDim}x{MODEL_TIER_CONFIGS[selectedTier].hiddenDim}]</td>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">{(ramStats.weightsBytes / 1024).toFixed(1)} KB</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">Token Embedding Table</td>
                    <td className="py-2.5 text-indigo-600 dark:text-indigo-400">Float32Array</td>
                    <td className="py-2.5 text-slate-500">[512 x {MODEL_TIER_CONFIGS[selectedTier].embedDim}]</td>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">{(ramStats.embeddingsBytes / 1024).toFixed(1)} KB</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">KV Attention Cache Buffer</td>
                    <td className="py-2.5 text-indigo-600 dark:text-indigo-400">Float32Array</td>
                    <td className="py-2.5 text-slate-500">[128 x {MODEL_TIER_CONFIGS[selectedTier].embedDim}]</td>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">{(ramStats.kvCacheBytes / 1024).toFixed(1)} KB</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">In-RAM Vector Memory Bank</td>
                    <td className="py-2.5 text-indigo-600 dark:text-indigo-400">Float32Array[]</td>
                    <td className="py-2.5 text-slate-500">[{memories.length} x {MODEL_TIER_CONFIGS[selectedTier].embedDim}]</td>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">{(ramStats.vectorBankBytes / 1024).toFixed(1)} KB</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">Vocabulary Strings Table</td>
                    <td className="py-2.5 text-slate-500">String Array</td>
                    <td className="py-2.5 text-slate-500">[512 entries]</td>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">{(ramStats.vocabBytes / 1024).toFixed(1)} KB</td>
                  </tr>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/40">
                    <td className="py-3 font-black text-slate-900 dark:text-white">Total Active RAM Footprint</td>
                    <td className="py-3 text-emerald-600 dark:text-emerald-400 font-bold">Contiguous ArrayBuffers</td>
                    <td className="py-3 text-slate-500">{ramStats.parameterCount.toLocaleString()} params</td>
                    <td className="py-3 font-black text-emerald-600 dark:text-emerald-400 text-sm">{ramStats.totalAllocatedMb} MB</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Hardware Tier Connection Note */}
            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-start gap-3">
              <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-bold text-indigo-950 dark:text-indigo-200">
                  Hardware Resource Scaling: {currentTier.name} ({currentTier.targetRamGb} GB RAM Target)
                </span>
                <p className="text-indigo-800/80 dark:text-indigo-300/80 leading-relaxed">
                  Your device has a safe RAM allocation budget cap of <strong>{ramBudgetMb} MB</strong>.
                  With the in-RAM model occupying only <strong>{ramStats.totalAllocatedMb} MB</strong>, you have over{' '}
                  <strong>{Math.max(1, ramBudgetMb - Math.round(Number(ramStats.totalAllocatedMb)))} MB</strong> remaining for image upscaling,
                  multi-threaded neural OCR workers, and canvas graphics processing without paging to disk.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
