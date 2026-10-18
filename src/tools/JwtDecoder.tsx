import React, { useState, useMemo } from 'react';
import { QuickCopy } from '../components/QuickCopy';
import { ShieldCheck, ShieldAlert, Clock, Key } from 'lucide-react';

export const JwtDecoder: React.FC = () => {
  const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE4OTM0NTYwMDB9.4PclnE2nhS6rr619ORg3Hp7pdj-5n4ddXlg54MYOMf4');

  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    const parts = token.trim().split('.');
    if (parts.length < 2) {
      return { error: 'Invalid JWT structure. JWT tokens must contain at least 2 dot-separated base64 segments.' };
    }

    try {
      const base64UrlDecode = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) base64 += '=';
        return decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      };

      const headerJson = JSON.parse(base64UrlDecode(parts[0]));
      const payloadJson = JSON.parse(base64UrlDecode(parts[1]));

      let isExpired = false;
      let expDate: Date | null = null;
      let iatDate: Date | null = null;

      if (payloadJson.exp) {
        expDate = new Date(payloadJson.exp * 1000);
        isExpired = expDate.getTime() < Date.now();
      }

      if (payloadJson.iat) {
        iatDate = new Date(payloadJson.iat * 1000);
      }

      return {
        header: headerJson,
        payload: payloadJson,
        signature: parts[2] || '',
        isExpired,
        expDate,
        iatDate,
        rawParts: parts
      };
    } catch (e: any) {
      return { error: `Failed to decode JWT: ${e.message}` };
    }
  }, [token]);

  return (
    <div className="space-y-6">
      {/* Token Input */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
          Paste Encoded JSON Web Token:
        </label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={4}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 break-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </div>

      {decoded?.error ? (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm">
          {decoded.error}
        </div>
      ) : decoded ? (
        <div className="space-y-6">
          {/* Status banner */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {decoded.expDate ? (
                decoded.isExpired ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Token Expired ({decoded.expDate.toLocaleString()})</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Token Active (Expires: {decoded.expDate.toLocaleString()})</span>
                  </div>
                )
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>No Expiration Claim (exp) set</span>
                </div>
              )}
            </div>

            {decoded.iatDate && (
              <span className="text-xs text-slate-500">
                Issued At: {decoded.iatDate.toLocaleString()}
              </span>
            )}
          </div>

          {/* Decoded Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Header Block */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                  Header (Algorithm & Type)
                </span>
                <QuickCopy text={JSON.stringify(decoded.header, null, 2)} size="sm" />
              </div>
              <pre className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 font-mono text-xs sm:text-sm text-rose-600 dark:text-rose-400 overflow-x-auto">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>

            {/* Payload Block */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                  Payload (Claims & Data)
                </span>
                <QuickCopy text={JSON.stringify(decoded.payload, null, 2)} size="sm" />
              </div>
              <pre className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 font-mono text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 overflow-x-auto">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </div>
          </div>

          {/* Signature */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block mb-2">
              Signature Hash
            </span>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 font-mono text-xs text-cyan-600 dark:text-cyan-400 break-all">
              {decoded.signature || '(No signature segment)'}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
