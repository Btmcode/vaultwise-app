
'use client';

import React, { useState, useCallback, memo, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import type { PortfolioAsset, AssetSymbol, LiveAssetData, FirestoreUser } from '@/lib/types';
import { cn } from '@/lib/utils';
import { BuyDialog } from './buy-dialog';
import { SellDialog } from './sell-dialog';
import { GoldIcon, SilverIcon } from '../icons';
import { useToast } from "@/hooks/use-toast";

const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  XAU: GoldIcon,
  XAG: SilverIcon,
};

const getCurrencyInfo = (symbol: AssetSymbol): { currency: 'TRY' | 'USD' | 'EUR', symbol: string, locale: 'tr-TR' | 'en-US' | 'de-DE' } => {
    if (symbol.includes('EUR')) {
        return { currency: 'EUR', symbol: '€', locale: 'de-DE' };
    }
    if (symbol.includes('ONS') || symbol.includes('USD')) {
        return { currency: 'USD', symbol: '$', locale: 'en-US' };
    }
    return { currency: 'TRY', symbol: 'TL', locale: 'tr-TR' };
};

const formatCurrency = (value: number, locale: string, currency: string) => {
    if (locale === 'tr-TR' && currency === 'TRY') {
        return `${value.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} TL`;
    }

    const options: Intl.NumberFormatOptions = { 
        style: 'currency', 
        currency: currency, 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    };
    return value.toLocaleString(locale, options);
};

function PriceChangeIndicator({ dailyChange }: { dailyChange: number }) {
    const isZero = Math.abs(dailyChange) < 0.001;
    const changeColor = isZero ? "text-slate-400" : dailyChange > 0 ? "text-green-400" : "text-red-400";
    const ArrowIcon = isZero ? Minus : dailyChange > 0 ? ArrowUp : ArrowDown;

    return (
        <div className={cn("flex items-center text-xs font-semibold h-6 rounded-full bg-black/30 px-2 py-0.5", changeColor)}>
           <ArrowIcon className="h-3 w-3 mr-1" />
           <span>%{dailyChange.toFixed(2)}</span>
        </div>
    );
};

const MetalCard = memo(function MetalCard({ item, prevItem, dict, portfolioAssets, openDialog, onSellWithoutAsset }: { item: LiveAssetData, prevItem: LiveAssetData | undefined, dict: any, portfolioAssets: PortfolioAsset[], openDialog: (type: 'buy' | 'sell', asset: AssetSymbol) => void, onSellWithoutAsset: () => void }) {
    
    if (!item) return null;

    const assetSymbol = item.symbol as AssetSymbol;
    const displayName = dict.assetNames[assetSymbol] || assetSymbol;
    const Icon = iconMap[assetSymbol.split('_')[0]];
    const isGold = assetSymbol.startsWith('XAU');
    const currencyInfo = getCurrencyInfo(assetSymbol);


    const cardStyles = {
        gold: "border-t-amber-400 bg-gradient-to-br from-yellow-900/20 via-black/80 to-black",
        silver: "border-t-slate-400 bg-gradient-to-br from-slate-800/40 via-black/80 to-black"
    };

    const portfolioAsset = portfolioAssets.find(pa => pa.assetSymbol === assetSymbol);
    const hasAsset = portfolioAsset && portfolioAsset.amount > 0;
    
    const priceStatus = (() => {
        if (!prevItem || !item.buyPrice || !prevItem.buyPrice) return '';
        if (item.buyPrice > prevItem.buyPrice) return 'price-up';
        if (item.buyPrice < prevItem.buyPrice) return 'price-down';
        return '';
    })();
    
    const handleSellClick = () => {
        if (hasAsset) {
            openDialog('sell', assetSymbol);
        } else {
            onSellWithoutAsset();
        }
    }

    return (
        <Card 
            className={cn(
                "w-full flex flex-col text-white overflow-hidden relative transition-all duration-300 ease-out rounded-xl shadow-lg border-t-2",
                isGold ? cardStyles.gold : cardStyles.silver
            )}
        >
             {Icon && <Icon className="h-32 w-32 absolute -top-5 -right-5 opacity-20 z-0 text-white/50" />}
            
            <CardContent className="flex-grow flex flex-col justify-between text-left z-10 p-4">
               <div>
                  <h3 className="text-md font-semibold text-white mb-2">{displayName}</h3>
                  <div className="space-y-1">
                    <div>
                        <div className="text-xs text-white/60">Alış</div>
                        <div className={cn("flex items-baseline gap-1.5", priceStatus)}>
                           <span className="text-2xl font-bold tracking-tight text-white">
                                {formatCurrency(item.buyPrice ?? 0, currencyInfo.locale, currencyInfo.currency)}
                           </span>
                        </div>
                    </div>
                     <div>
                        <div className="text-xs text-white/60">Satış</div>
                        <div className="flex items-baseline gap-1.5">
                           <span className="text-lg font-semibold tracking-tight opacity-90 text-white">
                                {formatCurrency(item.sellPrice ?? 0, currencyInfo.locale, currencyInfo.currency)}
                           </span>
                        </div>
                    </div>
                  </div>
               </div>

               <div className="flex justify-between items-center mt-4">
                  <PriceChangeIndicator dailyChange={item.change24h} />
                  <div className="flex gap-2">
                       <Button 
                          onClick={() => openDialog('buy', assetSymbol)} 
                          size="sm" 
                          variant="ghost"
                          className="w-full text-xs h-8 bg-green-600 hover:bg-green-700 text-white border-0 shadow-md rounded-md"
                        >
                          Al
                       </Button>
                      <Button 
                          onClick={handleSellClick} 
                          size="sm" 
                          variant="destructive"
                          className="w-full text-xs h-8 bg-red-600 hover:bg-red-700 text-white border-0 shadow-md rounded-md"
                      >
                          Sat
                      </Button>
                  </div>
               </div>
            </CardContent>
        </Card>
    );
});

export function PreciousMetalsCards({ dict, portfolioAssets, liveAssets }: { dict: any, portfolioAssets: PortfolioAsset[], liveAssets: LiveAssetData[] }) {
    const [dialogState, setDialogState] = useState<{
        type: 'buy' | 'sell';
        asset: AssetSymbol;
        isOpen: boolean;
    } | null>(null);
    const prevLiveAssetsRef = useRef<LiveAssetData[]>(liveAssets);
    const { toast } = useToast();
    const isLoading = liveAssets.length === 0;

    useEffect(() => {
      // Update the ref *after* the render which uses it for comparison
      prevLiveAssetsRef.current = liveAssets;
    }, [liveAssets]);

    const openDialog = useCallback((type: 'buy' | 'sell', asset: AssetSymbol) => {
        setDialogState({ type, asset, isOpen: true });
    }, []);

    const closeDialog = () => {
        if (dialogState) {
          setDialogState({ ...dialogState, isOpen: false });
          setTimeout(() => setDialogState(null), 300);
        }
    };
    
    const handleSellWithoutAsset = () => {
        toast({
            variant: "destructive",
            title: "Varlık Sahibi Değilsiniz",
            description: "Bu işlemi gerçekleştirmek için önce bu varlığı satın almalısınız.",
        });
    }

    const renderContent = () => {
        if (isLoading) {
            return Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-52 w-full rounded-xl" />
            ));
        }
        
        return liveAssets.map((item) => {
            if (!item) return null;
            const prevItem = prevLiveAssetsRef.current.find(p => p.symbol === item.symbol);
            return (
                <MetalCard 
                    key={item.symbol} 
                    item={item} 
                    prevItem={prevItem}
                    dict={dict} 
                    portfolioAssets={portfolioAssets} 
                    openDialog={openDialog}
                    onSellWithoutAsset={handleSellWithoutAsset}
                />
            )
        });
    };

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {renderContent()}
            </div>
            
            {dialogState && (
                <>
                    <BuyDialog
                        dict={dict}
                        preselectedAsset={dialogState.type === 'buy' ? dialogState.asset : undefined}
                        isOpen={dialogState.type === 'buy' && dialogState.isOpen}
                        onOpenChange={closeDialog}
                    />
                    <SellDialog
                        dict={dict}
                        preselectedAsset={dialogState.type === 'sell' ? dialogState.asset : undefined}
                        isOpen={dialogState.type === 'sell' && dialogState.isOpen}
                        onOpenChange={closeDialog}
                    />
                </>
            )}
        </div>
    );
}

