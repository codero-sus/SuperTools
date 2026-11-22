/**
 * Unified Live Client-Side Neural AI Inference Engine
 * 100% Free • Real Neural Network Execution • Zero Heuristics • Zero Server Backend Required
 */

import { webLlmManager } from './webLlmEngine';
import { getInRamNeuralEngine } from './inRamNeuralAi';

export interface LiveAiInferenceOptions {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  preferInRam?: boolean;
  onChunk?: (chunk: string) => void;
  signal?: AbortSignal;
}

export async function runLiveAiInference(options: LiveAiInferenceOptions): Promise<string> {
  const {
    prompt,
    systemPrompt = 'You are a helpful, expert AI assistant. Provide direct, accurate, and comprehensive responses.',
    model = 'deepseek-r1',
    temperature = 0.7,
    preferInRam = false,
    onChunk,
    signal
  } = options;

  // In-RAM Neural Streaming (Zero Network Latency, 100% In-Browser RAM, WebGPU Accelerated if available)
  if (preferInRam) {
    try {
      const ramEngine = getInRamNeuralEngine();
      ramEngine.setUseWebGpu(true);
      let accumulated = '';
      const result = await ramEngine.generateStreaming(prompt, {
        onToken: (tok) => {
          accumulated += (accumulated ? ' ' : '') + tok;
          onChunk?.(accumulated);
        },
        abortSignal: signal
      });
      if (result.text) {
        return result.text;
      }
    } catch (err) {
      // Fall through to network tiers
    }
  }

  // Tier 1: Direct Pollinations POST Endpoint
  try {
    const postRes = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        model,
        temperature,
        seed: Math.floor(Math.random() * 100000)
      }),
      signal: signal || AbortSignal.timeout(12000)
    });

    if (postRes.ok) {
      const raw = await postRes.text();
      if (raw && raw.trim() && !raw.includes('<!DOCTYPE html>') && !raw.includes('<html')) {
        onChunk?.(raw);
        return raw;
      }
    }
  } catch (err) {
    // Proceed to Tier 2
  }

  // Tier 2: Direct Pollinations GET Endpoint
  try {
    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=${encodeURIComponent(model)}&system=${encodeURIComponent(systemPrompt)}&seed=${Math.floor(Math.random() * 100000)}`;
    const getRes = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'text/plain, application/json, */*' },
      signal: signal || AbortSignal.timeout(12000)
    });

    if (getRes.ok) {
      const raw = await getRes.text();
      if (raw && raw.trim() && !raw.includes('<!DOCTYPE html>') && !raw.includes('<html')) {
        onChunk?.(raw);
        return raw;
      }
    }
  } catch (err) {
    // Proceed to Tier 3
  }

  // Tier 3: In-Browser Puter.js Free AI Bridge
  try {
    if (typeof window !== 'undefined') {
      const w = window as any;
      if (!w.puter) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://js.puter.com/v2/';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Puter script failed to load'));
          document.head.appendChild(script);
        });
      }

      if (w.puter?.ai?.chat) {
        const puterModel = model.includes('deepseek') ? 'deepseek-chat' : 'claude-3-5-sonnet';
        const puterRes = await w.puter.ai.chat(
          [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          { model: puterModel }
        );

        const content = typeof puterRes === 'string' ? puterRes : puterRes?.message?.content || puterRes?.text;
        if (content && content.trim()) {
          onChunk?.(content);
          return content;
        }
      }
    }
  } catch (err) {
    // Proceed to Tier 4
  }

  // Tier 4: Local WebGPU Model if ready
  if (webLlmManager.isModelReady()) {
    try {
      let accumulated = '';
      await webLlmManager.streamChat(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        {
          signal,
          onChunk: (c) => {
            accumulated += c;
            onChunk?.(c);
          }
        }
      );
      if (accumulated.trim()) {
        return accumulated;
      }
    } catch (err) {
      // Fall through to error notice
    }
  }

  // Tier 5: Direct In-RAM Neural Vector Engine (Offline Real Neural Execution)
  try {
    const ramEngine = getInRamNeuralEngine();
    let accumulated = '';
    const result = await ramEngine.generateStreaming(prompt, {
      onToken: (tok) => {
        accumulated += (accumulated ? ' ' : '') + tok;
        onChunk?.(accumulated);
      }
    });
    if (result.text) {
      return result.text;
    }
  } catch (err) {
    // Fallback
  }

  throw new Error('All neural inference backends failed. Please check network connection or start local Ollama.');
}
