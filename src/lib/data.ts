import type { Asset, PortfolioAsset, Transaction, ChartData, AssetSymbol } from "@/lib/types";

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

const generateChartData = (days: number, baseValue: number, volatility: number) => {
  const data = [];
  let value = baseValue;
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    value *= 1 + (Math.random() - 0.5) * volatility;
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: parseFloat(value.toFixed(2)),
    });
  }
  return data;
};


export const chartData: ChartData = {
  "7d": generateChartData(7, 65000, 0.02),
  "30d": generateChartData(30, 68000, 0.03),
  "1y": generateChartData(365, 45000, 0.05).filter((_, i) => i % 7 === 0).map(d => ({ ...d, date: new Date(new Date().setDate(new Date().getDate() - (365 - d.value / 45000 * 365))).toLocaleDateString("en-US", { month: "short" }) })),
};

export const totalPortfolioValue = portfolioAssets.reduce((sum, asset) => sum + asset.valueUsd, 0);
