
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import type { AssetSymbol, PortfolioAsset, FirestoreUser } from "@/lib/types";
import { useLivePrices } from "@/hooks/useLivePrices";
import { Loader2 } from "lucide-react";
import { getUserProfile } from "@/lib/firebase/firestore";


type BuyDialogProps = {
  dict: any;
  portfolioAssets: PortfolioAsset[];
  preselectedAsset?: AssetSymbol;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function BuyDialog({ dict, portfolioAssets, preselectedAsset, isOpen, onOpenChange }: BuyDialogProps) {
  const [asset, setAsset] = useState<AssetSymbol | undefined>(preselectedAsset);
  const [amountTl, setAmountTl] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<Omit<FirestoreUser, 'portfolio' | 'ibanAccounts' | 'transactions'> | null>(null);
  const { toast } = useToast();
  const { liveAssets } = useLivePrices();

  useEffect(() => {
    if (isOpen) {
      setAsset(preselectedAsset);
      setAmountTl("");
      setIsConfirming(false);
      setIsLoading(false);
      
      const fetchProfile = async () => {
          const profile = await getUserProfile();
          setUserProfile(profile);
      }
      fetchProfile();
    }
  }, [isOpen, preselectedAsset]);
  
  const assetDetails = asset ? liveAssets[asset] : null;
  const usdTlRate = liveAssets['USD_TRY']?.buyPrice ?? 32.8;
  const numericAmountTl = parseFloat(amountTl.replace(/\./g, '').replace(',', '.')) || 0;
  const availableBalance = userProfile?.availableBalanceTRY ?? 0;

  const amountAsset = useMemo(() => 
    (assetDetails && numericAmountTl > 0 && asset)
      ? (numericAmountTl / usdTlRate / (assetDetails.price ?? assetDetails.buyPrice ?? 1)).toFixed(6)
      : "0"
  , [assetDetails, numericAmountTl, asset, usdTlRate]);


  const buyDialogDict = dict.portfolioSummary.buyDialog;
  const assetName = asset ? dict.assetNames[asset] || asset : "";

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    if (rawValue) {
        const numericValue = parseInt(rawValue, 10);
        setAmountTl(numericValue.toLocaleString('tr-TR'));
    } else {
        setAmountTl('');
    }
  };
  
  const setAmountPercentage = (percentage: number) => {
    const calculatedAmount = availableBalance * (percentage / 100);
    setAmountTl(Math.floor(calculatedAmount).toLocaleString('tr-TR'));
  };

  const handleBuyAttempt = () => {
    if (!asset || !amountTl || numericAmountTl <= 0) {
      toast({
        variant: "destructive",
        title: buyDialogDict.toastInvalidTitle,
        description: buyDialogDict.toastInvalidDescription,
      });
      return;
    }
     if (numericAmountTl > availableBalance) {
      toast({
        variant: "destructive",
        title: buyDialogDict.toastInsufficientTitle,
        description: buyDialogDict.toastInsufficientDescription.replace('{balance}', availableBalance.toLocaleString('tr-TR')),
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
        onOpenChange(false);
    }, 1000);
  };

  const availableAssets = Object.keys(liveAssets)
    .filter(symbol => symbol !== 'USD_TRY' && symbol !== 'XAG_TL')
    .map(symbol => ({ symbol: symbol as AssetSymbol, name: dict.assetNames[symbol] || symbol }));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              disabled={!!preselectedAsset}
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
             <div className="flex justify-between items-center mb-1">
                <Label htmlFor="amount" className="text-sm font-medium">
                    {buyDialogDict.amountLabel}
                </Label>
                <div className="flex items-center gap-1.5">
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => setAmountPercentage(10)}>%10</Button>
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => setAmountPercentage(25)}>%25</Button>
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => setAmountPercentage(50)}>%50</Button>
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => setAmountPercentage(75)}>%75</Button>
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => setAmountPercentage(100)}>Max</Button>
                </div>
            </div>
            <Input
              id="amount"
              type="text"
              value={amountTl}
              onChange={handleAmountChange}
              placeholder={buyDialogDict.amountPlaceholder}
            />
            <p className="text-xs text-muted-foreground mt-1">
                {dict.withdrawPage.summary.availableBalance}: {availableBalance.toLocaleString('tr-TR')} TL
            </p>
          </div>
          {assetDetails && numericAmountTl > 0 && (
            <div className="text-sm text-muted-foreground text-center">
              {buyDialogDict.approximate.replace('{amount}', amountAsset).replace('{symbol}', asset || '')}
            </div>
          )}
        </div>
        <DialogFooter>
          <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
            <Button onClick={handleBuyAttempt} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
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
                            <div className="flex justify-between"><span>{buyDialogDict.confirm.paymentAmount}:</span> <span className="font-semibold text-foreground">{numericAmountTl.toLocaleString('tr-TR')} TL</span></div>
                            <div className="flex justify-between"><span>{buyDialogDict.confirm.amountToReceive}:</span> <span className="font-semibold text-foreground">~{amountAsset} {asset}</span></div>
                        </div>
                    </div>
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>{buyDialogDict.confirm.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmBuy} disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90">
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
