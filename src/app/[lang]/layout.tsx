
import type { Metadata } from 'next';
import { getDictionary } from '@/app/dictionaries';
import '../globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { Providers } from '@/components/providers';


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
  return (
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
  );
}
