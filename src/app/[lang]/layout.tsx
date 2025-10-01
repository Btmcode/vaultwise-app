import type { Metadata } from 'next';
import { getDictionary } from '@/app/dictionaries';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';

// Font is now loaded in the root layout (src/app/layout.tsx)
// to ensure consistency and include 'latin-ext' subset for all locales.

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
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
