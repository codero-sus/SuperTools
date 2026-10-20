// Hardware-Adaptive AI Resource & Performance Scaling Engine
// Dynamically scales AI models, canvas bounds, neural precision & worker pools from Level 1 (2GB) up to Level 10 (256GB RAM)

export interface HardwareTier {
  level: number;
  name: string;
  shortLabel: string;
  targetRamGb: number;
  maxRamBudgetMb: number;
  maxCanvasDim: number;
  workerThreads: number;
  ocrModelAccuracy: 'Fast Quantized' | 'Standard LSTM' | 'High-Precision LSTM' | 'Deep Float32 LSTM' | 'Studio Neural Ensemble' | 'Extreme Ultra-HD Ensemble';
  superResFactor: 2 | 4 | 8;
  kMeansIterations: number;
  saliencyPasses: number;
  recommendedFor: string;
  color: string;
}

export const HARDWARE_TIERS: HardwareTier[] = [
  {
    level: 1,
    name: 'Level 1: Ultra-Eco Legacy',
    shortLabel: 'Lvl 1 [2 GB]',
    targetRamGb: 2,
    maxRamBudgetMb: 25,
    maxCanvasDim: 1024,
    workerThreads: 1,
    ocrModelAccuracy: 'Fast Quantized',
    superResFactor: 2,
    kMeansIterations: 3,
    saliencyPasses: 1,
    recommendedFor: 'Older netbooks, thin clients & low-spec virtual machines',
    color: 'emerald'
  },
  {
    level: 2,
    name: 'Level 2: Budget Everyday',
    shortLabel: 'Lvl 2 [4 GB]',
    targetRamGb: 4,
    maxRamBudgetMb: 50,
    maxCanvasDim: 1400,
    workerThreads: 1,
    ocrModelAccuracy: 'Standard LSTM',
    superResFactor: 2,
    kMeansIterations: 5,
    saliencyPasses: 2,
    recommendedFor: 'Budget laptops, Chromebooks & entry-level machines',
    color: 'emerald'
  },
  {
    level: 3,
    name: 'Level 3: Balanced Entry',
    shortLabel: 'Lvl 3 [6 GB]',
    targetRamGb: 6,
    maxRamBudgetMb: 80,
    maxCanvasDim: 1800,
    workerThreads: 2,
    ocrModelAccuracy: 'High-Precision LSTM',
    superResFactor: 2,
    kMeansIterations: 6,
    saliencyPasses: 2,
    recommendedFor: 'Entry desktop PCs, tablets & shared office machines',
    color: 'teal'
  },
  {
    level: 4,
    name: 'Level 4: Standard Modern',
    shortLabel: 'Lvl 4 [8 GB]',
    targetRamGb: 8,
    maxRamBudgetMb: 150,
    maxCanvasDim: 2400,
    workerThreads: 2,
    ocrModelAccuracy: 'High-Precision LSTM',
    superResFactor: 4,
    kMeansIterations: 8,
    saliencyPasses: 3,
    recommendedFor: 'Standard modern laptops, ultrabooks & office PCs',
    color: 'cyan'
  },
  {
    level: 5,
    name: 'Level 5: Performance Gaming',
    shortLabel: 'Lvl 5 [16 GB]',
    targetRamGb: 16,
    maxRamBudgetMb: 300,
    maxCanvasDim: 3200,
    workerThreads: 4,
    ocrModelAccuracy: 'Deep Float32 LSTM',
    superResFactor: 4,
    kMeansIterations: 12,
    saliencyPasses: 4,
    recommendedFor: 'Gaming rigs, developer laptops & creator setups',
    color: 'blue'
  },
  {
    level: 6,
    name: 'Level 6: Pro Workstation',
    shortLabel: 'Lvl 6 [32 GB]',
    targetRamGb: 32,
    maxRamBudgetMb: 600,
    maxCanvasDim: 4096,
    workerThreads: 6,
    ocrModelAccuracy: 'Deep Float32 LSTM',
    superResFactor: 4,
    kMeansIterations: 16,
    saliencyPasses: 5,
    recommendedFor: 'Professional video editors, 3D artists & engineers',
    color: 'indigo'
  },
  {
    level: 7,
    name: 'Level 7: High-End Creator Rig',
    shortLabel: 'Lvl 7 [64 GB]',
    targetRamGb: 64,
    maxRamBudgetMb: 1200,
    maxCanvasDim: 5120,
    workerThreads: 8,
    ocrModelAccuracy: 'Studio Neural Ensemble',
    superResFactor: 4,
    kMeansIterations: 20,
    saliencyPasses: 6,
    recommendedFor: '5K Retina workstations, media production houses & heavy multitasking',
    color: 'violet'
  },
  {
    level: 8,
    name: 'Level 8: Studio Enterprise',
    shortLabel: 'Lvl 8 [128 GB]',
    targetRamGb: 128,
    maxRamBudgetMb: 2500,
    maxCanvasDim: 6400,
    workerThreads: 12,
    ocrModelAccuracy: 'Studio Neural Ensemble',
    superResFactor: 8,
    kMeansIterations: 25,
    saliencyPasses: 8,
    recommendedFor: 'Enterprise workstations, animation studios & batch workloads',
    color: 'purple'
  },
  {
    level: 9,
    name: 'Level 9: Master Production',
    shortLabel: 'Lvl 9 [192 GB]',
    targetRamGb: 192,
    maxRamBudgetMb: 5000,
    maxCanvasDim: 7680,
    workerThreads: 16,
    ocrModelAccuracy: 'Extreme Ultra-HD Ensemble',
    superResFactor: 8,
    kMeansIterations: 35,
    saliencyPasses: 10,
    recommendedFor: '8K post-production, scientific computing & heavy cluster nodes',
    color: 'fuchsia'
  },
  {
    level: 10,
    name: 'Level 10: Extreme Beast Rig',
    shortLabel: 'Lvl 10 [256 GB]',
    targetRamGb: 256,
    maxRamBudgetMb: 8000,
    maxCanvasDim: 8192,
    workerThreads: 24,
    ocrModelAccuracy: 'Extreme Ultra-HD Ensemble',
    superResFactor: 8,
    kMeansIterations: 50,
    saliencyPasses: 12,
    recommendedFor: 'Unconstrained 256GB server workstations, maximum AI fidelity',
    color: 'rose'
  }
];

export function detectSystemHardware(): {
  detectedLevel: number;
  detectedRamGb: number;
  detectedCores: number;
  isAutoDetected: boolean;
} {
  let ram = 6; // default fallback
  if (typeof navigator !== 'undefined' && (navigator as any).deviceMemory) {
    ram = Number((navigator as any).deviceMemory);
  }

  let cores = 4;
  if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) {
    cores = navigator.hardwareConcurrency;
  }

  let detectedLevel = 3;
  if (ram <= 2) detectedLevel = 1;
  else if (ram <= 4) detectedLevel = 2;
  else if (ram <= 6) detectedLevel = 3;
  else if (ram <= 8) detectedLevel = 4;
  else if (ram <= 16) detectedLevel = 5;
  else if (ram <= 32) detectedLevel = 6;
  else if (ram <= 64) detectedLevel = 7;
  else if (ram <= 128) detectedLevel = 8;
  else if (ram <= 192) detectedLevel = 9;
  else detectedLevel = 10;

  return {
    detectedLevel,
    detectedRamGb: ram,
    detectedCores: cores,
    isAutoDetected: Boolean((navigator as any)?.deviceMemory)
  };
}

export function getTierByLevel(level: number): HardwareTier {
  const found = HARDWARE_TIERS.find(t => t.level === level);
  return found || HARDWARE_TIERS[2]; // Default to Level 3 (6GB)
}
