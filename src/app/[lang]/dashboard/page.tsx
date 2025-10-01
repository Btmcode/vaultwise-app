
"use client";

import { useState, useEffect, Suspense, useCallback } from 'react';
import { getDictionary } from '@/app/dictionaries';
import { RefreshCw, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/header';
import { PortfolioSummary } from '@/components/dashboard/portfolio-summary';
import { AssetDistribution } from '@/components/dashboard/asset-distribution';
import { AIMarketAnalysis } from '@/components/dashboard/ai-market-analysis';
import { PortfolioChart } from '@/components/dashboard/portfolio-chart';
import { chartData } from '@/lib/data';
import RecentTransactions from '@/components/dashboard/recent-transactions-client';
import AutoSavePlans from '@/components/dashboard/auto-save-plans-client';
import AssetList from '@/components/dashboard/asset-list-client';
import { PreciousMetalsCards } from '@/components/dashboard/precious-metals-cards';
import type { LiveAssetData, FirestoreUser } from '@/lib/types';
import { useRouter, useParams } from 'next/navigation';


function DashboardSkeleton({ lang, dict }: { lang: 'tr' | 'en', dict: any }) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header lang={lang} dict={dict.header} />
            <main className="flex flex-1 flex-col gap-8 p-4 md:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">{dict.preciousMetalsCards.title}</h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                           <Loader2 className="h-4 w-4 animate-spin" />
                           <span>{dict.preciousMetalsCards.loading}</span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-52 w-full" />)}
                </div>
                <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-40 w-full" />
                </div>
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
                    <div className="grid gap-8 lg:col-span-2">
                        <Skeleton className="h-96 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                    <Skeleton className="lg:col-span-1 h-full min-h-[400px]" />
                </div>
            </main>
        </div>
    );
}

export default function DashboardPage() {
    const params = useParams();
    const lang = (params.lang || 'tr') as 'tr' | 'en';
    const dict = getDictionary(lang);
    const router = useRouter();

    const [userData, setUserData] = useState<FirestoreUser | null>(null);
    const [liveAssets, setLiveAssets] = useState<LiveAssetData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLiveAssets = useCallback(async () => {
        try {
            const assetsResponse = await fetch('/api/prices/crypto', { cache: 'no-store' });
            if (assetsResponse.ok) {
                const liveAssetsResult = await assetsResponse.json();
                setLiveAssets(liveAssetsResult);
            } else {
                console.error("Failed to fetch live assets");
            }
        } catch (error) {
             console.error("Error fetching live assets:", error);
        }
    }, []);


    useEffect(() => {
        async function fetchInitialData() {
            setLoading(true);
            try {
                // Fetch user data first to check for authentication
                const userResponse = await fetch('/api/user');
                if (!userResponse.ok) {
                    router.replace(`/${lang}/login`);
                    return;
                }
                const userDataResult = await userResponse.json();
                setUserData(userDataResult.user);

                // Fetch live assets for the first time
                await fetchLiveAssets();

            } catch (error) {
                console.error("Error fetching initial dashboard data:", error);
                router.replace(`/${lang}/login`);
            } finally {
                setLoading(false);
            }
        }

        fetchInitialData();
        
        // Set up an interval to fetch live assets every 30 seconds
        const intervalId = setInterval(fetchLiveAssets, 30000); // 30 seconds

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);

    }, [lang, router, fetchLiveAssets]);

    if (loading || !userData) {
        return <DashboardSkeleton lang={lang} dict={dict} />;
    }
    
    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header lang={lang} dict={dict.header} />
            <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
               <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                <div>
                  <h3 className="text-3xl font-bold tracking-tight">{dict.preciousMetalsCards.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    {dict.preciousMetalsCards.live}
                    <span className="text-muted-foreground/50 mx-1">•</span>
                    {dict.preciousMetalsCards.lastUpdatedText}
                    <RefreshCw className="h-3 w-3 ml-1 cursor-pointer" onClick={fetchLiveAssets} />
                  </div>
                </div>
              </div>
              
              <PreciousMetalsCards 
                dict={dict} 
                portfolioAssets={userData?.portfolio || []} 
                liveAssets={liveAssets}
              />

              <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-8">
                <PortfolioSummary dict={dict} userProfile={userData} portfolioAssets={userData?.portfolio || []} liveAssets={liveAssets} />
                <AssetDistribution dict={dict} portfolioAssets={userData?.portfolio || []} liveAssets={liveAssets} />
                <Card>
                  <RecentTransactions recentTransactionsDict={dict.recentTransactions} assetNames={dict.assetNames} transactions={userData?.transactions || []} />
                </Card>
                <AIMarketAnalysis lang={lang} dict={dict.aiMarketAnalysis} liveAssets={liveAssets} />
              </div>
              <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
                <div className="grid gap-8 lg:col-span-2">
                  <PortfolioChart dict={dict.portfolioChart} data={chartData} />
                  <Card>
                    <AutoSavePlans dict={dict.autoSavePlans} assetNames={dict.assetNames} />
                  </Card>
                </div>
                <Card className="lg:col-span-1 h-full overflow-y-auto">
                  <AssetList dict={dict} portfolioAssets={userData?.portfolio || []} liveAssets={liveAssets} />
                </Card>
              </div>
            </main>
        </div>
    );
}

