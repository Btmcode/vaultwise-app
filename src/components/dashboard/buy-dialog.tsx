
"use client";

import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import type { AssetSymbol } from "@/lib/types";
import { useLivePrices } from "@/hooks/useLivePrices";

export function BuyDialog({ dict, preselectedAsset }: { dict: any; preselectedAsset?: AssetSymbol }) {
  const [isOpen, setIsOpen] = useState(false);
  const [asset, setAsset] = useState<AssetSymbol | null>(preselectedAsset || null);
  const [amountTl, setAmountTl] = useState("");
  const { toast } = useToast();
  const { liveAssets } = useLivePrices();

  // Handle pre-selection when dialog opens
  useEffect(() => {
    if (isOpen) {
      setAsset(preselectedAsset || null);
      setAmountTl(""); // Reset amount when dialog is reopened
    }
  }, [isOpen, preselectedAsset]);
  
  const assetDetails = asset ? liveAssets[asset] : null;
  const usdTlRate = liveAssets['USD_TRY']?.buyPrice ?? 32.8; // Fallback rate

  const amountAsset =
    assetDetails && amountTl
      ? (parseFloat(amountTl) / usdTlRate / (assetDetails.price ?? assetDetails.buyPrice ?? 1)).toFixed(6)
      : "0";

  const buyDialogDict = dict.portfolioSummary.buyDialog;

  const handleBuy = () => {
    if (!asset || !amountTl || parseFloat(amountTl) <= 0) {
      toast({
        variant: "destructive",
        title: buyDialogDict.toastInvalidTitle,
        description: buyDialogDict.toastInvalidDescription,
      });
      return;
    }
    
    toast({
      title: buyDialogDict.toastSuccessTitle,
      description: buyDialogDict.toastSuccessDescription.replace('{amount}', amountAsset).replace('{symbol}', asset),
    });
    setIsOpen(false);
    // State is reset via useEffect on isOpen change
  };

  const availableAssets = Object.keys(liveAssets)
    .filter(symbol => symbol !== 'USD_TRY') // Exclude the currency pair itself
    .map(symbol => ({ symbol: symbol as AssetSymbol, name: dict.assetNames[symbol] || symbol }));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-green-500 hover:text-white dark:hover:bg-green-600">{buyDialogDict.shortTitle}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{buyDialogDict.title}</DialogTitle>
          <DialogDescription>
            {buyDialogDict.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="asset">
              {buyDialogDict.assetLabel}
            </Label>
            <Select 
              onValueChange={(value) => setAsset(value as AssetSymbol)} 
              value={asset || undefined}
              disabled={!!preselectedAsset} // Disable if preselected
            >
              <SelectTrigger id="asset">
                <SelectValue placeholder={buyDialogDict.assetPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {availableAssets.map((a) => (
                  <SelectItem key={a.symbol} value={a.symbol}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">
              {buyDialogDict.amountLabel}
            </Label>
            <Input
              id="amount"
              type="number"
              value={amountTl}
              onChange={(e) => setAmountTl(e.target.value)}
              placeholder={buyDialogDict.amountPlaceholder}
            />
          </div>
          {assetDetails && amountTl && (
            <div className="text-sm text-muted-foreground text-center">
              {buyDialogDict.approximate.replace('{amount}', amountAsset).replace('{symbol}', assetDetails.symbol)}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleBuy} className="w-full bg-primary text-primary-foreground hover:bg-green-500 hover:text-white dark:hover:bg-green-600">{buyDialogDict.buyButton}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    