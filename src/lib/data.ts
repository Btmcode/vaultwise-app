
import type { Asset, PortfolioAsset, Transaction, ChartData, AssetSymbol, AutoSavePlan } from "@/lib/types";

export const assets: Record<AssetSymbol, Omit<Asset, 'name'>> = {
  BTC: {
    symbol: "BTC",
    price: 68123.45,
    change24h: 2.5,
  },
  XAU: {
    symbol: "XAU",
    price: 2320.78,
    change24h: -0.8,
  },
  XAG: {
    symbol: "XAG",
    price: 29.55,
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
};

export const portfolioAssets: PortfolioAsset[] = [
  {
    assetSymbol: "BTC",
    amount: 0.5,
    valueUsd: 34061.73,
  },
  {
    assetSymbol: "XAU",
    amount: 10,
    valueUsd: 23207.8,
  },
  {
    assetSymbol: "PAXG",
    amount: 5,
    valueUsd: 11599.95,
  },
];

export const transactions: Transaction[] = [
  {
    id: "1",
    assetSymbol: "BTC",
    type: "Buy",
    amountAsset: 0.01,
    amountUsd: 681.23,
    date: new Date("2024-05-20T10:00:00Z"),
  },
  {
    id: "2",
    assetSymbol: "XAU",
    type: "Auto-Save",
    amountAsset: 0.043,
    amountUsd: 100,
    date: new Date("2024-05-18T09:00:00Z"),
  },
  {
    id: "3",
    assetSymbol: "PAXG",
    type: "Buy",
    amountAsset: 0.215,
    amountUsd: 500,
    date: new Date("2024-05-15T14:30:00Z"),
  },
  {
    id: "4",
    assetSymbol: "XAG",
    type: "Sell",
    amountAsset: 10,
    amountUsd: 295.5,
    date: new Date("2024-05-12T11:00:00Z"),
  },
];

// The auto-save plans have been removed from this array to simulate a persistent 'stop' action.
// In a real application, this data would be fetched from a database, and the 'stop' action
// would trigger a database deletion.
export const autoSavePlans: AutoSavePlan[] = [];

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

export const totalPortfolioValue = portfolioAssets.reduce((sum, asset) => sum + asset.valueUsd, 0);
