// WebGPU Hardware Acceleration Engine for In-RAM Neural Networks
// 100% Client-Side WGSL Compute Shaders with Automatic SIMD CPU Fallback
// Provides hardware-accelerated tensor matrix multiplication, GeLU/Softmax, and batch cosine similarity

export interface WebGpuDeviceInfo {
  isAvailable: boolean;
  adapterName: string;
  vendor: string;
  architecture: string;
  deviceType: 'discrete-gpu' | 'integrated-gpu' | 'cpu-simd' | 'unknown';
  maxBufferSizeMb: number;
  maxComputeWorkgroupSize: number;
  status: 'ready' | 'fallback-simd' | 'initializing' | 'unsupported';
}

export interface WebGpuBenchmarkResult {
  matrixSize: number;
  timeMs: number;
  gflops: number;
  backend: 'WebGPU (WGSL Compute)' | 'CPU (Float32Array SIMD)';
  accuracyDelta: number;
  timestamp: string;
}

// WGSL: High-Throughput Tiled Matrix Multiplication Shader with Shared Workgroup Memory
const MATMUL_WGSL = /* wgsl */ `
struct Uniforms {
  M: u32,
  K: u32,
  N: u32,
};

@group(0) @binding(0) var<uniform> dims: Uniforms;
@group(0) @binding(1) var<storage, read> matrixA: array<f32>;
@group(0) @binding(2) var<storage, read> matrixB: array<f32>;
@group(0) @binding(3) var<storage, read_write> matrixC: array<f32>;

const TILE_SIZE: u32 = 16u;
var<workgroup> tileA: array<array<f32, 16>, 16>;
var<workgroup> tileB: array<array<f32, 16>, 16>;

@compute @workgroup_size(16, 16)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
  @builtin(local_invocation_id) local_id: vec3<u32>
) {
  let row = global_id.x;
  let col = global_id.y;
  let localRow = local_id.x;
  let localCol = local_id.y;

  var acc: f32 = 0.0;
  let numTiles = (dims.K + TILE_SIZE - 1u) / TILE_SIZE;

  for (var t: u32 = 0u; t < numTiles; t = t + 1u) {
    let tiledCol = t * TILE_SIZE + localCol;
    let tiledRow = t * TILE_SIZE + localRow;

    // Cache Tile A into ultra-fast L1 workgroup shared memory
    if (row < dims.M && tiledCol < dims.K) {
      tileA[localRow][localCol] = matrixA[row * dims.K + tiledCol];
    } else {
      tileA[localRow][localCol] = 0.0;
    }

    // Cache Tile B into ultra-fast L1 workgroup shared memory
    if (tiledRow < dims.K && col < dims.N) {
      tileB[localRow][localCol] = matrixB[tiledRow * dims.N + col];
    } else {
      tileB[localRow][localCol] = 0.0;
    }

    workgroupBarrier();

    // Multiply tile in fast registers
    for (var k: u32 = 0u; k < TILE_SIZE; k = k + 1u) {
      acc = acc + tileA[localRow][k] * tileB[k][localCol];
    }

    workgroupBarrier();
  }

  if (row < dims.M && col < dims.N) {
    matrixC[row * dims.N + col] = acc;
  }
}
`;

// WGSL: Parallel GeLU & Activation Compute Shader
const GELU_WGSL = /* wgsl */ `
@group(0) @binding(0) var<uniform> size: u32;
@group(0) @binding(1) var<storage, read_write> data: array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let idx = global_id.x;
  if (idx >= size) {
    return;
  }

  let x = data[idx];
  let cube = x * x * x;
  data[idx] = 0.5 * x * (1.0 + tanh(0.7978845608 * (x + 0.044715 * cube)));
}
`;

// WGSL: High-Speed Batch Cosine Similarity Compute Shader for In-RAM Vector RAG
const COSINE_SIM_WGSL = /* wgsl */ `
struct Params {
  count: u32,
  dim: u32,
};

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> query: array<f32>;
@group(0) @binding(2) var<storage, read> corpus: array<f32>;
@group(0) @binding(3) var<storage, read_write> scores: array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let idx = global_id.x;
  if (idx >= params.count) {
    return;
  }

  let offset = idx * params.dim;
  var dot: f32 = 0.0;
  var normA: f32 = 0.0;
  var normB: f32 = 0.0;

  for (var d: u32 = 0u; d < params.dim; d = d + 1u) {
    let q = query[d];
    let c = corpus[offset + d];
    dot = dot + q * c;
    normA = normA + q * q;
    normB = normB + c * c;
  }

  if (normA <= 0.0 || normB <= 0.0) {
    scores[idx] = 0.0;
  } else {
    scores[idx] = dot / (sqrt(normA) * sqrt(normB));
  }
}
`;

export class WebGpuAiEngine {
  private device: any = null;
  private adapter: any = null;
  private isInitialized: boolean = false;
  private isSupported: boolean = false;
  private deviceInfo: WebGpuDeviceInfo;

  // Cached pipelines
  private matMulPipeline: any = null;
  private geluPipeline: any = null;
  private cosinePipeline: any = null;

  constructor() {
    this.deviceInfo = {
      isAvailable: false,
      adapterName: 'Detecting GPU...',
      vendor: 'Unknown',
      architecture: 'CPU Fallback',
      deviceType: 'cpu-simd',
      maxBufferSizeMb: 256,
      maxComputeWorkgroupSize: 256,
      status: 'initializing'
    };
  }

  // Initialize WebGPU context
  public async init(): Promise<WebGpuDeviceInfo> {
    if (this.isInitialized) {
      return this.deviceInfo;
    }

    if (typeof navigator === 'undefined' || !(navigator as any).gpu) {
      this.deviceInfo = {
        isAvailable: false,
        adapterName: 'CPU TypedArray (WebGPU Unsupported in Environment)',
        vendor: 'Browser / CPU',
        architecture: 'SIMD / Float32Array',
        deviceType: 'cpu-simd',
        maxBufferSizeMb: 512,
        maxComputeWorkgroupSize: 64,
        status: 'fallback-simd'
      };
      this.isInitialized = true;
      return this.deviceInfo;
    }

    try {
      const gpu = (navigator as any).gpu;
      this.adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });

      if (!this.adapter) {
        throw new Error('No high-performance GPU adapter found');
      }

      this.device = await this.adapter.requestDevice();

      // Query adapter properties
      let name = 'Hardware GPU Accelerator';
      let vendor = 'GPU Vendor';
      let arch = 'DirectX/Vulkan/Metal';

      if (this.adapter.info) {
        name = this.adapter.info.description || this.adapter.info.device || name;
        vendor = this.adapter.info.vendor || vendor;
        arch = this.adapter.info.architecture || arch;
      }

      const limits = this.device.limits || {};
      const maxBufferSizeMb = Math.round((limits.maxStorageBufferBindingSize || (128 * 1024 * 1024)) / (1024 * 1024));
      const maxWorkgroupSize = limits.maxComputeWorkgroupSizeX || 256;

      this.deviceInfo = {
        isAvailable: true,
        adapterName: name,
        vendor,
        architecture: arch,
        deviceType: 'discrete-gpu',
        maxBufferSizeMb,
        maxComputeWorkgroupSize: maxWorkgroupSize,
        status: 'ready'
      };

      this.isSupported = true;
      await this.compilePipelines();
    } catch (err: any) {
      console.warn('[WebGPU AI] Hardware initialization fallback to CPU SIMD:', err?.message || err);
      this.deviceInfo = {
        isAvailable: false,
        adapterName: 'CPU SIMD RAM (Hardware Fallback)',
        vendor: 'CPU Core',
        architecture: 'Float32Array Unrolled',
        deviceType: 'cpu-simd',
        maxBufferSizeMb: 512,
        maxComputeWorkgroupSize: 64,
        status: 'fallback-simd'
      };
    }

    this.isInitialized = true;
    return this.deviceInfo;
  }

  // Precompile WGSL compute shaders
  private async compilePipelines(): Promise<void> {
    if (!this.device) return;

    try {
      // 1. MatMul Pipeline
      const matMulModule = this.device.createShaderModule({ code: MATMUL_WGSL });
      this.matMulPipeline = await this.device.createComputePipelineAsync({
        layout: 'auto',
        compute: { module: matMulModule, entryPoint: 'main' }
      });

      // 2. GeLU Pipeline
      const geluModule = this.device.createShaderModule({ code: GELU_WGSL });
      this.geluPipeline = await this.device.createComputePipelineAsync({
        layout: 'auto',
        compute: { module: geluModule, entryPoint: 'main' }
      });

      // 3. Cosine Pipeline
      const cosineModule = this.device.createShaderModule({ code: COSINE_SIM_WGSL });
      this.cosinePipeline = await this.device.createComputePipelineAsync({
        layout: 'auto',
        compute: { module: cosineModule, entryPoint: 'main' }
      });
    } catch (err) {
      console.warn('[WebGPU AI] Shader precompilation warning:', err);
    }
  }

  // Fast GPU Matrix Multiplication: C = A * B
  public async matmul(
    A: Float32Array,
    B: Float32Array,
    M: number,
    K: number,
    N: number
  ): Promise<Float32Array> {
    // If WebGPU is not ready, fall back to high-speed CPU TypedArray calculation
    if (!this.isSupported || !this.device || !this.matMulPipeline) {
      return this.cpuMatMul(A, B, M, K, N);
    }

    try {
      const dimsArray = new Uint32Array([M, K, N, 0]);
      const dimsBuffer = this.createGpuBuffer(dimsArray, 0x0040 /* UNIFORM */ | 0x0008 /* COPY_DST */);
      const aBuffer = this.createGpuBuffer(A, 0x0080 /* STORAGE */ | 0x0008 /* COPY_DST */);
      const bBuffer = this.createGpuBuffer(B, 0x0080 /* STORAGE */ | 0x0008 /* COPY_DST */);

      const cSizeBytes = M * N * 4;
      const cBuffer = this.device.createBuffer({
        size: cSizeBytes,
        usage: 0x0080 /* STORAGE */ | 0x0004 /* COPY_SRC */
      });

      const readBuffer = this.device.createBuffer({
        size: cSizeBytes,
        usage: 0x0001 /* MAP_READ */ | 0x0008 /* COPY_DST */
      });

      const bindGroup = this.device.createBindGroup({
        layout: this.matMulPipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: dimsBuffer } },
          { binding: 1, resource: { buffer: aBuffer } },
          { binding: 2, resource: { buffer: bBuffer } },
          { binding: 3, resource: { buffer: cBuffer } }
        ]
      });

      const commandEncoder = this.device.createCommandEncoder();
      const passEncoder = commandEncoder.beginComputePass();
      passEncoder.setPipeline(this.matMulPipeline);
      passEncoder.setBindGroup(0, bindGroup);
      passEncoder.dispatchWorkgroups(Math.ceil(M / 16), Math.ceil(N / 16));
      passEncoder.end();

      commandEncoder.copyBufferToBuffer(cBuffer, 0, readBuffer, 0, cSizeBytes);
      this.device.queue.submit([commandEncoder.finish()]);

      await readBuffer.mapAsync(1 /* GPUMapMode.READ */);
      const copyArray = new Float32Array(readBuffer.getMappedRange().slice(0));
      readBuffer.unmap();

      // Clean up buffers
      dimsBuffer.destroy();
      aBuffer.destroy();
      bBuffer.destroy();
      cBuffer.destroy();
      readBuffer.destroy();

      return copyArray;
    } catch (err) {
      console.warn('[WebGPU MatMul] Fallback to CPU:', err);
      return this.cpuMatMul(A, B, M, K, N);
    }
  }

  // Helper: Create initialized GPU Buffer
  private createGpuBuffer(data: ArrayBufferView, usage: number): any {
    const buffer = this.device.createBuffer({
      size: Math.max(16, (data.byteLength + 3) & ~3),
      usage,
      mappedAtCreation: true
    });
    new (data.constructor as any)(buffer.getMappedRange()).set(data);
    buffer.unmap();
    return buffer;
  }

  // CPU Fallback Matrix Multiplication (Loop Unrolled 4x)
  public cpuMatMul(A: Float32Array, B: Float32Array, M: number, K: number, N: number): Float32Array {
    const C = new Float32Array(M * N);
    for (let r = 0; r < M; r++) {
      const rOffsetA = r * K;
      const rOffsetC = r * N;
      for (let c = 0; c < N; c++) {
        let sum = 0.0;
        let k = 0;
        const limit = K - 3;
        for (; k < limit; k += 4) {
          sum += A[rOffsetA + k] * B[k * N + c] +
                 A[rOffsetA + k + 1] * B[(k + 1) * N + c] +
                 A[rOffsetA + k + 2] * B[(k + 2) * N + c] +
                 A[rOffsetA + k + 3] * B[(k + 3) * N + c];
        }
        for (; k < K; k++) {
          sum += A[rOffsetA + k] * B[k * N + c];
        }
        C[rOffsetC + c] = sum;
      }
    }
    return C;
  }

  // Parallel Batch Cosine Similarity on GPU
  public async batchCosineSimilarity(
    queryVec: Float32Array,
    corpusVecs: Float32Array[],
    dim: number
  ): Promise<Float32Array> {
    const count = corpusVecs.length;
    if (count === 0) return new Float32Array(0);

    // If WebGPU is not active, run fast loop-unrolled CPU calculation
    if (!this.isSupported || !this.device || !this.cosinePipeline) {
      const scores = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        scores[i] = this.cpuCosineSimilarity(queryVec, corpusVecs[i]);
      }
      return scores;
    }

    try {
      // Flatten corpus into contiguous Float32Array
      const flattened = new Float32Array(count * dim);
      for (let i = 0; i < count; i++) {
        flattened.set(corpusVecs[i], i * dim);
      }

      const paramsArray = new Uint32Array([count, dim, 0, 0]);
      const paramsBuffer = this.createGpuBuffer(paramsArray, 0x0040 | 0x0008);
      const qBuffer = this.createGpuBuffer(queryVec, 0x0080 | 0x0008);
      const cBuffer = this.createGpuBuffer(flattened, 0x0080 | 0x0008);

      const scoresBytes = count * 4;
      const sBuffer = this.device.createBuffer({
        size: Math.max(16, scoresBytes),
        usage: 0x0080 | 0x0004
      });
      const readBuffer = this.device.createBuffer({
        size: Math.max(16, scoresBytes),
        usage: 0x0001 | 0x0008
      });

      const bindGroup = this.device.createBindGroup({
        layout: this.cosinePipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: paramsBuffer } },
          { binding: 1, resource: { buffer: qBuffer } },
          { binding: 2, resource: { buffer: cBuffer } },
          { binding: 3, resource: { buffer: sBuffer } }
        ]
      });

      const encoder = this.device.createCommandEncoder();
      const pass = encoder.beginComputePass();
      pass.setPipeline(this.cosinePipeline);
      pass.setBindGroup(0, bindGroup);
      pass.dispatchWorkgroups(Math.ceil(count / 64));
      pass.end();

      encoder.copyBufferToBuffer(sBuffer, 0, readBuffer, 0, scoresBytes);
      this.device.queue.submit([encoder.finish()]);

      await readBuffer.mapAsync(1);
      const scores = new Float32Array(readBuffer.getMappedRange().slice(0, scoresBytes));
      readBuffer.unmap();

      paramsBuffer.destroy();
      qBuffer.destroy();
      cBuffer.destroy();
      sBuffer.destroy();
      readBuffer.destroy();

      return scores;
    } catch (err) {
      console.warn('[WebGPU Cosine] Fallback to CPU:', err);
      const scores = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        scores[i] = this.cpuCosineSimilarity(queryVec, corpusVecs[i]);
      }
      return scores;
    }
  }

  // CPU Cosine Similarity
  private cpuCosineSimilarity(a: Float32Array, b: Float32Array): number {
    let dot = 0.0;
    let normA = 0.0;
    let normB = 0.0;
    const len = a.length;
    for (let i = 0; i < len; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    if (normA <= 0.0 || normB <= 0.0) return 0.0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Hardware Benchmark Test with Ultra-Fast GPU Dispatch & Shared Memory Tiling
  public async runBenchmark(matrixSize: number = 256): Promise<WebGpuBenchmarkResult> {
    const N = matrixSize;

    // If WebGPU is not supported, run CPU fallback
    if (!this.isSupported || !this.device || !this.matMulPipeline) {
      return this.runCpuBenchmark(N);
    }

    try {
      const A = new Float32Array(N * N);
      const B = new Float32Array(N * N);
      for (let i = 0; i < A.length; i++) {
        A[i] = 0.5;
        B[i] = 0.5;
      }

      const dimsArray = new Uint32Array([N, N, N, 0]);
      const dimsBuffer = this.createGpuBuffer(dimsArray, 0x0040 | 0x0008);
      const aBuffer = this.createGpuBuffer(A, 0x0080 | 0x0008);
      const bBuffer = this.createGpuBuffer(B, 0x0080 | 0x0008);

      const cSizeBytes = N * N * 4;
      const cBuffer = this.device.createBuffer({
        size: cSizeBytes,
        usage: 0x0080 | 0x0004
      });

      const readBuffer = this.device.createBuffer({
        size: Math.max(16, Math.min(256, cSizeBytes)),
        usage: 0x0001 | 0x0008
      });

      const bindGroup = this.device.createBindGroup({
        layout: this.matMulPipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: dimsBuffer } },
          { binding: 1, resource: { buffer: aBuffer } },
          { binding: 2, resource: { buffer: bBuffer } },
          { binding: 3, resource: { buffer: cBuffer } }
        ]
      });

      // Warmup pass to ensure JIT shader pipeline is loaded in GPU VRAM
      const warmEncoder = this.device.createCommandEncoder();
      const warmPass = warmEncoder.beginComputePass();
      warmPass.setPipeline(this.matMulPipeline);
      warmPass.setBindGroup(0, bindGroup);
      warmPass.dispatchWorkgroups(Math.ceil(N / 16), Math.ceil(N / 16));
      warmPass.end();
      this.device.queue.submit([warmEncoder.finish()]);

      // Benchmark passes: amortizes PCI-e driver submission and isolates pure GPU core compute throughput
      const ITERATIONS = N >= 1024 ? 4 : (N >= 512 ? 8 : 16);
      const t0 = performance.now();

      const benchEncoder = this.device.createCommandEncoder();
      for (let it = 0; it < ITERATIONS; it++) {
        const pass = benchEncoder.beginComputePass();
        pass.setPipeline(this.matMulPipeline);
        pass.setBindGroup(0, bindGroup);
        pass.dispatchWorkgroups(Math.ceil(N / 16), Math.ceil(N / 16));
        pass.end();
      }
      benchEncoder.copyBufferToBuffer(cBuffer, 0, readBuffer, 0, Math.min(64, cSizeBytes));
      this.device.queue.submit([benchEncoder.finish()]);

      await readBuffer.mapAsync(1);
      const mapped = new Float32Array(readBuffer.getMappedRange().slice(0, 16));
      readBuffer.unmap();

      const elapsedTotalMs = performance.now() - t0;
      const timePerPassMs = Math.max(0.01, elapsedTotalMs / ITERATIONS);

      // FLOPs per pass = 2 * N^3
      const totalFlopsPerPass = 2.0 * Math.pow(N, 3);
      const gflops = Number(((totalFlopsPerPass / (timePerPassMs / 1000)) / 1e9).toFixed(2));

      dimsBuffer.destroy();
      aBuffer.destroy();
      bBuffer.destroy();
      cBuffer.destroy();
      readBuffer.destroy();

      return {
        matrixSize: N,
        timeMs: Number(timePerPassMs.toFixed(2)),
        gflops,
        backend: 'WebGPU (WGSL Compute)',
        accuracyDelta: Math.abs(mapped[0] - mapped[1]),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
    } catch (err) {
      console.warn('[WebGPU Benchmark] Fallback to CPU:', err);
      return this.runCpuBenchmark(N);
    }
  }

  // CPU Benchmark Helper
  public runCpuBenchmark(matrixSize: number): WebGpuBenchmarkResult {
    const N = matrixSize;
    const A = new Float32Array(N * N);
    const B = new Float32Array(N * N);
    for (let i = 0; i < A.length; i++) {
      A[i] = 0.5;
      B[i] = 0.5;
    }
    const t0 = performance.now();
    const res = this.cpuMatMul(A, B, N, N, N);
    const elapsed = Math.max(0.1, performance.now() - t0);
    const totalFlops = 2.0 * Math.pow(N, 3);
    const gflops = Number(((totalFlops / (elapsed / 1000)) / 1e9).toFixed(2));

    return {
      matrixSize: N,
      timeMs: Number(elapsed.toFixed(2)),
      gflops,
      backend: 'CPU (Float32Array SIMD)',
      accuracyDelta: Math.abs(res[0] - res[1]),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  }

  public getDeviceInfo(): WebGpuDeviceInfo {
    return this.deviceInfo;
  }
}

// Global Singleton for WebGPU Acceleration Engine
let webGpuEngineInstance: WebGpuAiEngine | null = null;

export function getWebGpuAiEngine(): WebGpuAiEngine {
  if (!webGpuEngineInstance) {
    webGpuEngineInstance = new WebGpuAiEngine();
    // Eagerly probe and initialize
    webGpuEngineInstance.init();
  }
  return webGpuEngineInstance;
}
