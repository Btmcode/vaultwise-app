

export type AssetSymbol = "XAU" | "XAG" | "BTC" | "PAXG" | "XAUT" | "XAU_ONS" | "XAU_USD_KG" | "XAU_EUR_KG" | "XAG_ONS" | "XAG_TL" | "XAG_USD" | "XAG_EUR";

export type Asset = {
  symbol: AssetSymbol;
  name: string;
  price: number;
  change24h: number; // percentage
};

export type PortfolioAsset = {
  assetSymbol: AssetSymbol;
  amount: number; // in asset units
  valueUsd: number;
};

export type TransactionType = "Buy" | "Sell" | "Auto-Save";

export type Transaction = {
  id: string;
  assetSymbol: AssetSymbol;
  type: TransactionType;
  amountAsset: number;
  amountUsd: number;
  date: Date;
};

export type ChartDataPoint = {
  date: string;
  value: number;
};

export type ChartData = {
  "live": ChartDataPoint[];
  "1d": ChartDataPoint[];
  "1w": ChartDataPoint[];
  "1m": ChartDataPoint[];
  "3m": ChartDataPoint[];
  "6m": ChartDataPoint[];
  "1y": ChartDataPoint[];
  "5y": ChartDataPoint[];
};

export type AutoSavePlan = {
  id: string;
  assetSymbol: AssetSymbol;
  amount: number;
  frequency: "daily" | "weekly" | "monthly";
  status: "active" | "paused" | "cancelled";
};
