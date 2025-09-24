"use client"
import * as React from "react"
import { assets as initialAssetsData } from "@/lib/data";
import { GoldIcon, SilverIcon, BtcIcon, PaxgIcon, XautIcon, UsdTryIcon, InfoIcon } from "@/components/icons";
import type { Asset, AssetSymbol } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    BTC: BtcIcon,
    XAU: GoldIcon,
    XAG: SilverIcon,
    PAXG: PaxgIcon,
    XAUT: XautIcon,
    XAU_ONS: GoldIcon,
    XAU_USD_KG: GoldIcon,
    XAU_EUR_KG: GoldIcon,
    XAG_ONS: SilverIcon,
    XAG_TL: SilverIcon,
    XAG_USD: SilverIcon,
    XAG_EUR: SilverIcon,
    USD_TRY: UsdTryIcon,
};

type LiveAssetData = Omit<Asset, 'name'>;

const assetOrder: string[] = [
  "XAU",
  "XAU_ONS",
  "XAU_USD_KG",
  "XAU_EUR_KG",
  "XAG",
  "XAG_ONS",
  "XAG_TL",
  "XAG_USD",
  "XAG_EUR",
  "BTC",
  "PAXG",
  "XAUT",
  "USD_TRY",
];

export function LivePrices({ assetNames }: { assetNames: any }) {
  const [liveAssets, setLiveAssets] = React.useState<Record<string, LiveAssetData>>({});
  const [isLoading, setIsLoading] = React.useState(true);

  const formatCurrency = React.useCallback((value: number | undefined, symbol: string) => {
    if (value === undefined || isNaN(value)) return "...";

    let currency = 'TRY';
    let locale = 'tr-TR';
    
    if (symbol.includes('USD') || symbol === 'BTC' || symbol === 'PAXG' || symbol === 'XAUT' || symbol === 'XAU_ONS' || symbol === 'XAG_ONS') {
        currency = 'USD';
        locale = 'en-US';
    } else if (symbol.includes('EUR')) {
        currency = 'EUR';
        locale = 'de-DE';
    }

    if (symbol === 'USD_TRY') {
        currency = 'TRY';
        locale = 'tr-TR';
    }

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: symbol === 'USD_TRY' ? 4 : 2,
      minimumFractionDigits: 2,
    }).format(value);
  }, []);

  const fetchPrices = React.useCallback(async () => {
    try {
      const response = await fetch('/api/prices');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const newPrices: Record<string, any> = await response.json();
      
      const updatedAssets: Record<string, LiveAssetData> = {};
      for (const symbol of assetOrder) {
          const initialAsset = initialAssetsData[symbol as AssetSymbol];
          const livePrice = newPrices[symbol];
          if (initialAsset) {
              updatedAssets[symbol] = { ...initialAsset, ...livePrice };
          }
      }
      setLiveAssets(updatedAssets);

    } catch (error) {
      console.error("Failed to fetch live prices:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 2000); 

    return () => clearInterval(interval);
  }, [fetchPrices]);
  
  if (isLoading) {
    return (
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {assetOrder.map((symbol) => (
                <Skeleton key={symbol} className="h-[88px] w-full" />
            ))}
       </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {assetOrder.map((symbol) => {
        const asset = liveAssets[symbol];
        if (!asset) return null;
        const Icon = iconMap[symbol] || InfoIcon;
        const isCrypto = 'price' in asset;

        return (
          <div key={symbol} className="p-1">
              <div className="flex items-center justify-start gap-4 p-4 rounded-lg bg-card border h-full">
                  <Icon className="h-10 w-10 flex-shrink-0" />
                  <div className="flex-grow flex flex-col justify-center">
                    <div className="flex items-center justify-between w-full">
                        <p className="font-semibold text-base whitespace-nowrap">{assetNames[symbol]}</p>
                         <div
                            className={cn(
                                "text-xs font-medium",
                                asset.change24h >= 0 ? "text-green-500" : "text-red-500"
                            )}
                            >
                            {asset.change24h >= 0 ? "+" : ""}
                            {asset.change24h.toFixed(2)}%
                        </div>
                    </div>
                    
                    {isCrypto ? (
                         <p className="text-sm text-muted-foreground">{formatCurrency(asset.price, symbol)}</p>
                    ) : (
                        <div className="text-xs text-muted-foreground grid grid-cols-2 gap-x-3">
                            <div>
                                <span className="font-medium">Alış: </span>{formatCurrency(asset.buyPrice, symbol)}
                            </div>
                            <div>
                                <span className="font-medium">Satış: </span>{formatCurrency(asset.sellPrice, symbol)}
                            </div>
                        </div>
                    )}
                  </div>
              </div>
          </div>
        );
      })}
    </div>
  );
}
