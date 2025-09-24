
"use client"
import * as React from "react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import { assets as initialAssets } from "@/lib/data";
import { GoldIcon, SilverIcon, BtcIcon, PaxgIcon, XautIcon } from "@/components/icons";
import type { Asset, AssetSymbol } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<AssetSymbol, React.FC<React.SVGProps<SVGSVGElement>>> = {
    XAU: GoldIcon,
    XAG: SilverIcon,
    BTC: BtcIcon,
    PAXG: PaxgIcon,
    XAUT: XautIcon
};

const formatCurrency = (value: number) => {
  if (isNaN(value)) return "$...";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

type LiveAssetData = Omit<Asset, 'name'>;

export function LivePrices({ dict, assetNames }: { dict: any, assetNames: any }) {
  const [liveAssets, setLiveAssets] = React.useState<Record<AssetSymbol, LiveAssetData>>(initialAssets);
  const [isLoading, setIsLoading] = React.useState(true);

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
    fetchPrices(); // İlk yüklemede verileri çek
    const interval = setInterval(fetchPrices, 30000); // Her 30 saniyede bir tekrar çek

    return () => clearInterval(interval); // Bileşen kaldırıldığında interval'i temizle
  }, [fetchPrices]);

  const assetOrder = Object.keys(liveAssets) as AssetSymbol[];
  
  if (isLoading) {
    return (
       <div className="w-full overflow-hidden">
         <div className="flex -ml-4 p-1">
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/5 pl-4">
                    <Skeleton className="h-[76px] w-full" />
                </div>
            ))}
         </div>
       </div>
    )
  }

  return (
    <div className="w-full">
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            plugins={[
                Autoplay({
                    delay: 5000, // Animasyon hızını biraz yavaşlattık
                }),
            ]}
            className="w-full"
        >
            <CarouselContent>
            {assetOrder.map((symbol) => {
                const asset = liveAssets[symbol];
                const Icon = iconMap[asset.symbol];
                return (
                <CarouselItem key={asset.symbol} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
                    <div className="p-1">
                        <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-card border h-full">
                            <div className="bg-muted p-2 rounded-full">
                            <Icon className="h-6 w-6" />
                            </div>
                            <div className="flex-grow">
                            <p className="font-medium text-sm whitespace-nowrap">{assetNames[asset.symbol]}</p>
                            <p className="text-xs text-muted-foreground">{formatCurrency(asset.price)}</p>
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
                </CarouselItem>
                );
            })}
            </CarouselContent>
        </Carousel>
    </div>
  );
}
