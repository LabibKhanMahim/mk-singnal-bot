import React, { useState } from 'react';
import { Bot, Key, Instagram, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface HeaderProps {
  geminiKey: string;
  setGeminiKey: (key: string) => void;
  twelveDataKey: string;
  setTwelveDataKey: (key: string) => void;
  winRate: number;
  totalSignals: number;
}

export const Header: React.FC<HeaderProps> = ({
  geminiKey,
  setGeminiKey,
  twelveDataKey,
  setTwelveDataKey,
  winRate,
  totalSignals,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempGemini, setTempGemini] = useState(geminiKey);
  const [tempTwelve, setTempTwelve] = useState(twelveDataKey);

  const handleSave = () => {
    setGeminiKey(tempGemini);
    setTwelveDataKey(tempTwelve);
    localStorage.setItem('gemini_api_key', tempGemini);
    localStorage.setItem('twelvedata_api_key', tempTwelve);
    setIsSettingsOpen(false);
  };

  return (
    <header className="border-b border-slate-800 bg-[#0c1019]/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <Bot className="w-7 h-7 text-black stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-orbitron font-extrabold text-xl md:text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                MK TRADER OTC BOT
              </h1>
              <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                v3.5 PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 font-rajdhani flex items-center gap-1.5 mt-0.5">
              <span>Precision Algorithmic Signal Engine</span>
              <span className="inline-block w-1 h-1 rounded-full bg-slate-600"></span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3 h-3 inline" /> OTC & Live Ready
              </span>
            </p>
          </div>
        </div>

        {/* Developer Signature & Instagram Branding */}
        <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-1.5 rounded-2xl border border-slate-800 shadow-inner">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              DEVELOPED BY
            </span>
            <div className="signature-font text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-amber-200 tracking-wide leading-none animate-[signatureDraw_2s_ease-out]">
              MAHIM KHAN
            </div>
          </div>
          <a
            href="https://www.instagram.com/labibkhanmahim?igsi=MTJ4YTR6cWNkYnk3dA=="
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-md shadow-pink-600/20"
            title="Follow MAHIM KHAN on Instagram"
          >
            <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Instagram</span>
          </a>
        </div>

        {/* Live Performance & Settings */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-center">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Accuracy Rate</span>
            <span className="font-orbitron text-emerald-400 text-sm font-bold flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-emerald-400" /> {winRate}%
            </span>
          </div>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition shadow-sm"
          >
            <Key className="w-4 h-4 text-cyan-400" />
            <span>API Keys</span>
            {(geminiKey || twelveDataKey) && (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </button>
        </div>

      </div>

      {/* API Key Modal Drawer */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#121824] border border-cyan-500/30 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-orbitron font-bold text-cyan-400 flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> Configure API Keys
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Enter your API keys to enable live real-time market candlestick data and Gemini AI AI signal verification.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Gemini API Key (For AI Analysis & Chatbot)
                </label>
                <input
                  type="password"
                  value={tempGemini}
                  onChange={(e) => setTempGemini(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Free key from Google AI Studio. Enables smart sentiment analysis & AI Bot chat.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  TwelveData API Key (For Live Market Data)
                </label>
                <input
                  type="password"
                  value={tempTwelve}
                  onChange={(e) => setTempTwelve(e.target.value)}
                  placeholder="twelvedata_api_key..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Optional. If empty, high-precision quantitative simulated OTC generator will run.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black rounded-xl shadow-lg transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
