import { Header } from "@/components/header";
import { PortfolioSummary } from "@/components/dashboard/portfolio-summary";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { AssetList } from "@/components/dashboard/asset-list";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Suspense fallback={<Skeleton className="h-48" />}>
            <PortfolioSummary />
          </Suspense>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <Suspense fallback={<Skeleton className="h-[350px]" />}>
              <PortfolioChart />
            </Suspense>
          </Card>
          <Card>
            <Suspense fallback={<Skeleton className="h-[350px]" />}>
              <RecentTransactions />
            </Suspense>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8">
          <Card>
            <Suspense fallback={<Skeleton className="h-96" />}>
              <AssetList />
            </Suspense>
          </Card>
        </div>
      </main>
    </div>
  );
}
