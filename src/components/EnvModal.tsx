'use client';

import React from 'react';
import { useApiStore } from '@/store/useApiStore';
import { X, Plus, Trash2, Settings, Variable } from 'lucide-react';

export default function EnvModal() {
  const { showEnvModal, setShowEnvModal, environments, addEnvVar, updateEnvVar, removeEnvVar } = useApiStore();

  if (!showEnvModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Variable className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-100">Environment Variables</h3>
          </div>
          <button
            onClick={() => setShowEnvModal(false)}
            className="text-zinc-500 hover:text-zinc-200 transition cursor-pointer p-1 rounded hover:bg-zinc-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info */}
        <div className="px-4 py-2.5 bg-zinc-900/40 border-b border-zinc-800 text-xs text-zinc-400">
          Use variables anywhere in your URL, headers, or body using{' '}
          <code className="text-emerald-400 font-mono bg-zinc-900 px-1 py-0.5 rounded border border-zinc-800">
            &#123;&#123;variableName&#125;&#125;
          </code>
        </div>

        {/* Variables List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Active Variables</span>
            <button
              onClick={addEnvVar}
              className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Variable
            </button>
          </div>

          <div className="border border-zinc-800 rounded-lg overflow-hidden divide-y divide-zinc-800 bg-zinc-900/30">
            <div className="grid grid-cols-12 text-[11px] font-medium text-zinc-400 p-2 bg-zinc-900/80">
              <div className="col-span-1 text-center">Active</div>
              <div className="col-span-5 px-2">Variable Key</div>
              <div className="col-span-5 px-2">Value</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            {environments.length === 0 ? (
              <div className="p-4 text-center text-xs text-zinc-500">
                No environment variables defined.
              </div>
            ) : (
              environments.map((env) => (
                <div key={env.id} className="grid grid-cols-12 items-center p-2 text-xs">
                  <div className="col-span-1 flex justify-center">
                    <input
                      type="checkbox"
                      checked={env.enabled}
                      onChange={(e) => updateEnvVar(env.id, { enabled: e.target.checked })}
                      className="rounded border-zinc-700 text-emerald-500 focus:ring-0 cursor-pointer"
                    />
                  </div>
                  <div className="col-span-5 px-2">
                    <input
                      type="text"
                      placeholder="e.g. baseUrl"
                      value={env.key}
                      onChange={(e) => updateEnvVar(env.id, { key: e.target.value })}
                      className="w-full bg-transparent font-mono text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-5 px-2">
                    <input
                      type="text"
                      placeholder="e.g. https://api.io"
                      value={env.value}
                      onChange={(e) => updateEnvVar(env.id, { value: e.target.value })}
                      className="w-full bg-transparent font-mono text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => removeEnvVar(env.id)}
                      className="text-zinc-500 hover:text-rose-400 transition cursor-pointer p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-900/30 flex justify-end">
          <button
            onClick={() => setShowEnvModal(false)}
            className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold transition cursor-pointer"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
