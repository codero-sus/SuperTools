import React, { useState } from 'react';
import { QuickCopy } from '../components/QuickCopy';
import { Key, RefreshCw, Lock } from 'lucide-react';

export const RsaTool: React.FC = () => {
  const [modulusLength, setModulusLength] = useState<2048 | 4096>(2048);
  const [publicKeyPem, setPublicKeyPem] = useState<string>('');
  const [privateKeyPem, setPrivateKeyPem] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const arrayBufferToPem = (buffer: ArrayBuffer, type: 'PUBLIC KEY' | 'PRIVATE KEY') => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    let pem = `-----BEGIN ${type}-----\n`;
    for (let i = 0; i < base64.length; i += 64) {
      pem += base64.slice(i, i + 64) + '\n';
    }
    pem += `-----END ${type}-----`;
    return pem;
  };

  const generateKeys = async () => {
    setLoading(true);
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256'
        },
        true,
        ['encrypt', 'decrypt']
      );

      const spki = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
      const pkcs8 = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

      setPublicKeyPem(arrayBufferToPem(spki, 'PUBLIC KEY'));
      setPrivateKeyPem(arrayBufferToPem(pkcs8, 'PRIVATE KEY'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Key Length:</label>
          <div className="inline-flex rounded-lg p-1 bg-slate-100 dark:bg-slate-800">
            {([2048, 4096] as const).map(len => (
              <button
                key={len}
                onClick={() => setModulusLength(len)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  modulusLength === len
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                RSA-{len}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateKeys}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Generating RSA Keys...' : 'Generate Key Pair'}</span>
        </button>
      </div>

      {/* Output PEM keys */}
      {publicKeyPem ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Public Key */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Public Key (SPKI / PEM)
              </span>
              <QuickCopy text={publicKeyPem} label="Copy Public Key" size="sm" />
            </div>
            <textarea
              readOnly
              rows={12}
              value={publicKeyPem}
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 select-all focus:outline-none"
            />
          </div>

          {/* Private Key */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                Private Key (PKCS#8 / PEM)
              </span>
              <QuickCopy text={privateKeyPem} label="Copy Private Key" size="sm" />
            </div>
            <textarea
              readOnly
              rows={12}
              value={privateKeyPem}
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 select-all focus:outline-none"
            />
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Key className="w-10 h-10 text-indigo-500 mx-auto mb-3 opacity-60" />
          <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
            Generate Asymmetric RSA Key Pair
          </p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Keys are generated 100% locally in your browser using the Web Crypto API. Private keys are never uploaded.
          </p>
        </div>
      )}
    </div>
  );
};
