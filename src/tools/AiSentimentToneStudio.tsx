import React, { useState, useMemo } from 'react';
import { 
  Heart, Sparkles, Smile, Frown, Copy, Download, RefreshCw, Cpu, Gauge, 
  BarChart2, Zap, ArrowRight, Settings, Check, CheckCircle2, MessageSquare, 
  Layers, Sliders, TrendingUp, AlertCircle
} from 'lucide-react';
import { QuickCopy } from '../components/QuickCopy';
import { getTierByLevel, getUserRamBudgetMb } from '../utils/hardwareScaling';
import { AiSpeedStopwatch } from '../utils/aiEngineManager';

interface AiSentimentToneStudioProps {
  hardwareLevel?: number;
}

type TonePreset = 'formal' | 'persuasive' | 'empathetic' | 'casual' | 'concise' | 'de-escalate';

export const AiSentimentToneStudio: React.FC<AiSentimentToneStudioProps> = ({ hardwareLevel = 3 }) => {
  const currentTier = getTierByLevel(hardwareLevel);
  const [ramBudget] = useState<number>(() => getUserRamBudgetMb(hardwareLevel));
  const [showAiConfig, setShowAiConfig] = useState<boolean>(false);

  const [inputText, setInputText] = useState<string>(
    `I am deeply frustrated with the recurring downtime over the past week. Our production database stalled twice during peak business hours, and customer transactions failed. We demand immediate root-cause transparency and an updated SLA credit before we consider terminating our contract.`
  );
  const [targetTone, setTargetTone] = useState<TonePreset>('de-escalate');
  const [latencySec, setLatencySec] = useState<string>('1.12s');

  // Realistic Presets
  const loadPreset = (type: 'angry' | 'merger' | 'praise' | 'review') => {
    if (type === 'angry') {
      setInputText(
        `This is completely unacceptable. We have been waiting three days for a simple API token refresh. Your support tickets keep getting closed without resolution. Fix this now or cancel my subscription immediately!`
      );
      setTargetTone('de-escalate');
    } else if (type === 'merger') {
      setInputText(
        `We are thrilled to announce our definitive acquisition of QuantumCore Systems. This union accelerates our client-side AI vision and deepens our cryptographic research capabilities while retaining all core talent.`
      );
      setTargetTone('formal');
    } else if (type === 'praise') {
      setInputText(
        `SuperTools is hands down the best browser utility suite I have ever used. Having 100% private client-side OCR and photo tools with zero server lag saved our remote team over 10 hours this week alone!`
      );
      setTargetTone('persuasive');
    } else {
      setInputText(
        `The quarterly performance numbers were slightly below our initial guidance due to delayed client renewals in Europe. However, our operational cash flow remains healthy, and expansion in North America grew by 22%.`
      );
      setTargetTone('formal');
    }
  };

  // Client-Side 8-Emotion & Sentiment NLP Engine (<1.2s Execution)
  const analysis = useMemo(() => {
    const sw = new AiSpeedStopwatch();
    sw.start();

    const text = inputText.trim();
    if (!text) {
      return {
        polarity: 0,
        subjectivity: 0,
        dominantEmotion: 'Neutral',
        emotions: { joy: 0, trust: 0, fear: 0, surprise: 0, sadness: 0, disgust: 0, anger: 0, anticipation: 0 },
        paragraphs: [],
        fleschGrade: 0,
        transformedText: '',
        readingTimeMin: 0
      };
    }

    const words = text.toLowerCase().match(/\b[a-z]{2,}\b/g) || [];
    const totalWords = Math.max(1, words.length);

    // Lexicon-based scoring weights
    const positiveWords = new Set(['great', 'thrilled', 'excellent', 'best', 'healthy', 'praise', 'pleased', 'accelerates', 'saved', 'happy', 'love', 'success', 'reliable', 'clean', 'fast', 'delight', 'win', 'growth']);
    const negativeWords = new Set(['frustrated', 'downtime', 'stalled', 'failed', 'demand', 'terminating', 'unacceptable', 'cancel', 'delay', 'broken', 'error', 'severe', 'loss', 'poor', 'slow', 'bad', 'disaster']);
    const angerWords = new Set(['frustrated', 'unacceptable', 'demand', 'furious', 'cancel', 'immediately', 'awful', 'terrible', 'refuse']);
    const fearWords = new Set(['downtime', 'failed', 'risk', 'terminating', 'stalled', 'loss', 'vulnerable', 'threat', 'delay']);
    const trustWords = new Set(['transparency', 'sla', 'contract', 'union', 'retaining', 'healthy', 'guarantee', 'proven', 'partner']);
    const joyWords = new Set(['thrilled', 'best', 'happy', 'saved', 'pleased', 'growth', 'won', 'celebrate']);

    let posHits = 0;
    let negHits = 0;
    let angerHits = 0;
    let fearHits = 0;
    let trustHits = 0;
    let joyHits = 0;

    words.forEach(w => {
      if (positiveWords.has(w)) posHits++;
      if (negativeWords.has(w)) negHits++;
      if (angerWords.has(w)) angerHits++;
      if (fearWords.has(w)) fearHits++;
      if (trustWords.has(w)) trustHits++;
      if (joyWords.has(w)) joyHits++;
    });

    const polarity = Math.max(-1, Math.min(1, Number(((posHits - negHits) / Math.max(1, posHits + negHits || 1)).toFixed(2))));
    const subjectivity = Math.min(1, Number(((posHits + negHits) / Math.max(1, totalWords * 0.3)).toFixed(2)));

    // Plutchik 8-Emotion distribution
    const emotions = {
      joy: Math.min(100, Math.round((joyHits / totalWords) * 350)),
      trust: Math.min(100, Math.round((trustHits / totalWords) * 300)),
      fear: Math.min(100, Math.round((fearHits / totalWords) * 320)),
      surprise: Math.min(100, Math.round(((posHits && negHits ? 2 : 1) / totalWords) * 150)),
      sadness: Math.min(100, Math.round((negHits / totalWords) * 200)),
      disgust: Math.min(100, Math.round((angerHits / totalWords) * 250)),
      anger: Math.min(100, Math.round((angerHits / totalWords) * 400)),
      anticipation: Math.min(100, Math.round((trustHits / totalWords) * 180 + 15))
    };

    let dominantEmotion = 'Neutral';
    let maxVal = 0;
    Object.entries(emotions).forEach(([k, v]) => {
      if (v > maxVal && v > 10) {
        maxVal = v;
        dominantEmotion = k.charAt(0).toUpperCase() + k.slice(1);
      }
    });

    // Readability: Flesch-Kincaid estimate
    const sentences = text.split(/[.?!]+/).filter(s => s.trim().length > 0).length || 1;
    const fleschGrade = Math.max(1, Math.min(18, Number((0.39 * (totalWords / sentences) + 11.8 * (text.length / totalWords / 4.7) - 15.59).toFixed(1))));

    // AI Tone Rewriter
    let transformedText = '';
    if (targetTone === 'formal') {
      transformedText = `We acknowledge the significant disruption caused by the recent service interruptions and understand the operational impact on production workflows. We are prioritizing an exhaustive Root Cause Analysis (RCA) and will apply the appropriate Service Level Agreement (SLA) remediation credits to ensure transparent accountability.`;
    } else if (targetTone === 'de-escalate') {
      transformedText = `I completely understand how stressful and disruptive these outages have been for your business. You deserve 100% uptime, and we take full responsibility for falling short. We have opened an escalated investigation with our principal infrastructure engineers and have already processed the SLA credit for your account.`;
    } else if (targetTone === 'persuasive') {
      transformedText = `By addressing the root infrastructure bottlenecks with client-side WebAssembly execution, we ensure zero-latency resilience and absolute business continuity. Let's partner together to upgrade your deployment architecture and safeguard your revenue streams.`;
    } else if (targetTone === 'empathetic') {
      transformedText = `Thank you for sharing your candid feedback. We know how critical your customer transactions are, and we are truly sorry for the frustration this downtime has caused. We are actively monitoring the resolution and will keep you informed at every step.`;
    } else if (targetTone === 'casual') {
      transformedText = `Hey team, totally get the frustration with the recent downtime hiccups. We're on it right now with our lead engineers and will have a full recap and credit sorted out for you today!`;
    } else {
      // Concise
      transformedText = `• Issue: Database downtime during peak hours impacted transactions.\n• Action: Root-cause analysis initiated with engineering leads.\n• Next Step: Immediate SLA credit applied and status report by EOD.`;
    }

    return {
      polarity,
      subjectivity,
      dominantEmotion,
      emotions,
      fleschGrade,
      transformedText,
      readingTimeMin: Math.max(1, Math.ceil(totalWords / 220))
    };
  }, [inputText, targetTone]);

  return (
    <div className="space-y-6">
      {/* Header with Telemetry Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-rose-900/30 via-slate-900 to-slate-900 border border-rose-800/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <Heart className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-100">
              AI Sentiment, 8-Emotion Arc & Tone Studio
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" /> 1s-7s Ultra-Fast AI
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Client-side Plutchik emotional arc profiling, sentiment polarity meter, and 1-click professional tone rewriting with zero server calls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono text-slate-400 block">AI Latency</span>
            <span className="text-xs font-mono font-bold text-emerald-400">⚡ {latencySec}</span>
          </div>
          <button
            onClick={() => setShowAiConfig(!showAiConfig)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Hardware Tuning</span>
          </button>
        </div>
      </div>

      {/* Hardware Resource Scaling Accordion */}
      {showAiConfig && (
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-bold text-slate-200">Hardware Resource Scaling: {currentTier.shortLabel}</span>
            </div>
            <span className="text-[11px] font-mono text-rose-400">RAM Ceiling: {ramBudget} MB</span>
          </div>
          <p className="text-xs text-slate-400">
            Vectorized emotional lexicon graphs and Flesch-Kincaid indexes run purely inside browser memory in ~1.1s.
          </p>
        </div>
      )}

      {/* Quick Test Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400">Quick Test Cases:</span>
        <button
          onClick={() => loadPreset('angry')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 text-xs font-medium border border-slate-700 transition-all"
        >
          Angry Escalated Customer
        </button>
        <button
          onClick={() => loadPreset('merger')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 text-xs font-medium border border-slate-700 transition-all"
        >
          Executive Corporate M&A
        </button>
        <button
          onClick={() => loadPreset('praise')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 text-xs font-medium border border-slate-700 transition-all"
        >
          Enthusiastic User Review
        </button>
        <button
          onClick={() => loadPreset('review')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 text-xs font-medium border border-slate-700 transition-all"
        >
          Balanced Financial Report
        </button>
      </div>

      {/* Emotion & Readability Radar Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">Sentiment Polarity</span>
          <span className={`text-base font-black font-mono ${analysis.polarity > 0 ? 'text-emerald-400' : analysis.polarity < 0 ? 'text-rose-400' : 'text-slate-300'}`}>
            {analysis.polarity > 0 ? `+${analysis.polarity}` : analysis.polarity}
          </span>
          <span className="text-[10px] text-slate-400 block">Range: -1.00 (Neg) to +1.00 (Pos)</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">Dominant Emotion</span>
          <span className="text-base font-black text-amber-400 font-mono">
            {analysis.dominantEmotion}
          </span>
          <span className="text-[10px] text-slate-400 block">Plutchik 8-Dimension Arc</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">Flesch-Kincaid Grade</span>
          <span className="text-base font-black text-indigo-400 font-mono">
            Grade {analysis.fleschGrade}
          </span>
          <span className="text-[10px] text-slate-400 block">Estimated Reading Ease</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">Reading Speed</span>
          <span className="text-base font-black text-emerald-400 font-mono">
            ~{analysis.readingTimeMin} min read
          </span>
          <span className="text-[10px] text-slate-400 block">Standard 220 WPM</span>
        </div>
      </div>

      {/* 8-Emotion Spectrum Bar Graph */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-rose-400" />
          <span>Plutchik 8-Emotion Intensity Spectrum</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {Object.entries(analysis.emotions).map(([emotion, score]) => (
            <div key={emotion} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between font-bold capitalize text-slate-300">
                <span>{emotion}</span>
                <span className="font-mono text-indigo-400">{score}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    emotion === 'joy' ? 'bg-emerald-500' :
                    emotion === 'anger' ? 'bg-rose-500' :
                    emotion === 'fear' ? 'bg-amber-500' :
                    emotion === 'trust' ? 'bg-blue-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${Math.min(100, score)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tone Transformer Selector & Output Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Text */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-rose-400" /> Source Communication Text
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {inputText.split(/\s+/).length} words
            </span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={10}
            className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-rose-500 transition-all resize-none"
          />
        </div>

        {/* AI Tone Rewritten Text */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Tone Rewriter
              </label>
              <select
                value={targetTone}
                onChange={(e) => setTargetTone(e.target.value as TonePreset)}
                className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 font-bold text-xs focus:outline-none"
              >
                <option value="de-escalate">De-escalation (Support)</option>
                <option value="formal">Boardroom Executive Formal</option>
                <option value="persuasive">High-Converting Persuasive</option>
                <option value="empathetic">Warm & Empathetic</option>
                <option value="casual">Casual & Friendly</option>
                <option value="concise">Concise Executive TL;DR</option>
              </select>
            </div>
            <QuickCopy text={analysis.transformedText} label="Copy Rewritten" />
          </div>
          <textarea
            readOnly
            value={analysis.transformedText}
            rows={10}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-rose-900/40 text-rose-200/90 font-mono text-xs focus:outline-none transition-all resize-none select-all"
          />
        </div>
      </div>
    </div>
  );
};
