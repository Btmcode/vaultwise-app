
"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import type { PortfolioAsset } from "@/lib/types";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuyDialog } from "./buy-dialog";
import { SellDialog } from "./sell-dialog";
import { AutoSaveDialog } from "./auto-save-dialog";
import { useLivePrices } from "@/hooks/useLivePrices";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PortfolioSummary({ dict, portfolioAssets }: { dict: any, portfolioAssets: PortfolioAsset[] }) {
  const { liveAssets, loading } = useLivePrices();
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  
  const [displayedValue, setDisplayedValue] = useState<number | null>(null);

  const { totalValue, percentageChange } = useMemo(() => {
    if (Object.keys(liveAssets).length === 0 || !portfolioAssets) {
      return { totalValue: 0, percentageChange: 0 };
    }

    const currentValue = portfolioAssets.reduce((sum, asset) => {
      const liveAsset = liveAssets[asset.assetSymbol];
      const price = liveAsset?.sellPrice ?? liveAsset?.buyPrice ?? liveAsset?.price ?? 0;
      return sum + asset.amount * price;
    }, 0);
    
    // Placeholder for historical data - you would fetch this in a real app
    const startValue = currentValue / (1 + (-0.023)); // Mock 2.3% loss for demo
    const change = startValue !== 0 ? ((currentValue - startValue) / startValue) * 100 : 0;

    return { totalValue: currentValue, percentageChange: change };
  }, [liveAssets, portfolioAssets]);

  useEffect(() => {
    if (!loading && totalValue > 0) {
      setDisplayedValue(totalValue);
    }
    if (displayedValue === null && totalValue > 0) {
        setDisplayedValue(totalValue);
    }
  }, [loading, totalValue, displayedValue]);


  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(displayedValue ?? 0);
  
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
        <Button onClick={() => setBuyDialogOpen(true)} size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">{buyDialogDict.shortTitle}</Button>
        <Button onClick={() => setSellDialogOpen(true)} variant="destructive" size="sm" className="w-full">{sellDialogDict.shortTitle}</Button>
        <AutoSaveDialog dict={dict} />
        
        <BuyDialog dict={dict} portfolioAssets={portfolioAssets} isOpen={buyDialogOpen} onOpenChange={setBuyDialogOpen} />
        <SellDialog dict={dict} portfolioAssets={portfolioAssets} isOpen={sellDialogOpen} onOpenChange={setSellDialogOpen} />
      </CardFooter>
    </Card>
  );
}
