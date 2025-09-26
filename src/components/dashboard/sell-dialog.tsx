
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assets, portfolioAssets } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import type { AssetSymbol } from "@/lib/types";

export function SellDialog({ dict }: { dict: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [asset, setAsset] = useState<AssetSymbol | null>(null);
  const [amountAsset, setAmountAsset] = useState("");
  const { toast } = useToast();

  const assetDetails = asset ? assets[asset] : null;
  const portfolioAsset = asset ? portfolioAssets.find(pa => pa.assetSymbol === asset) : null;
  
  const amountUsd =
    assetDetails && amountAsset
      ? (parseFloat(amountAsset) * (assetDetails.price ?? assetDetails.sellPrice ?? 1)).toFixed(2)
      : "0";

  const sellDialogDict = dict.portfolioSummary.sellDialog;

  const handleSell = () => {
    if (!asset || !amountAsset || parseFloat(amountAsset) <= 0) {
      toast({
        variant: "destructive",
        title: sellDialogDict.toastInvalidTitle,
        description: sellDialogDict.toastInvalidDescription,
      });
      return;
    }
    
    if (portfolioAsset && parseFloat(amountAsset) > portfolioAsset.amount) {
      toast({
        variant: "destructive",
        title: sellDialogDict.toastInsufficientTitle,
        description: sellDialogDict.toastInsufficientDescription.replace('{amount}', portfolioAsset.amount.toString()).replace('{symbol}', asset),
      });
      return;
    }
    
    toast({
      title: sellDialogDict.toastSuccessTitle,
      description: sellDialogDict.toastSuccessDescription.replace('{amount}', amountAsset).replace('{symbol}', asset).replace('{usd}', amountUsd),
    });
    setIsOpen(false);
    setAsset(null);
    setAmountAsset("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="w-full hover:bg-red-500 hover:text-white dark:hover:bg-red-600">{sellDialogDict.shortTitle}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{sellDialogDict.title}</DialogTitle>
          <DialogDescription>
            {sellDialogDict.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="asset">
              {sellDialogDict.assetLabel}
            </Label>
            <Select onValueChange={(value) => setAsset(value as AssetSymbol)}>
              <SelectTrigger id="asset">
                <SelectValue placeholder={sellDialogDict.assetPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {portfolioAssets.map((pa) => (
                  <SelectItem key={pa.assetSymbol} value={pa.assetSymbol}>
                    {dict.assetNames[pa.assetSymbol]} ({pa.amount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">
              {sellDialogDict.amountLabel}
            </Label>
            <Input
              id="amount"
              type="number"
              value={amountAsset}
              onChange={(e) => setAmountAsset(e.target.value)}
              placeholder={sellDialogDict.amountPlaceholder}
            />
          </div>
          {assetDetails && (
            <div className="text-sm text-muted-foreground text-center col-span-4">
              {sellDialogDict.approximate.replace('{usd}', amountUsd)}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSell} variant="secondary" className="hover:bg-red-500 hover:text-white dark:hover:bg-red-600">{sellDialogDict.sellButton}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
