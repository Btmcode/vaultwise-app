
"use client";
import { useState } from "react";
import { useLivePrices } from "@/hooks/useLivePrices";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  GoldIcon,
  SilverIcon,
  InfoIcon,
  GoldBarIcon,
  BtcIcon,
  PaxgIcon,
  XautIcon,
  UsdTryIcon,
} from "@/components/icons";
import { BuyDialog } from "./buy-dialog";
import { SellDialog } from "./sell-dialog";
import type { AssetSymbol, PortfolioAsset } from "@/lib/types";


const assetOrder: string[] = [
  "HAS ALTIN",
  "Altın/ONS",
  "Altın USD/Kg",
  "Altın EUR/Kg",
  "Gümüş/ONS",
  "Gümüş/TL",
  "Gümüş/USD",
  "Gümüş/EUR",
  "Bitcoin",
  "PAX Gold",
  "Tether Gold",
  "USD/TRY",
];

const apiSymbolMap: Record<string, AssetSymbol> = {
    "HAS ALTIN": "XAU",
    "Altın/ONS": "XAU_ONS",
    "Altın USD/Kg": "XAU_USD_KG",
    "Altın EUR/Kg": "XAU_EUR_KG",
    "Gümüş/ONS": "XAG_ONS",
    "Gümüş/TL": "XAG_TL",
    "Gümüş/USD": "XAG_USD",
    "Gümüş/EUR": "XAG_EUR",
    "Bitcoin": "BTC",
    "PAX Gold": "PAXG",
    "Tether Gold": "XAUT",
    "USD/TRY": "USD_TRY",
}

type LivePricesProps = {
    dict: any;
    portfolioAssets: PortfolioAsset[];
};

export function LivePrices({ dict, portfolioAssets }: LivePricesProps) {
  const { liveAssets, loading, error, lastUpdated, refreshData } = useLivePrices();
  const livePricesDict = dict.livePrices;

  const [dialogState, setDialogState] = useState<{
    type: 'buy' | 'sell';
    asset: AssetSymbol;
    isOpen: boolean;
  } | null>(null);

  const openDialog = (type: 'buy' | 'sell', asset: AssetSymbol) => {
    setDialogState({ type, asset, isOpen: true });
  };

  const closeDialog = () => {
    if (dialogState) {
      setDialogState({ ...dialogState, isOpen: false });
      setTimeout(() => setDialogState(null), 300);
    }
  };

  const getChangeBgColor = (change: number) => {
    if (change > 0) return "border-green-500/50";
    if (change < 0) return "border-red-500/50";
    return "border-border";
  };

  const formatPrice = (price: number | undefined, symbol: string) => {
    if (price === undefined || isNaN(price)) return "...";

    let currency = "USD";
    let locale = "en-US";
    
    if (symbol.includes("EUR")) {
      currency = "EUR";
      locale = "de-DE";
    } else if (symbol.includes("TL") || symbol === "HAS ALTIN") {
      currency = "TRY";
      locale = "tr-TR";
    } else if (symbol === "USD/TRY") {
        currency = "TRY";
        locale = "tr-TR";
    }
    
    const options: Intl.NumberFormatOptions = {
        style: 'decimal',
        maximumFractionDigits: symbol === "USD/TRY" ? 4 : 2,
        minimumFractionDigits: 2,
    };
    
    if(currency !== 'TRY'){
        options.style = 'currency';
        options.currency = currency;
    }
    
    const formatted = new Intl.NumberFormat(locale, options).format(price);

    return currency === "TRY" ? `${formatted} TL` : formatted;
  };

  const getIcon = (symbol: string) => {
    return iconMap[symbol] || InfoIcon;
  };
  
  const displayAssets = assetOrder.map(displayName => {
      const apiSymbol = apiSymbolMap[displayName];
      const assetData = liveAssets[apiSymbol];
      if (assetData) {
          return { ...assetData, displayName, apiSymbol };
      }
      return null;
  }).filter(Boolean);

  const renderCardContent = (item: any) => {
    const displayName = item.displayName;
    const isCrypto = displayName === 'Bitcoin' || displayName === 'PAX Gold' || displayName === 'Tether Gold';
    
    if (isCrypto || displayName === 'USD/TRY') {
      return (
        <div className="flex flex-col justify-center">
            <p className="font-semibold text-lg whitespace-nowrap">{displayName}</p>
             <p className="font-mono text-xl font-bold whitespace-nowrap text-left">{formatPrice(item.price, displayName)}</p>
        </div>
      );
    }

    return (
       <div className="flex flex-col justify-center">
        <p className="font-semibold text-base whitespace-nowrap">
          {displayName}
        </p>
        <div className="text-xs text-muted-foreground grid grid-cols-[auto_1fr] gap-x-2">
          <span className="font-medium whitespace-nowrap">
            {livePricesDict.buy}:
          </span>
          <span className="font-mono text-right whitespace-nowrap">
            {formatPrice(item.buyPrice, displayName)}
          </span>
          <span className="font-medium whitespace-nowrap">
            {livePricesDict.sell}:
          </span>
          <span className="font-mono text-right whitespace-nowrap">
            {formatPrice(item.sellPrice, displayName)}
          </span>
        </div>
      </div>
    );
  }

  if (loading && displayAssets.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end items-center">
          <Skeleton className="h-8 w-1/4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <Skeleton key={index} className="h-[100px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end items-center">
          <Button size="sm" variant="outline" onClick={refreshData} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {livePricesDict.refresh}
          </Button>
        </div>
        <div className="text-red-500 p-4 rounded-md bg-red-50 border border-red-200">
          {livePricesDict.error}: {error}
        </div>
      </div>
    );
  }

  return (
    <>
        <div className="space-y-4">
        <div className="flex justify-end items-center">
            <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
                {livePricesDict.lastUpdated}: {lastUpdated}
            </div>
            <Button
                size="sm"
                variant="outline"
                onClick={refreshData}
                disabled={loading}
            >
                <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                {livePricesDict.refresh}
            </Button>
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayAssets.map((item) => {
            if (!item) return null;

            const displayName = item.displayName;
            const Icon = getIcon(displayName);
            const change24h = item.change24h || 0;
            const apiSymbol = item.apiSymbol as AssetSymbol;

            return (
                <div
                key={displayName}
                className={cn(
                    "flex flex-col justify-between gap-4 p-4 rounded-lg bg-card border-2 transition-colors duration-300",
                    getChangeBgColor(change24h)
                )}
                >
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                    <Icon className={cn("h-10 w-10 flex-shrink-0")} />
                    {renderCardContent(item)}
                    </div>
                    <div
                    className={cn(
                        "text-sm font-bold pl-2 whitespace-nowrap",
                        change24h > 0 ? "text-green-500" : "text-red-500"
                    )}
                    >
                    {change24h >= 0 ? "+" : ""}
                    {change24h.toFixed(2)}%
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => openDialog('buy', apiSymbol)} size="sm" className="w-full bg-primary/90 hover:bg-primary text-primary-foreground">{dict.portfolioSummary.buyDialog.shortTitle}</Button>
                    <Button onClick={() => openDialog('sell', apiSymbol)} variant="secondary" size="sm" className="w-full">{dict.portfolioSummary.sellDialog.shortTitle}</Button>
                </div>
                </div>
            );
            })}
        </div>
        </div>
        
        {dialogState && dialogState.type === 'buy' && (
            <BuyDialog
                dict={dict}
                portfolioAssets={portfolioAssets}
                preselectedAsset={dialogState.asset}
                isOpen={dialogState.isOpen}
                onOpenChange={closeDialog}
            />
        )}

        {dialogState && dialogState.type === 'sell' && (
            <SellDialog
                dict={dict}
                portfolioAssets={portfolioAssets}
                preselectedAsset={dialogState.asset}
                isOpen={dialogState.isOpen}
                onOpenChange={closeDialog}
            />
        )}
    </>
  );
}
