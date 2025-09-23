
import { Header } from "@/components/header";
import { PortfolioSummary } from "@/components/dashboard/portfolio-summary";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { AssetList } from "@/components/dashboard/asset-list";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { LivePrices } from "@/components/dashboard/live-prices";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDictionary } from "../dictionaries";
import { AssetDistribution } from "@/components/dashboard/asset-distribution";
import { TopPerformer } from "@/components/dashboard/top-performer";
import { WorstPerformer } from "@/components/dashboard/worst-performer";


export default async function Home({ params: { lang } }: { params: { lang: 'tr' | 'en' } }) {
  const dict = await getDictionary(lang);
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header lang={lang} dict={dict.header} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="w-full">
          <Suspense fallback={<Skeleton className="h-24" />}>
            <LivePrices dict={dict.livePrices} assetNames={dict.assetNames} />
          </Suspense>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2 xl:grid-cols-4">
          <Suspense fallback={<Skeleton className="h-48" />}>
            <PortfolioSummary dict={dict} />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-48" />}>
            <AssetDistribution dict={dict} />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-48" />}>
            <TopPerformer dict={dict} />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-48" />}>
            <WorstPerformer dict={dict} />
          </Suspense>
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
            <Suspense fallback={<Skeleton className="h-96" />}>
              <AssetList dict={dict} />
            </Suspense>
          </Card>
        </div>
      </main>
    </div>
  );
}
