import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { FirebaseProvider } from '@/components/providers'; // Updated import
import { getDictionary } from './dictionaries';

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter', display: 'swap' });

// Default metadata is now just a fallback.
// The primary, language-specific metadata is generated in [lang]/layout.tsx
export const metadata: Metadata = {
  // This title and description are fallbacks.
  // The actual ones are generated dynamically in the [lang]/layout.tsx file.
  title: 'VaultWise',
  description: 'A modern multi-asset saving platform.',
  // Add canonical and alternate links for better SEO
  alternates: {
    canonical: 'https://vaultwise.app/tr', // Assuming 'tr' is the default language
    languages: {
      'en-US': 'https://vaultwise.app/en',
      'tr-TR': 'https://vaultwise.app/tr',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
      <body>
        <FirebaseProvider>{children}</FirebaseProvider>
      </body>
    </html>
  );
}
