export type AssetSymbol = "XAU" | "XAG" | "BTC" | "PAXG" | "XAUT";

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
  "7d": ChartDataPoint[];
  "30d": ChartDataPoint[];
  "1y": ChartDataPoint[];
};
