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
      ? (parseFloat(amountAsset) * assetDetails.price).toFixed(2)
      : "0";

  const handleSell = () => {
    if (!asset || !amountAsset || parseFloat(amountAsset) <= 0) {
      toast({
        variant: "destructive",
        title: dict.toastInvalidTitle,
        description: dict.toastInvalidDescription,
      });
      return;
    }
    
    if (portfolioAsset && parseFloat(amountAsset) > portfolioAsset.amount) {
      toast({
        variant: "destructive",
        title: dict.toastInsufficientTitle,
        description: dict.toastInsufficientDescription.replace('{amount}', portfolioAsset.amount.toString()).replace('{symbol}', asset),
      });
      return;
    }
    
    toast({
      title: dict.toastSuccessTitle,
      description: dict.toastSuccessDescription.replace('{amount}', amountAsset).replace('{symbol}', asset).replace('{usd}', amountUsd),
    });
    setIsOpen(false);
    setAsset(null);
    setAmountAsset("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">{dict.title}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dict.title}</DialogTitle>
          <DialogDescription>
            {dict.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="asset" className="text-right">
              {dict.assetLabel}
            </Label>
            <Select onValueChange={(value) => setAsset(value as AssetSymbol)}>
              <SelectTrigger id="asset" className="col-span-3">
                <SelectValue placeholder={dict.assetPlaceholder} />
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              {dict.amountLabel}
            </Label>
            <Input
              id="amount"
              type="number"
              value={amountAsset}
              onChange={(e) => setAmountAsset(e.target.value)}
              className="col-span-3"
              placeholder={dict.amountPlaceholder}
            />
          </div>
          {assetDetails && (
            <div className="text-sm text-muted-foreground text-center col-span-4">
              {dict.approximate.replace('{usd}', amountUsd)}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSell}>{dict.sellButton}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
