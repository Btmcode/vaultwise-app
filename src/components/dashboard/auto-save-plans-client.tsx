
"use client";

import { useState, useEffect } from "react";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { getAutoSavePlans, removeAutoSavePlan } from "@/lib/data";
import { GoldIcon, SilverIcon, UsdTryIcon } from "@/components/icons";
import type { AssetSymbol, AutoSavePlan } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    XAU: GoldIcon,
    XAG: SilverIcon,
    XAU_ONS: GoldIcon,
    XAU_USD_KG: GoldIcon,
    XAU_EUR_KG: GoldIcon,
    XAG_ONS: SilverIcon,
    XAG_TL: SilverIcon,
    XAG_USD: SilverIcon,
    XAG_EUR: SilverIcon,
    USD_TRY: UsdTryIcon, 
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export default function AutoSavePlans({ dict, assetNames }: { dict: any; assetNames: any; }) {
  const { toast } = useToast();
  const autoSavePlansDict = dict;

  const [currentPlans, setCurrentPlans] = useState<AutoSavePlan[]>([]);
  
  useEffect(() => {
    // Load plans from localStorage when the component mounts
    setCurrentPlans(getAutoSavePlans());
  }, []);


  const handleStopPlan = (planId: string) => {
    // Permanently remove the plan from localStorage
    const updatedPlans = removeAutoSavePlan(planId);
    
    // Update the component's state to re-render the UI
    setCurrentPlans(updatedPlans);

    toast({
      variant: "destructive",
      title: autoSavePlansDict.toast.title,
      description: autoSavePlansDict.toast.description,
    });
  };

  if (!currentPlans || currentPlans.length === 0) {
    return (
      <>
        <CardHeader>
          <CardTitle>{autoSavePlansDict.title}</CardTitle>
          <CardDescription>{autoSavePlansDict.description}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center text-muted-foreground py-4">
                {autoSavePlansDict.noPlans}
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
        {currentPlans.map((plan) => {
          const Icon = iconMap[plan.assetSymbol.split('_')[0]];
          return (
            <div key={plan.id} className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-4 w-full md:w-1/3">
                <div className="bg-muted p-3 rounded-full">
                  {Icon && <Icon className="h-6 w-6" />}
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
