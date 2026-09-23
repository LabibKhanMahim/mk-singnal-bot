import React, { useState } from 'react';
import { Platform } from '../types/trading';
import { ExternalLink, Monitor, Maximize2, Minimize2 } from 'lucide-react';

interface BrokerOverlayProps {
  platform: Platform;
}

export const BrokerOverlay: React.FC<BrokerOverlayProps> = ({ platform }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getBrokerUrl = () => {
    switch (platform) {
      case 'quotex':
        return 'https://qxbroker.com';
      case 'olymptrade':
        return 'https://olymptrade.com';
      case 'exness':
        return 'https://www.exness.com';
    }
  };

  return (
    <div className={`bg-[#121824] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${
      isExpanded ? 'fixed inset-4 z-50 bg-[#0a0d14]' : 'h-full min-h-[400px]'
    }`}>
      {/* Header bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-cyan-400" />
          <span className="font-orbitron font-bold text-xs text-white uppercase tracking-wider">
            {platform.toUpperCase()} BROKER LIVE WORKSPACE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={getBrokerUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-lg transition"
          >
            <span>Open Broker Tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
            title={isExpanded ? 'Minimize' : 'Fullscreen Workspace'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Embedded Broker Frame */}
      <div className="flex-1 w-full bg-black relative">
        <iframe
          src={getBrokerUrl()}
          className="w-full h-full min-h-[360px] border-none"
          title={`${platform} broker view`}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
};
