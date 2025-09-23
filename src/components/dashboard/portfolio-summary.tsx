import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { totalPortfolioValue } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import { AutoSaveDialog } from "./auto-save-dialog";
import { BuyDialog } from "./buy-dialog";
import { SellDialog } from "./sell-dialog";

export function PortfolioSummary({ dict }: { dict: any }) {
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalPortfolioValue);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>{dict.portfolioSummary.totalBalance}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-4xl font-bold">{formattedValue}</div>
        <p className="text-xs text-muted-foreground flex items-center">
          <ArrowUpRight className="h-4 w-4 text-green-500" />
          {dict.portfolioSummary.growth}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <BuyDialog dict={dict} />
        <SellDialog dict={dict} />
        <AutoSaveDialog dict={dict} />
      </CardFooter>
    </Card>
  );
}
