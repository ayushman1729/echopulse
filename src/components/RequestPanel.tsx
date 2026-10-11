'use client';

import React from 'react';
import { useApiStore } from '@/store/useApiStore';
import { Plus, Trash2, Key, Shield, AlignLeft, Layers } from 'lucide-react';

export default function RequestPanel() {
  const {
    activeRequest,
    activeTab,
    setActiveTab,
    addParam,
    updateParam,
    removeParam,
    addHeader,
    updateHeader,
    removeHeader,
    setBody,
    setActiveRequest,
  } = useApiStore();

  interface TabItem {
    id: 'params' | 'headers' | 'auth' | 'body';
    label: string;
    count?: number;
    active?: boolean;
  }

  const tabs: TabItem[] = [
    { id: 'params', label: 'Params', count: activeRequest.params.filter((p) => p.enabled && p.key).length },
    { id: 'headers', label: 'Headers', count: activeRequest.headers.filter((h) => h.enabled && h.key).length },
    { id: 'auth', label: 'Auth', active: activeRequest.authType !== 'none' },
    { id: 'body', label: 'Body', active: activeRequest.bodyType !== 'none' && activeRequest.method !== 'GET' },
  ];

  return (
    <div className="flex-1 flex flex-col border-b border-zinc-800 bg-zinc-950/40">
      {/* Tabs Header */}
      <div className="flex items-center gap-1 px-4 border-b border-zinc-800 bg-zinc-900/30 text-xs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2.5 px-3 font-medium transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === tab.id
                ? 'border-emerald-500 text-zinc-100 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-800 text-emerald-400 font-mono">
                {tab.count}
              </span>
            )}
            {tab.active && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            )}
          </button>
        ))}
      </div>

      {/* Tabs Body */}
      <div className="p-4 flex-1 overflow-y-auto">
        {/* PARAMS TAB */}
        {activeTab === 'params' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-medium">Query Parameters</span>
              <button
                onClick={addParam}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Param
              </button>
            </div>

            <div className="border border-zinc-800 rounded-lg overflow-hidden divide-y divide-zinc-800 bg-zinc-900/40">
              <div className="grid grid-cols-12 text-[11px] font-medium text-zinc-400 p-2 bg-zinc-900/80">
                <div className="col-span-1 text-center">Active</div>
                <div className="col-span-5 px-2">Key</div>
                <div className="col-span-5 px-2">Value</div>
                <div className="col-span-1 text-center">Action</div>
              </div>

              {activeRequest.params.length === 0 ? (
                <div className="p-4 text-center text-xs text-zinc-500">
                  No query parameters configured. Click &quot;Add Param&quot; to append URL query keys.
                </div>
              ) : (
                activeRequest.params.map((param) => (
                  <div key={param.id} className="grid grid-cols-12 items-center p-1.5 text-xs">
                    <div className="col-span-1 flex justify-center">
                      <input
                        type="checkbox"
                        checked={param.enabled}
                        onChange={(e) => updateParam(param.id, { enabled: e.target.checked })}
                        className="rounded border-zinc-700 text-emerald-500 focus:ring-0 cursor-pointer"
                      />
                    </div>
                    <div className="col-span-5 px-2">
                      <input
                        type="text"
                        placeholder="Key (e.g. limit)"
                        value={param.key}
                        onChange={(e) => updateParam(param.id, { key: e.target.value })}
                        className="w-full bg-transparent font-mono text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none"
                      />
                    </div>
                    <div className="col-span-5 px-2">
                      <input
                        type="text"
                        placeholder="Value (e.g. 10)"
                        value={param.value}
                        onChange={(e) => updateParam(param.id, { value: e.target.value })}
                        className="w-full bg-transparent font-mono text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button
                        onClick={() => removeParam(param.id)}
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
        )}

        {/* HEADERS TAB */}
        {activeTab === 'headers' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-medium">Request Headers</span>
              <button
                onClick={addHeader}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Header
              </button>
            </div>

            <div className="border border-zinc-800 rounded-lg overflow-hidden divide-y divide-zinc-800 bg-zinc-900/40">
              <div className="grid grid-cols-12 text-[11px] font-medium text-zinc-400 p-2 bg-zinc-900/80">
                <div className="col-span-1 text-center">Active</div>
                <div className="col-span-5 px-2">Header Name</div>
                <div className="col-span-5 px-2">Header Value</div>
                <div className="col-span-1 text-center">Action</div>
              </div>

              {activeRequest.headers.length === 0 ? (
                <div className="p-4 text-center text-xs text-zinc-500">
                  No custom headers added. Default headers like User-Agent are handled automatically.
                </div>
              ) : (
                activeRequest.headers.map((header) => (
                  <div key={header.id} className="grid grid-cols-12 items-center p-1.5 text-xs">
                    <div className="col-span-1 flex justify-center">
                      <input
                        type="checkbox"
                        checked={header.enabled}
                        onChange={(e) => updateHeader(header.id, { enabled: e.target.checked })}
                        className="rounded border-zinc-700 text-emerald-500 focus:ring-0 cursor-pointer"
                      />
                    </div>
                    <div className="col-span-5 px-2">
                      <input
                        type="text"
                        placeholder="Header (e.g. Authorization)"
                        value={header.key}
                        onChange={(e) => updateHeader(header.id, { key: e.target.value })}
                        className="w-full bg-transparent font-mono text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none"
                      />
                    </div>
                    <div className="col-span-5 px-2">
                      <input
                        type="text"
                        placeholder="Value (e.g. application/json)"
                        value={header.value}
                        onChange={(e) => updateHeader(header.id, { value: e.target.value })}
                        className="w-full bg-transparent font-mono text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button
                        onClick={() => removeHeader(header.id)}
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
        )}

        {/* AUTH TAB */}
        {activeTab === 'auth' && (
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Authentication Type</label>
              <select
                value={activeRequest.authType}
                onChange={(e) => setActiveRequest({ authType: e.target.value as any })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
              >
                <option value="none">No Auth</option>
                <option value="bearer">Bearer Token</option>
                <option value="basic">Basic Auth (Username & Password)</option>
              </select>
            </div>

            {activeRequest.authType === 'bearer' && (
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Bearer Token</label>
                <input
                  type="password"
                  placeholder="Paste JWT / API Token here..."
                  value={activeRequest.bearerToken}
                  onChange={(e) => setActiveRequest({ bearerToken: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            )}

            {activeRequest.authType === 'basic' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Username</label>
                  <input
                    type="text"
                    value={activeRequest.basicAuth.username}
                    onChange={(e) =>
                      setActiveRequest({
                        basicAuth: { ...activeRequest.basicAuth, username: e.target.value },
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Password</label>
                  <input
                    type="password"
                    value={activeRequest.basicAuth.password}
                    onChange={(e) =>
                      setActiveRequest({
                        basicAuth: { ...activeRequest.basicAuth, password: e.target.value },
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* BODY TAB */}
        {activeTab === 'body' && (
          <div className="space-y-3 h-full flex flex-col">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-zinc-400 font-medium">Format:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px]">
                  JSON (application/json)
                </span>
              </div>
              <button
                onClick={() => {
                  try {
                    const parsed = JSON.parse(activeRequest.body);
                    setBody(JSON.stringify(parsed, null, 2));
                  } catch {
                    // Ignore format error
                  }
                }}
                className="text-xs text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
              >
                Beautify JSON
              </button>
            </div>

            <textarea
              value={activeRequest.body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="{\n  &quot;key&quot;: &quot;value&quot;\n}"
              rows={8}
              className="w-full flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-3 font-mono text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/40 transition resize-y"
            />
          </div>
        )}
      </div>
    </div>
  );
}
