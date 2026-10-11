'use client';

import React from 'react';
import { useApiStore } from '@/store/useApiStore';
import { Activity, Code, Settings, Sparkles, Send } from 'lucide-react';

export default function Header() {
  const { loadPreset, setShowCodeModal, setShowEnvModal, environments } = useApiStore();

  const activeEnvCount = environments.filter((e) => e.enabled && e.key).length;

  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur px-4 flex items-center justify-between sticky top-0 z-20">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-zinc-950 font-bold shadow-md shadow-emerald-500/20">
          <Activity className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-zinc-100">EchoPulse</span>
            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              v1.0 Pro
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">In-Browser API Workbench & Telemetry Engine</p>
        </div>
      </div>

      {/* Quick Try Presets */}
      <div className="hidden md:flex items-center gap-2 text-xs">
        <span className="text-zinc-500 flex items-center gap-1 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Quick Demos:
        </span>
        <button
          onClick={() => loadPreset('users')}
          className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition text-[11px] font-mono cursor-pointer"
        >
          GET Users
        </button>
        <button
          onClick={() => loadPreset('posts')}
          className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition text-[11px] font-mono cursor-pointer"
        >
          POST Create
        </button>
        <button
          onClick={() => loadPreset('products')}
          className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition text-[11px] font-mono cursor-pointer"
        >
          GET Products
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowCodeModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-medium transition cursor-pointer shadow-sm"
        >
          <Code className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export Snippet</span>
        </button>

        <button
          onClick={() => setShowEnvModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-medium transition cursor-pointer shadow-sm relative"
        >
          <Settings className="w-3.5 h-3.5 text-zinc-400" />
          <span>Env Vars</span>
          {activeEnvCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] flex items-center justify-center font-bold">
              {activeEnvCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
