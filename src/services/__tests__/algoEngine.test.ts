import { describe, it, expect } from 'vitest';
import { calculateEMA, calculateRSI, calculateMACD, generateTradingSignal } from '../algoEngine';
import { Candle } from '../../types/trading';

describe('MK TRADER OTC BOT Algorithm Engine', () => {
  it('calculates EMA correctly', () => {
    const prices = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    const ema = calculateEMA(prices, 5);
    expect(ema.length).toBe(10);
    expect(ema[ema.length - 1]).toBeGreaterThan(15);
  });

  it('calculates RSI correctly', () => {
    const prices = [100, 102, 101, 103, 105, 104, 106, 108, 107, 109, 111, 110, 112, 114, 113, 115];
    const rsi = calculateRSI(prices, 14);
    expect(rsi).toBeGreaterThan(50);
    expect(rsi).toBeLessThanOrEqual(100);
  });

  it('generates high win-rate trading signal', () => {
    const mockCandles: Candle[] = Array.from({ length: 30 }, (_, i) => ({
      timestamp: Date.now() - (30 - i) * 60000,
      open: 1.1000 + i * 0.0002,
      high: 1.1005 + i * 0.0002,
      low: 1.0998 + i * 0.0002,
      close: 1.1004 + i * 0.0002,
      volume: 1000 + i * 10,
    }));

    const signal = generateTradingSignal('quotex', 'EUR/USD (OTC)', mockCandles, 1, 'scalping');
    expect(signal.accuracyScore).toBeGreaterThanOrEqual(78);
    expect(signal.accuracyScore).toBeLessThanOrEqual(96);
    expect(['CALL', 'PUT', 'BUY', 'SELL']).toContain(signal.action);
    expect(signal.reasoning.length).toBeGreaterThan(0);
  });
});
