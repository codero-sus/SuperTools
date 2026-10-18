import React, { useState, useRef } from 'react';
import { Video, Mic, Download, Play, Square, Pause, RefreshCw, AlertCircle } from 'lucide-react';

export const ScreenRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [includeMic, setIncludeMic] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  const startScreenCapture = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 30 } },
        audio: true
      });

      let combinedStream = displayStream;

      if (includeMic) {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioTracks = [...displayStream.getAudioTracks(), ...micStream.getAudioTracks()];
          combinedStream = new MediaStream([...displayStream.getVideoTracks(), ...audioTracks]);
        } catch {
          console.warn('Microphone permission denied, recording screen only.');
        }
      }

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm'
      });

      mediaRecorderRef.current = recorder;
      recordedChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        clearInterval(timerIntervalRef.current);
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setIsRecording(false);
        setIsPaused(false);
        combinedStream.getTracks().forEach(t => t.stop());
      };

      // Handle user pressing browser's native "Stop sharing" button
      displayStream.getVideoTracks()[0].onended = () => {
        if (recorder.state !== 'inactive') {
          recorder.stop();
        }
      };

      recorder.start(1000); // 1s slice
      setIsRecording(true);
      setRecordedVideoUrl(null);
      setRecordDuration(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordDuration(prev => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Screen recording error:', err);
    }
  };

  const stopScreenCapture = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const togglePause = () => {
    if (!mediaRecorderRef.current) return;
    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-6 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center shadow-inner">
          <Video className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Client-Side Screen & Video Recorder
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Capture full screen, specific window, or browser tab. No watermarks, no server upload, zero backend.
          </p>
        </div>

        {!isRecording && !recordedVideoUrl && (
          <div className="space-y-4">
            <label className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeMic}
                onChange={(e) => setIncludeMic(e.target.checked)}
                className="rounded text-indigo-600"
              />
              <Mic className="w-3.5 h-3.5 text-indigo-500" />
              Include Microphone Audio Voiceover
            </label>

            <button
              onClick={startScreenCapture}
              className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <Video className="w-4 h-4" />
              Select Screen & Start Recording
            </button>
          </div>
        )}

        {isRecording && (
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-600 font-mono text-sm font-bold animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              REC: {formatTime(recordDuration)} {isPaused && '(PAUSED)'}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={togglePause}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={stopScreenCapture}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                Finish & Stop Recording
              </button>
            </div>
          </div>
        )}

        {recordedVideoUrl && (
          <div className="space-y-4 pt-2">
            <video src={recordedVideoUrl} controls className="w-full rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 max-h-72" />

            <div className="flex items-center justify-center gap-3">
              <a
                href={recordedVideoUrl}
                download="screen-recording.webm"
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                Download Recording (.webm)
              </a>
              <button
                onClick={() => {
                  setRecordedVideoUrl(null);
                  setRecordDuration(0);
                }}
                className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold"
              >
                Record Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
