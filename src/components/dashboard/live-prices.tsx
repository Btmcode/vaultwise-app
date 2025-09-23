"use client"
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { assets } from "@/lib/data";
import { GoldIcon, SilverIcon, BtcIcon, PaxgIcon, XautIcon } from "@/components/icons";
import type { AssetSymbol } from "@/lib/types";

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

export function LivePrices({ dict }: { dict: any }) {
  const assetValues = Object.values(assets);
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        {assetValues.map((asset) => {
          const Icon = iconMap[asset.symbol];
          return (
            <CarouselItem key={asset.symbol} className="basis-1/3 md:basis-1/4 lg:basis-1/6">
              <div className="p-1">
                <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-card border">
                  <div className="bg-muted p-2 rounded-full">
                     <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{dict.assetNames[asset.symbol]}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(asset.price)}</p>
                  </div>
                   <div
                      className={`text-xs font-medium ${
                        asset.change24h > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {asset.change24h > 0 ? "+" : ""}
                      {asset.change24h.toFixed(2)}%
                    </div>
                </div>
              </div>
            </CarouselItem>
          )
        })}
      </CarouselContent>
    </Carousel>
  );
}
