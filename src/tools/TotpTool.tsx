import React, { useState, useEffect } from 'react';
import CryptoJS from '../utils/crypto';
import { QuickCopy } from '../components/QuickCopy';
import { Shield, Clock, RefreshCw } from 'lucide-react';

export const TotpTool: React.FC = () => {
  const [secret, setSecret] = useState('JBSWY3DPEHPK3PXP');
  const [token, setToken] = useState('000000');
  const [secondsLeft, setSecondsLeft] = useState(30);

  // Base32 decoder
  const base32toHex = (base32: string) => {
    const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    let hex = '';
    const clean = base32.toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
    for (let i = 0; i < clean.length; i++) {
      const val = base32chars.indexOf(clean.charAt(i));
      if (val === -1) continue;
      bits += val.toString(2).padStart(5, '0');
    }
    for (let i = 0; i + 4 <= bits.length; i += 4) {
      const chunk = bits.substr(i, 4);
      hex += parseInt(chunk, 2).toString(16);
    }
    return hex;
  };

  const generateTotp = (keyBase32: string) => {
    try {
      const epoch = Math.round(new Date().getTime() / 1000.0);
      const timeHex = Math.floor(epoch / 30).toString(16).padStart(16, '0');
      const keyHex = base32toHex(keyBase32);

      const hmac = CryptoJS.HmacSHA1(CryptoJS.enc.Hex.parse(timeHex), CryptoJS.enc.Hex.parse(keyHex));
      const hmacHex = hmac.toString(CryptoJS.enc.Hex);

      const offset = parseInt(hmacHex.substring(hmacHex.length - 1), 16);
      const otp = (parseInt(hmacHex.substr(offset * 2, 8), 16) & 0x7fffffff) + '';
      return otp.substr(otp.length - 6, 6).padStart(6, '0');
    } catch {
      return '------';
    }
  };

  useEffect(() => {
    const update = () => {
      const epoch = Math.round(new Date().getTime() / 1000.0);
      setSecondsLeft(30 - (epoch % 30));
      setToken(generateTotp(secret));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [secret]);

  return (
    <div className="space-y-6">
      {/* Secret Input */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
          2FA Base32 Secret Key:
        </label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value.toUpperCase())}
            placeholder="e.g. JBSWY3DPEHPK3PXP"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm uppercase tracking-wider focus:outline-none"
          />
          <button
            onClick={() => {
              const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
              let s = '';
              for (let i = 0; i < 16; i++) s += chars[Math.floor(Math.random() * chars.length)];
              setSecret(s);
            }}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Random Secret</span>
          </button>
        </div>
      </div>

      {/* Live TOTP Display */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-md text-center flex flex-col items-center justify-center space-y-6">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>Current 6-Digit One-Time Code</span>
        </div>

        <div className="font-mono text-5xl sm:text-7xl font-black tracking-widest text-slate-900 dark:text-white select-all">
          {token.slice(0, 3)} {token.slice(3)}
        </div>

        {/* Circular Countdown Progress */}
        <div className="flex items-center gap-3 text-slate-500">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-semibold">
            Refreshes in <span className="text-indigo-600 dark:text-indigo-400 font-bold font-mono">{secondsLeft}s</span>
          </span>
          <div className="w-24 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-1000"
              style={{ width: `${(secondsLeft / 30) * 100}%` }}
            />
          </div>
        </div>

        <QuickCopy text={token} label="Copy 6-Digit Code" />
      </div>
    </div>
  );
};
