'use client';

import React from 'react';
import { useApiStore } from '@/store/useApiStore';
import { HttpMethod } from '@/types/api';
import { Send, Loader2, Sparkles } from 'lucide-react';

export default function UrlBar() {
  const { activeRequest, setMethod, setUrl, sendRequest, isLoading } = useApiStore();

  const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

  const methodTextColors: Record<HttpMethod, string> = {
    GET: 'text-emerald-400',
    POST: 'text-amber-400',
    PUT: 'text-blue-400',
    PATCH: 'text-purple-400',
    DELETE: 'text-rose-400',
    HEAD: 'text-zinc-400',
    OPTIONS: 'text-cyan-400',
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      sendRequest();
    }
  };

  return (
    <div className="p-4 border-b border-zinc-800 bg-zinc-900/40">
      <div className="flex items-center gap-2 max-w-6xl">
        {/* Method Dropdown */}
        <div className="relative">
          <select
            value={activeRequest.method}
            onChange={(e) => setMethod(e.target.value as HttpMethod)}
            className={`h-11 px-3 py-2 bg-zinc-900 border border-zinc-750 rounded-lg text-xs font-mono font-bold appearance-none cursor-pointer pr-8 focus:outline-none focus:border-zinc-600 ${
              methodTextColors[activeRequest.method]
            }`}
          >
            {methods.map((m) => (
              <option key={m} value={m} className="bg-zinc-900 text-zinc-200">
                {m}
              </option>
            ))}
          </select>
          <div className="absolute right-2.5 top-3.5 pointer-events-none text-zinc-500 text-[10px]">
            ▼
          </div>
        </div>

        {/* URL Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={activeRequest.url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter request URL (e.g. https://api.example.com/v1/users or {{baseUrl}}/users)"
            className="w-full h-11 bg-zinc-900 border border-zinc-750 rounded-lg px-4 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition"
          />
          {activeRequest.url.includes('{{') && (
            <span className="absolute right-3 top-3 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
              env active
            </span>
          )}
        </div>

        {/* Send Button */}
        <button
          onClick={sendRequest}
          disabled={isLoading || !activeRequest.url}
          className={`h-11 px-5 rounded-lg flex items-center gap-2 font-medium text-xs transition cursor-pointer shadow-md ${
            isLoading || !activeRequest.url
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold shadow-emerald-500/20'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
