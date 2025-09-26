
'use client';

import { Header } from "@/components/header";
import { PortfolioSummary } from "@/components/dashboard/portfolio-summary";
import { AssetList } from "@/components/dashboard/asset-list";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { Suspense, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDictionary } from "../dictionaries";
import { AssetDistribution } from "@/components/dashboard/asset-distribution";
import { LivePrices } from "@/components/dashboard/live-prices";
import { LivePricesProvider } from "@/hooks/useLivePrices";
import { AIMarketAnalysis } from "@/components/dashboard/ai-market-analysis";
import { getUserDoc } from '@/lib/firebase/firestore';
import type { FirestoreUser } from "@/lib/types";

export const dynamic = 'force-dynamic';

export default function Home({ params: { lang } }: { params: { lang: 'tr' | 'en' } }) {
  const dict = getDictionary(lang);
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUserDoc();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);


  if (loading) {
     return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header lang={lang} dict={dict.header} />
            <main className="flex flex-1 items-center justify-center">
                <Skeleton className="h-full w-full" />
            </main>
        </div>
    )
  }
  
  if (!userData) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header lang={lang} dict={dict.header} />
            <main className="flex flex-1 items-center justify-center">
                <p>Could not load user data. Please try logging in again.</p>
            </main>
        </div>
    )
  }
  
  const { portfolio, transactions } = userData;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <LivePricesProvider>
        <Header lang={lang} dict={dict.header} />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="w-full">
                <Suspense fallback={<Skeleton className="h-48" />}>
                    <LivePrices dict={dict} portfolioAssets={portfolio} />
                </Suspense>
            </div>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                <Suspense fallback={<Skeleton className="h-48" />}>
                <PortfolioSummary dict={dict} portfolioAssets={portfolio} />
                </Suspense>
                <Suspense fallback={<Skeleton className="h-48" />}>
                <AssetDistribution dict={dict} portfolioAssets={portfolio} />
                </Suspense>
                <Suspense fallback={<Skeleton className="h-48" />}>
                    <AIMarketAnalysis lang={lang} dict={dict.aiMarketAnalysis} />
                </Suspense>
            </div>
            <div className="grid gap-4 md:gap-8">
                    <Card className="xl:col-span-2">
                    <Suspense fallback={<Skeleton className="h-[350px]" />}>
                        <CardHeader>
                            <CardTitle>{dict.portfolioChart.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[250px] w-full flex items-center justify-center text-muted-foreground">
                            {dict.portfolioChart.description}
                        </CardContent>
                    </Suspense>
                </Card>
            </div>
            <div className="grid gap-4 md:gap-8 grid-cols-1 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                <Suspense fallback={<Skeleton className="h-96" />}>
                    <AssetList dict={dict} portfolioAssets={portfolio} />
                </Suspense>
                </Card>
                    <Card>
                <Suspense fallback={<Skeleton className="h-[350px]" />}>
                    <RecentTransactions recentTransactionsDict={dict.recentTransactions} assetNames={dict.assetNames} transactions={transactions} />
                </Suspense>
                </Card>
            </div>
        </main>
      </LivePricesProvider>
    </div>
  );
}
