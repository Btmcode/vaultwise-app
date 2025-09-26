
"use client";
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
} from "@/components/icons";

const assetOrder: string[] = [
  "HAS ALTIN",
  "Altın/ONS",
  "USD/KG",
  "EUR/KG",
  "GÜM/ONS",
  "GÜM/TL",
  "GÜM/USD",
  "GÜM/EUR",
];

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  "HAS ALTIN": GoldBarIcon,
  "Altın/ONS": GoldIcon,
  "USD/KG": GoldIcon,
  "EUR/KG": GoldIcon,
  "GÜM/ONS": SilverIcon,
  "GÜM/TL": SilverIcon,
  "GÜM/USD": SilverIcon,
  "GÜM/EUR": SilverIcon,
};

export function LivePrices({ dict }: { dict: any }) {
  const { liveAssets, loading, error, lastUpdated, refreshData } = useLivePrices();
  const livePricesDict = dict.livePrices;

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
    }

    const formatted = new Intl.NumberFormat(locale, {
      style: "decimal",
      maximumFractionDigits: symbol === "USD_TRY" ? 4 : 2,
      minimumFractionDigits: 2,
    }).format(price);
    
    if (currency === "TRY") {
      return `${formatted} TL`;
    }

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: symbol === "USD_TRY" ? 4 : 2,
      minimumFractionDigits: 2,
    }).format(price);
  };

  const getIcon = (symbol: string) => {
    return iconMap[symbol] || InfoIcon;
  };
  
  const displayAssets = assetOrder.map(symbol => liveAssets[symbol]).filter(Boolean);

  if (loading && displayAssets.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end items-center">
          <Skeleton className="h-8 w-1/4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-[140px] w-full" />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {displayAssets.map((item) => {
          if (!item) return null;

          const symbol = item.symbol;
          const Icon = getIcon(symbol);
          const buyPrice = item.buyPrice;
          const sellPrice = item.sellPrice;
          const change24h = item.change24h || 0;

          return (
            <div
              key={symbol}
              className={cn(
                "flex flex-col justify-between gap-4 p-4 rounded-lg bg-card border transition-colors duration-300",
                getChangeBgColor(change24h)
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-10 w-10 flex-shrink-0",
                      symbol === "HAS ALTIN" && "h-12 w-12"
                    )}
                  />
                  <div className="flex flex-col justify-center">
                    <p className="font-semibold text-base whitespace-nowrap">
                      {symbol}
                    </p>
                    <div className="text-xs text-muted-foreground grid grid-cols-[auto_1fr] gap-x-2">
                      <span className="font-medium whitespace-nowrap">
                        {livePricesDict.buy}:
                      </span>
                      <span className="font-mono text-right whitespace-nowrap">
                        {formatPrice(buyPrice, symbol)}
                      </span>
                      <span className="font-medium whitespace-nowrap">
                        {livePricesDict.sell}:
                      </span>
                      <span className="font-mono text-right whitespace-nowrap">
                        {formatPrice(sellPrice, symbol)}
                      </span>
                    </div>
                  </div>
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
