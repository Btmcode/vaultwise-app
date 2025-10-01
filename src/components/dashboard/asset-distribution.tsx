
"use client";

import { BarChart, Bar, ResponsiveContainer, Tooltip, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMemo } from "react";
import type { PortfolioAsset, LiveAssetData } from "@/lib/types";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];
const NO_DATA_COLOR = "hsl(var(--muted))";

const CustomTooltip = ({ active, payload, dict }: any) => {
  if (active && payload && payload.length && payload[0].payload.name !== 'no-data') {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {dict.assetNames[data.name]}
            </span>
            <span className="font-bold text-muted-foreground">
              {`$${data.value.toLocaleString()}`}
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {dict.assetDistribution.percentage}
            </span>
            <span className="font-bold">
              {`${data.percent.toFixed(2)}%`}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};


export function AssetDistribution({ dict, portfolioAssets, liveAssets }: { dict: any, portfolioAssets: PortfolioAsset[], liveAssets: LiveAssetData[] }) {
    const assetDistributionDict = dict.assetDistribution;

    const hasPortfolio = portfolioAssets && portfolioAssets.length > 0;
    const pricesLoading = liveAssets.length === 0;
    const loading = hasPortfolio && pricesLoading;

    const chartData = useMemo(() => {
        if (!hasPortfolio) {
            return [{ name: 'no-data', value: 1, percent: 100 }];
        }
        if (pricesLoading) {
            return [];
        }
        
        const enrichedAssets = portfolioAssets.map(pa => {
            const liveAsset = liveAssets.find(la => la.symbol === pa.assetSymbol);
            const price = liveAsset?.price ?? liveAsset?.buyPrice ?? 0;
            const valueUsd = pa.amount * price;
            return {
                ...pa,
                valueUsd,
            };
        });

        const totalValue = enrichedAssets.reduce((sum, asset) => sum + asset.valueUsd, 0);
        
        if (totalValue === 0) {
            return [{ name: 'no-data', value: 1, percent: 100 }];
        }

        return enrichedAssets.map(asset => ({
            name: asset.assetSymbol,
            value: asset.valueUsd,
            percent: (asset.valueUsd / totalValue) * 100
        })).filter(asset => asset.value > 0);

    }, [liveAssets, portfolioAssets, hasPortfolio, pricesLoading]);

    const hasRealData = chartData.length > 0 && chartData[0].name !== 'no-data';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{assetDistributionDict.title}</CardTitle>
        <CardDescription>{assetDistributionDict.description}</CardDescription>
      </CardHeader>
      <CardContent className="h-40 relative">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            {hasRealData && <Tooltip cursor={{ fill: 'hsla(var(--muted))' }} content={<CustomTooltip dict={dict} />} />}
            <Bar dataKey="value" barSize={20} radius={[4, 4, 4, 4]}>
                {chartData.map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        fill={entry.name === 'no-data' ? NO_DATA_COLOR : COLORS[index % COLORS.length]} 
                        radius={4}
                    />
                ))}
            </Bar>
            </BarChart>
        </ResponsiveContainer>
         {!hasRealData && (
            <div className="absolute inset-0 flex items-center justify-center -mt-4">
                <p className="text-sm text-muted-foreground">{assetDistributionDict.noData}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
