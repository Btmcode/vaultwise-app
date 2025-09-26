
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
  BtcIcon,
  PaxgIcon,
  XautIcon,
  UsdTryIcon,
  GoldBarIcon,
} from "@/components/icons";
import { BuyDialog } from "./buy-dialog";
import { SellDialog } from "./sell-dialog";
import type { AssetSymbol, PortfolioAsset } from "@/lib/types";


const assetOrder: string[] = [
  "HAS ALTIN",
  "Altın/ONS",
  "Bitcoin",
  "PAX Gold",
  "Tether Gold",
  "USD/TRY",
  "Gümüş/ONS",
  "Gümüş/TL",
];

const apiSymbolMap: Record<string, AssetSymbol> = {
    "HAS ALTIN": "XAU",
    "Altın/ONS": "XAU_ONS",
    "Bitcoin": "BTC",
    "PAX Gold": "PAXG",
    "Tether Gold": "XAUT",
    "USD/TRY": "USD_TRY",
    "Gümüş/ONS": "XAG_ONS",
    "Gümüş/TL": "XAG_TL",
}

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    "HAS ALTIN": GoldBarIcon,
    "Altın/ONS": GoldIcon,
    "Bitcoin": BtcIcon,
    "PAX Gold": PaxgIcon,
    "Tether Gold": XautIcon,
    "USD/TRY": UsdTryIcon,
    "Gümüş/ONS": SilverIcon,
    "Gümüş/TL": SilverIcon,
};

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

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-500";
    if (change < 0) return "text-red-500";
    return "text-muted-foreground";
  };

  const formatPrice = (price: number | undefined, symbol: string) => {
    if (price === undefined || isNaN(price)) return "...";

    let currency = "USD";
    let locale = "en-US";
    
    if (symbol.includes("TL") || symbol === "HAS ALTIN") {
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
  
  const displayAssets = assetOrder.map(displayName => {
      const apiSymbol = apiSymbolMap[displayName];
      const assetData = liveAssets[apiSymbol];
      if (assetData) {
          return { ...assetData, displayName, apiSymbol };
      }
      return null;
  }).filter(Boolean);

  const renderContent = () => {
    if (loading && displayAssets.length === 0) {
      return Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="h-[140px] w-full" />
      ));
    }

    if (error) {
        return (
             <div className="col-span-full text-red-500 p-4 rounded-md bg-red-50 border border-red-200 dark:bg-destructive dark:text-destructive-foreground">
                {livePricesDict.error}: {error}
            </div>
        )
    }

    return displayAssets.map((item) => {
        if (!item) return null;

        const displayName = item.displayName;
        const Icon = iconMap[displayName];
        const change24h = item.change24h || 0;
        const apiSymbol = item.apiSymbol as AssetSymbol;
        const price = item.price ?? item.buyPrice ?? item.sellPrice;
        const hasBuySell = item.buyPrice !== undefined && item.sellPrice !== undefined;

        return (
            <div key={displayName} className="flex flex-col justify-between gap-3 p-4 rounded-lg bg-card border shadow-sm transition-all duration-300 h-full hover:shadow-lg hover:border-primary/50">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <Icon className="h-10 w-10 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-lg">{displayName}</p>
                            <p className={cn("text-xs text-muted-foreground")}>
                               {hasBuySell ? (
                                   <>
                                    <span>{dict.assetList.buy}: {formatPrice(item.buyPrice, displayName)}</span><br/>
                                    <span>{dict.assetList.sell}: {formatPrice(item.sellPrice, displayName)}</span>
                                   </>
                               ) : (
                                    formatPrice(price, displayName)
                               )}
                            </p>
                        </div>
                    </div>
                     <div className={cn("text-sm font-bold pl-2 whitespace-nowrap", getChangeColor(change24h))}>
                        {change24h >= 0 ? "+" : ""}
                        {change24h.toFixed(2)}%
                    </div>
                </div>
                 <div className="flex gap-2">
                    <Button onClick={() => openDialog('buy', apiSymbol)} size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">{dict.portfolioSummary.buyDialog.shortTitle}</Button>
                    <Button onClick={() => openDialog('sell', apiSymbol)} variant="destructive" size="sm" className="w-full">{dict.portfolioSummary.sellDialog.shortTitle}</Button>
                </div>
            </div>
        );
    });
  }


  return (
    <>
        <div className="space-y-4">
            <div className="flex justify-end items-center">
                <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                    {livePricesDict.lastUpdated}: {lastUpdated}
                </div>
                <Button size="sm" variant="outline" onClick={refreshData} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    {livePricesDict.refresh}
                </Button>
                </div>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {renderContent()}
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

    