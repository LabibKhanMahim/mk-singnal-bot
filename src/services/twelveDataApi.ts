import { Candle } from '../types/trading';

/**
 * Fetches real-time candles from TwelveData API or falls back to simulated realistic OTC/Live candles
 */
export async function fetchMarketCandles(
  symbol: string,
  interval: string = '1min',
  apiKey?: string
): Promise<Candle[]> {
  if (apiKey && !symbol.includes('OTC')) {
    try {
      const cleanSymbol = symbol.replace('/', '').split(' ')[0];
      const response = await fetch(
        `https://api.twelvedata.com/time_series?symbol=${cleanSymbol}&interval=${interval}&outputsize=40&apikey=${apiKey}`
      );
      const data = await response.json();

      if (data && data.values && Array.isArray(data.values)) {
        const candles: Candle[] = data.values
          .map((v: any) => ({
            timestamp: new Date(v.datetime).getTime(),
            open: parseFloat(v.open),
            high: parseFloat(v.high),
            low: parseFloat(v.low),
            close: parseFloat(v.close),
            volume: parseFloat(v.volume || '1000'),
          }))
          .reverse();

        if (candles.length > 0) return candles;
      }
    } catch (err) {
      console.warn('TwelveData API fetch failed, falling back to algorithm price generator', err);
    }
  }

  // Fallback Realistic Candle Generator for OTC & Live preview
  return generateSyntheticCandles(symbol);
}

export function generateSyntheticCandles(symbol: string, count: number = 35): Candle[] {
  let basePrice = 1.0850;
  if (symbol.includes('JPY')) basePrice = 155.20;
  if (symbol.includes('XAU') || symbol.includes('Gold')) basePrice = 2740.50;
  if (symbol.includes('BTC')) basePrice = 96500.00;

  const candles: Candle[] = [];
  let currentClose = basePrice;
  const now = Date.now();

  for (let i = count; i >= 0; i--) {
    const timestamp = now - i * 60 * 1000;
    const volatility = basePrice * 0.0008;
    const change = (Math.random() - 0.49) * volatility;
    
    const open = currentClose;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * (volatility * 0.5);
    const low = Math.min(open, close) - Math.random() * (volatility * 0.5);
    const volume = Math.floor(500 + Math.random() * 2000);

    candles.push({
      timestamp,
      open: Number(open.toFixed(5)),
      high: Number(high.toFixed(5)),
      low: Number(low.toFixed(5)),
      close: Number(close.toFixed(5)),
      volume,
    });

    currentClose = close;
  }

  return candles;
}
