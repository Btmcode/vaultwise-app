
'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { getDictionary } from '@/app/dictionaries';
import { VaultWiseLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Languages, ShieldCheck, Cpu, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HeroScene = dynamic(() => import('@/components/landing/hero-scene'), {
  ssr: false,
});

export default function LandingPage() {
  const params = useParams();
  const lang = params.lang as 'tr' | 'en';
  const otherLang = lang === 'tr' ? 'en' : 'tr';
  const dict = getDictionary(lang);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  if (!dict) {
    return null; 
  }
  const landingDict = dict.landingPage;
  const featuresDict = landingDict.features.cards;

  const features = [
    {
      icon: ShieldCheck,
      title: featuresDict.security.title,
      description: featuresDict.security.description,
    },
    {
      icon: Cpu,
      title: featuresDict.ai.title,
      description: featuresDict.ai.description,
    },
    {
      icon: Zap,
      title: featuresDict.instant.title,
      description: featuresDict.instant.description,
    }
  ];

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground overflow-x-hidden">
      <HeroScene />
      
      <header className="sticky top-0 left-0 right-0 z-50 px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm">
        <Link href={`/${lang}`} className="flex items-center justify-center" prefetch={false}>
          <VaultWiseLogo className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold hidden sm:inline-block">VaultWise</span>
        </Link>
        <nav className="ml-auto flex items-center gap-2 sm:gap-4">
           <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
           <Button variant="ghost" size="icon" asChild>
            <Link href={`/${otherLang}`} prefetch={false}>
              <Languages />
              <span className="sr-only">Change language</span>
            </Link>
          </Button>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href={`/${lang}/login`}>{landingDict.login}</Link>
            </Button>
            <Button asChild>
              <Link href={`/${lang}/signup`}>{landingDict.signup}</Link>
            </Button>
          </div>
        </nav>
      </header>
      
      <main className="flex-1 flex flex-col z-10">

        <section className="flex-grow flex flex-col items-center justify-center text-center py-24 md:py-32">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter !leading-tight animate-fade-in-up">
              {landingDict.hero.title}
            </h1>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl mt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {landingDict.hero.description}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" asChild>
                 <Link href={`/${lang}/signup`}>{landingDict.hero.ctaPrimary}</Link>
              </Button>
               <Button size="lg" variant="outline" asChild>
                 <Link href="#features">{landingDict.hero.ctaSecondary}</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section id="features" className="py-16 md:py-24 bg-secondary/30 scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
                <p className="font-semibold text-primary">{landingDict.features.eyebrow}</p>
                <h2 className="text-4xl md:text-5xl font-bold mt-2">{landingDict.features.title}</h2>
                <p className="mt-4 text-muted-foreground md:text-lg">{landingDict.features.description}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mt-16">
                {features.map((feature, index) => (
                    <Card key={index} className="flex flex-col items-center text-center p-8 bg-background/80">
                        <div className="bg-primary/10 p-4 rounded-full">
                           <feature.icon className="h-8 w-8 text-primary" />
                        </div>
                        <CardHeader className="p-0 pt-6">
                            <CardTitle>{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 pt-2">
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="relative z-20 w-full py-6 bg-background/50 backdrop-blur-sm border-t md:mb-0 mb-16">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
             <p>&copy; {new Date().getFullYear()} VaultWise. {landingDict.footer.rights}</p>
             <div className="flex gap-4 mt-4 md:mt-0">
                <Link href={`/${lang}/investor-presentation`} className="hover:text-primary">{landingDict.footer.investors}</Link>
                <Link href="#" className="hover:text-primary">{landingDict.footer.terms}</Link>
                <Link href="#" className="hover:text-primary">{landingDict.footer.privacy}</Link>
             </div>
          </div>
      </footer>

      {/* Sticky Bottom Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm p-2 border-t border-border">
          <div className="flex justify-around items-center gap-2">
              <Button asChild variant="outline" className="w-full">
                  <Link href={`/${lang}/login`}>{landingDict.login}</Link>
              </Button>
              <Button asChild className="w-full">
                  <Link href={`/${lang}/signup`}>{landingDict.signup}</Link>
              </Button>
          </div>
      </div>

    </div>
  );
}
