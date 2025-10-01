
export type AssetSymbol = "XAU" | "XAG" | "XAU_ONS" | "XAU_USD_KG" | "XAU_EUR_KG" | "XAG_ONS" | "XAG_TL" | "XAG_USD" | "XAG_EUR" | "USD_TRY";

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
  date: string; // Changed from Date to string to ensure serializability
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
    id: string;
    Urun: string;
    Alis: number;
    Satis: number;
    DegisimYuzde?: number;
    displayOrder?: number;
};

// A generic type for any asset coming from Firestore before mapping.
export type FirestoreAsset = {
    id: string;
    // Fields for metals
    Urun?: string;
    Alis?: number;
    Satis?: number;
    DegisimYuzde?: number;
    // Fields for crypto or other assets
    name?: string;
    price?: number;
    change24h?: number;
    // Common fields
    displayOrder?: number;
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
    photoURL?: string | null;
};
    
export type FirestoreUser = {
    id:string;
    name: string;
    email: string;
    availableBalanceTRY: number;
    portfolio: PortfolioAsset[];
    ibanAccounts: IbanAccount[];
    transactions: Transaction[];
    photoURL?: string | null;
};

export type LiveAssetData = {
    symbol: string;
    buyPrice?: number;
    sellPrice?: number;
    change24h: number;
    price?: number; 
    displayOrder: number;
};

export type MarketAnalysisOutput = {
  sentiment: 'Yükseliş' | 'Düşüş' | 'Nötr';
  keyAsset: string;
  analysis: string;
};

export type AutomatedSavingsGoalOutput = {
  suggestedGoal: string;
  suggestedAmount: number;
  suggestedAsset: string;
  rationale: string;
}
