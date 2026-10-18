import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Sparkles, Waves, Radio, Mic, Download, StopCircle, Scissors, FileAudio } from 'lucide-react';

export const AudioStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'peace-noise' | 'binaural' | 'tones' | 'recorder' | 'trimmer'>('peace-noise');

  // Noise generator state
  const [noiseType, setNoiseType] = useState<'brown' | 'pink' | 'white'>('brown');
  const [isPlayingNoise, setIsPlayingNoise] = useState(false);
  const [noiseVolume, setNoiseVolume] = useState(0.5);

  // Binaural state
  const [binauralPreset, setBinauralPreset] = useState<'alpha' | 'theta' | 'delta' | 'gamma'>('alpha');
  const [isPlayingBinaural, setIsPlayingBinaural] = useState(false);

  // Frequency tone state
  const [frequency, setFrequency] = useState(432); // 432Hz miracle tone
  const [isPlayingTone, setIsPlayingTone] = useState(false);

  // Recorder state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  // Trimmer state
  const [trimmerAudioSrc, setTrimmerAudioSrc] = useState<string | null>(null);
  const [trimmerFileName, setTrimmerFileName] = useState<string>('');
  const [trimStart, setTrimStart] = useState<number>(0);
  const [trimEnd, setTrimEnd] = useState<number>(10);
  const [audioDuration, setAudioDuration] = useState<number>(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const oscLeftRef = useRef<OscillatorNode | null>(null);
  const oscRightRef = useRef<OscillatorNode | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const trimmerAudioElRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const stopAllAudio = () => {
    if (noiseNodeRef.current) {
      try { (noiseNodeRef.current as any).stop?.(); } catch {}
      noiseNodeRef.current.disconnect();
      noiseNodeRef.current = null;
    }
    if (oscRef.current) {
      try { oscRef.current.stop(); } catch {}
      oscRef.current.disconnect();
      oscRef.current = null;
    }
    if (oscLeftRef.current) {
      try { oscLeftRef.current.stop(); } catch {}
      oscLeftRef.current.disconnect();
      oscLeftRef.current = null;
    }
    if (oscRightRef.current) {
      try { oscRightRef.current.stop(); } catch {}
      oscRightRef.current.disconnect();
      oscRightRef.current = null;
    }
    setIsPlayingNoise(false);
    setIsPlayingBinaural(false);
    setIsPlayingTone(false);
  };

  // Generate continuous Brown / Pink / White noise via buffer
  const toggleNoise = () => {
    if (isPlayingNoise) {
      stopAllAudio();
      return;
    }

    stopAllAudio();
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (noiseType === 'white') {
        data[i] = white * 0.3;
      } else if (noiseType === 'brown') {
        // Brownian noise (calm deep ocean roar)
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5 * 0.3;
      } else {
        // Pink noise (natural gentle waterfall)
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11 * 0.4;
        b6 = white * 0.115926;
      }
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(noiseVolume, ctx.currentTime);
    gainNodeRef.current = gainNode;

    noiseSource.connect(gainNode);
    gainNode.connect(ctx.destination);
    noiseSource.start();

    noiseNodeRef.current = noiseSource;
    setIsPlayingNoise(true);
  };

  // Binaural beats (separate left and right frequency for brainwave synchronization)
  const toggleBinaural = () => {
    if (isPlayingBinaural) {
      stopAllAudio();
      return;
    }

    stopAllAudio();
    const ctx = getAudioContext();

    const baseFreq = 200;
    const beatOffset = binauralPreset === 'delta' ? 2 : binauralPreset === 'theta' ? 6 : binauralPreset === 'alpha' ? 10 : 20;

    const oscL = ctx.createOscillator();
    const oscR = ctx.createOscillator();
    oscL.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    oscR.frequency.setValueAtTime(baseFreq + beatOffset, ctx.currentTime);

    const merger = ctx.createChannelMerger(2);
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);

    oscL.connect(merger, 0, 0); // Left ear
    oscR.connect(merger, 0, 1); // Right ear

    merger.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscL.start();
    oscR.start();

    oscLeftRef.current = oscL;
    oscRightRef.current = oscR;
    setIsPlayingBinaural(true);
  };

  // Pure frequency tone
  const toggleTone = () => {
    if (isPlayingTone) {
      stopAllAudio();
      return;
    }

    stopAllAudio();
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    oscRef.current = osc;
    setIsPlayingTone(true);
  };

  // Voice / Audio recorder
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Could not access microphone. Please grant browser permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      setIsRecording(false);
    }
  };

  // Trimmer file upload
  const handleTrimmerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setTrimmerFileName(f.name);
    const url = URL.createObjectURL(f);
    setTrimmerAudioSrc(url);
    const a = new Audio(url);
    a.onloadedmetadata = () => {
      setAudioDuration(a.duration);
      setTrimStart(0);
      setTrimEnd(Math.min(30, a.duration));
    };
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'peace-noise', name: 'Calming Noise (Brown/Pink)', icon: Waves },
          { id: 'binaural', name: 'Binaural Focus Beats', icon: Radio },
          { id: 'tones', name: '432Hz & Solfeggio Tones', icon: Sparkles },
          { id: 'recorder', name: 'Microphone Voice Recorder', icon: Mic },
          { id: 'trimmer', name: 'Audio Cutter & Trimmer', icon: Scissors }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                stopAllAudio();
                setActiveTab(tab.id as any);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Calming Noise */}
      {activeTab === 'peace-noise' && (
        <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-6 shadow-sm max-w-xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-inner">
            <Waves className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Peaceful Noise Generator
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Pure client-side Web Audio synthesis. Brownian noise sounds like deep gentle ocean surf, pink noise mimics a gentle waterfall, and white noise masks sharp background distractions.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'brown', name: 'Brown Noise', desc: 'Deep Ocean Roar' },
              { id: 'pink', name: 'Pink Noise', desc: 'Gentle Rainfall' },
              { id: 'white', name: 'White Noise', desc: 'Focus Static' }
            ].map(n => (
              <button
                key={n.id}
                onClick={() => {
                  stopAllAudio();
                  setNoiseType(n.id as any);
                }}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  noiseType === n.id
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="font-bold text-xs block">{n.name}</span>
                <span className="text-[10px] opacity-75">{n.desc}</span>
              </button>
            ))}
          </div>

          <div>
            <button
              onClick={toggleNoise}
              className={`px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 mx-auto shadow-md transition-all ${
                isPlayingNoise
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isPlayingNoise ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlayingNoise ? 'Pause Peaceful Sound' : 'Play Peaceful Noise'}
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Binaural Beats */}
      {activeTab === 'binaural' && (
        <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-6 shadow-sm max-w-xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center shadow-inner">
            <Radio className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Binaural Brainwave Beats
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Please wear stereo headphones. Different frequencies in each ear synchronize brainwaves to induce deep focus, relaxation, or sleep.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'alpha', name: 'Alpha (10Hz)', desc: 'Flow State & Focus' },
              { id: 'theta', name: 'Theta (6Hz)', desc: 'Deep Meditation' },
              { id: 'delta', name: 'Delta (2Hz)', desc: 'Deep Sleep & Rest' },
              { id: 'gamma', name: 'Beta (20Hz)', desc: 'Alert Problem Solving' }
            ].map(b => (
              <button
                key={b.id}
                onClick={() => {
                  stopAllAudio();
                  setBinauralPreset(b.id as any);
                }}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  binauralPreset === b.id
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="font-bold text-xs block">{b.name}</span>
                <span className="text-[10px] opacity-75">{b.desc}</span>
              </button>
            ))}
          </div>

          <div>
            <button
              onClick={toggleBinaural}
              className={`px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 mx-auto shadow-md transition-all ${
                isPlayingBinaural
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isPlayingBinaural ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlayingBinaural ? 'Stop Binaural Beat' : 'Play Binaural Beat (Headphones)'}
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Frequency Tones */}
      {activeTab === 'tones' && (
        <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-6 shadow-sm max-w-xl mx-auto text-center">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Harmonic Frequency Generator
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select standard Solfeggio healing frequencies or tune to any exact Hertz.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {[432, 528, 639, 741, 852, 963, 440].map(hz => (
              <button
                key={hz}
                onClick={() => {
                  stopAllAudio();
                  setFrequency(hz);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono border ${
                  frequency === hz
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {hz} Hz {hz === 432 ? '(Miracle)' : hz === 528 ? '(DNA)' : hz === 440 ? '(Concert)' : ''}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-500 font-mono">
              <span>20 Hz</span>
              <span className="text-indigo-600 dark:text-indigo-400 text-sm">{frequency} Hz</span>
              <span>1000 Hz</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              value={frequency}
              onChange={(e) => {
                setFrequency(parseInt(e.target.value));
                if (oscRef.current && audioCtxRef.current) {
                  oscRef.current.frequency.setValueAtTime(parseInt(e.target.value), audioCtxRef.current.currentTime);
                }
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <button
            onClick={toggleTone}
            className={`px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 mx-auto shadow-md transition-all ${
              isPlayingTone
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isPlayingTone ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlayingTone ? 'Stop Frequency' : `Play ${frequency} Hz Tone`}
          </button>
        </div>
      )}

      {/* Tab 4: Recorder */}
      {activeTab === 'recorder' && (
        <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-6 shadow-sm max-w-xl mx-auto text-center">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Instant In-Browser Voice Recorder
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Record voice memos, interviews, or notes. Saved directly on your device.
            </p>
          </div>

          <div className="flex justify-center">
            {isRecording ? (
              <button
                onClick={stopRecording}
                className="w-20 h-20 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex flex-col items-center justify-center gap-1 shadow-lg animate-pulse"
              >
                <StopCircle className="w-8 h-8" />
                <span className="text-[10px] font-bold">STOP</span>
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="w-20 h-20 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex flex-col items-center justify-center gap-1 shadow-lg"
              >
                <Mic className="w-8 h-8" />
                <span className="text-[10px] font-bold">REC</span>
              </button>
            )}
          </div>

          {recordedAudioUrl && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <audio src={recordedAudioUrl} controls className="w-full" />
              <a
                href={recordedAudioUrl}
                download="recording.webm"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                Download Audio File (.webm)
              </a>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Trimmer & Cutter */}
      {activeTab === 'trimmer' && (
        <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-6 shadow-sm max-w-xl mx-auto text-center">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Audio Cutter & Snippet Player
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Load any audio track (MP3, WAV, OGG) to set start and end cue points.
            </p>
          </div>

          {!trimmerAudioSrc ? (
            <label className="w-full py-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 dark:bg-slate-950/40">
              <FileAudio className="w-10 h-10 text-indigo-500 mb-2" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Choose Audio Track (MP3, WAV, OGG)</span>
              <input type="file" accept="audio/*" onChange={handleTrimmerUpload} className="hidden" />
            </label>
          ) : (
            <div className="space-y-4">
              <audio ref={trimmerAudioElRef} src={trimmerAudioSrc} controls className="w-full" />

              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Start Point (sec):</label>
                  <input
                    type="number"
                    min="0"
                    max={audioDuration}
                    value={trimStart}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value) || 0;
                      setTrimStart(v);
                      if (trimmerAudioElRef.current) trimmerAudioElRef.current.currentTime = v;
                    }}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">End Point (sec):</label>
                  <input
                    type="number"
                    min="0"
                    max={audioDuration}
                    value={trimEnd}
                    onChange={(e) => setTrimEnd(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Duration: {audioDuration.toFixed(1)}s • Selected Clip: {(trimEnd - trimStart).toFixed(1)}s
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
