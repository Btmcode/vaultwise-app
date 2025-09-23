
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { assets } from "@/lib/data";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export function TopPerformer({ dict }: { dict: any }) {
  const topPerformerDict = dict.topPerformer;
  const topPerformer = Object.values(assets).reduce((prev, current) => (prev.change24h > current.change24h) ? prev : current);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{topPerformerDict.title}</CardTitle>
        <CardDescription>{topPerformerDict.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">{dict.assetNames[topPerformer.symbol]}</p>
          <p className="text-sm text-muted-foreground">{formatCurrency(topPerformer.price)}</p>
        </div>
        <div className="flex items-center gap-2 text-green-500">
          <ArrowUp className="h-6 w-6" />
          <span className="text-xl font-bold">+{topPerformer.change24h.toFixed(2)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
