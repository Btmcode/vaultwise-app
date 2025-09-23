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

const getTransactionTypeKey = (type: TransactionType) => {
    return type.toLowerCase().replace('-', '_') as keyof typeof dict.recentTransactions.transactionTypes;
}


export function RecentTransactions({ dict, assetNames }: { dict: any, assetNames: any }) {
    const recentTransactionsDict = dict;
  return (
    <>
      <CardHeader>
        <CardTitle>{recentTransactionsDict.title}</CardTitle>
        <CardDescription>{recentTransactionsDict.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {transactions.map((tx) => {
          const assetInfo = assets[tx.assetSymbol];
          const Icon = iconMap[tx.assetSymbol];
          const transactionTypeKey = tx.type.toLowerCase().replace('-','_');
          return (
            <div key={tx.id} className="flex items-center gap-4">
              <div className="bg-muted p-2 rounded-full">
                <Icon className="h-6 w-6" />
              </div>
              <div className="grid gap-1 flex-1">
                <p className="text-sm font-medium leading-none">
                  {assetNames[assetInfo.symbol]}
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
                  {recentTransactionsDict.transactionTypes[transactionTypeKey]}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </>
  );
}
