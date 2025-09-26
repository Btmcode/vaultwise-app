
'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useLivePricesForLanding } from '@/hooks/use-live-prices-landing';
import {
  BtcIcon,
  GoldIcon,
  PaxgIcon,
  SilverIcon,
  UsdTryIcon,
  XautIcon,
} from '@/components/icons';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import type { AssetSymbol } from '@/lib/types';

const assetOrder: AssetSymbol[] = ['BTC', 'XAU', 'XAG', 'PAXG', 'XAUT', 'USD_TRY'];

const assetDetails: Record<
  AssetSymbol,
  { name: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }
> = {
  BTC: { name: 'Bitcoin', icon: BtcIcon },
  XAU: { name: 'Altın', icon: GoldIcon },
  XAG: { name: 'Gümüş', icon: SilverIcon },
  PAXG: { name: 'PAX Gold', icon: PaxgIcon },
  XAUT: { name: 'Tether Gold', icon: XautIcon },
  USD_TRY: { name: 'Dolar/TL', icon: UsdTryIcon },
  XAU_ONS: { name: 'Altın ONS', icon: GoldIcon },
  XAU_USD_KG: { name: 'Altın USD/KG', icon: GoldIcon },
  XAU_EUR_KG: { name: 'Altın EUR/KG', icon: GoldIcon },
  XAG_ONS: { name: 'Gümüş ONS', icon: SilverIcon },
  XAG_TL: { name: 'Gümüş TL', icon: SilverIcon },
  XAG_USD: { name: 'Gümüş USD', icon: SilverIcon },
  XAG_EUR: { name: 'Gümüş EUR', icon: SilverIcon },
};

export function PriceTicker() {
  const { liveAssets, loading, error } = useLivePricesForLanding();

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  const formatPrice = (price: number | undefined, symbol: AssetSymbol) => {
    if (price === undefined || isNaN(price)) return '...';
    let currency = 'USD';
    let locale = 'en-US';

    if (symbol === 'USD_TRY' || symbol === 'XAU') {
      currency = 'TRY';
      locale = 'tr-TR';
    }

    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: symbol === 'USD_TRY' ? 4 : 2,
      minimumFractionDigits: 2,
    };

    return new Intl.NumberFormat(locale, options).format(price);
  };

  const orderedAssets = assetOrder
    .map((symbol) => liveAssets[symbol])
    .filter(Boolean);

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (error) {
    return <div className="text-destructive text-center">{error}</div>
  }

  return (
    <Carousel
      className="w-full max-w-md mx-auto"
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{
        loop: true,
        align: 'start',
      }}
    >
      <CarouselContent>
        {orderedAssets.map((asset) => {
          const details = assetDetails[asset.symbol as AssetSymbol];
          const Icon = details.icon;
          const price = asset.price ?? asset.sellPrice;
          const change = asset.change24h;

          return (
            <CarouselItem key={asset.symbol} className="md:basis-1/2 lg:basis-1/2">
              <div className="p-1">
                <div className="flex items-center gap-4 rounded-lg border bg-card/50 p-4 backdrop-blur-sm">
                  <Icon className="h-10 w-10 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-card-foreground">
                      {details.name}
                    </p>
                    <p className="text-lg font-bold text-card-foreground">
                      {formatPrice(price, asset.symbol as AssetSymbol)}
                    </p>
                  </div>
                  <div
                    className={cn(
                      'text-sm font-semibold',
                      change >= 0 ? 'text-green-500' : 'text-red-500'
                    )}
                  >
                    {change >= 0 ? '+' : ''}
                    {change.toFixed(2)}%
                  </div>
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
