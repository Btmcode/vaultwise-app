
"use client";

import Link from 'next/link';
import { VaultWiseLogo, GoldIcon, SilverIcon, BtcIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Cpu, Gem, Zap } from 'lucide-react';
import { PriceTicker } from '@/components/landing/price-ticker';

const features = [
  {
    icon: <Gem className="h-8 w-8 text-primary" />,
    title: "Değerli Metaller",
    description: "Altın ve gümüş gibi geleneksel ve güvenli limanlara kolayca yatırım yapın.",
  },
  {
    icon: <BtcIcon className="h-8 w-8" />,
    title: "Dijital Varlıklar",
    description: "Bitcoin ve altına endeksli tokenlar gibi dijital para birimleriyle portföyünüzü çeşitlendirin.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Güvenli Saklama",
    description: "Varlıklarınız, en üst düzey güvenlik standartlarına sahip dijital ve fiziki kasalarda korunur.",
  },
  {
    icon: <Cpu className="h-8 w-8 text-primary" />,
    title: "AI Destekli Analiz",
    description: "Yapay zeka destekli piyasa analizleri ve tasarruf önerileri ile akıllı yatırım kararları alın.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <VaultWiseLogo className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold">VaultWise</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link href="/tr/login">Giriş Yap</Link>
          </Button>
          <Button asChild>
            <Link href="/tr/signup">Kayıt Ol</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-background to-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Geleceğiniz İçin <span className="text-primary">Akıllıca</span> Biriktirin.
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  VaultWise, değerli metaller ve dijital varlıkları tek bir güvenli platformda birleştirerek birikim yapmanın en modern yolunu sunar.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/tr/signup">Hemen Başla</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                     <Link href="#features">Daha Fazla Bilgi</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                 <PriceTicker />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Temel Özellikler</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Yatırımın Geleceği, Bugün.</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  VaultWise, geleneksel güveni dijital inovasyonla birleştirerek size eşsiz bir birikim deneyimi sunar.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4 mt-12">
              {features.map((feature, index) => (
                <div key={index} className="grid gap-2 p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
                  {feature.icon}
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Asset Showcase Section */}
        <section className="w-full py-20 md:py-32 bg-secondary/30">
            <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
                <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Yatırım Yapabileceğiniz Varlıklar</h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Portföyünüzü değerli ve dijital varlıklarla kolayca çeşitlendirin.
                </p>
                </div>
                <div className="flex justify-center gap-8 md:gap-12 lg:gap-16 mt-6 flex-wrap">
                    <div className="flex flex-col items-center gap-2">
                        <GoldIcon className="h-16 w-16" />
                        <span className="font-semibold">Altın</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <SilverIcon className="h-16 w-16" />
                        <span className="font-semibold">Gümüş</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <BtcIcon className="h-16 w-16" />
                        <span className="font-semibold">Bitcoin</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Zap className="h-16 w-16 text-primary" />
                        <span className="font-semibold">ve Daha Fazlası</span>
                    </div>
                </div>
            </div>
        </section>


      </main>
      <footer className="bg-background border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <VaultWiseLogo className="h-6 w-6 text-primary" />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              &copy; 2024 VaultWise Inc. Tüm hakları saklıdır.
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
