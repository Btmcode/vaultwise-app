
"use client";

import { useState, useMemo } from 'react';
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BuyDialog } from './buy-dialog';
import { SellDialog } from './sell-dialog';

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
    return `${amount.toLocaleString('en-US')} ${unit}`;
}

const HIDE_THRESHOLD = 1.00; // Hide assets with value less than $1.00

export function AssetList({ dict }: { dict: any }) {
  const assetListDict = dict.assetList;
  const assetNames = dict.assetNames;

  const [searchTerm, setSearchTerm] = useState('');
  const [hideLowBalances, setHideLowBalances] = useState(false);

  const filteredAssets = useMemo(() => {
    return portfolioAssets
      .filter(pa => !hideLowBalances || pa.valueUsd >= HIDE_THRESHOLD)
      .filter(pa => {
        const assetInfo = assets[pa.assetSymbol];
        const assetName = assetNames[assetInfo.symbol] || '';
        const symbol = assetInfo.symbol;
        return assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               symbol.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [portfolioAssets, hideLowBalances, searchTerm, assetNames]);


  return (
    <>
      <CardHeader>
        <CardTitle>{assetListDict.title}</CardTitle>
        <CardDescription>{assetListDict.description}</CardDescription>
      </CardHeader>
      <div className="flex flex-col sm:flex-row items-center gap-4 px-6 pb-4">
          <Input
            placeholder={assetListDict.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/3"
          />
          <div className="flex items-center space-x-2">
            <Switch
                id="hide-low-balances"
                checked={hideLowBalances}
                onCheckedChange={setHideLowBalances}
            />
            <Label htmlFor="hide-low-balances">{assetListDict.hideLowBalances}</Label>
          </div>
      </div>
      <CardContent className="grid gap-6">
        {filteredAssets.map((pa, index) => {
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
                <div className="flex gap-2 justify-end w-full md:w-auto">
                   <Button variant="outline" size="sm" className="hover:bg-green-500 hover:text-white dark:hover:bg-green-600">{dict.portfolioSummary.buyDialog.shortTitle}</Button>
                   <Button variant="outline" size="sm" className="hover:bg-red-500 hover:text-white dark:hover:bg-red-600">{dict.portfolioSummary.sellDialog.shortTitle}</Button>
                </div>
              </div>
              {index < filteredAssets.length - 1 && <Separator className="mt-6" />}
            </div>
          );
        })}
        {filteredAssets.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
                {assetListDict.noResults}
            </div>
        )}
      </CardContent>
    </>
  );
}
