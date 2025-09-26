
"use client";

import Link from 'next/link';
import { VaultWiseLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Cpu, Gem, Warehouse } from 'lucide-react';
import { PriceTicker } from '@/components/landing/price-ticker';

const features = [
  {
    icon: <Warehouse className="h-8 w-8 text-primary" />,
    title: "Fiziksel Güvence",
    description: "Tüm dijital ve metal varlıklarınız, sigortalı, yüksek güvenlikli fiziksel kasalarda korunur. Birikimleriniz sadece dijital değil, aynı zamanda gerçektir.",
  },
  {
    icon: <Cpu className="h-8 w-8 text-primary" />,
    title: "Yapay Zeka Destekli Stratejiler",
    description: "Piyasa verilerini analiz eden ve size özel birikim ve varlık önerileri sunan akıllı algoritmalarımızla birikimlerinizi optimize edin.",
  },
  {
    icon: <Gem className="h-8 w-8 text-primary" />,
    title: "Çoklu Varlık Portföyü",
    description: "Altın ve gümüş gibi geleneksel güvenli limanları, Bitcoin gibi dijital para birimleriyle tek bir portföyde kolayca birleştirin.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <VaultWiseLogo className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold">VaultWise</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link href="/tr/login">Giriş Yap</Link>
          </Button>
          <Button asChild>
            <Link href="/tr/signup">Hesap Oluştur</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full pt-24 pb-12 md:pt-32 md:pb-20 lg:pt-40 lg:pb-28 relative">
           <div className="container px-4 md:px-6 z-10 text-center">
            <div className="flex flex-col justify-center items-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground animate-fade-in-up">
                  Varlıklarınız. Hem Dijital. <br/> Hem Fiziksel Güvencede.
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  VaultWise ile dijital varlıkların potansiyelini, değerli metallerin sarsılmaz güveniyle birleştirin. Tüm birikimleriniz sigortalı ve fiziksel kasalarda korunur.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <Button size="lg" asChild>
                    <Link href="/tr/signup">Biriktirmeye Başla</Link>
                  </Button>
                  <Button size="lg" variant="secondary" asChild>
                      <Link href="#features">Keşfet</Link>
                  </Button>
                </div>
            </div>
          </div>
        </section>

        {/* Price Ticker Section */}
         <section className="w-full py-8 bg-background border-y">
             <PriceTicker />
         </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32 bg-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium">Neden VaultWise?</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Geleceğin Birikimi. Bugün.</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Finansal hedeflerinize ulaşmanız için tasarlanmış, teknoloji ve güvenin mükemmel birleşimi.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:grid-cols-3 md:gap-12">
              {features.map((feature, index) => (
                <div key={index} className="grid gap-4 p-6 rounded-xl border bg-card text-left transition-all duration-300 transform hover:-translate-y-2 hover:shadow-primary/10 hover:shadow-2xl">
                  <div className="bg-primary/10 p-3 rounded-full w-fit">{feature.icon}</div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-secondary/30 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <VaultWiseLogo className="h-6 w-6 text-primary" />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              &copy; 2025 VaultWise Inc. Tüm hakları saklıdır.
            </p>
          </div>
          <nav className="flex gap-4 sm:ml-auto sm:gap-6">
            <Link href="#" className="text-sm hover:underline underline-offset-4" prefetch={false}>
              Kullanım Koşulları
            </Link>
            <Link href="#" className="text-sm hover:underline underline-offset-4" prefetch={false}>
              Gizlilik Politikası
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
