
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { assets } from "@/lib/data";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export function WorstPerformer({ dict }: { dict: any }) {
  const worstPerformerDict = dict.worstPerformer;
  const worstPerformer = Object.values(assets).reduce((prev, current) => (prev.change24h < current.change24h) ? prev : current);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{worstPerformerDict.title}</CardTitle>
        <CardDescription>{worstPerformerDict.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">{dict.assetNames[worstPerformer.symbol]}</p>
          <p className="text-sm text-muted-foreground">{formatCurrency(worstPerformer.price)}</p>
        </div>
        <div className="flex items-center gap-2 text-red-500">
          <ArrowDown className="h-6 w-6" />
          <span className="text-xl font-bold">{worstPerformer.change24h.toFixed(2)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
