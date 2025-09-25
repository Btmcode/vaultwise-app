
'use client';

import { usePreciousMetalsData } from '@/hooks/usePreciousMetalsData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { GoldIcon, SilverIcon, InfoIcon } from "@/components/icons";

export function PreciousMetalsTable() {
  const { data, loading, error, lastUpdated, refreshData } = usePreciousMetalsData();

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const getChangeBgColor = (change: number) => {
    if (change > 0) return 'border-green-500 bg-green-500/20';
    if (change < 0) return 'border-red-500 bg-red-500/20';
    return 'border-border';
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 3
    }).format(price);
  };
  
  const getIcon = (productName: string) => {
    if (productName.toLowerCase().includes('altın') || productName.toLowerCase().includes('ons') || productName.toLowerCase().includes('usd/kg') || productName.toLowerCase().includes('eur/kg')) {
        return <GoldIcon className="h-10 w-10 flex-shrink-0" />;
    }
    if (productName.toLowerCase().includes('güm')) {
        return <SilverIcon className="h-10 w-10 flex-shrink-0" />;
    }
    return <InfoIcon className="h-10 w-10 flex-shrink-0" />;
  }

  if (loading) {
    return (
        <div className="space-y-4">
             <div className="flex justify-end items-center">
                <Skeleton className="h-8 w-1/4" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-[88px] w-full" />
                ))}
            </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="space-y-4">
            <div className="flex justify-end items-center">
                 <Button size="sm" variant="outline" onClick={refreshData} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Yenile
                </Button>
            </div>
            <div className="text-red-500 p-4 rounded-md bg-red-50 border border-red-200">
                Hata: Veriler yüklenemedi. Lütfen daha sonra tekrar deneyin. ({error.message})
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-4">
        <div className="flex justify-end items-center">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Son Güncelleme: {lastUpdated}
              </div>
              <Button size="sm" variant="outline" onClick={refreshData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Yenile
              </Button>
            </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {data.map((item) => (
                <div key={item.Ürün} className="p-1">
                    <div className={cn(
                        "flex items-center justify-start gap-4 p-4 rounded-lg bg-card border h-full transition-colors duration-300",
                        getChangeBgColor(item.Değişim)
                    )}>
                        {getIcon(item.Ürün)}
                        <div className="flex-grow flex flex-col justify-center overflow-hidden">
                            <div className="flex items-center justify-between w-full">
                                <p className="font-semibold text-base whitespace-nowrap truncate">{item.Ürün}</p>
                                <div className={cn("text-xs font-medium pl-2", getChangeColor(item.Değişim))}>
                                    {item.Değişim >= 0 ? "+" : ""}
                                    {item.Değişim.toFixed(2)}%
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3">
                                <div className="flex-shrink-0 whitespace-nowrap">
                                    <span className="font-medium">Alış: </span>{formatPrice(item.Alış)}
                                </div>
                                <div className="flex-shrink-0 whitespace-nowrap">
                                    <span className="font-medium">Satış: </span>{formatPrice(item.Satış)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
