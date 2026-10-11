'use client';

import React from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import UrlBar from '@/components/UrlBar';
import RequestPanel from '@/components/RequestPanel';
import ResponsePanel from '@/components/ResponsePanel';
import CodeModal from '@/components/CodeModal';
import EnvModal from '@/components/EnvModal';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Header */}
      <Header />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Right Active Workspace */}
        <main className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
          {/* Method and URL Input Bar */}
          <UrlBar />

          {/* Dual Panel Split: Top Request Config, Bottom Response Telemetry */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden divide-y divide-zinc-800">
            {/* Top Half: Request Panel (Params, Headers, Auth, Body) */}
            <div className="h-1/2 flex flex-col overflow-hidden">
              <RequestPanel />
            </div>

            {/* Bottom Half: Response Viewer & Telemetry Metrics */}
            <div className="h-1/2 flex flex-col overflow-hidden">
              <ResponsePanel />
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <CodeModal />
      <EnvModal />
    </div>
  );
}
