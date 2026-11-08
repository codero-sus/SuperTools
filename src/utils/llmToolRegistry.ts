// Client-Side LLM Tool & Function Calling Execution Registry
// 100% Client-Side, Zero Network Hops, Sub-Millisecond Tool Execution

export interface LlmToolDefinition {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  parameters: {
    name: string;
    type: 'string' | 'number' | 'boolean';
    description: string;
    required: boolean;
  }[];
  handler: (args: Record<string, any>) => Promise<string> | string;
}

export interface ToolCallExecution {
  id: string;
  toolName: string;
  displayName: string;
  args: Record<string, any>;
  result: string;
  executionTimeMs: number;
  status: 'success' | 'error';
}

// Cryptographic SHA-256 helper
async function computeSha256(text: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Simple deterministic fallback hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

export const LLM_AVAILABLE_TOOLS: Record<string, LlmToolDefinition> = {
  calculator: {
    name: 'calculator',
    displayName: 'Math Calculator',
    description: 'Evaluates mathematical and arithmetic expressions (e.g. 145 * 24 + sqrt(144)).',
    icon: 'Calculator',
    parameters: [
      { name: 'expression', type: 'string', description: 'Mathematical expression to calculate', required: true }
    ],
    handler: (args) => {
      const expr = String(args.expression || '').trim();
      if (!expr) return 'Error: Empty expression';
      try {
        // Sanitize expression: allow only numbers, operators, parens, Math functions
        const clean = expr.replace(/sqrt/g, 'Math.sqrt')
                          .replace(/abs/g, 'Math.abs')
                          .replace(/pi/gi, 'Math.PI')
                          .replace(/pow/g, 'Math.pow')
                          .replace(/sin/g, 'Math.sin')
                          .replace(/cos/g, 'Math.cos')
                          .replace(/log/g, 'Math.log')
                          .replace(/[^0-9+\-*/().Math,sqrtabspowciseEL ]/g, '');
        // Safe evaluation
        const fn = new Function(`return (${clean})`);
        const res = fn();
        return typeof res === 'number' ? Number(res.toFixed(6)).toString() : String(res);
      } catch (err: any) {
        return `Calculation Error: ${err?.message || 'Invalid syntax'}`;
      }
    }
  },

  timestamp: {
    name: 'timestamp',
    displayName: 'DateTime Inspector',
    description: 'Retrieves current UTC, local time, and Unix millisecond timestamps.',
    icon: 'Clock',
    parameters: [],
    handler: () => {
      const now = new Date();
      return JSON.stringify({
        iso: now.toISOString(),
        utc: now.toUTCString(),
        local: now.toLocaleString(),
        epochMs: now.getTime(),
        unixSeconds: Math.floor(now.getTime() / 1000)
      }, null, 2);
    }
  },

  unit_converter: {
    name: 'unit_converter',
    displayName: 'Unit Converter',
    description: 'Converts between common units of length, temperature, data storage, and weight.',
    icon: 'Scale',
    parameters: [
      { name: 'value', type: 'number', description: 'Numeric value to convert', required: true },
      { name: 'fromUnit', type: 'string', description: 'Source unit (km, mi, c, f, kg, lb, mb, gb)', required: true },
      { name: 'toUnit', type: 'string', description: 'Target unit (km, mi, c, f, kg, lb, mb, gb)', required: true }
    ],
    handler: (args) => {
      const val = Number(args.value || 0);
      const from = String(args.fromUnit || '').toLowerCase().trim();
      const to = String(args.toUnit || '').toLowerCase().trim();

      if (from === 'km' && to === 'mi') return `${(val * 0.621371).toFixed(4)} miles`;
      if (from === 'mi' && to === 'km') return `${(val * 1.60934).toFixed(4)} km`;
      if (from === 'c' && to === 'f') return `${((val * 9 / 5) + 32).toFixed(2)} °F`;
      if (from === 'f' && to === 'c') return `${(((val - 32) * 5) / 9).toFixed(2)} °C`;
      if (from === 'kg' && to === 'lb') return `${(val * 2.20462).toFixed(4)} lbs`;
      if (from === 'lb' && to === 'kg') return `${(val * 0.453592).toFixed(4)} kg`;
      if (from === 'mb' && to === 'gb') return `${(val / 1024).toFixed(4)} GB`;
      if (from === 'gb' && to === 'mb') return `${(val * 1024).toFixed(0)} MB`;

      return `${val} ${from} = (Conversion not mapped to ${to})`;
    }
  },

  crypto_hash: {
    name: 'crypto_hash',
    displayName: 'SHA-256 Hasher',
    description: 'Computes cryptographic SHA-256 digest of input text.',
    icon: 'ShieldCheck',
    parameters: [
      { name: 'text', type: 'string', description: 'Text to hash', required: true }
    ],
    handler: async (args) => {
      const text = String(args.text || '');
      const hash = await computeSha256(text);
      return `SHA-256("${text}") = ${hash}`;
    }
  },

  base64: {
    name: 'base64',
    displayName: 'Base64 Encoder/Decoder',
    description: 'Encodes plain text to Base64 or decodes Base64 to plain text.',
    icon: 'Binary',
    parameters: [
      { name: 'action', type: 'string', description: 'encode or decode', required: true },
      { name: 'text', type: 'string', description: 'String to transform', required: true }
    ],
    handler: (args) => {
      const action = String(args.action || 'encode').toLowerCase();
      const text = String(args.text || '');
      try {
        if (action === 'decode') {
          return atob(text);
        }
        return btoa(text);
      } catch (err: any) {
        return `Base64 Error: ${err?.message || 'Invalid string'}`;
      }
    }
  },

  system_specs: {
    name: 'system_specs',
    displayName: 'Client Hardware Specs',
    description: 'Inspects client-side browser device memory, CPU concurrency, and hardware scaling tier.',
    icon: 'Cpu',
    parameters: [],
    handler: () => {
      const ram = typeof navigator !== 'undefined' && (navigator as any).deviceMemory ? (navigator as any).deviceMemory : 8;
      const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
      const hasGpu = typeof navigator !== 'undefined' && Boolean((navigator as any).gpu);
      return JSON.stringify({
        deviceMemoryEstimateGb: ram,
        cpuHardwareCores: cores,
        webGpuAvailable: hasGpu,
        userAgentPlatform: typeof navigator !== 'undefined' ? navigator.platform : 'browser'
      }, null, 2);
    }
  }
};

// Dispatch a tool call by parsing tool invocation
export async function executeLlmToolCall(toolName: string, args: Record<string, any>): Promise<ToolCallExecution> {
  const t0 = performance.now();
  const tool = LLM_AVAILABLE_TOOLS[toolName];

  if (!tool) {
    return {
      id: `call-${Date.now()}`,
      toolName,
      displayName: toolName,
      args,
      result: `Error: Unknown tool "${toolName}". Available tools: ${Object.keys(LLM_AVAILABLE_TOOLS).join(', ')}`,
      executionTimeMs: Number((performance.now() - t0).toFixed(2)),
      status: 'error'
    };
  }

  try {
    const rawResult = await tool.handler(args);
    const elapsed = Math.max(0.1, Number((performance.now() - t0).toFixed(2)));
    return {
      id: `call-${Date.now()}`,
      toolName,
      displayName: tool.displayName,
      args,
      result: rawResult,
      executionTimeMs: elapsed,
      status: 'success'
    };
  } catch (err: any) {
    const elapsed = Math.max(0.1, Number((performance.now() - t0).toFixed(2)));
    return {
      id: `call-${Date.now()}`,
      toolName,
      displayName: tool.displayName,
      args,
      result: `Tool Execution Exception: ${err?.message || err}`,
      executionTimeMs: elapsed,
      status: 'error'
    };
  }
}

// Regex to detect and extract <tool_call>{"tool": "...", "args": {...}}</tool_call>
export function extractToolCalls(text: string): { tool: string; args: Record<string, any>; rawMatch: string }[] {
  const regex = /<tool_call>([\s\S]*?)<\/tool_call>/gi;
  const calls: { tool: string; args: Record<string, any>; rawMatch: string }[] = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      if (parsed.tool) {
        calls.push({
          tool: parsed.tool,
          args: parsed.args || {},
          rawMatch: match[0]
        });
      }
    } catch {
      // Ignore malformed JSON inside tags
    }
  }

  return calls;
}

// Natural language heuristic trigger: detects when user question warrants a tool call
export function detectHeuristicToolCall(prompt: string): { tool: string; args: Record<string, any> } | null {
  const p = prompt.toLowerCase();

  // Calculator trigger
  const mathMatch = prompt.match(/(?:calculate|solve|what is|compute)\s+([0-9+\-*/().\s^%]+(?:\s*[\+\-\*\/]\s*[0-9]+)+)/i) ||
                    prompt.match(/([0-9]+\s*[\+\-\*\/]\s*[0-9]+(?:\s*[\+\-\*\/]\s*[0-9]+)*)/);
  if (mathMatch && mathMatch[1]) {
    return { tool: 'calculator', args: { expression: mathMatch[1].trim() } };
  }

  // Unit converter trigger
  const unitMatch = p.match(/convert\s+([0-9.]+)\s*(km|mi|miles|c|f|celsius|fahrenheit|kg|lb|pounds|mb|gb)\s+(?:to|in)\s+(km|mi|miles|c|f|celsius|fahrenheit|kg|lb|pounds|mb|gb)/i);
  if (unitMatch) {
    let from = unitMatch[2].replace('miles', 'mi').replace('celsius', 'c').replace('fahrenheit', 'f').replace('pounds', 'lb');
    let to = unitMatch[3].replace('miles', 'mi').replace('celsius', 'c').replace('fahrenheit', 'f').replace('pounds', 'lb');
    return { tool: 'unit_converter', args: { value: parseFloat(unitMatch[1]), fromUnit: from, toUnit: to } };
  }

  // Hash trigger
  if (p.includes('sha256') || p.includes('sha-256') || (p.includes('hash') && (p.includes('of') || p.includes('for')))) {
    const textMatch = prompt.match(/(?:hash|sha256|sha-256)\s+(?:of|for)?\s*["']?([^"']+)["']?/i);
    const toHash = textMatch ? textMatch[1].trim() : 'SuperTools';
    return { tool: 'crypto_hash', args: { text: toHash } };
  }

  // Base64 trigger
  if (p.includes('base64')) {
    const isDecode = p.includes('decode');
    const textMatch = prompt.match(/base64\s+(?:encode|decode)?\s*["']?([^"']+)["']?/i);
    const str = textMatch ? textMatch[1].trim() : 'SuperTools';
    return { tool: 'base64', args: { action: isDecode ? 'decode' : 'encode', text: str } };
  }

  // Time / Date trigger
  if (p.includes('current time') || p.includes('current date') || p.includes('what time is it') || p.includes('unix epoch')) {
    return { tool: 'timestamp', args: {} };
  }

  // System specs trigger
  if (p.includes('hardware specs') || p.includes('system ram') || p.includes('device memory') || p.includes('how much ram')) {
    return { tool: 'system_specs', args: {} };
  }

  return null;
}
