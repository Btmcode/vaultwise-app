
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { VaultWiseLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Cpu, Gem } from 'lucide-react';
import { PriceTicker } from '@/components/landing/price-ticker';

const features = [
  {
    icon: <Gem className="h-8 w-8 text-primary" />,
    title: "Değerli Metaller & Dijital Varlıklar",
    description: "Altın ve gümüş gibi geleneksel güvenli limanları, Bitcoin gibi dijital para birimleriyle tek bir portföyde birleştirin.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Kurumsal Düzeyde Güvenlik",
    description: "Varlıklarınız, hem sigortalı fiziki kasalarda hem de en üst düzey şifreleme standartlarına sahip dijital cüzdanlarda korunur.",
  },
  {
    icon: <Cpu className="h-8 w-8 text-primary" />,
    title: "Yapay Zeka Destekli Stratejiler",
    description: "Piyasa verilerini analiz eden ve size özel tasarruf ve yatırım önerileri sunan akıllı algoritmalarımızla birikimlerinizi optimize edin.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm shadow-sm">
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
        <section className="w-full h-dvh flex items-center justify-center pt-24 pb-12 md:pt-32 relative">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background via-secondary/50 to-background z-0 opacity-50"></div>
           <div className="absolute inset-0 z-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle, hsl(var(--primary) / 0.1), transparent 60%)'}}></div>

          <div className="container px-4 md:px-6 z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-24 items-center">
               <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                    Birikim Sanatı.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Değerli metallerin kalıcı güvenini ve dijital varlıkların dinamik potansiyelini, size özel tasarlanmış tek bir platformda birleştirin.
                  </p>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
                    <Button size="lg" asChild>
                      <Link href="/tr/signup">Yolculuğa Başla</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="#features">Keşfet</Link>
                    </Button>
                  </div>
              </div>
              <div className="w-full max-w-md mx-auto lg:max-w-none">
                 <Image
                    src="https://picsum.photos/seed/finance-art/600/600"
                    width={600}
                    height={600}
                    alt="Abstract Art representing finance and technology"
                    data-ai-hint="abstract finance technology"
                    className="rounded-full aspect-square object-cover shadow-2xl shadow-primary/20 animate-in fade-in zoom-in-50 duration-1000"
                  />
              </div>
            </div>
          </div>
        </section>

        {/* Price Ticker Section */}
         <section className="w-full py-12 bg-secondary/30 border-y">
             <PriceTicker />
         </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium">Neden VaultWise?</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Geleceğin Portföyü. Bugün.</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Finansal hedeflerinize ulaşmanız için tasarlanmış, teknoloji ve güvenin mükemmel birleşimi.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:grid-cols-3 md:gap-12">
              {features.map((feature, index) => (
                <div key={index} className="grid gap-4 p-6 rounded-xl border bg-card hover:shadow-primary/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
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
