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
import { portfolioAssets } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import type { AssetSymbol } from "@/lib/types";
import { useLivePrices } from "@/hooks/useLivePrices";
import { Loader2 } from "lucide-react";

export function SellDialog({ dict, preselectedAsset }: { dict: any, preselectedAsset?: AssetSymbol }) {
  const [isOpen, setIsOpen] = useState(false);
  const [asset, setAsset] = useState<AssetSymbol | undefined>(preselectedAsset);
  const [amountAsset, setAmountAsset] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { liveAssets } = useLivePrices();

  // Reset state and set preselected asset when dialog opens
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setAsset(preselectedAsset);
      setAmountAsset("");
      setIsConfirming(false);
      setIsLoading(false);
    }
  };
  
  const assetDetails = asset ? liveAssets[asset] : null;
  const portfolioAsset = asset ? portfolioAssets.find(pa => pa.assetSymbol === asset) : null;
  const usdTlRate = liveAssets['USD_TRY']?.sellPrice ?? 32.8;
  
  const amountTl =
    assetDetails && amountAsset && asset
      ? (parseFloat(amountAsset.replace(/,/g, '')) * (assetDetails.price ?? assetDetails.sellPrice ?? 1) * usdTlRate).toFixed(2)
      : "0";

  const sellDialogDict = dict.portfolioSummary.sellDialog;
  const assetName = asset ? dict.assetNames[asset] || asset : "";

  const handleSellAttempt = () => {
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
    
    setIsConfirming(true);
  };
  
  const handleConfirmSell = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        toast({
        title: sellDialogDict.toastSuccessTitle,
        description: sellDialogDict.toastSuccessDescription.replace('{amount}', amountAsset).replace('{symbol}', asset || '').replace('{tl}', parseFloat(amountTl).toLocaleString('tr-TR')),
        });
        setIsLoading(false);
        setIsConfirming(false);
        setIsOpen(false);
    }, 1000);
  };

  const availableToSell = portfolioAssets.filter(pa => liveAssets[pa.assetSymbol]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="w-full hover:bg-red-500 hover:text-white dark:hover:bg-red-600">{sellDialogDict.shortTitle}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
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
            <Select 
              onValueChange={(value) => setAsset(value as AssetSymbol)}
              value={asset}
            >
              <SelectTrigger id="asset">
                <SelectValue placeholder={sellDialogDict.assetPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {availableToSell.map((pa) => (
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
              max={portfolioAsset?.amount}
            />
          </div>
          {assetDetails && amountAsset && (
            <div className="text-sm text-muted-foreground text-center">
              {sellDialogDict.approximate.replace('{tl}', parseFloat(amountTl).toLocaleString('tr-TR'))}
            </div>
          )}
        </div>
        <DialogFooter>
           <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
            <Button onClick={handleSellAttempt} variant="secondary" className="w-full hover:bg-red-500 hover:text-white dark:hover:bg-red-600">
                {sellDialogDict.sellButton}
            </Button>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>{sellDialogDict.confirm.title}</AlertDialogTitle>
                <AlertDialogDescription asChild>
                    <div className="space-y-2">
                        <div>{sellDialogDict.confirm.descriptionSell}</div>
                        <div className="p-4 bg-muted rounded-md text-muted-foreground">
                            <div className="flex justify-between"><span>{sellDialogDict.confirm.assetToSell}:</span> <span className="font-semibold text-foreground">{assetName}</span></div>
                            <div className="flex justify-between"><span>{sellDialogDict.confirm.amountToSell}:</span> <span className="font-semibold text-foreground">{amountAsset} {asset}</span></div>
                            <div className="flex justify-between"><span>{sellDialogDict.confirm.amountToReceive}:</span> <span className="font-semibold text-foreground">~{parseFloat(amountTl).toLocaleString('tr-TR')} TL</span></div>
                        </div>
                    </div>
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>{sellDialogDict.confirm.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmSell} disabled={isLoading} className="bg-destructive hover:bg-destructive/90">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {sellDialogDict.confirm.confirm}
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}