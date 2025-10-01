
'use client';
import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMarketAnalysis } from '@/app/actions';
import { Loader2, Wand2, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import type { LiveAssetData } from '@/lib/types';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import type { MarketAnalysisOutput } from '@/ai/flows/market-analysis';
import { cn } from '@/lib/utils';

// Mock data to be used ONLY if the live API fails. This ensures the component always works.
const getMockPriceData = (): LiveAssetData[] => [
    { symbol: 'XAU', buyPrice: 2450.5, sellPrice: 2453.0, change24h: 1.2, displayOrder: 1 },
    { symbol: 'XAG', buyPrice: 80.5, sellPrice: 81.0, change24h: -0.5, displayOrder: 9 },
    { symbol: 'XAU_ONS', buyPrice: 2330.0, sellPrice: 2332.0, change24h: 0.8, displayOrder: 2 },
    { symbol: 'XAG_ONS', buyPrice: 28.0, sellPrice: 28.5, change24h: 2.1, displayOrder: 5 },
];


export function AIMarketAnalysis({ lang, dict, liveAssets }: { lang: 'tr' | 'en', dict: any, liveAssets: LiveAssetData[] }) {
  const [analysis, setAnalysis] = useState<MarketAnalysisOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showInitialMessage, setShowInitialMessage] = useState(true);

  const generateAnalysis = () => {
    if (isPending) return;

    setShowInitialMessage(false);
    startTransition(async () => {
      setAnalysis(null);
      setAnalysisError(null);
      
      // Use live assets if available, otherwise fallback to mock data
      const assetsForAnalysis = liveAssets.length > 0 ? liveAssets : getMockPriceData();
      
      const validAssets = assetsForAnalysis.filter(
        (item): item is LiveAssetData => item != null && ((item.buyPrice ?? 0) > 0) && typeof item.change24h === 'number'
      );

      if (validAssets.length === 0) {
        setAnalysisError(dict.noData);
        return;
      }
      
      if (liveAssets.length === 0) {
          console.warn("AI Market Analysis: Live price API failed, using mock data as fallback.");
      }

      try {
        const marketData = validAssets.map(item => {
            const price = item.buyPrice ?? 0;
            const change = item.change24h / 100;
            const yesterdayPrice = change !== -1 ? price / (1 + change) : price;
            const high24h = Math.max(price, yesterdayPrice);
            const low24h = Math.min(price, yesterdayPrice);
            
            return `${item.symbol}: Alış ${price.toFixed(2)}, Değişim %${item.change24h.toFixed(2)}, 24s En Yüksek ${high24h.toFixed(2)}/En Düşük ${low24h.toFixed(2)}`;
        }).join('\n');

        const result = await getMarketAnalysis({
          marketData,
          lastUpdated: new Date().toLocaleString(),
          language: lang,
        });

        if (result && result.analysis) {
          setAnalysis(result);
        } else {
          // Bu, Genkit akışından boş veya tanımsız bir sonuç geldiği anlamına gelir.
          throw new Error('AI analysis returned an empty result.');
        }
      } catch (error: any) {
        console.error('AI analysis error:', error);
        if (error.message && error.message.toLowerCase().includes('overloaded')) {
          setAnalysisError(dict.modelOverloaded);
        } else if (error.message.includes('deadline')) {
          setAnalysisError(dict.modelOverloaded); // Genellikle zaman aşımı da yoğunluktan olur
        }
        else {
          setAnalysisError(dict.general);
        }
      }
    });
  };

  const getSentimentStyling = (sentiment: MarketAnalysisOutput['sentiment']) => {
    switch (sentiment) {
        case 'Yükseliş':
            return {
                icon: <ArrowUp className="h-4 w-4 mr-1" />,
                className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-500/50"
            };
        case 'Düşüş':
            return {
                icon: <ArrowDown className="h-4 w-4 mr-1" />,
                className: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-500/50"
            };
        case 'Nötr':
        default:
            return {
                icon: <Minus className="h-4 w-4 mr-1" />,
                className: "bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300 border-gray-500/50"
            };
    }
  }


  const renderContent = () => {
    if (isPending) {
      return (
        <div className="w-full space-y-4 p-6">
            <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-7 w-28" />
                <Skeleton className="h-7 w-40" />
            </div>
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      );
    }
    
    if (analysis) {
      const sentimentStyling = getSentimentStyling(analysis.sentiment);
      return (
        <div className="w-full space-y-4 p-6">
          <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={cn("text-base", sentimentStyling.className)}>
                  {sentimentStyling.icon}
                  {analysis.sentiment}
              </Badge>
             <Badge variant="secondary" className="text-base">{dict.keyAsset}: {analysis.keyAsset}</Badge>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-full text-left pt-2">
            <p className="text-muted-foreground">{analysis.analysis}</p>
          </div>
        </div>
      );
    }

    if (analysisError) {
      return (
        <Alert variant="destructive" className="m-6">
          <AlertTitle>{dict.errorTitle}</AlertTitle>
          <AlertDescription>{analysisError}</AlertDescription>
        </Alert>
      );
    }
    
    if (showInitialMessage) {
        return (
            <div className="text-center text-muted-foreground p-6">
                <p>{dict.description}</p>
            </div>
        )
    }

    return null;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{dict.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow items-center justify-center p-0 min-h-[150px]">
        {renderContent()}
      </CardContent>
       <CardFooter className="pt-4 border-t">
         <Button onClick={generateAnalysis} disabled={isPending} className="w-full">
           {isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {dict.buttonLoadingText}</>
          ) : (
            <><Wand2 className="mr-2 h-4 w-4" />{analysis ? dict.regenerateButton : dict.buttonText}</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
