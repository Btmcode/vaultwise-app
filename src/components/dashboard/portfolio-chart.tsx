
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ChartData } from "@/lib/types";


export function PortfolioChart({ dict }: { dict: any }) {
  const [timeRange, setTimeRange] = useState<keyof ChartData>("1w");

  return (
    <>
      <CardHeader className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="grid gap-2">
          <CardTitle>{dict.title}</CardTitle>
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
        <div className="h-[250px] w-full flex items-center justify-center text-muted-foreground">
          {dict.description}
        </div>
      </CardContent>
    </>
  );
}
