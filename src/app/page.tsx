
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { VaultWiseLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { PriceTicker } from '@/components/landing/price-ticker';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground overflow-x-hidden font-sans">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-8 h-20 flex items-center bg-transparent">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <VaultWiseLogo className="h-10 w-10 text-primary" />
          <span className="ml-3 text-2xl font-bold tracking-wider">VAULTWISE</span>
        </Link>
        <nav className="ml-auto flex items-center gap-2">
          <Button variant="ghost" className="text-lg" asChild>
            <Link href="/tr/login">Giriş Yap</Link>
          </Button>
          <Button className="text-lg rounded-full px-8 py-6" asChild>
            <Link href="/tr/signup">Hesap Oluştur</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-screen flex flex-col justify-center items-center text-center -mt-20">
          
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          </div>
          
          <div className="container px-4 md:px-6 z-10">
            <div className="flex flex-col justify-center items-center space-y-6">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight animate-fade-in-up">
                  Geleceğin Kasası.
                  <br/>
                  <span className="text-primary">Bugünün Birikimi.</span>
                </h1>
                <p className="max-w-[700px] text-muted-foreground text-lg md:text-xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  VaultWise, dijital varlıklarınızı dahi sigortalı ve fiziksel kasalarda korur. Finansal geleceğinizi, hem dijital hem de fiziksel dünyanın en güvenli standartlarıyla inşa edin.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                  <Button size="lg" className="rounded-full px-10 py-7 text-xl group" asChild>
                    <Link href="/tr/signup">
                      Yolculuğa Başla
                      <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
            </div>
          </div>
          
          {/* Price Ticker Section at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 w-full py-8">
             <PriceTicker />
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="w-full py-24 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-16 items-center">
              <div className="flex flex-col justify-center space-y-4 text-center">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Birikimin Evrimi.</h1>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed mx-auto">
                    Platformumuz, geleneksel güveni modern teknolojiyle birleştirerek size benzersiz bir varlık yönetimi deneyimi sunar.
                  </p>
                </div>
              </div>
              <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="flex flex-col p-8 bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <h3 className="text-2xl font-bold mb-2">Fiziksel & Dijital Güvence</h3>
                  <p className="text-muted-foreground">
                    Bitcoin'den altına, tüm varlıklarınızın fiziksel karşılıkları, denetlenen ve sigortalanan yüksek güvenlikli kasalarda korunur. Sadece bir dijital kayda değil, gerçek bir varlığa sahip olursunuz.
                  </p>
                </div>
                {/* Feature 2 */}
                <div className="flex flex-col p-8 bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <h3 className="text-2xl font-bold mb-2">Yapay Zeka Destekli Öngörüler</h3>
                  <p className="text-muted-foreground">
                    Piyasa trendlerini analiz eden akıllı algoritmalarımızla birikim stratejinizi optimize edin. Size özel fırsatları ve riskleri belirleyerek bilinçli kararlar almanızı sağlar.
                  </p>
                </div>
                {/* Feature 3 */}
                <div className="flex flex-col p-8 bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <h3 className="text-2xl font-bold mb-2">Bütünleşik Varlık Yönetimi</h3>
                  <p className="text-muted-foreground">
                    Geleneksel güvenli limanlar olan değerli metalleri, kripto paraların dinamik dünyasıyla tek bir, kullanımı kolay portföyde birleştirin. Çeşitlendirme hiç bu kadar kolay olmamıştı.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-6 py-12 md:flex-row">
          <div className="flex items-center gap-3">
            <VaultWiseLogo className="h-8 w-8 text-primary" />
            <p className="text-lg font-semibold text-muted-foreground">
              &copy; 2025 VaultWise Inc.
            </p>
          </div>
          <nav className="flex gap-6 text-lg text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors" prefetch={false}>
              Kullanım Koşulları
            </Link>
            <Link href="#" className="hover:text-primary transition-colors" prefetch={false}>
              Gizlilik Politikası
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
