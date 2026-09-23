export type Platform = 'quotex' | 'olymptrade' | 'exness';

export type TradeType = 'binary' | 'forex';

export type TradingStyle = 'scalping' | 'fast_scalping' | 'day_trade' | 'swing_trade';

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  ema9: number;
  ema21: number;
  ema50: number;
  ema200: number;
  rsi: number;
  macd: {
    macdLine: number;
    signalLine: number;
    histogram: number;
  };
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
  };
  stochastic: {
    k: number;
    d: number;
  };
  candlestickPattern: 'DOJI' | 'BULLISH_ENGULFING' | 'BEARISH_ENGULFING' | 'HAMMER' | 'SHOOTING_STAR' | 'NONE';
}

export interface TradeSignal {
  id: string;
  platform: Platform;
  symbol: string;
  isOtc: boolean;
  type: TradeType;
  action: 'CALL' | 'PUT' | 'BUY' | 'SELL';
  timeframeMinutes: number;
  timestamp: number;
  expiryTimestamp: number;
  entryPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  lotSize?: number;
  accuracyScore: number; // e.g., 88%
  confidenceLevel: 'HIGH' | 'VERY_HIGH' | 'MAXIMUM';
  reasoning: string[];
  indicators: TechnicalIndicators;
  status: 'PENDING' | 'ACTIVE' | 'WIN' | 'LOSS';
}

export interface ForexRiskParams {
  accountBalance: number;
  riskPercentage: number;
  leverage: number;
  style: TradingStyle;
  entryPrice: number;
  symbol: string;
}

export interface ForexCalculationResult {
  recommendedLotSize: number;
  riskAmount: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  stopLossPips: number;
  takeProfitPips: number;
  riskRewardRatio: string;
}
