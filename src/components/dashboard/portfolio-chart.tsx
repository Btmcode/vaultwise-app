
"use client";

import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chartData } from "@/lib/data";
import type { ChartData } from "@/lib/types";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

const formatCurrency = (value: number) => {
    if (value === null || value === undefined) return "";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    }).format(value);
}

const formatPercentage = (value: number) => {
    if (value === null || value === undefined) return "";
    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
}


export function PortfolioChart({ dict }: { dict: any }) {
  const [timeRange, setTimeRange] = useState<keyof ChartData>("1w");
  const [displayValue, setDisplayValue] = useState(0);
  const [percentageChange, setPercentageChange] = useState<number | null>(null);
  
  const currentData = chartData[timeRange];
  
  useEffect(() => {
    if (currentData && currentData.length > 0) {
      const startValue = currentData[0].value;
      const endValue = currentData[currentData.length - 1].value;
      setDisplayValue(endValue);
      const change = ((endValue - startValue) / startValue) * 100;
      setPercentageChange(change);
    }
  }, [timeRange, currentData]);


  const chartConfig = {
    value: {
      label: "Value",
      color: "hsl(var(--primary))",
    },
  };

  const handleMouseMove = (state: any) => {
    if (state.activePayload && state.activePayload.length > 0) {
        const dataPoint = state.activePayload[0].payload;
        setDisplayValue(dataPoint.value);
        if (currentData && currentData.length > 0) {
            const startValue = currentData[0].value;
            const change = ((dataPoint.value - startValue) / startValue) * 100;
            setPercentageChange(change);
        }
    }
  };

  const handleMouseLeave = () => {
    if (currentData && currentData.length > 0) {
        const startValue = currentData[0].value;
        const endValue = currentData[currentData.length - 1].value;
        setDisplayValue(endValue);
        const change = ((endValue - startValue) / startValue) * 100;
        setPercentageChange(change);
    }
  };

  return (
    <>
      <CardHeader className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="grid gap-2">
          <CardTitle>{dict.title}</CardTitle>
           <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold">
                {formatCurrency(displayValue)}
            </div>
            {percentageChange !== null && (
                <div className={cn(
                    "flex items-center text-sm font-medium",
                    percentageChange > 0 ? "text-green-500" : "text-red-500"
                )}>
                    {percentageChange > 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    {formatPercentage(percentageChange)}
                </div>
            )}
           </div>
        </div>
        <Tabs
          defaultValue="1w"
          className="w-full sm:w-auto"
          onValueChange={(value) => setTimeRange(value as keyof ChartData)}
        >
          <TabsList className="w-full">
            <TabsTrigger value="live" className="text-xs px-2 sm:px-3">{dict.tabs['live']}</TabsTrigger>
            <TabsTrigger value="1d" className="text-xs px-2 sm:px-3">{dict.tabs['1d']}</TabsTrigger>
            <TabsTrigger value="1w" className="text-xs px-2 sm:px-3">{dict.tabs['1w']}</TabsTrigger>
            <TabsTrigger value="1m" className="text-xs px-2 sm:px-3">{dict.tabs['1m']}</TabsTrigger>
            <TabsTrigger value="3m" className="text-xs px-2 sm:px-3">{dict.tabs['3m']}</TabsTrigger>
            <TabsTrigger value="6m" className="text-xs px-2 sm:px-3">{dict.tabs['6m']}</TabsTrigger>
            <TabsTrigger value="1y" className="text-xs px-2 sm:px-3">{dict.tabs['1y']}</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart
            data={currentData}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
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
              cursor={true}
              content={
                <ChartTooltipContent
                  labelFormatter={(label, payload) => {
                     return new Date(payload?.[0]?.payload.date).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                  }}
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
