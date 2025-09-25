
'use client';
import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMarketAnalysis } from '@/app/actions';
import { Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useLivePrices } from '@/hooks/useLivePrices';

export function AIMarketAnalysis({ lang, dict }: { lang: 'tr' | 'en', dict: any }) {
  const { liveAssets, lastUpdated, error: dataError } = useLivePrices();
  const [analysis, setAnalysis] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const generateAnalysis = () => {
    startTransition(async () => {
      setAnalysis('');
      setAnalysisError(null);
      const data = Object.values(liveAssets);
      if (!data || data.length === 0) {
        setAnalysisError(dict.noData);
        return;
      }

      try {
        const marketData = data.map(item => {
          const price = item.price ?? item.buyPrice;
          return `${item.symbol}: Fiyat ${price}, Değişim %${item.change24h}`
        }).join('\n');

        const result = await getMarketAnalysis({
          marketData,
          lastUpdated,
          language: lang,
        });

        if (result.analysis) {
          setAnalysis(result.analysis);
        } else {
          setAnalysisError(dict.generationFailed);
        }
      } catch (error) {
        console.error('AI analysis error:', error);
        setAnalysisError(dict.general);
      }
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{dict.title}</CardTitle>
        <CardDescription>{dict.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow justify-center">
        {analysis ? (
          <div className="prose prose-sm dark:prose-invert max-w-full">
            <p>{analysis}</p>
          </div>
        ) : (
          <div className="text-center">
            {analysisError && (
                 <Alert variant="destructive" className="mb-4">
                    <AlertTitle>{dict.errorTitle}</AlertTitle>
                    <AlertDescription>{analysisError}</AlertDescription>
                 </Alert>
            )}
            <Button
              onClick={generateAnalysis}
              disabled={isPending || Object.keys(liveAssets).length === 0 || !!dataError}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {dict.buttonLoadingText}
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  {dict.buttonText}
                </>
              )}
            </Button>
            {dataError && <p className="text-xs text-red-500 mt-2">{dict.dataSourceError}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
