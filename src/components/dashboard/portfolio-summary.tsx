
"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import type { PortfolioAsset, LiveAssetData, FirestoreUser } from "@/lib/types";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuyDialog } from "./buy-dialog";
import { SellDialog } from "./sell-dialog";
import { AutoSaveDialog } from "./auto-save-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";


export function PortfolioSummary({ dict, userProfile, portfolioAssets, liveAssets }: { dict: any, userProfile: FirestoreUser | null, portfolioAssets: PortfolioAsset[], liveAssets: LiveAssetData[] }) {
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  
  const hasPortfolio = portfolioAssets && portfolioAssets.length > 0;
  const pricesLoading = liveAssets.length === 0;
  const loading = hasPortfolio && pricesLoading;

  const { totalValue, percentageChange } = useMemo(() => {
    if (!hasPortfolio || pricesLoading) {
      return { totalValue: 0, percentageChange: 0 };
    }

    const usdTlRate = liveAssets.find(la => la.symbol === 'USD_TRY')?.price ?? 32.8;

    const currentValue = portfolioAssets.reduce((sum, asset) => {
      const liveAsset = liveAssets.find(la => la.symbol === asset.assetSymbol);
      if (!liveAsset) return sum;

      const price = liveAsset.price ?? liveAsset.sellPrice ?? liveAsset.buyPrice ?? 0;
      
      // Convert all asset values to TRY for a consistent total
      let valueInTry = 0;
      if (asset.assetSymbol.includes('EUR') || asset.assetSymbol.includes('USD') || asset.assetSymbol.includes('ONS')) {
        // Assume these are USD based for simplicity, needs better rates for EUR
        valueInTry = asset.amount * price * usdTlRate;
      } else {
        // Assume XAU and XAG are already in TRY
        valueInTry = asset.amount * price;
      }
      return sum + valueInTry;
    }, 0);
    
    // Placeholder for historical data - in a real app, this should be fetched
    // This mock calculation now uses a slightly more realistic daily fluctuation
    const yesterdayValue = portfolioAssets.reduce((sum, asset) => {
      const liveAsset = liveAssets.find(la => la.symbol === asset.assetSymbol);
      if (!liveAsset) return sum;
      
      const price = liveAsset.price ?? liveAsset.sellPrice ?? liveAsset.buyPrice ?? 0;
      const change = liveAsset.change24h / 100;
      const yesterdayPrice = change !== -1 && (1 + change) !== 0 ? price / (1 + change) : price;

      let valueInTry = 0;
      if (asset.assetSymbol.includes('EUR') || asset.assetSymbol.includes('USD') || asset.assetSymbol.includes('ONS')) {
        valueInTry = asset.amount * yesterdayPrice * usdTlRate;
      } else {
        valueInTry = asset.amount * yesterdayPrice;
      }
      return sum + valueInTry;
    }, 0);

    const change = yesterdayValue !== 0 ? ((currentValue - yesterdayValue) / yesterdayValue) * 100 : 0;

    return { totalValue: currentValue, percentageChange: change };
  }, [liveAssets, portfolioAssets, pricesLoading, hasPortfolio]);


  const formattedValue = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(totalValue);
  
  const buyDialogDict = dict.portfolioSummary.buyDialog;
  const sellDialogDict = dict.portfolioSummary.sellDialog;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">{dict.portfolioSummary.totalBalance}</h3>
      </CardHeader>
      <CardContent className="flex-grow">
        {loading ? (
           <Skeleton className="h-12 w-3/4" />
        ) : (
          <div className="text-4xl font-bold">{formattedValue}</div>
        )}
        {loading ? (
             <Skeleton className="h-4 w-1/4 mt-2" />
        ) : (
            hasPortfolio && (
              <p className={cn(
                  "text-xs flex items-center",
                  Math.abs(percentageChange) < 0.01 ? "text-muted-foreground" :
                  percentageChange >= 0 ? "text-green-500" : "text-red-500"
              )}>
              {Math.abs(percentageChange) < 0.01 ? <Minus className="h-4 w-4" /> :
                 percentageChange >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {percentageChange.toFixed(2)}% {dict.portfolioSummary.growth}
              </p>
            )
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button onClick={() => setBuyDialogOpen(true)} size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">{buyDialogDict.shortTitle}</Button>
        <Button onClick={() => setSellDialogOpen(true)} variant="destructive" size="sm" className="w-full">{sellDialogDict.shortTitle}</Button>
        <AutoSaveDialog dict={dict} />
        
        <BuyDialog 
          dict={dict} 
          isOpen={buyDialogOpen} 
          onOpenChange={setBuyDialogOpen} 
        />
        <SellDialog 
          dict={dict} 
          isOpen={sellDialogOpen} 
          onOpenChange={setSellDialogOpen} 
        />
      </CardFooter>
    </Card>
  );
}
