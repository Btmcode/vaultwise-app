
"use client"
import * as React from "react"
import { assets as initialAssets } from "@/lib/data";
import { GoldIcon, SilverIcon, BtcIcon, PaxgIcon, XautIcon, InfoIcon } from "@/components/icons";
import type { Asset, AssetSymbol } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";

const iconMap: Record<AssetSymbol, React.FC<React.SVGProps<SVGSVGElement>>> = {
    XAU: GoldIcon,
    XAG: SilverIcon,
    BTC: BtcIcon,
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
const USD_TRY_RATE = 32.5; // Approximate conversion rate

export function LivePrices({ dict, assetNames }: { dict: any, assetNames: any }) {
  const [liveAssets, setLiveAssets] = React.useState<Record<AssetSymbol, LiveAssetData>>(initialAssets);
  const [isLoading, setIsLoading] = React.useState(true);
  const params = useParams();
  const lang = params.lang as 'tr' | 'en';

  const formatCurrency = React.useCallback((value: number, symbol: AssetSymbol) => {
    if (isNaN(value)) return lang === 'tr' ? "₺..." : "$...";

    let displayValue = value;
    let currency = 'TRY';
    let locale = 'tr-TR';
    
    // Priority rule: Check symbol for currency hints
    if (symbol.includes('USD')) {
        currency = 'USD';
        locale = 'en-US';
    } else if (symbol.includes('EUR')) {
        currency = 'EUR';
        locale = 'de-DE'; // Using German locale for Euro formatting
    } else if (symbol.includes('TL')) {
        currency = 'TRY';
        locale = 'tr-TR';
    }
    // General rule: Use language if no hint in symbol
    else if (lang === 'en') {
        currency = 'USD';
        locale = 'en-US';
        // Convert all other prices from TRY to USD for the English view
        displayValue = value / USD_TRY_RATE;
    }

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
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
        for (const symbol in newPrices) {
          if (updatedAssets[symbol as AssetSymbol]) {
            updatedAssets[symbol as AssetSymbol] = {
              ...updatedAssets[symbol as AssetSymbol],
              price: newPrices[symbol].price,
              change24h: newPrices[symbol].change24h,
            };
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

  const assetOrder = Object.keys(liveAssets) as AssetSymbol[];
  
  if (isLoading) {
    return (
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-[76px] w-full" />
            ))}
       </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {assetOrder.map((symbol) => {
        const asset = liveAssets[symbol];
        if (!asset) return null; // Render nothing if asset data is missing
        const Icon = iconMap[asset.symbol] || InfoIcon;
        return (
          <div key={asset.symbol} className="p-1">
              <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-card border h-full">
                  <div className="bg-muted p-2 rounded-full">
                  <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-grow">
                  <p className="font-medium text-sm whitespace-nowrap">{assetNames[asset.symbol]}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(asset.price, asset.symbol)}</p>
                  </div>
                  <div
                  className={cn(
                      "text-xs font-medium",
                      asset.change24h > 0 ? "text-green-500" : "text-red-500"
                  )}
                  >
                  {asset.change24h > 0 ? "+" : ""}
                  {asset.change24h.toFixed(2)}%
                  </div>
              </div>
          </div>
        );
      })}
    </div>
  );
}
