
'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { VaultWiseLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { HeroScene } from '@/components/landing/hero-scene';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-16 flex items-center bg-transparent">
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
      
      <main className="flex-1 w-full h-full">
        <section className="relative w-full h-dvh">
            {/* 3D Scene Canvas */}
            <Suspense fallback={<div className="w-full h-full bg-background" />}>
                <HeroScene />
            </Suspense>

            {/* Overlay Content */}
            <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-4 bg-black/20">
                 <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none text-white animate-fade-in-up">
                  Gerçek Değer, Gerçek Güvence.
                </h1>
                <p className="max-w-[700px] text-gray-200 md:text-xl mt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  VaultWise, dijital varlıklarınızı dahi sigortalı, fiziksel kasalarda koruyan tek platform. Geleceğin birikim standardı ile tanışın.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center mt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <Button size="lg" asChild>
                    <Link href="/tr/signup">Biriktirmeye Başla</Link>
                  </Button>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
