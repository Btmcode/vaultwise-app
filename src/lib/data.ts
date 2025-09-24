

import type { Asset, PortfolioAsset, Transaction, ChartData, AssetSymbol, AutoSavePlan } from "@/lib/types";
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

const STORAGE_KEY = 'autoSavePlans';

const initialPlans: AutoSavePlan[] = [
    {
      id: "plan-1",
      assetSymbol: "XAU",
      amount: 100,
      frequency: "monthly",
      status: "active",
    }
];

// Getter to read plans from localStorage
export const getAutoSavePlans = (): AutoSavePlan[] => {
  if (typeof window === 'undefined') {
    // We are on the server, return initial plans
    return initialPlans;
  }
  try {
    const plansJson = window.localStorage.getItem(STORAGE_KEY);
    if (plansJson) {
      return JSON.parse(plansJson);
    } else {
      // If no plans in storage, set initial plans and return them
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPlans));
      return initialPlans;
    }
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return initialPlans;
  }
};

// Function to add a new plan (simulates a DB write)
export const addAutoSavePlan = (plan: Omit<AutoSavePlan, 'id' | 'status' | 'frequency'>): AutoSavePlan[] => {
  const currentPlans = getAutoSavePlans();
  const newPlan: AutoSavePlan = {
    ...plan,
    id: uuidv4(),
    status: 'active',
    frequency: 'monthly', // Defaulting to monthly for simplicity
  };
  const updatedPlans = [...currentPlans, newPlan];
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlans));
  }
  return updatedPlans;
};

// Function to remove a plan (simulates a DB delete)
export const removeAutoSavePlan = (planId: string): AutoSavePlan[] => {
  const currentPlans = getAutoSavePlans();
  const updatedPlans = currentPlans.filter(p => p.id !== planId);
   if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlans));
  }
  return updatedPlans;
};


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

const findLatestPrice = (asset: PortfolioAsset) => {
    const assetData = assets[asset.assetSymbol];
    if (!assetData) return 0;
    return assetData.price || assetData.buyPrice || 0;
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

export const totalPortfolioValue = portfolioAssets.reduce((sum, asset) => sum + (asset.amount * findLatestPrice(asset)), 0);
