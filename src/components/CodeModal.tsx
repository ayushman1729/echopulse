'use client';

import React, { useState } from 'react';
import { useApiStore } from '@/store/useApiStore';
import { generateCurl, generateFetch, generateAxios, generatePython } from '@/utils/codeGenerator';
import { X, Check, Copy, Terminal } from 'lucide-react';

export default function CodeModal() {
  const { showCodeModal, setShowCodeModal, activeRequest, environments } = useApiStore();
  const [lang, setLang] = useState<'curl' | 'fetch' | 'axios' | 'python'>('curl');
  const [copied, setCopied] = useState(false);

  if (!showCodeModal) return null;

  // Resolve URL with env vars & params
  let resolvedUrl = activeRequest.url;
  environments.forEach((env) => {
    if (env.enabled && env.key) {
      resolvedUrl = resolvedUrl.replaceAll(`{{${env.key}}}`, env.value);
    }
  });

  let fullUrl = resolvedUrl;
  try {
    const urlObj = new URL(resolvedUrl.startsWith('http') ? resolvedUrl : `https://${resolvedUrl}`);
    activeRequest.params.forEach((p) => {
      if (p.enabled && p.key) {
        urlObj.searchParams.set(p.key, p.value);
      }
    });
    fullUrl = urlObj.toString();
  } catch {
    // Keep fallback
  }

  // Final headers
  const headersMap: Record<string, string> = {};
  activeRequest.headers.forEach((h) => {
    if (h.enabled && h.key) headersMap[h.key] = h.value;
  });
  if (activeRequest.authType === 'bearer' && activeRequest.bearerToken) {
    headersMap['Authorization'] = `Bearer ${activeRequest.bearerToken}`;
  }

  let codeSnippet = '';
  switch (lang) {
    case 'curl':
      codeSnippet = generateCurl(activeRequest, fullUrl, headersMap);
      break;
    case 'fetch':
      codeSnippet = generateFetch(activeRequest, fullUrl, headersMap);
      break;
    case 'axios':
      codeSnippet = generateAxios(activeRequest, fullUrl, headersMap);
      break;
    case 'python':
      codeSnippet = generatePython(activeRequest, fullUrl, headersMap);
      break;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-100">Export Request Snippet</h3>
          </div>
          <button
            onClick={() => setShowCodeModal(false)}
            className="text-zinc-500 hover:text-zinc-200 transition cursor-pointer p-1 rounded hover:bg-zinc-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Tabs & Copy */}
        <div className="px-4 py-2 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            {(['curl', 'fetch', 'axios', 'python'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition cursor-pointer ${
                  lang === l
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Code Snippet */}
        <div className="p-4 flex-1 overflow-auto bg-zinc-950 font-mono text-xs text-zinc-300">
          <pre className="whitespace-pre-wrap leading-relaxed select-all text-emerald-300/90">
            {codeSnippet}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-900/30 flex justify-end">
          <button
            onClick={() => setShowCodeModal(false)}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
