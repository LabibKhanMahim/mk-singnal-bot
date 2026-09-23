import { ForexRiskParams, ForexCalculationResult, TradingStyle } from '../types/trading';

/**
 * Calculates Forex Lot size, Risk amount, Stop Loss, and Take Profit based on trading style and account parameters.
 */
export function calculateForexRisk(params: ForexRiskParams): ForexCalculationResult {
  const { accountBalance, riskPercentage, entryPrice, style, symbol } = params;

  const riskAmount = (accountBalance * Math.min(riskPercentage, 100)) / 100;

  // Determine Pip multiplier based on asset class (JPY pairs, Gold vs major forex)
  const isJpy = symbol.toUpperCase().includes('JPY');
  const isGold = symbol.toUpperCase().includes('XAU') || symbol.toUpperCase().includes('GOLD');
  const isCrypto = symbol.toUpperCase().includes('BTC') || symbol.toUpperCase().includes('ETH');

  let pipSize = 0.0001;
  if (isJpy) pipSize = 0.01;
  else if (isGold) pipSize = 0.1;
  else if (isCrypto) pipSize = 1.0;

  // Determine Stop Loss and Take Profit distances in Pips according to trading style
  let slPips = 20;
  let tpPips = 40;

  switch (style) {
    case 'fast_scalping':
      slPips = 5;
      tpPips = 10;
      break;
    case 'scalping':
      slPips = 12;
      tpPips = 25;
      break;
    case 'day_trade':
      slPips = 30;
      tpPips = 75;
      break;
    case 'swing_trade':
      slPips = 80;
      tpPips = 240;
      break;
  }

  // Calculate Standard Lot Size: Lot = Risk Amount / (SL Pips * Pip Value per Lot)
  // Standard Lot pip value for standard FX pair is ~$10 per pip for 1.0 lot
  let pipValuePerLot = 10;
  if (isGold) pipValuePerLot = 10;
  if (isCrypto) pipValuePerLot = 1;

  let lotSize = riskAmount / (slPips * pipValuePerLot);
  // Round to 2 decimal places (standard micro-lots minimum 0.01)
  lotSize = Math.max(0.01, Number(lotSize.toFixed(2)));

  const stopLoss = Number((entryPrice - slPips * pipSize).toFixed(5));
  const takeProfit = Number((entryPrice + tpPips * pipSize).toFixed(5));

  const riskRewardRatio = `1:${(tpPips / slPips).toFixed(1)}`;

  return {
    recommendedLotSize: lotSize,
    riskAmount: Number(riskAmount.toFixed(2)),
    entryPrice,
    stopLoss,
    takeProfit,
    stopLossPips: slPips,
    takeProfitPips: tpPips,
    riskRewardRatio,
  };
}
