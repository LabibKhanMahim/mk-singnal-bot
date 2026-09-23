import { describe, it, expect } from 'vitest';
import { calculateForexRisk } from '../forexCalculator';

describe('Forex Risk Calculator', () => {
  it('calculates recommended lot size and risk correctly for Scalping', () => {
    const result = calculateForexRisk({
      accountBalance: 1000,
      riskPercentage: 2,
      leverage: 100,
      style: 'scalping',
      entryPrice: 1.0850,
      symbol: 'EUR/USD'
    });

    expect(result.riskAmount).toBe(20);
    expect(result.stopLossPips).toBe(12);
    expect(result.takeProfitPips).toBe(25);
    expect(result.recommendedLotSize).toBeGreaterThan(0);
    expect(result.stopLoss).toBeLessThan(result.entryPrice);
    expect(result.takeProfit).toBeGreaterThan(result.entryPrice);
  });

  it('handles Gold (XAUUSD) pip size correctly', () => {
    const result = calculateForexRisk({
      accountBalance: 500,
      riskPercentage: 5,
      leverage: 200,
      style: 'fast_scalping',
      entryPrice: 2050.00,
      symbol: 'XAU/USD (Gold)'
    });

    expect(result.riskAmount).toBe(25);
    expect(result.stopLossPips).toBe(5);
    expect(result.takeProfitPips).toBe(10);
    expect(result.stopLoss).toBe(2049.5);
    expect(result.takeProfit).toBe(2051.0);
  });
});
