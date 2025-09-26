
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMemo } from "react";
import { useLivePrices } from "@/hooks/useLivePrices";
import type { PortfolioAsset } from "@/lib/types";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const CustomTooltip = ({ active, payload, dict }: any) => {
  if (active && payload && payload.length) {
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


export function AssetDistribution({ dict, portfolioAssets }: { dict: any, portfolioAssets: PortfolioAsset[] }) {
    const assetDistributionDict = dict.assetDistribution;
    const { liveAssets } = useLivePrices();

    const chartData = useMemo(() => {
        if (Object.keys(liveAssets).length === 0 || !portfolioAssets) return [];
        
        const enrichedAssets = portfolioAssets.map(pa => {
            const liveAsset = liveAssets[pa.assetSymbol];
            const price = liveAsset?.price ?? liveAsset?.buyPrice ?? 0;
            const valueUsd = pa.amount * price;
            return {
                ...pa,
                valueUsd,
            };
        });

        const totalValue = enrichedAssets.reduce((sum, asset) => sum + asset.valueUsd, 0);
        if (totalValue === 0) return [];

        return enrichedAssets.map(asset => ({
            name: asset.assetSymbol,
            value: asset.valueUsd,
            percent: (asset.valueUsd / totalValue) * 100
        })).filter(asset => asset.value > 0);

    }, [liveAssets, portfolioAssets]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{assetDistributionDict.title}</CardTitle>
        <CardDescription>{assetDistributionDict.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-40">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Tooltip content={<CustomTooltip dict={dict} />} />
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    strokeWidth={2}
                >
                    {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Legend
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    iconSize={8}
                    iconType="circle"
                    formatter={(value, entry) => <span className="text-xs text-muted-foreground">{dict.assetNames[value]}</span>}
                />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
