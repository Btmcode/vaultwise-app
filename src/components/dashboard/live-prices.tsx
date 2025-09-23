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
import { assets } from "@/lib/data";
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

export function LivePrices({ dict }: { dict: any }) {
  const assetValues = Object.values(assets);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.title}</CardTitle>
        <CardDescription>{dict.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">{dict.table.asset}</TableHead>
              <TableHead className="text-right">{dict.table.price}</TableHead>
              <TableHead className="text-right">{dict.table.change}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assetValues.map((asset) => {
              const Icon = iconMap[asset.symbol];
              return (
                <TableRow key={asset.symbol}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-muted p-2 rounded-full">
                         <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">{dict.assetNames[asset.symbol]}</p>
                        <p className="text-sm text-muted-foreground">{asset.symbol}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(asset.price)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div
                      className={`text-xs font-medium ${
                        asset.change24h > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {asset.change24h > 0 ? "+" : ""}
                      {asset.change24h.toFixed(2)}%
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
