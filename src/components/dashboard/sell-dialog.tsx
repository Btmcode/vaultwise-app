
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
import type { AssetSymbol, PortfolioAsset, LiveAssetData, FirestoreUser } from "@/lib/types";
import { Loader2 } from "lucide-react";


type SellDialogProps = {
  dict: any;
  preselectedAsset?: AssetSymbol;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};


export function SellDialog({ dict, preselectedAsset, isOpen, onOpenChange }: SellDialogProps) {
  const [asset, setAsset] = useState<AssetSymbol | undefined>(preselectedAsset);
  const [amountAsset, setAmountAsset] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [userProfile, setUserProfile] = useState<FirestoreUser | null>(null);
  const [liveAssets, setLiveAssets] = useState<LiveAssetData[]>([]);

  // Fetch necessary data on dialog open
  useEffect(() => {
    async function fetchData() {
        if (isOpen) {
            const [userRes, assetsRes] = await Promise.all([
                fetch('/api/user'),
                fetch('/api/prices/crypto', { cache: 'no-store' })
            ]);
            if (userRes.ok) {
                const userData = await userRes.json();
                setUserProfile(userData.user);
            }
            if (assetsRes.ok) {
                setLiveAssets(await assetsRes.json());
            }
        }
    }
    fetchData();
  }, [isOpen]);


  useEffect(() => {
    if (isOpen) {
        setAsset(preselectedAsset);
        setAmountAsset("");
        setIsConfirming(false);
        setIsLoading(false);
    }
  }, [isOpen, preselectedAsset]);
  
  const portfolioAssets = userProfile?.portfolio ?? [];
  const assetDetails = asset ? liveAssets.find(la => la.symbol === asset) : null;
  const portfolioAsset = asset ? portfolioAssets.find(pa => pa.assetSymbol === asset) : null;
  const usdTlRate = liveAssets.find(la => la.symbol === 'USD_TRY')?.sellPrice ?? 32.8;

  const numericAmountAsset = parseFloat(amountAsset.replace(/,/g, '.')) || 0;
  
  const amountTl = useMemo(() => {
    if (!assetDetails || !asset || numericAmountAsset <= 0) {
      return "0";
    }
    const priceInUSD = assetDetails.price ?? assetDetails.sellPrice ?? 1;

    // Check if the asset is already in TL
    if (asset.includes('TL') || asset === 'XAU') {
        return (numericAmountAsset * priceInUSD).toFixed(2);
    }
    
    // Convert USD/EUR assets to TL
    return (numericAmountAsset * priceInUSD * usdTlRate).toFixed(2);
  }, [assetDetails, numericAmountAsset, asset, usdTlRate]);


  const sellDialogDict = dict.portfolioSummary.sellDialog;
  const assetName = asset ? dict.assetNames[asset] || asset : "";
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '.').replace(/[^\d.]/g, '');
    setAmountAsset(rawValue);
  };

  const setAmountPercentage = (percentage: number) => {
    if (portfolioAsset) {
      const calculatedAmount = portfolioAsset.amount * (percentage / 100);
      setAmountAsset(calculatedAmount.toString());
    }
  };

  const handleSellAttempt = () => {
    if (!asset || numericAmountAsset <= 0) {
      toast({
        variant: "destructive",
        title: sellDialogDict.toastInvalidTitle,
        description: sellDialogDict.toastInvalidDescription,
      });
      return;
    }
    
    if (!portfolioAsset || numericAmountAsset > portfolioAsset.amount) {
      toast({
        variant: "destructive",
        title: sellDialogDict.toastInsufficientTitle,
        description: sellDialogDict.toastInsufficientDescription.replace('{amount}', portfolioAsset?.amount.toString() ?? '0').replace('{symbol}', asset),
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
        variant: "success",
        title: sellDialogDict.toastSuccessTitle,
        description: sellDialogDict.toastSuccessDescription.replace('{amount}', amountAsset).replace('{symbol}', asset || '').replace('{tl}', parseFloat(amountTl).toLocaleString('tr-TR')),
        });
        setIsLoading(false);
        setIsConfirming(false);
        onOpenChange(false);
    }, 1000);
  };

  const availableToSell = portfolioAssets.filter(pa => pa.amount > 0 && liveAssets.some(la => la.symbol === pa.assetSymbol));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
             <div className="flex justify-between items-center mb-1">
                <Label htmlFor="amount" className="text-sm font-medium">
                    {sellDialogDict.amountLabel}
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
              value={amountAsset}
              onChange={handleAmountChange}
              placeholder={sellDialogDict.amountPlaceholder}
            />
            {portfolioAsset && (
                <p className="text-xs text-muted-foreground mt-1">
                    {dict.assetList.table.balance}: {portfolioAsset.amount} {portfolioAsset.assetSymbol}
                </p>
            )}
          </div>
          {assetDetails && numericAmountAsset > 0 && (
            <div className="text-sm text-muted-foreground text-center">
              {sellDialogDict.approximate.replace('{tl}', parseFloat(amountTl).toLocaleString('tr-TR'))}
            </div>
          )}
        </div>
        <DialogFooter>
           <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
            <Button onClick={handleSellAttempt} variant="destructive" className="w-full" disabled={!asset || !amountAsset || numericAmountAsset <= 0}>
                {sellDialogDict.sellButton}
            </Button>
            <AlertDialogContent>
                <AlertDialogHeader>
                <DialogTitle>{sellDialogDict.confirm.title}</DialogTitle>
                <AlertDialogDescription asChild>
                    <div className="space-y-2">
                        <p>{sellDialogDict.confirm.descriptionSell}</p>
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

