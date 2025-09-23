import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { assets, portfolioAssets } from "@/lib/data";
import { GoldIcon, SilverIcon, BtcIcon, PaxgIcon, XautIcon } from "@/components/icons";
import type { AssetSymbol } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

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

const formatAssetAmount = (amount: number, symbol: AssetSymbol) => {
    const unit = symbol === 'XAU' || symbol === 'XAG' ? 'oz' : symbol;
    return `${amount.toLocaleString()} ${unit}`;
}

export function AssetList({ dict, assetNames }: { dict: any, assetNames: any }) {
  const assetListDict = dict.assetList;
  return (
    <>
      <CardHeader>
        <CardTitle>{assetListDict.title}</CardTitle>
        <CardDescription>{assetListDict.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {portfolioAssets.map((pa, index) => {
          const assetInfo = assets[pa.assetSymbol];
          const Icon = iconMap[pa.assetSymbol];
          return (
            <div key={pa.assetSymbol}>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center gap-4 w-full md:w-1/3">
                  <div className="bg-muted p-3 rounded-full">
                     <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">{assetNames[assetInfo.symbol]}</p>
                    <p className="text-sm text-muted-foreground">{assetInfo.symbol}</p>
                  </div>
                </div>
                
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                  <div className="text-left md:text-left">
                    <p className="text-sm text-muted-foreground">{assetListDict.table.balance}</p>
                    <p className="font-medium">{formatAssetAmount(pa.amount, pa.assetSymbol)}</p>
                  </div>

                  <div className="text-right md:text-left">
                    <p className="text-sm text-muted-foreground">{assetListDict.table.price}</p>
                    <div className="font-medium">{formatCurrency(assetInfo.price)}</div>
                  </div>
                  
                  <div className="col-span-2 md:col-span-1 text-right">
                    <p className="text-sm text-muted-foreground ">{assetListDict.table.value}</p>
                    <p className="font-semibold text-lg">{formatCurrency(pa.valueUsd)}</p>
                  </div>
                </div>
              </div>
              {index < portfolioAssets.length - 1 && <Separator className="mt-6" />}
            </div>
          );
        })}
      </CardContent>
    </>
  );
}
