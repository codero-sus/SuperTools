/**
 * Real In-Browser WebGPU LLM Engine using @mlc-ai/web-llm
 * 100% Client-Side Neural Inference • Real Model Weights • Zero Server Backend • Zero Heuristics
 */

import { CreateMLCEngine, MLCEngine, InitProgressReport } from '@mlc-ai/web-llm';

export interface WebLlmModelInfo {
  id: string;
  name: string;
  sizeMb: number;
  paramSize?: string;
  quant?: string;
  description: string;
  isUncensored?: boolean;
}

export const SUPPORTED_WEBLLM_MODELS: WebLlmModelInfo[] = [
  // Sub-1B Models (Fastest • Ultra-Low Memory)
  {
    id: 'SmolLM2-360M-Instruct-q4f16_1-MLC',
    name: 'SmolLM2 360M Q4',
    sizeMb: 376,
    paramSize: '0.36B',
    quant: 'Q4_F16',
    description: 'Ultra-compact, sub-second boot, runs smoothly on any entry-level iGPU or laptop.'
  },
  {
    id: 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC',
    name: 'Qwen 2.5 0.5B Q4',
    sizeMb: 945,
    paramSize: '0.5B',
    quant: 'Q4_F16',
    description: 'High intelligence per parameter, excellent math, logic, and general knowledge.'
  },
  {
    id: 'Qwen2.5-Coder-0.5B-Instruct-q4f16_1-MLC',
    name: 'Qwen 2.5 Coder 0.5B Q4',
    sizeMb: 945,
    paramSize: '0.5B',
    quant: 'Q4_F16',
    description: 'Specialized 0.5B model for code generation, bug hunting, and fast scripting.'
  },

  // 1B - 2B Models (Compact • Mobile & Laptop Friendly)
  {
    id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    name: 'Meta Llama 3.2 1B Q4',
    sizeMb: 879,
    paramSize: '1.2B',
    quant: 'Q4_F16',
    description: 'Meta flagship compact LLM with deep multilingual and reasoning capabilities.'
  },
  {
    id: 'TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC',
    name: 'TinyLlama 1.1B Q4',
    sizeMb: 697,
    paramSize: '1.1B',
    quant: 'Q4_F16',
    description: 'Trained on 3 trillion tokens, ultra-fast generation with light memory footprint.'
  },
  {
    id: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
    name: 'Qwen 2.5 1.5B Q4',
    sizeMb: 1630,
    paramSize: '1.5B',
    quant: 'Q4_F16',
    description: 'Well-rounded 1.5B model with competitive benchmarks against larger architectures.'
  },
  {
    id: 'Qwen2.5-Coder-1.5B-Instruct-q4f16_1-MLC',
    name: 'Qwen 2.5 Coder 1.5B Q4',
    sizeMb: 1630,
    paramSize: '1.5B',
    quant: 'Q4_F16',
    description: 'High-speed code synthesis, refactoring, and multi-file code auditing.'
  },
  {
    id: 'SmolLM2-1.7B-Instruct-q4f16_1-MLC',
    name: 'SmolLM2 1.7B Q4',
    sizeMb: 1774,
    paramSize: '1.7B',
    quant: 'Q4_F16',
    description: 'HuggingFace flagship small model trained on high-quality synthetic educational datasets.'
  },
  {
    id: 'gemma-2-2b-it-q4f16_1-MLC',
    name: 'Google Gemma 2 2B Q4',
    sizeMb: 1895,
    paramSize: '2.6B',
    quant: 'Q4_F16',
    description: 'Google Gemma 2 architecture with distilled knowledge from larger Gemini models.'
  },

  // 3B - 4B Models (Balanced Workhorses)
  {
    id: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
    name: 'Meta Llama 3.2 3B Q4',
    sizeMb: 2264,
    paramSize: '3.2B',
    quant: 'Q4_F16',
    description: 'Meta 3B model offering state-of-the-art reasoning, summarization, and tool use.'
  },
  {
    id: 'Hermes-3-Llama-3.2-3B-q4f16_1-MLC',
    name: 'Hermes 3 Llama 3.2 3B Q4 (Uncensored)',
    sizeMb: 2264,
    paramSize: '3.2B',
    quant: 'Q4_F16',
    description: 'Uncensored steering by Nous Research, zero artificial guardrails or moralizing.',
    isUncensored: true
  },
  {
    id: 'Qwen2.5-3B-Instruct-q4f16_1-MLC',
    name: 'Qwen 2.5 3B Q4',
    sizeMb: 2505,
    paramSize: '3.1B',
    quant: 'Q4_F16',
    description: 'High-throughput 3B parameter model with math and coding depth.'
  },
  {
    id: 'Qwen2.5-Coder-3B-Instruct-q4f16_1-MLC',
    name: 'Qwen 2.5 Coder 3B Q4',
    sizeMb: 2505,
    paramSize: '3.1B',
    quant: 'Q4_F16',
    description: 'Dedicated 3B coding specialist for complex software development and debugging.'
  },
  {
    id: 'Phi-3.5-mini-instruct-q4f16_1-MLC',
    name: 'Microsoft Phi 3.5 Mini 3.8B Q4',
    sizeMb: 3672,
    paramSize: '3.8B',
    quant: 'Q4_F16',
    description: 'Microsoft state-of-the-art small language model with 128k context support.'
  },
  {
    id: 'Phi-4-mini-instruct-q4f16_1-MLC',
    name: 'Microsoft Phi 4 Mini 3.8B Q4',
    sizeMb: 3438,
    paramSize: '3.8B',
    quant: 'Q4_F16',
    description: 'Next-gen compact reasoning model with synthetic textbook pretraining.'
  },
  {
    id: 'Ministral-3-3B-Instruct-2512-BF16-q4f16_1-MLC',
    name: 'Mistral Ministral 3B Q4',
    sizeMb: 2864,
    paramSize: '3.0B',
    quant: 'Q4_F16',
    description: 'Mistral AI edge-optimized model for low-latency reasoning and function calling.'
  },

  // 7B - 8B Models (Studio Grade • Deep Reasoning)
  {
    id: 'Mistral-7B-Instruct-v0.3-q4f16_1-MLC',
    name: 'Mistral 7B Instruct v0.3 Q4',
    sizeMb: 4573,
    paramSize: '7.2B',
    quant: 'Q4_F16',
    description: 'Mistral AI flagship 7B with native function calling and extensive vocabulary.'
  },
  {
    id: 'DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC',
    name: 'DeepSeek-R1 Distill Qwen 7B Q4',
    sizeMb: 5107,
    paramSize: '7.6B',
    quant: 'Q4_F16',
    description: 'DeepSeek-R1 reasoning distillation with extensive Chain-of-Thought thinking proofs.'
  },
  {
    id: 'Qwen2.5-7B-Instruct-q4f16_1-MLC',
    name: 'Qwen 2.5 7B Q4',
    sizeMb: 5107,
    paramSize: '7.6B',
    quant: 'Q4_F16',
    description: 'Alibaba flagship 7B with top-tier coding, mathematics, and multilingual support.'
  },
  {
    id: 'Qwen2.5-Coder-7B-Instruct-q4f16_1-MLC',
    name: 'Qwen 2.5 Coder 7B Q4',
    sizeMb: 5107,
    paramSize: '7.6B',
    quant: 'Q4_F16',
    description: 'Top-ranking 7B open code model capable of full-stack software development.'
  },
  {
    id: 'Hermes-2-Pro-Mistral-7B-q4f16_1-MLC',
    name: 'Hermes 2 Pro Mistral 7B Q4 (Uncensored)',
    sizeMb: 4033,
    paramSize: '7.0B',
    quant: 'Q4_F16',
    description: 'Uncensored 7B model tuned for advanced JSON structured outputs and tool calls.',
    isUncensored: true
  },
  {
    id: 'OpenHermes-2.5-Mistral-7B-q4f16_1-MLC',
    name: 'OpenHermes 2.5 Mistral 7B Q4 (Uncensored)',
    sizeMb: 4573,
    paramSize: '7.0B',
    quant: 'Q4_F16',
    description: 'Premier uncensored dataset fine-tune by Teknium with exceptional prose.',
    isUncensored: true
  },
  {
    id: 'Llama-3.1-8B-Instruct-q4f16_1-MLC',
    name: 'Meta Llama 3.1 8B Q4',
    sizeMb: 5001,
    paramSize: '8.0B',
    quant: 'Q4_F16',
    description: 'Meta open weights flagship 8B with 128k context, coding, and logical reasoning.'
  },
  {
    id: 'DeepSeek-R1-Distill-Llama-8B-q4f16_1-MLC',
    name: 'DeepSeek-R1 Distill Llama 8B Q4',
    sizeMb: 5001,
    paramSize: '8.0B',
    quant: 'Q4_F16',
    description: 'Llama 3.1 8B base fine-tuned on DeepSeek-R1 chain-of-thought mathematical reasoning.'
  },
  {
    id: 'Hermes-3-Llama-3.1-8B-q4f16_1-MLC',
    name: 'Hermes 3 Llama 3.1 8B Q4 (Uncensored)',
    sizeMb: 4876,
    paramSize: '8.0B',
    quant: 'Q4_F16',
    description: 'Nous Research 8B flagship uncensored model for unrestricted technical analysis.',
    isUncensored: true
  },

  // 9B - 12B+ Models (Extreme Tier • Heavyweight Flagships)
  {
    id: 'gemma-2-9b-it-q4f16_1-MLC',
    name: 'Google Gemma 2 9B Q4',
    sizeMb: 6422,
    paramSize: '9.2B',
    quant: 'Q4_F16',
    description: 'Google 9B dense architecture outperforming many 20B+ models on reasoning.'
  },
  {
    id: 'Qwen3.5-9B-q4f16_1-MLC',
    name: 'Qwen 3.5 9B Q4',
    sizeMb: 6433,
    paramSize: '9.0B',
    quant: 'Q4_F16',
    description: 'Next-generation 9B model with expanded multi-head attention and deep context.'
  },
  {
    id: 'Llama-2-13b-chat-hf-q4f16_1-MLC',
    name: 'Llama 2 13B / 12B Tier Flagship Q4',
    sizeMb: 11814,
    paramSize: '13.0B',
    quant: 'Q4_F16',
    description: 'Flagship 12B-13B parameter heavy model for discrete GPUs with 8GB+ VRAM.'
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
