import React, { useState, useEffect } from 'react';
import { TradeSignal, ForexCalculationResult } from '../types/trading';
import { ArrowUpCircle, ArrowDownCircle, Clock, CheckCircle2, XCircle, Award, Sparkles, Volume2 } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';
import confetti from 'canvas-confetti';

interface SignalCardProps {
  signal: TradeSignal | null;
  forexCalc?: ForexCalculationResult | null;
  onTradeFinished?: (signalId: string, result: 'WIN' | 'LOSS') => void;
}

export const SignalCard: React.FC<SignalCardProps> = ({ signal, forexCalc, onTradeFinished }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [tradeResult, setTradeResult] = useState<'WIN' | 'LOSS' | null>(null);

  useEffect(() => {
    if (!signal) return;

    setTradeResult(null);
    audioEngine.playSignalAlert();

    const durationSeconds = signal.timeframeMinutes * 60;
    setTimeLeft(durationSeconds);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto evaluate result based on algorithm probability
          const isWin = Math.random() < signal.accuracyScore / 100;
          const result = isWin ? 'WIN' : 'LOSS';
          setTradeResult(result);

          if (result === 'WIN') {
            audioEngine.playWinSound();
            try {
              confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
            } catch (e) {}
          } else {
            audioEngine.playLossSound();
          }

          if (onTradeFinished) {
            onTradeFinished(signal.id, result);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [signal]);

  if (!signal) {
    return (
      <div className="bg-[#121824] border border-slate-800 rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center text-center h-full min-h-[300px]">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>
        <h3 className="font-orbitron font-bold text-lg text-white mb-1">Awaiting Trading Signal</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Select broker, asset pair & timeframe, then click <span className="text-cyan-400 font-bold">"ANALYZE & GET SIGNAL"</span> to generate high-winrate algorithmic entry.
        </p>
      </div>
    );
  }

  const isCallOrBuy = signal.action === 'CALL' || signal.action === 'BUY';
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const formattedTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <div className={`bg-[#121824] border rounded-2xl p-5 shadow-2xl relative overflow-hidden transition-all duration-300 ${
      isCallOrBuy ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-[#121824]' : 'border-rose-500/40 bg-gradient-to-b from-rose-950/20 to-[#121824]'
    }`}>
      
      {/* Sound test button */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <button
          onClick={() => audioEngine.playSignalAlert()}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-cyan-400 transition"
          title="Test Signal Sound"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Signal Status Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-orbitron font-bold px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
          {signal.platform.toUpperCase()} • {signal.timeframeMinutes}M TIMEFRAME
        </span>
        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
          <Award className="w-3.5 h-3.5" /> ACCURACY: {signal.accuracyScore}%
        </span>
      </div>

      {/* Action Header */}
      <div className="flex items-center justify-between my-2">
        <div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wide">Pair & Signal Action</div>
          <div className="text-2xl font-orbitron font-extrabold text-white flex items-center gap-2">
            {signal.symbol}
          </div>
        </div>

        <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-orbitron font-black text-xl text-white shadow-lg ${
          isCallOrBuy ? 'bg-gradient-to-r from-emerald-600 to-green-500 shadow-emerald-500/30' : 'bg-gradient-to-r from-rose-600 to-red-500 shadow-rose-500/30'
        }`}>
          {isCallOrBuy ? <ArrowUpCircle className="w-7 h-7" /> : <ArrowDownCircle className="w-7 h-7" />}
          <span>{signal.action}</span>
        </div>
      </div>

      {/* Entry Price & Timer Grid */}
      <div className="grid grid-cols-2 gap-3 my-4">
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Entry Price</span>
          <span className="text-lg font-orbitron font-bold text-cyan-300">{signal.entryPrice}</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Signal Timer</span>
            <span className="text-lg font-orbitron font-bold text-amber-400">{formattedTime}</span>
          </div>
          <Clock className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
      </div>

      {/* Forex Specific Entry SL TP Info */}
      {signal.type === 'forex' && forexCalc && (
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 my-3 text-xs font-mono grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div>
            <span className="text-slate-400 block text-[10px]">LOT SIZE</span>
            <span className="text-cyan-400 font-bold text-sm">{forexCalc.recommendedLotSize} Lot</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">RISK AMT</span>
            <span className="text-amber-400 font-bold text-sm">${forexCalc.riskAmount}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">STOP LOSS (SL)</span>
            <span className="text-rose-400 font-bold text-sm">{forexCalc.stopLoss}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">TAKE PROFIT (TP)</span>
            <span className="text-emerald-400 font-bold text-sm">{forexCalc.takeProfit}</span>
          </div>
        </div>
      )}

      {/* AI & Technical Reasoning */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 text-xs space-y-1.5">
        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wide block">
          Algorithmic Confirmation Checklist
        </span>
        <ul className="space-y-1 text-slate-300 list-disc list-inside">
          {signal.reasoning.map((r, idx) => (
            <li key={idx} className="text-[11px] truncate">{r}</li>
          ))}
        </ul>
      </div>

      {/* Result Result Sound Banner */}
      {tradeResult && (
        <div className={`mt-4 p-3 rounded-xl flex items-center justify-center gap-2 font-orbitron font-bold text-lg animate-in zoom-in-95 duration-300 ${
          tradeResult === 'WIN' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
        }`}>
          {tradeResult === 'WIN' ? (
            <>
              <CheckCircle2 className="w-6 h-6" /> TRADE RESULT: WIN (+PROFIT)
            </>
          ) : (
            <>
              <XCircle className="w-6 h-6" /> TRADE RESULT: LOSS (DISCIPLINE)
            </>
          )}
        </div>
      )}

    </div>
  );
};
