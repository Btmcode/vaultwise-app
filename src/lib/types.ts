




export type AssetSymbol = "XAU" | "XAG" | "BTC" | "PAXG" | "XAUT" | "XAU_ONS" | "XAU_USD_KG" | "XAU_EUR_KG" | "XAG_ONS" | "XAG_TL" | "XAG_USD" | "XAG_EUR" | "USD_TRY";

export type Asset = {
  symbol: AssetSymbol;
  name: string;
  price?: number; // For crypto
  buyPrice?: number; // For metals/currency
  sellPrice?: number; // For metals/currency
  change24h: number; // percentage
};

export type PortfolioAsset = {
  assetSymbol: AssetSymbol;
  amount: number; // in asset units
};

export type TransactionType = "Buy" | "Sell" | "Auto-Save" | "Deposit" | "Withdraw";

export type Transaction = {
  id: string;
  assetSymbol: AssetSymbol;
  type: TransactionType;
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

export type PreciousMetalItem = {
    "Ürün": string;
    "Değişim": number;
    "Alış": number;
    "Satış": number;
};

export type IbanAccount = {
  id: string;
  accountHolder: string;
  iban: string;
};

export type UserProfile = {
    id: string;
    name: string;
    email: string;
    availableBalanceTRY: number;
};
    
export type FirestoreUser = {
    id: string;
    name: string;
    email: string;
    availableBalanceTRY: number;
    portfolio: PortfolioAsset[];
    ibanAccounts: IbanAccount[];
    transactions: Transaction[];
};
