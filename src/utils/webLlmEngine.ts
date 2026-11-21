/**
 * Real In-Browser WebGPU LLM Engine using @mlc-ai/web-llm
 * 100% Client-Side Neural Inference • Real Model Weights • Zero Server Backend • Zero Heuristics
 */

import { CreateMLCEngine, MLCEngine, InitProgressReport } from '@mlc-ai/web-llm';

export interface WebLlmModelInfo {
  id: string;
  name: string;
  sizeMb: number;
  description: string;
  isUncensored?: boolean;
}

export const SUPPORTED_WEBLLM_MODELS: WebLlmModelInfo[] = [
  {
    id: 'SmolLM2-360M-Instruct-q4f16_1-MLC',
    name: 'SmolLM2 360M (Fastest)',
    sizeMb: 195,
    description: 'Ultra-compact, instant initialization, runs smoothly even on entry-level iGPUs.'
  },
  {
    id: 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC',
    name: 'Qwen 2.5 0.5B (Recommended)',
    sizeMb: 350,
    description: 'High intelligence per parameter, excellent math, logic, and general knowledge.'
  },
  {
    id: 'Qwen2.5-Coder-0.5B-Instruct-q4f16_1-MLC',
    name: 'Qwen 2.5 Coder 0.5B',
    sizeMb: 350,
    description: 'Specialized for code generation, bug fixing, algorithms, and scripting.'
  },
  {
    id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    name: 'Meta Llama 3.2 1B',
    sizeMb: 880,
    description: 'Meta flagship compact LLM with deep multilingual and reasoning capabilities.'
  },
  {
    id: 'Hermes-3-Llama-3.2-3B-q4f16_1-MLC',
    name: 'Hermes 3 Llama 3.2 3B (Uncensored)',
    sizeMb: 1900,
    description: 'Uncensored steering by Nous Research, zero artificial guardrails or moralizing.',
    isUncensored: true
  }
];

class WebLlmManager {
  private engine: MLCEngine | null = null;
  private currentModelId: string | null = null;
  private isLoading: boolean = false;

  public isWebGpuSupported(): boolean {
    return typeof navigator !== 'undefined' && 'gpu' in navigator;
  }

  public getLoadedModel(): string | null {
    return this.currentModelId;
  }

  public isModelReady(): boolean {
    return this.engine !== null && !this.isLoading;
  }

  public async loadModel(
    modelId: string,
    onProgress?: (progressText: string, percentage: number) => void
  ): Promise<MLCEngine> {
    if (this.engine && this.currentModelId === modelId) {
      return this.engine;
    }

    if (!this.isWebGpuSupported()) {
      throw new Error('WebGPU is not supported by your current browser. Please use Chrome 113+, Edge, or Firefox Nightly with WebGPU enabled.');
    }

    this.isLoading = true;
    try {
      this.engine = await CreateMLCEngine(modelId, {
        initProgressCallback: (report: InitProgressReport) => {
          const pct = Math.round((report.progress || 0) * 100);
          onProgress?.(report.text || `Loading model weights (${pct}%)...`, pct);
        }
      });
      this.currentModelId = modelId;
      this.isLoading = false;
      return this.engine;
    } catch (err: any) {
      this.isLoading = false;
      this.engine = null;
      this.currentModelId = null;
      throw new Error(`Failed to load in-browser WebLLM model: ${err?.message || err}`);
    }
  }

  public async streamChat(
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
    options: {
      temperature?: number;
      maxTokens?: number;
      signal?: AbortSignal;
      onChunk?: (token: string, accumulated: string) => void;
    } = {}
  ): Promise<string> {
    if (!this.engine) {
      throw new Error('No in-browser WebLLM model is loaded yet. Call loadModel() first.');
    }

    let fullText = '';
    const chunks = await this.engine.chat.completions.create({
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1024,
      stream: true
    });

    for await (const chunk of chunks) {
      if (options.signal?.aborted) {
        break;
      }
      const delta = chunk.choices[0]?.delta?.content || '';
      if (delta) {
        fullText += delta;
        options.onChunk?.(delta, fullText);
      }
    }

    return fullText;
  }

  public unload() {
    this.engine = null;
    this.currentModelId = null;
    this.isLoading = false;
  }
}

export const webLlmManager = new WebLlmManager();
