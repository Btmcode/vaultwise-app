
'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { getDictionary } from '@/app/dictionaries';
import { VaultWiseLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { PriceTicker } from '@/components/landing/price-ticker';
import { ShieldCheck, Cpu, Zap } from 'lucide-react';

const HeroScene = dynamic(() => import('@/components/landing/hero-scene'), {
  ssr: false,
});

export default function LandingPage() {
  const params = useParams();
  const lang = params.lang as 'tr' | 'en';
  const dict = getDictionary(lang);
  const landingDict = dict.landingPage;

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground overflow-x-hidden">
      <HeroScene />
      <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-16 flex items-center bg-transparent backdrop-blur-sm">
        <Link href={`/${lang}`} className="flex items-center justify-center" prefetch={false}>
          <VaultWiseLogo className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold">VaultWise</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link href={`/${lang}/login`}>{landingDict.login}</Link>
          </Button>
          <Button asChild>
            <Link href={`/${lang}/signup`}>{landingDict.signup}</Link>
          </Button>
        </nav>
      </header>
      
      <main className="flex-1 flex flex-col justify-center">
        <section className="w-full pt-24 pb-12 md:pt-32 md:pb-16 lg:pt-40 lg:pb-20 text-center relative z-10">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none text-foreground">
              {landingDict.hero.title}
            </h1>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl mt-6">
              {landingDict.hero.description}
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center mt-8">
              <Button size="lg" asChild className="bg-cta text-white hover:bg-cta/90">
                <Link href={`/${lang}/signup`}>{landingDict.hero.ctaPrimary}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">{landingDict.hero.ctaSecondary}</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12">
            <PriceTicker />
        </section>

        <section id="features" className="w-full py-12 md:py-16 lg:py-20 bg-background/50 relative z-10">
            <div className="container mx-auto px-4 md:px-6">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">{landingDict.features.eyebrow}</div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{landingDict.features.title}</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        {landingDict.features.description}
                    </p>
                </div>
                <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:grid-cols-3">
                    <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card hover:shadow-xl transition-shadow duration-300">
                        <div className="p-3 rounded-full bg-primary/10 border border-primary/20 mb-4">
                           <ShieldCheck className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{landingDict.features.cards.security.title}</h3>
                        <p className="text-muted-foreground">
                            {landingDict.features.cards.security.description}
                        </p>
                    </div>
                     <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card hover:shadow-xl transition-shadow duration-300">
                        <div className="p-3 rounded-full bg-primary/10 border border-primary/20 mb-4">
                           <Cpu className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{landingDict.features.cards.ai.title}</h3>
                        <p className="text-muted-foreground">
                            {landingDict.features.cards.ai.description}
                        </p>
                    </div>
                     <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card hover:shadow-xl transition-shadow duration-300">
                        <div className="p-3 rounded-full bg-primary/10 border border-primary/20 mb-4">
                           <Zap className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{landingDict.features.cards.instant.title}</h3>
                        <p className="text-muted-foreground">
                            {landingDict.features.cards.instant.description}
                        </p>
                    </div>
                </div>
            </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t relative z-10 bg-background">
        <p className="text-xs text-muted-foreground">&copy; 2025 VaultWise. {landingDict.footer.rights}</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            {landingDict.footer.terms}
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            {landingDict.footer.privacy}
          </Link>
        </nav>
      </footer>
    </div>
  );
}
