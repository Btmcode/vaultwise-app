

import type { Asset, PortfolioAsset, Transaction, ChartData, AssetSymbol, AutoSavePlan, IbanAccount, UserProfile } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';

export const assets: Record<string, Omit<Asset, 'name'>> = {
  BTC: {
    symbol: "BTC",
    price: 68123.45,
    change24h: 2.5,
  },
  XAU: {
    symbol: "XAU",
    buyPrice: 2450.12,
    sellPrice: 2445.50,
    change24h: -0.8,
  },
  XAG: {
    symbol: "XAG",
    buyPrice: 31.55,
    sellPrice: 31.40,
    change24h: -1.2,
  },
  PAXG: {
    symbol: "PAXG",
    price: 2319.99,
    change24h: -0.7,
  },
  XAUT: {
    symbol: "XAUT",
    price: 2321.1,
    change24h: -0.75,
  },
  XAU_ONS: { symbol: "XAU_ONS", buyPrice: 2329.43, sellPrice: 2328.00, change24h: -0.78 },
  XAU_USD_KG: { symbol: "XAU_USD_KG", buyPrice: 74932.8, sellPrice: 74900.00, change24h: -0.78 },
  XAU_EUR_KG: { symbol: "XAU_EUR_KG", buyPrice: 69821.5, sellPrice: 69800.00, change24h: -0.78 },
  XAG_ONS: { symbol: "XAG_ONS", buyPrice: 29.58, sellPrice: 29.50, change24h: -1.5 },
  XAG_TL: { symbol: "XAG_TL", buyPrice: 31.0, sellPrice: 30.90, change24h: -1.5 },
  XAG_USD: { symbol: "XAG_USD", buyPrice: 29.58, sellPrice: 29.50, change24h: -1.5 },
  XAG_EUR: { symbol: "XAG_EUR", buyPrice: 27.56, sellPrice: 27.50, change24h: -1.5 },
  USD_TRY: { symbol: "USD_TRY", buyPrice: 32.85, sellPrice: 32.80, change24h: 0.1 },
};

// --- Chart Data ---
const generateChartData = (period: 'day' | 'week' | 'month' | 'year', count: number, baseValue: number, volatility: number) => {
  const data = [];
  let value = baseValue;
  const now = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now);
    if (period === 'day') {
      date.setDate(now.getDate() - i);
    } else if (period === 'week') {
      date.setDate(now.getDate() - (i * 7));
    } else if (period === 'month') {
        date.setMonth(now.getMonth() - i);
    } else if (period === 'year') {
        date.setFullYear(now.getFullYear() - i);
    }
    
    value *= 1 + (Math.random() - 0.5) * volatility;
    data.push({
      date: date.toISOString(),
      value: parseFloat(value.toFixed(2)),
    });
  }
  return data;
};

const generateLiveChartData = (minutes: number, baseValue: number, volatility: number) => {
  const data = [];
  let value = baseValue;
  const now = new Date();
  for (let i = minutes - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setMinutes(now.getMinutes() - i);
    value *= 1 + (Math.random() - 0.5) * volatility;
    data.push({
      date: date.toISOString(),
      value: parseFloat(value.toFixed(2)),
    });
  }
  return data;
}

export const chartData: ChartData = {
  "live": generateLiveChartData(60, 68000, 0.005),
  "1d": generateChartData('day', 24, 68200, 0.01),
  "1w": generateChartData('day', 7, 67500, 0.02),
  "1m": generateChartData('day', 30, 69000, 0.03),
  "3m": generateChartData('week', 12, 65000, 0.04),
  "6m": generateChartData('week', 26, 62000, 0.045),
  "1y": generateChartData('month', 12, 45000, 0.05),
  "5y": generateChartData('month', 60, 20000, 0.08),
};
