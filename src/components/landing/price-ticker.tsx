
'use client';

import * as React from 'react';
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
import { ChevronDown, ChevronUp } from 'lucide-react';


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

  const TickerContent = () => (
    <>
      {orderedAssets.map((asset) => {
        const details = assetDetails[asset.symbol as AssetSymbol];
        const Icon = details.icon;
        const price = asset.price ?? asset.sellPrice;
        const change = asset.change24h;

        return (
          <div key={asset.symbol} className="flex-shrink-0 flex items-center justify-center gap-4 px-8 py-2 mx-4 rounded-full border bg-background/50 backdrop-blur-sm shadow-sm">
            <Icon className="h-6 w-6" />
            <div className="flex items-baseline gap-3">
                <span className="font-semibold text-sm">{details.name}</span>
                <span className="font-mono text-sm">{formatPrice(price, asset.symbol as AssetSymbol)}</span>
            </div>
            <div
              className={cn(
                'flex items-center text-sm font-semibold',
                change >= 0 ? 'text-green-500' : 'text-red-500'
              )}
            >
              {change >= 0 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {change.toFixed(2)}%
            </div>
          </div>
        );
      })}
    </>
  );


  return (
    <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
        <div className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
            <TickerContent />
        </div>
        <div className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
            <TickerContent />
        </div>
    </div>
  );
}
