'use client';

import React, { useState } from 'react';
import { useApiStore } from '@/store/useApiStore';
import { History, Trash2, Search, Zap, ExternalLink } from 'lucide-react';

export default function Sidebar() {
  const { history, loadHistoryItem, clearHistory } = useApiStore();
  const [searchTerm, setSearchTerm] = useState('');

  const methodColors: Record<string, string> = {
    GET: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    POST: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    PUT: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    PATCH: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    DELETE: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  const filteredHistory = history.filter((item) =>
    item.request.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.request.method.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="w-72 border-r border-zinc-800 bg-zinc-950 flex flex-col h-[calc(100vh-3.5rem)] select-none">
      {/* Header */}
      <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-300 font-semibold text-xs">
          <History className="w-4 h-4 text-emerald-400" />
          <span>Execution History</span>
          <span className="text-[10px] text-zinc-500 font-mono">({history.length})</span>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            title="Clear History"
            className="text-zinc-500 hover:text-rose-400 p-1 rounded hover:bg-zinc-900 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="p-2 border-b border-zinc-800">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Filter requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 text-zinc-200 placeholder-zinc-500 text-xs pl-8 pr-3 py-1.5 rounded-md border border-zinc-800 focus:outline-none focus:border-zinc-700"
          />
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto divide-y divide-zinc-900/60 p-1">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
            <Zap className="w-6 h-6 text-zinc-600 mb-2 stroke-[1.5]" />
            <p className="text-xs text-zinc-400 font-medium">No requests yet</p>
            <p className="text-[11px] text-zinc-600 mt-1">
              Send a request or click a Quick Demo above to record telemetry.
            </p>
          </div>
        ) : (
          filteredHistory.map((item) => {
            const status = item.response?.status || 0;
            const isOk = status >= 200 && status < 300;
            const isClientErr = status >= 400 && status < 500;
            const isServerErr = status >= 500;

            let statusBadge = 'bg-zinc-800 text-zinc-400';
            if (isOk) statusBadge = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
            else if (isClientErr) statusBadge = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
            else if (isServerErr) statusBadge = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';

            return (
              <div
                key={item.id}
                onClick={() => loadHistoryItem(item)}
                className="group p-2.5 rounded hover:bg-zinc-900/80 cursor-pointer transition flex flex-col gap-1 border border-transparent hover:border-zinc-800"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] font-mono font-bold px-1 py-0.5 rounded border ${
                        methodColors[item.request.method] || 'text-zinc-400'
                      }`}
                    >
                      {item.request.method}
                    </span>
                    {item.response && (
                      <span className={`text-[9px] font-mono px-1 py-0.5 rounded ${statusBadge}`}>
                        {item.response.status}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {item.response?.timeMs ? `${item.response.timeMs}ms` : item.timestamp}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 truncate font-mono mt-0.5 group-hover:text-emerald-400 transition">
                  {item.request.url}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-950/50 flex items-center justify-between text-[11px] text-zinc-500">
        <span>Offline IndexedDB Ready</span>
        <span className="text-emerald-400 font-mono flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Live Proxy
        </span>
      </div>
    </aside>
  );
}
