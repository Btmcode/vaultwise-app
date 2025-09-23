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
        title: dict.toastInvalidTitle,
        description: dict.toastInvalidDescription,
      });
      return;
    }
    
    toast({
      title: dict.toastSuccessTitle,
      description: dict.toastSuccessDescription.replace('{amount}', amountAsset).replace('{symbol}', asset),
    });
    setIsOpen(false);
    setAsset(null);
    setAmountUsd("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{dict.title}</Button>
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
                {Object.values(assets).map((a) => (
                  <SelectItem key={a.symbol} value={a.symbol}>
                    {a.name}
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
              value={amountUsd}
              onChange={(e) => setAmountUsd(e.target.value)}
              className="col-span-3"
              placeholder={dict.amountPlaceholder}
            />
          </div>
          {assetDetails && (
            <div className="text-sm text-muted-foreground text-center col-span-4">
              {dict.approximate.replace('{amount}', amountAsset).replace('{symbol}', assetDetails.symbol)}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleBuy}>{dict.buyButton}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
