'use client';

import React, { useState } from 'react';
import { useApiStore } from '@/store/useApiStore';
import { Check, Copy, Clock, Database, CheckCircle2, AlertCircle, FileCode, Layers } from 'lucide-react';

export default function ResponsePanel() {
  const { response, responseTab, setResponseTab, isLoading } = useApiStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!response) return;
    const text = typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (status >= 300 && status < 400) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    if (status >= 400 && status < 500) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  const getLatencyColor = (ms: number) => {
    if (ms < 300) return 'text-emerald-400';
    if (ms < 1000) return 'text-amber-400';
    return 'text-rose-400';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 min-h-0">
      {/* Response Bar / Telemetry */}
      <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between text-xs">
        {response ? (
          <div className="flex items-center gap-4">
            {/* Status Code */}
            <div className="flex items-center gap-1.5">
              <span className={`px-2 py-0.5 rounded font-mono font-bold border text-[11px] ${getStatusColor(response.status)}`}>
                {response.status} {response.statusText}
              </span>
            </div>

            {/* Latency */}
            <div className="flex items-center gap-1 text-zinc-400 font-mono text-[11px]">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span className={getLatencyColor(response.timeMs)}>{response.timeMs} ms</span>
            </div>

            {/* Size */}
            <div className="flex items-center gap-1 text-zinc-400 font-mono text-[11px]">
              <Database className="w-3.5 h-3.5 text-zinc-500" />
              <span>{formatBytes(response.sizeBytes)}</span>
            </div>
          </div>
        ) : (
          <span className="text-zinc-500 font-medium">Response Telemetry</span>
        )}

        {/* View Tabs & Copy */}
        {response && (
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-zinc-900 rounded p-0.5 border border-zinc-800">
              <button
                onClick={() => setResponseTab('pretty')}
                className={`px-2 py-0.5 rounded text-[11px] transition cursor-pointer ${
                  responseTab === 'pretty' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Pretty
              </button>
              <button
                onClick={() => setResponseTab('raw')}
                className={`px-2 py-0.5 rounded text-[11px] transition cursor-pointer ${
                  responseTab === 'raw' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Raw
              </button>
              <button
                onClick={() => setResponseTab('headers')}
                className={`px-2 py-0.5 rounded text-[11px] transition cursor-pointer ${
                  responseTab === 'headers' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Headers ({Object.keys(response.headers).length})
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-[11px] transition cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Response Content View */}
      <div className="flex-1 overflow-auto p-4 font-mono text-xs text-zinc-300">
        {!response ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <FileCode className="w-10 h-10 text-zinc-700 mb-3 stroke-[1.2]" />
            <p className="text-sm font-semibold text-zinc-300">No Response Yet</p>
            <p className="text-xs text-zinc-500 max-w-sm mt-1">
              Select an HTTP method, type a target URL, and hit &quot;Send&quot; to inspect response status, headers, and payload.
            </p>
          </div>
        ) : responseTab === 'pretty' ? (
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-300/90 selection:bg-emerald-500/20">
            {typeof response.data === 'string'
              ? response.data
              : JSON.stringify(response.data, null, 2)}
          </pre>
        ) : responseTab === 'raw' ? (
          <pre className="whitespace-pre-wrap leading-relaxed text-zinc-400">
            {typeof response.data === 'string'
              ? response.data
              : JSON.stringify(response.data)}
          </pre>
        ) : (
          <div className="border border-zinc-800 rounded-lg overflow-hidden divide-y divide-zinc-800 bg-zinc-900/40">
            <div className="grid grid-cols-12 text-[11px] font-medium text-zinc-400 p-2 bg-zinc-900/80">
              <div className="col-span-5 px-2">Header Key</div>
              <div className="col-span-7 px-2">Value</div>
            </div>
            {Object.entries(response.headers).map(([key, val]) => (
              <div key={key} className="grid grid-cols-12 p-2 text-xs">
                <div className="col-span-5 px-2 text-zinc-400 font-semibold">{key}</div>
                <div className="col-span-7 px-2 text-zinc-300 break-all">{val}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
