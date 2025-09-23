
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { portfolioAssets, assets } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

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


export function AssetDistribution({ dict }: { dict: any }) {
    const assetDistributionDict = dict.assetDistribution;
    
    const totalValue = useMemo(() => portfolioAssets.reduce((sum, asset) => sum + asset.valueUsd, 0), [portfolioAssets]);
    const chartData = useMemo(() => portfolioAssets.map(asset => ({
        name: asset.assetSymbol,
        value: asset.valueUsd,
        percent: (asset.valueUsd / totalValue) * 100
    })), [portfolioAssets, totalValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{assetDistributionDict.title}</CardTitle>
        <CardDescription>{assetDistributionDict.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 150 }}>
            <ResponsiveContainer>
                <PieChart>
                <Tooltip content={<CustomTooltip dict={dict} />} />
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={60}
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
