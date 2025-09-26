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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Loader2 } from "lucide-react";

export function BuyDialog({ dict, preselectedAsset }: { dict: any; preselectedAsset?: AssetSymbol }) {
  const [isOpen, setIsOpen] = useState(false);
  const [asset, setAsset] = useState<AssetSymbol | undefined>(preselectedAsset);
  const [amountTl, setAmountTl] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { liveAssets } = useLivePrices();

  // Reset state and set preselected asset when dialog opens
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setAsset(preselectedAsset);
      setAmountTl("");
      setIsConfirming(false);
      setIsLoading(false);
    }
  };
  
  const assetDetails = asset ? liveAssets[asset] : null;
  const usdTlRate = liveAssets['USD_TRY']?.buyPrice ?? 32.8;

  const amountAsset =
    assetDetails && amountTl && asset
      ? (parseFloat(amountTl.replace(/,/g, '')) / usdTlRate / (assetDetails.price ?? assetDetails.buyPrice ?? 1)).toFixed(6)
      : "0";

  const buyDialogDict = dict.portfolioSummary.buyDialog;
  const assetName = asset ? dict.assetNames[asset] || asset : "";

  const handleBuyAttempt = () => {
    if (!asset || !amountTl || parseFloat(amountTl) <= 0) {
      toast({
        variant: "destructive",
        title: buyDialogDict.toastInvalidTitle,
        description: buyDialogDict.toastInvalidDescription,
      });
      return;
    }
    setIsConfirming(true);
  };

  const handleConfirmBuy = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        toast({
        title: buyDialogDict.toastSuccessTitle,
        description: buyDialogDict.toastSuccessDescription.replace('{amount}', amountAsset).replace('{symbol}', asset || ''),
        });
        setIsLoading(false);
        setIsConfirming(false);
        setIsOpen(false);
    }, 1000);
  };

  const availableAssets = Object.keys(liveAssets)
    .filter(symbol => symbol !== 'USD_TRY' && symbol !== 'XAG_TL')
    .map(symbol => ({ symbol: symbol as AssetSymbol, name: dict.assetNames[symbol] || symbol }));

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-green-500 hover:text-white dark:hover:bg-green-600">{buyDialogDict.shortTitle}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
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
              value={asset}
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
              {buyDialogDict.approximate.replace('{amount}', amountAsset).replace('{symbol}', asset || '')}
            </div>
          )}
        </div>
        <DialogFooter>
          <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
            <Button onClick={handleBuyAttempt} className="w-full bg-primary text-primary-foreground hover:bg-green-500 hover:text-white dark:hover-bg-green-600">
                {buyDialogDict.buyButton}
            </Button>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>{buyDialogDict.confirm.title}</AlertDialogTitle>
                <AlertDialogDescription asChild>
                    <div className="space-y-2">
                        <div>{buyDialogDict.confirm.description}</div>
                        <div className="p-4 bg-muted rounded-md text-muted-foreground">
                            <div className="flex justify-between"><span>{buyDialogDict.confirm.asset}:</span> <span className="font-semibold text-foreground">{assetName}</span></div>
                            <div className="flex justify-between"><span>{buyDialogDict.confirm.paymentAmount}:</span> <span className="font-semibold text-foreground">{parseFloat(amountTl).toLocaleString('tr-TR')} TL</span></div>
                            <div className="flex justify-between"><span>{buyDialogDict.confirm.amountToReceive}:</span> <span className="font-semibold text-foreground">~{amountAsset} {asset}</span></div>
                        </div>
                    </div>
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>{buyDialogDict.confirm.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmBuy} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {buyDialogDict.confirm.confirm}
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}