import React from 'react';
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Bar, Line } from 'recharts';
import { Candle, TechnicalIndicators } from '../types/trading';

interface CandleChartProps {
  candles: Candle[];
  symbol: string;
  indicators?: TechnicalIndicators;
}

export const CandleChart: React.FC<CandleChartProps> = ({ candles, symbol }) => {
  const chartData = candles.map((c) => {
    const isGreen = c.close >= c.open;
    return {
      time: new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
      color: isGreen ? '#00e676' : '#ff1744',
    };
  });

  const minPrice = Math.min(...candles.map((c) => c.low));
  const maxPrice = Math.max(...candles.map((c) => c.high));
  const padding = (maxPrice - minPrice) * 0.1 || 0.001;

  return (
    <div className="bg-[#121824] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <h3 className="font-orbitron font-bold text-sm text-cyan-400 uppercase tracking-wider">
            {symbol} Real-Time Candlestick Chart
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
          Last Price: {candles[candles.length - 1]?.close.toFixed(5)}
        </span>
      </div>

      <div className="w-full h-64 md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} />
            <YAxis
              domain={[minPrice - padding, maxPrice + padding]}
              stroke="#475569"
              fontSize={10}
              orientation="right"
              tickFormatter={(v) => Number(v).toFixed(symbol.includes('JPY') ? 2 : 4)}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-[#0a0d14]/95 border border-cyan-500/30 p-2.5 rounded-xl text-xs font-mono shadow-xl backdrop-blur-md">
                      <div className="text-cyan-400 font-bold border-b border-slate-800 pb-1 mb-1">
                        Time: {data.time}
                      </div>
                      <div className="text-slate-300">Open: <span className="text-white">{data.open}</span></div>
                      <div className="text-slate-300">High: <span className="text-emerald-400">{data.high}</span></div>
                      <div className="text-slate-300">Low: <span className="text-rose-400">{data.low}</span></div>
                      <div className="text-slate-300">Close: <span className="text-cyan-300">{data.close}</span></div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line type="monotone" dataKey="high" stroke="#38bdf8" strokeWidth={1} dot={false} opacity={0.3} />
            <Bar dataKey="close" fill="#00e676" radius={[2, 2, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
