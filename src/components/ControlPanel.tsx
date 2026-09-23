import React from 'react';
import { Platform, TradingStyle } from '../types/trading';
import { Activity, ShieldAlert, BarChart2, Cpu } from 'lucide-react';

interface ControlPanelProps {
  platform: Platform;
  setPlatform: (p: Platform) => void;
  symbol: string;
  setSymbol: (s: string) => void;
  timeframe: number;
  setTimeframe: (tf: number) => void;
  tradingStyle: TradingStyle;
  setTradingStyle: (style: TradingStyle) => void;
  accountBalance: number;
  setAccountBalance: (bal: number) => void;
  riskPercent: number;
  setRiskPercent: (risk: number) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  platform,
  setPlatform,
  symbol,
  setSymbol,
  timeframe,
  setTimeframe,
  tradingStyle,
  setTradingStyle,
  accountBalance,
  setAccountBalance,
  riskPercent,
  setRiskPercent,
  onAnalyze,
  isAnalyzing,
}) => {
  const getPairOptions = () => {
    if (platform === 'exness') {
      return [
        'EUR/USD',
        'GBP/USD',
        'USD/JPY',
        'XAU/USD (Gold)',
        'BTC/USD (Crypto)',
        'ETH/USD (Crypto)',
      ];
    }
    return [
      'EUR/USD (OTC)',
      'GBP/USD (OTC)',
      'USD/JPY (OTC)',
      'AUD/CAD (OTC)',
      'USD/BRL (OTC)',
      'EUR/GBP (OTC)',
    ];
  };

  return (
    <div className="bg-[#121824] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="font-orbitron font-bold text-sm text-cyan-400 flex items-center gap-2 uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-cyan-400" /> Trading Control Parameters
        </h2>
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
          ALGO V3 ACTIVE
        </span>
      </div>

      {/* 1. Broker Platform Selector */}
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
          1. Select Broker Platform
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setPlatform('quotex');
              setSymbol('EUR/USD (OTC)');
            }}
            className={`py-2 px-3 rounded-xl font-orbitron text-xs font-bold transition border ${
              platform === 'quotex'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            QUOTEX
          </button>

          <button
            type="button"
            onClick={() => {
              setPlatform('olymptrade');
              setSymbol('EUR/USD (OTC)');
            }}
            className={`py-2 px-3 rounded-xl font-orbitron text-xs font-bold transition border ${
              platform === 'olymptrade'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-black border-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            OLYMP TRADE
          </button>

          <button
            type="button"
            onClick={() => {
              setPlatform('exness');
              setSymbol('EUR/USD');
            }}
            className={`py-2 px-3 rounded-xl font-orbitron text-xs font-bold transition border ${
              platform === 'exness'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            EXNESS
          </button>
        </div>
      </div>

      {/* 2. Asset Pair & Timeframe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wide">
            2. Asset Pair
          </label>
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
          >
            {getPairOptions().map((pair) => (
              <option key={pair} value={pair}>
                {pair}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wide">
            3. Signal Timeframe
          </label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
          >
            <option value={1}>1 Minute (Fast Binary)</option>
            <option value={2}>2 Minutes</option>
            <option value={5}>5 Minutes (Standard)</option>
            <option value={15}>15 Minutes</option>
            <option value={30}>30 Minutes</option>
          </select>
        </div>
      </div>

      {/* 3. Forex Specific Parameters (For Exness) */}
      {platform === 'exness' && (
        <div className="bg-slate-950/80 border border-amber-500/20 rounded-xl p-3.5 space-y-3">
          <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase">
            <ShieldAlert className="w-4 h-4" /> Exness Forex Risk Engine
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Trading Style</label>
              <select
                value={tradingStyle}
                onChange={(e) => setTradingStyle(e.target.value as TradingStyle)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value="fast_scalping">Fast Scalping (1m-5m)</option>
                <option value="scalping">Scalping (5m-15m)</option>
                <option value="day_trade">Day Trade (1h-4h)</option>
                <option value="swing_trade">Swing Trade (Daily)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Account Balance ($)</label>
              <input
                type="number"
                value={accountBalance}
                onChange={(e) => setAccountBalance(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Risk Per Trade: {riskPercent}%</span>
              <span>Amt: ${((accountBalance * riskPercent) / 100).toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={riskPercent}
              onChange={(e) => setRiskPercent(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        type="button"
        onClick={onAnalyze}
        disabled={isAnalyzing}
        className="w-full py-3.5 rounded-xl font-orbitron font-extrabold text-sm uppercase tracking-wider text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isAnalyzing ? (
          <>
            <Activity className="w-5 h-5 animate-spin" /> ANALYZING MARKET INDICATORS...
          </>
        ) : (
          <>
            <BarChart2 className="w-5 h-5" /> ANALYZE & GET SIGNAL
          </>
        )}
      </button>
    </div>
  );
};
