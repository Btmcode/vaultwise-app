
'use client';
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoldIcon, SilverIcon, UsdTryIcon } from "@/components/icons";
import type { AssetSymbol, Transaction, TransactionType } from "@/lib/types";

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    XAU: GoldIcon,
    XAG: SilverIcon,
    USD_TRY: UsdTryIcon,
    XAU_ONS: GoldIcon,
    XAU_USD_KG: GoldIcon,
    XAU_EUR_KG: GoldIcon,
    XAG_ONS: SilverIcon,
    XAG_TL: SilverIcon,
    XAG_USD: SilverIcon,
    XAG_EUR: SilverIcon,
};

const getBadgeVariant = (type: TransactionType) => {
  switch (type) {
    case 'Buy':
      return 'default';
    case 'Sell':
      return 'destructive';
    case 'Auto-Save':
      return 'secondary';
    case 'Withdraw':
        return 'outline'
    case 'Deposit':
        return 'default'
    default:
      return 'outline';
  }
};

const getTransactionTypeKey = (type: TransactionType, dict: any) => {
    const key = type.toLowerCase().replace('-', '_');
    return dict[key] || type;
}


export default function RecentTransactions({ recentTransactionsDict, assetNames, transactions }: { recentTransactionsDict: any, assetNames: any, transactions: Transaction[] }) {
  if (!transactions) {
    transactions = [];
  }
  return (
    <>
      <CardHeader>
        <CardTitle>{recentTransactionsDict.title}</CardTitle>
        <CardDescription>{recentTransactionsDict.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {transactions.length > 0 ? (
          transactions.map((tx) => {
            const Icon = iconMap[tx.assetSymbol.split('_')[0]];
            const transactionTypeKey = tx.type.toLowerCase().replace('-','_');
            return (
              <div key={tx.id} className="flex items-center gap-4">
                <div className="bg-muted p-2 rounded-full">
                  {Icon && <Icon className="h-6 w-6" />}
                </div>
                <div className="grid gap-1 flex-1">
                  <p className="text-sm font-medium leading-none">
                    {assetNames[tx.assetSymbol]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(tx.date).toLocaleDateString('tr-TR')}
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
          })
        ) : (
          <div className="text-center text-sm text-muted-foreground py-4">
            No recent transactions found.
          </div>
        )}
      </CardContent>
    </>
  );
}
