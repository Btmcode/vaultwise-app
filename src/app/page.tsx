
"use client";

import Link from 'next/link';
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
        <section className="w-full h-dvh flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full z-0">
            <video
              src="/videos/gold-drip.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            ></video>
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          
          <div className="container px-4 md:px-6 z-10 text-center">
            <div className="flex flex-col justify-center items-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white animate-fade-in-up">
                  Birikim Sanatı.
                </h1>
                <p className="max-w-[700px] text-gray-200 md:text-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  Değerli metallerin kalıcı güvenini ve dijital varlıkların dinamik potansiyelini, size özel tasarlanmış tek bir platformda birleştirin.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <Button size="lg" asChild>
                    <Link href="/tr/signup">Yolculuğa Başla</Link>
                  </Button>
                  <Button size="lg" variant="secondary" asChild>
                      <Link href="#features">Keşfet</Link>
                  </Button>
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
