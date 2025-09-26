
"use client";

import Link from 'next/link';
import { VaultWiseLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <VaultWiseLogo className="h-6 w-6" />
          <span className="sr-only">VaultWise</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/tr/login" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Login
          </Link>
          <Link href="/tr/signup" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Sign Up
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full pt-12 md:pt-24 lg:pt-32 border-y">
          <div className="px-4 md:px-6 space-y-10 xl:space-y-16">
            <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
              <div>
                <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  Secure Your Future with Digital & Precious Assets
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
                  VaultWise offers a seamless and secure platform to invest in gold, silver, Bitcoin, and other digital assets. Start building your diversified portfolio today.
                </p>
                <div className="space-x-4 mt-6">
                  <Button asChild>
                    <Link href="/tr/signup">Get Started</Link>
                  </Button>
                  <Button variant="outline" asChild>
                     <Link href="#">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="flex flex-col items-start space-y-4">
                 <img
                  src="https://picsum.photos/seed/1/600/400"
                  width="550"
                  height="550"
                  alt="Hero"
                  data-ai-hint="digital finance"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 VaultWise. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
