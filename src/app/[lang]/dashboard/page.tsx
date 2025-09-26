
'use client';
import { Suspense, useState, useEffect } from 'react';
import { getDictionary } from '@/app/dictionaries';
import { useParams } from 'next/navigation';

import type { FirestoreUser } from '@/lib/types';
import { getUserDoc } from '@/lib/firebase/firestore';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/header';
import { PortfolioSummary } from '@/components/dashboard/portfolio-summary';
import { AssetDistribution } from '@/components/dashboard/asset-distribution';
import { AIMarketAnalysis } from '@/components/dashboard/ai-market-analysis';
import { PortfolioChart } from '@/components/dashboard/portfolio-chart';
import { chartData } from '@/lib/data';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { AssetList } from '@/components/dashboard/asset-list';
import { LivePrices } from '@/components/dashboard/live-prices';

export default function DashboardPage() {
  const params = useParams();
  const lang = params.lang as 'tr' | 'en';
  const dict = getDictionary(lang);
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUserDoc();
        if (data) {
          setUserData(data);
        } else {
          setError(dict.portfolioChart.noData); // Or a more specific error
        }
      } catch (e: any) {
        console.error('Failed to fetch user data:', e);
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [dict.portfolioChart.noData]);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background">
        <Header lang={lang} dict={dict.header} />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Skeleton className="h-80" />
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
          </div>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <Skeleton className="h-80 xl:col-span-2" />
            <Skeleton className="h-80" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background">
        <Header lang={lang} dict={dict.header} />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-destructive">Could not load user data. Please try logging in again.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <>
      <Header lang={lang} dict={dict.header} />
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">{dict.livePrices.title}</h2>
          <LivePrices dict={dict} portfolioAssets={userData.portfolio} />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <PortfolioSummary dict={dict} portfolioAssets={userData.portfolio} />
          <AssetDistribution dict={dict} portfolioAssets={userData.portfolio} />
          <Card>
            <Suspense fallback={<Skeleton className="h-full w-full" />}>
              <RecentTransactions recentTransactionsDict={dict.recentTransactions} assetNames={dict.assetNames} transactions={userData.transactions} />
            </Suspense>
          </Card>
          <AIMarketAnalysis lang={lang} dict={dict.aiMarketAnalysis} />
        </div>
        
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          <PortfolioChart dict={dict.portfolioChart} data={chartData} />
          <Card>
            <AssetList dict={dict} portfolioAssets={userData.portfolio} />
          </Card>
        </div>
      </main>
    </>
  );
}
