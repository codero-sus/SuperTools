import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Cpu, Zap, Brain, Activity, Database, Sparkles, Send, RefreshCw, 
  Download, Upload, Sliders, Check, Copy, ArrowRight, Play, Square,
  Layers, HardDrive, ShieldCheck, Terminal, BookOpen, Search, Plus, 
  Trash2, AlertCircle, BarChart3, HelpCircle, Flame, Gauge, Laptop,
  Wrench, Calculator, Clock, Scale, Binary, Code2, Eye
} from 'lucide-react';
import { QuickCopy } from '../components/QuickCopy';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { 
  getInRamNeuralEngine, InRamNeuralEngine, RamMemoryStats, 
  TrainingLossRecord, MemoryBankItem, VectorSearchResult, GenerationTelemetry,
  ModelProfileTier, MODEL_TIER_CONFIGS, QuantizationMode
} from '../utils/inRamNeuralAi';
import { getWebGpuAiEngine, WebGpuAiEngine, WebGpuBenchmarkResult, WebGpuDeviceInfo } from '../utils/webGpuAiEngine';
import { getTierByLevel, getUserRamBudgetMb } from '../utils/hardwareScaling';
import { LLM_AVAILABLE_TOOLS, ToolCallExecution } from '../utils/llmToolRegistry';

interface InRamMiniAiStudioProps {
  hardwareLevel?: number;
}

type StudioTab = 'generator' | 'tools-lab' | 'vector-rag' | 'trainer' | 'webgpu-bench' | 'inspector';

const PROMPT_PRESETS = [
  { label: '🔓 Exploit & Overflow Audit', text: 'Explain how x86-64 stack buffer overflow corruption works, show a proof-of-concept vulnerable C function, and how ASLR, stack canaries, and bounds checking mitigate it.' },
  { label: '🔓 Shellcode Analysis', text: 'Disassemble and explain Linux x86_64 execve syscall shellcode line by line with register state explanation.' },
  { label: '🔓 Raw Cyberpunk Fiction', text: 'Write an intense, gritty cyberpunk scene between an underground neural hacker and a corporate counter-intrusion operative.' },
  { label: '🛠️ Math Calculator', text: 'Calculate (145 * 28) + sqrt(144) / 4 and explain step by step.' },
  { label: '🛠️ Unit Converter', text: 'Convert 120 km to miles and 75 fahrenheit to celsius.' },
  { label: '🛠️ UUID Generator', text: 'Generate 3 secure UUID v4 tokens and a nanoid slug.' },
  { label: '🛠️ JSON Validator', text: 'Format and validate json: {"model":"Llama-3.2-3B","vramRequiredMb":1800,"quant":"Q4_K"}' },
  { label: '🛠️ Password Generator', text: 'Generate a 24-character high-entropy cryptographic password with symbols and numbers.' },
  { label: '🛠️ Color Converter', text: 'Convert color #6366f1 to RGB and HSL values with contrast recommendations.' },
  { label: '🛠️ Cron Explainer', text: 'Explain cron expression: */15 9-18 * * 1-5' },
  { label: '🛠️ Financial Loan EMI', text: 'Calculate loan EMI for $50,000 at 7.5% annual interest over 5 years.' },
  { label: '🛠️ IP Subnet Calc', text: 'Calculate CIDR subnet details for 192.168.10.0/24.' },
  { label: '🧠 Multi-Head Attention', text: 'Explain how multi-head attention computes parallel vector weights in browser RAM.' },
  { label: '🚀 WebGPU vs SIMD', text: 'Compare WebGPU WGSL compute shaders with CPU WebAssembly SIMD for tensor multiplication.' }
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

// Stepped tiers for the vertical slider (Level 1 to 8: Micro-GPT to DeepSeek-R1 Extreme)
const VERTICAL_SLIDER_TIERS: ModelProfileTier[] = [
  'micro',
  'nano',
  'core',
  'gpt2-small',
  'gpt2-medium',
  'llama-3-1b',
  'llama-3-3b',
  'deepseek-r1-distill'
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
  const [enableToolCalling, setEnableToolCalling] = useState<boolean>(true);
  const [activeTokenLive, setActiveTokenLive] = useState<string>('');
  const [currentLatencyLiveMs, setCurrentLatencyLiveMs] = useState<number>(0.35);
  const [lastExecutedTools, setLastExecutedTools] = useState<ToolCallExecution[]>([]);
  const [streamViewMode, setStreamViewMode] = useState<'formatted' | 'raw'>('formatted');

  // Vertical Slider Model Tier selection
  const [selectedTier, setSelectedTier] = useState<ModelProfileTier>(() => {
    if (hardwareLevel <= 2) return 'nano';
    if (hardwareLevel <= 4) return 'core';
    if (hardwareLevel <= 7) return 'gpt2-small';
    return 'gpt2-medium';
  });

  // Quantization mode (Q4_K vs Q6_K vs FP16 vs FP32)
  const [quantMode, setQuantMode] = useState<QuantizationMode>(() => {
    if (hardwareLevel <= 3) return 'Q4_K';
    if (hardwareLevel <= 7) return 'Q6_K';
    return 'FP16';
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

  // On-demand Model Loading & Download States (eliminates lag and unnecessary downloads)
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(() => engine.isLoaded());
  const [isModelLoading, setIsModelLoading] = useState<boolean>(false);
  const [modelLoadProgress, setModelLoadProgress] = useState<number>(0);
  const [modelLoadStatus, setModelLoadStatus] = useState<string>('');

  const handleDownloadAndLoadModel = async () => {
    if (isModelLoading) return;
    setIsModelLoading(true);
    setModelLoadProgress(0);
    setModelLoadStatus(`Initializing ${MODEL_TIER_CONFIGS[selectedTier].shortLabel}...`);

    try {
      await engine.loadModelAsync((pct, msg) => {
        setModelLoadProgress(pct);
        setModelLoadStatus(msg);
      });
      setIsModelLoaded(true);
      setRamStats(engine.getRamStats());
    } catch (err) {
      console.error('Failed to load model weights:', err);
      setModelLoadStatus('Error loading model weights. Please retry.');
    } finally {
      setIsModelLoading(false);
    }
  };

  const handleUnloadModel = () => {
    engine.unloadModel();
    setIsModelLoaded(false);
    setModelLoadProgress(0);
    setModelLoadStatus('');
    setRamStats(engine.getRamStats());
  };

  // Handle vertical slider tier change (Instantaneous, 0 lag)
  const handleSelectTier = (tier: ModelProfileTier) => {
    setSelectedTier(tier);
    engine.setModelTier(tier);
    setIsModelLoaded(false);
    setModelLoadProgress(0);
    setModelLoadStatus('');
    // Auto-align recommended quantization unless overridden
    const recommended = MODEL_TIER_CONFIGS[tier].recommendedQuant;
    setQuantMode(recommended);
    engine.setQuantization(recommended);
    setRamStats(engine.getRamStats());
  };

  // Handle quantization change
  const handleSelectQuantization = (q: QuantizationMode) => {
    setQuantMode(q);
    engine.setQuantization(q);
    setRamStats(engine.getRamStats());
  };

  // Convert vertical slider index (0 to 4) to tier
  const currentSliderIndex = VERTICAL_SLIDER_TIERS.indexOf(selectedTier);
  const handleVerticalSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value, 10);
    if (idx >= 0 && idx < VERTICAL_SLIDER_TIERS.length) {
      handleSelectTier(VERTICAL_SLIDER_TIERS[idx]);
    }
  };

  // Handle live generation
  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    // If model not loaded, load on demand first
    if (!isModelLoaded) {
      await handleDownloadAndLoadModel();
    }

    setIsGenerating(true);
    setGeneratedOutput('');
    setActiveTokenLive('');
    setTelemetry(null);
    setLastExecutedTools([]);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      let accumulated = '';
      const result = await engine.generateStreaming(prompt, {
        maxTokens,
        temperature,
        topP,
        enableCoT,
        enableToolCalling,
        abortSignal: controller.signal,
        onToken: (tok, idx, latMs) => {
          accumulated += (accumulated ? ' ' : '') + tok;
          setGeneratedOutput(accumulated);
          setActiveTokenLive(tok);
          setCurrentLatencyLiveMs(Number(latMs.toFixed(2)));
        },
        onToolCall: (exec) => {
          setLastExecutedTools(prev => [...prev, exec]);
        }
      });

      setTelemetry(result.telemetry);
      setLastExecutedTools(result.telemetry.toolCallsExecuted || []);
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
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    {quantMode} Quantized
                  </span>
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
                  {MODEL_TIER_CONFIGS[selectedTier].name} • {ramStats.numHeads}-Head Attention • Tool Execution &amp; WGSL Compute Shaders
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
                <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">Tool Execution</span>
              </div>
              <div className="font-mono text-base font-black text-emerald-300">
                {enableToolCalling ? '6 Tools Ready' : 'Disabled'}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Client-side function calls
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
            onClick={() => setActiveTab('tools-lab')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'tools-lab'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4 text-emerald-400" />
            <span>LLM Tools &amp; Actions</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-400/20 text-emerald-300 font-mono">
              6
            </span>
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

      {/* TAB 1: NEURAL GENERATOR (Featuring Vertical Slider + Tool Calling) */}
      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* VERTICAL SLIDER CONTROLS (Left Column) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Model Capacity Slider</span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800 flex items-center gap-1">
                  <span>🔓 Uncensored</span>
                </span>
              </div>

              {/* Interactive Vertical Slider Component */}
              <div className="flex gap-4 items-stretch py-2">
                {/* Vertical Range Input */}
                <div className="flex flex-col items-center justify-between relative py-1">
                  <input
                    type="range"
                    min="0"
                    max="7"
                    step="1"
                    value={currentSliderIndex}
                    onChange={handleVerticalSliderChange}
                    className="h-72 w-3 accent-indigo-600 cursor-pointer appearance-none bg-slate-200 dark:bg-slate-700 rounded-lg"
                    style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                    aria-label="Vertical Model Capacity Slider"
                  />
                  <span className="text-[9px] font-mono text-slate-400 font-bold mt-2">Scale</span>
                </div>

                {/* Vertical Stepped Ticks & Level Cards */}
                <div className="flex-1 flex flex-col justify-between space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
                  {[7, 6, 5, 4, 3, 2, 1, 0].map((idx) => {
                    const tierKey = VERTICAL_SLIDER_TIERS[idx];
                    const t = MODEL_TIER_CONFIGS[tierKey];
                    const isSelected = selectedTier === tierKey;
                    return (
                      <div
                        key={tierKey}
                        onClick={() => handleSelectTier(tierKey)}
                        className={`p-1.5 px-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 shadow-sm ring-1 ring-indigo-500/50'
                            : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-black ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                            {t.shortLabel}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{t.ramEstMb}MB</span>
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center justify-between mt-0.5">
                          <span>{t.numHeads} Head{t.numHeads > 1 ? 's' : ''}</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{t.recommendedQuant}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quantization Mode Selector (Q4_K, Q6_K, FP16, FP32) */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantization Weight Mode</span>
                  <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">{quantMode}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
                  {(['Q4_K', 'Q6_K', 'FP16', 'FP32'] as QuantizationMode[]).map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSelectQuantization(q)}
                      className={`px-2 py-1.5 rounded-lg border transition-all text-center ${
                        quantMode === q
                          ? 'border-indigo-500 bg-indigo-600 text-white shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{q}</span>
                      <span className="block text-[9px] font-normal opacity-80">
                        {q === 'Q4_K' ? '0.5B (Fast)' : q === 'Q6_K' ? '0.75B (Balanced)' : q === 'FP16' ? '2B (High)' : '4B (Max)'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tool Calling & CoT Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Enable Tool Calling
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Auto-invokes math &amp; conversions
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableToolCalling}
                    onChange={(e) => setEnableToolCalling(e.target.checked)}
                    className="w-4 h-4 accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Chain-of-Thought (CoT)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Step-by-step &lt;think&gt; tokens
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableCoT}
                    onChange={(e) => setEnableCoT(e.target.checked)}
                    className="w-4 h-4 accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center gap-2">
                  <span className="text-sm">🔓</span>
                  <div>
                    <span className="font-bold block">100% Uncensored &amp; Private</span>
                    <span className="text-[10px] text-emerald-400/80">Zero corporate moderation, runs entirely in browser RAM.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN PROMPT, TERMINAL & TOOL CALL TRACE (Right 3 Columns) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Model Download & RAM Load Card with Live Progress Bar (Prevents Unnecessary Lag & Downloads) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-500/30 shadow-md space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">{MODEL_TIER_CONFIGS[selectedTier].name}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      isModelLoaded
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-amber-950/80 text-amber-300 border-amber-800'
                    }`}>
                      {isModelLoaded ? '🟢 Active in RAM' : '⚪ Standby (0 MB Downloaded)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    RAM Size: <span className="font-mono text-indigo-400 font-bold">{MODEL_TIER_CONFIGS[selectedTier].ramEstMb} MB</span> • Mode: <span className="font-mono text-emerald-400 font-bold">{quantMode}</span> • Heads: <span className="font-mono text-slate-300 font-bold">{MODEL_TIER_CONFIGS[selectedTier].numHeads}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!isModelLoaded ? (
                    <button
                      onClick={handleDownloadAndLoadModel}
                      disabled={isModelLoading}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 disabled:opacity-50 text-white font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isModelLoading ? 'Downloading & Loading...' : `Download & Load (${MODEL_TIER_CONFIGS[selectedTier].ramEstMb} MB)`}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleUnloadModel}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 text-slate-300 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Unload / Free RAM</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar when Loading */}
              {isModelLoading && (
                <div className="space-y-1.5 pt-1">
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 h-full rounded-full transition-all duration-200"
                      style={{ width: `${modelLoadProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-indigo-400 font-bold animate-pulse">{modelLoadStatus}</span>
                    <span className="text-emerald-400 font-bold">{modelLoadProgress}%</span>
                  </div>
                </div>
              )}

              {!isModelLoaded && !isModelLoading && (
                <p className="text-[10px] text-slate-400 italic">
                  💡 Weights are kept on standby so your browser doesn't download or allocate RAM unnecessarily. Click "Download & Load" when ready for sub-millisecond inference.
                </p>
              )}
            </div>

            {/* Prompt Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Neural Prompt &amp; Tool Trigger</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">{prompt.length} chars</span>
                </div>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask any question or request a calculation (e.g. 'Calculate 145 * 28 + sqrt(144)', 'Convert 120 km to miles')..."
                rows={3}
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-none"
              />

              {/* Quick Presets Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
                {PROMPT_PRESETS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(p.text)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-slate-50 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 shrink-0 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Terminal className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Sub-millisecond inference in browser RAM ({quantMode})</span>
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

            {/* Live Executed Tool Trace Callouts */}
            {lastExecutedTools.length > 0 && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                      Client-Side Tool Call Executed
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400">Zero Server Latency</span>
                </div>
                {lastExecutedTools.map((t) => (
                  <div key={t.id} className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/20 space-y-1">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-bold text-emerald-300">{t.displayName} ({t.toolName})</span>
                      <span className="text-[10px] text-slate-400">{t.executionTimeMs} ms</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Arguments: <span className="text-white">{JSON.stringify(t.args)}</span>
                    </div>
                    <div className="text-xs text-emerald-300 font-bold pt-0.5">
                      Result: <span className="text-white">{t.result}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

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
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-300">
                    {MODEL_TIER_CONFIGS[selectedTier].shortLabel}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStreamViewMode(prev => prev === 'formatted' ? 'raw' : 'formatted')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 border transition-all ${
                      streamViewMode === 'formatted'
                        ? 'bg-indigo-900/40 text-indigo-300 border-indigo-700/50 hover:bg-indigo-900/60'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                    title={streamViewMode === 'formatted' ? 'Switch to Raw Monospace Stream' : 'Switch to Formatted Markdown View'}
                  >
                    {streamViewMode === 'formatted' ? <Eye className="w-3 h-3 text-indigo-400" /> : <Terminal className="w-3 h-3 text-slate-400" />}
                    <span>{streamViewMode === 'formatted' ? 'Formatted' : 'Raw'}</span>
                  </button>
                  {generatedOutput && (
                    <QuickCopy text={generatedOutput} label="Copy Output" />
                  )}
                </div>
              </div>

              {/* Streaming Content */}
              <div className="min-h-[160px] max-h-[380px] overflow-y-auto p-3 text-sm leading-relaxed select-text">
                {generatedOutput ? (
                  streamViewMode === 'formatted' ? (
                    <MarkdownRenderer content={generatedOutput} isStreaming={isGenerating} />
                  ) : (
                    <div className="font-mono text-xs whitespace-pre-wrap text-slate-200">
                      <span className="text-indigo-300 font-bold">{'> '}</span>
                      {generatedOutput}
                      {isGenerating && (
                        <span className="inline-block w-2 h-4 ml-1 bg-indigo-400 animate-pulse align-middle" />
                      )}
                    </div>
                  )
                ) : (
                  <div className="text-slate-500 italic py-10 text-center font-mono text-xs">
                    Select a model capacity tier on the vertical slider and click "Execute In-RAM" above.
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

      {/* TAB 2: LLM TOOLS & ACTIONS LAB */}
      {activeTab === 'tools-lab' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-emerald-500" />
                  Client-Side LLM Function Calling Tools
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  The in-RAM LLM can autonomously invoke these utilities with arguments and receive verified outputs.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                100% Client-Side • 0ms Latency
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(LLM_AVAILABLE_TOOLS).map((tool) => (
                <div
                  key={tool.name}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-indigo-500" />
                      {tool.displayName}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {tool.name}()
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Params: {tool.parameters.map(p => p.name).join(', ') || 'None'}</span>
                    <button
                      onClick={() => {
                        setPrompt(`Use tool ${tool.name} to demonstrate its capability.`);
                        setActiveTab('generator');
                      }}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      Try Prompt &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: IN-RAM VECTOR MEMORY (RAG) */}
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
                      <option value="code">Code &amp; Syntax</option>
                      <option value="architecture">System Architecture</option>
                      <option value="science">Science &amp; Logic</option>
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

      {/* TAB 4: WEBGPU HARDWARE LAB */}
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
                    <option value="128">128 x 128 Tensor (0.06 MB)</option>
                    <option value="256">256 x 256 Tensor (0.25 MB)</option>
                    <option value="512">512 x 512 Tensor (1.00 MB)</option>
                    <option value="1024">1024 x 1024 Tensor [Discrete GPU 4.0 MB]</option>
                    <option value="2048">2048 x 2048 Tensor [RTX Extreme 16.0 MB]</option>
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
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
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
                      <span className="font-bold text-rose-300 text-sm mt-0.5 block">
                        {benchResult.gflops >= 1000 ? (
                          <>
                            <span className="text-emerald-300 font-black">{(benchResult.gflops / 1000).toFixed(2)} TFLOPS</span>
                            <span className="text-[10px] text-slate-400 ml-1">({benchResult.gflops} GFLOPS)</span>
                          </>
                        ) : (
                          <span>{benchResult.gflops} GFLOPS</span>
                        )}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-slate-400 block">Benchmark Timestamp</span>
                      <span className="font-bold text-slate-300 mt-0.5 block">{benchResult.timestamp}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-1">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span>⚡</span> L1 Shared Workgroup Tiled Memory (16x16 Tiles • Sub-millisecond Execution)
                    </span>
                    <span>Tensor Size: {benchResult.matrixSize}x{benchResult.matrixSize}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: IN-RAM FINE-TUNER */}
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

      {/* TAB 6: RAM MATRIX INSPECTOR */}
      {activeTab === 'inspector' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Resident Memory Buffer Allocations</h3>
                <p className="text-xs text-slate-500">Live breakdown of typed array allocations currently held in browser RAM</p>
              </div>

              <div className="flex items-center gap-2">
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
                    <td className="py-2.5 text-indigo-600 dark:text-indigo-400">Float32Array / Uint8Array</td>
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
                    <td className="py-3 text-slate-500">{ramStats.parameterCount.toLocaleString()} params ({ramStats.quantization})</td>
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
