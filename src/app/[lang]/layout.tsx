import type { Metadata } from 'next';
import { getDictionary } from '@/app/dictionaries';
import '../globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

type LayoutProps = {
  params: { lang: 'tr' | 'en' };
  children: React.ReactNode;
};

// This function is async and correctly awaits params
export async function generateMetadata({ params }: { params: { lang: 'tr' | 'en' } }): Promise<Metadata> {
  const dict = getDictionary(params.lang);
  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
  };
}

// The RootLayout itself is also async
export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: 'tr' | 'en' };
}) {
  const dict = getDictionary(params.lang);
  return (
    <html lang={params.lang} suppressHydrationWarning>
      <head />
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
          </Providers>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
