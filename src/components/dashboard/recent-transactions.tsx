import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { assets, transactions } from "@/lib/data";
import { GoldIcon, SilverIcon, BtcIcon, PaxgIcon, XautIcon } from "@/components/icons";
import type { AssetSymbol, TransactionType } from "@/lib/types";

const iconMap: Record<AssetSymbol, React.FC<React.SVGProps<SVGSVGElement>>> = {
    XAU: GoldIcon,
    XAG: SilverIcon,
    BTC: BtcIcon,
    PAXG: PaxgIcon,
    XAUT: XautIcon
};

const getBadgeVariant = (type: TransactionType) => {
  switch (type) {
    case 'Buy':
      return 'default';
    case 'Sell':
      return 'destructive';
    case 'Auto-Save':
      return 'secondary';
    default:
      return 'outline';
  }
};


export function RecentTransactions() {
  return (
    <>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your last few transactions.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {transactions.map((tx) => {
          const assetInfo = assets[tx.assetSymbol];
          const Icon = iconMap[tx.assetSymbol];
          return (
            <div key={tx.id} className="flex items-center gap-4">
              <div className="bg-muted p-2 rounded-full">
                <Icon className="h-6 w-6" />
              </div>
              <div className="grid gap-1 flex-1">
                <p className="text-sm font-medium leading-none">
                  {assetInfo.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tx.date.toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(tx.amountUsd)}
                </p>
                <Badge variant={getBadgeVariant(tx.type)} className="text-xs">
                  {tx.type}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </>
  );
}
