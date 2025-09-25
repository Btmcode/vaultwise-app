
'use client';
import { useLivePrices } from '@/hooks/useLivePrices';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { GoldIcon, SilverIcon, InfoIcon, GoldBarIcon, BtcIcon, PaxgIcon, XautIcon, UsdTryIcon } from "@/components/icons";

const assetOrder = [
  "XAU",
  "XAU_ONS",
  "XAU_USD_KG",
  "XAU_EUR_KG",
  "XAG_ONS",
  "XAG_TL",
  "XAG_USD",
  "XAG_EUR",
  "BTC",
  "PAXG",
  "XAUT",
  "USD_TRY"
];

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    BTC: BtcIcon,
    XAU: GoldBarIcon, // Has Altın için Külçe ikonu
    PAXG: PaxgIcon,
    XAUT: XautIcon,
    XAU_ONS: GoldIcon, // Diğer altınlar için Para ikonu
    XAU_USD_KG: GoldIcon,
    XAU_EUR_KG: GoldIcon,
    XAG: SilverIcon,
    XAG_ONS: SilverIcon,
    XAG_TL: SilverIcon,
    XAG_USD: SilverIcon,
    XAG_EUR: SilverIcon,
    USD_TRY: UsdTryIcon,
};

export function LivePrices({ dict }: { dict: any }) {
  const { liveAssets, loading, error, lastUpdated, refreshData } = useLivePrices();
  const assetNames = dict.assetNames;
  const livePricesDict = dict.livePrices;

  const getChangeBgColor = (change: number) => {
    if (change > 0) return 'border-green-500 bg-green-500/20';
    if (change < 0) return 'border-red-500 bg-red-500/20';
    return 'border-border';
  }

 const formatPrice = (price: number | undefined, symbol: string) => {
    if (price === undefined || isNaN(price)) return "...";

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
    }).format(price);
  };
  
  const getIcon = (symbol: string) => {
    return iconMap[symbol] || InfoIcon;
  }

  if (loading && Object.keys(liveAssets).length === 0) {
    return (
        <div className="space-y-4">
             <div className="flex justify-end items-center">
                <Skeleton className="h-8 w-1/4" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-[88px] w-full" />
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
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    {livePricesDict.refresh}
                </Button>
            </div>
            <div className="text-red-500 p-4 rounded-md bg-red-50 border border-red-200">
                {livePricesDict.error}: {error.message}
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-4">
        <div className="flex justify-end items-center">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {livePricesDict.lastUpdated}: {lastUpdated}
              </div>
              <Button size="sm" variant="outline" onClick={refreshData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {livePricesDict.refresh}
              </Button>
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {assetOrder.map((symbol) => {
                const item = liveAssets[symbol];
                if (!item) return null;
                const Icon = getIcon(symbol);
                const isCrypto = 'price' in item && item.price !== undefined;
                return (
                <div key={symbol} className="p-1">
                    <div className={cn(
                        "flex items-center justify-start gap-4 p-4 rounded-lg bg-card border h-full transition-colors duration-300",
                        getChangeBgColor(item.change24h)
                    )}>
                        <Icon className={cn("h-10 w-10 flex-shrink-0", symbol === 'XAU' && 'h-12 w-12')} />
                        <div className="flex-grow flex flex-col justify-center overflow-hidden">
                            <div className="flex items-center justify-between w-full">
                                <p className="font-semibold text-base whitespace-nowrap">{assetNames[symbol] || symbol}</p>
                                <div className={cn("text-xs font-medium pl-2 whitespace-nowrap", item.change24h > 0 ? "text-green-500" : "text-red-500")}>
                                    {item.change24h >= 0 ? "+" : ""}
                                    {item.change24h.toFixed(2)}%
                                </div>
                            </div>
                           {isCrypto ? (
                                <p className="text-sm text-muted-foreground">{formatPrice(item.price, symbol)}</p>
                            ) : (
                                <div className="text-xs text-muted-foreground grid grid-cols-[auto_1fr] gap-x-2">
                                    <span className="font-medium whitespace-nowrap">{livePricesDict.buy}:</span>
                                    <span className="font-mono text-right whitespace-nowrap">{formatPrice(item.buyPrice, symbol)}</span>
                                    <span className="font-medium whitespace-nowrap">{livePricesDict.sell}:</span>
                                    <span className="font-mono text-right whitespace-nowrap">{formatPrice(item.sellPrice, symbol)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )})}
        </div>
    </div>
  );
}
