
"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ChartData, ChartDataPoint } from "@/lib/types";
import { cn } from "@/lib/utils";

const CustomTooltip = ({ active, payload, label, dict }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {dict.tooltip.value}
            </span>
            <span className="font-bold text-foreground">
              ${payload[0].value.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {dict.tooltip.date}
            </span>
            <span className="font-bold text-muted-foreground">
              {label}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export function PortfolioChart({
  dict,
  data,
}: {
  dict: any;
  data: ChartData;
}) {
  const [timeRange, setTimeRange] = useState<keyof ChartData>("1w");
  const chartData = data[timeRange];

  return (
    <Card>
      <CardHeader className="flex flex-col items-start justify-between gap-4 space-y-0 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <CardTitle>{dict.title}</CardTitle>
          <CardDescription>{dict.description}</CardDescription>
        </div>
        <Tabs
          defaultValue="1w"
          className="w-full sm:w-auto"
          onValueChange={(value) => setTimeRange(value as keyof ChartData)}
        >
          <TabsList className="w-full">
            <TabsTrigger value="1d" className="text-xs px-2 sm:px-3" tabIndex={timeRange === '1d' ? 0 : -1}>
              {dict.tabs["1d"]}
            </TabsTrigger>
            <TabsTrigger value="1w" className="text-xs px-2 sm:px-3" tabIndex={timeRange === '1w' ? 0 : -1}>
              {dict.tabs["1w"]}
            </TabsTrigger>
            <TabsTrigger value="1m" className="text-xs px-2 sm:px-3" tabIndex={timeRange === '1m' ? 0 : -1}>
              {dict.tabs["1m"]}
            </TabsTrigger>
            <TabsTrigger value="1y" className="text-xs px-2 sm:px-3" tabIndex={timeRange === '1y' ? 0 : -1}>
              {dict.tabs["1y"]}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartData.length > 0 ? (
              <AreaChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    if (timeRange === "1d")
                      return date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                    if (timeRange === "1w" || timeRange === "1m")
                      return date.toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      });
                    if (timeRange === "1y")
                      return date.toLocaleDateString([], { month: "short" });
                    return value;
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) =>
                    `$${(value / 1000).toLocaleString()}k`
                  }
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={<CustomTooltip dict={dict} />}
                />
                <defs>
                    <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
                <Area
                  dataKey="value"
                  type="monotone"
                  stroke="hsl(var(--primary))"
                  fill="url(#chart-fill)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                {dict.noData}
              </div>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
