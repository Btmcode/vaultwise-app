import type { Metadata } from 'next';
import { getDictionary } from '@/app/dictionaries';
import '../globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });


// This function is async and correctly awaits params
export async function generateMetadata({ params }: { params: { lang: 'tr' | 'en' } }): Promise<Metadata> {
  const dict = getDictionary(params.lang);
  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: 'tr' | 'en' };
}) {
  return (
     <html lang={params.lang} className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
       <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
            {children}
          <Toaster />
        </ThemeProvider>
    </body>
    </html>
  );
}
