
"use client"
import * as React from "react"
import { assets as initialAssets } from "@/lib/data";
import { GoldIcon, SilverIcon, BtcIcon, PaxgIcon, XautIcon, InfoIcon } from "@/components/icons";
import type { Asset, AssetSymbol } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";

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
};

type LiveAssetData = Omit<Asset, 'name'>;
const USD_TRY_RATE = 32.5;

const assetOrder: AssetSymbol[] = [
    "XAU",
    "XAU_ONS",
    "XAU_USD_KG",
    "XAU_EUR_KG",
    "PAXG",
    "XAUT",
    "XAG",
    "XAG_ONS",
    "XAG_TL",
    "XAG_USD",
    "XAG_EUR",
    "BTC",
];

export function LivePrices({ dict, assetNames }: { dict: any, assetNames: any }) {
  const [liveAssets, setLiveAssets] = React.useState<Record<string, LiveAssetData>>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const params = useParams();
  const lang = params.lang as 'tr' | 'en';

  const formatCurrency = React.useCallback((value: number, symbol: AssetSymbol) => {
    if (isNaN(value)) return lang === 'tr' ? "₺..." : "$...";

    let displayValue = value;
    let currency = 'TRY';
    let locale = 'tr-TR';
    
    // Priority rule: check symbol for explicit currency
    if (symbol.includes('USD')) {
        currency = 'USD';
        locale = 'en-US';
    } else if (symbol.includes('EUR')) {
        currency = 'EUR';
        locale = 'de-DE'; // Use German locale for Euro formatting
    } else if (symbol.includes('TL')) {
        currency = 'TRY';
        locale = 'tr-TR';
    } else if (lang === 'en') {
        // Fallback for EN: Convert from TRY to USD if not BTC
        // BTC from CoinMarketCap is already in USD
        currency = 'USD';
        locale = 'en-US';
        if (symbol !== 'BTC') {
            displayValue = value / USD_TRY_RATE;
        }
    }
    // Default is TRY for 'tr' language

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 2,
    }).format(displayValue);
  }, [lang]);

  const fetchPrices = React.useCallback(async () => {
    try {
      const response = await fetch('/api/prices');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const newPrices: Record<string, { price: number; change24h: number }> = await response.json();
      
       setLiveAssets(prevAssets => {
        const updatedAssets = { ...prevAssets };
        
        // Merge fetched prices
        for (const symbol in newPrices) {
            if (Object.prototype.hasOwnProperty.call(newPrices, symbol)) {
                updatedAssets[symbol] = {
                    ...initialAssets[symbol as AssetSymbol], 
                    ...updatedAssets[symbol], 
                    price: newPrices[symbol].price,
                    change24h: newPrices[symbol].change24h,
                };
            }
        }
        
        // Ensure all initial assets are present, even if not fetched
        for (const symbol in initialAssets) {
            if (!updatedAssets[symbol]) {
                updatedAssets[symbol] = initialAssets[symbol as AssetSymbol];
            }
        }
        return updatedAssets;
      });

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
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-[76px] w-full" />
            ))}
       </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {assetOrder.map((symbol) => {
        const asset = liveAssets[symbol];
        if (!asset) return null;
        const Icon = iconMap[symbol] || InfoIcon;
        return (
          <div key={symbol} className="p-1">
              <div className="flex items-center justify-start gap-3 p-4 rounded-lg bg-card border h-full">
                  <Icon className="h-8 w-8 flex-shrink-0" />
                  <div className="flex-grow">
                  <p className="font-medium text-sm whitespace-nowrap">{assetNames[symbol]}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(asset.price, symbol as AssetSymbol)}</p>
                  </div>
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
          </div>
        );
      })}
    </div>
  );
}
