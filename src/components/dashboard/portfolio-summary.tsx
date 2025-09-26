
"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { portfolioAssets, chartData } from "@/lib/data";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuyDialog } from "./buy-dialog";
import { SellDialog } from "./sell-dialog";
import { useLivePrices } from "@/hooks/useLivePrices";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PortfolioSummary({ dict }: { dict: any }) {
  const { liveAssets, loading } = useLivePrices();
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const [isSellOpen, setIsSellOpen] = useState(false);

  const { totalValue, percentageChange } = useMemo(() => {
    if (loading || Object.keys(liveAssets).length === 0) {
      return { totalValue: 0, percentageChange: 0 };
    }

    const currentValue = portfolioAssets.reduce((sum, asset) => {
      const liveAsset = liveAssets[asset.assetSymbol];
      const price = liveAsset?.price ?? liveAsset?.buyPrice ?? 0;
      return sum + asset.amount * price;
    }, 0);
    
    // Use the 1W data as a baseline for percentage change calculation for now
    const weekData = chartData["1w"];
    if (weekData.length === 0) return { totalValue: currentValue, percentageChange: 0 };

    const startValue = weekData[0].value;
    const change = ((currentValue - startValue) / startValue) * 100;

    return { totalValue: currentValue, percentageChange: change };
  }, [liveAssets, loading]);

  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalValue);
  
  const buyDialog = dict.portfolioSummary.buyDialog;
  const sellDialog = dict.portfolioSummary.sellDialog;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>{dict.portfolioSummary.totalBalance}</CardTitle>
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
        <Button onClick={() => setIsBuyOpen(true)} size="sm" className="w-full bg-primary text-primary-foreground hover:bg-green-500 hover:text-white dark:hover:bg-green-600">{buyDialog.shortTitle}</Button>
        <Button onClick={() => setIsSellOpen(true)} variant="secondary" size="sm" className="w-full hover:bg-red-500 hover:text-white dark:hover:bg-red-600">{sellDialog.shortTitle}</Button>
        
        <BuyDialog dict={dict} isOpen={isBuyOpen} onOpenChange={setIsBuyOpen} />
        <SellDialog dict={dict} isOpen={isSellOpen} onOpenChange={setIsSellOpen} />
      </CardFooter>
    </Card>
  );
}
