import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { totalPortfolioValue } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import { AutoSaveDialog } from "./auto-save-dialog";
import { BuyDialog } from "./buy-dialog";

export function PortfolioSummary({ dict }: { dict: any }) {
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalPortfolioValue);

  return (
    <Card className="lg:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{dict.totalBalance}</CardTitle>
        <div className="flex items-center gap-2">
           <BuyDialog dict={dict.buyDialog} />
           <AutoSaveDialog dict={dict.autoSave} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{formattedValue}</div>
        <p className="text-xs text-muted-foreground flex items-center">
          <ArrowUpRight className="h-4 w-4 text-green-500" />
          {dict.growth}
        </p>
      </CardContent>
    </Card>
  );
}
