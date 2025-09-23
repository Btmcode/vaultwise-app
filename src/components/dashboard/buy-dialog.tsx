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

export function BuyDialog() {
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
        title: "Invalid Input",
        description: "Please select an asset and enter a valid amount.",
      });
      return;
    }
    // Simulate buy action
    toast({
      title: "Purchase Successful",
      description: `You have successfully purchased ${amountAsset} ${asset}.`,
    });
    setIsOpen(false);
    setAsset(null);
    setAmountUsd("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Buy Asset</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy Asset</DialogTitle>
          <DialogDescription>
            Select an asset and enter the amount you want to buy.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="asset" className="text-right">
              Asset
            </Label>
            <Select onValueChange={(value) => setAsset(value as AssetSymbol)}>
              <SelectTrigger id="asset" className="col-span-3">
                <SelectValue placeholder="Select an asset" />
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
              Amount (USD)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amountUsd}
              onChange={(e) => setAmountUsd(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 100"
            />
          </div>
          {assetDetails && (
            <div className="text-sm text-muted-foreground text-center col-span-4">
              You will get approx. {amountAsset} {assetDetails.symbol}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleBuy}>Buy Now</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
