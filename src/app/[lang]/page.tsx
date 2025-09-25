
import { Header } from "@/components/header";
import { PortfolioSummary } from "@/components/dashboard/portfolio-summary";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { AssetList } from "@/components/dashboard/asset-list";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDictionary } from "../dictionaries";
import { AssetDistribution } from "@/components/dashboard/asset-distribution";
import { AutoSavePlans } from "@/components/dashboard/auto-save-plans";
import { AIMarketAnalysis } from "@/components/dashboard/ai-market-analysis";
import { LivePrices } from "@/components/dashboard/live-prices";


export default async function Home({ params }: { params: { lang: 'tr' | 'en' } }) {
  const dict = getDictionary(params.lang);
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header lang={params.lang} dict={dict.header} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="w-full">
            <LivePrices assetNames={dict.assetNames} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2 xl:grid-cols-4">
          <Suspense fallback={<Skeleton className="h-48" />}>
            <PortfolioSummary dict={dict} />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-48" />}>
            <AssetDistribution dict={dict} />
          </Suspense>
           <div className="xl:col-span-2">
             <Suspense fallback={<Skeleton className="h-48" />}>
                <AIMarketAnalysis lang={params.lang} />
             </Suspense>
           </div>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <Suspense fallback={<Skeleton className="h-[350px]" />}>
              <PortfolioChart dict={dict.portfolioChart} />
            </Suspense>
          </Card>
          <Card>
            <Suspense fallback={<Skeleton className="h-[350px]" />}>
              <RecentTransactions dict={dict.recentTransactions} assetNames={dict.assetNames} />
            </Suspense>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8">
          <Card>
             <Suspense fallback={<Skeleton className="h-48" />}>
                <AutoSavePlans dict={dict} />
            </Suspense>
          </Card>
          <Card>
            <Suspense fallback={<Skeleton className="h-96" />}>
              <AssetList dict={dict} />
            </Suspense>
          </Card>
        </div>
      </main>
    </div>
  );
}

