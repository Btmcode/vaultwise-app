import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { assets, portfolioAssets } from "@/lib/data";
import { GoldIcon, SilverIcon, BtcIcon, PaxgIcon, XautIcon } from "@/components/icons";
import type { AssetSymbol } from "@/lib/types";

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
  const assetListDict = dict;
  return (
    <>
      <CardHeader>
        <CardTitle>{assetListDict.title}</CardTitle>
        <CardDescription>{assetListDict.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">{assetListDict.table.asset}</TableHead>
              <TableHead>{assetListDict.table.balance}</TableHead>
              <TableHead className="text-right">{assetListDict.table.price}</TableHead>
              <TableHead className="text-right">{assetListDict.table.value}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolioAssets.map((pa) => {
              const assetInfo = assets[pa.assetSymbol];
              const Icon = iconMap[pa.assetSymbol];
              return (
                <TableRow key={pa.assetSymbol}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-muted p-2 rounded-full">
                         <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">{assetNames[assetInfo.symbol]}</p>
                        <p className="text-sm text-muted-foreground">{assetInfo.symbol}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatAssetAmount(pa.amount, pa.assetSymbol)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div>{formatCurrency(assetInfo.price)}</div>
                    <div
                      className={`text-xs ${
                        assetInfo.change24h > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {assetInfo.change24h > 0 ? "+" : ""}
                      {assetInfo.change24h.toFixed(2)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(pa.valueUsd)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </>
  );
}
