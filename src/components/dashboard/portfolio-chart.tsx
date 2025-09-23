"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chartData, totalPortfolioValue } from "@/lib/data";
import type { ChartData } from "@/lib/types";

export function PortfolioChart({ dict }: { dict: any }) {
  const [timeRange, setTimeRange] = useState<keyof ChartData>("1w");
  
  const currentData = chartData[timeRange];
  const chartConfig = {
    value: {
      label: "Value",
      color: "hsl(var(--primary))",
    },
  };

  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalPortfolioValue);

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{dict.title}</CardTitle>
          <CardDescription>
            {dict.description}
          </CardDescription>
        </div>
        <Tabs
          defaultValue="1w"
          className="w-auto"
          onValueChange={(value) => setTimeRange(value as keyof ChartData)}
        >
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="live">{dict.tabs['live']}</TabsTrigger>
            <TabsTrigger value="1d">{dict.tabs['1d']}</TabsTrigger>
            <TabsTrigger value="1w">{dict.tabs['1w']}</TabsTrigger>
            <TabsTrigger value="1m">{dict.tabs['1m']}</TabsTrigger>
            <TabsTrigger value="3m">{dict.tabs['3m']}</TabsTrigger>
            <TabsTrigger value="6m">{dict.tabs['6m']}</TabsTrigger>
            <TabsTrigger value="1y">{dict.tabs['1y']}</TabsTrigger>
            <TabsTrigger value="5y">{dict.tabs['5y']}</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart
            data={currentData}
            margin={{ top: 5, right: 20, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if(timeRange === '1d' || timeRange === 'live') return new Date(value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(value as number)
                  }
                />
              }
            />
            <Area
              dataKey="value"
              type="monotone"
              fill="url(#colorValue)"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </>
  );
}
