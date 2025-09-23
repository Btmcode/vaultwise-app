
"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { autoSavePlans as initialAutoSavePlans } from "@/lib/data";
import { GoldIcon, SilverIcon, BtcIcon, PaxgIcon, XautIcon } from "@/components/icons";
import type { AssetSymbol, AutoSavePlan } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const iconMap: Record<AssetSymbol, React.FC<React.SVGProps<SVGSVGElement>>> = {
    XAU: GoldIcon,
    XAG: SilverIcon,
    BTC: BtcIcon,
    PAXG: PaxgIcon,
    XAUT: XautIcon
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export function AutoSavePlans({ dict }: { dict: any }) {
  const { toast } = useToast();
  const [autoSavePlans, setAutoSavePlans] = useState<AutoSavePlan[]>(initialAutoSavePlans);
  const autoSavePlansDict = dict.autoSavePlans;
  const assetNames = dict.assetNames;
  
  const handleStopPlan = (planId: string) => {
    // In a real app, you would call a server action to update the database.
    // For this simulation, we'll filter the plan from the local state and the source data.
    const updatedPlans = autoSavePlans.filter(plan => plan.id !== planId);
    setAutoSavePlans(updatedPlans);
    
    // This simulates updating the "database" (our data.ts file)
    // In a real app this would be a server action.
    const planIndex = initialAutoSavePlans.findIndex(p => p.id === planId);
    if (planIndex > -1) {
        initialAutoSavePlans.splice(planIndex, 1);
    }
    
    toast({
      title: autoSavePlansDict.toast.title,
      description: autoSavePlansDict.toast.description,
    });
  };

  if (!autoSavePlans || autoSavePlans.length === 0) {
    return (
      <>
        <CardHeader>
          <CardTitle>{autoSavePlansDict.title}</CardTitle>
          <CardDescription>{autoSavePlansDict.description}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center text-muted-foreground py-4">
                No active auto-save plans.
            </div>
        </CardContent>
      </>
    );
  }

  return (
    <>
      <CardHeader>
        <CardTitle>{autoSavePlansDict.title}</CardTitle>
        <CardDescription>{autoSavePlansDict.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {autoSavePlans.map((plan) => {
          const Icon = iconMap[plan.assetSymbol];
          return (
            <div key={plan.id} className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-4 w-full md:w-1/3">
                <div className="bg-muted p-3 rounded-full">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">{assetNames[plan.assetSymbol]}</p>
                  <p className="text-sm text-muted-foreground">{autoSavePlansDict.frequency}</p>
                </div>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-muted-foreground">{autoSavePlansDict.amount}</p>
                <p className="font-semibold text-lg">{formatCurrency(plan.amount)}</p>
              </div>
              <div className="flex gap-2 justify-end w-full md:w-auto">
                <Button variant="outline" onClick={() => handleStopPlan(plan.id)}>{autoSavePlansDict.stopButton}</Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </>
  );
}
