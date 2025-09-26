
'use client';

import Link from 'next/link';
import { VaultWiseLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { PriceTicker } from '@/components/landing/price-ticker';

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
        <section className="relative w-full flex flex-col items-center justify-center text-center py-24 sm:py-32 lg:py-40 px-4">
          <div className="z-10 flex flex-col items-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none text-foreground">
              Gerçek Değer, Gerçek Güvence.
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl mt-6">
              VaultWise, dijital varlıklarınızı dahi sigortalı, fiziksel kasalarda koruyan tek platform. Geleceğin birikim standardı ile tanışın.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center mt-8">
              <Button size="lg" asChild>
                <Link href="/tr/signup">Biriktirmeye Başla</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Keşfet</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full h-20 flex items-center">
            <PriceTicker />
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Neden VaultWise?</div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Geleceğin Birikimi. Bugün.</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Platformumuz, en üst düzey güvenliği modern finansal araçlarla birleştirerek size varlıklarınız üzerinde tam kontrol ve iç rahatlığı sunar.
                    </p>
                </div>
                <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-3 lg:gap-12">
                    <div className="flex flex-col justify-center space-y-4 p-6 rounded-lg border bg-card hover:-translate-y-2 hover:shadow-xl transition-transform duration-300">
                        <h3 className="text-xl font-bold">Fiziksel Güvence</h3>
                        <p className="text-muted-foreground">
                            Tüm dijital ve değerli metal varlıklarınız, sigortalı ve denetlenen yüksek güvenlikli kasalarda fiziksel olarak korunur.
                        </p>
                    </div>
                     <div className="flex flex-col justify-center space-y-4 p-6 rounded-lg border bg-card hover:-translate-y-2 hover:shadow-xl transition-transform duration-300">
                        <h3 className="text-xl font-bold">Yapay Zeka Destekli Portföy</h3>
                        <p className="text-muted-foreground">
                            Akıllı algoritmalarımız, piyasa verilerini analiz ederek size özel birikim stratejileri ve fırsatlar sunar.
                        </p>
                    </div>
                     <div className="flex flex-col justify-center space-y-4 p-6 rounded-lg border bg-card hover:-translate-y-2 hover:shadow-xl transition-transform duration-300">
                        <h3 className="text-xl font-bold">Anında Alım-Satım</h3>
                        <p className="text-muted-foreground">
                           Varlıklarınızı 7/24 anında alın, satın veya dönüştürün. Piyasaya her zaman bir adım önde olun.
                        </p>
                    </div>
                </div>
            </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 VaultWise. Tüm hakları saklıdır.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Kullanım Koşulları
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Gizlilik Politikası
          </Link>
        </nav>
      </footer>
    </div>
  );
}
