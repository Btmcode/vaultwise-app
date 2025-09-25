
'use client';
import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePreciousMetalsData } from '@/hooks/usePreciousMetalsData';
import { getMarketAnalysis } from '@/app/actions';
import { Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export function AIMarketAnalysis({ lang }: { lang: 'tr' | 'en' }) {
  const { data, lastUpdated, error: dataError } = usePreciousMetalsData();
  const [analysis, setAnalysis] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const generateAnalysis = () => {
    startTransition(async () => {
      setAnalysis('');
      setAnalysisError(null);
      if (!data || data.length === 0) {
        setAnalysisError("Analiz edilecek piyasa verisi bulunamadı.");
        return;
      }

      try {
        const marketData = data.map(item =>
          `${item.Ürün}: Alış ${item.Alış} TL, Satış ${item.Satış} TL, Değişim %${item.Değişim}`
        ).join('\n');

        const result = await getMarketAnalysis({
          marketData,
          lastUpdated,
          language: lang,
        });

        if (result.analysis) {
          setAnalysis(result.analysis);
        } else {
          setAnalysisError("Yapay zeka bir analiz üretemedi. Lütfen tekrar deneyin.");
        }
      } catch (error) {
        console.error('AI analysis error:', error);
        setAnalysisError("Analiz oluşturulurken beklenmedik bir hata oluştu.");
      }
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Yapay Zeka Piyasa Analizi</CardTitle>
        <CardDescription>Piyasa verileri hakkında anlık bir değerlendirme alın.</CardDescription>
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
                    <AlertTitle>Hata</AlertTitle>
                    <AlertDescription>{analysisError}</AlertDescription>
                 </Alert>
            )}
            <Button
              onClick={generateAnalysis}
              disabled={isPending || data.length === 0 || !!dataError}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analiz Oluşturuluyor...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Analiz Oluştur
                </>
              )}
            </Button>
            {dataError && <p className="text-xs text-red-500 mt-2">Veri kaynağı hatası nedeniyle analiz yapılamıyor.</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
