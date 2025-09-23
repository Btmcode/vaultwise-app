
"use client"
import * as React from "react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import { assets } from "@/lib/data";
import { GoldIcon, SilverIcon, BtcIcon, PaxgIcon, XautIcon } from "@/components/icons";
import type { AssetSymbol } from "@/lib/types";
import { cn } from "@/lib/utils";

const iconMap: Record<AssetSymbol, React.FC<React.SVGProps<SVGSVGElement>>> = {
    XAU: GoldIcon,
    XAG: SilverIcon,
    BTC: BtcIcon,
    PAXG: PaxgIcon,
    XAUT: XautIcon
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export function LivePrices({ dict, assetNames }: { dict: any, assetNames: any }) {
  const assetOrder = Object.keys(assets) as AssetSymbol[];
  
  return (
    <div className="w-full">
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            plugins={[
                Autoplay({
                    delay: 3000,
                }),
            ]}
            className="w-full"
        >
            <CarouselContent>
            {assetOrder.map((symbol) => {
                const asset = assets[symbol];
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
