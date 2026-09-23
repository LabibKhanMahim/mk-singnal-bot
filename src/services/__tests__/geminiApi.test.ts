import { describe, it, expect } from 'vitest';
import { analyzeSignalWithGemini } from '../geminiApi';
import { TradeSignal } from '../../types/trading';

describe('Gemini API Integration Fallback Test', () => {
  it('returns graceful fallback when API key is missing or invalid', async () => {
    const mockSignal: TradeSignal = {
      id: 'MK-123456',
      platform: 'quotex',
      symbol: 'EUR/USD (OTC)',
      isOtc: true,
      type: 'binary',
      action: 'CALL',
      timeframeMinutes: 1,
      timestamp: Date.now(),
      expiryTimestamp: Date.now() + 60000,
      entryPrice: 1.0850,
      accuracyScore: 88,
      confidenceLevel: 'VERY_HIGH',
      reasoning: ['Bullish EMA'],
      indicators: {
        ema9: 1.0852,
        ema21: 1.0848,
        ema50: 1.0840,
        ema200: 1.0820,
        rsi: 58,
        macd: { macdLine: 0.0002, signalLine: 0.0001, histogram: 0.0001 },
        bollinger: { upper: 1.0860, middle: 1.0850, lower: 1.0840 },
        stochastic: { k: 60, d: 55 },
        candlestickPattern: 'NONE',
      },
      status: 'ACTIVE',
    };

    const res = await analyzeSignalWithGemini('', mockSignal);
    expect(res.sentimentScore).toBeGreaterThan(70);
    expect(res.enhancedReasoning).toBeDefined();
    expect(res.aiAdvice).toBeDefined();
  });
});
