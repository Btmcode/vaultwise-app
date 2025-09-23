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
import { assets } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import type { AssetSymbol } from "@/lib/types";

export function BuyDialog({ dict }: { dict: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [asset, setAsset] = useState<AssetSymbol | null>(null);
  const [amountUsd, setAmountUsd] = useState("");
  const { toast } = useToast();

  const assetDetails = asset ? assets[asset] : null;
  const amountAsset =
    assetDetails && amountUsd
      ? (parseFloat(amountUsd) / assetDetails.price).toFixed(6)
      : "0";

  const handleBuy = () => {
    if (!asset || !amountUsd || parseFloat(amountUsd) <= 0) {
      toast({
        variant: "destructive",
        title: dict.buyDialog.toastInvalidTitle,
        description: dict.buyDialog.toastInvalidDescription,
      });
      return;
    }
    
    toast({
      title: dict.buyDialog.toastSuccessTitle,
      description: dict.buyDialog.toastSuccessDescription.replace('{amount}', amountAsset).replace('{symbol}', asset),
    });
    setIsOpen(false);
    setAsset(null);
    setAmountUsd("");
  };

  const assetValues = Object.values(assets);
  const buyDialogDict = dict.buyDialog;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{buyDialogDict.title}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{buyDialogDict.title}</DialogTitle>
          <DialogDescription>
            {buyDialogDict.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="asset" className="text-right">
              {buyDialogDict.assetLabel}
            </Label>
            <Select onValueChange={(value) => setAsset(value as AssetSymbol)}>
              <SelectTrigger id="asset" className="col-span-3">
                <SelectValue placeholder={buyDialogDict.assetPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {assetValues.map((a) => (
                  <SelectItem key={a.symbol} value={a.symbol}>
                    {dict.assetNames[a.symbol]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              {buyDialogDict.amountLabel}
            </Label>
            <Input
              id="amount"
              type="number"
              value={amountUsd}
              onChange={(e) => setAmountUsd(e.target.value)}
              className="col-span-3"
              placeholder={buyDialogDict.amountPlaceholder}
            />
          </div>
          {assetDetails && (
            <div className="text-sm text-muted-foreground text-center col-span-4">
              {buyDialogDict.approximate.replace('{amount}', amountAsset).replace('{symbol}', assetDetails.symbol)}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleBuy}>{buyDialogDict.buyButton}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
