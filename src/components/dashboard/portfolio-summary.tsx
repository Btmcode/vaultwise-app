
"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { chartData } from "@/lib/data";
import type { PortfolioAsset } from "@/lib/types";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuyDialog } from "./buy-dialog";
import { SellDialog } from "./sell-dialog";
import { useLivePrices } from "@/hooks/useLivePrices";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PortfolioSummary({ dict, portfolioAssets }: { dict: any, portfolioAssets: PortfolioAsset[] }) {
  const { liveAssets, loading } = useLivePrices();
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  
  // State to hold the displayed value, preventing the $0.00 flicker
  const [displayedValue, setDisplayedValue] = useState<number | null>(null);

  const { totalValue, percentageChange } = useMemo(() => {
    if (Object.keys(liveAssets).length === 0 || !portfolioAssets) {
      return { totalValue: 0, percentageChange: 0 };
    }

    const currentValue = portfolioAssets.reduce((sum, asset) => {
      const liveAsset = liveAssets[asset.assetSymbol];
      // Use sellPrice for a more conservative valuation, fallback to buyPrice or price
      const price = liveAsset?.sellPrice ?? liveAsset?.buyPrice ?? liveAsset?.price ?? 0;
      return sum + asset.amount * price;
    }, 0);
    
    // Use the 1W data as a baseline for percentage change calculation for now
    const weekData = chartData["1w"];
    if (weekData.length === 0) return { totalValue: currentValue, percentageChange: 0 };

    const startValue = weekData[0].value;
    // Prevent division by zero if startValue is 0
    const change = startValue !== 0 ? ((currentValue - startValue) / startValue) * 100 : 0;

    return { totalValue: currentValue, percentageChange: change };
  }, [liveAssets, portfolioAssets]);

  // Effect to update the displayed value only when not loading and totalValue is calculated
  useEffect(() => {
    if (!loading && totalValue > 0) {
      setDisplayedValue(totalValue);
    }
    // Set initial value on first load
    if (displayedValue === null && totalValue > 0) {
        setDisplayedValue(totalValue);
    }
  }, [loading, totalValue, displayedValue]);


  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(displayedValue ?? 0); // Use displayedValue, fallback to 0
  
  const buyDialogDict = dict.portfolioSummary.buyDialog;
  const sellDialogDict = dict.portfolioSummary.sellDialog;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>{dict.portfolioSummary.totalBalance}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {(loading && displayedValue === null) ? (
           <Skeleton className="h-12 w-3/4" />
        ) : (
          <div className="text-4xl font-bold">{formattedValue}</div>
        )}
        {(loading && displayedValue === null) ? (
             <Skeleton className="h-4 w-1/4 mt-2" />
        ) : (
            <p className={cn(
                "text-xs flex items-center",
                percentageChange >= 0 ? "text-green-500" : "text-red-500"
            )}>
            {percentageChange >= 0 ? 
                <ArrowUpRight className="h-4 w-4" /> :
                <ArrowDownRight className="h-4 w-4" />
            }
            {percentageChange.toFixed(2)}% {dict.portfolioSummary.growth}
            </p>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button onClick={() => setBuyDialogOpen(true)} size="sm" className="w-full bg-primary text-primary-foreground hover:bg-green-500 hover:text-white dark:hover:bg-green-600">{buyDialogDict.shortTitle}</Button>
        <Button onClick={() => setSellDialogOpen(true)} variant="secondary" size="sm" className="w-full hover:bg-red-500 hover:text-white dark:hover:bg-red-600">{sellDialogDict.shortTitle}</Button>
        
        <BuyDialog dict={dict} portfolioAssets={portfolioAssets} isOpen={buyDialogOpen} onOpenChange={setBuyDialogOpen} />
        <SellDialog dict={dict} portfolioAssets={portfolioAssets} isOpen={sellDialogOpen} onOpenChange={setSellDialogOpen} />
      </CardFooter>
    </Card>
  );
}
