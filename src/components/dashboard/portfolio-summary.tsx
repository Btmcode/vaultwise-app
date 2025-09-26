
"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { portfolioAssets, chartData } from "@/lib/data";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BuyDialog } from "./buy-dialog";
import { SellDialog } from "./sell-dialog";
import { useLivePrices } from "@/hooks/useLivePrices";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PortfolioSummary({ dict }: { dict: any }) {
  const { liveAssets, loading } = useLivePrices();

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
        <BuyDialog dict={dict} />
        <SellDialog dict={dict} />
      </CardFooter>
    </Card>
  );
}
