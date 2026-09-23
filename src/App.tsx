import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { CandleChart } from './components/CandleChart';
import { SignalCard } from './components/SignalCard';
import { BrokerOverlay } from './components/BrokerOverlay';
import { AiChatbot } from './components/AiChatbot';

import { Platform, Candle, TradeSignal, ForexCalculationResult, TradingStyle } from './types/trading';
import { fetchMarketCandles, generateSyntheticCandles } from './services/twelveDataApi';
import { generateTradingSignal } from './services/algoEngine';
import { calculateForexRisk } from './services/forexCalculator';
import { analyzeSignalWithGemini } from './services/geminiApi';

export default function App() {
  const [geminiKey, setGeminiKey] = useState<string>(() => localStorage.getItem('gemini_api_key') || '');
  const [twelveDataKey, setTwelveDataKey] = useState<string>(() => localStorage.getItem('twelvedata_api_key') || '');

  const [platform, setPlatform] = useState<Platform>('quotex');
  const [symbol, setSymbol] = useState<string>('EUR/USD (OTC)');
  const [timeframe, setTimeframe] = useState<number>(1);
  const [tradingStyle, setTradingStyle] = useState<TradingStyle>('scalping');
  const [accountBalance, setAccountBalance] = useState<number>(1000);
  const [riskPercent, setRiskPercent] = useState<number>(2);

  const [candles, setCandles] = useState<Candle[]>([]);
  const [currentSignal, setCurrentSignal] = useState<TradeSignal | null>(null);
  const [forexCalc, setForexCalc] = useState<ForexCalculationResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const [tradeHistory, setTradeHistory] = useState<{ id: string; result: 'WIN' | 'LOSS' }[]>([]);

  // Load candle data on selection change
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      const data = await fetchMarketCandles(symbol, `${timeframe}min`, twelveDataKey);
      if (isMounted) {
        setCandles(data);
      }
    };
    loadData();

    // Auto update live candle price every 10 seconds
    const interval = setInterval(() => {
      loadData();
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [symbol, timeframe, twelveDataKey]);

  // Main Analyze & Generate Signal trigger
  const handleAnalyzeAndGenerateSignal = async () => {
    setIsAnalyzing(true);

    // Refresh live candles
    const freshCandles = await fetchMarketCandles(symbol, `${timeframe}min`, twelveDataKey);
    setCandles(freshCandles);

    // 1. Generate core technical signal
    const signal = generateTradingSignal(platform, symbol, freshCandles, timeframe, tradingStyle);

    // 2. Forex Risk Calculator if Exness
    if (platform === 'exness') {
      const fxRes = calculateForexRisk({
        accountBalance,
        riskPercentage: riskPercent,
        leverage: 100,
        style: tradingStyle,
        entryPrice: signal.entryPrice,
        symbol,
      });
      setForexCalc(fxRes);
      signal.stopLoss = fxRes.stopLoss;
      signal.takeProfit = fxRes.takeProfit;
      signal.lotSize = fxRes.recommendedLotSize;
    } else {
      setForexCalc(null);
    }

    // 3. Gemini AI Sentiment Boost if API key exists
    if (geminiKey) {
      const aiRes = await analyzeSignalWithGemini(geminiKey, signal);
      if (aiRes.enhancedReasoning) {
        signal.reasoning.unshift(`[Gemini AI] ${aiRes.enhancedReasoning}`);
      }
      signal.accuracyScore = Math.min(98, Math.max(82, Math.round((signal.accuracyScore + aiRes.sentimentScore) / 2)));
    }

    setCurrentSignal(signal);
    setIsAnalyzing(false);
  };

  const handleTradeFinished = (signalId: string, result: 'WIN' | 'LOSS') => {
    setTradeHistory((prev) => [...prev, { id: signalId, result }]);
  };

  const totalTrades = tradeHistory.length;
  const winCount = tradeHistory.filter((t) => t.result === 'WIN').length;
  const currentWinRate = totalTrades > 0 ? Math.round((winCount / totalTrades) * 100) : 89;

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col font-rajdhani selection:bg-cyan-500 selection:text-black">
      
      {/* Top Navigation Bar */}
      <Header
        geminiKey={geminiKey}
        setGeminiKey={setGeminiKey}
        twelveDataKey={twelveDataKey}
        setTwelveDataKey={setTwelveDataKey}
        winRate={currentWinRate}
        totalSignals={totalTrades}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* Top Control Panel & Signal Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <ControlPanel
              platform={platform}
              setPlatform={setPlatform}
              symbol={symbol}
              setSymbol={setSymbol}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              tradingStyle={tradingStyle}
              setTradingStyle={setTradingStyle}
              accountBalance={accountBalance}
              setAccountBalance={setAccountBalance}
              riskPercent={riskPercent}
              setRiskPercent={setRiskPercent}
              onAnalyze={handleAnalyzeAndGenerateSignal}
              isAnalyzing={isAnalyzing}
            />
          </div>

          <div className="lg:col-span-7">
            <SignalCard
              signal={currentSignal}
              forexCalc={forexCalc}
              onTradeFinished={handleTradeFinished}
            />
          </div>
        </div>

        {/* Real-time Candlestick Chart & Embedded Broker Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <CandleChart candles={candles.length > 0 ? candles : generateSyntheticCandles(symbol)} symbol={symbol} />
          </div>

          <div className="lg:col-span-5">
            <BrokerOverlay platform={platform} />
          </div>
        </div>

      </main>

      {/* Floating Gemini AI Chatbot */}
      <AiChatbot
        geminiKey={geminiKey}
        contextInfo={`Platform: ${platform.toUpperCase()}, Symbol: ${symbol}, Timeframe: ${timeframe}m, Action: ${currentSignal?.action || 'None'}`}
      />

      {/* Footer Branding */}
      <footer className="border-t border-slate-800 bg-[#0c1019] py-4 text-center text-xs text-slate-500 font-mono">
        <p>© 2025 MK TRADER OTC BOT • Designed & Developed by MAHIM KHAN • Signals for educational and quantitative analysis.</p>
      </footer>

    </div>
  );
}
